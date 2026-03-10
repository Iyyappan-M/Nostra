const API_BASE_CHAT = window.location.protocol === 'file:' ? 'https://nostra-z943.onrender.com' : '';

console.log('Chatbot: Initializing with API_BASE:', API_BASE_CHAT);

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
    
    // Cleanup any existing ones
    const existing = document.querySelectorAll('.chat-widget-btn, .chat-modal');
    existing.forEach(e => {
        console.log('Chatbot: Removing old element', e.className);
        e.remove();
    });
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const chatBtn = document.getElementById('chat-btn');
    const navbarChatBtn = document.getElementById('navbar-chat-btn');
    const chatModal = document.getElementById('chat-modal');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatBtn || !chatModal) {
        console.error('Chatbot: Failed to find critical UI elements after injection.');
        return;
    }

    // Toggle Chat
    const toggleChat = () => {
        console.log('Chatbot: Toggling window');
        chatModal.classList.add('active');
        const unread = document.querySelector('.chat-widget-btn .unread-dot');
        if (unread) unread.style.display = 'none';
        chatInput.focus();
    };

    chatBtn.addEventListener('click', toggleChat);
    if (navbarChatBtn) {
        navbarChatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleChat();
        });
    }

    chatClose.addEventListener('click', () => {
        chatModal.classList.remove('active');
    });

    // Handle Send
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;

        console.log('Chatbot: Sending message:', msg);

        // Add User Message
        appendMessage('user', msg);
        chatInput.value = '';

        // Add Loading State
        const loadingId = appendMessage('bot', '<i class="fa-solid fa-ellipsis fa-beat"></i> Thinking...');

        try {
            const endpoint = `${API_BASE_CHAT}/api/chat/search`;
            console.log('Chatbot: Fetching from:', endpoint);

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg })
            });

            if (!res.ok) {
                throw new Error(`Server responded with ${res.status}`);
            }

            const data = await res.json();

            // Remove Loading
            const loadingEl = document.getElementById(loadingId);
            if (loadingEl) loadingEl.remove();

            if (data.products && data.products.length > 0) {
                appendMessage('bot', data.reply);
                appendProducts(data.products);
            } else {
                appendMessage('bot', data.reply || "Sorry, I couldn't find any products.");
            }

        } catch (err) {
            console.error('Chatbot Error:', err);
            const loadingEl = document.getElementById(loadingId);
            if (loadingEl) loadingEl.remove();
            
            if (err.message.includes('404')) {
                appendMessage('bot', "The chat server is currently updating. Please wait a minute while we deploy the fashion circuits!");
            } else {
                appendMessage('bot', "Oops! My fashion circuit is down. Please try again later or check if you're connected to the internet.");
            }
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
