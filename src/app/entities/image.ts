import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../data-source/base';
import { ArticleEntity } from './article';

@Entity({name:'image_entity'})
export class ImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'text', nullable: true })
  nom?: string;

  @Column({ type: 'text', default: 'default' })
  src?: string;

  @Column({ type:'integer',name: 'article_id', nullable: true })
  articleId?: number;

  @ManyToOne(() => ArticleEntity, (e) => e.id)
  @JoinColumn({ name: 'article_id' })
  article?: ArticleEntity;

  constructor(value?: Partial<ImageEntity>) {
    super();
    Object.assign(this, value);
  }
}
