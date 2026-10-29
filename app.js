const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");
const sendButton = document.getElementById("send-button");
const modeLabel = document.getElementById("mode-label");

function addMessage(role, text, extraClass = "") {
  const row = document.createElement("div");
  row.className = `message ${role} ${extraClass}`.trim();
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "YOU" : "V";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  row.append(avatar, bubble);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
  row.scrollIntoView({ behavior: "smooth", block: "end" });
  return row;
}

function removeWelcome() {
  const welcome = messages.querySelector(".welcome");
  if (welcome) welcome.remove();
}

async function sendMessage(message) {
  removeWelcome();
  addMessage("user", message);
  input.value = "";
  input.style.height = "auto";
  sendButton.disabled = true;
  const typing = addMessage("assistant", "Vedant is thinking…", "typing");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    typing.remove();
    if (!response.ok) throw new Error(data.error || "Something went wrong.");
    addMessage("assistant", data.reply);
    modeLabel.textContent = data.mode === "ai" ? "AI mode" : "Demo mode";
  } catch (error) {
    typing.remove();
    addMessage("assistant", error.message || "Connection error. Please try again.");
  } finally {
    sendButton.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const message = input.value.trim();
  if (message && !sendButton.disabled) sendMessage(message);
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
});

input.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

messages.addEventListener("click", event => {
  const button = event.target.closest(".suggestion");
  if (button) sendMessage(button.textContent);
});

document.getElementById("new-chat").addEventListener("click", () => {
  messages.innerHTML = `<div class="welcome">
    <div class="welcome-icon">✦</div>
    <h3>Namaste! Main Vedant hoon.</h3>
    <p>Ask a question, explore an idea, or start a conversation.</p>
    <div class="suggestions">
      <button class="suggestion">Tell me about yourself</button>
      <button class="suggestion">Help me get started</button>
      <button class="suggestion">Hindi mein baat karo</button>
    </div>
  </div>`;
  modeLabel.textContent = "Demo mode";
  input.focus();
});
