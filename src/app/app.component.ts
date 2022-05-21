import { Component, OnInit } from '@angular/core';
import { RestService } from './services/rest.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'CrossGame';
    backgroundPath = "/rpi/resources/background/Hi-Tech.mp4";
    startUp: any;

    constructor(private restService: RestService) {
        this.startUp = new Audio();
        this.startUp.src = "assets/sounds/startup.wav"
        this.startUp.load()
    }

    ngOnInit(): void {
        this.restService.initializeDefaults().subscribe({
            next: (res) => this.startUp.play(),
            error: (err) => console.log(`Request failed with error: ${err}`)}
        )
    }
}
