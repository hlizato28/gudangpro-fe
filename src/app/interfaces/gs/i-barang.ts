export interface IBarang {
    idBarang?: number;
    kodeBarang: string;
    namaBarang: string;
    satuan: string;
    deskripsi: string;
    kategoriBarang: string;
    isActive: boolean;
    selected?: boolean;
}
