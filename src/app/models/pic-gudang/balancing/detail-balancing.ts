import { IDetailBalancing } from "../../../interfaces/pic-gudang/balancing/i-detail-balancing";

export class DetailBalancing implements IDetailBalancing {
    idDetailBalancing?: number = 0;
    kodeBarang: string = '';
    namaBarang: string = '';
    satuan: string = '';
    stokAwal: number = 0;
    barangIn: number = 0;
    barangOut: number = 0;
    stokAkhir: number = 0;
}
