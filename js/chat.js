export function initChat() {
    const chatWidget = document.getElementById('chat-widget');
    const chatContainer = document.getElementById('chat-container');
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const typingIndicator = document.getElementById('typing-indicator');

    if (!chatWidget || !chatContainer || !chatInput || !chatSendBtn ||
            !chatToggleBtn || !chatCloseBtn || !chatMessages || !typingIndicator) return;

    let currentSessionId = null;
    let requestInFlight = false;
    let draftEditedDuringRequest = false;

    const API_URL = 'https://career-ai-backend-sfcs.onrender.com/chat';
    // Allow time for a cold start, but never leave the interface waiting indefinitely.
    const REQUEST_TIMEOUT_MS = 90_000;
    const MAX_MESSAGE_LENGTH = 4000;
    const errorMessages = {
        en: {
            failed: "I couldn't get a reply from the portfolio assistant. Please try again.",
            timeout: "The reply took too long. Please try again."
        },
        tr: {
            failed: 'Portföy asistanından yanıt alınamadı. Lütfen tekrar deneyin.',
            timeout: 'Yanıt beklenenden uzun sürdü. Lütfen tekrar deneyin.'
        }
    };

    function setChatOpen(isOpen) {
        if (!isOpen && chatContainer.contains(document.activeElement)) {
            chatToggleBtn.focus();
        }
        chatWidget.classList.toggle('open', isOpen);
        chatContainer.inert = !isOpen;
        chatContainer.setAttribute('aria-hidden', String(!isOpen));
        chatToggleBtn.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) {
            chatInput.focus();
            scrollToBottom();
        }
    }

    chatToggleBtn.addEventListener('click', () => {
        setChatOpen(!chatWidget.classList.contains('open'));
    });

    chatCloseBtn.addEventListener('click', () => {
        setChatOpen(false);
    });
    chatContainer.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setChatOpen(false);
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
            e.preventDefault();
            sendMessage();
        }
    });

    chatSendBtn.addEventListener('click', sendMessage);

    function updateSendButton() {
        chatSendBtn.disabled = requestInFlight || chatInput.value.trim() === '' ||
            chatInput.value.length > MAX_MESSAGE_LENGTH;
    }

    chatInput.addEventListener('input', () => {
        if (requestInFlight) draftEditedDuringRequest = true;
        updateSendButton();
    });

    async function sendMessage() {
        const messageText = chatInput.value.trim();
        if (requestInFlight || !messageText || chatInput.value.length > MAX_MESSAGE_LENGTH ||
                !chatWidget.classList.contains('open')) return;

        requestInFlight = true;
        draftEditedDuringRequest = false;
        chatInput.value = '';
        updateSendButton();

        appendMessage('user', messageText);
        typingIndicator.classList.add('active');
        chatMessages.setAttribute('aria-busy', 'true');
        scrollToBottom();

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                signal: controller.signal,
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

            if (!data || typeof data.response !== 'string' || !data.response.trim() ||
                    Array.from(data.response).length > 8000 ||
                    typeof data.session_id !== 'string' || !data.session_id.trim() ||
                    data.session_id.length > 128) {
                throw new Error('Invalid chat response');
            }
            // Commit the session only after the complete response is usable.
            appendMessage('bot', data.response);
            currentSessionId = data.session_id;

        } catch {
            console.error('Chat request failed.');
            // An intentionally cleared new draft also takes priority over recovery.
            if (!draftEditedDuringRequest && chatInput.value === '') {
                chatInput.value = messageText;
            }
            const messages = errorMessages[document.documentElement.lang] || errorMessages.en;
            appendMessage('bot', controller.signal.aborted ? messages.timeout : messages.failed).classList.add('error');
        } finally {
            clearTimeout(timeout);
            requestInFlight = false;
            typingIndicator.classList.remove('active');
            chatMessages.setAttribute('aria-busy', 'false');
            updateSendButton();
            if (chatWidget.classList.contains('open') && chatContainer.contains(document.activeElement)) {
                chatInput.focus();
            }
            scrollToBottom();
        }
    }

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        // Plain text is the default, including when either rendering library fails.
        messageDiv.textContent = text;
        messageDiv.classList.add('plain-text');
        if (sender === 'bot' && typeof marked !== 'undefined' &&
                typeof DOMPurify !== 'undefined' && DOMPurify.isSupported) {
            try {
                const fragment = DOMPurify.sanitize(marked.parse(text, {
                    breaks: true, gfm: true, async: false
                }), {
                    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 's', 'del',
                        'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'hr',
                        'h3', 'h4', 'h5', 'h6', 'a',
                        'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                    ALLOWED_ATTR: ['href', 'title'],
                    ALLOW_DATA_ATTR: false,
                    ALLOW_ARIA_ATTR: false,
                    ALLOWED_URI_REGEXP: /^(?:https?:\/\/|mailto:)/i,
                    RETURN_DOM_FRAGMENT: true
                });
                fragment.querySelectorAll('a[href]').forEach(link => {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                });
                fragment.querySelectorAll('pre, table').forEach(block => {
                    block.setAttribute('tabindex', '0');
                });
                messageDiv.replaceChildren(fragment);
                messageDiv.classList.remove('plain-text');
            } catch {
                console.warn('Chat formatting unavailable; displaying plain text.');
            }
        }

        chatMessages.appendChild(messageDiv);
        scrollToBottom();
        return messageDiv;
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    chatWidget.hidden = false;
}
