import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "../services/login.service";

export const AuthGuard = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
}

export const PreventGuard = (): boolean => {
  const userService = inject(LoginService);
  const router = inject(Router);

  if (userService.isAuthenticated()) {
    router.navigate(['']);
    return false;
  }

  return true;
}