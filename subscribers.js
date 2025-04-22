// Subscriber Management System for JobsIndia Portal

// Initialize subscribers in localStorage
const initializeSubscribers = function() {
    const storedSubscribers = localStorage.getItem('subscribers');
    if (!storedSubscribers) {
        localStorage.setItem('subscribers', JSON.stringify([]));
        return [];
    }
    return JSON.parse(storedSubscribers);
};

// Get all subscribers
const getAllSubscribers = function() {
    return JSON.parse(localStorage.getItem('subscribers')) || [];
};

// Add new subscriber
const addSubscriber = function(email) {
    // Check if email already exists
    const subscribers = getAllSubscribers();
    if (subscribers.some(sub => sub.email === email)) {
        return { success: false, message: 'This email is already subscribed.' };
    }
    
    // Create new subscriber object
    const newSubscriber = {
        id: subscribers.length > 0 ? Math.max(...subscribers.map(sub => sub.id)) + 1 : 1,
        email: email,
        subscribeDate: new Date().toISOString(),
        lastEmailSent: null
    };
    
    // Add to subscribers and save
    subscribers.push(newSubscriber);
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    
    return { success: true, message: 'Successfully subscribed to job alerts!' };
};

// Remove subscriber
const removeSubscriber = function(email) {
    const subscribers = getAllSubscribers();
    const updatedSubscribers = subscribers.filter(sub => sub.email !== email);
    
    if (updatedSubscribers.length === subscribers.length) {
        return false; // Email not found
    }
    
    localStorage.setItem('subscribers', JSON.stringify(updatedSubscribers));
    return true;
};

// Update subscriber last email sent date
const updateLastEmailSent = function(email) {
    const subscribers = getAllSubscribers();
    const subscriber = subscribers.find(sub => sub.email === email);
    
    if (!subscriber) {
        return false;
    }
    
    subscriber.lastEmailSent = new Date().toISOString();
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    return true;
};

// Send job alerts to subscribers
const sendJobAlerts = function(jobId) {
    // In a real implementation, this would connect to an email service like SendGrid
    const subscribers = getAllSubscribers();
    const job = JSON.parse(localStorage.getItem('jobs')).find(j => j.id === jobId);
    
    if (!job) {
        return { success: false, message: 'Job not found' };
    }
    
    // For demo purposes, just update the lastEmailSent timestamp for all subscribers
    subscribers.forEach(sub => {
        sub.lastEmailSent = new Date().toISOString();
    });
    
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    
    return { 
        success: true, 
        message: `Job alert for "${job.title}" would be sent to ${subscribers.length} subscribers` 
    };
};

// Send job alerts to all subscribers for a new job
const sendNewJobAlertToAll = function(jobId) {
    return sendJobAlerts(jobId);
};

// Export SubscriberManager object
window.SubscriberManager = {
    initializeSubscribers,
    getAllSubscribers,
    addSubscriber,
    removeSubscriber,
    updateLastEmailSent,
    sendJobAlerts,
    sendNewJobAlertToAll
};