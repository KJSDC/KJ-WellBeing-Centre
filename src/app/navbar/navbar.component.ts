import { Component, OnDestroy ,HostListener , ElementRef ,Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../guards/auth.service';
import { ToastrService } from 'ngx-toastr';
import { BodyDropPivotTarget } from 'ag-grid-community';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {
  isPasswordVisibleforgotpass: boolean = false;
  isPasswordVisibleconforgotpass: boolean = false;
  isPasswordVisibleAdmin: boolean = false;
  isPasswordVisibleUser: boolean = false;
  duration: number = 30;
  currentTime: number = this.duration;
  otpSent: boolean = false;
  private intervalId: any;
  StuLogin!: FormGroup;
  AdminLogin!: FormGroup;
  ForgotPass!: FormGroup;
  Negetivemessage: string | null = null; // for Error message
  Positivemessage: string | null = null; // for success message
  apiKey = 'https://kj-wellbeingcentre.onrender.com/'
  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router,private cookieService: CookieService,  private toastr: ToastrService,private authService: AuthService) {
    this.StuLogin = this.fb.group({
      Email: ['', Validators.required],
      Otp: ['', Validators.required],
    });
    this.AdminLogin = this.fb.group({
      AdminEmail: ['', Validators.required],
      Password: ['', Validators.required],
    });
    this.ForgotPass = this.fb.group({
      email: ['', Validators.required],
      Otp: ['', Validators.required],
      Password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
    });
  }
  togglePasswordVisibility() {
    this.isPasswordVisibleAdmin = !this.isPasswordVisibleAdmin;
  }
  togglePasswordVisibilityForgotPass() {
    this.isPasswordVisibleforgotpass = !this.isPasswordVisibleforgotpass;
  }
  togglePasswordVisibilityForgotConPass() {
    this.isPasswordVisibleconforgotpass = !this.isPasswordVisibleconforgotpass;
  }
  sendOtp() {
    const email = this.StuLogin.get('Email')?.value ?? '';

    if (!email.endsWith('@kristujayanti.com')) {
      //alert('Please enter a valid college email (@kristujayanti.com).');
      this.toastr.error('Please enter a valid college email','Try Again')
      this.Negetivemessage = 'Please enter a valid college email'
      this.Positivemessage = null;
      return;
    }
  
    const emailPayload = { email };
  
    this.http.post( this.apiKey + 'generate', emailPayload, { observe: 'response' }).subscribe({

      next: (response: any) => {
        //console.log('OTP request sent successfully:', response);
        this.Positivemessage = 'OTP sent successfully';
        this.Negetivemessage = null;
        this.otpSent = true;
        this.startTimer();
      },
      error: (error: any) => {
        //console.error('Error sending OTP request:', error);
        //alert('Failed to send OTP request. Please try again.');
        this.Negetivemessage = 'Failed to send OTP request. Please try again.'
        this.Positivemessage = null;
        if (error.status === 0) {
          this.Negetivemessage = 'Failed to connect to the server.';
          this.Positivemessage = null;
        }
      }
    });
  }
  
  removeMesage(){
    this.Negetivemessage = null;
    this.Positivemessage = null;
  }
  onClick() {
    this.Negetivemessage =null
    this.Positivemessage = null
      const emailAndOtp = {
      email: this.StuLogin.get('Email')?.value ?? '',
      otp: this.StuLogin.get('Otp')?.value ?? ''
    };
    console.log(emailAndOtp)
    this.http.post(this.apiKey + 'userverify', emailAndOtp, { observe: 'response' }).subscribe({
      next: (response: any) => {
        const body = response.body;
        console.log(response);
        if (body && body.message === 'OTP is valid') {
          const token = body.token;
          console.log('JWT Token:', token);
          this.cookieService.set('authToken', token);
          this.Positivemessage = 'OTP verified';
          this.Negetivemessage = null;
          this.toastr.success('Login successful!', 'Success');
          this.authService.decodeTokenAndRedirect();
          this.removeMesage();
        } else {
          this.Negetivemessage = 'Failed to verify OTP. Please try again.';
          this.Positivemessage = null;
          this.toastr.error('Login Failed', 'try again');
        }
      }
    });
  }


  FormData(formData: any) {
    throw new Error('Method not implemented.');
  }

  startTimer() {
    this.resetTimer();
    this.intervalId = setInterval(() => {
      this.currentTime--;
      if (this.currentTime <= 0) {
        this.onComplete();
      }
    }, 1000);
  }

  resetTimer() {
    clearInterval(this.intervalId);
    this.currentTime = this.duration;
  }

  stopTimer() {
    clearInterval(this.intervalId);
  }

  onComplete() {
    this.stopTimer();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
adminOnClick(){
  const emailAndPassword = {
    email: this.AdminLogin.get('AdminEmail')?.value ?? '',
    password: this.AdminLogin.get('Password')?.value ?? '',
  };
  this.http.post( this.apiKey + 'login', emailAndPassword, { observe: 'response' }).subscribe({
  next: (response: any) => {
    const body = response.body;
    const token = body.token;
    console.log('JWT Token:', token);
    this.cookieService.set('authToken', token, { path: '/' });
    console.log('Admin logged in', response);
    if (body.message === 'Successfully Logged in'){
      this.Positivemessage = 'Logged in'
      this.Negetivemessage = null
      this.removeMesage();
    if (body.role === 'counsellor'){
      this.toastr.success('Login successful!', 'Success');
      this.authService.decodeTokenAndRedirect();
    }
    else if (body.role === 'admin'){
      this.toastr.success('Login successful!', 'Success');
      this.authService.decodeTokenAndRedirect();
    }
    }
  },
  error: (error: any) => {
    console.error('Error sending request:', error);
    this.toastr.error('Login Failed', 'try again');
    if (error.status === 0) {
     this.Negetivemessage = 'Email or Password wrong try again'
    }
  }
});
}
sendAdminOtp() {
  const email = this.ForgotPass.get('email')?.value ?? '';
  const emailPayload = { email };

  this.http.post(this.apiKey + 'generate', emailPayload, { observe: 'response' }).subscribe({

    next: (response: any) => {
      this.Positivemessage = 'OTP sent successfully';
      this.startTimer();
      this.Negetivemessage = null;
      this.otpSent = true;
      this.removeMesage();
    },
    error: (error: any) => {
      this.Negetivemessage = 'Failed to send OTP request. Please try again.'
      this.Positivemessage = null;
      if (error.status === 0) {
        this.Negetivemessage = 'Failed to connect to the server.';
        this.Positivemessage = null;
      }
    }
  });
}
Verify() {
  const emailAndOtp = {
    email: this.ForgotPass.get('email')?.value ?? '',
    otp: this.ForgotPass.get('Otp')?.value ?? ''
  };
  this.Negetivemessage =null
  this.Positivemessage = null
  this.http.post(this.apiKey + 'verify', emailAndOtp, { observe: 'response' }).subscribe({
    next: (response: any) => {
      const body = response.body;
      console.log(emailAndOtp)
      if (body && body.message === 'OTP is valid') {
        this.removeMesage();
        const element = document.getElementById('passwordcontainer'); 
       if (element) {
         element.style.display = 'contents';
       }
       const element2 = document.getElementById('Otpverificationcontainer'); 
       if (element2) {
         element2.style.display = 'none';
       }
      } else {
        console.error('Error verifying OTP:', body);
        //alert('Failed to verify OTP. Please try again.');
        this.Negetivemessage = 'Failed to verify OTP. Please try again.';
        this.Positivemessage = null;
      }
    },
    error: (error: any) => {
      console.error('Error sending OTP verification request:', error);
     //alert('Failed to verify OTP. Please try again.');
     this.Negetivemessage = 'Failed to verify OTP. Please try again.';
     this.Positivemessage = null;
    }
  });
}
changePassword() {
debugger
  const password = this.ForgotPass.get('Password')?.value ?? '';
  const ConfirmPassword = this.ForgotPass.get('ConfirmPassword')?.value ?? '';
   console.log(password)
   console.log(ConfirmPassword)
  if (password !== ConfirmPassword) {
    console.log('Passwords do not match');
    this.toastr.error('Passwords do not match')
    return;
  }
  const emailAndnewpassword = {
    email: this.ForgotPass.get('email')?.value ?? '',
    newpassword: password
  };
  
  this.http.post(this.apiKey + 'forget', emailAndnewpassword, { observe: 'response' }).subscribe({
    next: (response: any) => {
      const Body = response.body
      if (Body.message === 'Password Updated'){
      this.toastr.success('Password Changed', 'Success');  
      console.log('Password change successful', response);      
    }
    },
    error: (err: any) => {
      console.log('Password change failed', err);
      this.toastr.error('Error Changing Password', 'try again');
    }
  });
}

displayUserLogin() {
  const element = document.getElementById('authentication-modal');
  if (element) {
    element.style.display = 'flex';
  }
}

closeUserLogin() {
const element = document.getElementById('authentication-modal');
if (element) {
  element.style.display = 'none';
}
this.StuLogin.reset();
}
displayAdminLogin() {
  const element = document.getElementById('adminAuth');
  if (element) {
    element.style.display = 'flex';
  }
}

closeAdminLogin() {
const element = document.getElementById('adminAuth');
if (element) {
  element.style.display = 'none';
}
this.AdminLogin.reset();
}
displayForgotPass() {
  const element = document.getElementById('ForgotPass');
  if (element) {
    element.style.display = 'flex';
  }

}

closeForgotPass() {
const element = document.getElementById('ForgotPass');
if (element) {
  element.style.display = 'none';
}
this.ForgotPass.reset();
}
}
