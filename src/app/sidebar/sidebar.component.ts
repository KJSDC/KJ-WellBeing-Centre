import { Component } from '@angular/core';
import { AuthService } from '../guards/auth.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private authService: AuthService){}
 onLogout(){
  this.authService.clearToken();
 }
}
