// Authentication functions
let currentUser = null;

// Initialize auth state
function initAuth() {
    if (typeof supabase !== 'undefined') {
        supabase.auth.getUser().then(({ data: { user } }) => {
            currentUser = user;
            updateAuthUI();
        }).catch(error => console.error('Auth init error:', error));
    }
}

// Toggle auth (login/logout)
function toggleAuth() {
    console.log('Toggle auth clicked, currentUser:', currentUser);
    if (currentUser) {
        logout();
    } else {
        showAuthModal();
    }
}

// Show auth modal
function showAuthModal() {
    console.log('Opening auth modal');
    document.getElementById('authModal').style.display = 'flex';
}

// Hide auth modal
function hideAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

// Login with GitHub
function loginGitHub() {
    if (typeof supabase !== 'undefined') {
        supabase.auth.signInWithOAuth({ provider: 'github' })
            .then(({ error }) => {
                if (error) alert('GitHub login failed: ' + error.message);
            });
    }
}

// Login with Google
function loginGoogle() {
    if (typeof supabase !== 'undefined') {
        supabase.auth.signInWithOAuth({ provider: 'google' })
            .then(({ error }) => {
                if (error) alert('Google login failed: ' + error.message);
            });
    }
}

// Login with email/password
function loginEmail() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    if (typeof supabase !== 'undefined') {
        supabase.auth.signInWithPassword({ email, password })
            .then(({ error }) => {
                if (error) {
                    alert('Login failed: ' + error.message);
                } else {
                    hideAuthModal();
                }
            });
    }
}

// Signup with email/password
function signupEmail() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    if (typeof supabase !== 'undefined') {
        supabase.auth.signUp({ email, password })
            .then(({ error }) => {
                if (error) {
                    alert('Signup failed: ' + error.message);
                } else {
                    alert('Check your email for verification link!');
                    hideAuthModal();
                }
            });
    }
}

// Logout
function logout() {
    if (typeof supabase !== 'undefined') {
        supabase.auth.signOut().then(() => {
            currentUser = null;
            updateAuthUI();
        });
    }
}

// Update UI based on auth state
function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    const mobileAuthBtn = document.getElementById('mobileAuthBtn');
    
    if (currentUser) {
        authBtn.textContent = 'Logout';
        mobileAuthBtn.textContent = 'Logout';
        authBtn.title = `Logout (${currentUser.email})`;
        mobileAuthBtn.title = `Logout (${currentUser.email})`;
    } else {
        authBtn.textContent = 'Login';
        mobileAuthBtn.textContent = 'Login';
        authBtn.title = 'Login/Signup';
        mobileAuthBtn.title = 'Login/Signup';
    }
}

// Switch between login/signup forms
function switchAuthMode(mode) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    
    if (mode === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
    }
}

// Listen for auth changes
if (typeof supabase !== 'undefined') {
    supabase.auth.onAuthStateChange((event, session) => {
        currentUser = session?.user || null;
        updateAuthUI();
        if (session) hideAuthModal();
    });
}

// Initialize auth when page loads
document.addEventListener('DOMContentLoaded', initAuth);