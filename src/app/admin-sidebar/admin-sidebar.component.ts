import { Component } from '@angular/core';
import { AuthService } from '../guards/auth.service';
@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  constructor(private authService: AuthService){}
 onLogout(){
  this.authService.clearToken();
 }
}
