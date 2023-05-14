import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IRecipe } from '@interfaces/interface.recipe';
import { Purchase } from '@models/model.puchase';
import { User } from '@models/model.user';
import { RecipeDetail } from '@models/model.recipeDetail';

class DatabaseRelation {
  @OneToMany(() => Purchase, (relation) => relation.recipe)
  public purchases: Purchase[];

  @ManyToOne(() => RecipeDetail, (relation) => relation.recipe)
  @JoinColumn({ name: 'recipe_detail_id', referencedColumnName: 'id' })
  recipeDetail: RecipeDetail;

  @ManyToOne(() => User, (relation) => relation.recipes)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}

class DatabaseSchema extends DatabaseRelation {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  user_id!: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  recipe_detail_id!: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  doctor_name!: string;

  @Column({ type: 'text', nullable: false })
  clinic_name!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @Column({ type: 'bigint', default: 0 })
  total_price?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
}

class DatabaseHook extends DatabaseSchema {
  @BeforeInsert()
  async hookBeforeInsert() {
    this.total_price = 0;
  }
}

@Entity()
export class Recipe extends DatabaseHook implements IRecipe {}
