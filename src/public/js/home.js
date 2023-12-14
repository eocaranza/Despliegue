const socketClient = io();

const chatbox = document.getElementById("chatbox");
const chat = document.getElementById("messageLogs");

let user;

Swal.fire({
    title: "Identificate",
    input:"text",
    text:"Ingresa un nombre de usuario para el chat",
    inputValidator:(value)=>{
        if(!value){
            return "El nombre de usuario es obligatorio";
        }
    },
    allowOutsideClick: false
}).then((result)=>{
    user = result.value;
    socketClient.emit("authenticated", `Usuario ${user} ha iniciado sesion`)
});

chatbox.addEventListener("keyup", (e)=>{
    if(e.key === "Enter"){
        if(chatbox.value.trim().length>0){
            socketClient.emit("message",{user:user,
            message:chatbox.value});
            chatbox.value = "";
        }
    }
});

socketClient.on("messageHistory",(dataServer)=>{
    let messageElmts = "";
    dataServer.forEach(item => {
        messageElmts = messageElmts + `${item.user}: ${item.message} <br/>`
    });
    chat.innerHTML = messageElmts;
});

socketClient.on("newUser",(data)=>{
    if(user){
        Swal.fire({
            text:data,
            toast:true,
            position:"top-right"
        });
    }
});