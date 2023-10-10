import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailNewsPage } from './detail-news.page';

describe('DetailNewsPage', () => {
  let component: DetailNewsPage;
  let fixture: ComponentFixture<DetailNewsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailNewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
