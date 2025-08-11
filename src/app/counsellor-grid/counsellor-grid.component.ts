import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-counsellor-grid',
  templateUrl: './counsellor-grid.component.html',
  styleUrls: ['./counsellor-grid.component.css'],
  providers: [DatePipe]
})
export class CounsellorGridComponent implements OnInit {
  
  dateError: string | null = null; 
  quickFilterText: string = '';
  startDate: string | null = null;
  endDate: string | null = null;

  columnDefs: ColDef[] = [
    { headerName: 'Student Name', field: 'Name', sortable: true , filter: true },
    { headerName: 'Session Date', field: 'session_attended_date', sortable: true },
    { headerName: 'Session ID', field: 'bookingId', sortable: true },
    { headerName: 'Status', field: 'status', sortable: true, filter: true  },
    { headerName: 'Concerns Discussed', field: 'ConcernsDiscussed', sortable: true },
    { headerName: 'Duration', field: 'Duration', sortable: true },
    { headerName: 'Follow-Up Session', field: 'FollowUpSessionToggle', sortable: true },
    { headerName: 'Further Referrals', field: 'FurtherReferrals', sortable: true },
    { headerName: 'Recommended Follow-Up Session', field: 'RecommendedFollowUpSession', sortable: true },
    { headerName: 'Appointment ID', field: 'appointment_id', sortable: true },
    { headerName: 'Email', field: 'email', sortable: true },
    { headerName: 'Referred By', field: 'referred_by', sortable: true },
    { headerName: 'Referrer Email', field: 'referrer_Email', sortable: true },
    { headerName: 'Slot End Time', field: 'slot_end_time', sortable: true },
    { headerName: 'Slot Start Time', field: 'slot_start_time', sortable: true },
    { headerName: 'Student Age', field: 'student_age', sortable: true },
    { headerName: 'Student Course', field: 'student_course', sortable: true },
    { headerName: 'Student Department', field: 'student_department', sortable: true },
    { headerName: 'Student Gender', field: 'student_gender', sortable: true },
    { headerName: 'Student Semester', field: 'student_sem', sortable: true },
];

paginationPageSize = 10; // Default page size
dateRange = new FormGroup({
  start: new FormControl(),
  end: new FormControl()
});
  rowData: any[] = [];
  private gridApi!: GridApi;
  errorMessage: string = '';

  constructor(private http: HttpClient,private datePipe: DatePipe) { 
    this.dateRange.valueChanges.subscribe(range => {
      if (range.start && range.end) {
        const startDate = this.datePipe.transform(range.start, 'dd/MM/yyyy');
        const endDate = this.datePipe.transform(range.end, 'dd/MM/yyyy');
        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
        this.startDate = startDate;
        this.endDate = endDate;
        this.sendDate()
      }
    });
  }

 
  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const empty = null
    this.http.post<any[]>('https://kj-wellbeingcentre.onrender.com/protected/aggrid',empty)
      .subscribe(
        response => {
          console.log('Full response:', response);
          this.rowData = response;
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching data:', error);
          this.errorMessage = `Error fetching data: ${error.message}`;
          alert(`Failed to fetch data from the server. Please try again later.`);
        }
      );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  exportToExcel() {
    try {
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.getHeadersAndRowsData());
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'session_history');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  }
  
  getHeadersAndRowsData() {
    const headers = this.columnDefs.map(colDef => colDef.headerName || '');
    const rows = this.getRowsData();
    return [headers, ...rows];
  }

  getRowsData() {
    const rowData: any[] = [];
    this.gridApi.forEachNode(node => {
      const row = this.columnDefs.map(colDef => {
        const field = colDef.field as string;
        return node.data ? node.data[field] : '';
      });
      rowData.push(row);
    });
    return rowData;
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }

  sendDate(): void {
    const payload = {
      start_date: this.startDate,
      end_date: this.endDate
    }
    console.log (payload)
    this.http.post<any[]>('https://kj-wellbeingcentre.onrender.com/protected/aggrid', payload)
      .subscribe(
        response => {
          console.log('Full response:', response);
          this.rowData = response;
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching data:', error);
          this.errorMessage = `Error fetching data: ${error.message}`;
          alert(`Failed to fetch data from the server. Please try again later.`);
        }
      );
  }
  onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }
  clear() {
    this.gridApi.setGridOption(
      "quickFilterText",
      ''
    );
    this.fetchData()
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';