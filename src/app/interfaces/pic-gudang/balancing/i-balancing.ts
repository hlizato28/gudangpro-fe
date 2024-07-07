import { IDetailBalancing } from './i-detail-balancing'

export interface IBalancing {
    idBalancing?: number;
    createdAt?: Date;
    details: IDetailBalancing[];
    kategori?: string;
    selected?: boolean;
}
