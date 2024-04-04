import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../_model/chat_models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private httpClient: HttpClient) { }

  public getAllChatUsers() {
    return this.httpClient.get<Chat[]>("http://localhost:8080/users");
  }
}
