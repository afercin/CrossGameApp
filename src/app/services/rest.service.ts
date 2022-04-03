import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const endpoint = 'http://localhost:5000/api/v1';
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": "c31z" })
};

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  public getGames(): Observable<any> {
    return this.http.get(`${endpoint}/games`, httpOptions);
  }

  public getVideos(): Observable<any> {
    return this.http.get(`${endpoint}/videos`, httpOptions);
  }

  public getAudioDevices(): Observable<any> {
    return this.http.get(`${endpoint}/audio`, httpOptions);
  }

  public setAudioDevice(): Observable<any> {
    return this.http.get(`${endpoint}/audio?sink=1`, httpOptions);
  }
}
