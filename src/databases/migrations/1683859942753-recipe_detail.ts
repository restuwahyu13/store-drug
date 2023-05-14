import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class recipeDetail1683859942753 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'recipe_detail',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
            isUnique: true,
            unsigned: true,
          },
          {
            name: 'doctor_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'clinic_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'medication_guide',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

// {
//    doctor_id: 1,
//    clinic_name: 2,
//   "drugs_name": "panadol",
//   "dosis": "3x sehari sesudah mana",
//   "notes": "obat harus diminum sebelum 1 minggu",
//   "created_at": "",
// }
