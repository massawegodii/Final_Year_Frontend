import { Component, Inject, OnInit } from '@angular/core';
import { Status } from '../../../_model/status_model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-status',
  templateUrl: './view-status.component.html',
  styleUrl: './view-status.component.scss',
})
export class ViewStatusComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { status: Status }) {}

  ngOnInit(): void {}
}
