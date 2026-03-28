

## Plan: Fix Tap to Identify Data Binding

### Problem (from real Supabase data)

The actual step data structure is:
```text
question: { target: { case: "lower", char: "a" } }   ← target is an OBJECT
choices:  [ { char: "a", case: "lower" }, { char: "b", case: "lower" }, ... ]
answer:   { char: "a", case: "lower" }
ui:       { instruction: "Tap the letter a", caption: "Find: a" }
```

Current code fails because:
1. `getInstructionText` does `String(raw.target)` → renders `[object Object]`
2. Options read from `data.options` which doesn't exist — should be `data.choices`
3. Choices have no `label` or `correct` fields — they're `{ char, case }` objects
4. Correctness must be determined by comparing each choice to `data.answer`

### Changes

**File 1: `src/lib/gameHelpers.ts`**

- `getInstructionText(data)`:
  - First check `data.ui?.instruction` (already human-readable in the DB)
  - Then handle `data.question?.target` where target can be `{ char }` or a string
  - Also check `data.target`, `data.instruction?.target`, `data.prompt?.target`
  - Extract the displayable value from object targets via `char`, `value`, or `label` keys
  - Infer type (letter vs number) from schema or the value itself

- `resolveOptionAsset(label)`:
  - Accept `string | any`; if object, extract `char`/`value`/`label` first
  - Then proceed with existing letter/number matching

- Add new helper `extractLabel(opt)` to normalize a choice object (`{ char }`, `{ value }`, `{ label }`, or plain string) into a display string

**File 2: `src/components/games/TapIdentifyGame.tsx`** (lines 22-27)

- Parse options from `data.choices || data.options || data.answers || []`
- Normalize each option using `extractLabel(opt)` for the label
- Determine `correct` by comparing each choice against `data.answer` (matching on `char` or `value` or string equality)
- Keep `image` extraction from `opt.image` if present

### Result
Tiles will render with real letter SVGs, instruction will read "Tap the letter a", and correctness will work by comparing against `data.answer`.

