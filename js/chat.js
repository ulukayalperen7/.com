document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.getElementById('chat-widget');
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const typingIndicator = document.getElementById('typing-indicator');

    // Add greeting on first open
    let hasGreeted = false;

    // Backend API URL
    const API_URL = 'https://career-ai-backend-sfcs.onrender.com/chat';

    // Toggle Chat Widget
    chatToggleBtn.addEventListener('click', () => {
        chatWidget.classList.toggle('open');
        if (chatWidget.classList.contains('open')) {
            chatInput.focus();
            // Scroll to bottom if opened
            scrollToBottom();
            
            if (!hasGreeted) {
                hasGreeted = true;
                setTimeout(() => {
                    showTypingIndicator(); // Show typing immediately
                    // Fetch greeting from backend
                    fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message: "Hello, please introduce yourself briefly in English." }), // Hidden prompt to generate introduction
                    })
                    .then(response => response.json())
                    .then(data => {
                        hideTypingIndicator();
                        if (data.agent_response) {
                             appendMessage('bot', data.agent_response);
                        } else if (data.response) {
                             appendMessage('bot', data.response);
                        }
                    })
                    .catch(error => {
                        console.error('Greeting Error:', error);
                        hideTypingIndicator();
                        appendMessage('bot', "Hello! I'm Alperen's AI Assistant. How can I help you?");
                    });
                }, 500);
            }
        }
    });

    // Close Chat Widget
    chatCloseBtn.addEventListener('click', () => {
        chatWidget.classList.remove('open');
    });

    // Handle Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Handle Send Button
    chatSendBtn.addEventListener('click', sendMessage);

    // Enable/Disable send button based on input
    chatInput.addEventListener('input', () => {
        chatSendBtn.disabled = chatInput.value.trim() === '';
    });

    async function sendMessage() {
        const messageText = chatInput.value.trim();
        if (!messageText) return;

        // Clear input and disable button
        chatInput.value = '';
        chatSendBtn.disabled = true;

        // Add user message to UI
        appendMessage('user', messageText);

        // Show typing indicator
        showTypingIndicator();

        try {
            // Send request to backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Hide typing indicator
            hideTypingIndicator();

            // Add bot response to UI
            if (data.agent_response) {
                appendMessage('bot', data.agent_response);
            } else if (data.response) {
                appendMessage('bot', data.response);
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('Chat Error:', error);
            hideTypingIndicator();
            appendMessage('error', 'Sorry, I encountered an error connecting to the server. Please try again later.');
        }
    }

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        // Use marked.js for markdown parsing if available, otherwise fallback to basic formatting
        if (typeof marked !== 'undefined') {
            // Configure marked to open links in new tab
            marked.setOptions({
                breaks: true,
                gfm: true
            });
            
            // Custom renderer for links
            const renderer = new marked.Renderer();
            const linkRenderer = renderer.link;
            renderer.link = function(href, title, text) {
                const html = linkRenderer.call(renderer, href, title, text);
                return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ');
            };
            
            messageDiv.innerHTML = marked.parse(text, { renderer: renderer });
        } else {
            let formattedText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            messageDiv.innerHTML = `<p>${formattedText}</p>`;
        }
        
        // Insert before typing indicator
        chatMessages.insertBefore(messageDiv, typingIndicator);
        scrollToBottom();
    }

    function showTypingIndicator() {
        typingIndicator.classList.add('active');
        scrollToBottom();
    }

    function hideTypingIndicator() {
        typingIndicator.classList.remove('active');
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
