# Tic-tac-toad

Tic-tac-toe implemented in Javascript with TDD.

The game is hosted here: https://tic-tac-toad.herokuapp.com/

##### Features
- Choice of games:
  - Human versus human.
  - Computer versus computer.
  - Human versus computer.
- User chooses who goes first.
- Unbeatable computer player.

##### Technologies

- ES6 and stage-2 language features transpiled by Webpack.
- Ava, jsdom and sinon for testing.
- Jquery for simplifying dom manipulation.
- Negamax with alpha-beta pruning for ai.
- Redux-flavoured state management.

##### Dependency structure

```
                     board -------> ai
                       |             |
                       |             |
                       +--> Logic <--+
                              |
                              |
                              v
                  Opts       Game
                   |          |
                   |          |
 DOMRenderer       +--> UI <--+
     |                  |
     |                  |
     +--> Controller <--+
```

--  
  
Put up in a place  
Where it's easy to see  
The cryptic admonishment  
T. T. T.    
 —Piet Hein



