import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

const configService = new ConfigService();

export const config: ConnectionOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  migrationsRun: false,
  migrations: ['dist/**/migrations/*{.ts,.js}'],
};
