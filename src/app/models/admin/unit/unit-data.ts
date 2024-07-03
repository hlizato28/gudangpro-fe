import { IUnitData } from "../../../interfaces/admin/unit/i-unit-data";

export class UnitData implements IUnitData{
    idUnit: number = 0;
    namaUnit: string = '';
    unitGroup: string = '';
    isActive: boolean = false;
}
