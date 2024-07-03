import { CanDeactivateFn } from '@angular/router';
import { IUnsavedChange } from '../interfaces/i-unsaved-change';
import Swal from 'sweetalert2';

export const unsavedChangeGuard: CanDeactivateFn<IUnsavedChange> = (
  component: IUnsavedChange, 
  currentRoute, 
  currentState, 
  nextState
) => {
  if (component && typeof component.canDeactivate === 'function') {
    const canLeave = component.canDeactivate();
    if (canLeave === false) {
      return Swal.fire({
        title: 'Konfirmasi',
        text: 'Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, tinggalkan',
        cancelButtonText: 'Tidak'
      }).then((result) => result.isConfirmed);
    }
  }
  return true;
};
