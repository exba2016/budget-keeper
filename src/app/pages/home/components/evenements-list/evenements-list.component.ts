import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { PaginationResponseDto } from 'src/app/data-source';
import { EvenementEntity } from 'src/app/entities/evenement';
import { EvenementService } from 'src/app/services/evenement.service';
import { OrmService } from 'src/app/services/orm.service';
import { SubscribeDestroyerService } from 'src/app/services/subscribe-destroyer.service';

@Component({
  selector: 'app-evenements-list',
  templateUrl: './evenements-list.component.html',
  styleUrls: ['./evenements-list.component.scss'],
})
export class EvenementsListComponent implements OnInit {
  response: PaginationResponseDto<EvenementEntity> | null = null;
  constructor(
    private evenementService: EvenementService,
    private ormService: OrmService,
    private readonly destroy$: SubscribeDestroyerService
  ) {}

  ngOnInit() {
    this.ormService.isReady.pipe(takeUntil(this.destroy$)).subscribe({
      next: async (rs) => {
        console.log('====================================');
        console.log('@@@ isReady for event list ', rs);
        console.log('====================================');
        if (rs) {
          this.response = await this.evenementService.findAll({
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
}
