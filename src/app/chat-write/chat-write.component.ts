
import { StorageService } from './../services/storage.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chat-write',
  templateUrl: './chat-write.component.html',
  styleUrls: ['./chat-write.component.scss']
})
export class ChatWriteComponent implements OnInit {

  private user: any = {};
  private text: string = '';

  @Input() channel;

  @Output()
  message: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  sendText(text) {
    this.message.emit(text);
    this.text = '';
  }

}
