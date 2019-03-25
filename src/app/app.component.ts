import { Component } from '@angular/core';
import { SocketService } from './shared/services/connection/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // socket will always be on.
  constructor(private socketService: SocketService) { }
}
