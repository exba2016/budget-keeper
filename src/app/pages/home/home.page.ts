import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { takeUntil } from 'rxjs';
import { PaginationResponseDto } from 'src/app/data-source';
import { ArticleEntity } from 'src/app/entities/article';
import { ArticleService } from 'src/app/services/article.service';
import { OrmService } from 'src/app/services/orm.service';
import { SubscribeDestroyerService } from 'src/app/services/subscribe-destroyer.service';
import { HomeModule } from './home.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,HomeModule]
})
export class HomePage implements OnInit {
  constructor(
    private readonly destroy$: SubscribeDestroyerService
  ) {}
 

  async ngOnInit() {
    
  }

}
