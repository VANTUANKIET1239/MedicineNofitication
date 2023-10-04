import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {register} from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';
import { NewsServiceService } from '../Services/news-service/news-service.service';
import { from } from 'rxjs';
import { News } from '../models/news';

register();

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.page.html',
  styleUrls: ['./slideshow.page.scss'],
})
export class SlideshowPage implements OnInit {
  @ViewChild('swiper')
  swiperRef:ElementRef|undefined;
  swiper?=Swiper;
  ListNews:News[] = [];


  
  

  constructor(
    private temp:NewsServiceService
  ) {
    
  }

  swiperReady() {
    this.swiper=this.swiperRef?.nativeElement.swiper;
  }


  swiperSlideChanged(e:any){
    console.log('change: ',e);
  }
  ngOnInit() {
    // console.log(this.temp.News_List())
    from(this.temp.News_List()).subscribe(x=>{
      this.ListNews=x;
      console.log(this.ListNews);
    })
  }
}
