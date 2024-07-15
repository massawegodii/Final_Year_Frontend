import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '../../../_model/category-model';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrl: './category-view.component.scss',
})
export class CategoryViewComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[] }
  ) {}

  ngOnInit(): void {}
}
