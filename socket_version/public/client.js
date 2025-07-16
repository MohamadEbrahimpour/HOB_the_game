// username = prompt("Enter your username:");
// const socket = io({ query: { username } });
const username_form = document.getElementById('username_form');
const username_input = document.getElementById('username_input');

const chat_container = document.getElementById('chat-container');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

function adding_message(content, cname, username=""){
  const item = document.createElement('li')
  item.className = cname;
  if (username === "") {
    item.textContent = content;
  } else {
    const span = document.createElement('span');
    span.style.fontWeight = 'bold';
    span.textContent = `${username}: `;

    item.appendChild(span);
    item.appendChild(document.createTextNode(content));
  }
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

username_form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (username_input.value) {
    const username = username_input.value.trim()
    const socket = io({ query: { username: username_input.value.trim() } });
    
    document.getElementById("username_input").disabled = true;
    document.getElementById("username_btn").disabled = true;
    chat_container.style.display = '';  
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value) {
        socket.emit('game message', input.value);
        input.value = '';
      }
    });

    socket.on('game message', (msg) => {
      if (msg["username"] == username){
        class_name = "self_message"
      }else{
        class_name = "user_message"
      }
      adding_message(msg["content"], class_name, msg["username"])
    });


    socket.on('server message', (msg) => {
      adding_message(msg, "server_message")
    });
  }
});
