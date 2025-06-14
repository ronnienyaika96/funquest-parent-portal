
export const getLetterLabel = (letter: string) => {
  const examples: Record<string, string> = {
    a: '🍎 Apple', b: '🐝 Bee', c: '🐱 Cat', d: '🐶 Dog', e: '🥚 Egg',
    f: '🐸 Frog', g: '🦒 Giraffe', h: '🏠 House', i: '🍦 Ice Cream',
    j: '🤹‍♂️ Juggle', k: '🦘 Kangaroo', l: '🦁 Lion', m: '🌝 Moon',
    n: '🐧 Nest', o: '🐙 Octopus', p: '🦜 Parrot', q: '👑 Queen',
    r: '🤖 Robot', s: '🌟 Star', t: '🌳 Tree', u: '☔ Umbrella',
    v: '🎻 Violin', w: '🐋 Whale', x: '❌ X-ray', y: '🛶 Yacht', z: '🦓 Zebra'
  };
  return examples[letter] || '';
};
