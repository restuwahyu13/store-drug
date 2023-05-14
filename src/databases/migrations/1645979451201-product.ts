import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class product1645979451201 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
            isUnique: true,
            unsigned: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'category',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'sku',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'stock',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'margin',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'tax',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'for_sale',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product');
  }
}
