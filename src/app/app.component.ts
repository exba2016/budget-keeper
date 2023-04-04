import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { OrmService } from './services/orm.service';
import { SQLiteService } from './services/sqlite.service';
import { ArticleService } from './services/article.service';
import { EvenementArticleService } from './services/evenement-article.service';
import { EvenementParticipantService } from './services/evenement-participant.service';
import { EvenementService } from './services/evenement.service';
import { ImageService } from './services/image.service';
import { ParticipantService } from './services/participant.service';

import { register } from 'swiper/element/bundle';
register();
export function initializeFactory(init: SQLiteService) {
  return () => init.initializeWebStore();
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule ],
  providers: [
    SQLiteService,
    OrmService,
    ArticleService,
    EvenementArticleService,
    EvenementParticipantService,
    EvenementService,
    ImageService,
    ParticipantService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFactory,
      deps: [SQLiteService],
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);

  public isWeb: boolean = false;
  private initPlugin: boolean = false;
  constructor(
    private platform: Platform,
    private sqlite: SQLiteService,
    private ormService: OrmService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.sqlite.initializeWebStore().then(async (ret) => {
        this.initPlugin;
        if (this.sqlite.platform === 'web') {
          this.isWeb = true;
          await customElements.whenDefined('jeep-sqlite');
          const jeepSqliteEl = document.querySelector('jeep-sqlite');
          if (jeepSqliteEl != null) {
            console.log(`>>>> isStoreOpen ${await jeepSqliteEl.isStoreOpen()}`);
          } else {
            console.log('>>>> jeepSqliteEl is null');
          }
        }

        this.ormService
          .initialize()
          .then(async (result) => {
            if (!result) {
              throw new Error(`Error: TypeOrm Service didn't start`);
            } else {
              console.log(`*** ORM service has been initialized ***`);
            }
          })
          .catch((err: any) => {
            const msg = err.message ? err.message : err;
            throw new Error(`Error: ${err}`);
          });
      });
    });
  }
}
