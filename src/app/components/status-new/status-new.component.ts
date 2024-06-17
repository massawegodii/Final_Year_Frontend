import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstant } from '../../_constants/global-constant';
import { StatusService } from '../../_services/status.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-status-new',
  templateUrl: './status-new.component.html',
  styleUrl: './status-new.component.scss',
})
export class StatusNewComponent implements OnInit {
  responseMessage: any;
  statusForm: any = FormGroup;
  onAddStatus = new EventEmitter();
  onEditStatus = new EventEmitter();
  dialogAction: any = 'Add';
  action: any = 'Add';

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private statusService: StatusService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<StatusNewComponent>
  ) {}

  ngOnInit(): void {
    this.statusForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstant.nameRegex)],
      ],
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.statusForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    var formData = this.statusForm.value;
    var data = {
      name: formData.name,
    };
    this.statusService.addStatus(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onAddStatus.emit();
        this.responseMessage = response?.message;
        this.toastr.success('Status added successfully!');
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

  edit() {
    var formData = this.statusForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
    };
    this.statusService.updateStatus(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onAddStatus.emit();
        this.responseMessage = response?.message;
        this.toastr.success('Status Updated successfully!');
      },
      (error) => {
        this.toastr.info();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstant.genericError;
        }
        this.toastr.info(this.responseMessage, GlobalConstant.error);
      }
    );
  }
}
