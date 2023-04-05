import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { PaginationResponseDto } from 'src/app/data-source';
import { ArticleEntity } from 'src/app/entities/article';
import { ArticleService } from 'src/app/services/article.service';
import { OrmService } from 'src/app/services/orm.service';
import { SubscribeDestroyerService } from 'src/app/services/subscribe-destroyer.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss'],
})
export class ArticlesListComponent implements OnInit, OnChanges {
  @Input() search: string = '';
  response: PaginationResponseDto<ArticleEntity> | null = null;
  constructor(
    private articleService: ArticleService,
    private ormService: OrmService,
    private readonly destroy$: SubscribeDestroyerService
  ) {}

  ngOnChanges() {
    this.ngOnInit();
  }
  ngOnInit() {
    this.ormService.isReady.pipe(takeUntil(this.destroy$)).subscribe({
      next: async (rs) => {
        console.log('====================================');
        console.log("@@@ isReady for article ",rs);
        console.log('====================================');
        if(rs){
          this.response = await this.articleService.findAll({
            attributeNameOrder: 'p.created_at',
            limit: 0,
            skip: 0,
            order: 'ASC',
            page: 0,
            params: { search: this.search },
          });
          console.log('====================================');
          console.log('response ', this.response);
          console.log('====================================');
        }

      },
      error: (error) => console.log(error),
    });
  }

}
