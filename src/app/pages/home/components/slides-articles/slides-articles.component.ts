import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import { PaginationResponseDto } from 'src/app/data-source';
import { ArticleEntity } from 'src/app/entities/article';
import { ArticleService } from 'src/app/services/article.service';
import { OrmService } from 'src/app/services/orm.service';
import { SubscribeDestroyerService } from 'src/app/services/subscribe-destroyer.service';

@Component({
  selector: 'app-slides-articles',
  templateUrl: './slides-articles.component.html',
  styleUrls: ['./slides-articles.component.scss'],
})
export class SlidesArticlesComponent implements OnInit, AfterViewInit {
  @ViewChild('articleSwiper')
  swiperRef: ElementRef | undefined;

  response: PaginationResponseDto<ArticleEntity> | null = null;
  constructor(
    private articleService: ArticleService,
    private ormService: OrmService,
    private readonly destroy$: SubscribeDestroyerService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.ormService.isReady.pipe(takeUntil(this.destroy$)).subscribe({
      next: async (rs) => {
        console.log('====================================');
        console.log("@@@ isReady for article slide ",rs);
        console.log('====================================');
        if(rs){
          this.response = await this.articleService.findAll({
            attributeNameOrder: 'p.created_at',
            limit: 0,
            skip: 0,
            order: 'ASC',
            page: 0,
            params: { search: '' },
          });
          console.log('====================================');
          console.log('response ', this.response);
          console.log('====================================');
        }

      },
      error: (error) => console.log(error),
    });
  }

  ionViewDidEnter(){
    
  }
}
