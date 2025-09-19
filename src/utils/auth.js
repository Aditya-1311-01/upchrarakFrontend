/**
 * Authentication utilities using LocalStorage
 * Handles login, signup, logout, and authentication checks
 */

const AUTH_KEY = 'upchaarak_user';
const USERS_KEY = 'upchaarak_users';

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const user = localStorage.getItem(AUTH_KEY);
  return user !== null;
};

/**
 * Get current user data
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem(AUTH_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Get all registered users
 */
export const getAllUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

/**
 * Save users list to localStorage
 */
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/**
 * Sign up a new user
 */
export const signup = (userData) => {
  const { name, email, password } = userData;
  
  // Validate input
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  
  const users = getAllUsers();
  
  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // In production, this should be hashed
    createdAt: new Date().toISOString()
  };
  
  // Save to users list
  users.push(newUser);
  saveUsers(users);
  
  // Auto login after signup
  const userSession = { ...newUser };
  delete userSession.password; // Don't store password in session
  localStorage.setItem(AUTH_KEY, JSON.stringify(userSession));
  
  return userSession;
};

/**
 * Login user
 */
export const login = (credentials) => {
  const { email, password } = credentials;
  
  // Validate input
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  const users = getAllUsers();
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Create session
  const userSession = { ...user };
  delete userSession.password; // Don't store password in session
  localStorage.setItem(AUTH_KEY, JSON.stringify(userSession));
  
  return userSession;
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

/**
 * Update user profile
 */
export const updateProfile = (updatedData) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('No user logged in');
  }
  
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Update user data
  const updatedUser = { ...users[userIndex], ...updatedData };
  users[userIndex] = updatedUser;
  saveUsers(users);
  
  // Update session
  const sessionUser = { ...updatedUser };
  delete sessionUser.password;
  localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));
  
  return sessionUser;
};