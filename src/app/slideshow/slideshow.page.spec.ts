import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlideshowPage } from './slideshow.page';

describe('SlideshowPage', () => {
  let component: SlideshowPage;
  let fixture: ComponentFixture<SlideshowPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SlideshowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
