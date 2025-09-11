const socket = io();

const chatBox = document.querySelector("#chatBox");
const inputMessage = document.querySelector("#msgInput");
const sendButton = document.querySelector("#send-btn");
const logoutButton = document.querySelector("#logout-btn");

const username = sessionStorage.getItem("username");

socket.emit("join", username);

function appendMessage(data) {
  const msg = document.createElement("div");

  if (data.user === "system") {
    msg.classList.add(
      "text-center",
      "text-sm",
      "text-gray-400",
      "italic",
      "my-2"
    );
    msg.innerText = data.text;
  } else if (data.user === username) {
    msg.classList.add(
      "bg-green-600",
      "text-white",
      "rounded-lg",
      "p-2",
      "max-w-xs",
      "ml-auto",
      "text-right"
    );
    msg.innerText = `أنا: ${data.text}`;
  } else {
    msg.classList.add(
      "bg-gray-700",
      "text-white",
      "rounded-lg",
      "p-2",
      "max-w-xs"
    );
    msg.innerText = `${data.user}: ${data.text}`;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

socket.on("message", (data) => {
  appendMessage(data);
});

sendButton.addEventListener("click", () => {
  const message = inputMessage.value.trim();
  if (message) {
    socket.emit("chatMessage", message);
    inputMessage.value = "";
  }
});

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem("username");
  window.location.href = "/";
});
