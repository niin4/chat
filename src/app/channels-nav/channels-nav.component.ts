import { StorageService } from './../services/storage.service';
import { Http } from '@angular/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-channels-nav',
  templateUrl: './channels-nav.component.html',
  styleUrls: ['./channels-nav.component.scss']
})
export class ChannelsNavComponent implements OnInit {

  @Output() changeChannel = new EventEmitter();

  @Input() channels = [];
  @Input() messageNotifiers: Array<number> = [];
  @Input() activeChannel: Array<boolean>;


  private active;

  constructor(private storage: StorageService, private http: Http) {   }


   changeActiveChannel(id: string) {
     this.active = id;
     this.changeChannel.emit(this.active);
   }

  ngOnInit() {
  }

