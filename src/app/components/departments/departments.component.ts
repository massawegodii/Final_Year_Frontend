import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DepartmentsNewComponent } from '../departments-new/departments-new.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
 
];

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent implements OnInit{

  constructor(private dialog: MatDialog){}

  ngOnInit(): void {
  }




  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  handleNewDepartmentAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(DepartmentsNewComponent, dialogConfig);
  }



}
