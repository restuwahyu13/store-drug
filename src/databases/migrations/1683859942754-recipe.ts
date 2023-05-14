import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class recipe1683859942754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'recipe',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
            isUnique: true,
            unsigned: true,
          },
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'recipe_detail_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'doctor_name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'clinic_name',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'total_price',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('recipe', [
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
      }),
      new TableForeignKey({
        columnNames: ['recipe_detail_id'],
        referencedTableName: 'recipe_detail',
        referencedColumnNames: ['id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('recipe');
  }
}
