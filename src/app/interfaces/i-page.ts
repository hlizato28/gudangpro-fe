export interface IPage<T> {
  totalItems: number;
  numberOfElements: number;
  componentFilter: any;
  totalPages: number;
  sort: string;
  filterBy: string;
  value: string;
  content: T[];
}
