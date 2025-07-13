const inputBox = document.getElementById('input');
const log = document.getElementById('log');

let isUserTurn = true;
let waitingForCorrection = false;

function logMessage(msg, sender='user') {
  const p = document.createElement('p');
  p.textContent = msg;
  p.className = sender;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

// reset the game
function resetGame(input) {
  fetch('http://127.0.0.1:8000/reset', {
    method: 'POST',
    headers: {},
    body: new URLSearchParams({ message: input })
  })
  .then(async res => {
    if (!res.ok) {
      const err = await res.json();
      logMessage(`Error: ${err.detail}`, 'error');
      waitingForCorrection = true;
      return;
    }
    const data = await res.json();
    logMessage(`You: ${input}`, 'user');
    logMessage(data.message, 'server');
    isUserTurn = false;
    waitingForCorrection = false;
  })
  .catch(err => {
    logMessage(`Fetch error: ${err.message}`, 'error');
  });
}

// Send user input to /play endpoint
function sendUserMove(input) {
  fetch('http://127.0.0.1:8000/play', {
    method: 'POST',
    headers: {},
    body: new URLSearchParams({ message: input })
  })
  .then(async res => {
    if (!res.ok) {
      const err = await res.json();
      logMessage(`Error: ${err.detail}`, 'error');
      waitingForCorrection = true;
      return;
    }
    const data = await res.json();
    logMessage(`You: ${input}`, 'user');
    logMessage(data.message, 'server');
    isUserTurn = false;
    waitingForCorrection = false;
  })
  .catch(err => {
    logMessage(`Fetch error: ${err.message}`, 'error');
  });
}

// Poll
function pollServer() {
  fetch('/poll')
    .then(res => res.json())
    .then(data => {
      if (data.waiting) {
        logMessage(`Server: ${data.message}`, 'server');
        isUserTurn = true;
        console.log('poll')
      }
    })
    .catch(err => {
      logMessage(`Poll error: ${err.message}`, 'error');
    });
}

// Set polling interval
setInterval(() => {
  if (isUserTurn && !waitingForCorrection) {
    pollServer();
  }
}, 5000);

// Event listeners
document.getElementById('submitBtn').addEventListener('click', () => {
  const input = inputBox.value.trim();
  if (input === '') return;
  inputBox.value = '';
  if (!isUserTurn) {
    logMessage("Wait for your turn.", 'error');
    return;
  }
  sendUserMove(input);
});

document.getElementById('resetBtn').addEventListener('click', () => {
  const input = inputBox.value.trim();
  resetGame(input);
});

inputBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('submitBtn').click();
  }
});
