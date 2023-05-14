import { Connection } from 'typeorm';
import { Seeder, Factory } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';

import { Clinic } from '@models/model.clinic';

export default class CreateClinicSeed implements Seeder {
  async run(_: Factory, connection: Connection): Promise<any> {
    const clinics: Record<string, any>[] = [
      {
        name: 'Berkah Sentosa Medical',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        province: faker.location.state(),
        district: faker.location.direction(),
        country: faker.location.country(),
        postal_code: String(Math.random()).split('.')[1].slice(0, 5),
      },
      {
        name: 'Amanah Keluarga Medical',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        province: faker.location.state(),
        district: faker.location.direction(),
        country: faker.location.country(),
        postal_code: String(Math.random()).split('.')[1].slice(0, 5),
      },
      {
        name: 'Sentra Medika',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        province: faker.location.state(),
        district: faker.location.direction(),
        country: faker.location.country(),
        postal_code: String(Math.random()).split('.')[1].slice(0, 5),
      },
      {
        name: 'Citra Prima Medical',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        province: faker.location.state(),
        district: faker.location.direction(),
        country: faker.location.country(),
        postal_code: String(Math.random()).split('.')[1].slice(0, 5),
      },
      {
        name: 'Bunda Melia Sejahtra Medical',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        province: faker.location.state(),
        district: faker.location.direction(),
        country: faker.location.country(),
        postal_code: String(Math.random()).split('.')[1].slice(0, 5),
      },
    ];

    await connection.createQueryBuilder().insert().into(Clinic).values(clinics).execute();
  }
}
