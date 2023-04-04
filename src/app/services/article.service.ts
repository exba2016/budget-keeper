import { Injectable } from '@angular/core';
import { ArticleEntity } from '../entities/article';
import { Brackets, DataSource, In, Repository } from 'typeorm';
import { PaginationRequest } from '../data-source/interfaces/pagination-request.interface';
import { Pagination, toDataURL } from '../data-source';
import { ImageEntity } from '../entities/image';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  public dataSource!: DataSource;
  public database!: string;
  private repository!: Repository<ArticleEntity>;
  public isDataSourceReady: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  constructor() {}

  async initialize(): Promise<void> {
    console.log(
      `@@@ this.dataSource.isInitialized: ${ArticleService.name} @@@@`
    );
    if (this.dataSource.isInitialized) {
      this.repository = this.dataSource.getRepository(ArticleEntity);
      const count = await this.getCount();
      if (count == 0) {
        await this.seed();
        console.log(`@@@ seed complete: ${ArticleEntity.name} @@@@`);
      }
      this.isDataSourceReady.next(true);
    } else {
      this.isDataSourceReady.next(false);
      return Promise.reject(`Error: ${ArticleService.name} not initialized`);
    }
  }

  async getCount(): Promise<number> {
    const retCount: any = (
      await this.repository.query('select count(*) AS count from article_entity')
    )[0];
    const count: number = retCount.count;
    return count;
  }

  async seed() {
    let data: ArticleEntity[] = [
      new ArticleEntity({
        nom: 'ail',
      }),
      new ArticleEntity({
        nom: 'oignon',
      }),
      new ArticleEntity({
        nom: 'poisson',
      }),
      new ArticleEntity({
        nom: 'pomme de terre',
      }),

      new ArticleEntity({
        nom: 'poulet',
      }),

      new ArticleEntity({
        nom: 'tomate',
      }),

      new ArticleEntity({
        nom: 'viande',
      }),
    ];
    let dataForSearch = data.map((v) => v.nom);
    let existingData = await this.repository.find({
      where: { nom: In(dataForSearch) },
    });

    let validData = data.map((p) => {
      const existing = existingData.find((e) => e.nom === p.nom);
      if (existing) {
        return existing;
      }
      return p;
    });
    // Creating / updating
    let dataSaved = await this.repository.save(validData);
    let dataImages:ImageEntity[] = await Promise.all(
      dataSaved.map(
        async (v) =>
          new ImageEntity({
            src: await toDataURL(
              `./../../assets/images/articles/${v.nom?.replace(/ /g, '_')}.jpg`
            ),
            nom: v.nom,
            articleId: v.id,
          })
      )
    );
    return this.dataSource
      .getRepository(ImageEntity)
      .createQueryBuilder()
      .insert()
      .values(dataImages)
      .execute();
  }

  async findAll(pagination: PaginationRequest) {
    const {
      skip,
      limit: take,
      attributeNameOrder,
      order,
      params: { search },
    } = pagination;

    try {
      let query = this.dataSource
        .createQueryBuilder()
        .select('p')
        .from(ArticleEntity, 'p')
        .leftJoinAndSelect('p.images', 'img')
        .skip(skip)
        .take(take)
        .orderBy(attributeNameOrder, order);

      if (search) {
        const metadata = this.dataSource.getMetadata(ArticleEntity);
        const columns = metadata.columns;
        const searchConditions: string[] = [];

        for (const column of columns) {
          const columnName = column.givenDatabaseName;
          const columnType = column.type;

          // Vérifier si le type de colonne est compatible avec SQLite
          if (
            columnType === 'varchar' ||
            columnType === 'text' ||
            columnType === 'integer' ||
            columnType === 'numeric' ||
            columnType === 'real'
          ) {
            const columnText = `CAST(p.${columnName} AS TEXT)`; // Convertir la colonne en text avec CAST
            searchConditions.push(`LOWER(${columnText}) LIKE LOWER(:search)`);
          }
        }

        if (searchConditions.length > 0) {
          query.andWhere(
            new Brackets((qb) => {
              for (let i = 0; i < searchConditions.length; i++) {
                if (i === 0) {
                  qb.where(searchConditions[i], {
                    search: `%${search.toLowerCase()}%`,
                  });
                } else {
                  qb.orWhere(searchConditions[i], {
                    search: `%${search.toLowerCase()}%`,
                  });
                }
              }
            })
          );
        }
      }
      const [entities, total] = await query.getManyAndCount();
      return Pagination.of(pagination, total, entities);
    } catch (err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error in findAll: ${err}`);
    }
  }

  async findOne(id: number) {
    return this.dataSource
      .createQueryBuilder()
      .select('p')
      .from(ArticleEntity, 'p')
      .where('p.id=:id', {
        id: id,
      })
      .getOne();
  }

  async create(createDto: ArticleEntity) {
    const data = this.repository.create(createDto);
    return this.repository.save(data);
  }

  async update(id: number, updateDto: ArticleEntity) {
    let data = await this.repository.preload({
      id: id,
      ...updateDto,
    });

    if (!data) {
      return null;
    }
    return this.repository.save(data);
  }

  async remove(id: number) {
    let data = await this.findOne(id);
    if (!data) {
      return null;
    }
    return this.repository.softDelete(id);
  }
}
