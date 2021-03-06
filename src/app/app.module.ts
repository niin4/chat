import { ChatserverService } from './services/chatserver.service';

import { StorageService } from './services/storage.service';
import { AppComponent } from './app.component';
import {APP_BASE_HREF} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChannelsNavComponent } from './channels-nav/channels-nav.component';
import { ChatWriteComponent } from './chat-write/chat-write.component';
import { ChatContainerComponent } from './chat-container/chat-container.component';
import { SetupComponent } from './setup/setup.component';
import { RouterModule } from '@angular/router';
import { ChannelSetupComponent } from './channel-setup/channel-setup.component';
import { ChannelPickerComponent } from './channel-picker/channel-picker.component';

//import * as io from 'socket.io-client';


const routeConfig = [
  {
    path: '',
    component: ChatContainerComponent
  },
  {
    path: 'setup',
    component: SetupComponent
  },
  {
    path: 'channel-setup',
    component: ChannelSetupComponent
  },
  {
    path: 'chat',
    component: ChatContainerComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ChatWindowComponent,
    ChannelsNavComponent,
    ChatWriteComponent,
    ChatContainerComponent,
    SetupComponent,
    ChannelSetupComponent,
    ChannelPickerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routeConfig, { useHash: true })
  ],
  providers: [
    StorageService,
    ChatserverService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
