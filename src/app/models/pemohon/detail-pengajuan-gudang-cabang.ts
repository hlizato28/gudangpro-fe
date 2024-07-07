import { IDetailPengajuanGudangCabang } from "../../interfaces/pemohon/i-detail-pengajuan-gudang-cabang";

export class DetailPengajuanGudangCabang implements IDetailPengajuanGudangCabang{
    idDetailPengajuanGudangCabang?: number = 0;
    kodeBarang: string = '';
    namaBarang: string = '';
    satuan: string = '';
    stok: number = 0;
    jumlahApproved: number = 0;
    jumlahDiminta: number = 0;
    jumlahDiterima: number = 0;
    idBarangGudang: number = 0;
}
