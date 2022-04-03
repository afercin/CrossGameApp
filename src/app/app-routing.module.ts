import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameLauncherComponent } from './games/game-launcher/game-launcher.component';
import { GamesComponent } from './games/games.component';
import { MainComponent } from './main/main.component';
import { TvComponent } from './tv/tv.component';
import { VideoPlayerComponent } from './videos/video-player/video-player.component';
import { VideosComponent } from './videos/videos.component';

const routes: Routes = [
  {
    path: "main",
    component: MainComponent
  },
  {
    path: "games",
    component: GamesComponent,
    children: [
      {
        path: "launcher",
        component: GameLauncherComponent
      }
    ]
  },
  { 
    path: "videos", 
    component: VideosComponent,
    children: [
      {
        path: "player",
        component: VideoPlayerComponent
      }
    ]
  },
  { 
    path: "tv", 
    component: TvComponent 
  },
  {
    path: "",
    redirectTo: "/videos", 
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
