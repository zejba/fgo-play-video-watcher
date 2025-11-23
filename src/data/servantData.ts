import servantData from './servant_data';

export const servantDataMap = Object.fromEntries(servantData.map((servant) => [servant.collectionNo, servant]));
