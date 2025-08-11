import { Component } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
@Component({
  selector: 'app-admin-grid',
  templateUrl: './admin-grid.component.html',
  styleUrls: ['./admin-grid.component.css']
})
export class AdminGridComponent {
  columnDefs: ColDef[] = [
    { headerName: 'Employee Id', field: 'empId', sortable: true },
    { headerName: 'Name', field: 'name', sortable: true },
    { headerName: 'Type', field: 'type', sortable: true },
    { headerName: 'Email', field: 'email', sortable: true },
    { headerName: 'Phone No.', field: 'phoneno', sortable: true },
    { headerName: 'Status', field: 'status', sortable: true },
  ];
  rowData = [
    {
      empId: '01',
      name: 'Melvin',
      type: 'Full-Time',
      email: '22bcab36@gmail.com',
      phoneno:'9380216557',
      status: 'Active'
    },
    {
      empId: '02',
      name: 'Omkae',
      type: 'Visiting',
      email: '22bcab69@gmail.com',
      phoneno:'7369216967',
      status: 'InActive'
    },
  ];
  
}
