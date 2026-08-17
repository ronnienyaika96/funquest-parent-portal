import { bookPagePath, uploadBookFile } from '@/lib/bookStorage';

export interface ProcessedPage {
  page_number: number;
  image_path: string;
  extracted_text: string;
  needs_ocr: boolean;
}

export interface ProcessResult {
  pageCount: number;
  pages: ProcessedPage[];
  coverBlob: Blob | null;
}

type ProgressFn = (info: { stage: string; current: number; total: number }) => void;

const MIN_TEXT_CHARS = 12;

async function loadPdfJs() {
  const pdfjs: any = await import('pdfjs-dist');
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  return pdfjs;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not render page image'))), 'image/png', 0.92),
  );
}

async function ocrBlob(blob: Blob): Promise<string> {
  try {
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('eng');
    const { data } = await worker.recognize(blob);
    await worker.terminate();
    return (data.text || '').replace(/\s+/g, ' ').trim();
  } catch (err) {
    console.error('[pdfProcessing] OCR failed', err);
    return '';
  }
}

/**
 * Client-side PDF pipeline: page count -> page images -> text extraction -> OCR fallback.
 * Never assumes a fixed page count or that pages contain selectable text.
 */
export async function processPdf(
  file: File,
  bookId: string,
  onProgress?: ProgressFn,
  opts: { ocr?: boolean } = { ocr: true },
): Promise<ProcessResult> {
  const pdfjs = await loadPdfJs();
  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  const total = doc.numPages;
  if (!total) throw new Error('This PDF has no pages.');

  const pages: ProcessedPage[] = [];
  let coverBlob: Blob | null = null;

  for (let n = 1; n <= total; n++) {
    onProgress?.({ stage: `Rendering page ${n}`, current: n, total });
    const page = await doc.getPage(n);
    const viewport = page.getViewport({ scale: 1.6 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available in this browser.');
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob = await canvasToBlob(canvas);
    if (n === 1) coverBlob = blob;

    // Text layer
    let text = '';
    try {
      const content = await page.getTextContent();
      text = content.items
        .map((i: any) => (typeof i.str === 'string' ? i.str : ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    } catch (err) {
      console.warn('[pdfProcessing] text layer failed on page', n, err);
    }

    let needsOcr = text.length < MIN_TEXT_CHARS;
    if (needsOcr && opts.ocr !== false) {
      onProgress?.({ stage: `Reading page ${n} with OCR`, current: n, total });
      const ocrText = await ocrBlob(blob);
      if (ocrText.length >= MIN_TEXT_CHARS) {
        text = ocrText;
        needsOcr = false;
      }
    }

    onProgress?.({ stage: `Uploading page ${n}`, current: n, total });
    const path = bookPagePath(bookId, n);
    await uploadBookFile(path, blob, 'image/png');

    pages.push({ page_number: n, image_path: path, extracted_text: text, needs_ocr: needsOcr });
  }

  return { pageCount: total, pages, coverBlob };
}
