import { DataSource } from "typeorm";
import { SQLiteService } from "../services/sqlite.service";
import { ArticleEntity } from "../entities/article";
import { ParticipantEntity } from "../entities/participant";
import { ImageEntity } from "../entities/image";
import { EvenementEntity } from "../entities/evenement";
import { EvenementArticleEntity } from "../entities/evenement-artile";
import { EvenementParticipantEntity } from "../entities/evenement-participant";

const sqliteService = new SQLiteService();
const sqliteConnection = sqliteService.getSqliteConnection();

export default new DataSource({
  name: 'AppConnection',
  type: 'capacitor',
  driver: sqliteConnection,
  database: 'budget_keeper',
  mode: 'no-encryption',
  entities: [ParticipantEntity,ImageEntity,ArticleEntity,EvenementEntity,EvenementArticleEntity,EvenementParticipantEntity],
  migrations: [],
  subscribers: [],
  logging: [/*'query',*/ 'error','schema'],
  synchronize: true,
  migrationsRun: false,
});
