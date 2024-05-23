# System Requirement Specification

## Eisen van de casus

Onderstaand vind je de eisen die verwerkt moeten worden bij het uitwerken van het Laravel project.

- Landing Page: De bezoeker van de website komt bij het laden van de website uit op de landing page.
  Het is de bedoeling dat de landing page de bezoeker een duidelijk beeld geeft wat er gespeeld kan worden op de
  website.
  Op de landingspage is ook een overzicht te vinden met een leaderboard.
  Hier staat wie deze dag, deze week en aller tijde het meest gewonnen potjes heeft.
- Gebruikers: Op de website moet het mogelijk zijn om als gebruiker jezelf te kunnen registreren en te kunnen inloggen.
- Spel spelen: Het spel is voorbij en is het gelijkspel. Als het woord wel geraden is door een speler, dan heeft deze
  speler gewonnen.
- Vrienden toevoegen: Spelers moeten elkaar kunnen toevoegen als vriend. Je kan op username of email elkaar uitnodigen.
  Een andere speler kan deze uitnodiging accepteren of weigeren. Ik wil als speler die iemand uitnodigt als vriend, de
  laatste status kunnen zien.
- Spel starten: Een spel kan je starten door te kiezen voor willekeurige tegenstander of door te kiezen tegen welke
  vriend je dit wilt spelen. Als je kiest voor willekeurige tegenstander, dan speel je tegen een willekeurige speler die
  in het systeem voorkomt. Dit moet een speler zijn met de minst “open” games. Als je kiest voor een vriend, dan wordt
  het spel uiteraard gespeeld tegen een vriend. Het spel kan pas starten als de andere speler de speluitnodiging
  accepteert.

## System Requirements

| Requirement                                                                 | MoSCoW |
|-----------------------------------------------------------------------------|--------|
| User can login with Google                                                  | Must   |
| User can play a game of tic tac toe with a random player                    | Must   |
| User can send friend invite                                                 | Must   |
| User can see the status of a friend invitation                              | Must   |
| User can accept or decline a friend invitation                              | Must   |
| User can send friends a game invite                                         | Must   |
| User can accept or decline a game invitation                                | Must   |
| Leader board about who has won the most games today, this week and all time | Must   |

### Pages

| Page         | Description                                                                          | 
|--------------|--------------------------------------------------------------------------------------|
| Landing Page | User can see the leaderboard and play game with randoms or choose a friend to invite | 
| Friends Page | User can manage friends and manage friend invites in and outgoing                    |
| Login Page   | User can login with Google                                                           |
| Que page     | Wait for an random opponent or friend to join the game or cancel the que             |
| Game Page    | Play a game of tic tac toe with a random player or friend                            |
