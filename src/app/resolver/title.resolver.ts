import { ResolveFn } from '@angular/router';
import { map, of } from 'rxjs';

export const titleResolver: ResolveFn<string> = (route, state) => {
  const parentTitle = route.parent?.data['title'] || '';
  const currentTitle = route.data['title'] || '';
  return of(`${parentTitle} / ${currentTitle}`).pipe(
    map(title => title)
  );
};
