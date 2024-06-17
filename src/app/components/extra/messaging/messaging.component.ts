import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../../_services/message.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.scss',
})
export class MessagingComponent implements OnInit {
  responseMessage: any;
  messageForm: any = FormGroup;
  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<MessagingComponent>
  ) {}

  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
      phoneNumber: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  pasteClipboard(input: HTMLInputElement) {
    navigator.clipboard.readText().then((clipText) => {
      if (clipText && input) {
        const startsWithPlus255 = clipText.startsWith('+255');
        const newText = startsWithPlus255 ? clipText : '+255' + clipText;

        input.value = newText;
        input.dispatchEvent(new Event('input'));
      }
    });
  }

  handleMesageSubmit() {
    const formData = this.messageForm.value;
    var data = {
      phoneNumber: formData.phoneNumber,
      message: formData.message,
    };
    this.messageService.sendMessage(data).subscribe(
      (response: any) => {
        this.messageForm.reset();
        this.dialogRef.close();
        this.dialogRef.close();
        this.toastr.success('Message sent successfully 📤', '', {});
      },
      (error) => {
        this.toastr.error('Message sent Failed! Try again', '', {});
        this.dialogRef.close();
        console.log(error);
      }
    );
  }
}
