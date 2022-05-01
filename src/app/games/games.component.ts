import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Game } from '../../types/game';
import { GamepadService } from 'ngx-gamepad';

enum GamepadButtons {
    A = "button0",
    B = "button1",
    Y = "button2",
    X = "button3",

    L = "button4",
    R = "button5",
    LT = "button6",
    RT = "button7",

    Select = "button8",
    Start = "button9",
    PS = "button10",

    LY = "button11",
    RY = "button12",

    Up = "up3",
    Down = "down3",
    Left = "left3",
    Right = "right3",

    L_Up = "up0",
    L_Down = "down0",
    L_Left = "left0",
    L_Right = "right0",

    R_Up = "left2",
    R_Down = "right2",
    R_Left = "up1",
    R_Right = "down1",

    LT_Pressed = "right1",
    LT_Released = "left1",

    RT_Pressed = "down2",
    RT_Released = "up2",
}

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.css'],
    providers: [
        RestService,
        GamepadService
    ]
})
export class GamesComponent implements OnInit {

    games: Game[] = [];
    selectedGame: number = 0;

    constructor(private restService: RestService, private gamepad: GamepadService, private cdRef: ChangeDetectorRef) { }

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
        
        this.gamepad.connect().subscribe(() => {
            
            this.gamepad.after(GamepadButtons.Select).subscribe(() => this.options());
            this.gamepad.after(GamepadButtons.Start).subscribe(() => this.reload());

            this.gamepad.after(GamepadButtons.A).subscribe(() => this.play());
            this.gamepad.after(GamepadButtons.B).subscribe(() => this.back());

            this.gamepad.after(GamepadButtons.Left).subscribe(() => this.moveLeft());
            this.gamepad.after(GamepadButtons.L_Left).subscribe(() => this.moveLeft());

            this.gamepad.after(GamepadButtons.Right).subscribe(() => this.moveRight());
            this.gamepad.after(GamepadButtons.L_Right).subscribe(() => this.moveRight());
        })
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
