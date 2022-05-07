import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IpcService } from '../services/ipc.service';
import { RestService } from '../services/rest.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
    host: {
        '(document:keypress)': 'handleKeyboardEvent($event)'
    }
})
export class MainComponent implements OnInit {
    option: number = -1;
    optionName: string[];

    constructor(private cdRef: ChangeDetectorRef, private router: Router, private restService: RestService, private ipcService: IpcService) {
        this.optionName = ["tv", "games", "videos"]
    }


    ngOnInit(): void {
        this.restService.getCrossgameMode().subscribe({
            next: (res) => {
                var mode = res["mode"];
                if (mode != "main")
                    this.router.navigate([mode]);
                this.option = 1;
            },
            error: (err) => console.log(`Request failed with error: ${err}`)
        });
    }

    checkSelected(i: number): Object {
        var backgrounColor, borderColor;

        switch (i) {
            case 0:
                backgrounColor = "#da191e";
                borderColor = "#f71c22"
                break;
            case 1:
                backgrounColor = "#90d216";
                borderColor = "#9de518";
                break;
            case 2:
                backgrounColor = "#3095bf";
                borderColor = "#3ab4e7"
                break;
        }

        if (i == this.option) {
            backgrounColor += "99"
            borderColor += "99"
        }
        else {
            backgrounColor += "55"
            borderColor = "transparent"
        }

        return {
            "background-color": backgrounColor,
            "border": `2px solid ${borderColor}`
        };
    }

    handleKeyboardEvent(event: KeyboardEvent) {
        console.log(event.key)
        switch (event.key) {
            case "A":
            case "a":
                this.option = (this.option + 2) % 3;
                this.cdRef.detectChanges();
                break;
            case "D":
            case "d":
                this.option = (this.option + 1) % 3;
                this.cdRef.detectChanges();
                break;
            case "Enter":
                var mode = this.optionName[this.option];
                this.ipcService.send("change_mode", mode);
                this.router.navigate([mode])
                break;
        }
    }

}
