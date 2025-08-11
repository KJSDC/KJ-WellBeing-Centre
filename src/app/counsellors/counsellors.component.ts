import { Component ,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-counsellors',
  templateUrl: './counsellors.component.html',
  styleUrls: ['./counsellors.component.css']
})
export class CounsellorsComponent implements OnInit {
  apiKey = 'https://kj-wellbeingcentre.onrender.com/'
  profiles: any[] = []

 constructor(private http: HttpClient){

 }
 ngOnInit(): void {
     this.getcounsellorsDetails()
 }
 getcounsellorsDetails() {
  this.http.get<any>(this.apiKey + 'counsellorDetails').subscribe(
    response => {
      console.log(response);
      this.profiles = response;

      // Split the comma-separated 'area_of_interest' into an array for each profile
      this.profiles.forEach(profile => {
        if (profile.area_of_interest) {
          profile.area_of_interest_array = profile.area_of_interest;
        } else {
          profile.area_of_interest_array = [];
        }
      });

      console.log(this.profiles);
    }
  );
}

}

