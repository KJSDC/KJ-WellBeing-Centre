import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css'],
})
export class AvailabilityComponent {
  constructor(private http: HttpClient) {}
  selected: Date | null = null; // Declare selected as Date | null type
  formattedDate: string | null = null;
  reason: string = '';
  overrideIsSelected: boolean = false;
  SlotSelected = false;
  selectedTimes: Array<{ start_time: string, end_time: string }> = [] ;
  SlotList: any[] = [];
  BlockedSlotList: any[] = [];
  selectedOption: string  | null = null;

  apiKey: string = 'https://kj-wellbeingcentre.onrender.com/'

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

  onDateSelected(selected: Date | null): void{
    this.SlotList =[]
    this.selectedTimes =[]
    this.BlockedSlotList =[]
    this.selectedOption = null
    if (selected) {
      const element = document.getElementById('SelectOperation');
      if (element) {
        element.style.display = 'block';
      }
    } else {
      console.error('No date selected');
    }
  }
  onBlockSelected(): void {
    this.selectedTimes = [];
    this.SlotList = [];
    this.postDate(new Date()); 
  }

  onUnblockSelected(): void {
    this.selectedTimes = [];
    this.SlotList = [];
    this.postBlocked(new Date());
  }
  postDate(date: Date): void{
    console.log(this.selected)
      this.selectedTimes = [];
    const formattedDate = this.formatDate(this.selected);
    const payload = {
      counsellor_id : 'C02',
      date: formattedDate
    }
  console.log(payload)
    this.http.post<any>(this.apiKey + 'protected/counsellor/availableslots', payload).subscribe(response => {
      // console.log(response);
      if (response) {
        this.SlotList = response.slots;
        // console.log(this.SlotList);
      } 
      const element = document.getElementById('Timeslot');
      if (element) {
        element.style.display = 'block';
      }
    }, error => {
      console.error('Error fetching prime slot list', error);
    });
   
  }
  postBlocked(date: Date): void{
    // this.selectedTimes = [];
  const formattedDate = this.formatDate(this.selected);
  const payload = {
 
    date: formattedDate
  }
console.log(payload)
  this.http.post<any>(this.apiKey + 'protected/counsellor/blockedslots', payload).subscribe(response => {
    console.log(response);
    if (response) {
      this.BlockedSlotList = response.slots;
    } 
    const element = document.getElementById('Timeslot2');
    if (element) {
      element.style.display = 'block';
    }
  }, error => {
    console.error('Error fetching prime slot list', error);
  });
 
}

  formatDate(date: Date | null): string | null {
    if (!date) return null;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

    onTimeClick(start_time: string, end_time: string) {
    const index = this.selectedTimes.findIndex(
      time => time.start_time === start_time && time.end_time === end_time
    );
    
    if (index === -1) {
      this.selectedTimes.push({ start_time, end_time });
    } else {
      this.selectedTimes.splice(index, 1);
    }
    const element = document.getElementById('Confirm Cancel');
    if (element) {
      element.style.display = 'block';
    }
  }
  onUnblockTimeClick(start_time: string, end_time: string) {
    const index = this.selectedTimes.findIndex(
      time => time.start_time === start_time && time.end_time === end_time
    );
    
    if (index === -1) {
      this.selectedTimes.push({ start_time, end_time });
    } else {
      this.selectedTimes.splice(index, 1);
    }
    const element = document.getElementById('Confirm Cancel');
    if (element) {
      element.style.display = 'block';
    }
  }
  isSelected(start_time: string, end_time: string): boolean {
    return this.selectedTimes.some(
      time => time.start_time === start_time && time.end_time === end_time
    );
  }

  Next(){
    const element = document.getElementById('Reason');
    if (element) {
      element.style.display = 'flex';
    }
}
  onBlocked(){
    const formattedDate = this.formatDate(this.selected);
   const data = {
    date: formattedDate,
    reason: this.reason,
    slots: this.selectedTimes
   }
   console.log(data)
   this.http.post<any>(this.apiKey + 'protected/counsellor/blockslots', data).subscribe(response => {    
     console.log(response)
     const element = document.getElementById('Blocked');
     if (element) {
       element.style.display = 'flex';
     }
   });
  }
  onUnBlocked(){
    const formattedDate = this.formatDate(this.selected);
   const data = {
    date: formattedDate,
    slots: this.selectedTimes
   }
   console.log(data)
   this.http.post<any>(this.apiKey + 'protected/counsellor/unblockslots', data).subscribe(response => {    
    if(response){
     const element = document.getElementById('UnBlocked');
     if (element) {
       element.style.display = 'flex';
     }
    }
   });
  }
  FinalClick(){
    window.location.reload();
  }
}
