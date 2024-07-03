export interface GenericDataResponse<T> {
  data: T;
  success: boolean;
  message: string;
  status: number;
  timestamp: number;
}
