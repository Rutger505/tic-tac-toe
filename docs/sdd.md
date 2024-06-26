# Software Design Document

## Entity Relationship Diagram

```mermaid
erDiagram
    User {
        string id PK
        string username
        datetime created_at
    }

    Game {
        string id PK
        string player1_user_id FK
        string player2_user_id FK
        string state "(PLAYING, FINISHED, CANCELLED)"
        string winner_user_id FK "(NULL if not finished, TIE if tie)"
        datetime played_at
    }

    GameInvitation {
        string id PK
        string sender_user_id FK
        string receiver_user_id FK
        string state "(PENDING, ACCEPTED, DECLINED)"
        datetime sent_at
    }

    FriendInvitation {
        string id PK
        string sender_user_id FK
        string receiver_user_id FK
        string state "(PENDING, ACCEPTED, DECLINED)"
        datetime sent_at
    }

    Friendship {
        string id PK
        string user1_id FK
        string user2_id FK
        datetime created_at
    }

    User ||--o{ Game: "player1"
    User ||--o{ Game: "player2"
    User ||--o{ GameInvitation: "sends"
    User ||--o{ GameInvitation: "receives"
    User ||--o{ FriendInvitation: "sends"
    User ||--o{ FriendInvitation: "receives"
    User ||--o{ Friendship: "friend1"
    User ||--o{ Friendship: "friend2"
```

## Socket.io Events

### Home Page

#### Server to Client

- `game-invitation-received`: When a user receives a game invitation

### Game Page

#### Client to Server

- `game-move`: When a user makes a move in the game

#### Server to Client

- `game-move-opponent`: When the opponent makes a move in the game
- `game-finished`: When the game is finished
- `opponent-disconnected`: When the opponent disconnects


