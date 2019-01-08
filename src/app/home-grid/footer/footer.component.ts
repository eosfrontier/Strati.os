import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'app-grid-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  $weather: any;
  ioConnection: any;

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.getWeatherData().subscribe(res => {
      console.log(res);
      this.$weather = res;
    });
  }

}
