(function () {
    const app = document.querySelector(".app");
    const socket = io();

    let unname;

    // Join chat
    app.querySelector(".join-screen #join-user").addEventListener("click", function () {
        let username = app.querySelector(".join-screen #username").value.trim();
        if (username.length === 0) {
            return;
        }
        unname = username;

        socket.emit("newuser", unname);

        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    // Send message
    app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
        let message = app.querySelector(".chat-screen #message-input").value.trim();
        if (message.length === 0) {
            return;
        }

        renderMessage("my", {
            username: unname,
            text: message
        });

        socket.emit("chat", {
            username: unname,
            text: message
        });

        app.querySelector(".chat-screen #message-input").value = "";
    });

    // Listen for messages from server
    socket.on("chat", function (data) {
        renderMessage("other", data);
    });

    // Listen for updates
    socket.on("update", function (message) {
        renderMessage("update", message);
    });

    // Exit chat
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
        socket.emit("exituser", unname);
        window.location.href = window.location.href;
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        let el = document.createElement("div");

        if (type === "my") {
            el.classList.add("message", "my-message");
            el.innerHTML = `
                <div class="name">You</div>
                <div class="text">${message.text}</div>
            `;
        } else if (type === "other") {
            el.classList.add("message", "other-message");
            el.innerHTML = `
                <div class="name">${message.username}</div>
                <div class="text">${message.text}</div>
            `;
        } else if (type === "update") {
            el.classList.add("update-message");
            el.innerText = message;
        }

        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
})();
