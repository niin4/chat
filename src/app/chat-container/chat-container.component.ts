import { ChatserverService } from './../services/chatserver.service';
import { StorageService } from './../services/storage.service';
import { Http } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';



import 'rxjs/add/operator/switchMap';

var moment = require('moment');

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit {

  private channelsInfo: any;
  private user: any;
  private active;

  messages = [];
  connection;
  message;

  private channel: number;
  private activeChannels;
  private messagesArray: Array<Object> = [];
  private sendActive: Array<boolean> = [];
  private notifyOfMessages: Array<number> = [];

  constructor(private cRouter: Router, private chatServer: ChatserverService, private storage: StorageService, private http: Http) { }

     relayMessage(event: string) {

       // http://stackoverflow.com/a/11446757
          var time= (function () {
          var year = new Date(new Date().getFullYear().toString()).getTime();
          return function () {
            return Date.now() - year
          }
          })();

          let now = time();
          this.chatServer.sendMessage(event, this.active, this.user.name, now);
      }

      addNewChannel(event: Object) {
          this.chatServer.joinChannel(event['ch_id']);
          this.storage.addChannel(event);
          this.activeChannels = this.storage.getChannels();
          this.handleUserUpdated(event['ch_id']);
      }

      ngOnInit() {

        // If no user in localstorage, point to setup
            this.active = localStorage.getItem('active');
            this.sendActive[this.active] = true;
            this.user = JSON.parse(localStorage.getItem('user'));

            // init new server connection
            //join room on server
          this.connection = this.chatServer.init();
          this.chatServer.joinChannel(this.active);

            //get old messages from database
          this.connection = this.chatServer.getOldMessages().subscribe(
              (res: Array<Object>) => {

                //highlight name mentions
                let user = JSON.parse(localStorage.getItem('user'));
                let username = user['name'];
                for (let key of res) {
                    var n = key['msg_content'].search('@' + this.user['name']);
                    if (n >= 0) {
                      key['msg_highlight'] = true;
                    } else {
                      key['msg_highlight'] = false;
                    }
                  } 
                this.messagesArray = res;
               });

               this.chatServer.askOldMessages(this.active);

            // get saved channels from localstorage,
            // join those on server
            this.activeChannels = this.storage.getChannels();
            this.chatServer.joinSavedChannels(this.activeChannels); 


            // subscribe to new messages
            this.connection = this.chatServer.getMessages().subscribe( response => {

                // check if active channel got message,
                // otherwise give notice that some hidden channel got it
                if (this.active === response['msg_channel']) {

                    var n = response['msg_content'].search('@' + this.user['name']);
                    if (n >= 0) {
                          response['msg_highlight'] = true;
                    } else {
                          response['msg_highlight'] = false;
                    }
                    this.messagesArray.push(response);
                    console.log('oikea kanava sai viestin');
                } else {
                  if (this.notifyOfMessages[response['msg_channel']] == null) {
                          this.notifyOfMessages[response['msg_channel']] = 1;
                  } else {
                          this.notifyOfMessages[response['msg_channel']] = this.notifyOfMessages[response['msg_channel']] + 1;
                  }
                  console.log('muukanava sai viestin');
                }
            });

      }

      ngOnDestroy () {
        this.connection.unsubscribe();
        this.storage.removeChannels();
      }

      logOut = () => {
            this.connection.unsubscribe();
            this.cRouter.navigate(['setup']);
      }

      handleUserUpdated(id: string) {
            this.active = id;
            this.sendActive = [];
            this.notifyOfMessages[id] = null;
            this.sendActive[id] = true;
            localStorage.setItem('active', id);
            this.chatServer.askOldMessages(this.active);
        };

}


