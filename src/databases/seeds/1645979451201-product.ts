import { Connection } from 'typeorm';
import { Seeder, Factory } from 'typeorm-seeding';

import { Product } from '@models/model.product';

export default class CreateProductSeed implements Seeder {
  async run(_: Factory, connection: Connection): Promise<any> {
    const products: Record<string, any>[] = [
      {
        name: 'panadol',
        category: 'tablet',
        price: 5000,
        sku: 'SKU001',
        stock: 50,
        margin: true,
        tax: true,
        for_sale: true,
      },
      {
        name: 'bodrex',
        category: 'tablet',
        price: 5000,
        sku: 'SKU002',
        stock: 50,
        margin: true,
        tax: true,
        for_sale: true,
      },
      {
        name: 'paramex',
        category: 'tablet',
        price: 3000,
        sku: 'SKU003',
        stock: 50,
        margin: true,
        tax: true,
        for_sale: true,
      },
      {
        name: 'dulcolax',
        category: 'tablet',
        price: 10000,
        sku: 'SKU004',
        stock: 15,
        margin: false,
        tax: false,
        for_sale: true,
      },
      {
        name: 'vitacimin',
        category: 'tablet',
        price: 15000,
        sku: 'SKU005',
        stock: 20,
        margin: true,
        tax: false,
        for_sale: true,
      },

      {
        name: 'tolak angin',
        category: 'sirup',
        price: 25000,
        sku: 'SKU006',
        stock: 40,
        margin: true,
        tax: true,
        for_sale: true,
      },
    ];

    await connection.createQueryBuilder().insert().into(Product).values(products).execute();
  }
}
