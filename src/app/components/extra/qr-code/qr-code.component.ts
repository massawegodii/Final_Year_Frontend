import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.scss'
})
export class QrCodeComponent {
  
  qrCodeImage: string;
  url: SafeUrl = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  private sanitizer: DomSanitizer) {
    
    this.qrCodeImage = data.image;
    this.url = this.sanitizer.bypassSecurityTrustUrl(this.qrCodeImage);
  }

  downloadQRCode() {
    const link = document.createElement('a');
    link.href = this.qrCodeImage;
    link.download = 'qr_code.png';
    link.click();
  }

}
