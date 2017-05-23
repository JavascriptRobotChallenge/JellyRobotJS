# JellyRobots

## 3D Multiplayer Browser Game

JellyRobots is a 3D-multiplayer browser-based game where players can code robots in Javascript with the help of an API that we've written and provided.
Battle your robots in either multiplayer mode or training mode against one of our default robots.
![](https://media.giphy.com/media/o9WlcuZkLDw4g/giphy.gif)

## Watch an overview of our game here.

## Gameplay

After players spend some time coding their robot using their knowledge of Javascript and our docs, it's time to battle.
Our robot API provides a handful of walking, firing, and other helper functions to aid players in creating their ultimate Javascript robot.

## Architecture

Let’s step through a high-level overview of what happens when a user writes code for a robot and then presses submit.

The code editor that users write in is a React component, and when they press Submit, that component’s state is sent to the server via a Socket.IO event.

On the server, we have a game loop that runs 30 times per second and repeatedly evaluates the code that the user has submitted and updates the game state.
Within the game loop, the code is evaluated in a sandbox -- we used Sandcastle -- that prevents this code from damaging or crashing our server.
The sandbox then updates our server-side Redux store, which we use to keep track of the game state for ALL players.
When the game state is broadcasted down to all clients using socket IO, their local redux stores are updated with the most recent state.

This is then used to re-render the appearance of the Three.JS scene which we used as our 3D graphics library.
Now we have a robot who can move and fire projectiles, and who will be continually updated as the server’s game loop sends down updated data.
![]('public/assets/architecture.png')


## My anatomy

`/app` has the React/Redux setup. `main.jsx` is the entry point.

`/db` has the Sequelize models and database setup. It'll create the database for you if it doesn't exist,
assuming you're using postgres.

`/server` has the Express server and routes. `start.js` is the entry point.

`/bin` has scripts. (Right now it has *one* script that creates a useful symlink.)

## Conventions

I use `require` and `module.exports` in `.js` files.

I use `import` and `export` in `.jsx` files, unless `require` makes for cleaner code.

I use two spaces, no semi-colons, and trailing commas where possible. I'll
have a linter someday soon.

## Quick Heroku deployment

1. Set up the [Heroku command line tools](https://devcenter.heroku.com/articles/heroku-cli) and install [Yarn](https://yarnpkg.com/en/) if you haven't already (`npm install -g yarn`)
2. `heroku login`
3. Add a git remote for heroku:
  - **If you're creating a new app...**
    1. `heroku create` or `heroku create your-app-name` if you have a name in mind.
    2. `heroku addons:create heroku-postgresql:hobby-dev` to add postgres
    3. `npm run deploy-heroku`. This will create a new branch and compile and commit your frontend JS to it, then push that branch to Heroku.
    4. `heroku run npm run seed` to seed the database

  - **If you already have a Heroku app...**
    1.  `heroku git:remote your-app-name` You'll need to be a collaborator on the app.

Afterwards,
  - *To deploy:* `npm run deploy-heroku`
  - *To re-seed:* `heroku run npm run seed`
