# Tic-tac-toad

Tic-tac-toe implemented in Javascript with TDD.

The game is hosted here: https://tic-tac-toad.herokuapp.com/

##### Quickstart

To install the project locally and start the Webpack dev server on port 8080:
```
git clone https://github.com/g-sam/tic-tac-toad.git && cd tic-tac-toad
npm install
npm run dev
```
Alternatively, `npm run tdd` will start the server and rerun tests on every change. 

To run tests and see coverage summary type `npm t`. 

##### What's new?

This section details the feedback received on the first iteration of the game and the changes made:

###### Missing installation instructions

See above!
 
###### The Law of Demeter

`./src/ui/game` formerly contained functions that did a lot of working composing functions from another class. This could be considered a violation of the Law of Demeter. These compositions have been moved to more appropriate places, in part through the changes relating to ***Player class and polymorphism*** 

###### Player class and polymorphism

It was observed that a function on the board class concerned only players. In addition, it was suggested more generally that I look into polymorphism. The most obvious candidate for polymorphic behaviour was of course the player, so I have created a Player class to address both points. Human and computer players implement the same interface, which greatly reduces the complexity of the Game class.

Despite the improvements I feel more could be done to weaken the coupling between Game, Player and UI.

###### Consider maps instead of switch statements

There are now no switch statments and one map in `.src/ui/index.js` which takes care of all conditional logic relating to actions.

###### Referencing actions

Instead of being typed directly as strings (error prone!), actions are now defined as symbols and imported wher necessary.

###### Stress test for unbeatability

The polymorphic player class made it easy to construct a new player to take random moves and pitch them against an AI opponent multiple times. See the last test in `./test/logic/ai.test.js`

###### 4x4 grid

Given that all the information about the board can be calculated from its length it did not seem necessary to create a polymorphic board class. The relevant function instead now simply take the length into account.

Since I had already implemented alpha-beta pruning, memoization provided most of the required performance boost. In addition:
 - I initially thought it would be necessary to access a static cache to retrieve the first few moves (see `./cache.js`). In fact, the cache showed that the first available cell scores joint highest in the early stages of the game, so the first few moves simply take the first available cell without drawing on a static cache.
 - The artificial delay in the computer move is now less if the calculation took longer, reducing the apparent delay. 
 - The UI now updates with the previous move before locking up for the calculation and displays a message indicating whose turn it is. 

On my 2012 Macbook Pro the greatest noticeable delay is about a second.

---

##### Features
- Choice of grids:
  - 3x3.
  - 4x4.
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
                     Board -------> Ai <----+
                       |             |      |
                       |             |      |
                       +--> Logic <--+      |
                              |             |
                              |             |
                              v             |
                  Opts       Game <----- Player
                   |          |
                   |          |
 DOMRenderer       +--> UI <--+
     |                  |
     |                  |
     +--> Controller <--+
```

