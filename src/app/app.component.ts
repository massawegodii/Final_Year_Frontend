import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { DarkmodeService } from './_services/darkmode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  darkModeService: DarkmodeService = inject(DarkmodeService);


  ngOnInit(): void {
  }

  title = 'SAMS';
  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }
}


