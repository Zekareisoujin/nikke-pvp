export type BurstType = 'I' | 'II' | 'III';
export type ClassType = 'Attacker' | 'Defender' | 'Supporter';
export type Element = 'Fire' | 'Water' | 'Wind' | 'Iron' | 'Electric';
export type Manufacturer = 'Elysion' | 'Missilis' | 'Tetra' | 'Pilgrim' | 'Abnormal';
export type WeaponType = 'AR' | 'SMG' | 'SG' | 'SR' | 'RL' | 'MG';

export interface Nikke {
  id: string;
  name: string;
  burstType: BurstType;
  classType: ClassType;
  element: Element;
  manufacturer: Manufacturer;
  weaponType: WeaponType;
  imageUrl: string;
  rarity: 'SSR' | 'SR' | 'R';
}
