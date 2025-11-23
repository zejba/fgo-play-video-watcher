import type { CardColor, ServantAttribute, ServantClass } from './types';

export const servantClasses: { value: ServantClass; label: string }[] = [
  { value: 'saber', label: '剣' },
  { value: 'archer', label: '弓' },
  { value: 'lancer', label: '槍' },
  { value: 'rider', label: '騎' },
  { value: 'caster', label: '術' },
  { value: 'assassin', label: '殺' },
  { value: 'berserker', label: '狂' },
  { value: 'ruler', label: '裁' },
  { value: 'avenger', label: '讐' },
  { value: 'alterEgo', label: '分' },
  { value: 'moonCancer', label: '月' },
  { value: 'pretender', label: '詐' },
  { value: 'foreigner', label: '降' },
  { value: 'shielder', label: '盾' },
  { value: 'beast', label: '獣' }
];

export const servantRarities: { value: string; label: string }[] = [
  { value: '0', label: '★0' },
  { value: '1', label: '★1' },
  { value: '2', label: '★2' },
  { value: '3', label: '★3' },
  { value: '4', label: '★4' },
  { value: '5', label: '★5' }
];

export const servantAttributes: { value: ServantAttribute; label: string }[] = [
  { value: 'sky', label: '天' },
  { value: 'earth', label: '地' },
  { value: 'human', label: '人' },
  { value: 'star', label: '星' },
  { value: 'beast', label: '獣' }
];

export const cardColors: { value: CardColor; label: string }[] = [
  { value: 'buster', label: 'B' },
  { value: 'arts', label: 'A' },
  { value: 'quick', label: 'Q' }
];

export const cardInitial = {
  buster: 'B',
  arts: 'A',
  quick: 'Q'
} as const;

export const localizedServantClass = {
  saber: 'セイバー',
  archer: 'アーチャー',
  lancer: 'ランサー',
  rider: 'ライダー',
  caster: 'キャスター',
  assassin: 'アサシン',
  berserker: 'バーサーカー',
  ruler: 'ルーラー',
  avenger: 'アヴェンジャー',
  alterEgo: 'アルターエゴ',
  moonCancer: 'ムーンキャンサー',
  pretender: 'プリテンダー',
  foreigner: 'フォーリナー',
  shielder: 'シールダー',
  beast: 'ビースト'
} as const;
