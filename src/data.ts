import type { Nikke } from './types';
import characterMetadata from './data/character_metadata.json';

// Transform metadata into Nikke objects with placeholder fields where data is missing.

import characterIcons from './data/character_icons.json';

export const allNikkes: Nikke[] = Object.entries(characterMetadata).map(([code, meta]) => {
  const icons = (characterIcons as Record<string, any>)[meta.name] || {};
  return {
    id: code,
    name: meta.name,
    burstType: meta.burstType as any,
    classType: meta.class as any,
    element: meta.element as any,
    manufacturer: 'TODO',
    weaponType: meta.weaponType as any,
    imageUrl: meta.imageUrl,
    rarity: meta.rarity as any,
    elementIcon: icons.elementIcon,
    weaponIcon: icons.weaponIcon,
    burstIcon: icons.burstIcon,
    classIcon: icons.classIcon,
  };
});
