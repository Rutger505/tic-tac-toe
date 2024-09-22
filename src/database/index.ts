import { DataSource, DataSourceOptions } from "typeorm";
import * as entities from "./entity/entities.ts";
import { UserEntity } from "./entity/entities.ts";

const requiredEnvVars = [
  "POSTGRES_HOST",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_DB",
  "POSTGRES_PORT",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} is not defined`);
  }
});

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT),
  entities,
};

export const appDataSource = new DataSource(dataSourceOptions);

appDataSource.initialize().then(() => {
  console.log(appDataSource.isInitialized);

  console.log("Database initialized");
  console.log(appDataSource.manager.find(UserEntity));
});

export const userRepository = appDataSource.getRepository(UserEntity);
