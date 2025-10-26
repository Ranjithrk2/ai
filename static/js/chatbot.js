// 🧠 AI Chatbot Script
const chatbotBtn = document.getElementById("chatbot-btn");
const chatbotWindow = document.getElementById("chatbot-window");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

chatbotBtn.onclick = () => chatbotWindow.style.display = "flex";
closeChat.onclick = () => chatbotWindow.style.display = "none";

async function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;

  appendMessage("You", msg);
  chatInput.value = "";

  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await response.json();
    appendMessage("AI", data.reply);
  } catch (error) {
    appendMessage("AI", "⚠️ Server not responding. Please try again later.");
  }
}

sendBtn.onclick = sendMessage;
chatInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.textContent = `${sender}: ${text}`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
