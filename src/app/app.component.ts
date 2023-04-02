import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { IpcService } from './services/ipc.service';
import { RestService } from './services/rest.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    currentMode: string;
    title = 'CrossGame';
    backgroundPath = "/opt/crossgameapp/media/background/default.mp4";
    startUp: any;

    constructor(private restService: RestService, private ipcService: IpcService, private cdRef: ChangeDetectorRef) {
        this.currentMode = "main";
        this.startUp = new Audio();
        this.startUp.src = "/opt/crossgameapp/media/audio/startup.wav"
        this.startUp.load()
    }

    ngOnInit(): void {
        this.restService.initializeDefaults().subscribe({
            next: (res) => console.log("Done"),
            error: (err) => console.log(`Request failed with error: ${err}`),
            complete: () => this.startUp.play()
        })
        this.ipcService.on("change_mode", (event: any, arg: string) => {
            this.currentMode = arg;
            this.cdRef.detectChanges();
        });
    }
}
