let prompt=document.querySelector("#prompt")
let chatContainer=document.querySelector(".chat-container")
let imagebtn=document.querySelector("#image");
let imageinput=document.querySelector("#image input")

const api_url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAe8Lzt4yyIVoRB8qMH3-emTBCKcNqC1iU"

let user={
    message:null,
    file:{
        mime_type:null,
        data: null
    }
}
function createChatBox(html,classes) {
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
    
}

async function generateResponse(aiChatBox) {
    let text=aiChatBox.querySelector(".ai-chat-area")
    let RequestOption={
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            "contents":[{"parts":[{text:user.message},(user.file.data?[{inline_data:user.file}]:[])]}]
        })
    }
    try{
        let response=await fetch(api_url,RequestOption)
        let data=await response.json()
        let apiResponse=data.candidates[0].content.parts[0].text.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g,"$1").trim()
        text.innerHTML=apiResponse

    }
    catch(error){
        console.log(error)
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        user.file={}
        
    }
    
    
}

function handlechatResponse(userMessage) {
    user.message=userMessage.replace(/\n/g, "<br>")
    let html=`<div class="user-chat-area">
   ${user.message}
   ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
</div><img src="useeer.png">`
prompt.value=""
let userChatBox=createChatBox(html,"user-chat-box")
chatContainer.appendChild(userChatBox)

chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

setTimeout(()=>{
    let html=`<img src="robo (1).png">
    <div class="ai-chat-area">
    <img src="output-onlinegiftools.gif" class="load" width="70px"height="60px">
    </div>`
    let aiChatBox=createChatBox(html,"ai-chat-box")
    chatContainer.appendChild(aiChatBox)
    generateResponse(aiChatBox)
},600)
}
prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        handlechatResponse(prompt.value)
    }

})
imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
        user.file={
            mime_type:file.type,
            data: base64string
        }
        image.src=`data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("choose")
    }
    reader.readAsDataURL(file)
})


imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})