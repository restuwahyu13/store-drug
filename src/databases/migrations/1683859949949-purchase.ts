import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class purchase1683859949949 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'purchase',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
            isUnique: true,
            unsigned: true,
          },
          {
            name: 'recipe_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'product_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'qty',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'price',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'final_price',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'total_price',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('purchase', [
      new TableForeignKey({
        columnNames: ['recipe_id'],
        referencedTableName: 'recipe',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedTableName: 'product',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('purchase');
  }
}
