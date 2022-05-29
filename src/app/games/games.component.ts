import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Game } from '../types/game';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.css'],
    providers: [
        RestService
    ]
})
export class GamesComponent implements OnInit {
    games: Game[] = [];

    constructor(private restService: RestService, private cdRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.restService.getGames().subscribe({
            next: (res) => {
                var games = [];
                var emulator, game;
                for (var emulatorNumber in res) {
                    emulator = res[emulatorNumber];
                    for (var gameNumber in emulator["games"]) {
                        game = emulator["games"][gameNumber];
                        games.push(new Game(game["files"], game["name"], emulator["name"]));
                    }
                }
                games.sort((a, b) => a.name.localeCompare(b.name));
                this.games = games;
                this.cdRef.detectChanges();
            },
            error: (err) => console.log(`Request failed with error: ${err}`)
        });
    }
}
