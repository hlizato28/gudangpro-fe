export interface IUser {
    idUser?: number;
    userName: string;
    nama: string;
    role: string;
    cabang: string;
    jabatan: string;
    unit: string;
    isApproved: boolean;
    isActive: boolean;
    selected?: boolean;
}
