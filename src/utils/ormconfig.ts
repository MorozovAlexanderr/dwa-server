import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

const configService = new ConfigService();

const config: ConnectionOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  migrations: ['dist/**/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  ssl: { rejectUnauthorized: false },
};

export = config;
