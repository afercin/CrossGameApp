import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit, OnDestroy {

  date: Date = new Date();

  time = new Date();
  intervalId: any;
  radius = 15;
  stroke_width = this.radius / 5;

  constructor() {
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  rotateHour(): string {
    return `rotate(${this.time.getHours() * 30 + Math.floor(this.time.getMinutes() * 15 / 60)}, ${this.radius}, ${this.radius})`;
  }

  rotateMinute(): string {
    return `rotate(${90 + this.time.getMinutes() * 6 + Math.floor(this.time.getSeconds() / 10)}, ${this.radius}, ${this.radius})`;
  }

}
