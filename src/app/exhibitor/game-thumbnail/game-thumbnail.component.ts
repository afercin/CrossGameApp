import { Component, Input, isDevMode, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { Game } from '../../types/game';

@Component({
    selector: 'app-game-thumbnail',
    templateUrl: './game-thumbnail.component.html',
    styleUrls: ['./game-thumbnail.component.css']
})
export class GameThumbnailComponent implements OnInit {
    @Input() game?: Game;

    ready: boolean;
    imagePath: string;
    miniaturePath: string;

    constructor(private restService: RestService) {
        this.ready = false;
        this.imagePath = "assets/images/DefaultBg.jpg";
        this.miniaturePath = "assets/images/DefaultM.jpg";
    }

    ngOnInit(): void {
        if (this.game != undefined)
            this.restService.getImages(this.game.name).subscribe({
                next: (res) => {
                    if (this.game != undefined) {
                        for (var imageNumber in res) {
                            if (res[imageNumber].indexOf("_miniature") !== -1)
                                this.miniaturePath = isDevMode() ? `http://10.0.0.1:5000/api/v1/game/image?path=${res[imageNumber]}` : res[imageNumber];
                            else
                                this.imagePath = isDevMode() ? `http://10.0.0.1:5000/api/v1/game/image?path=${res[imageNumber]}` : res[imageNumber];
                        }
                    }
                    this.ready = true;
                },
                error: (err) => console.log(`Request failed with error: ${err}`)
            });
    }

}
