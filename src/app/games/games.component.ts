import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Game } from '../../types/game';
import { Router } from '@angular/router';
import { IpcService } from '../services/ipc.service';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.css'],
    providers: [
        RestService
    ]
})
export class GamesComponent implements OnInit {
    @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any> | undefined;
    @ViewChild('miniature', { read: ElementRef }) public miniature: ElementRef<any> | undefined;

    games: Game[] = [];
    selectedGame: number = 0;
    maxY: number = 0;

    constructor(private restService: RestService, private cdRef: ChangeDetectorRef, private router: Router, private ipcService: IpcService) {
        this.ipcService.on("send_keys_games", (event: any, arg: string) => this.handleKeyboardEvent(arg));
        this.searchGames();
    }

    ngOnInit(): void {
    }

    searchGames(): void {
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
                if (this.scroll != null)
                    this.scroll.nativeElement.scrollTop = 0;
                this.cdRef.detectChanges();
                this.maxY = Math.floor((this.games.length) / 7);
            },
            error: (err) => console.log(`Request failed with error: ${err}`)
        });
    }

    handleKeyboardEvent(key: string) {
        console.log(key)
        switch (key) {
            case "Enter": this.launchGame(this.games[this.selectedGame]); break;
            case "Q": this.back(); break;
            case "A": this.moveLeft(); break;
            case "D": this.moveRight(); break;
            case "S": this.moveDown(); break;
            case "W": this.moveUp(); break;
            case "O": this.options(); break;
            case "R": this.searchGames(); break;
        }
    }

    options(): void {
        console.log("Openning options");
    }

    back(): void {
        this.ipcService.send("change_mode", "main")
        this.router.navigate(["/"]);
    }

    moveRight(): void {
        this.selectedGame = (this.selectedGame + 1) % this.games.length;
        this.checkPosition();
    }

    moveLeft(): void {
        this.selectedGame -= 1;
        if (this.selectedGame < 0)
            this.selectedGame = this.games.length - 1;
        this.checkPosition();
    }

    moveDown(): void {
        if (this.selectedGame + 7 < this.games.length)
            this.selectedGame += 7;
        else {
            this.selectedGame %= 7;
        }
        this.checkPosition();
    }

    moveUp(): void {
        if (this.selectedGame - 7 >= 0)
            this.selectedGame -= 7
        else {
            this.selectedGame = this.selectedGame + (this.maxY - 1) * 7;
            if (this.selectedGame >= this.games.length)
                this.selectedGame = this.games.length - 1;
        }
        this.checkPosition();
    }

    checkPosition() {
        if (this.scroll != undefined && this.miniature != undefined)
            this.scroll.nativeElement.scrollTop = this.miniature.nativeElement.clientHeight * Math.floor(this.selectedGame / 7);

        this.cdRef.detectChanges();
    }

    launchGame(game: Game): void {
        if (this.games.length > 0)
            this.restService.launchGame(this.games[this.selectedGame]).subscribe({
                next: (res) => console.log(`${res["result"]}`),
                error: (err) => console.log(`Request failed with error: ${err}`)
            });
    }

}
