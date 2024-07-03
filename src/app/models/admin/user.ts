import { IUser } from "../../interfaces/admin/user/i-user";

export class User implements IUser{
    idUser?: number = 0;
    userName: string = '';
    nama: string = '';
    role: string = '';
    cabang: string = '';
    jabatan: string = '';
    unit: string = '';
    isApproved: boolean  = false;;
    isActive: boolean = false;;
}
