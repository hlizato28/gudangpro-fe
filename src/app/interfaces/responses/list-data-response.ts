
export interface ListDataResponse<T> {
    content: T[];
    pageable: {
      // Properti-properti pageable
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
      // Properti-properti sort
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  }