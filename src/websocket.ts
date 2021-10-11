import { io } from './http';

interface IRoomUser {
    socket_id: string;
    username: string;
    room: string;
}

interface IMessage {
    room: string;
    message: string;
    username: string;
    createdAt: Date;
}

const users: IRoomUser[] = [];

const messages: IMessage[] = [];

// io => é algo relacionado com todos os usuários
io.on('connection', socket => {
    // socket => é algo direcionado a um cliente em específico
    // Usuário se conectando na sala
    socket.on('select_room', (data, callback) => {
        // Entrando na sala
        socket.join(data.room);

        const userInRoom = users.find(user =>
            user.username === data.username
            && user.room === data.room
        );

        // Verificando se o usuário já estava conectado a esta sala quando criou uma nova conexão
            // Atualiza o socket id dele
        if(userInRoom) {
            userInRoom.socket_id = socket.id;
        } else {
            // Adicionando o usuário na lista
            users.push({
                socket_id: socket.id,
                username: data.username,
                room: data.room,
            });
        }

        // Retornando as mensagens já enviadas na sala
        const messagesRoom = getMessagesRoom(data.room);

        callback(messagesRoom);
    });

    // Recebendo mensagem
    socket.on('message', data => {
        // Salvando a nova mensagem
        const message: IMessage = {
            room: data.room,
            message: data.message,
            username: data.username,
            createdAt: new Date(),
        }

        messages.push(message);

        // Enviando a mensagem para todos (usa o io)
        io.to(data.room).emit('message', message);
    });
});

function getMessagesRoom(room: string) {
    const messagesRoom = messages.filter(message => message.room === room);

    return messagesRoom;
}
