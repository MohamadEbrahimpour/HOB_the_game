// username = prompt("Enter your username:");
// const socket = io({ query: { username } });
const username_form = document.getElementById('username_form');
const username_input = document.getElementById('username_input');

const chat_container = document.getElementById('chat-container');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

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
      console.log(msg["username"], username, msg["username"] == username, msg["username"] === username)
      if (msg["username"] == username){
        class_name = "self_message"
      }else{
        class_name = "user_message"
      }
      adding_message(msg["content"], class_name)
    });


    socket.on('server message', (msg) => {
      adding_message(msg, "server_message")
    });
  }
});

function adding_message(content, cname){
  const item = document.createElement('li')
  item.className = cname;
  item.textContent = content;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}
