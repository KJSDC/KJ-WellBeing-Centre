import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  // title = 'KJ-WBC';
  
  // ngOnInit(): void {
  //   initFlowbite();
  // }
  constructor(private spinner: NgxSpinnerService) {} // Inject NgxSpinnerService

  ngOnInit(): void {
    // Show the spinner when the app initializes
    this.spinner.show();

    // Hide the spinner after a certain time or based on some condition
    setTimeout(() => {
      this.spinner.hide();
    }, 3000); // Adjust time as needed

    // Initialize Flowbite components
    initFlowbite();
  }
}
