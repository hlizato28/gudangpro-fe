export interface IDetailBalancing {
    idDetailBalancing?: number;
    kodeBarang: string;
    namaBarang: string;
    satuan: string;
    stokAwal: number;
    barangIn: number;
    barangOut: number;
    stokAkhir: number;
    idBarangGudang: number;
    selected?: boolean;
    isApproved?: boolean;
}
