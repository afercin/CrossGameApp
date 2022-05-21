import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IpcService } from 'src/app/services/ipc.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {

  @ViewChild('videoPlayer') videoplayer: ElementRef | undefined;

  videoPath = "/home/afercin/video.mp4";
  constructor(private ipcService: IpcService) { }

  ngOnInit(): void {
    this.ipcService.send("change_mode", "video-player");
  }

  toggleVideo() {
      console.log("hola")
      if (this.videoplayer){

          this.videoplayer.nativeElement.play();
          this.videoplayer.nativeElement.pause();
          console.log("pepe")
          console.log(this.videoplayer)
          console.log(this.videoplayer.nativeElement)

      }
  }

}
