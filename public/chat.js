const socket = io();

const urlSearch = new URLSearchParams(window.location.search);

const username = urlSearch.get('username');
const room = urlSearch.get('room');

// emit => Emitir alguma informação
// on => Ficar escutando alguma informação

socket.emit('select_room', {
    username,
    room,
}, response => {
    response.forEach(messageData => addMessageOnChat(messageData));
});

socket.on('message', data => {
    addMessageOnChat(data);
});

document.getElementById('input-message')
    .addEventListener('keypress', event => {
        if(event.key === 'Enter') {
            event.preventDefault();

            const message = event.target.value;

            const data = {
                room,
                message,
                username,
            }

            socket.emit('message', data);

            event.target.value = '';
        }
    });

document.getElementById('logout-button')
    .addEventListener('click', event => {
        window.location.href = 'index.html';
    });

document.getElementById('username').innerHTML = username;
document.getElementById('room').innerHTML = room;

function addMessageOnChat(messageData) {
    const chat = document.getElementById('chat');

    const pElement = document.createElement('p');
    const strongElement = document.createElement('strong');

    strongElement.innerHTML = messageData.username;
    pElement.appendChild(strongElement);

    const createdAt = new Date(messageData.createdAt);

    const day = createdAt.getDate();
    const month = createdAt.getMonth() + 1;
    const hours = createdAt.getHours();
    const minutes = createdAt.getMinutes();

    pElement.innerHTML += ` ${messageData.message} ${day}/${month} ${hours}:${minutes}`;
    pElement.className = 'message';

    chat.appendChild(pElement);
}
