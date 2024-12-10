import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Shuttle } from '../models/shuttle';
import { environment } from '../../../environments/environment';
// import { MOCK_SHUTTLES } from './shuttles.mock';


@Injectable({
    providedIn: 'root'
})
export class ShuttleService {

    apiSubscription: Subscription;
    shuttleList: BehaviorSubject<Shuttle[]> = new BehaviorSubject(null);

    constructor(private http: HttpClient) {
        this.renewApiSubscription();
    }

    public getShuttleList(): Observable<Shuttle[]> {
        return this.shuttleList.asObservable();
    }

    private setShuttleList(list: Shuttle[]): void {
        const _shuttles = []

        list.forEach((shuttle) => {
            const _shuttle = new Shuttle();
            _shuttle.id = shuttle.id;
            _shuttle.name = shuttle.name;
            _shuttle.serial_number = shuttle.serial_number;
            _shuttle.class = shuttle.class;
        })

        this.shuttleList.next(list);
    }

    private getShuttlesFromAPI(): any {
        const headerDict = {
            'getAll': 'true'
        }

        const requestOptions = {
            headers: new Headers(headerDict),
        };
        return this.http.get(environment.SHUTTLE.API_URL, requestOptions).pipe(map(res => {
            return res
        }));
    }

    private renewApiSubscription(): void {
        this.apiSubscription = this.getShuttlesFromAPI().subscribe((shuttles) => {
            this.setShuttleList(shuttles);
        })
    }


}