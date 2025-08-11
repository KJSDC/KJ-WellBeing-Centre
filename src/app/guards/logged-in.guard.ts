import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      // Redirect based on user role
      const authToken = this.authService.getAuthToken();
      const decodedPayload = this.authService.decodeAuthToken(authToken);
      const role = decodedPayload?.role; // Assuming the token has a role property

      switch (role) {
        case 'admin':
          this.router.navigate(['/AdminHistory']);
          break;
        case 'user':
          this.router.navigate(['/Booking']);
          break;
        case 'counsellor':
          this.router.navigate(['/Profile']);
          break;
        default:
          this.router.navigate(['/']); // Navigate to default route for unknown roles
          break;
      }
      return false; // Prevent navigation to the route
    }
    return true; // Allow navigation to the route if not logged in
  }
}

