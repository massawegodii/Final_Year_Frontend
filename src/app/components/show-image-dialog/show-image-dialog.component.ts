import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-image-dialog',
  templateUrl: './show-image-dialog.component.html',
  styleUrl: './show-image-dialog.component.scss'
})
export class ShowImageDialogComponent implements OnInit{

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){}

  ngOnInit(): void {
    this.receiveImages();
  }

  receiveImages() {
    console.log(this.data);
  }

}
