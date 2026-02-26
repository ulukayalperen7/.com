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
    let currentSessionId = null;

    // Backend API URL
    // const API_URL = 'http://localhost:8000/chat'; // Local testing
    const API_URL = 'https://career-ai-backend-sfcs.onrender.com/chat'; // Production URL

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
                    // Show typing immediately
                    // Fetch greeting from backend
                    // Note: We don't send a session ID here, so a new one is created.
                    fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message: "Hello", session_id: null }), // Initial handshake
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Store session ID if provided
                        if (data.session_id) {
                            currentSessionId = data.session_id;
                        }

                        if (data.response) {
                             appendMessage('bot', data.response);
                        } else if (data.agent_response) {
                             appendMessage('bot', data.agent_response); 
                        }
                    })
                    .catch(error => {
                        console.error('Greeting Error:', error);
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
        chatInput.style.height = 'auto'; // Reset height

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
                body: JSON.stringify({ 
                    message: messageText,
                    session_id: currentSessionId 
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Update session ID if it changed or was unset
            if (data.session_id) {
                currentSessionId = data.session_id;
            }

            hideTypingIndicator();

            // Handle response
            if (data.response) {
                appendMessage('bot', data.response);
            } else if (data.agent_response) {
                 appendMessage('bot', data.agent_response);
            } else {
                appendMessage('bot', "I received your message but couldn't generate a response.");
            }

        } catch (error) {
            console.error('Error:', error);
            hideTypingIndicator();
            appendMessage('bot', "Sorry, something went wrong. Please check your connection and try again.");
        } finally {
            chatSendBtn.disabled = false;
            chatInput.focus();
            scrollToBottom();
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
