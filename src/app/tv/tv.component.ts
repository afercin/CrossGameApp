import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Channel } from '../types/channel';

@Component({
    selector: 'app-tv',
    templateUrl: './tv.component.html',
    styleUrls: ['./tv.component.css'],
    providers: [
        RestService
    ]
})
export class TvComponent implements OnInit {
    channels: Channel[] = [];

    constructor(private restService: RestService, private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.restService.getChannels().subscribe({
            next: (res) => {
                this.channels = res;
                this.cdRef.detectChanges();
            },
            error: (err) => console.log(`Request failed with error: ${err}`)
        });
    }
}
