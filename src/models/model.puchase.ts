import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IPurchase } from '@interfaces/interface.purchase';
import { Product } from '@models/model.product';
import { Recipe } from '@models/model.recipe';

class DatabaseRelation {
  @ManyToOne(() => Product, (relation) => relation.purchases)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @ManyToOne(() => Recipe, (relation) => relation.purchases)
  @JoinColumn({ name: 'recipe_id', referencedColumnName: 'id' })
  recipe: Recipe;
}

class DatabaseSchema extends DatabaseRelation {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: false })
  recipe_id!: number;

  @Column({ type: 'int', nullable: false })
  product_id!: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  qty!: number;

  @Column({ type: 'bigint', unsigned: true, nullable: false })
  price!: number;

  @Column({ type: 'bigint', unsigned: true, nullable: false })
  final_price!: number;

  @Column({ type: 'bigint', unsigned: true, nullable: false })
  total_price!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
}

@Entity()
export class Purchase extends DatabaseSchema implements IPurchase {}
