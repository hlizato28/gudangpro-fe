import { IBarangCabang } from "../../interfaces/gs/i-barang-cabang";

export class BarangCabang implements IBarangCabang {
    idBarangCabang: number = 0;
    namaBarang: string = '';
    cabang: string = '';
    kategoriBarang: string = '';
    kodeBarang: string = '';
}
