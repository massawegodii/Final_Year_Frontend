import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Message } from '../_model/message_model';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  public sendMessage(data: any) {
    return this.httpClient.post<Message[]>("http://localhost:8080/send/sms", data);
  }
}
