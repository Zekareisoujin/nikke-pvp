import type {
  Nikke,
  BurstType,
  ClassType,
  Element,
  WeaponType,
  Rarity,
} from './types';
import characterMetadata from './data/character_metadata.json';
import iconMappings from './data/icon_mappings.json';

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

// Type for icon mappings
interface IconMappings {
  element: Record<Element, string>;
  weapon: Record<WeaponType, string>;
  burst: Record<BurstType, string>;
  class: Record<ClassType, string>;
}

const icons = iconMappings as IconMappings;

// Type guard functions to ensure values match our types
const isBurstType = (value: string): value is BurstType => {
  return ['1', '2', '3', 'P'].includes(value);
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

export const allNikkes: Nikke[] = Object.entries(
  characterMetadata as Record<string, CharacterMetadata>
)
  .reverse()
  .map(([code, meta]) => {
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

    // Derive icons from character attributes
    const element = isElement(meta.element) ? meta.element : 'Fire';
    const weaponType = isWeaponType(meta.weaponType) ? meta.weaponType : 'AR';
    const burstType = isBurstType(meta.burstType) ? meta.burstType : '1';
    const classType = isClassType(meta.class) ? meta.class : 'Attacker';

    return {
      id: code,
      name: meta.name,
      burstType,
      classType,
      element,
      manufacturer: 'TODO',
      weaponType,
      imageUrl: meta.imageUrl,
      rarity: isRarity(meta.rarity) ? meta.rarity : 'SSR',
      elementIcon: icons.element[element],
      weaponIcon: icons.weapon[weaponType],
      burstIcon: icons.burst[burstType],
      classIcon: icons.class[classType],
    };
  });
