import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from "typeorm";
import { GameState, PlayerSymbol } from "@/types/types";

const transformer: Record<"date" | "bigint", ValueTransformer> = {
  date: {
    from: (date: string | null) => date && new Date(parseInt(date, 10)),
    to: (date?: Date) => date?.valueOf().toString(),
  },
  bigint: {
    from: (bigInt: string | null) => bigInt && parseInt(bigInt, 10),
    to: (bigInt?: number) => bigInt?.toString(),
  },
};

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: true })
  name!: string | null;

  @Column({ type: "varchar", nullable: true, unique: true })
  email!: string | null;

  @Column({ type: "varchar", nullable: true })
  image!: string | null;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions!: SessionEntity[];

  @OneToMany(() => AccountEntity, (account) => account.user)
  accounts!: AccountEntity[];

  @OneToMany(() => FriendshipEntity, (friendship) => friendship.user1)
  friends!: FriendshipEntity[];

  @OneToMany(() => FriendshipEntity, (friendship) => friendship.user2)
  friendsOf!: FriendshipEntity[];

  @OneToMany(() => GameEntity, (game) => game.playerX)
  gamesPlayerX!: GameEntity[];

  @OneToMany(() => GameEntity, (game) => game.playerO)
  gamesPlayerO!: GameEntity[];

  @OneToMany(() => GameEntity, (game) => game.winner)
  gamesWon!: GameEntity[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}

@Entity({ name: "accounts" })
export class AccountEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column()
  type!: string;

  @Column()
  provider!: string;

  @Column()
  providerAccountId!: string;

  @Column({ type: "varchar", nullable: true })
  refresh_token!: string | null;

  @Column({ type: "varchar", nullable: true })
  access_token!: string | null;

  @Column({
    nullable: true,
    type: "bigint",
    transformer: transformer.bigint,
  })
  expires_at!: number | null;

  @Column({ type: "varchar", nullable: true })
  token_type!: string | null;

  @Column({ type: "varchar", nullable: true })
  scope!: string | null;

  @Column({ type: "varchar", nullable: true })
  id_token!: string | null;

  @Column({ type: "varchar", nullable: true })
  session_state!: string | null;

  @Column({ type: "varchar", nullable: true })
  oauth_token_secret!: string | null;

  @Column({ type: "varchar", nullable: true })
  oauth_token!: string | null;

  @ManyToOne(() => UserEntity, (user) => user.accounts, {
    createForeignKeyConstraints: true,
  })
  user!: UserEntity;
}

@Entity({ name: "sessions" })
export class SessionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  sessionToken!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ transformer: transformer.date })
  expires!: string;

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user!: UserEntity;
}

@Entity({ name: "verification_tokens" })
export class VerificationTokenEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  token!: string;

  @Column()
  identifier!: string;

  @Column({ transformer: transformer.date })
  expires!: string;
}

@Entity({ name: "friendships" })
export class FriendshipEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", default: "pending" })
  status!: string;

  @Column({ type: "uuid" })
  user1Id!: string;

  @Column({ type: "uuid" })
  user2Id!: string;

  @ManyToOne(() => UserEntity, (user) => user.friends, { onDelete: "CASCADE" })
  user1!: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.friendsOf, {
    onDelete: "CASCADE",
  })
  user2!: UserEntity;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}

@Entity({ name: "games" })
export class GameEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  playerXId!: string;

  @Column({ type: "uuid" })
  playerOId!: string;

  @Column({ type: "uuid", nullable: true })
  winnerId!: string | null;

  @OneToMany(() => MoveEntity, (move) => move.game)
  moves!: MoveEntity[];

  @Column({ type: "enum", enum: GameState })
  state!: GameState;

  @ManyToOne(() => UserEntity, (user) => user.gamesPlayerX, {
    onDelete: "CASCADE",
  })
  playerX!: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.gamesPlayerO, {
    onDelete: "CASCADE",
  })
  playerO!: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.gamesWon, {
    onDelete: "CASCADE",
    nullable: true,
  })
  winner!: UserEntity | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}

@Entity({ name: "moves" })
export class MoveEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  gameId!: string;

  @Column({ type: "uuid" })
  playerId!: string;

  @Column({ type: "int" })
  position!: number;

  @Column({ type: "enum", enum: PlayerSymbol })
  symbol!: PlayerSymbol;

  @ManyToOne(() => GameEntity, (game) => game.moves, { onDelete: "CASCADE" })
  game!: GameEntity;

  @ManyToOne(() => UserEntity, (user) => user.sessions, { onDelete: "CASCADE" })
  player!: UserEntity;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
