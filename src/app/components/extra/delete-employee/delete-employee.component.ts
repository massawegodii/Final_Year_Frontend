import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-employee',
  templateUrl: './delete-employee.component.html',
  styleUrl: './delete-employee.component.scss'
})
export class DeleteEmployeeComponent implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public data: any){}

  ngOnInit(): void {
  }

}
