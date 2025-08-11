import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
declare var pdfMake: any;

@Component({
  selector: 'app-student-grid',
  templateUrl: './student-grid.component.html',
  styleUrls: ['./student-grid.component.css']

})
export class StudentGridComponent implements OnInit {
  // Column definitions for the ag-Grid
  columnDefs: ColDef[] = [
    { headerName: 'Counsellor', field: 'Name', sortable: true },
    { headerName: 'Date', field: 'date', sortable: true },
    { headerName: 'Session ID', field: 'bookingId', sortable: true },
    { headerName: 'Status', field: 'status', sortable: true }
  ];

  // Data for the rows of the grid
  rowData: any[] = [];
  private gridApi!: GridApi;
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  // Lifecycle hook that gets called after the component has been initialized
  ngOnInit(): void {
    this.fetchData();
  }

  // Function to fetch data from the API


fetchData(): void {
  this.http.get<any[]>('https://kj-wellbeingcentre.onrender.com/protected/aggrid')
    .subscribe(
      response => {
        console.log('Full response:', response);
        this.rowData = response;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching data:', error);
        this.errorMessage = `Error fetching data: ${error.message}`;
        // Display a user-friendly error message
        alert(`Failed to fetch data from the server. Please try again later.`);
      }
    );
}


  // Event handler for the grid's ready event
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  // Function to export the grid data to a PDF
  exportToPDF() {
    const docDefinition = this.getDocument();
    pdfMake.createPdf(docDefinition).download();
  }

  // Function to generate the document definition for pdfMake
  getDocument() {
    const columns = this.gridApi.getAllDisplayedColumns();
    const headerRow = this.getHeaderToExport();
    const rows = this.getRowsToExport();

    return {
      pageOrientation: 'landscape',
      content: [
        {
          table: {
            headerRows: 1,
            widths: columns.map(() => '*'),
            body: [headerRow, ...rows],
            heights: (rowIndex: number) => (rowIndex === 0 ? 40 : 15),
          },
        },
      ],
    };
  }

  // Function to get the headers for the PDF export
  getHeaderToExport() {
    return this.gridApi
      .getAllDisplayedColumns()
      .map(column => column.getColDef().headerName);
  }

  // Function to get the rows for the PDF export
  getRowsToExport() {
    const rows: any[] = [];
    this.gridApi.forEachNode((node) => {
      const row = this.gridApi
        .getAllDisplayedColumns()
        .map(column => node.data[column.getColId()]);
      rows.push(row);
    });
    return rows;
  }
}