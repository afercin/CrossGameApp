import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
    host: {
        '(document:keypress)': 'handleKeyboardEvent($event)'
    }
})
export class MainComponent implements OnInit {
    option: number = 1;
    optionName: string[];

    constructor(private cdRef: ChangeDetectorRef, private route: Router) {
        this.optionName = ["tv","games","videos"]
    }


    ngOnInit(): void {
    }

    checkSelected(i: number): Object {
        var backgrounColor, borderColor;

        switch(i) {
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

        if (i == this.option){
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
        console.log(`Main Keypress: ${event.key}`);
        switch (event.key){
            case "a":
                this.option = (this.option + 2) % 3;
                this.cdRef.detectChanges();
                break;
            case "d":
                this.option = (this.option + 1) % 3;
                this.cdRef.detectChanges();
                break;
            case "Enter":
                this.route.navigate([this.optionName[this.option]])
                break;

        }
    }

}
