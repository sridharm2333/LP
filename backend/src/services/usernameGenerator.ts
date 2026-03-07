const ADJECTIVES = [
  'Quiet', 'Calm', 'Gentle', 'Soft', 'Still', 'Warm', 'Kind', 'Brave',
  'Tender', 'Honest', 'Patient', 'Hopeful', 'Healing', 'Peaceful', 'Cozy',
  'Misty', 'Cloudy', 'Frosty', 'Snowy', 'Rainy', 'Sunny', 'Stormy', 'Breezy',
  'Wandering', 'Drifting', 'Searching', 'Growing', 'Rising', 'Glowing',
];

const NOUNS = [
  'Penguin', 'Wave', 'Star', 'Cloud', 'Moon', 'River', 'Stone', 'Feather',
  'Lantern', 'Ember', 'Pebble', 'Willow', 'Birch', 'Cedar', 'Maple',
  'Harbor', 'Tide', 'Frost', 'Mist', 'Shore', 'Forest', 'Meadow', 'Canyon',
  'Candle', 'Compass', 'Anchor', 'Beacon', 'Garden', 'Bridge', 'Path',
];

export function generateUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${adj}${noun}${num}`;
}
