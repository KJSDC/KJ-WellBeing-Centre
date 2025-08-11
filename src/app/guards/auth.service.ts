import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router, private cookieService: CookieService) {}

  isLoggedIn(): boolean {
    const authToken = this.cookieService.get('authToken');
    return !!authToken;
  }

  clearToken() {
    this.cookieService.delete('authToken', '/');
    this.router.navigate(['/']);
  }

  getAuthToken(): string {
    return this.cookieService.get('authToken');
  }

  decodeAuthToken(authToken: string): any {
    if (authToken) {
      const tokenParts = authToken.split('.');
      if (tokenParts.length === 3) {
        const decodedPayload = JSON.parse(atob(tokenParts[1]));
        return decodedPayload;
      } else {
        console.error('Invalid JWT token format');
        return null;
      }
    } else {
      console.error('No authToken found');
      return null;
    }
  }
  decodeTokenAndRedirect(): void {
    const authToken = this.cookieService.get('authToken');
    if (authToken) {
      const tokenParts = authToken.split('.');
      if (tokenParts.length === 3) {
        const decodedPayload = JSON.parse(atob(tokenParts[1]));
        console.log('Decoded Token Payload:', decodedPayload);

        // Example logic based on role
        const role = decodedPayload.role; // Assuming role is stored in the token

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

      } else {
        console.error('Invalid JWT token format');
      }
    } else {
      console.error('No authToken found');
    }
  }
}
