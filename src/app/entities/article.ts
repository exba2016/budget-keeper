import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../data-source/base';
import { ImageEntity } from './image';

@Entity({name:'article_entity'})
export class ArticleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'text', nullable: true })
  nom?: string;

  @Column({ type: 'real', nullable: true })
  prix?: number;

  @OneToMany(() => ImageEntity, (e) => e.article)
  images?: ImageEntity[];

  constructor(value?: Partial<ArticleEntity>) {
    super();
    Object.assign(this, value);
  }
}
