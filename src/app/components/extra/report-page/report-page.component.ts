import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrl: './report-page.component.scss',
})
export class ReportPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  singleReport() {
    this.router.navigateByUrl('/dashboard/reports');
  }
}
