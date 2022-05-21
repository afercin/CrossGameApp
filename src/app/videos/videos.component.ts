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
    @ViewChild('scroll', { read: ElementRef }) scroll?: ElementRef;
    @ViewChild('miniature', { read: ElementRef }) miniature?: ElementRef;
    @ViewChild('videoPlayer', { read: ElementRef }) videoplayer?: ElementRef;

    videos: Video[] = [];
    selectedVideo: number = 0;

    playing: boolean = false;
    paused: boolean = false;
    progress: number = 0;

    scroll1: any;
    scroll2: any

    constructor(private restService: RestService, private cdRef: ChangeDetectorRef, private router: Router, private ipcService: IpcService) { 
        this.scroll1 = new Audio();
        this.scroll1.src = "assets/sounds/scroll1.wav"
        this.scroll1.load()

        this.scroll2 = new Audio();
        this.scroll2.src = "assets/sounds/scroll2.wav"
        this.scroll1.load()
    }

    ngOnInit(): void {
        this.searchVideos()
    }

    searchVideos(): void {
        this.restService.getVideos().subscribe({
            next: (res) => {
                var videos = [];
                var name, path, extension;
                for (var i in res) {
                    path = res[i];
                    name = path.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, "");
                    extension = path.substring(path.lastIndexOf('.') + 1);
                    videos.push(new Video(name, path, extension));
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
        switch (event.key) {
            case "Enter": this.openVideo(); break;
            case "A":
            case "a": this.backward(); break;
            case "d":
            case "D": this.forward(); break;
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

    backward(): void {
        if (this.playing && this.videoplayer) {
            var currentTime = this.videoplayer.nativeElement.currentTime - 10;
            this.videoplayer.nativeElement.currentTime = currentTime >= 0 ? currentTime : 0;
        }
    }

    forward(): void {
        if (this.playing && this.videoplayer) {
            var currentTime = this.videoplayer.nativeElement.currentTime + 10;
            var duration = this.videoplayer.nativeElement.duration;
            this.videoplayer.nativeElement.currentTime = currentTime <= duration ? currentTime : duration;
        }
    }

    moveDown(): void {
        if (!this.playing) {
            this.scroll1.play();
            this.selectedVideo = (this.selectedVideo + 1) % this.videos.length;
            this.checkPosition();
        } else if (this.playing && this.videoplayer) {
            var currentTime = this.videoplayer.nativeElement.currentTime -= 60;
            this.videoplayer.nativeElement.currentTime = currentTime >= 0 ? currentTime : 0;
        }
    }

    moveUp(): void {
        if (!this.playing) {
            this.scroll1.play();
            this.selectedVideo -= 1
            if (this.selectedVideo < 0)
                this.selectedVideo = this.videos.length - 1;
            this.checkPosition();
        } else if (this.playing && this.videoplayer) {
            var currentTime = this.videoplayer.nativeElement.currentTime += 60;
            var duration = this.videoplayer.nativeElement.duration;
            this.videoplayer.nativeElement.currentTime = currentTime <= duration ? currentTime : duration;
        }
    }

    back(): void {
        this.ipcService.send("change_mode", this.playing ? "videos" : "main");
        if (!this.playing) {
            this.scroll2.play();
            this.router.navigate(["/"]);
        }

        this.playing = !this.playing;
    }

    checkPosition() {
        if (this.scroll && this.miniature)
            this.scroll.nativeElement.scrollTop = this.miniature.nativeElement.clientHeight * this.selectedVideo;

        this.cdRef.detectChanges();
    }

    openVideo(): void {
        if (this.playing) {
            if (this.paused)
                this.videoplayer?.nativeElement.play();
            else {
                this.videoplayer?.nativeElement.pause();
                this.progress = this.videoplayer?.nativeElement.currentTime * 100 / this.videoplayer?.nativeElement.duration;
            }
            this.paused = !this.paused;
        }
        else if (this.videos.length > 0) {
            this.ipcService.send("change_mode", "video-player");
            this.playing = true;
            this.paused = false;
            console.log(this.videos[this.selectedVideo].name)
            console.log(this.videos[this.selectedVideo].extension)
            console.log(this.videos[this.selectedVideo].path)
        }
    }

}
