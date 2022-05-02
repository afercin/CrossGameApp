import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Game } from '../../types/game';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.css'],
    providers: [
        RestService
    ],
    host: {
        '(document:keypress)': 'handleKeyboardEvent($event)'
    }
})
export class GamesComponent implements OnInit {

    games: Game[] = [];
    selectedGame: number = 0;

    constructor(private restService: RestService, private cdRef: ChangeDetectorRef) { }

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

    handleKeyboardEvent(event: KeyboardEvent) {
        switch (event.key){
            case "Enter": this.play(); break;
            case "q": this.back(); break;
            case "a": this.moveLeft(); break;
            case "d": this.moveRight(); break;
            case "o": this.options(); break;
            case "r": this.reload(); break;
        }
    }

    options(): void {
        console.log("Openning options");
    }
    
    play(): void {
        this.launchGame(this.games[this.selectedGame])
    }

    reload(): void {
        console.log("Reload page");
    }
    
    back(): void {
        console.log("Returning to main menu");
    }

    moveRight(): void {
        this.selectedGame += 1;
        this.selectedGame %= this.games.length;
        this.cdRef.detectChanges();
    }

    moveLeft(): void {
        this.selectedGame -= 1;
        if (this.selectedGame < 0)
            this.selectedGame = this.games.length -1;
        this.cdRef.detectChanges();
    }

    launchGame(game: Game): void {
        console.log(`Playing ${game.name}`);        
    }

}
