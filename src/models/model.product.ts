import { AfterInsert, BeforeInsert, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IProduct } from '@interfaces/interface.product';
import { Purchase } from '@models/model.puchase';

class DatabaseRelation {
  @OneToMany(() => Purchase, (relation) => relation.recipe)
  public purchases: Purchase[];
}

class DatabaseSchema extends DatabaseRelation {
  @Index()
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  category!: string;

  @Column({ type: 'int', unsigned: true, nullable: false })
  price!: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  sku!: string;

  @Column({ type: 'int', unsigned: true, nullable: false })
  stock!: number;

  @Column({ type: 'boolean', nullable: false })
  margin!: boolean;

  @Column({ type: 'boolean', nullable: false })
  tax!: boolean;

  @Column({ type: 'boolean', nullable: false })
  for_sale?: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}

class DatabaseHook extends DatabaseSchema {
  @BeforeInsert()
  hookBeforeInsert() {
    const sku: string = 'SKU00' + this.id;
    const forSale: boolean = true;

    this.sku = sku;
    this.for_sale = forSale;
  }

  @AfterInsert()
  hookAfterInsert() {
    const sku: string = 'SKU00' + this.id;
    this.sku = sku;
  }
}

@Entity()
export class Product extends DatabaseHook implements IProduct {}
