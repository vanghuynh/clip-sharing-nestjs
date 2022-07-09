import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const DATABASE_HOST: string = process.env.DATABASE_HOST || 'localhost';
const DATABASE_SCHEMA: string = process.env.DATABASE_SCHEMA || 'clip_sharing';
const DATABASE_USERNAME: string = process.env.DATABASE_USERNAME || 'admin';
const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD || 'password';
const DATABASE_SYNCHRONIZE: string = process.env.DATABASE_SYNCHRONIZE || 'yes';
const DATABASE_NAME: string = process.env.DATABASE_NAME || 'postgres';

export const typeOrmConfig: TypeOrmModuleOptions = {
    "type": "postgres",
    "host": DATABASE_HOST,
    "port": 5432,
    "username": DATABASE_USERNAME,
    "password": DATABASE_PASSWORD,
    "database": DATABASE_NAME,
    "schema": DATABASE_SCHEMA,
    "synchronize": DATABASE_SYNCHRONIZE == 'yes' ? true : false,
    "logging": true,
    "entities": [__dirname + "/../../dist/**/*.entity.js"]
}
