import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-booking',
  templateUrl: './book-a-session.component.html',
  styleUrls: ['./book-a-session.component.css']
})
export class BookingComponent implements OnInit {
  RefWarnEm: string = '';
  ageWarn: string = '';
  RefWarn: string = '';
  age: number | null = null;
  selected: Date | null = null; 
  blockedDates: Date[] = [];
  cname: string = '';
  selectedDate: Date | null = null;
  counselors: any[] = [];
  selectedCounselorId: string = '';
  isCounselorSelected: boolean = false;
  message: string = '';
  yourTime: string = '';
  date: any;
  available_date: any;
  selectedTime: string | null = null;
  button: any;
  selectedStartTime: string | null = null;
  registerNo: string = '';
  course: string = '';
  department: string = '';
  email: string = '';
  gender: string = '';
  name: string = '';
  formattedDate = '';
  selectedCounselorName: string | null = null;
  referred_by: string='';
  referrer_email: string='';
  apiKey = 'https://kj-wellbeingcentre.onrender.com/'
  constructor(private http: HttpClient, private renderer: Renderer2, private router: Router,private toastr: ToastrService) {
    
  }

  ngOnInit() {
    this.fetchCounselors();
  }
  fetchCounselors() {


    this.http.get<any[]>(this.apiKey + 'counsellors')
      .subscribe(data => {
        this.counselors = data;
        console.log(data)
      });

  }

  onSelectCounselor(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedCounselorId = selectedValue;
    this.isCounselorSelected = true;
    this.selected = null; 
    const element = document.getElementById('Calendar');
    if (element) {
      element.style.display = 'contents';
    }
    const counselor = this.counselors.find(c => c.counsellor_id === this.selectedCounselorId);
    if (counselor) {
      this.selectedCounselorName = counselor.name;
      console.log(this.selectedCounselorName);
    } else {
      console.error('Counselor not found with id:', this.selectedCounselorId);
    }
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    const today = new Date();
    const date30DaysFromToday = new Date();
    date30DaysFromToday.setDate(today.getDate() + 30);

    // Prevent Saturday
    if (day === 0) {
      return false;
    }
    // Disable dates before today
    if (d && d < new Date(today.setHours(0, 0, 0, 0))) {
      return false;
    }
    // Disable dates 30 days from today.
    if (d && d > date30DaysFromToday) {
      return false;
    }
    return true;
  };

  onDateSelected(date: Date | null): void {
    if (date) {
      this.selectedDate = date;
      this.postDate(date);
    } else {
      console.error('No date selected');
    }
    const element1 = document.getElementById('form');
    if (element1) {
      element1.style.display = 'none';
    }
    const element = document.getElementById('Timeslot');
    if (element) {
      element.style.display = 'none';
    }
    this.selectedStartTime = null;
  }

  postDate(date: Date): void {
    const formattedDate = this.formatDate(date);
    this.formattedDate = formattedDate;
    console.log(formattedDate);
    const payload = {
      counsellor_id: this.selectedCounselorId,
      date: formattedDate,
    };

    this.http.post<any[]>(this.apiKey + 'protected/user/slots', payload).subscribe(response => {
      console.log('Date and counselor ID posted successfully:', response);
      console.log(response.length);
      if (response === null || response === undefined || response.length === 0 || response.length === 35 || response.length === 34) {
        console.log('Response is null or undefined.');
        this.selected = null;
        // this.message = 'no time slots available';
        this.toastr.error('No time slots available', 'Try different date');
        const element1 = document.getElementById('form');
        if (element1) {
          element1.style.display = 'none';
        }
        const element = document.getElementById('Timeslot');
        if (element) {
          element.style.display = 'none';
        }
      } else if (response.length === 37) {
        // this.message = 'only one slot can be booked';
        this.selected = null;
        this.toastr.error('Only one slot can be per day', 'Try different date');
        const element = document.getElementById('Timeslot');
        if (element) {
          element.style.display = 'none';
        }
        const element1 = document.getElementById('form');
        if (element1) {
          element1.style.display = 'none';
        }
      } else {
        this.available_date = response;
        const element = document.getElementById('Timeslot');
        if (element) {
          element.style.display = 'block';
        }
        // this.message = '';
      }      
    });
  }

  ontimeclick(startTime: string, endTime: string) {
    this.selectedTime = `${startTime}-${endTime}`;
    this.selectedStartTime = startTime;
    const element = document.getElementById('form');
    if (element) {
      element.style.display = 'block';
    }
    this.yourTime = `your selected time is ${startTime} - ${endTime}`;
    this.scrollToElement('form');
    this.makeGetRequest();
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits for day
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits for month
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById('form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  makeGetRequest(): void {
    this.http.get<any[]>(this.apiKey + 'protected/user/getstudentinfo').subscribe(
      data => {
        console.log('GET request successful', data);

        // Assuming response is an array with one object
        if (data.length > 0) {
          const studentInfo = data[0]; // Assuming the first element contains the student info
          this.registerNo = studentInfo.Register_No;
          this.course = studentInfo.course;
          this.department = studentInfo.department;
          this.email = studentInfo.email;
          this.gender = studentInfo.gender;
          this.name = studentInfo.name;
        } else {
          console.warn('No data found in the response.');
          // Handle case where no data is returned
        }
      },
      error => {
        console.error('GET request error', error);
        // Handle the error as needed
      }
    );
  }

  handleSelfCheckboxChange(event: any) {
    const selfCheckbox = event.target;
    const referredByInput = document.getElementById('referred_by') as HTMLInputElement;
    const referdEmail = document.getElementById('referrer_email') as HTMLInputElement;
  
    if (selfCheckbox.checked) {
      referredByInput.value = 'self';
      referdEmail.value = this.email;
      referredByInput.disabled = true;
      referdEmail.disabled = true;
      this.referred_by = referredByInput.value;
      this.referrer_email = referdEmail.value;
    } else {
      referredByInput.value = '';
      referdEmail.value = '';
      referredByInput.disabled = false;
      referdEmail.disabled = false;
      this.referred_by = '';
      this.referrer_email = '';
    }
  
    console.log(this.referred_by);
    console.log(this.referrer_email);
  }
  

  displayBooked() {
      const element = document.getElementById('Booked');
      if (element) {
        element.style.display = 'block';
      }
  }

  closeBooked() {
    const element = document.getElementById('Booked');
    if (element) {
      element.style.display = 'none';
    }
    window.location.reload();
  }

  sendBookingData(): void {
    const bookingDetails = {
      counsellor_id: this.selectedCounselorId,
      date: this.formattedDate,
      slot_start_time: this.selectedStartTime,
      slot_end_time: this.selectedTime ? this.selectedTime.split('-')[1] : null,
      age: this.age,
      referred_by: this.referred_by,
      referrer_email: this.referrer_email,
    };
    console.log(this.referred_by)
    console.log(bookingDetails)

    if( this.referred_by !== ""){
      this.RefWarn = ''
   }
   if( this.referrer_email !== ""){
    this.RefWarnEm = ''
 }
  if(this.age !== null){
    this.ageWarn = ''
  }


      if( this.referred_by === ""){
          this.RefWarn = 'Enter Your Referal Name'
          return;
       }
       if( this.referrer_email === ""){
        this.RefWarnEm = 'Enter Your Referal Email'
        return;
     }
      if(this.age === null){
        this.ageWarn = 'Enter Your Age'
        return;
      }
      if(this.age < 16 || this.age > 30){
        this.ageWarn = 'Enter A valid Age between 16 - 30'
        return;
      }
      if(this.age > 16 || this.age < 30){
        this.ageWarn = ''
      }

    this.http.post(this.apiKey + 'protected/user/slotbooking', bookingDetails)
      .subscribe(
        response => {
          if(response === 'Your slot has been booked!'){
          // console.log('Booking sent successfully');
          // console.log('Response from backend:', response);
          // console.log('Booking Details:', bookingDetails);
          this.displayBooked();
        }else{
          this.toastr.error('Try Again','Slot Aldready Booked')
        }
        },
        error => {
          console.error('Error sending booking data:', error);
        }
      );
   
  }
}
