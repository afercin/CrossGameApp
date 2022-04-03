import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameThumbnailComponent } from './game-thumbnail.component';

describe('GameThumbnailComponent', () => {
  let component: GameThumbnailComponent;
  let fixture: ComponentFixture<GameThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameThumbnailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
