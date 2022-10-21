import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../types/game';
import { Video } from '../videos/video';
import { Channel } from '../types/channel';

const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": "c31z" })
};

@Injectable({
    providedIn: 'root'
})
export class RestService {
    private endpoint: string;
    constructor(private http: HttpClient) {
        var ip = isDevMode() ? "10.0.0.1" : "localhost";
        this.endpoint = `http://${ip}:5000/api/v1`
    }

    public getGames(): Observable<any> {
        return this.http.get(`${this.endpoint}/games`, httpOptions);
    }

    public getImages(game: string): Observable<any> {
        return this.http.get(`${this.endpoint}/game/images?game=${game}`, httpOptions);
    }

    public launchGame(game: Game): Observable<any> {
        return this.http.get(`${this.endpoint}/game/launch?name=${game.name}&emulator=${game.emulator}`, httpOptions);
    }

    public getVideos(): Observable<any> {
        return this.http.get(`${this.endpoint}/videos`, httpOptions);
    }

    public getAudioDevices(): Observable<any> {
        return this.http.get(`${this.endpoint}/system/audio`, httpOptions);
    }

    public setAudioDevice(sink: number): Observable<any> {
        return this.http.get(`${this.endpoint}/system/audio?sink=${sink}`, httpOptions);
    }

    public getCrossgameMode(): Observable<any> {
        return this.http.get(`${this.endpoint}/system/mode`, httpOptions);
    }

    public initializeDefaults(): Observable<any> {
        return this.http.get(`${this.endpoint}/system/initialize`, httpOptions);
    }

    public getChannels(): Observable<Channel[]> {
        return this.http.get<Channel[]>(`${this.endpoint}/tv/channels`, httpOptions);
    }

    public setChannel(channelNumber: number): Observable<any> {
        console.log(`${this.endpoint}/tv/channel?number=${channelNumber}`)
        return this.http.get(`${this.endpoint}/tv/channel?number=${channelNumber}`, httpOptions);
    }
}
