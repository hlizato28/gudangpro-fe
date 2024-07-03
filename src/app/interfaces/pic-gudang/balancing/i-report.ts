import { IReportBalancing } from './i-report-balancing'

export interface IReport {
    idReport?: number;
    details: IReportBalancing[];
}
