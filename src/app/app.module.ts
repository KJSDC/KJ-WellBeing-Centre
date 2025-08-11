import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule } from 'ngx-toastr';
import {MatCardModule} from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BookingComponent } from './book-a-session/book-a-session.component';
import { CounsellorSidebarComponent } from './counsellor-sidebar/counsellor-sidebar.component';
import { UpcomingSectionComponent,DialogContentExampleDialog } from './upcoming-section/upcoming-section.component';
import { CounsellorSessionsComponent } from './counsellor-sessions/counsellor-sessions.component';
import { CounsellorGridComponent } from './counsellor-grid/counsellor-grid.component';
import { StudentGridComponent } from './student-grid/student-grid.component';
import { UpcomingSessionCounsellerComponent } from './upcoming-session-counseller/upcoming-session-counseller.component';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { AvailabilityComponent } from './availability/availability.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminGridComponent } from './admin-grid/admin-grid.component';
import { TermsandconditionsComponent } from './termsandconditions/termsandconditions.component';
import { CounsellorsComponent } from './counsellors/counsellors.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerInterceptorService } from './spinner.interceptor';




@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    NavbarComponent,
    ProfileComponent,
    SidebarComponent,
    BookingComponent,
    CounsellorSidebarComponent,
    UpcomingSectionComponent,
    DialogContentExampleDialog,
    CounsellorSessionsComponent,
    CounsellorGridComponent,
    StudentGridComponent,
    UpcomingSessionCounsellerComponent,
    AvailabilityComponent,
    AdminSidebarComponent,
    AdminGridComponent,
    TermsandconditionsComponent,
    CounsellorsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    AgGridModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    NgxSpinnerModule.forRoot({ type: 'ball-fussion' }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      closeButton: true,
      progressBar: true,
      timeOut: 3000,
    }),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: SpinnerInterceptorService,
    multi: true
  },
  {provide:LocationStrategy,useClass:HashLocationStrategy},
],
  
  bootstrap: [AppComponent],
 
})
export class AppModule { }
