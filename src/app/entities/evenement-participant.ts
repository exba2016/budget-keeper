import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../data-source/base';
import { EvenementEntity } from './evenement';
import { ParticipantEntity } from './participant';

@Entity({name:'evenement_participant_entity'})
export class EvenementParticipantEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'integer', name: 'evenement_id', nullable: true })
  evenementId?: number;

  @ManyToOne(() => EvenementEntity, (e) => e.id)
  @JoinColumn({ name: 'evenement_id' })
  evenement?: EvenementEntity;

  @Column({ type: 'integer', name: 'participant_id', nullable: true })
  participantId?: number;

  @ManyToOne(() => ParticipantEntity, (e) => e.id)
  @JoinColumn({ name: 'participant_id' })
  participant?: ParticipantEntity;

  constructor(value?: Partial<EvenementParticipantEntity>) {
    super();
    Object.assign(this, value);
  }
}
