import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Socket } from 'ngx-socket-io';
import { MissionService } from './mission.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {



  constructor(
    private socket: Socket,
    private missionService: MissionService
  ) {

    socket.on('connect', () => {
      console.log('[.IO] Socket connection established.');
    });

    socket.on('MissionUpdate', () => {
      console.log('mission update');
      this.missionService.socketUpdateTrigger();
    });
  }

}
