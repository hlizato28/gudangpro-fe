import { IDetailPengajuanGudangCabang } from './i-detail-pengajuan-gudang-cabang'

export interface IPengajuanGudangCabang {
    idPengajuanGudangCabang?: number;
    user: string;
    unit?: string;
    details: IDetailPengajuanGudangCabang[];
    selected?: boolean;
    isApproved?: boolean;
}

