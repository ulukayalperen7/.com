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
    // Detective Fix: Switch to PRODUCTION URL for live deployment
    const API_URL = 'https://career-ai-backend-sfcs.onrender.com/chat'; // Production URL
    // const API_URL = 'http://localhost:8000/chat'; // Local testing URL (Commented out for release)

    // Toggle Chat Widget
    chatToggleBtn.addEventListener('click', () => {
        chatWidget.classList.toggle('open');
        if (chatWidget.classList.contains('open')) {
            chatInput.focus();
            // Scroll to bottom if opened
            scrollToBottom();

            if (!hasGreeted) {
                hasGreeted = true;

                // Add a temporary loading message to handle 45-second Render cold starts
                const loadingMsgId = 'loading-msg-' + Date.now();
                const loadingDiv = document.createElement('div');
                loadingDiv.classList.add('message', 'bot');
                loadingDiv.id = loadingMsgId;
                loadingDiv.innerHTML = '<p><em>System is waking up, please wait a moment for the first response...</em></p>';
                chatMessages.insertBefore(loadingDiv, typingIndicator);
                scrollToBottom();

                setTimeout(() => {
                    showTypingIndicator(); // Show typing immediately

                    // Fetch greeting from backend
                    fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message: "Hello", session_id: null }), // Initial handshake
                    })
                        .then(response => {
                            hideTypingIndicator();
                            const loadMsg = document.getElementById(loadingMsgId);
                            if (loadMsg) loadMsg.remove(); // Remove temporary message

                            if (!response.ok) {
                                throw new Error('Network response was not ok: ' + response.statusText);
                            }
                            return response.json();
                        })
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
                            hideTypingIndicator();
                            const loadMsg = document.getElementById(loadingMsgId);
                            if (loadMsg) loadMsg.remove(); // Remove temporary message

                            console.error('Greeting Error:', error);
                            appendMessage('bot', "I cannot connect to the server right now. Please refresh the page and try again.");
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
            // Production-friendly error message
            appendMessage('bot', "Connection unstable. Please check your internet or try again later.");
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
            renderer.link = function (href, title, text) {
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
