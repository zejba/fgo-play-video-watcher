import { ServantAttribute, ServantClass, CardColor } from './types';

export interface ServantParam {
  id: string;
  aaId: number;
  collectionNo: number;
  anotherVersionName?: string;
  name: string;
  rarity: number;
  className: ServantClass;
  attribute: ServantAttribute;
  noblePhantasm: {
    card: CardColor;
    value: number;
  };
}

declare const servantData: ServantParam[];
export default servantData;
