import { IBarang } from "../../interfaces/gs/i-barang";


export class Barang implements IBarang {
    idBarang: number = 0;
    kodeBarang: string = '';
    namaBarang: string = '';
    satuan: string = '';
    deskripsi: string = '';
    kategoriBarang: string = '';
    isActive: boolean = false;
}
