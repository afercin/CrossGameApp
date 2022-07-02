import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IpcService } from '../services/ipc.service';
import { RestService } from '../services/rest.service';
import { Game } from '../types/game';
import { Channel } from '../types/channel';

@Component({
    selector: 'app-exhibitor',
    templateUrl: './exhibitor.component.html',
    styleUrls: ['./exhibitor.component.css'],
    providers: [
        RestService
    ],
    host: {
        '(document:keypress)': 'handleKeyboardEvent($event)'
    }
})
export class ExhibitorComponent implements OnInit {
    @ViewChild('scroll', { read: ElementRef }) public scroll?: ElementRef<any>;
    @ViewChild('miniature', { read: ElementRef }) public miniature?: ElementRef<any>;

    @Input() items?: any = "404";
    @Input() type: string = "";

    selectedItem: number = 0;

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
        if (this.scroll)
            this.scroll.nativeElement.scrollTop = 0;
    }

    handleKeyboardEvent(event: KeyboardEvent) {
        switch (event.key) {
            case "Enter": this.launch(this.items[this.selectedItem]); break;
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
        }
    }

    launch(item: Game | Channel): void {
        if (this.items == "404") {
            this.error.play();
            return
        }

        switch (this.type) {
            case "Games":
                this.restService.launchGame(this.items[this.selectedItem]).subscribe({
                    next: (res) => console.log(`${res["result"]}`),
                    error: (err) => console.log(`Request failed with error: ${err}`)
                });
                break;
            case "TV":
                this.restService.setChannel(this.selectedItem + 1).subscribe({
                    next: (res) => console.log(`${res["result"]}`),
                    error: (err) => console.log(`Request failed with error: ${err}`)
                });
                break;
        }
    }

    back(): void {
        this.scroll2.play();
        this.ipcService.send("change_mode", "main");
        this.router.navigate(["/"]);
    }

    moveRight(): void {
        this.selectedItem = (this.selectedItem + 1) % this.items.length;
        this.checkPosition();
    }

    moveLeft(): void {
        this.selectedItem -= 1;
        if (this.selectedItem < 0)
            this.selectedItem = this.items.length - 1;
        this.checkPosition();
    }

    moveDown(): void {
        if (this.selectedItem + 7 < this.items.length)
            this.selectedItem += 7;
        else {
            this.selectedItem %= 7;
        }
        this.checkPosition();
    }

    moveUp(): void {
        if (this.selectedItem - 7 >= 0)
            this.selectedItem -= 7
        else {
            this.selectedItem = this.selectedItem + (Math.floor((this.items.length) / 7)) * 7;
            if (this.selectedItem >= this.items.length)
                this.selectedItem = this.items.length - 1;
        }
        this.checkPosition();
    }

    checkPosition() {
        if (this.scroll != undefined && this.miniature != undefined)
            this.scroll.nativeElement.scrollTop = this.miniature.nativeElement.clientHeight * Math.floor(this.selectedItem / 7);
        this.scroll1.play();
        this.cdRef.detectChanges();
    }

}
