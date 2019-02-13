import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;
  // public weatherData: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.initSocket();
    // this.getWeatherDataFromAPI().subscribe((weather) => {
    //   this.setWeatherData(weather);
    // });
  }

  public initSocket(): void {
    this.socket = socketIo(environment.SOCKET.API_URL);
  }

  // public getWeatherData(): Observable<any> {
  //   return this.weatherData.asObservable();
  // }

  // private setWeatherData(data): void {
  //   this.weatherData.next(data);
  // }

  // private getWeatherDataFromAPI(): Observable<any> {
  //   return this.http.get(environment.WEATHER.API_URL).pipe(map(res => {
  //     return res;
  //   }));
  // }
}
