import type { Nikke, BurstType, ClassType, Element, WeaponType, Rarity } from './types';
import characterMetadata from './data/character_metadata.json';

// Transform metadata into Nikke objects with placeholder fields where data is missing.

import characterIcons from './data/character_icons.json';

// Type for the metadata JSON structure
interface CharacterMetadata {
  name: string;
  imageUrl: string;
  element: string;
  weaponType: string;
  burstType: string;
  class: string;
  rarity: string;
}

// Type guard functions to ensure values match our types
const isBurstType = (value: string): value is BurstType => {
  return ['1', '2', '3'].includes(value);
};

const isClassType = (value: string): value is ClassType => {
  return ['Attacker', 'Defender', 'Supporter'].includes(value);
};

const isElement = (value: string): value is Element => {
  return ['Fire', 'Water', 'Wind', 'Iron', 'Electric'].includes(value);
};

const isWeaponType = (value: string): value is WeaponType => {
  return ['AR', 'SMG', 'SG', 'SR', 'RL', 'MG'].includes(value);
};

const isRarity = (value: string): value is Rarity => {
  return ['SSR', 'SR', 'R'].includes(value);
};

export const allNikkes: Nikke[] = Object.entries(characterMetadata as Record<string, CharacterMetadata>).map(([code, meta]) => {
  const icons = (characterIcons as Record<string, any>)[meta.name] || {};
  
  // Validate and throw errors for invalid data
  if (!isBurstType(meta.burstType)) {
    console.warn(`Invalid burstType for ${meta.name}: ${meta.burstType}`);
  }
  if (!isClassType(meta.class)) {
    console.warn(`Invalid classType for ${meta.name}: ${meta.class}`);
  }
  if (!isElement(meta.element)) {
    console.warn(`Invalid element for ${meta.name}: ${meta.element}`);
  }
  if (!isWeaponType(meta.weaponType)) {
    console.warn(`Invalid weaponType for ${meta.name}: ${meta.weaponType}`);
  }
  if (!isRarity(meta.rarity)) {
    console.warn(`Invalid rarity for ${meta.name}: ${meta.rarity}`);
  }
  
  return {
    id: code,
    name: meta.name,
    burstType: isBurstType(meta.burstType) ? meta.burstType : '1',
    classType: isClassType(meta.class) ? meta.class : 'Attacker',
    element: isElement(meta.element) ? meta.element : 'Fire',
    manufacturer: 'TODO',
    weaponType: isWeaponType(meta.weaponType) ? meta.weaponType : 'AR',
    imageUrl: meta.imageUrl,
    rarity: isRarity(meta.rarity) ? meta.rarity : 'SSR',
    elementIcon: icons.elementIcon,
    weaponIcon: icons.weaponIcon,
    burstIcon: icons.burstIcon,
    classIcon: icons.classIcon,
  };
});
