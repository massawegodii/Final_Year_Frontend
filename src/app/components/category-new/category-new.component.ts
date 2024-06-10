import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../_services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../_services/snackbar.service';
import { GlobalConstant } from '../../_constants/global-constant';

@Component({
  selector: 'app-category-new',
  templateUrl: './category-new.component.html',
  styleUrls: ['./category-new.component.scss'],
})
export class CategoryNewComponent implements OnInit {
  responseMessage: any;
  categoryForm!: FormGroup;
  categories: string[] = [];
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  dialogAction: string = 'Add';
  action: string = 'Add';

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private dialogRef: MatDialogRef<CategoryNewComponent>
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
      category: [
        null,
        Validators.required,
        ,
        Validators.pattern(GlobalConstant.nameRegex),
      ],
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.categoryForm.patchValue(this.dialogData.data);
      this.categories = this.dialogData.data.categories || [];
    }
  }

  addCategory(): void {
    const category = this.categoryForm.get('category')?.value;
    if (category && !this.categories.includes(category)) {
      this.categories.push(category);
      this.categoryForm.get('category')?.reset();
    }
  }

  removeCategory(index: number): void {
    this.categories.splice(index, 1);
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    const formData = this.categoryForm.value;
    const data = {
      name: formData.name,
      categories: this.categories,
    };
    this.categoryService.addCategory(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onAddCategory.emit();
        this.responseMessage = response?.onmessage,
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }

  edit() {
    const formData = this.categoryForm.value;
    const data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categories: this.categories,
    };
    this.categoryService.updateCategory(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onEditCategory.emit();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstant.error
        );
      }
    );
  }
}
