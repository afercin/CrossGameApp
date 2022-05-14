import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Game } from './game';
import { Router } from '@angular/router';
import { IpcService } from '../services/ipc.service';

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
    @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any> | undefined;
    @ViewChild('miniature', { read: ElementRef }) public miniature: ElementRef<any> | undefined;

    games: Game[] = [];
    selectedGame: number = 0;
    maxY: number = 0;

    scroll1: any;
    scroll2: any;
    error: any;

    constructor(private restService: RestService, private cdRef: ChangeDetectorRef, private router: Router, private ipcService: IpcService) { 
        this.scroll1 = new Audio();
        this.scroll1.src = "assets/sounds/scroll1.wav"
        this.scroll1.load()

        this.scroll2 = new Audio();
        this.scroll2.src = "assets/sounds/scroll2.wav"
        this.scroll1.load()

        this.error = new Audio();
        this.error.src = "assets/sounds/error.wav"
        this.error.load()
    }

    ngOnInit(): void {
        this.searchGames();
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

    handleKeyboardEvent(event: KeyboardEvent) {
        switch (event.key) {
            case "Enter": this.launchGame(this.games[this.selectedGame]); break;
            case "Q":
            case "q": this.back(); break;
            case "A":
            case "a": this.moveLeft(); break;
            case "D":
            case "d": this.moveRight(); break;
            case "S":
            case "s": this.moveDown(); break;
            case "W":
            case "w": this.moveUp(); break;
            case "O":
            case "o": this.options(); break;
            case "R":
            case "r": this.searchGames(); break;
        }
    }

    options(): void {
        console.log("Openning options");
    }

    back(): void {
        this.scroll2.play();
        this.ipcService.send("change_mode", "main");
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
        this.scroll1.play();
        this.cdRef.detectChanges();
    }

    launchGame(game: Game): void {
        if (this.games.length > 0) {
            this.restService.launchGame(this.games[this.selectedGame]).subscribe({
                next: (res) => console.log(`${res["result"]}`),
                error: (err) => console.log(`Request failed with error: ${err}`)
            });
        }
        else
            this.error.play();
    }

}
