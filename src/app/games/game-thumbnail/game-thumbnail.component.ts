import { Component, Input, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { Game } from '../../../types/game';

@Component({
  selector: 'app-game-thumbnail',
  templateUrl: './game-thumbnail.component.html',
  styleUrls: ['./game-thumbnail.component.css']
})
export class GameThumbnailComponent implements OnInit {

  @Input() game?: Game;
  overlay: boolean;
  imagePath: string;
  miniaturePath: string;

  constructor(private restService: RestService) {
    this.overlay = true;
    this.imagePath = "assets/images/DefaultBg.jpg";
    this.miniaturePath = "assets/images/DefaultM.jpg";
  }

  ngOnInit(): void {
    if (this.game != undefined)
      this.restService.getImages(this.game.name).subscribe({
        next: (res) => {
          for (var imageNumber in res)
            if (res[imageNumber].indexOf("_miniature") !== -1)
              this.miniaturePath = res[imageNumber];
            else
              this.imagePath = res[imageNumber];
        },
        error: (err) => console.log(`Request failed with error: ${err}`)
      });
  }

}
