import { Component, OnInit , HostListener } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

import { SharedDataService } from '../shared-data.service';
interface Session {
  student_name?:string;
  rootToggle?: boolean; 
  Duration:string;
  appointment_id: string;
  counselor_id: string;
  student_department:string;
  student_gender:string;
  slot_end_time_milliseconds:string;
  slot_start_time_milliseconds:string;
  date: string;
  date_mils: number;
  student_sem:string;
  student_email:string;
  referrer_Email: string;
  slot_e_time_m: number;
  slot_id: string;
  slot_s_time_m: number;
  slot_status: string;
  student_age: string;
  student_id: string;
  student_course:string;
  counsellor_id:string;
  _id: string;
  PastMedicalHistory?:string;

  PastPsychiatricHistory?:string;
  PastPsychiatricHistoryToggle?:string;
  RecommendedFollowUpSession?:boolean;
  ConcernsDiscussed?:string;
  FurtherReferrals?:string;
  FurtherReferralsToggle?:boolean;
  PastMedicalHistoryToggle?:boolean;
  referred_by?:string;

}

interface ApiResponse {
  session: Session;
  completedSessions: number;
  counselorNames: string[];
}

@Component({
  selector: 'app-upcoming-session-counseller',
  templateUrl: './upcoming-session-counseller.component.html',
  styleUrls: ['./upcoming-session-counseller.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class UpcomingSessionCounsellerComponent implements OnInit {
  profileForm: FormGroup;
  showErrorMessage = false;
  sessionId: string | null = null;
  studentId: string | null = null;
  // Default radio button values
  //Medical_History_radio_button: boolean = true;
  //Psychiatric_History_radio_button: boolean = true;
  //FurtherMessage_radio_button: boolean = true;
  //Recommended_radio_button: boolean = true;

  // Selected option
  selectedOption: boolean = true;

  // URLs for fetching and submitting datagit pu

  private fetchApiUrl = 'https://kj-wellbeingcentre.onrender.com/protected/counsellor/fetchstudent'; // Replace with your backend IP and port
  // private fetchApiUrl = 'http://172.18.3.147:8080/sessions';
  private submitApiUrl = 'https://kj-wellbeingcentre.onrender.com/protected/counsellor/formsubmit'; // Replace with your backend IP and port
  // private submitApiUrl = 'http://172.18.3.147:8080/updateSession'
  counselorNames: string[] = [];
  completedSessions: number = 0;
  
  constructor(private fb: FormBuilder,private sharedDataService: SharedDataService, private router: Router,private http: HttpClient, private snackBar: MatSnackBar) {
    // Initialize the profileForm with form controls and validators
    this.profileForm = this.fb.group({
      student_id: '',
      counsellor_id: '',
      date: '',
      completedSessions: '',
      counselorNames: [''],
      _id: '',
      student_sem: '',
      student_name: '',
      student_course: '',
      student_department: '',
      student_email: '',
      student_gender: '',
      Duration: ['', Validators.required],
      slot_end_time_milliseconds: '',
      slot_start_time_milliseconds: '',
      referred_by: '',
      student_age: '',
      referrer_Email: '',
      selectedOption: [true], // Default value
      Medical_History_radio_button: [true, Validators.required],
      medicalHistoryDetails: ['', Validators.required],
      Psychiatric_History_radio_button: [true, Validators.required],
      psychiatricHistoryDetails: ['', Validators.required],
      ConcernsDiscussedDetails: ['', Validators.required],
      FurtherMessage_radio_button: [true, Validators.required],
      FurtherMessageDetails: ['', Validators.required],
      Recommended_radio_button: [true],
    });

    // Setup dynamic form control reset based on radio button changes
     this.setupFormControlReset('Medical_History_radio_button', 'medicalHistoryDetails');
      this.setupFormControlReset('Psychiatric_History_radio_button', 'psychiatricHistoryDetails');
     this.setupFormControlReset('FurtherMessage_radio_button', 'FurtherMessageDetails');
   }

  ngOnInit(): void {
    this.fetchApi()
   // Fetch initial session data on component initialization
  }

  // Method to fetch session data from the backend
fetchApi() {
   this.sessionId = this.sharedDataService.getSessionId();
    this.studentId = this.sharedDataService.getStudentId();
  const combinedData = {
    student_id: this.studentId,
    _id: this.sessionId
  };

  console.log(combinedData)
  this.http.post<any>(this.fetchApiUrl,combinedData).subscribe({
    next: (res: any) => {
      console.log(res);
      if (res && res.session) {
        // Update session-related data in profileForm
        this.profileForm.patchValue({
          referred_by:res.session.referred_by,
          referrer_Email:res.session.referrer_Email,
          student_department:res.session.student_department,
          student_id: res.session.student_id,
          student_name:res.session.student_name,
          student_gender:res.session.student_gender,
          student_sem:res.session.student_sem,
          counsellor_id: res.session.counsellor_id,
          student_email:res.session.student_email,
          slot_end_time_milliseconds:res.session.slot_end_time_milliseconds,
          slot_start_time_milliseconds:res.session.slot_start_time_milliseconds,
          date: res.session.date,
          student_age: res.session.student_age,
          _id: res.session._id,
          Duration:res.session.Duration || '',
          student_course:res.session.student_course,
          FurtherMessage_radio_button:res.session.FurtherReferralsToggle || false,
          selectedOption:res.session.rootToggle ,
          medicalHistoryDetails: res.session.PastMedicalHistory || '',

           Medical_History_radio_button:res.session.PastMedicalHistoryToggle || false,
           psychiatricHistoryDetails: res.session.PastPsychiatricHistory || '',
           Psychiatric_History_radio_button:res.session.PastPsychiatricHistoryToggle || false,
           ConcernsDiscussedDetails: res.session.ConcernsDiscussed || '',
           FurtherMessageDetails: res.session.FurtherReferrals || '',
           Recommended_radio_button: res.session.RecommendedFollowUpSession || false,
           completedSessions: res.completedSessions || 0,
          counselorNames: res.counselorNames || [],
        // Update additional fields
        // if (res.completedSessions !== undefined) {
        //   this.profileForm.patchValue({ completedSessions: res.completedSessions });
        // }

        // if (res.counselorNames !== undefined) {
        //   this.profileForm.patchValue({ counselorNames: res.counselorNames });
        // }
      });
        console.log(res);
      } else {
        console.log('No session data found.');
      }
    },
    error: (err: any) => {
      console.error('Error fetching session data:', err);

      // Check error status and handle accordingly
      if (err.status === 0) {
        // Network error
        console.error('Network error - please check your internet connection.');
      
      } else if (err.status >= 400 && err.status < 500) {
        // Client-side error (4xx)
        console.error(`Client-side error: ${err.message}`);
        // alert(`Client-side error: ${err.message}`);
      } else if (err.status >= 500) {
        // Server-side error (5xx)
        console.error('Server-side error - please try again later.');
        // alert('Server-side error - please try again later.');
      } else {
        // Other errors
        console.error('An unexpected error occurred.');
        // alert('An unexpected error occurred.');
      }
    }
  });
}
// fetchApi() {
//   const data = { "_id": "BS1907202422BCAB36135506" };
//   const bodyData = JSON.stringify(data);
//   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

//   this.http.post<ApiResponse>(this.fetchApiUrl, bodyData, { headers }).subscribe({
//     next: (res: ApiResponse) => {
//       console.log('Fetched response:', res); 
//       if (res && res.session) {
//         this.profileForm.patchValue({
//           referred_by:res.session.referred_by,
//           referrer_Email:res.session.referrer_Email,
//           student_department:res.session.student_department,
//           student_id: res.session.student_id,
//           student_name:res.session.student_name,
//           student_gender:res.session.student_gender,
//           student_sem:res.session.student_sem,
//           counsellor_id: res.session.counsellor_id,
//           student_email:res.session.student_email,
//           slot_end_time_milliseconds:res.session.slot_end_time_milliseconds,
//           slot_start_time_milliseconds:res.session.slot_start_time_milliseconds,
//           date: res.session.date,
//           student_age: res.session.student_age,
//           _id: res.session._id,
//           Duration:res.session.Duration || '',
//           student_course:res.session.student_course,
//           FurtherMessage_radio_button:res.session.FurtherReferralsToggle || false,
//           selectedOption:res.session.rootToggle ,
//           medicalHistoryDetails: res.session.PastMedicalHistory || '',

//            Medical_History_radio_button:res.session.PastMedicalHistoryToggle || false,
//            psychiatricHistoryDetails: res.session.PastPsychiatricHistory || '',
//            Psychiatric_History_radio_button:res.session.PastPsychiatricHistoryToggle || false,
//            ConcernsDiscussedDetails: res.session.ConcernsDiscussed || '',
//            FurtherMessageDetails: res.session.FurtherReferrals || '',
//            Recommended_radio_button: res.session.RecommendedFollowUpSession || false,
//            completedSessions: res.completedSessions || 0,
//           counselorNames: res.counselorNames || [],
//         });
//       } else {
//         console.log('No session data found.');
//       }
//     },
//     error: (err: HttpErrorResponse) => {
//       console.error('Error fetching session data:', err);
//     }
//   });
// }

  // Method triggered when the selected option changes
  onOptionChange() {
    console.log(this.profileForm.get('selectedOption')?.value);
    if (this.profileForm.get('selectedOption')?.value === false) {
      this.profileForm.patchValue({
        Medical_History_radio_button: false,
        medicalHistoryDetails: '',
        Psychiatric_History_radio_button: false,
        psychiatricHistoryDetails: '',
        ConcernsDiscussedDetails: '',
        FurtherMessage_radio_button: false,
        FurtherMessageDetails: '',
        Recommended_radio_button: false,
        Duration: ''
      });
      this.profileForm.markAllAsTouched();
    } 
    // else {
    //   // Restore default values when selected option is true
    //   this.profileForm.patchValue({
    //     Medical_History_radio_button: true,
    //     medicalHistoryDetails: '',
    //     Psychiatric_History_radio_button: true,
    //     psychiatricHistoryDetails: '',
    //     ConcernsDiscussedDetails: '',
    //     FurtherMessage_radio_button: true,
    //     FurtherMessageDetails: '',
    //     Recommended_radio_button: true,
    //     Duration: ''
    //   });
    // }
  }

 //Setup dynamic form control reset based on radio button changes
 setupFormControlReset(radioButtonControlName: string, associatedControlName: string) {
  this.profileForm.get(radioButtonControlName)?.valueChanges.subscribe(value => {
    if (value === false) {
      this.profileForm.get(associatedControlName)?.clearValidators();
      this.profileForm.get(associatedControlName)?.updateValueAndValidity();
    } else {
      this.profileForm.get(associatedControlName)?.setValidators([Validators.required]);
      this.profileForm.get(associatedControlName)?.updateValueAndValidity();
    }
  });
}

  // Method to toggle form visibility
  isFormVisible = true;

  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }

  // Method to retrieve error message for a form control
  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    if (control?.invalid && control?.touched) {
      if (control?.hasError('required')) {
        return 'This field is required.';
      }
    }
    return '';
  }

  // Method triggered on form submission
  onSubmit(): void {
    const selectedOption = this.profileForm.get('selectedOption')?.value;
  
    if (selectedOption === true) {
      // If selectedOption is true, perform validation
      if (this.profileForm.invalid) {
        this.showErrorMessage = true;
        this.profileForm.markAllAsTouched();
        return;
      }
    } else {
      // If selectedOption is false, skip validation and submission
      this.showErrorMessage = false;
    }

    //this.showErrorMessage = false; // Hide error message
    console.log(this.profileForm.value); // Output the form values to the console

    // Map the form values to the required structure
    const formValues = this.profileForm.value;
    const sessionData = {
      counsellor_id: formValues.counsellor_id,
      _id: formValues._id,
      Duration: formValues.Duration,
      student_id: formValues.student_id,
      SessionNo: formValues._id,
      rootToggle: formValues.selectedOption,
      PastMedicalHistoryToggle: formValues.Medical_History_radio_button,
      PastMedicalHistory: formValues.medicalHistoryDetails,
      PastPsychiatricHistoryToggle: formValues.Psychiatric_History_radio_button,
      PastPsychiatricHistory: formValues.psychiatricHistoryDetails,
      ConcernsDiscussed: formValues.ConcernsDiscussedDetails,
      FurtherReferralsToggle: formValues.FurtherMessage_radio_button,
      FurtherReferrals: formValues.FurtherMessageDetails,
      FollowUpSessionToggle: formValues.Recommended_radio_button,
      RecommendedFollowUpSession: formValues.Recommended_radio_button,
    };
     console.log('Session data to be sent:', sessionData);
    // Send the transformed data to the backend
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<any>(this.submitApiUrl, JSON.stringify(sessionData), { headers, observe: 'response' }).subscribe({
      next: (res: HttpResponse<any>) => {
        const status = res.body.status; // Extract status from response body
        console.log('Session updated successfully', res);
        // Display success message using MatSnackBar
        this.snackBar.open(` ${status}`, 'Close', {
          duration: 3000, // Duration in milliseconds
        });
        this.router.navigate(['counsellorUpcomingSession'])
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating session', err);
        // Check if the error message is "Session already submitted"
        if (err.error && err.error.error === 'Session already submitted') {
          this.snackBar.open('Session already submitted', 'Close', {
            duration: 3000, // Duration in milliseconds
          });
        } else {
          this.snackBar.open(`Form not updated. Status: ${err.status}`, 'Close', {
            duration: 3000, // Duration in milliseconds
          });
        }
      }
    });
  }
  @HostListener('window:load', ['$event'])
  onWindowLoad(event: Event): void {
    console.log('Page refreshed successfully');
    this.router.navigate(['counsellorUpcomingSession'])
  }
  closeForm(): void {
    this.router.navigate(['counsellorUpcomingSession']);
  }
}