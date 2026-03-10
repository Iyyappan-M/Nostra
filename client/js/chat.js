document.addEventListener('DOMContentLoaded', () => {
    // Inject Chatbot HTML
    const chatHTML = `
        <div class="chat-widget-btn" id="chat-btn">
            <i class="fa-solid fa-comment-dots"></i>
            <div class="unread-dot"></div>
        </div>

        <div class="chat-modal" id="chat-modal">
            <div class="chat-header">
                <h3><i class="fa-solid fa-robot"></i> Nostra Assistant</h3>
                <div class="chat-close" id="chat-close"><i class="fa-solid fa-xmark"></i></div>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message bot">
                    Hello! I'm your Nostra Assistant. How can I help you today? 
                    <br><br>
                    Try asking: <b>"Show me men jackets"</b> or <b>"Women dresses under 100"</b>
                </div>
            </div>
            <form class="chat-input-area" id="chat-form">
                <input type="text" id="chat-input" placeholder="Ask me anything..." autocomplete="off">
                <button type="submit" class="chat-send-btn">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </form>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const chatBtn = document.getElementById('chat-btn');
    const navbarChatBtn = document.getElementById('navbar-chat-btn');
    const chatModal = document.getElementById('chat-modal');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle Chat
    const toggleChat = () => {
        chatModal.classList.add('active');
        document.querySelector('.unread-dot').style.display = 'none';
        chatInput.focus();
    };

    if (chatBtn) chatBtn.addEventListener('click', toggleChat);
    if (navbarChatBtn) navbarChatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleChat();
    });

    chatClose.addEventListener('click', () => {
        chatModal.classList.remove('active');
    });

    // Handle Send
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;

        // Add User Message
        appendMessage('user', msg);
        chatInput.value = '';

        // Add Loading State
        const loadingId = appendMessage('bot', '<i class="fa-solid fa-ellipsis fa-beat"></i> Thinking...');

        try {
            const res = await fetch('http://localhost:5000/api/chat/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg })
            });

            const data = await res.json();

            // Remove Loading
            document.getElementById(loadingId).remove();

            if (data.products && data.products.length > 0) {
                appendMessage('bot', data.reply);
                appendProducts(data.products);
            } else {
                appendMessage('bot', data.reply || "Sorry, I couldn't find any products.");
            }

        } catch (err) {
            document.getElementById(loadingId).remove();
            appendMessage('bot', "Oops! My fashion circuit is down. Please try again later.");
        }
    });

    function appendMessage(sender, text) {
        const id = 'msg-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.id = id;
        msgDiv.innerHTML = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function appendProducts(products) {
        const listDiv = document.createElement('div');
        listDiv.className = 'chat-product-list';

        products.forEach(p => {
            const imageUrl = p.image.startsWith('http') ? p.image : `images/${p.image}`;
            listDiv.innerHTML += `
                <a href="collection.html" class="chat-product-card">
                    <img src="${imageUrl}" alt="${p.name}">
                    <div class="chat-product-info">
                        <h4>${p.name}</h4>
                        <p class="price">₹${p.price.toLocaleString('en-IN')}</p>
                    </div>
                </a>
            `;
        });

        chatMessages.appendChild(listDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
