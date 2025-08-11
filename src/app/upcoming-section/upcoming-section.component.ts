import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms'; // Import FormBuilder and FormGroup
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate } from '@angular/animations'; // Import animations
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-upcoming-section',
  templateUrl: './upcoming-section.component.html',
  styleUrls: ['./upcoming-section.component.css'],
  animations: [
    trigger('sessionAnimation', [
      // Animation states and transitions
      state('void', style({ opacity: 0, transform: 'translateY(-100%)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        animate('0.3s ease-in') // Animation for entering new sessions
      ]),
      transition(':leave', [
        animate('0.8s ease-out', style({ opacity: 0, transform: 'scale(0.9)' })) // Animation for leaving (cancelling) sessions
      ])
    ])
  ]
})
export class UpcomingSectionComponent implements OnInit {
  profileForm: FormGroup; // Form group for session details
  sessions: any[] = []; // Array to hold upcoming sessions
  selectedSession: any; // Currently selected session


  private fetchApiUrl = 'https://kj-wellbeingcentre.onrender.com/protected/user/sessions'; // API URL to fetch upcoming sessions
  private cancelApiUrl = 'https://kj-wellbeingcentre.onrender.com/protected/user/slotcancel'; // API URL to cancel a session
  private monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private fb: FormBuilder, // FormBuilder for building the profileForm
    private http: HttpClient, // HttpClient for HTTP requests
    public dialog: MatDialog, // MatDialog for dialog components
    private snackBar: MatSnackBar, // MatSnackBar for snack bar notifications
    private cd: ChangeDetectorRef // ChangeDetectorRef for manual change detection
  ) {
    // Initialize profileForm with form controls
    this.profileForm = this.fb.group({
      student_id: [''],
      counselor_id: [''],
      date: [''],
      end_time: [''],
      start_time: [''],
      _id: ['']
    });
  }

  ngOnInit(): void {
    this.fetchApi(); // Fetch upcoming sessions on component initialization
  }

  // Method to fetch upcoming sessions from the backend
  fetchApi() {
     // Convert data to JSON string

    // HTTP POST request to fetch sessions
    this.http.get<any>(this.fetchApiUrl).subscribe({
      next: (res: any) => {
        console.log('Fetched sessions:', res); // Log fetched sessions to console
        if (res.message === 'No slots have been booked!') {
          // Show snackbar message if no sessions are booked
          this.snackBar.open('No sessions are booked', 'Close', {
            duration: 4000, // Snackbar duration in milliseconds
          });
        }
        // Check if the response is an array before assigning to sessions
        if (Array.isArray(res)) {
          this.sessions = res; // Assign fetched sessions to the sessions array
        } else {
          this.sessions = []; // Initialize as empty array if response is not an array
        }
      },
      error: (err: any) => {
        console.log("Error fetching sessions", err); // Log error if fetching sessions fails
        this.sessions = []; // Set sessions to an empty array in case of error
      }
    });
  }

  // Method to format date string into a readable format
  formatDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/').map(Number); // Split date string into day, month, and year
    const monthName = this.monthNames[month - 1]; // Get month name using month index
    return `${day} ${monthName} ${year}`; // Return formatted date string
  }

  // Method to open cancellation confirmation dialog for a session
  openConfirmationDialog(session: any): void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '300px', // Set dialog width
      data: {
        message: `Are you sure you want to cancel the session with Dr. ${session.counselor_name}?`, // Dialog message with counselor name
        session: session // Pass session data to dialog
      }
    });

    // Subscribe to dialog close event
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.reason) { // Check if cancellation reason is provided in result
        this.cancelSession(session, result.reason); // Call method to cancel session with reason
      }
    });
  }

  // Method to cancel a session
  cancelSession(session: any, reason: string): void {
    const data = {
      _id: session._id, // Session ID to cancel
      // student_id: "23MCAB07", // Hardcoded student ID for demonstration
      reason: reason // Cancellation reason provided by user
    };

    // HTTP POST request to cancel session
    this.http.post<any>(this.cancelApiUrl, data).subscribe({
      next: (res: any) => {
        console.log('Session cancelled', res); // Log cancellation success response
        this.snackBar.open('Session cancelled successfully', 'Close', {
          duration: 3000, // Snackbar duration in milliseconds
        });
        this.fetchApi(); // Refresh sessions after cancellation
      },
      error: (err: any) => {
        console.error('Error cancelling session', err); // Log error if cancelling session fails
        this.snackBar.open('Failed to cancel session', 'Close', {
          duration: 3000, // Snackbar duration in milliseconds
        });
      }
    });
  }

  // Method to remove a session from the sessions array
  removeSession(sessionId: string): void {
    this.sessions = this.sessions.filter(session => session._id !== sessionId); // Filter out session by ID
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  template: `
    <h1 mat-dialog-title class="text-xl font-semibold">Confirm</h1>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
      <mat-form-field appearance="fill">
        <mat-label>Cancellation Reason</mat-label>
        <input matInput [(ngModel)]="reason" name="reason" required>
      </mat-form-field>
    </div>
    <div mat-dialog-actions class="flex justify-center space-x-4 mt-4">
      <button mat-button (click)="onNoClick()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">No</button>
      <button mat-button (click)="onYesClick()" cdkFocusInitial class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Yes</button>
    </div>
  `,
})
export class DialogContentExampleDialog {
  reason: string = ''; // Variable to store cancellation reason

  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>, // Dialog reference
    @Inject(MAT_DIALOG_DATA) public data: { message: string; session: any }, // Injected dialog data
    private snackBar: MatSnackBar // MatSnackBar for snack bar notifications
  ) {}

  // Method executed on 'No' button click
  onNoClick(): void {
    this.snackBar.open('Session cancellation aborted', 'Close', {
      duration: 3000, // Snackbar duration in milliseconds
    });
    this.dialogRef.close(false); // Close dialog with 'false' result
  }

  // Method executed on 'Yes' button click
  onYesClick(): void {
    if (!this.reason) {
      this.snackBar.open('Please provide a cancellation reason', 'Close', {
        duration: 3000, // Snackbar duration in milliseconds
      });
    } else {
      this.snackBar.open('Processing cancellation', 'Close', {
        duration: 3000, // Snackbar duration in milliseconds
      });
      this.data.session.reason = this.reason; // Assign cancellation reason to session data
      this.dialogRef.close(this.data.session); // Close dialog with session data as result
    }
  }
}
