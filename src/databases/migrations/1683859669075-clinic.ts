import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class clinic1683859669075 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'clinic',
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
            length: '100',
            isNullable: false,
          },
          {
            name: 'address',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'province',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'district',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'country',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'postal_code',
            type: 'int',
            unsigned: true,
            isNullable: false,
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
    await queryRunner.dropTable('clinic');
  }
}
