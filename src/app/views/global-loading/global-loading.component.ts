import { Component } from '@angular/core';
import { LoadingService } from './../../services/loading.service'

@Component({
  selector: 'app-global-loading',
  templateUrl: './global-loading.component.html',
  styleUrls: ['./global-loading.component.scss']
})
export class GlobalLoadingComponent {
  isLoading$ = this.loadingService.isLoading$;
  showTimeoutMessage = false;
  private timeoutId: any;

  constructor(private loadingService: LoadingService) {
    this.isLoading$.subscribe(isLoading => {
      if (isLoading) {
        this.timeoutId = setTimeout(() => {
          this.showTimeoutMessage = true;
        }, 5000); // Tampilkan pesan setelah 10 detik
      } else {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        this.showTimeoutMessage = false;
      }
    });
  }
}