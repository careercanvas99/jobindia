// Messages Management System for JobsIndia Portal

// Sample message if localStorage is empty
const SAMPLE_MESSAGES = [
    {
        id: 1,
        name: 'Sample User',
        email: 'sample@example.com',
        subject: 'Question about a job posting',
        message: 'Hello, I have a question about the Software Engineer position at TechSolutions. Is this role still open for applications?',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        read: true,
        replies: [
            {
                id: 1,
                userId: 1, // Admin user
                message: 'Yes, the position is still open. Please apply through the application link on the job details page.',
                date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
            }
        ]
    }
];

// Initialize messages in localStorage
const initializeMessages = function() {
    const storedMessages = localStorage.getItem('messages');
    if (!storedMessages) {
        localStorage.setItem('messages', JSON.stringify(SAMPLE_MESSAGES));
        return SAMPLE_MESSAGES;
    }
    return JSON.parse(storedMessages);
}

// Messages Management Functions
const MessageManager = {
    // Initialize messages
    initializeMessages: function() {
        const storedMessages = localStorage.getItem('messages');
        if (!storedMessages) {
            localStorage.setItem('messages', JSON.stringify(SAMPLE_MESSAGES));
            return SAMPLE_MESSAGES;
        }
        return JSON.parse(storedMessages);
    },
    
    // Get all messages
    getAllMessages: function() {
        return JSON.parse(localStorage.getItem('messages')) || [];
    },
    
    // Get message by ID
    getMessageById: function(id) {
        const messages = this.getAllMessages();
        return messages.find(message => message.id === id);
    },
    
    // Add new message
    addMessage: function(messageData) {
        const messages = this.getAllMessages();
        
        // Generate new ID
        const newId = messages.length > 0 ? Math.max(...messages.map(message => message.id)) + 1 : 1;
        
        // Create new message object
        const newMessage = {
            id: newId,
            name: messageData.name,
            email: messageData.email,
            subject: messageData.subject,
            message: messageData.message,
            date: new Date().toISOString(),
            read: false,
            replies: []
        };
        
        // Add to messages array and save to localStorage
        messages.push(newMessage);
        localStorage.setItem('messages', JSON.stringify(messages));
        
        return newMessage;
    },
    
    // Mark message as read
    markAsRead: function(id) {
        const messages = this.getAllMessages();
        const message = messages.find(message => message.id === id);
        
        if (!message) {
            return false;
        }
        
        message.read = true;
        localStorage.setItem('messages', JSON.stringify(messages));
        return true;
    },
    
    // Add reply to message
    addReply: function(messageId, userId, replyMessage) {
        const messages = this.getAllMessages();
        const message = messages.find(message => message.id === messageId);
        
        if (!message) {
            return false;
        }
        
        // Generate new reply ID
        const newReplyId = message.replies.length > 0 ? 
            Math.max(...message.replies.map(reply => reply.id)) + 1 : 1;
        
        // Create new reply object
        const newReply = {
            id: newReplyId,
            userId: userId,
            message: replyMessage,
            date: new Date().toISOString()
        };
        
        // Add to replies array
        message.replies.push(newReply);
        localStorage.setItem('messages', JSON.stringify(messages));
        
        return newReply;
    },
    
    // Delete message
    deleteMessage: function(id) {
        const messages = this.getAllMessages();
        const filteredMessages = messages.filter(message => message.id !== id);
        
        if (filteredMessages.length === messages.length) {
            // Message not found
            return false;
        }
        
        localStorage.setItem('messages', JSON.stringify(filteredMessages));
        return true;
    },
    
    // Get unread messages count
    getUnreadCount: function() {
        const messages = this.getAllMessages();
        return messages.filter(message => !message.read).length;
    }
};

// Export the message manager
window.MessageManager = MessageManager;