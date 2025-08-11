import { Component } from '@angular/core';
import { AuthService } from '../guards/auth.service';
@Component({
  selector: 'app-counsellor-sidebar',
  templateUrl: './counsellor-sidebar.component.html',
  styleUrls: ['./counsellor-sidebar.component.css']
})
export class CounsellorSidebarComponent {
  constructor(private authService: AuthService){}
  onLogout(){
    this.authService.clearToken();
   }
}
