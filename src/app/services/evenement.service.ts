import { Injectable } from '@angular/core';
import { DataSource, Repository, Brackets, In } from 'typeorm';
import { PaginationRequest, Pagination } from '../data-source';
import { EvenementEntity } from '../entities/evenement';
import { ArticleService } from './article.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvenementService {
  public dataSource!: DataSource;
  public database!: string;
  private repository!: Repository<EvenementEntity>;
  public isDataSourceReady: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  constructor() {}

  async initialize(): Promise<void> {
    console.log(
      `@@@ this.dataSource.isInitialized: ${ArticleService.name} @@@@`
    );
    if (this.dataSource.isInitialized) {
      this.repository = this.dataSource.getRepository(EvenementEntity);
      const count = await this.getCount();
      console.log(
        `@@@ count complete: ${EvenementService.name} > ${count}@@@@`
      );
      if (!count) {
        await this.seed();
        console.log(`@@@ seed complete: ${EvenementService.name} @@@@`);
      }
    } else {
      return Promise.reject(`Error: ${ArticleService.name} not initialized`);
    }
  }

  async getCount(): Promise<number> {
    try {
      const retCount: any = (
        await this.repository.query(
          'select count(*) AS count from evenement_entity'
        )
      )[0];
      const count: number = retCount.count;
      return count;
    } catch (err: any) {
      return 0;
    }
  }

  async seed() {
    let data: EvenementEntity[] = [
      new EvenementEntity({
        nom: 'budget maison',
        isIndeterminate: true,
      }),
      new EvenementEntity({
        nom: 'budget ramadan',
        isIndeterminate: false,
        dateStart: new Date('3/21/2023'),
      }),
    ];
    const dataForSearch = data.map((v) => v.nom);
    const existingData = await this.repository.find({
      where: { nom: In(dataForSearch) },
    });

    const validData = data.map((p) => {
      const existing = existingData.find((e) => e.nom === p.nom);
      if (existing) {
        return existing;
      }
      return p;
    });
    // Creating / updating
    return this.repository.save(validData);
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
        .from(EvenementEntity, 'p')
        .skip(skip)
        .take(take)
        .orderBy(attributeNameOrder, order);

      if (search) {
        const metadata = this.dataSource.getMetadata(EvenementEntity);
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
      .from(EvenementEntity, 'p')
      .where('p.id=:id', {
        id: id,
      })
      .getOne();
  }

  async create(createDto: EvenementEntity) {
    const data = this.repository.create(createDto);
    return this.repository.save(data);
  }

  async update(id: number, updateDto: EvenementEntity) {
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
