import { IPage } from './i-page';

export interface IMeta {
  success: boolean;
  message: string;
  status: number;
  timestamp: number;
}

export interface IResponseList<T> extends IMeta {
  data: IPage<T>;
}

export interface IResponseDetail<T> extends IMeta {
  data: T;
}
