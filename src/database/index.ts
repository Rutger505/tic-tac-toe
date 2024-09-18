import { DataSource, DataSourceOptions } from "typeorm";

const requiredEnvVars = [
  "POSTGRES_HOST",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_DB",
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
};

const appDataSource = new DataSource(dataSourceOptions);
export default appDataSource;
