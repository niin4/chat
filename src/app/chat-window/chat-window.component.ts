
import { ChatserverService } from './../services/chatserver.service';
import { Http } from '@angular/http';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']

})
export class ChatWindowComponent implements OnInit {
 



     @Input() messages: Array<Object> = [];

constructor(private http: Http, private chatService: ChatserverService){    }

   ngOnInit() {
  }

}




