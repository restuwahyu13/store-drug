import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '@interfaces/interface.user';
import { Recipe } from '@models/model.recipe';

class DatabaseRelation {
  @OneToMany(() => Recipe, (relation) => relation.user)
  public recipes: Recipe[];
}

class DatabaseSchema extends DatabaseRelation {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}

@Entity()
export class User extends DatabaseSchema implements IUser {}
