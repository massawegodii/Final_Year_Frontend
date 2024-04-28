import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../../_services/message.service';
import { GlobalConstant } from '../../../_constants/global-constant';
import { SnackbarService } from '../../../_services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackbarService: SnackbarService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MessagingComponent>
  ) {}

  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
      phoneNumber: ['', Validators.required],
      message: ['', Validators.required]
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
        this.snackBar.open('Message sent successfully 📤', '', {
          duration: 4000, 
          verticalPosition: 'top',
          panelClass: ['success-snackbar'] 
        });
      },
      (error) => {
        this.snackBar.open('Message sent Failed! Try again📲', '', {
          duration: 4000, 
          verticalPosition: 'top',
          panelClass: ['success-snackbar'] 
        });
        this.dialogRef.close();
        console.log(error);
      }
    );
  }
}
