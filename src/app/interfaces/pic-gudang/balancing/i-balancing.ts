import { IDetailBalancing } from './i-detail-balancing'

export interface IBalancing {
    idBalancing?: number;
    createdAt?: Date | null;
    details: IDetailBalancing[];
    selected?: boolean;
}
