import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {register} from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';

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

  News = [
    {id: 1, img: 'https://i.ytimg.com/vi/uS-j17YNKrM/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAz-bKzEMJTAN_EX5DHW1WhsIlGTg', title: 'Indian', detail:'https://thanhnien.vn/suc-khoe.htm'},
    {id: 2, img: 'https://i.ytimg.com/vi/uS-j17YNKrM/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAz-bKzEMJTAN_EX5DHW1WhsIlGTg', title: 'Italian', detail:'https://thanhnien.vn/suc-khoe.htm'},
    {id: 8, img: 'https://i.ytimg.com/vi/uS-j17YNKrM/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAz-bKzEMJTAN_EX5DHW1WhsIlGTg', title: 'Rolls', detail:'https://thanhnien.vn/suc-khoe.htm'},
    {id: 7, img: 'https://i.ytimg.com/vi/uS-j17YNKrM/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAz-bKzEMJTAN_EX5DHW1WhsIlGTg', title: 'Burgers', detail:'https://thanhnien.vn/suc-khoe.htm'},
    {id: 3, img: 'https://i.ytimg.com/vi/uS-j17YNKrM/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAz-bKzEMJTAN_EX5DHW1WhsIlGTg', title: 'Mexican', detail:'https://thanhnien.vn/suc-khoe.htm'},
    {id: 4, img: 'https://i.ytimg.com/vi/uS-j17YNKrM/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAz-bKzEMJTAN_EX5DHW1WhsIlGTg', title: 'American', detail:'https://thanhnien.vn/suc-khoe.htm'},
    {id: 5, img: 'https://i.ytimg.com/vi/uS-j17YNKrM/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAz-bKzEMJTAN_EX5DHW1WhsIlGTg', title: 'Chinese', detail:'https://thanhnien.vn/suc-khoe.htm'},
    {id: 6, img: 'https://i.ytimg.com/vi/uS-j17YNKrM/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAz-bKzEMJTAN_EX5DHW1WhsIlGTg', title: 'Sea Food', detail:'https://thanhnien.vn/suc-khoe.htm'},
  ];
  
  

  constructor() { }

  swiperReady() {
    this.swiper=this.swiperRef?.nativeElement.swiper;
  }


  swiperSlideChanged(e:any){
    console.log('change: ',e);
  }
  ngOnInit() {
    
  }

}
