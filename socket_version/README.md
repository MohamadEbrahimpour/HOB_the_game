# Local Chat & HOB Game

This is a simple **local multiplayer chat app with a built-in HOB counting game**, built using:

- **Node.js & Express**
- **Socket.IO** (for real-time connection)
- **Vanilla JavaScript & HTML** (for the client)

---

## Features

\ Users enter a username and join a shared chat.
\ Everyone sees messages instantly via socket.
\ Everyone can chat as they want.
\ Includes a counting game which happens when any user types a number:

- Server responds and users take turns entering the next number.
- Every multiple of **5** should be `"HOB"`.
- The server tracks the game and sends back success or corrections.

---

## How to run

### 1. Install dependencies

In the project folder (where your `server.js` is):

```bash
npm install express socket.io
```

### 2. Run the server

```bash
node server.js
```

By default it runs on [http://localhost:3000](http://localhost:3000).

---

## How to use

1. Open `http://localhost:3000` in your browser.
2. Enter a username to join the chat.
3. Type and chat or start playing by typing a number:
   - Type `1`, then wait for the server, then `3` and so on ...
4. If someone gets it wrong, the server tells you the right answer.

---

## Project structure

| File         | Description                                                                   |
| ------------ | ----------------------------------------------------------------------------- |
| `server.js`  | Runs the Express server, handles Socket.IO events, tracks the HOB game state. |
| `client.js`  | Handles the front-end logic: sending chat/game messages, updating the DOM.    |
| `index.html` | Simple interface with username form, chat display, and input.                 |
| `style.css`  | Referenced in HTML for your styles.                                           |

---

## How it works

- **Socket.IO** connects each client to the server.
- When you send a message, it emits a `"game message"` event to the server.
- The server:
  - broadcasts the message to all users.
  - checks if the HOB game rules are followed, and sends feedback with `"server message"`.
- Messages are rendered on each client, with your own messages styled differently.

---

## Quick demo of game rules

```txt
User1: 1
User2: 2
User3: 3
User4: 4
User5: HOB
User6: 6
...
```

If someone types `5` instead of `"HOB"`, the server responds:

```txt
Wrong (HOB is right)
```

---
