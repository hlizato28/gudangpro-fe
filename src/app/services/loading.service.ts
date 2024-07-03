import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  constructor(private ngZone: NgZone) {}

  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();
  private timeoutId: any;
  private loadingCounter = 0;

  setLoading(isLoading: boolean) {
    this.ngZone.run(() => {
      if (isLoading) {
        this.loadingCounter++;
        if (this.loadingCounter === 1) {
          this.loadingSubject.next(true);
          this.setLoadingTimeout();
        }
      } else {
        this.loadingCounter--;
        if (this.loadingCounter === 0) {
          this.clearTimeout();
          this.loadingSubject.next(false);
        }
      }
    });
    
  }

  private setLoadingTimeout() {
    this.clearTimeout();
    this.timeoutId = setTimeout(() => {
      console.log('Timeout triggered, resetting loading');
      this.loadingCounter = 0;
      this.loadingSubject.next(false);
    }, 10000);
  }

  private clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}