// Authentication
let currentUser = null;

// Initialize auth
async function initAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;
    updateAuthUI();
    if (user) await syncSavedTools();
}

// Toggle auth
async function toggleAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        logout();
    } else {
        showAuthModal();
    }
}

// Show/hide modal
function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
}

function hideAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

// OAuth login
function loginGitHub() {
    supabase.auth.signInWithOAuth({ 
        provider: 'github',
        options: { redirectTo: window.location.origin }
    });
}

function loginGoogle() {
    supabase.auth.signInWithOAuth({ 
        provider: 'google',
        options: { redirectTo: window.location.origin }
    });
}

// Email login
function loginEmail() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    supabase.auth.signInWithPassword({ email, password })
        .then(({ error }) => {
            if (error) alert('Login failed: ' + error.message);
            else hideAuthModal();
        });
}

// Email signup
function signupEmail() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    supabase.auth.signUp({ email, password })
        .then(({ error }) => {
            if (error) alert('Signup failed: ' + error.message);
            else {
                alert('Check your email for verification!');
                hideAuthModal();
            }
        });
}

// Logout
async function logout() {
    await supabase.auth.signOut();
    currentUser = null;
    window.location.href = window.location.origin;
}

// Update UI
function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    const mobileAuthBtn = document.getElementById('mobileAuthBtn');
    
    if (currentUser) {
        authBtn.textContent = 'Logout';
        mobileAuthBtn.textContent = 'Logout';
    } else {
        authBtn.textContent = 'Login';
        mobileAuthBtn.textContent = 'Login';
    }
}

// Switch forms
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

// Sync saved tools from database to localStorage
async function syncSavedTools() {
    if (!currentUser) return;
    
    const { data } = await db.getSavedTools(currentUser.id);
    
    if (data && data.length > 0) {
        const tools = data.map(d => d.tool_data);
        localStorage.setItem('savedTools', JSON.stringify(tools));
    } else {
        localStorage.setItem('savedTools', JSON.stringify([]));
    }
}

// Save tool to database
async function saveToolToDatabase(tool) {
    if (!currentUser) return;
    await db.saveTool(currentUser.id, tool);
}

// Remove tool from database
async function removeToolFromDatabase(tool) {
    if (!currentUser) return;
    await db.removeSavedTool(currentUser.id, tool);
}

// Auth state listener
supabase.auth.onAuthStateChange(async (event, session) => {
    currentUser = session?.user || null;
    updateAuthUI();
    if (session) {
        hideAuthModal();
        await syncSavedTools();
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', initAuth);
