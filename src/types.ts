export type BurstType = '1' | '2' | '3' | 'P';
export type ClassType = 'Attacker' | 'Defender' | 'Supporter';
export type Element = 'Fire' | 'Water' | 'Wind' | 'Iron' | 'Electric';
export type Manufacturer =
  | 'ELYSION'
  | 'MISSILIS'
  | 'TETRA'
  | 'PILGRIM'
  | 'ABNORMAL';
export type WeaponType = 'AR' | 'SMG' | 'SG' | 'SR' | 'RL' | 'MG';
export type Rarity = 'SSR' | 'SR' | 'R';

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
  rarity: Rarity;
  elementIcon?: string;
  weaponIcon?: string;
  burstIcon?: string;
  classIcon?: string;
}
