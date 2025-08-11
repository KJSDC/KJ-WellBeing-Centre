import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../shared-data.service';
@Component({
  selector: 'app-counsellor-sessions',
  templateUrl: './counsellor-sessions.component.html',
  styleUrls: ['./counsellor-sessions.component.css'],
})
export class CounsellorSessionsComponent implements OnInit {
  counsellorForm: FormGroup;

  private sendDateApiUrl = 'https://kj-wellbeingcentre.onrender.com/protected/counsellor/sessions'; // Replace with your actual API URL


  sessions: any[] = [];
  selectedSession: any;
  showMainContent: boolean = true; 
  selectedDate: Date | null = null;
  sesid = '';
  sid = '';
  constructor(private fb: FormBuilder, private sharedDataService: SharedDataService,private http: HttpClient, private router: Router, private toastr: ToastrService) {
    this.counsellorForm = this.fb.group({
      student_id: [''],
      counselor_id: [''],
      course: [''],
      time: [''],
      end_time: [''],
      start_time: [''],
      start_date: [''],
      student_name: [''],
      sem: [''],
      _id: [''],
      slot_status: [''],
    });
  }

  ngOnInit() {
    this.fetchDataForCurrentDate();
  }

  fetchDataForCurrentDate() {
    const today = new Date();
    const formattedDate = this.formatDateToUTC(today);
    this.sendDateToBackend(formattedDate);
  }

  formatDateToUTC(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  getDatePickerValue(event: any): void {
    const datePickerValue = (event.value as Date);
    datePickerValue.setUTCDate(datePickerValue.getUTCDate() + 1);
    const formattedDate = this.formatDateToUTC(datePickerValue);
    console.log(`Selected date in UTC format: ${formattedDate }`);
    this.sendDateToBackend(formattedDate);
  }

  sendDateToBackend(datePickerValue: string): void {

    const data = {
      // "counsellor_id": " ",
      "start_date": datePickerValue  
     };
    const bodyData = JSON.stringify(data);
    console.log('Sending data to backend:', bodyData);

    this.http.post<any>(this.sendDateApiUrl, bodyData).subscribe({
      next: (res: any) => {
        console.log('Data received after sending date:', res);
        if (res.message === 'No Slots Booked for the selected date!') {
          this.toastr.error('No slots booked for the selected date', 'Error');
          this.sessions = [];
        } else {
          this.sessions = res;
          if (!this.sessions || this.sessions.length === 0) {
            alert("No sessions booked.");
          } else {
            // Populate form with the first session details if available
            this.counsellorForm.patchValue(this.sessions[0]);
          }
        }
        console.log(this.sessions)
      },
      error: (err: any) => {
        console.log("Error sending date", err);
        alert("Error");
      }
    });
  }


//   FormPage(id_: string): void {
//     console.log('Form Page ID:', id_);
//     // Send the _id to the backend
//     this.http.post(this.sendIdApiUrl, { id_ }).subscribe({
//       next: (response: any) => {
//         console.log('Response from backend:', response);
//         // Handle the response from the backend
//       },
//       error: (error: any) => {
//         console.log('Error sending _id:', error);
//       }
//     });
//   }
// }

viewSessionDetails() {
  console.log('Form Page ID:');
  // const studentId = session.student_id
  // const sessionId = this.counsellorForm.get('_id')?.value;


  // console.log(combinedData);
  // 

}
viewSessionDetails2(session: any): void {
  console.log('Clicked session details:', session.student_id);
  const studentId = session.student_id;
  const sessionId = session._id;

  console.log(
    studentId, sessionId
  )
  this.sharedDataService.setStudentId(studentId);
  this.sharedDataService.setSessionId(sessionId);
  this.router.navigate(['counsellorUpcomingSessionForm'])
}
}