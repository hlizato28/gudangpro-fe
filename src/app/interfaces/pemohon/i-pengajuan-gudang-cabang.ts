import { IDetailPengajuanGudangCabang } from './i-detail-pengajuan-gudang-cabang'

export interface IPengajuanGudangCabang {
    idPengajuanGudangCabang?: number;
    user: string;
    details: IDetailPengajuanGudangCabang[];
    selected?: boolean;
}

