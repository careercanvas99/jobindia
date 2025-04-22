// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');
const categoryButtons = document.querySelectorAll('[data-category]');
const categoryFilter = document.getElementById('category-filter');
const dateFilter = document.getElementById('date-filter');
const jobSearch = document.getElementById('job-search');
const searchBtn = document.getElementById('search-btn');
const resetFiltersBtn = document.getElementById('reset-filters');
const jobForm = document.getElementById('job-form');
const contactForm = document.getElementById('contact-form');
const newsletterForm = document.getElementById('newsletter-form');
const notificationToast = document.getElementById('notification-toast');
const notificationMessage = document.getElementById('notification-message');
const notificationClose = document.getElementById('notification-close');
const recentJobsList = document.getElementById('recent-jobs-list');
const jobsList = document.getElementById('jobs-list');
const jobDetailsContent = document.getElementById('job-details-content');
const noJobsMessage = document.getElementById('no-jobs-message');

// User Management DOM Elements
const adminTabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const usersList = document.getElementById('users-list');
const addUserBtn = document.getElementById('add-user-btn');
const userFormContainer = document.getElementById('user-form-container');
const userForm = document.getElementById('user-form');
const cancelUserBtn = document.getElementById('cancel-user-btn');

// Admin credentials 
const ADMIN_USERNAME = 'Basam.Abhishek';
const ADMIN_PASSWORD = 'Basam@2212';
let isAdminLoggedIn = false;

// Ensure admin exists in localStorage
function ensureAdminExists() {
    // Create default admin user
    const adminUser = {
        id: 1,
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
        fullName: 'Abhishek Basam',
        email: 'admin@jobsindia.com',
        role: 'admin',
        createdBy: null,
        createdAt: new Date().toISOString()
    };
    
    // Get existing users or empty array
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if admin exists
    const adminExists = users.some(user => user.username === ADMIN_USERNAME);
    
    // If admin doesn't exist, add it
    if (!adminExists) {
        console.log('Admin user not found, adding default admin...');
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Sample job data if localStorage is empty
const sampleJobs = [
    {
        id: 1,
        title: 'Software Engineer',
        company: 'TechSolutions India Pvt Ltd',
        location: 'Bangalore, Karnataka',
        category: 'it',
        type: 'Full-time',
        salary: '₹12,00,000 - ₹18,00,000 per year',
        description: 'We are looking for an experienced Software Engineer to join our development team. The ideal candidate will have strong experience in full-stack web development and a passion for creating efficient, scalable applications.',
        requirements: [
            'Bachelor\'s degree in Computer Science or related field',
            '3+ years of experience in software development',
            'Proficiency in JavaScript, React, and Node.js',
            'Experience with database design and optimization',
            'Strong problem-solving skills and attention to detail'
        ],
        applicationLink: 'https://techsolutions.com/careers',
        deadline: '2023-12-15',
        datePosted: '2023-10-01'
    },
    {
        id: 2,
        title: 'Bank PO (Probationary Officer)',
        company: 'State Bank of India',
        location: 'Multiple Locations',
        category: 'banking',
        type: 'Full-time',
        salary: '₹8,00,000 - ₹12,00,000 per year',
        description: 'State Bank of India is hiring Probationary Officers for various branches across India. This is an excellent opportunity for graduates looking to build a career in the banking sector.',
        requirements: [
            'Bachelor\'s degree in any discipline from a recognized university',
            'Age between 21-30 years',
            'Strong analytical and numerical skills',
            'Good communication abilities in English and regional languages',
            'Knowledge of banking operations and financial markets'
        ],
        applicationLink: 'https://sbi.co.in/careers',
        deadline: '2023-11-30',
        datePosted: '2023-10-05'
    },
    {
        id: 3,
        title: 'Civil Services Examination',
        company: 'Union Public Service Commission (UPSC)',
        location: 'Pan India',
        category: 'government',
        type: 'Full-time',
        salary: 'As per government pay scale',
        description: 'UPSC is inviting applications for the Civil Services Examination to recruit officers for the Indian Administrative Service (IAS), Indian Foreign Service (IFS), Indian Police Service (IPS), and other Central Services.',
        requirements: [
            'Bachelor\'s degree from a recognized university',
            'Age between 21-32 years (with relaxation for reserved categories)',
            'Indian citizenship',
            'Knowledge of Indian polity, economy, history, and current affairs',
            'Good analytical and leadership skills'
        ],
        applicationLink: 'https://upsc.gov.in',
        deadline: '2023-12-21',
        datePosted: '2023-09-25'
    },
    {
        id: 4,
        title: 'Medical Officer',
        company: 'Apollo Hospitals',
        location: 'Delhi, NCR',
        category: 'healthcare',
        type: 'Full-time',
        salary: '₹10,00,000 - ₹15,00,000 per year',
        description: 'Apollo Hospitals is seeking qualified Medical Officers to join our growing healthcare team. The successful candidate will be responsible for providing medical care to patients, coordinating with specialists, and ensuring quality healthcare delivery.',
        requirements: [
            'MBBS degree from a recognized medical college',
            'Valid registration with the Medical Council of India',
            'Minimum 2 years of clinical experience',
            'Excellent bedside manner and patient care skills',
            'Ability to work in a fast-paced environment'
        ],
        applicationLink: 'https://apollohospitals.com/careers',
        deadline: '2023-11-15',
        datePosted: '2023-10-10'
    },
    {
        id: 5,
        title: 'Data Scientist',
        company: 'Amazon India',
        location: 'Hyderabad, Telangana',
        category: 'it',
        type: 'Full-time',
        salary: '₹18,00,000 - ₹25,00,000 per year',
        description: 'Amazon India is looking for a Data Scientist to join our analytics team. You will work on solving complex business problems using data analytics, statistical modeling, and machine learning techniques.',
        requirements: [
            'Master\'s or Ph.D. in Computer Science, Statistics, or related field',
            '3+ years of experience in data science or machine learning',
            'Proficiency in Python, R, SQL, and big data tools',
            'Experience with deep learning frameworks like TensorFlow or PyTorch',
            'Strong mathematical foundation in statistics and algorithms'
        ],
        applicationLink: 'https://amazon.jobs/india',
        deadline: '2023-12-05',
        datePosted: '2023-10-08'
    }
];

// Initialize Job Data
function initializeJobs() {
    const storedJobs = localStorage.getItem('jobs');
    if (!storedJobs) {
        localStorage.setItem('jobs', JSON.stringify(sampleJobs));
    }
}

// Job Management Functions
function removeExpiredJobs() {
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    
    // Filter out jobs older than 30 days
    const validJobs = jobs.filter(job => {
        const postedDate = new Date(job.datePosted);
        return postedDate > thirtyDaysAgo;
    });
    
    // If any jobs were removed, update localStorage
    if (validJobs.length < jobs.length) {
        localStorage.setItem('jobs', JSON.stringify(validJobs));
        console.log(`Removed ${jobs.length - validJobs.length} expired job(s)`);
    }
    
    return validJobs;
}

// Delete a job by ID
function deleteJob(jobId) {
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const jobIndex = jobs.findIndex(job => job.id == jobId);
    
    if (jobIndex === -1) {
        return false;
    }
    
    // Remove the job from the array
    jobs.splice(jobIndex, 1);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    return true;
}

// Check if user has permission to manage jobs
function canManageJobs(userId) {
    if (!userId) return false;
    
    const user = UserManager.getUserById(userId);
    return user && (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.MANAGER);
}

// Load Jobs
function loadJobs(filter = {}, limit = null) {
    // First remove expired jobs
    removeExpiredJobs();
    
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    let filteredJobs = [...jobs];
    
    // Apply category filter
    if (filter.category && filter.category !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.category === filter.category);
    }
    
    // Apply search filter
    if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.location.toLowerCase().includes(searchTerm) ||
            job.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply date sorting
    if (filter.dateSort === 'newest') {
        filteredJobs.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    } else if (filter.dateSort === 'oldest') {
        filteredJobs.sort((a, b) => new Date(a.datePosted) - new Date(b.datePosted));
    }
    
    // Apply limit
    if (limit && filteredJobs.length > limit) {
        filteredJobs = filteredJobs.slice(0, limit);
    }
    
    return filteredJobs;
}

// Render Job Cards
function renderJobCards(jobs, container) {
    container.innerHTML = '';
    
    if (jobs.length === 0) {
        noJobsMessage.style.display = 'block';
        return;
    }
    
    noJobsMessage.style.display = 'none';
    
    // Check if current user can manage jobs
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const canManage = currentUser ? canManageJobs(currentUser.id) : false;
    
    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.classList.add('job-card');
        jobCard.setAttribute('data-job-id', job.id);
        
        // Format date
        const postedDate = new Date(job.datePosted);
        const formattedDate = postedDate.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Check if job is about to expire (25+ days old)
        const currentDate = new Date();
        const daysOld = Math.floor((currentDate - postedDate) / (1000 * 60 * 60 * 24));
        const expiryWarning = daysOld >= 25 ? 
            `<div class="job-expiry-warning">Expires in ${30 - daysOld} days</div>` : '';
        
        // Create job card HTML
        jobCard.innerHTML = `
            <div class="job-header">
                ${canManage ? `<button class="job-delete-btn" data-job-id="${job.id}" title="Delete Job"><i class="fas fa-trash-alt"></i></button>` : ''}
                <p class="job-company">${job.company}</p>
                <h3 class="job-title">${job.title}</h3>
                <p class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                ${expiryWarning}
            </div>
            <div class="job-body">
                <div class="job-info">
                    <span class="job-type"><i class="fas fa-briefcase"></i> ${job.type}</span>
                    <span class="job-category"><i class="fas fa-tag"></i> ${getCategoryLabel(job.category)}</span>
                    ${job.salary ? `<span class="job-salary"><i class="fas fa-rupee-sign"></i> ${job.salary}</span>` : ''}
                </div>
                <p class="job-description">${job.description}</p>
                <div class="job-footer">
                    <span class="job-date"><i class="far fa-calendar-alt"></i> Posted on ${formattedDate}</span>
                    <a href="#job-details" class="btn view-job-btn" data-job-id="${job.id}" data-section="job-details">View Details</a>
                </div>
            </div>
        `;
        
        container.appendChild(jobCard);
    });
    
    // Add event listeners to view job buttons
    const viewJobButtons = container.querySelectorAll('.view-job-btn');
    viewJobButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const jobId = e.target.getAttribute('data-job-id');
            showJobDetails(jobId);
            navigateToSection('job-details');
        });
    });
    
    // Add event listeners to delete job buttons (if any)
    const deleteButtons = container.querySelectorAll('.job-delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent navigating to job details
            const jobId = button.getAttribute('data-job-id');
            
            if (confirm('Are you sure you want to delete this job posting?')) {
                if (deleteJob(jobId)) {
                    // Remove from DOM
                    const jobCard = button.closest('.job-card');
                    if (jobCard) {
                        jobCard.remove();
                    }
                    
                    showNotification('Job has been deleted successfully');
                    
                    // If no jobs left, show the no jobs message
                    if (container.children.length === 0) {
                        noJobsMessage.style.display = 'block';
                    }
                }
            }
        });
    });
}

// Show Job Details
function showJobDetails(jobId) {
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const job = jobs.find(job => job.id == jobId);
    
    if (!job) {
        jobDetailsContent.innerHTML = `
            <div class="no-content-message">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Job Not Found</h3>
                <p>The job you're looking for doesn't exist or has been removed.</p>
                <a href="#jobs" class="btn secondary-btn" data-section="jobs">Browse All Jobs</a>
            </div>
        `;
        return;
    }
    
    // Format dates
    const postedDate = new Date(job.datePosted);
    const formattedPostedDate = postedDate.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    let deadlineHTML = '';
    if (job.deadline) {
        const deadlineDate = new Date(job.deadline);
        const formattedDeadline = deadlineDate.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        deadlineHTML = `<p class="job-deadline">Application Deadline: <strong>${formattedDeadline}</strong></p>`;
    }
    
    // Create requirements list
    const requirementsList = job.requirements.map(req => `<li>${req}</li>`).join('');
    
    jobDetailsContent.innerHTML = `
        <div class="job-details-header">
            <h2 class="job-details-title">${job.title}</h2>
            <div class="job-details-meta">
                <span class="job-details-meta-item"><i class="fas fa-building"></i> ${job.company}</span>
                <span class="job-details-meta-item"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                <span class="job-details-meta-item"><i class="far fa-calendar-alt"></i> Posted on ${formattedPostedDate}</span>
            </div>
            <div class="job-highlights">
                <span class="job-type"><i class="fas fa-briefcase"></i> ${job.type}</span>
                <span class="job-category"><i class="fas fa-tag"></i> ${getCategoryLabel(job.category)}</span>
                ${job.salary ? `<span class="job-salary"><i class="fas fa-rupee-sign"></i> ${job.salary}</span>` : ''}
            </div>
        </div>
        
        <div class="job-details-body">
            <div class="job-details-section">
                <h3><i class="fas fa-info-circle"></i> Job Description</h3>
                <p>${job.description}</p>
            </div>
            
            <div class="job-details-section">
                <h3><i class="fas fa-list-ul"></i> Requirements</h3>
                <ul class="job-requirements-list">
                    ${requirementsList}
                </ul>
            </div>
        </div>
        
        <div class="job-apply-section">
            <h3>Apply for this Job</h3>
            ${deadlineHTML}
            <a href="${job.applicationLink}" target="_blank" class="btn primary-btn apply-btn">Apply Now</a>
        </div>
        
        <!-- Job Details Page Ad -->
        <div class="ad-container rectangle">
            <p>Advertisement</p>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                 data-ad-slot="JOB_DETAILS_AD_SLOT"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        </div>
    `;
}

// Get Category Label
function getCategoryLabel(category) {
    const categories = {
        'government': 'Government',
        'it': 'IT & Software',
        'banking': 'Banking',
        'healthcare': 'Healthcare',
        'other': 'Other'
    };
    
    return categories[category] || 'Other';
}

// Navigation Functions
function navigateToSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
    
    document.getElementById(sectionId).classList.add('active');
    
    // Close mobile menu if open
    if (navbar.classList.contains('active')) {
        navbar.classList.remove('active');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Show notification toast
function showNotification(message, isError = false) {
    notificationMessage.textContent = message;
    notificationToast.classList.remove('error');
    
    if (isError) {
        notificationToast.classList.add('error');
    }
    
    notificationToast.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notificationToast.classList.remove('show');
    }, 5000);
}

// User Management Functions
function renderUsersList() {
    if (!usersList) return;
    
    usersList.innerHTML = '';
    const users = UserManager.getAllUsers();
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        
        // Format date
        const createdDate = new Date(user.createdAt);
        const formattedDate = createdDate.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td><span class="user-role-badge role-${user.role}">${user.role}</span></td>
            <td>${formattedDate}</td>
            <td class="user-actions-cell">
                <button class="user-action-btn edit" data-user-id="${user.id}" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="user-action-btn delete" data-user-id="${user.id}" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        usersList.appendChild(tr);
    });
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.user-action-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const userId = parseInt(btn.getAttribute('data-user-id'));
            editUser(userId);
        });
    });
    
    document.querySelectorAll('.user-action-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const userId = parseInt(btn.getAttribute('data-user-id'));
            deleteUser(userId);
        });
    });
}

function showUserForm(isEdit = false, userData = null) {
    userFormContainer.style.display = 'block';
    document.querySelector('.user-management-container').style.display = 'none';
    
    // Set form title
    document.getElementById('user-form-title').textContent = isEdit ? 'Edit User' : 'Add New User';
    
    // Clear form
    userForm.reset();
    
    // If editing, populate form
    if (isEdit && userData) {
        document.getElementById('user-id').value = userData.id;
        document.getElementById('user-username').value = userData.username;
        document.getElementById('user-fullname').value = userData.fullName;
        document.getElementById('user-email').value = userData.email;
        document.getElementById('user-role').value = userData.role;
        
        // Password field is not required when editing
        document.getElementById('user-password').required = false;
    } else {
        document.getElementById('user-id').value = '';
        document.getElementById('user-password').required = true;
    }
}

function hideUserForm() {
    userFormContainer.style.display = 'none';
    document.querySelector('.user-management-container').style.display = 'block';
}

function addUser(userData) {
    try {
        // Get current logged in user ID
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            showNotification('You need to be logged in to add users', true);
            return false;
        }
        
        // Add user
        UserManager.addUser(userData, currentUser.id);
        showNotification('User added successfully');
        hideUserForm();
        renderUsersList();
        return true;
    } catch (error) {
        showNotification(error.message, true);
        return false;
    }
}

function updateUser(userId, userData) {
    try {
        // Get current logged in user ID
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            showNotification('You need to be logged in to update users', true);
            return false;
        }
        
        // Update user
        UserManager.updateUser(userId, userData, currentUser.id);
        showNotification('User updated successfully');
        hideUserForm();
        renderUsersList();
        return true;
    } catch (error) {
        showNotification(error.message, true);
        return false;
    }
}

function editUser(userId) {
    const user = UserManager.getUserById(userId);
    if (user) {
        showUserForm(true, user);
    } else {
        showNotification('User not found', true);
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            // Get current logged in user ID
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                showNotification('You need to be logged in to delete users', true);
                return false;
            }
            
            // Delete user
            UserManager.deleteUser(userId, currentUser.id);
            showNotification('User deleted successfully');
            renderUsersList();
            return true;
        } catch (error) {
            showNotification(error.message, true);
            return false;
        }
    }
}

// Tab switching
function switchTab(tabName) {
    adminTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        }
    });
    
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabName + '-tab') {
            content.classList.add('active');
        }
    });
    
    // If switching to user management tab, render users list
    if (tabName === 'user-management') {
        renderUsersList();
    }
}

// Admin Login Functions
function loginAdmin(username, password) {
    console.log('Login attempt:', username);
    
    // Handle direct admin credentials case
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        console.log('Using direct admin credentials');
        isAdminLoggedIn = true;
        
        // Ensure admin exists in localStorage
        ensureAdminExists();
        
        // Get admin user from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const adminUser = users.find(u => u.username === ADMIN_USERNAME);
        
        if (adminUser) {
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
            document.getElementById('admin-login-container').style.display = 'none';
            document.getElementById('admin-job-form-container').style.display = 'block';
            showNotification('Admin login successful. You can now post jobs.');
            return true;
        }
    }
    
    // Check with UserManager if direct admin login didn't work
    if (typeof UserManager !== 'undefined') {
        const user = UserManager.authenticateUser(username, password);
        console.log('User authentication result:', user);
        
        if (user) {
            isAdminLoggedIn = true;
            // Store current user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            document.getElementById('admin-login-container').style.display = 'none';
            document.getElementById('admin-job-form-container').style.display = 'block';
            showNotification(`Welcome ${user.fullName}! You are now logged in.`);
            return true;
        }
    } else {
        console.log('UserManager not available');
    }
    
    showNotification('Invalid credentials. Please try again.', true);
    return false;
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    // Clear current user
    localStorage.removeItem('currentUser');
    document.getElementById('admin-login-container').style.display = 'block';
    document.getElementById('admin-job-form-container').style.display = 'none';
    showNotification('Logged out successfully.');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Make sure admin user exists
    ensureAdminExists();
    // Load user management script
    if (typeof UserManager === 'undefined') {
        const userScript = document.createElement('script');
        userScript.src = 'users.js';
        document.head.appendChild(userScript);
        console.log('Loading users.js');
        userScript.onload = function() {
            console.log('UserManager loaded:', typeof UserManager);
            // Initialize users after script loads
            if (typeof UserManager !== 'undefined') {
                UserManager.initializeUsers();
                console.log('Users initialized');
            }
        };
    } else {
        // Initialize users if script already loaded
        UserManager.initializeUsers();
        console.log('Users already initialized');
    }
    
    // Load message management script
    if (typeof MessageManager === 'undefined') {
        const messageScript = document.createElement('script');
        messageScript.src = 'messages.js';
        document.head.appendChild(messageScript);
        console.log('Loading messages.js');
        messageScript.onload = function() {
            console.log('MessageManager loaded:', typeof MessageManager);
            // Initialize messages after script loads
            if (typeof MessageManager !== 'undefined') {
                MessageManager.initializeMessages();
                console.log('Messages initialized');
            }
        };
    } else {
        // Initialize messages if script already loaded
        MessageManager.initializeMessages();
        console.log('Messages already initialized');
    }
    
    // Load subscriber management script
    if (typeof SubscriberManager === 'undefined') {
        const subscriberScript = document.createElement('script');
        subscriberScript.src = 'subscribers.js';
        document.head.appendChild(subscriberScript);
        console.log('Loading subscribers.js');
        subscriberScript.onload = function() {
            console.log('SubscriberManager loaded:', typeof SubscriberManager);
            // Initialize subscribers after script loads
            if (typeof SubscriberManager !== 'undefined') {
                SubscriberManager.initializeSubscribers();
                console.log('Subscribers initialized');
            }
        };
    } else {
        // Initialize subscribers if script already loaded
        SubscriberManager.initializeSubscribers();
        console.log('Subscribers already initialized');
    }
    
    // Initialize jobs data
    initializeJobs();
    
    // Load recent jobs on homepage
    const recentJobs = loadJobs({ dateSort: 'newest' }, 6);
    renderJobCards(recentJobs, recentJobsList);
    
    // Admin tabs event listeners
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Add user button event listener
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            showUserForm(false);
        });
    }
    
    // Cancel user form event listener
    if (cancelUserBtn) {
        cancelUserBtn.addEventListener('click', () => {
            hideUserForm();
        });
    }
    
    // User form submission
    if (userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const userId = document.getElementById('user-id').value;
            const username = document.getElementById('user-username').value;
            const password = document.getElementById('user-password').value;
            const fullName = document.getElementById('user-fullname').value;
            const email = document.getElementById('user-email').value;
            const role = document.getElementById('user-role').value;
            
            const userData = {
                username,
                fullName,
                email,
                role
            };
            
            // Add password only if provided (for editing)
            if (password) {
                userData.password = password;
            }
            
            if (userId) {
                // Update existing user
                updateUser(parseInt(userId), userData);
            } else {
                // Add new user
                addUser(userData);
            }
        });
    }
    
    // Load all jobs on jobs page
    const allJobs = loadJobs({ dateSort: 'newest' });
    renderJobCards(allJobs, jobsList);
    
    // Admin login form
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password-login').value;
            loginAdmin(username, password);
        });
    }
    
    // Admin logout button
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            logoutAdmin();
        });
    }
    
    // Navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });
    
    // Category buttons event listeners
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const category = button.getAttribute('data-category');
            const sectionId = button.getAttribute('data-section');
            
            if (sectionId === 'jobs') {
                categoryFilter.value = category;
                const filteredJobs = loadJobs({ 
                    category: category, 
                    dateSort: dateFilter.value 
                });
                renderJobCards(filteredJobs, jobsList);
            }
            
            navigateToSection(sectionId);
        });
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
    
    // Job filters
    searchBtn.addEventListener('click', () => {
        const searchTerm = jobSearch.value.trim();
        const filteredJobs = loadJobs({
            search: searchTerm,
            category: categoryFilter.value,
            dateSort: dateFilter.value
        });
        renderJobCards(filteredJobs, jobsList);
    });
    
    jobSearch.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    
    categoryFilter.addEventListener('change', () => {
        const filteredJobs = loadJobs({
            search: jobSearch.value.trim(),
            category: categoryFilter.value,
            dateSort: dateFilter.value
        });
        renderJobCards(filteredJobs, jobsList);
    });
    
    dateFilter.addEventListener('change', () => {
        const filteredJobs = loadJobs({
            search: jobSearch.value.trim(),
            category: categoryFilter.value,
            dateSort: dateFilter.value
        });
        renderJobCards(filteredJobs, jobsList);
    });
    
    resetFiltersBtn.addEventListener('click', () => {
        jobSearch.value = '';
        categoryFilter.value = 'all';
        dateFilter.value = 'newest';
        
        const allJobs = loadJobs({ dateSort: 'newest' });
        renderJobCards(allJobs, jobsList);
    });
    
    // Job form submission
    jobForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Check if admin is logged in
        if (!isAdminLoggedIn) {
            showNotification('You must be logged in as admin to post jobs.', true);
            navigateToSection('admin');
            return;
        }
        
        // Get form values
        const title = document.getElementById('job-title').value;
        const company = document.getElementById('job-company').value;
        const location = document.getElementById('job-location').value;
        const category = document.getElementById('job-category').value;
        const type = document.getElementById('job-type').value;
        const salary = document.getElementById('job-salary').value;
        const description = document.getElementById('job-description').value;
        const requirementsText = document.getElementById('job-requirements').value;
        const applicationLink = document.getElementById('application-link').value;
        const deadline = document.getElementById('application-deadline').value;
        
        // Split requirements by new line
        const requirements = requirementsText.split('\n')
            .map(req => req.trim())
            .filter(req => req !== '');
        
        // Get existing jobs
        const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
        
        // Generate new ID
        const newId = jobs.length > 0 ? Math.max(...jobs.map(job => job.id)) + 1 : 1;
        
        // Create new job object
        const newJob = {
            id: newId,
            title,
            company,
            location,
            category,
            type,
            salary,
            description,
            requirements,
            applicationLink,
            deadline,
            datePosted: new Date().toISOString().split('T')[0]
        };
        
        // Add to jobs array and save to localStorage
        jobs.push(newJob);
        localStorage.setItem('jobs', JSON.stringify(jobs));
        
        // Reset form
        jobForm.reset();
        
        // Show success notification
        showNotification('Job posted successfully!');
        
        // Reload jobs on relevant pages
        const recentJobs = loadJobs({ dateSort: 'newest' }, 6);
        renderJobCards(recentJobs, recentJobsList);
        
        const allJobs = loadJobs({ dateSort: 'newest' });
        renderJobCards(allJobs, jobsList);
    });
    
    // Contact form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const mobile = document.getElementById('contact-mobile').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;
        
        // Create message object
        const messageData = {
            name,
            email,
            mobile,
            subject,
            message
        };
        
        // Add to message system
        MessageManager.addMessage(messageData);
        
        showNotification('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
    
    // Contact tabs
    const contactTabBtns = document.querySelectorAll('.contact-tab-btn');
    contactTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Hide all tabs
            document.querySelectorAll('.contact-tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Update active button
            contactTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // If messages tab, check if user is logged in
            if (tabId === 'messages-list') {
                checkMessagesAccess();
            }
        });
    });
    
    // Check messages access
    function checkMessagesAccess() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const messagesContainer = document.getElementById('messages-container');
        const messagesLoginContainer = document.getElementById('messages-login-container');
        
        if (currentUser) {
            messagesContainer.style.display = 'block';
            messagesLoginContainer.style.display = 'none';
            renderMessagesList();
        } else {
            messagesContainer.style.display = 'none';
            messagesLoginContainer.style.display = 'block';
        }
    }
    
    // Render messages list
    function renderMessagesList() {
        const messagesList = document.getElementById('messages-list');
        const messages = MessageManager.getAllMessages();
        
        messagesList.innerHTML = '';
        
        if (messages.length === 0) {
            messagesList.innerHTML = `
                <div class="no-content-message">
                    <i class="fas fa-envelope"></i>
                    <h3>No Messages</h3>
                    <p>There are no messages to display.</p>
                </div>
            `;
            return;
        }
        
        // Sort messages by date (newest first)
        messages.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        messages.forEach(message => {
            const messageItem = document.createElement('div');
            messageItem.classList.add('message-item');
            if (!message.read) {
                messageItem.classList.add('unread');
            }
            messageItem.setAttribute('data-message-id', message.id);
            
            // Format date
            const messageDate = new Date(message.date);
            const formattedDate = messageDate.toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            messageItem.innerHTML = `
                <div class="message-content">
                    <div class="message-sender">${message.name}</div>
                    <div class="message-subject">${message.subject}</div>
                    <div class="message-preview">${message.message.substring(0, 80)}${message.message.length > 80 ? '...' : ''}</div>
                </div>
                <div class="message-date">${formattedDate}</div>
            `;
            
            messagesList.appendChild(messageItem);
            
            // Add click event listener
            messageItem.addEventListener('click', () => {
                viewMessage(message.id);
            });
        });
    }
    
    // View message details
    function viewMessage(messageId) {
        const messageDetailsContainer = document.getElementById('message-details-container');
        const messagesListContainer = document.querySelector('.messages-list-container');
        const messageDetails = document.getElementById('message-details');
        const message = MessageManager.getMessageById(messageId);
        
        if (!message) {
            return;
        }
        
        // Mark message as read
        MessageManager.markAsRead(messageId);
        
        // Set message ID in reply form
        document.getElementById('message-id').value = messageId;
        
        // Format date
        const messageDate = new Date(message.date);
        const formattedDate = messageDate.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Generate replies HTML
        let repliesHTML = '';
        
        if (message.replies && message.replies.length > 0) {
            repliesHTML = `
                <div class="message-replies">
                    <h3>Replies</h3>
                    ${message.replies.map(reply => {
                        // Get replier details
                        const user = UserManager.getUserById(reply.userId);
                        const userName = user ? user.fullName : 'Unknown User';
                        
                        // Format reply date
                        const replyDate = new Date(reply.date);
                        const formattedReplyDate = replyDate.toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        
                        return `
                            <div class="reply-item">
                                <div class="reply-header">
                                    <div class="reply-user">${userName}</div>
                                    <div class="reply-date">${formattedReplyDate}</div>
                                </div>
                                <div class="reply-body">
                                    ${reply.message}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
        
        // Generate message details HTML
        messageDetails.innerHTML = `
            <div class="message-info">
                <h3>${message.subject}</h3>
                <p><strong>From:</strong> ${message.name} (${message.email})</p>
                <p><strong>Mobile:</strong> ${message.mobile || 'Not provided'}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
            </div>
            <div class="message-body">
                ${message.message}
            </div>
            ${repliesHTML}
        `;
        
        // Show message details and hide list
        messageDetailsContainer.style.display = 'block';
        messagesListContainer.style.display = 'none';
    }
    
    // Back to messages list button
    const backToMessagesBtn = document.getElementById('back-to-messages');
    if (backToMessagesBtn) {
        backToMessagesBtn.addEventListener('click', () => {
            document.getElementById('message-details-container').style.display = 'none';
            document.querySelector('.messages-list-container').style.display = 'block';
            renderMessagesList();
        });
    }
    
    // Delete message button
    const deleteMessageBtn = document.getElementById('delete-message');
    if (deleteMessageBtn) {
        deleteMessageBtn.addEventListener('click', () => {
            const messageId = parseInt(document.getElementById('message-id').value);
            
            if (confirm('Are you sure you want to delete this message?')) {
                if (MessageManager.deleteMessage(messageId)) {
                    showNotification('Message deleted successfully');
                    document.getElementById('message-details-container').style.display = 'none';
                    document.querySelector('.messages-list-container').style.display = 'block';
                    renderMessagesList();
                }
            }
        });
    }
    
    // Reply form
    const replyForm = document.getElementById('reply-form');
    if (replyForm) {
        replyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const messageId = parseInt(document.getElementById('message-id').value);
            const replyMessage = document.getElementById('reply-message').value.trim();
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            if (!currentUser) {
                showNotification('You must be logged in to reply', true);
                return;
            }
            
            if (MessageManager.addReply(messageId, currentUser.id, replyMessage)) {
                document.getElementById('reply-message').value = '';
                showNotification('Reply sent successfully');
                
                // Refresh message details
                viewMessage(messageId);
            }
        });
    }
    
    // Newsletter form submission
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('subscriber-email').value.trim();
        
        // Add subscriber using SubscriberManager
        if (typeof SubscriberManager !== 'undefined') {
            const result = SubscriberManager.addSubscriber(email);
            showNotification(result.message, !result.success);
            
            if (result.success) {
                newsletterForm.reset();
            }
        } else {
            showNotification('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        }
    });
    
    // Close notification
    notificationClose.addEventListener('click', () => {
        notificationToast.classList.remove('show');
    });
});
