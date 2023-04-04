import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import AppDataSource from '../data-source/AppDataSource';
import { ArticleService } from './article.service';
import { EvenementArticleService } from './evenement-article.service';
import { EvenementParticipantService } from './evenement-participant.service';
import { EvenementService } from './evenement.service';
import { ImageService } from './image.service';
import { ParticipantService } from './participant.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrmService {
  isOrmService: Boolean = false;
  isReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqliteService: SQLiteService,
    private articleService: ArticleService,
    private evenementArticleService: EvenementArticleService,
    private evenementParticipantService: EvenementParticipantService,
    private evenementService: EvenementService,
    private imageService: ImageService,
    private participantService: ParticipantService
  ) {}

  // Private functions
  /**
   * Initialize the TypeOrm Service
   */
  async initialize(): Promise<boolean> {
    try {
      // Check connections consistency
      await this.sqliteService.checkConnectionConsistency();

      // Loop through your DataSources
      for (const dataSource of [/*UserDataSource,*/ AppDataSource]) {
        const database = String(dataSource.options.database);
        if (!dataSource.isInitialized) {
          // initialize the DataSource
          await dataSource.initialize();
          console.log(`*** dataSource has been initialized ***`);
          // run the migrations
          await dataSource.runMigrations();
          console.log(
            `*** dataSource runMigration has been run succesfully ***`
          );
          // load the data for this datasource

          this.articleService.database = database;
          this.articleService.dataSource = dataSource;
          await this.articleService.initialize();
          console.log(`*** ${ArticleService.name} has been initialized ***`);

          this.evenementArticleService.database = database;
          this.evenementArticleService.dataSource = dataSource;
          await this.evenementArticleService.initialize();
          console.log(
            `*** ${EvenementArticleService.name} has been initialized ***`
          );

          this.evenementParticipantService.database = database;
          this.evenementParticipantService.dataSource = dataSource;
          await this.evenementParticipantService.initialize();
          console.log(
            `*** ${EvenementParticipantService.name} has been initialized ***`
          );

          this.evenementService.database = database;
          this.evenementService.dataSource = dataSource;
          await this.evenementService.initialize();
          console.log(`*** ${EvenementService.name} has been initialized ***`);

          this.imageService.dataSource = dataSource;
          await this.imageService.initialize();
          console.log(`*** ${ImageService.name} has been initialized ***`);

          this.participantService.database = database;
          this.participantService.dataSource = dataSource;
          await this.participantService.initialize();
          console.log(
            `*** ${ParticipantService.name} has been initialized ***`
          );

          if (this.sqliteService.getPlatform() === 'web') {
            // save the databases from memory to store
            let rs = await this.sqliteService
              .getSqliteConnection()
              .saveToStore(database);
            console.log(`*** inORMService saveToStore ${rs} ***`);
          }
        }
        console.log(`DataSource: ${database} initialized`);
      }

      this.isOrmService = true;
      this.isReady.next(true);
      return true;
    } catch (err) {
      this.isReady.next(false);
      console.log(`Error: ${err}`);
      return false;
    }
  }
}
