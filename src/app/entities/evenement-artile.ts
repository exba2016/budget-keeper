import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../data-source/base';
import { ArticleEntity } from './article';
import { EvenementEntity } from './evenement';

@Entity({name:'evenement_article_entity'})
export class EvenementArticleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'real', nullable: true })
  prixReel?: number;

  @Column({ type: 'text', nullable: true })
  dateAchat?: Date;

  @Column({ type:'integer',name: 'article_id', nullable: true })
  articleId?: number;

  @ManyToOne(() => ArticleEntity, (e) => e.id)
  @JoinColumn({ name: 'article_id' })
  article?: ArticleEntity;


  @Column({ type:'integer',name: 'evenement_id', nullable: true })
  evenementId?: number;

  @ManyToOne(() => EvenementEntity, (e) => e.id)
  @JoinColumn({ name: 'evenement_id' })
  evenement?: EvenementEntity;

  constructor(value?: Partial<EvenementArticleEntity>) {
    super();
    Object.assign(this, value);
  }
}
