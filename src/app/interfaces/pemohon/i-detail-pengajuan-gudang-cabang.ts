export interface IDetailPengajuanGudangCabang {
    idDetailPengajuanGudangCabang?: number;
    kodeBarang: string;
    namaBarang: string;
    satuan: string;
    stok: number;
    jumlahDiminta: number;
    jumlahApproved: number;
    jumlahDiterima: number;
    idBarangGudang: number;
    selected?: boolean;
}
