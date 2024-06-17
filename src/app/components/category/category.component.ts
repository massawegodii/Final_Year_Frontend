import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CategoryNewComponent } from '../category-new/category-new.component';
import { Category } from '../../_model/category-model';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from '../../_services/category.service';
import { GlobalConstant } from '../../_constants/global-constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
  responseMessage: any;
  displayedColumns: string[] = ['Id', 'Asset Type', 'Actions'];
  dataSource: Category[] = [];

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.categoryTable();
  }

  public categoryTable() {
    this.categoryService.getAllCategory().subscribe(
      (response: Category[]) => {
        this.dataSource = response;
      },
      (error) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.toastr.info(this.responseMessage, GlobalConstant.error);
      }
    );
  }

  addNewCategory() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '550px';
    const dialogRef = this.dialog.open(CategoryNewComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe(
      (response: any) => {
        this.categoryTable();
      }
    );
  }

  editCategory(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values,
    };

    dialogConfig.width = '550px';
    const dialogRef = this.dialog.open(CategoryNewComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe(
      (response: any) => {
        this.categoryTable();
      }
    );
  }

  deleteCategory(id: any) {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this User?'
    );

    if (isConfirmed) {
      this.categoryService.deleteCategory(id).subscribe(
        (response: any) => {
          this.responseMessage = response?.message;
          this.toastr.success('Category deleted successfully!');
          this.categoryTable();
        },
        (error) => {
          if (error.error?.message) {
            this.responseMessage = error.error?.message;
          } else {
            this.responseMessage = GlobalConstant.genericError;
          }
          this.toastr.info(this.responseMessage, GlobalConstant.error);
        }
      );
    } else {
      console.log('Deletion canceled.');
    }
  }
}
