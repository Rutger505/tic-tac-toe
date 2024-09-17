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
