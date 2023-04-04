import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '../data-source/base';

@Entity({name:'evenement_entity'})
export class EvenementEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'text', nullable: true })
  nom!: string;

  @Column({
    type:'integer',
    default: 1,
  })
  isIndeterminate?: boolean;

  @Column({ type: 'text', nullable: true })
  dateStart?: Date;

  @Column({ type: 'text', nullable: true })
  dateEnd?: Date;

  constructor(value?: Partial<EvenementEntity>) {
    super();
    Object.assign(this, value);
  }
}
