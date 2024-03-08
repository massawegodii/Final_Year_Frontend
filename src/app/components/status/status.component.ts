import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StatusNewComponent } from '../status-new/status-new.component';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent implements OnInit{
  constructor(private dialog: MatDialog){}

  ngOnInit(): void {
  }

  addNewStatus() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(StatusNewComponent, dialogConfig);
  }

}
