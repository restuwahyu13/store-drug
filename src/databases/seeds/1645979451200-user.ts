import { Connection } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Seeder, Factory } from 'typeorm-seeding';

import { User } from '@models/model.user';

export default class CreateUserSeed implements Seeder {
  async run(_: Factory, connection: Connection): Promise<void> {
    const users: Record<string, any>[] = [];

    for (let i = 0; i < 10; i++) {
      users.push({ name: faker.person.fullName() });
    }

    await connection.createQueryBuilder().insert().into(User).values(users).execute();
  }
}
