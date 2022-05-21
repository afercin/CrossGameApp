import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games/games.component';
import { MainComponent } from './main/main.component';
import { TvComponent } from './tv/tv.component';
import { VideosComponent } from './videos/videos.component';

const routes: Routes = [
    { path: "main", component: MainComponent },
    { path: "games", component: GamesComponent },
    { path: "videos", component: VideosComponent },
    { path: "tv", component: TvComponent },
    { path: "", redirectTo: "/main", pathMatch: "full" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}