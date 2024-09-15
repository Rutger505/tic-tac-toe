export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

export enum GameState {
  Ongoing,
  Draw,
  XWins,
  OWins,
  Cancelled,
}

export enum PlayerSymbol {
  X,
  O,
}

export enum WebsocketErrorCode {
  InvalidUser,
  AlreadyInQueue,
}
