import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt?: Date;
}
