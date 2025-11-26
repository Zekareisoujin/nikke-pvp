import type {
  Nikke,
  BurstType,
  ClassType,
  Element,
  WeaponType,
  Rarity,
} from './types';
import characterMetadata from './data/character_metadata_2.json';
import characterPortraits from './data/character_portraits.json';
import iconMappings from './data/icon_mappings.json';

// Type for the new metadata JSON structure
interface CharacterMetadata {
  id: number;
  resource_id: number;
  order: number;
  original_rare: string;
  class: string;
  use_burst_skill: string;
  name_code: number;
  grade_core_id: number;
  corporation: string;
  is_visible: boolean;
  name_localkey: {
    name: string;
  };
  element_id: {
    element: {
      id: number;
      element: string;
      group_id: number;
      weak_element_id: number;
      element_name_localekey: string;
      element_code_name_localekey: string;
      element_desc_localekey: string;
      element_icon: string;
    };
  };
  shot_id: {
    element: {
      ammo: number;
      weapon_type: string;
      attack_type: string;
    };
  };
  costumes: Array<{
    id: number;
    costume_index: number;
  }>;
}

// Type for icon mappings
interface IconMappings {
  element: Record<Element, string>;
  weapon: Record<WeaponType, string>;
  burst: Record<BurstType, string>;
  class: Record<ClassType, string>;
}

const icons = iconMappings as IconMappings;
const portraits = characterPortraits as Record<string, string>;

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

// Map use_burst_skill to burst type
const mapBurstSkill = (useBurstSkill: string): BurstType => {
  switch (useBurstSkill) {
    case 'Step1':
      return '1';
    case 'Step2':
      return '2';
    case 'Step3':
      return '3';
    case 'AllStep':
      return 'P';
    default:
      console.warn(`Unknown burst skill: ${useBurstSkill}`);
      return '1';
  }
};

export const allNikkes: Nikke[] = (characterMetadata as CharacterMetadata[])
  .filter((meta) => meta.is_visible)
  .map((meta) => {
    const name = meta.name_localkey.name;
    const element = meta.element_id.element.element;
    const weaponType = meta.shot_id.element.weapon_type;
    const burstType = mapBurstSkill(meta.use_burst_skill);
    const classType = meta.class;
    const rarity = meta.original_rare;
    const manufacturer = meta.corporation;
    const nameCode = meta.name_code.toString();

    // Validate data
    if (!isElement(element)) {
      console.warn(`Invalid element for ${name}: ${element}`);
    }
    if (!isWeaponType(weaponType)) {
      console.warn(`Invalid weaponType for ${name}: ${weaponType}`);
    }
    if (!isClassType(classType)) {
      console.warn(`Invalid classType for ${name}: ${classType}`);
    }
    if (!isRarity(rarity)) {
      console.warn(`Invalid rarity for ${name}: ${rarity}`);
    }

    // Use validated or fallback values
    const validElement = isElement(element) ? element : 'Fire';
    const validWeaponType = isWeaponType(weaponType) ? weaponType : 'AR';
    const validClassType = isClassType(classType) ? classType : 'Attacker';
    const validRarity = isRarity(rarity) ? rarity : 'SSR';

    return {
      id: meta.id.toString(),
      name,
      burstType,
      classType: validClassType,
      element: validElement,
      manufacturer: manufacturer as any, // Corporation names match manufacturer type
      weaponType: validWeaponType,
      imageUrl: portraits[nameCode] || '',
      rarity: validRarity,
      elementIcon: icons.element[validElement],
      weaponIcon: icons.weapon[validWeaponType],
      burstIcon: icons.burst[burstType],
      classIcon: icons.class[validClassType],
    };
  });
