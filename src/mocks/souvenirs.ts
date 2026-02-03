import { Rarity, PNJClass } from '../theme/types';

export interface MockSouvenir {
  id: string;
  pnjName: string;
  pnjClass: PNJClass;
  activity: string;
  date: string;
  rarity: Rarity;
  xpEarned: number;
}

/** Empty for now -- shows empty state in collection screen */
export const MOCK_SOUVENIRS: MockSouvenir[] = [];
