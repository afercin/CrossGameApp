import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../games/game';
import { Video } from '../videos/video';

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

    public getImages(game: string): Observable<any> {
        return this.http.get(`${endpoint}/game/images?game=${game}`, httpOptions);
    }

    public launchGame(game: Game): Observable<any> {
        return this.http.get(`${endpoint}/game/launch?name=${game.name}&emulator=${game.emulator}`, httpOptions);
    }

    public getVideos(): Observable<any> {
        return this.http.get(`${endpoint}/videos`, httpOptions);
    }

    public openVideo(video: Video): Observable<any> {
        return this.http.get(`${endpoint}/video/open?path=${video.fullPath}`, httpOptions);
    }

    public getAudioDevices(): Observable<any> {
        return this.http.get(`${endpoint}/system/audio`, httpOptions);
    }

    public setAudioDevice(sink: number): Observable<any> {
        return this.http.get(`${endpoint}/system/audio?sink=${sink}`, httpOptions);
    }

    public getCrossgameMode(): Observable<any> {
        return this.http.get(`${endpoint}/system/mode`, httpOptions);
    }
}
