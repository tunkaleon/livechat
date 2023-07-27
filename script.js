const chatInput = document.querySelector(".chat-input textarea");
const sendchatbtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatTaggler = document.querySelector(".chatbot-toggler");
const chatbotClosebtn = document.querySelector(".close-btn");

let userMessage;

const API_KEY ="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";
const inputinitheight = chatInput.scrollHeight;
const createChatli = (message,className)=>{

    // create a chat <li> element with passed message and class

    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatContent = className ==="outgoing"? `<p></p>`: `<span class="material-symbols-outlined"></span><p></p>`;
    chatli.innerHTML = chatContent;
    chatli.querySelector("p").textContent = message;
    return chatli;
}
const generateResponse = (incamingChatLi)=>{
    const API_URL="https://api.openai.com/v1/chat/completions";
    const messageElement = incamingChatLi.querySelector("p");

    //define the properties and message for the API request

    const requestOptions = {
        method: "POST",
        header:{
            "content-type":"application/json",
            "Autholization":`bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user",content: userMessage}],
        })
    }
    //send request to API to get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
        messageElement.textContent =  data.choise[0].message.content;        
    }).catch((error) =>{
        messageElement.classList.add("error");
        messageElement.textContent =  "sorry!";
    }).finally(()=> chatbox.scrollTo(  0, chatbox.scrollHeight));
}


const handChat = ()=>{
    userMessage= chatInput.value.trim();
    if(!userMessage)
        return;
        chatInput.value="";
        chatInput.style.height = `${chatInput.scrollHeight}px`;
        
        // append user's message to the chatbox
        chatbox.appendChild (createChatli(userMessage,"outgoing"));
        chatbox.scrollTo(  0, chatbox.scrollHeight);
        setTimeout(()=>{
            //display thinking message when is waiting response!
            const incamingChatLi = createChatli("thinking....","incaming"); 
            chatbox.appendChild (incamingChatLi);
            chatbox.scrollTo(  0, chatbox.scrollHeight);
            generateResponse(incamingChatLi);
        }, 600);
}  
//increase height based on its content
chatInput.addEventListener("input",()=>{
    chatInput.style.height = `${inputinitheight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", ()=>{
    if(e.key === "enter" && !e.shiftkey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
})

sendchatbtn.addEventListener('click',handChat); 
chatTaggler.addEventListener("click", ()=>document.body.classList.toggle("show-chatbot"));
chatbotClosebtn.addEventListener("click", ()=>document.body.classList.remove("show-chatbot"));
