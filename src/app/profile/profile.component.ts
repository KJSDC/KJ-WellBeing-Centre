import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isPhoneEditable: boolean = false;
  ChangePass!: FormGroup;
  private fetchApiUrl = 'https://kj-wellbeingcentre.onrender.com/protected/counsellor/getprofiledetails';
  private updateApiUrl = 'https://kj-wellbeingcentre.onrender.com/protected/counsellor/updatePhoneNumber';
  response_data: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private toastr: ToastrService) {
    this.profileForm = this.fb.group({
      name: [''],
      employeeId: [''],
      gender: [''],
      dob: [''],
      email: [''],
      phoneNo: [{ value: '', disabled: !this.isPhoneEditable }, [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')  
      ]]
    });

    this.ChangePass = this.fb.group({
      Email: ['', Validators.required],
      OldPassword: ['', Validators.required],
      NewPassword: ['', Validators.required],
      ConfirmNewPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchProfileData();
  }

  fetchProfileData(): void {
    this.http.get<any>(this.fetchApiUrl).subscribe({
      next: (res) => {
        console.log(res);
        this.profileForm.patchValue(res[0]);
      },
      error: (err) => {
        console.log('Error', err);
      }
    });
  }

  togglePhoneEdit(): void {
    this.isPhoneEditable = !this.isPhoneEditable;
    if (this.isPhoneEditable) {
      this.profileForm.get('phoneNo')?.enable();
    } else {
      this.profileForm.get('phoneNo')?.disable();
    }
  }

  savePhoneNumber(): void {
    if (this.profileForm.valid) {
      this.isPhoneEditable = false;
      this.updatePhoneNumber();
    } else {
      console.error('Form is invalid');
    }
  }

  updatePhoneNumber(): void {
    const updatedPhone = this.profileForm.get('phoneNo')?.value;
    const payload = {
      employeeId: this.profileForm.get('employeeId')?.value,
      phoneNo: updatedPhone
    };

    this.http.post(this.updateApiUrl, payload).subscribe({
      next: (response: any) => {
        this.response_data = response.message; // Assuming response has a 'message' property
        console.log('Phone number updated successfully', response);
        this.toastr.success('Phone number updated successfully!', 'Success');
        this.fetchProfileData();
      },
      error: (error) => {
        console.error('Error updating phone number', error);
        this.toastr.error('Failed to update phone number!', 'Error');
      }
    });
  }

  onChangePass() {
    // Retrieve values from the form
    let password = this.ChangePass.get('OldPassword')?.value ?? '';
    let newpassword = this.ChangePass.get('NewPassword')?.value ?? '';
    const ConfirmPassword = this.ChangePass.get('ConfirmNewPassword')?.value ?? '';

    // Check for empty or whitespace values and set them to null
    password = (password && password.trim() !== '') ? password : null;
    newpassword = (newpassword && newpassword.trim() !== '') ? newpassword : null;

    console.log(newpassword);
    console.log(ConfirmPassword);

    if (newpassword === ConfirmPassword) {
        console.log('Passwords do not match');
  

    const emailAndPassword = {
        email: this.profileForm.get('email')?.value ?? '',
        password: password,
        newpassword: newpassword
    };

    console.log(emailAndPassword);

    // Make HTTP POST request to change password

    this.http.post('https://kj-wellbeingcentre.onrender.com/forget', emailAndPassword, { observe: 'response' }).subscribe({

        next: (response: any) => {
            console.log('Password change successful', response);
            this.toastr.success('Success','Password Changed')
        },
        error: (err: any) => {
            console.log('Password change failed', err);
            this.toastr.error('Try Again','Password Change Failed')
        }
    });       
  }
  else if(newpassword !== ConfirmPassword){
    this.toastr.error('Passwords Dont match!', 'Error');
  }
}

  ChangepassOpen(){
    const modal = document.getElementById('changePassword');
    if (modal) {
      modal.style.display = 'flex';
    }
  }
  ChangepassClose(){
    const modal = document.getElementById('changePassword');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
