import { UserEntity } from "@/database/entities/entities";
import { appDataSource } from "@/database/datasource";

export async function getUserRepository() {
  if (!appDataSource.isInitialized) {
    await appDataSource.initialize();
  }

  return appDataSource.getRepository(UserEntity);
}
