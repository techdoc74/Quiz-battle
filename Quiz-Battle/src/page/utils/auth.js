export const registerUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.some(user => user.username === username)) {
    return { success: false, message: 'Username already exists!' };
  }
  users.push({ username, password, scores: [] }); // Store an empty scores array
  localStorage.setItem('users', JSON.stringify(users));
  return { success: true, message: 'Registration successful!' };
};

export const loginUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify({ username: user.username }));
    return { success: true, message: 'Login successful!' };
  }
  return { success: false, message: 'Invalid username or password!' };
};

export const logoutUser = () => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('currentUser'));
};