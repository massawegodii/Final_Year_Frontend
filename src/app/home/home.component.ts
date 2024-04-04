import { Component, OnInit } from '@angular/core';
import { Chat } from '../_model/chat_models';
import { ChatService } from '../_services/chat.service';
import { DashboardService } from '../_services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../_services/snackbar.service';
import { GlobalConstant } from '../_constants/global-constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  responseMessage: any;
  data: any;

  chatDetails: Chat[] = [];
  displayedColumns: string[] = ['nickName', 'fullName', 'status'];

  constructor(
    private chatService: ChatService,
    private dashboardService: DashboardService,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,

  ) {}

  ngOnInit(): void {
    this.getAllChats();
    this.ngxService.start()
    this.dashboardDetails();
  }

  public dashboardDetails() {
    this.dashboardService.getDashboardDetails().subscribe((response: any) => {
      this.ngxService.stop();
      this.data = response;
      console.log(response);
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
    });
  }


  public getAllChats() {
    this.chatService.getAllChatUsers().subscribe(
      (response: Chat[]) => {
        this.chatDetails = response;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
