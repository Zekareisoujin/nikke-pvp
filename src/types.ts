export type BurstType = 'I' | 'II' | 'III' | 'TODO';
export type ClassType = 'Attacker' | 'Defender' | 'Supporter' | 'TODO';
export type Element = 'Fire' | 'Water' | 'Wind' | 'Iron' | 'Electric' | 'TODO';
export type Manufacturer = 'Elysion' | 'Missilis' | 'Tetra' | 'Pilgrim' | 'Abnormal' | 'TODO';
export type WeaponType = 'AR' | 'SMG' | 'SG' | 'SR' | 'RL' | 'MG' | 'TODO';

export type CubeLevel = 'No' | 'level 1' | 'level 3' | 'level 7';

export interface Nikke {
  id: string;
  name: string;
  burstType: BurstType;
  classType: ClassType;
  element: Element;
  manufacturer: Manufacturer;
  weaponType: WeaponType;
  imageUrl: string;
  rarity: 'SSR' | 'SR' | 'R' | 'TODO';
  elementIcon?: string;
  weaponIcon?: string;
  burstIcon?: string;
  classIcon?: string;
}
