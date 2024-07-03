import { IReportBalancing } from "../../../interfaces/pic-gudang/balancing/i-report-balancing";

export class ReportBalancing implements IReportBalancing{
    idDetailBalancing: number = 0;
    kodeBarang: string ='';
    namaBarang: string ='';
    stokAwal: number = 0;
    stokAhkhir: number = 0;
    barangIn: number = 0;
    barangOut: number = 0;
    opr: number = 0;
    uc: number = 0;
    nc: number= 0;
    kkb: number = 0;
    ds: number = 0;
    asr: number = 0;
}
