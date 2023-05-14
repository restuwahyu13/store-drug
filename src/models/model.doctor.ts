import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IDoctor } from '@interfaces/interface.doctor';
import { RecipeDetail } from '@models/model.recipeDetail';

class DatabaseRelation {
  @OneToMany(() => RecipeDetail, (relation) => relation.doctor)
  public recipeDetails: RecipeDetail[];
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
export class Doctor extends DatabaseSchema implements IDoctor {}
