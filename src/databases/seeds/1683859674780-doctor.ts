import { Connection } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Seeder, Factory } from 'typeorm-seeding';

import { Doctor } from '@models/model.doctor';

export default class CreateDoctorSeed implements Seeder {
  async run(_: Factory, connection: Connection): Promise<any> {
    const doctors: Record<string, any>[] = [];

    for (let i = 0; i < 10; i++) {
      doctors.push({
        name: faker.person.fullName(),
      });
    }

    await connection.createQueryBuilder().insert().into(Doctor).values(doctors).execute();
  }
}
