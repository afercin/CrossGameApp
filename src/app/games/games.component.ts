import { Component, OnInit } from '@angular/core';
import { IpcService } from '../services/ipc.service';
import { RestService } from '../services/rest.service';
import { Game } from '../../types/game';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

    games?: Game[];
    selectedGame?: Game | any;

    constructor(private restService: RestService, private ipcService: IpcService) { }

    ngOnInit(): void {
        this.restService.getGames().subscribe({
            next: (res) => {
                var games = [];
                var emulator, game;
                for (var emulatorNumber in res) 
                {
                    emulator = res[emulatorNumber];
                    for (var gameNumber in emulator["games"])
                    {
                        game = emulator["games"][gameNumber];
                        games.push(new Game(game["files"], game["name"], emulator["name"]));
                    }
                }
                games.sort((a, b) => a.name.localeCompare(b.name));
                this.games = games
            },
            error: (err) => console.log(`Request failed with error: ${err}`)
        });
    }

    launchGame(game: Game): void {
        this.ipcService.send("launch_game", game)
    }

}
