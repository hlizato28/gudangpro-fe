import { IBalancing } from "../../../interfaces/pic-gudang/balancing/i-balancing";
import { IDetailBalancing } from "../../../interfaces/pic-gudang/balancing/i-detail-balancing";

export class Balancing implements IBalancing{
    idBalancing?: number = 0;
    createdAt: Date | null = null;
    details: IDetailBalancing[] = [];
    kategori: string = '';
}
