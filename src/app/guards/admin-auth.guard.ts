import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Adjust the path as needed
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router,private toastr: ToastrService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    if (this.authService.isLoggedIn()) {
      const authToken = this.authService.getAuthToken();
      const decodedToken = this.authService.decodeAuthToken(authToken);
      if (decodedToken && decodedToken.role === 'admin') {
        return true;
      }
    }
    this.toastr.error('Unauthorized','page only for Admins');
    this.router.navigate(['/']);
    return false;
  }
}
