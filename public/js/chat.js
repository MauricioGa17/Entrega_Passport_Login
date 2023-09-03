//Conexion con Socket
const socket = io()
socket.emit('new');

//Inputs
const formChat = document.getElementById('chat_form');
const emailInput = document.getElementById('email_input');
const messageInput = document.getElementById('message_input');

//Divs Mensages
const logMessages = document.getElementById('log_messages')
let messages = logMessages.innerHTML;

formChat.addEventListener('submit', (event) =>{
    event.preventDefault()

    if(emailInput.value == "" || messageInput.value == ''){
        Swal.fire({
            icon: 'error',
            title: 'Campos Vacios',
            text: 'Porfavor ingresa los datos en los campos',
        })

        return;
    }

    const url = '/api/chat/';
    const data = { user: emailInput.value, message: messageInput.value };

    fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => 
        res.json()
    ).catch((error) => {
        console.error("Error:", error)
    }).then((response) => {
        //Enviar Respuesta al socket
        socket.emit('messages', response)
    });
})

socket.on('message_response', message =>{
    messages += `
        <div>
            <h4>User: ${message.user}</h4>
            <label>${message.message}</label>
        </div>
    `
    logMessages.innerHTML = messages;
})


