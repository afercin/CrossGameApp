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
    backgroundPath = "/rpi/resources/background/Hi-Tech.mp4";
    startUp: any;

    constructor(private restService: RestService, private ipcService: IpcService, private cdRef: ChangeDetectorRef) {
        this.currentMode = "app";
        this.startUp = new Audio();
        this.startUp.src = "assets/sounds/startup.wav"
        this.startUp.load()
    }

    ngOnInit(): void {
        this.restService.initializeDefaults().subscribe({
            next: (res) => this.startUp.play(),
            error: (err) => console.log(`Request failed with error: ${err}`)}
        )
        this.ipcService.on("change_mode", (event: any, arg: string) => {
            this.currentMode = arg;
            this.cdRef.detectChanges();
        });
    }
}
