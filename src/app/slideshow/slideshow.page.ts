import { AfterViewInit, Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Prescription } from '../models/prescription';
import { from } from 'rxjs';
import { LoadingController, NavController } from '@ionic/angular';
import { ComponentBase } from '../shared/ComponentBase/ComponentBase';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.page.html',
  styleUrls: ['./slideshow.page.scss'],
})
export class SlideshowPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
