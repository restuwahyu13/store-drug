import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IClinic } from '@interfaces/interface.clinic';
import { RecipeDetail } from '@models/model.recipeDetail';

class DatabaseRelation {
  @OneToMany(() => RecipeDetail, (relation) => relation.clinic)
  public recipeDetails: RecipeDetail[];
}

class DatabaseSchema extends DatabaseRelation {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: false })
  address!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  city!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  province!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  district!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  country!: string;

  @Column({ type: 'int', unsigned: true, nullable: false })
  postal_code!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}

@Entity()
export class Clinic extends DatabaseSchema implements IClinic {}
