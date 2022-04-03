import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IpcService } from './services/ipc.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any> | undefined;
    title = 'AutoKenjo';
    message: string = "";
    username: string = "";
    password: string = "";

    constructor(private ipcService: IpcService, private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.ipcService.on("log", (event: any, arg: string) => {
            this.printMsg(arg);
        });

        this.ipcService.on("info", (event: any, arg: string) => {
            this.printMsg(`<span class="info">${arg}</span>`);
        });

        this.ipcService.on("warn", (event: any, arg: string) => {
            this.printMsg(`<span class="warn">${arg}</span>`);
        });

        this.ipcService.on("error", (event: any, arg: string) => {
            this.printMsg(`<span class="error">${arg}</span>`);
        });

        this.ipcService.on("get_credentials", (event: any, arg: any) => {
            this.username = arg[0] == "" ? this.username : arg[0];
            this.password = arg[1] == "" ? this.password : arg[1];
            this.cdRef.detectChanges();
        });

        this.ipcService.send("get_credentials");
    }

    printMsg(msg: string): void {
        this.message += `${msg}<br/>`;
        this.cdRef.detectChanges();
        if (this.scroll != undefined)
            this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
    }

    ngOnDestroy(): void {
        this.ipcService.removeAllListeners("log");
        this.ipcService.removeAllListeners("info");
        this.ipcService.removeAllListeners("error");
        this.ipcService.removeAllListeners("warn");
        this.ipcService.removeAllListeners("credentials");
    }

    incur(): void {
        this.message = "";
        this.ipcService.send("get_credentials");
        this.ipcService.send("button_click", ["incur", this.username, this.password]);
    }

    report(): void {
        this.message = "";
        this.ipcService.send("button_click", ["report", this.username, this.password]);
    }
}
