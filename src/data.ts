import type { Nikke } from './types';
import characterMetadata from './data/character_metadata.json';

// Transform metadata into Nikke objects with placeholder fields where data is missing.
export const allNikkes: Nikke[] = Object.entries(characterMetadata).map(([code, meta]) => ({
  id: code,
  name: meta.name,
  burstType: 'TODO', // Placeholder - to be filled with real data
  classType: 'TODO', // Placeholder
  element: 'TODO', // Placeholder
  manufacturer: 'TODO', // Placeholder
  weaponType: 'TODO', // Placeholder
  imageUrl: meta.imageUrl,
  rarity: 'TODO', // Placeholder
}));
