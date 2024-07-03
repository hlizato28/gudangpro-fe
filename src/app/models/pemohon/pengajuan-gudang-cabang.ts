import { IDetailPengajuanGudangCabang } from "../../interfaces/pemohon/i-detail-pengajuan-gudang-cabang";
import { IPengajuanGudangCabang } from "../../interfaces/pemohon/i-pengajuan-gudang-cabang";

export class PengajuanGudangCabang implements IPengajuanGudangCabang {
    idPengajuanGudangCabang?: number = 0;
    user: string = '';
    details: IDetailPengajuanGudangCabang[] = [];
}
