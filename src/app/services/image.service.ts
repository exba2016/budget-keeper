import { Injectable } from '@angular/core';
import { DataSource, Repository, Brackets, In } from 'typeorm';
import { PaginationRequest, Pagination, toDataURL } from '../data-source';
import { ImageEntity } from '../entities/image';
import { ArticleService } from './article.service';
import { BehaviorSubject } from 'rxjs';
import AppDataSource from '../data-source/AppDataSource';
import { ArticleEntity } from '../entities/article';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  public dataSource: DataSource = AppDataSource;
  private repository!: Repository<ImageEntity>;
  public isDataSourceReady: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  constructor(private articleService: ArticleService) {}

  async initialize(): Promise<void> {
    console.log(
      `@@@ this.dataSource.isInitialized: ${ArticleService.name} @@@@`
    );
    if (this.dataSource.isInitialized) {
      this.repository = this.dataSource.getRepository(ImageEntity);
      const count = await this.getCount();
      console.log(`@@@ count complete: ${ImageService.name} > ${count}@@@@`);
     
    } else {
      return Promise.reject(`Error: ${ArticleService.name} not initialized`);
    }
  }


  async getCount(): Promise<number> {
    try {
      const retCount: any = (
        await this.repository.query(
          'select count(*) AS count from image_entity'
        )
      )[0];
      const count: number = retCount.count;
      return count;
    } catch (err: any) {
      return 0;
    }
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
        .from(ImageEntity, 'p')
        .skip(skip)
        .take(take)
        .orderBy(attributeNameOrder, order);

      if (search) {
        const metadata = this.dataSource.getMetadata(ImageEntity);
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
      .from(ImageEntity, 'p')
      .where('p.id=:id', {
        id: id,
      })
      .getOne();
  }

  async create(createDto: ImageEntity) {
    const data = this.repository.create(createDto);
    return this.repository.save(data);
  }

  async update(id: number, updateDto: ImageEntity) {
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
