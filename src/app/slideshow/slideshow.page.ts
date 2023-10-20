import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {register} from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';
import { NewsServiceService } from '../Services/news-service/news-service.service';
import { from } from 'rxjs';
import { News } from '../models/news';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';


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
    private temp:NewsServiceService,
    private router: Router,
    private navCtrl: NavController,
  ) {
    
  }

  swiperReady() {
    this.swiper=this.swiperRef?.nativeElement.swiper;
  }

  viewDetail(id: string) {
    if(id == ''){
      //this.ShowNofitication('Có lỗi xảy ra, vui lòng thử lại sau');
      return;
  }
    let paras:any = {
        id: id
    }
    this.NavigateToPage('/detail-news',paras)
  };
  navigateToTab2() {
    this.router.navigate(['/main/news']);
  };
  
  NavigateToPage(url:string, paras?:any){
    if(paras){
      console.log(paras);
      const navigationExtras: NavigationExtras = {
        queryParams: paras
      };
      this.navCtrl.navigateForward(url,navigationExtras);
    }
    else{
      this.navCtrl.navigateForward(url);
    }
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
