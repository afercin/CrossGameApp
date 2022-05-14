import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamesComponent } from './games/games.component';
import { GameThumbnailComponent } from './games/game-thumbnail/game-thumbnail.component';
import { VideosComponent } from './videos/videos.component';
import { VideoPlayerComponent } from './videos/video-player/video-player.component';
import { TvComponent } from './tv/tv.component';
import { MainComponent } from './main/main.component';
import { ClockComponent } from './clock/clock.component';
@NgModule({
    declarations: [
        AppComponent,
        GamesComponent,
        GameThumbnailComponent,
        VideosComponent,
        VideoPlayerComponent,
        TvComponent,
        MainComponent,
        ClockComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
