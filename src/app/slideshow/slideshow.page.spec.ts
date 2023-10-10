// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { SlideshowPage } from './slideshow.page';

// describe('SlideshowPage', () => {
//   let component: SlideshowPage;
//   let fixture: ComponentFixture<SlideshowPage>;

//   beforeEach(async(() => {
//     fixture = TestBed.createComponent(SlideshowPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   }));

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
// slideshow.page.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { SlideshowPage } from './slideshow.page'; // Import SlideshowPage thay vì Tab1Page

describe('SlideshowPage', () => {
  let component: SlideshowPage;
  let fixture: ComponentFixture<SlideshowPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlideshowPage], // Sử dụng SlideshowPage thay vì Tab1Page
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SlideshowPage); // Tạo SlideshowPage thay vì Tab1Page
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
