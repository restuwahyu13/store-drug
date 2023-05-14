import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IRecipeDetail } from '@interfaces/interface.recipeDetail';
import { Doctor } from '@models/model.doctor';
import { Clinic } from '@models/model.clinic';
import { Recipe } from '@models/model.recipe';

class DatabaseRelation {
  @OneToOne(() => Recipe, (relation) => relation.recipeDetail)
  public recipe: Recipe;

  @ManyToOne(() => Doctor, (relation) => relation.recipeDetails)
  @JoinColumn({ name: 'doctor_id', referencedColumnName: 'id' })
  doctor: Doctor;

  @ManyToOne(() => Clinic, (relation) => relation.recipeDetails)
  @JoinColumn({ name: 'clinic_id', referencedColumnName: 'id' })
  clinic: Clinic;
}

class DatabaseSchema extends DatabaseRelation {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  doctor_id!: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  clinic_id!: number;

  @Column({ type: 'jsonb', nullable: true })
  medication_guide: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
}

@Entity()
export class RecipeDetail extends DatabaseSchema implements IRecipeDetail {}
