import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ArticlesModule } from './articles.module';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.page.html',
  styleUrls: ['./articles.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ArticlesModule],
})
export class ArticlesPage implements OnInit {
  search:string="";
  constructor() {}

  ngOnInit() {}

  handleChange(event:any) {
    this.search = event.target.value;
  }
}
