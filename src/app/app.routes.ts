import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BookingComponent } from './book-a-session/book-a-session.component';
import { ProfileComponent } from './profile/profile.component';
import { UpcomingSectionComponent } from './upcoming-section/upcoming-section.component';
import { CounsellorGridComponent } from './counsellor-grid/counsellor-grid.component';
import { StudentGridComponent } from './student-grid/student-grid.component';
import { CounsellorSessionsComponent } from './counsellor-sessions/counsellor-sessions.component';
 import { AuthGuard } from './guards/auth.guard';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AdminGridComponent } from './admin-grid/admin-grid.component';
import { CousellorAuthGuard } from './guards/counsellor-auth.guard';
import { LoggedInGuard } from './guards/logged-in.guard';
import { AvailabilityComponent } from './availability/availability.component';
import { UpcomingSessionCounsellerComponent } from './upcoming-session-counseller/upcoming-session-counseller.component';
import { SpinnerResolverService } from './spinner.resolver';
export const APP_ROUTES: Routes = [
    //main landing pages
    {'path':'',component:LandingPageComponent,canActivate: [LoggedInGuard], resolve: { spinner: SpinnerResolverService }},
    //user/student pages
    {'path':'\Booking',component:BookingComponent,canActivate: [AuthGuard], resolve: { spinner: SpinnerResolverService }  },
    {'path':'\Upcomingsession',component:UpcomingSectionComponent,canActivate: [AuthGuard], resolve: { spinner: SpinnerResolverService }},
    {'path':'\Studenthistory',component:StudentGridComponent,canActivate: [AuthGuard], resolve: { spinner: SpinnerResolverService }},
    //counsellor pages
    {'path':'\counsellorUpcomingSession',component:CounsellorSessionsComponent, canActivate: [CousellorAuthGuard], resolve: { spinner: SpinnerResolverService }},  
    {'path':'\counsellorUpcomingSessionForm',component:UpcomingSessionCounsellerComponent, canActivate: [CousellorAuthGuard], resolve: { spinner: SpinnerResolverService }},   
    {'path':'\SessionHistory',component:CounsellorGridComponent,canActivate: [CousellorAuthGuard], resolve: { spinner: SpinnerResolverService }},
    {'path':'\Profile',component:ProfileComponent,canActivate: [CousellorAuthGuard], resolve: { spinner: SpinnerResolverService }},
    {'path':'\My-Availability',component:AvailabilityComponent, canActivate:[CousellorAuthGuard], resolve: { spinner: SpinnerResolverService }},
    //non-functional admin page for testing
    {'path':'\AdminHistory',component:AdminGridComponent, canActivate: [AdminAuthGuard], resolve: { spinner: SpinnerResolverService }}
];