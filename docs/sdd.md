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

### Client to Server

- `joinQueue`: Join the queue for a game

### Server to Client

