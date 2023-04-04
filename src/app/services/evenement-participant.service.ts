import { Injectable } from '@angular/core';
import { DataSource, Repository, Brackets } from 'typeorm';
import { PaginationRequest, Pagination } from '../data-source';
import { EvenementParticipantEntity } from '../entities/evenement-participant';
import { ArticleService } from './article.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvenementParticipantService {
  public dataSource!: DataSource;
  public database!: string;
  private repository!: Repository<EvenementParticipantEntity>;
  public isDataSourceReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}

  async initialize(): Promise<void> {
    console.log(
      `@@@ this.dataSource.isInitialized: ${ArticleService.name} @@@@`
    );
    if (this.dataSource.isInitialized) {
      this.repository = this.dataSource.getRepository(EvenementParticipantEntity);
    } else {
      return Promise.reject(`Error: ${ArticleService.name} not initialized`);
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
        .from(EvenementParticipantEntity, 'p')
        .skip(skip)
        .take(take)
        .orderBy(attributeNameOrder, order);

      if (search) {
        const metadata = this.dataSource.getMetadata(EvenementParticipantEntity);
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
      .from(EvenementParticipantEntity, 'p')
      .where('p.id=:id', {
        id: id,
      })
      .getOne();
  }

  async create(createDto: EvenementParticipantEntity) {
    const data = this.repository.create(createDto);
    return this.repository.save(data);
  }

  async update(id: number, updateDto: EvenementParticipantEntity) {
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