import { IReport } from "../../../interfaces/pic-gudang/balancing/i-report";
import { IReportBalancing } from "../../../interfaces/pic-gudang/balancing/i-report-balancing";

export class Report implements IReport {
    idReport?: number = 0;
    details: IReportBalancing[] = [];
}
