import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CategoryNewComponent } from '../category-new/category-new.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  addNewCategory() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(CategoryNewComponent, dialogConfig);
  }
}
