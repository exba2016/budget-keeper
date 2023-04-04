import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '../data-source/base';

@Entity({name:'participant_entity'})
export class ParticipantEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'text', nullable: true })
  nomComplet?: string;

  @Column({ type: 'text', nullable: true })
  telephone?: string;

  constructor(value?: Partial<ParticipantEntity>) {
    super();
    Object.assign(this, value);
  }
}
