import { IBarangGudang } from "../../interfaces/pic-gudang/i-barang-gudang";

export class BarangGudang implements IBarangGudang {
    idBarangGudang?: number = 0;
    kodeBarang: string = '';
    namaBarang: string = '';
    satuan: string = '';
    jumlah: number = 0;
    kategori: string = '';
}
