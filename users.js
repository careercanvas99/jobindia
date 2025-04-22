// User Management System for JobsIndia Portal

// User roles and permissions
const ROLES = {
    ADMIN: 'admin',       // Full access to everything
    MANAGER: 'manager',   // Can post jobs and manage users except admins
    EXECUTIVE: 'executive' // Can only post jobs
};

// Default admin user
const DEFAULT_USERS = [
    {
        id: 1,
        username: 'Basam.Abhishek',
        password: 'Basam@2212',
        fullName: 'Abhishek Basam',
        email: 'admin@jobsindia.com',
        role: ROLES.ADMIN,
        createdBy: null,
        createdAt: new Date().toISOString()
    }
];

// Initialize users in localStorage
const initializeUsers = function() {
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
        localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
    }
    return JSON.parse(storedUsers);
}

// User Management Functions
const UserManager = {
    // Initialize users in localStorage
    initializeUsers: function() {
        const storedUsers = localStorage.getItem('users');
        if (!storedUsers) {
            localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
            return DEFAULT_USERS;
        }
        return JSON.parse(storedUsers);
    },
    
    // Get all users
    getAllUsers: function() {
        return JSON.parse(localStorage.getItem('users')) || [];
    },
    
    // Get user by username
    getUserByUsername: function(username) {
        const users = this.getAllUsers();
        return users.find(user => user.username === username);
    },
    
    // Get user by ID
    getUserById: function(id) {
        const users = this.getAllUsers();
        return users.find(user => user.id === id);
    },
    
    // Add new user
    addUser: function(userData, createdById) {
        const users = this.getAllUsers();
        const createdByUser = this.getUserById(createdById);
        
        // Validate if creator has permission
        if (!createdByUser || createdByUser.role !== ROLES.ADMIN && createdByUser.role !== ROLES.MANAGER) {
            throw new Error('You do not have permission to add users');
        }
        
        // Managers cannot create admin users
        if (createdByUser.role === ROLES.MANAGER && userData.role === ROLES.ADMIN) {
            throw new Error('Managers cannot create admin users');
        }
        
        // Check if username already exists
        if (this.getUserByUsername(userData.username)) {
            throw new Error('Username already exists');
        }
        
        // Generate new ID
        const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
        
        // Create new user object
        const newUser = {
            id: newId,
            username: userData.username,
            password: userData.password,
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role,
            createdBy: createdById,
            createdAt: new Date().toISOString()
        };
        
        // Add to users array and save to localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Return the new user without the password
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    },
    
    // Update user
    updateUser: function(id, userData, updatedById) {
        const users = this.getAllUsers();
        const updatedByUser = this.getUserById(updatedById);
        const userToUpdate = this.getUserById(id);
        
        // Validate if user exists
        if (!userToUpdate) {
            throw new Error('User not found');
        }
        
        // Validate if updater has permission
        if (!updatedByUser) {
            throw new Error('Invalid updater ID');
        }
        
        // Only admins can update admins
        if (userToUpdate.role === ROLES.ADMIN && updatedByUser.role !== ROLES.ADMIN) {
            throw new Error('Only admins can update admin users');
        }
        
        // Managers can only update executives and other managers
        if (updatedByUser.role === ROLES.MANAGER && 
            (userToUpdate.role === ROLES.ADMIN || userData.role === ROLES.ADMIN)) {
            throw new Error('Managers cannot update admin users or change roles to admin');
        }
        
        // Update user properties
        const updatedUser = {
            ...userToUpdate,
            username: userData.username || userToUpdate.username,
            fullName: userData.fullName || userToUpdate.fullName,
            email: userData.email || userToUpdate.email,
            role: userData.role || userToUpdate.role
        };
        
        // Update password if provided
        if (userData.password) {
            updatedUser.password = userData.password;
        }
        
        // Update user in array
        const updatedUsers = users.map(user => user.id === id ? updatedUser : user);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Return the updated user without the password
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    },
    
    // Delete user
    deleteUser: function(id, deletedById) {
        const users = this.getAllUsers();
        const deletedByUser = this.getUserById(deletedById);
        const userToDelete = this.getUserById(id);
        
        // Validate if user exists
        if (!userToDelete) {
            throw new Error('User not found');
        }
        
        // Validate if deleter has permission
        if (!deletedByUser) {
            throw new Error('Invalid deleter ID');
        }
        
        // Only admins can delete admins
        if (userToDelete.role === ROLES.ADMIN && deletedByUser.role !== ROLES.ADMIN) {
            throw new Error('Only admins can delete admin users');
        }
        
        // Managers can only delete executives
        if (deletedByUser.role === ROLES.MANAGER && userToDelete.role !== ROLES.EXECUTIVE) {
            throw new Error('Managers can only delete executive users');
        }
        
        // Delete user from array
        const updatedUsers = users.filter(user => user.id !== id);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        return true;
    },
    
    // User authentication
    authenticateUser: function(username, password) {
        const user = this.getUserByUsername(username);
        if (!user || user.password !== password) {
            return null;
        }
        
        // Return the user without the password
        const { password: pwd, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },
    
    // Check if user has permission
    hasPermission: function(userId, action) {
        const user = this.getUserById(userId);
        if (!user) return false;
        
        switch(action) {
            case 'postJob':
                return true; // All roles can post jobs
            case 'manageUsers':
                return user.role === ROLES.ADMIN || user.role === ROLES.MANAGER;
            case 'manageAdmins':
                return user.role === ROLES.ADMIN;
            default:
                return false;
        }
    }
};

// Export the user manager and roles
window.UserManager = UserManager;
window.USER_ROLES = ROLES;