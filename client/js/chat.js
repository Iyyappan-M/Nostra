const API_BASE_CHAT = window.location.protocol === 'file:' ? 'https://nostra-z943.onrender.com' : '';

document.addEventListener('DOMContentLoaded', () => {
    // Inject Gemini Chatbot HTML with White & Green Theme
    const chatHTML = `
        <div class="gemini-chat-container">
            <div class="chat-widget-btn" id="chat-btn" style="background: #2ecc71; box-shadow: 0 10px 20px rgba(46, 204, 113, 0.3);">
                <i class="fa-solid fa-sparkles" style="margin-right: 5px;"></i>
                <span>Ask AI</span>
            </div>

            <div class="chat-modal" id="chat-modal">
                <div class="chat-header" style="background: #2ecc71;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 35px; height: 35px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #2ecc71;">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                        <div>
                            <h3 style="margin: 0; font-size: 1rem;">Nostra Gemini AI</h3>
                            <span style="font-size: 0.7rem; opacity: 0.8;">Always active to help you</span>
                        </div>
                    </div>
                    <div class="chat-close" id="chat-close"><i class="fa-solid fa-xmark"></i></div>
                </div>
                
                <div class="chat-messages" id="chat-messages">
                    <div class="message bot">
                        Hi there! 👋 I'm your **Nostra Gemini AI** assistant. 
                        I can help you find products, explain our subscription plans, or navigate the boutique. 
                        What's on your mind?
                    </div>
                </div>

                <div id="typing-indicator" style="display: none; padding: 0 1.5rem 1rem; font-size: 0.8rem; color: #888;">
                    <i class="fa-solid fa-circle-notch fa-spin"></i> Gemini is thinking...
                </div>

                <form class="chat-input-area" id="chat-form">
                    <input type="text" id="chat-input" placeholder="Type your message..." autocomplete="off">
                    <button type="submit" class="chat-send-btn" style="background: #2ecc71;">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    `;
    
    // Remove existing if any
    const oldBtns = document.querySelectorAll('.chat-widget-btn, .chat-modal');
    oldBtns.forEach(el => el.remove());
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const chatBtn = document.getElementById('chat-btn');
    const chatModal = document.getElementById('chat-modal');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');

    // Toggle Chat
    chatBtn.addEventListener('click', () => {
        chatModal.classList.toggle('active');
        if (chatModal.classList.contains('active')) {
            chatInput.focus();
        }
    });

    chatClose.addEventListener('click', () => {
        chatModal.classList.remove('active');
    });

    // Handle Submit
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;

        appendMessage('user', msg);
        chatInput.value = '';
        
        // Show typing
        typingIndicator.style.display = 'block';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const res = await fetch(`${API_BASE_CHAT}/api/chat/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg })
            });

            const data = await res.json();
            typingIndicator.style.display = 'none';

            if (data.reply) {
                appendMessage('bot', data.reply);
            }

            if (data.products && data.products.length > 0) {
                appendProducts(data.products);
            }

        } catch (err) {
            typingIndicator.style.display = 'none';
            appendMessage('bot', "I'm sorry, I'm having trouble connecting to my Gemini core. Please check your internet or try again later.");
        }
    });

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        // Simple markdown-like bolding support
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        msgDiv.innerHTML = formattedText;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendProducts(products) {
        const listDiv = document.createElement('div');
        listDiv.className = 'chat-product-list';
        products.forEach(p => {
            const imageUrl = p.image.startsWith('http') ? p.image : `images/${p.image}`;
            listDiv.innerHTML += `
                <a href="collection.html" class="chat-product-card" style="border-left: 3px solid #2ecc71;">
                    <img src="${imageUrl}" alt="${p.name}">
                    <div class="chat-product-info">
                        <h4 style="margin:0; font-size: 0.9rem;">${p.name}</h4>
                        <p class="price" style="color: #2ecc71; margin:0; font-weight:700;">₹${p.price.toLocaleString('en-IN')}</p>
                    </div>
                </a>
            `;
        });
        chatMessages.appendChild(listDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
