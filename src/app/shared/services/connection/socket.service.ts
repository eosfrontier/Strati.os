import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { MissionService } from '../mission.service';
import { FobService } from '../fob.service';

import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;

  constructor(
    private missionService: MissionService,
    private fobService: FobService
  ) { }

  /**
   * @description set up the SOCKET IO connections to the Watchtower API
   */
  public setupSocketConnection(): void {
    this.socket = io(environment.SERVER_URL);

    this.socket.on('connect', () => {
      console.log('[.IO] Socket connection established.');
    });

    this.socket.on('MissionUpdate', () => {
      console.log('mission update');
      this.missionService.socketUpdateTrigger();
    });

    this.socket.on('fobUpdate', () => {
      console.log('fob update');
      this.fobService.socketUpdateTrigger();
    });
  }

}
