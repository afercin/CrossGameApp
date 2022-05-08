import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IpcService } from '../services/ipc.service';
import { RestService } from '../services/rest.service';
import { Video } from './video';

@Component({
    selector: 'app-videos',
    templateUrl: './videos.component.html',
    styleUrls: ['./videos.component.css'],
    providers: [
        RestService
    ],
    host: {
        '(document:keypress)': 'handleKeyboardEvent($event)'
    }
})
export class VideosComponent implements OnInit {
    @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any> | undefined;
    @ViewChild('miniature', { read: ElementRef }) public miniature: ElementRef<any> | undefined;

    videos: Video[] = [];
    selectedVideo: number = 0;

    constructor(private restService: RestService, private cdRef: ChangeDetectorRef, private router: Router, private ipcService: IpcService) { }

    ngOnInit(): void {
        this.searchVideos()
    }

    searchVideos(): void {
        this.restService.getVideos().subscribe({
            next: (res) => {
                var videos = [];
                var name, fullPath;
                for (var i in res){
                    name = res[i].replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, "");
                    fullPath = res[i];
                    videos.push(new Video(name, fullPath))
                }

                videos.sort((a, b) => a.name.localeCompare(b.name));
                this.videos = videos;

                if (this.scroll != null)
                    this.scroll.nativeElement.scrollTop = 0;
                
                this.cdRef.detectChanges();
            },
            error: (err) => console.log(`Request failed with error: ${err}`)
        });
    }

    handleKeyboardEvent(event: KeyboardEvent) {
        console.log(event.key)
        switch (event.key) {
            case "Enter": this.openVideo(this.videos[this.selectedVideo]); break;
            case "Q":
            case "q": this.back(); break;
            case "S":
            case "s": this.moveDown(); break;
            case "W":
            case "w": this.moveUp(); break;
            case "R":
            case "r": this.searchVideos(); break;
        }
    }

    back(): void {
        this.ipcService.send("change_mode", "main");
        this.router.navigate(["/"]);
    }

    moveDown(): void {
        this.selectedVideo = (this.selectedVideo + 1) % this.videos.length;
        this.checkPosition();
    }

    moveUp(): void {
        this.selectedVideo -= 1
        if (this.selectedVideo < 0)
            this.selectedVideo = this.videos.length - 1;
        this.checkPosition();
    }

    checkPosition() {
        if (this.scroll != undefined && this.miniature != undefined)
            this.scroll.nativeElement.scrollTop = this.miniature.nativeElement.clientHeight * this.selectedVideo;

        this.cdRef.detectChanges();
    }

    openVideo(video: Video): void {
        if (this.videos.length > 0)
            this.restService.openVideo(this.videos[this.selectedVideo]).subscribe({
                next: (res) => console.log(`${res["result"]}`),
                error: (err) => console.log(`Request failed with error: ${err}`)
            });
    }

}
