import { Component, OnDestroy, OnInit } from '@angular/core';
import { RestService } from './services/rest.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'CrossGame';

    constructor(private restService: RestService) { }

    ngOnInit(): void {
        this.restService.initializeDefaults().subscribe()
    }
}
