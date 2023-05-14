require('dotenv/config');
const path = require('path');

const pathEntitiesDir = !['production', 'staging'].includes(process.env.NODE_ENV) ? 'src/models' : 'dist/models';
const pathMigrationDir = !['production', 'staging'].includes(process.env.NODE_ENV) ? 'src/databases/migrations' : 'dist/databases/migrations';
const pathSeedDir = !['production', 'staging'].includes(process.env.NODE_ENV) ? 'src/databases/seeds' : 'dist/databases/seeds';
const pathFactoryDir = !['production', 'staging'].includes(process.env.NODE_ENV) ? 'src/databases/factories' : 'dist/databases/factories';

const entitiesDir = path.resolve(process.cwd(), pathEntitiesDir);
const migrationsDir = path.resolve(process.cwd(), pathMigrationDir);
const seedsDir = path.resolve(process.cwd(), pathSeedDir);

const fileExtension = '/' + (['development'].includes(process.env.NODE_ENV) ? '*.ts' : '*.js');

module.exports = {
  type: 'postgres',
  host: process.env.PG_HOST,
  username: process.env.PG_USER,
  port: +process.env.PG_PORT,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  entities: [entitiesDir + fileExtension],
  migrations: [migrationsDir + fileExtension],
  seeds: [seedsDir + fileExtension],
  synchronize: ['development'].includes(process.env.NODE_ENV) ? true : false,
  autoLoadEntities: ['development'].includes(process.env.NODE_ENV) ? true : false,
  logger: ['development'].includes(process.env.NODE_ENV) ? 'advanced-console' : undefined,
  logging: ['development'].includes(process.env.NODE_ENV) ? true : false,
  cli: {
    entitiesDir: entitiesDir,
    migrationsDir: migrationsDir,
  },
};
