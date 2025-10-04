// Browser History Management
let currentState = {
    page: 'home',
    section: 'ai-tools',
    category: null
};

// Category icon mappings
const categoryIconMap = {
    'logo-generators': 'logo-icon',
    'ai-avatars': 'avatar-icon',
    'photo-editing-tools': 'photo-icon',
    '3d-generators': '3d-icon',
    'job-finder': 'job-finder-icon',
    'job-applier': 'job-applier-icon',
    'ai-parenting': 'parenting-icon',
    'ai-sustainability': 'sustainability-icon'
};

// Initialize page state
async function initializePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'home';
    const section = urlParams.get('section') || 'ai-tools';
    const category = urlParams.get('category');
    
    currentState = { page, section, category };
    
    // Load tools from database
    loadToolsFromDatabase();
    
    renderCurrentState();
}

// Load tools from database (using static data)
function loadToolsFromDatabase() {
    console.log('Using static tools data');
}

// Navigation state management
function updateState(newState, addToHistory = false) {
    const url = new URL(window.location);
    url.searchParams.set('page', newState.page);
    if (newState.section) url.searchParams.set('section', newState.section);
    if (newState.category) url.searchParams.set('category', newState.category);
    else url.searchParams.delete('category');
    
    if (addToHistory) {
        history.pushState(newState, '', url);
    } else {
        history.replaceState(newState, '', url);
    }
    currentState = newState;
}

// Handle browser back/forward
window.addEventListener('popstate', function(event) {
    if (event.state) {
        currentState = event.state;
    } else {
        currentState = { page: 'home', section: 'ai-tools', category: null };
    }
    renderCurrentState();
});

// Render current state
function renderCurrentState() {
    // Hide all sections first
    hideAllSections();
    
    if (currentState.page === 'home') {
        // Show hero section when on home page
        document.querySelector('.hero-section').style.display = 'block';
        document.querySelector('.stats-section').style.display = 'block';
        showMainContent();
        if (currentState.section) {
            switchTab(currentState.section, false);
        }
        if (currentState.category) {
            showTools(currentState.category, false);
        }
    } else if (currentState.page === 'saved-tools') {
        // Show saved tools as a separate page
        document.querySelector('.hero-section').style.display = 'none';
        document.querySelector('.stats-section').style.display = 'none';
        document.querySelector('.main-content').style.display = 'none';
        document.getElementById('tools-display').style.display = 'none';
        document.getElementById('saved-tools-page').style.display = 'block';
        renderSavedTools();
    } else {
        // Hide hero section on other pages
        document.querySelector('.hero-section').style.display = 'none';
        document.querySelector('.stats-section').style.display = 'none';
        showPage(currentState.page);
    }
}

// Hide all sections
function hideAllSections() {
    document.querySelector('.main-content').style.display = 'none';
    document.getElementById('tools-display').style.display = 'none';
    document.querySelector('.stats-section').style.display = 'none';
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
    });
}

// Show main content
function showMainContent() {
    document.querySelector('.main-content').style.display = 'block';
    document.getElementById('tools-display').style.display = 'none';
}

// Show specific page
function showPage(pageName) {
    const pageElement = document.getElementById(pageName + '-page');
    if (pageElement) {
        pageElement.style.display = 'block';
    }
}

// Dark mode functionality
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        document.querySelector('.dark-mode-btn i').className = 'fas fa-moon';
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        document.querySelector('.dark-mode-btn i').className = 'fas fa-sun';
    }
}



// // Touch/swipe handling for mobile
// let touchStartX = 0;
// let touchEndX = 0;
// let touchStartY = 0;
// let touchEndY = 0;

// function handleSwipe() {
//     const deltaX = touchEndX - touchStartX;
//     const deltaY = touchEndY - touchStartY;
    
//     // Only handle horizontal swipes if they're more significant than vertical
//     if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
//         const currentSection = document.querySelector('.tab-btn.active').getAttribute('data-section');
        
//         if (deltaX > 0 && currentSection === 'workflows') {
//             // Swipe right: workflows -> ai-tools
//             switchTab('ai-tools', true);
//         } else if (deltaX < 0 && currentSection === 'ai-tools') {
//             // Swipe left: ai-tools -> workflows
//             switchTab('workflows', true);
//         }
//     }
// }

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('.dark-mode-btn i').className = 'fas fa-sun';
    }
    
    // Initialize page state
    initializePage();
    
    // Initialize auth
    initAuth();
    
    // Set default active tab
    document.getElementById('ai-tools').classList.add('active');
    
    // Add swipe listeners for mobile
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        mainContent.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
    }
    
    // Add event listeners for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            // Scroll to top immediately for better user experience
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            if (page === 'home') {
                history.replaceState({ page: 'home', section: 'ai-tools', category: null }, '', '?page=home&section=ai-tools');
                currentState = { page: 'home', section: 'ai-tools', category: null };
                renderCurrentState();
            } else if (page === 'saved-tools') {
                updateState({ page: 'saved-tools', section: null, category: null }, true);
                renderCurrentState();
            } else if (page) {
                updateState({ page, section: null, category: null }, true);
                renderCurrentState();
            }
        });
    });
    
    // Add event listeners for footer links
    document.querySelectorAll('.footer-section a[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page === 'home') {
                history.replaceState({ page: 'home', section: 'ai-tools', category: null }, '', '?page=home&section=ai-tools');
                currentState = { page: 'home', section: 'ai-tools', category: null };
                renderCurrentState();
            } else if (page === 'saved-tools') {
                updateState({ page: 'saved-tools', section: null, category: null }, true);
                renderCurrentState();
            } else if (page) {
                updateState({ page, section: null, category: null }, true);
                renderCurrentState();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Logo click handlers - ensure AI tools homepage is final history state
    const headerLogo = document.querySelector('.logo');
    const footerLogo = document.querySelector('.footer-logo');
    
    if (headerLogo) {
        headerLogo.addEventListener('click', function(e) {
            e.preventDefault();
            history.replaceState({ page: 'home', section: 'ai-tools', category: null }, '', '?page=home&section=ai-tools');
            currentState = { page: 'home', section: 'ai-tools', category: null };
            renderCurrentState();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    if (footerLogo) {
        footerLogo.addEventListener('click', function(e) {
            e.preventDefault();
            history.replaceState({ page: 'home', section: 'ai-tools', category: null }, '', '?page=home&section=ai-tools');
            currentState = { page: 'home', section: 'ai-tools', category: null };
            renderCurrentState();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Add enter key support for search
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchTools();
        }
    });
    
    // Clear search when input is empty
    document.getElementById('searchInput').addEventListener('input', function(e) {
        if (e.target.value === '') {
            clearSearch();
        }
    });
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-mobile .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            document.getElementById('mobileNav').classList.remove('active');
        });
    });
});

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.toggle('active');
    
    // Close menu when clicking outside
    if (mobileNav.classList.contains('active')) {
        document.addEventListener('click', function closeMenu(e) {
            if (!mobileNav.contains(e.target) && !e.target.closest('.mobile-menu-btn')) {
                mobileNav.classList.remove('active');
                document.removeEventListener('click', closeMenu);
            }
        });
    }
}

// Render saved tools
function renderSavedTools() {
    const savedList = document.getElementById('saved-tools-list');
    savedList.innerHTML = '';
    
    // Check if user is logged in
    if (!currentUser) {
        savedList.innerHTML = '<p style="grid-column: 1/-1; color: var(--text-secondary); text-align: center;">Please login to view your saved tools.</p>';
        return;
    }
    
    let saved = getSavedTools();
    if (!saved.length) {
        savedList.innerHTML = '<p style="grid-column: 1/-1; color: var(--text-secondary); text-align: center;">No tools saved yet.</p>';
        return;
    }
    saved.forEach(tool => {
        const card = createToolCard(tool);
        savedList.appendChild(card);
    });
}

// Tab switching with history support
function switchTab(tabName, updateHistory = true) {
    // Remove pricing filter if present (prevents filter from showing in workflows)
    const pricingFilter = document.getElementById('pricing-filter');
    if (pricingFilter) pricingFilter.remove();
    // Remove active class from all tabs and sections
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    
    // Add active class to clicked tab
    const tabBtn = document.querySelector(`[data-section="${tabName}"]`);
    if (tabBtn) tabBtn.classList.add('active');
    
    // Show corresponding section
    const section = document.getElementById(tabName);
    if (section) section.classList.add('active');
    
    // Hide tools display if visible
    document.getElementById('tools-display').style.display = 'none';
    
    // Update search placeholder
    const searchInput = document.getElementById('searchInput');
    if (tabName === 'ai-tools') {
        searchInput.placeholder = 'Search AI tools...';
    } else {
        searchInput.placeholder = 'Search workflows...';
    }
    
    // Clear search
    searchInput.value = '';
    clearSearch();
    
    // Update history
    if (updateHistory) {
        updateState({ page: 'home', section: tabName, category: null }, true);
    }
}

// Comprehensive AI Tools data with 10 tools per category
const aiToolsData = {
    '3d-generators': [
        { name: 'Spline', description: 'Create and publish 3D web experiences', logo: 'https://spline.design/favicon.ico', category: '3D Generation', link: 'https://spline.design/', pricing: 'freemium' },
        { name: 'Meshy', description: 'AI-powered 3D asset generation', logo: 'https://www.meshy.ai/favicon.ico', category: '3D Generation', link: 'https://www.meshy.ai/', pricing: 'freemium' },
        { name: 'Kaedim', description: 'Turn 2D images into 3D models', logo: 'https://www.kaedim3d.com/favicon.ico', category: '3D Generation', link: 'https://www.kaedim3d.com/', pricing: 'premium' },
        { name: 'Leonardo.AI', description: '3D model generation with AI', logo: 'https://leonardo.ai/favicon.ico', category: '3D Generation', link: 'https://leonardo.ai/', pricing: 'freemium' },
        { name: 'Luma AI', description: 'Create 3D objects from text', logo: 'https://lumalabs.ai/favicon.ico', category: '3D Generation', link: 'https://lumalabs.ai/', pricing: 'free' },
        { name: 'Masterpiece Studio', description: 'AI-powered 3D creation', logo: 'https://masterpiecestudio.com/favicon.ico', category: '3D Generation', link: 'https://masterpiecestudio.com/', pricing: 'premium' },
        { name: 'Poly', description: '3D modeling with AI assistance', logo: 'https://withpoly.com/favicon.ico', category: '3D Generation', link: 'https://withpoly.com/', pricing: 'premium' },
        { name: 'Skybox Lab', description: 'AI-generated 3D environments', logo: 'https://skyboxlabs.com/favicon.ico', category: '3D Generation', link: 'https://skyboxlabs.com/', pricing: 'free' },
        { name: 'Mirageml', description: 'AI-powered 3D asset creation', logo: 'https://mirageml.com/favicon.ico', category: '3D Generation', link: 'https://mirageml.com/', pricing: 'premium' },
        { name: 'Scenario', description: 'AI-generated game assets', logo: 'https://www.scenario.com/favicon.ico', category: '3D Generation', link: 'https://www.scenario.com/', pricing: 'freemium' }
    ],
    'ai-assistants': [
        { name: 'Claude', description: 'Advanced AI assistant by Anthropic', logo: 'https://claude.ai/favicon.ico', category: 'AI Assistant', link: 'https://claude.ai/', pricing: 'freemium' },
        { name: 'Perplexity', description: 'AI-powered answer engine', logo: 'https://www.perplexity.ai/favicon.ico', category: 'AI Assistant', link: 'https://www.perplexity.ai/', pricing: 'freemium' },
        { name: 'Copilot', description: 'Microsoft AI companion', logo: 'https://copilot.microsoft.com/favicon.ico', category: 'AI Assistant', link: 'https://copilot.microsoft.com/', pricing: 'free' },
        { name: 'Gemini', description: 'Google AI assistant', logo: 'https://gemini.google.com/favicon.ico', category: 'AI Assistant', link: 'https://gemini.google.com/', pricing: 'freemium' },
        { name: 'Pi', description: 'Personal AI assistant', logo: 'https://heypi.com/favicon.ico', category: 'AI Assistant', link: 'https://heypi.com/', pricing: 'free' },
        { name: 'Poe', description: 'AI chat platform with multiple models', logo: 'https://poe.com/favicon.ico', category: 'AI Assistant', link: 'https://poe.com/', pricing: 'freemium' },
        { name: 'Bing Chat', description: 'Microsoft AI search assistant', logo: 'https://www.bing.com/favicon.ico', category: 'AI Assistant', link: 'https://www.bing.com/chat', pricing: 'free' },
        { name: 'Jasper', description: 'AI assistant for marketing teams', logo: 'https://www.jasper.ai/favicon.ico', category: 'AI Assistant', link: 'https://www.jasper.ai/', pricing: 'premium' },
        { name: 'YouChat', description: 'AI search assistant', logo: 'https://you.com/favicon.ico', category: 'AI Assistant', link: 'https://you.com/', pricing: 'free' },
        { name: 'Character.AI', description: 'Conversational AI characters', logo: 'https://character.ai/favicon.ico', category: 'AI Assistant', link: 'https://character.ai/', pricing: 'freemium' }
    ],
    'ai-detectors': [
        { name: 'GPTZero', description: 'Detect AI-generated text', logo: 'https://gptzero.me/favicon.ico', category: 'AI Detection', link: 'https://gptzero.me/', pricing: 'freemium' },
        { name: 'Content at Scale', description: 'AI content detector', logo: 'https://contentatscale.ai/favicon.ico', category: 'AI Detection', link: 'https://contentatscale.ai/ai-content-detector/', pricing: 'free' },
        { name: 'Originality.ai', description: 'AI content detection for businesses', logo: 'https://originality.ai/favicon.ico', category: 'AI Detection', link: 'https://originality.ai/', pricing: 'premium' },
        { name: 'Copyleaks', description: 'AI content detector and plagiarism checker', logo: 'https://copyleaks.com/favicon.ico', category: 'AI Detection', link: 'https://copyleaks.com/', pricing: 'freemium' },
        { name: 'Winston AI', description: 'AI content detection tool', logo: 'https://gowinston.ai/favicon.ico', category: 'AI Detection', link: 'https://gowinston.ai/', pricing: 'freemium' },
        { name: 'Sapling', description: 'AI writing assistant with detection', logo: 'https://sapling.ai/favicon.ico', category: 'AI Detection', link: 'https://sapling.ai/', pricing: 'freemium' },
        { name: 'Writer', description: 'AI content detector for teams', logo: 'https://writer.com/favicon.ico', category: 'AI Detection', link: 'https://writer.com/', pricing: 'premium' },
        { name: 'HiveModeration', description: 'AI content moderation platform', logo: 'https://www.hivemoderation.com/favicon.ico', category: 'AI Detection', link: 'https://www.hivemoderation.com/', pricing: 'premium' },
        { name: 'Undetectable.ai', description: 'AI humanizer for content', logo: 'https://undetectable.ai/favicon.ico', category: 'AI Detection', link: 'https://undetectable.ai/', pricing: 'freemium' },
        { name: 'ZeroGPT', description: 'Free AI content detector', logo: 'https://zerogpt.com/favicon.ico', category: 'AI Detection', link: 'https://zerogpt.com/', pricing: 'free' }
    ],
     'qr-code-generators': [
            { name: 'QR Code Monkey', description: 'Free custom QR code generator', logo: 'https://www.qrcode-monkey.com/favicon.ico', category: 'QR Code Generators', link: 'https://www.qrcode-monkey.com/', pricing: 'free' },
            { name: 'QRCode Tiger', description: 'Dynamic QR code generator', logo: 'https://www.qrcode-tiger.com/favicon.ico', category: 'QR Code Generators', link: 'https://www.qrcode-tiger.com/', pricing: 'freemium' },
            { name: 'Unitag QR Code', description: 'Custom QR code design', logo: 'https://www.unitag.io/favicon.ico', category: 'QR Code Generators', link: 'https://www.unitag.io/qrcode', pricing: 'freemium' },
            { name: 'GoQR.me', description: 'Simple QR code generator', logo: 'https://goqr.me/favicon.ico', category: 'QR Code Generators', link: 'https://goqr.me/', pricing: 'free' },
            { name: 'QRStuff', description: 'Create QR codes for free', logo: 'https://www.qrstuff.com/favicon.ico', category: 'QR Code Generators', link: 'https://www.qrstuff.com/', pricing: 'free' },
            { name: 'Visualead', description: 'Visual QR code generator', logo: 'https://www.visualead.com/favicon.ico', category: 'QR Code Generators', link: 'https://www.visualead.com/', pricing: 'premium' },
            { name: 'Beaconstac', description: 'Dynamic QR code platform', logo: 'https://www.beaconstac.com/favicon.ico', category: 'QR Code Generators', link: 'https://www.beaconstac.com/', pricing: 'premium' },
            { name: 'Scanova', description: 'Professional QR code solutions', logo: 'https://scanova.io/favicon.ico', category: 'QR Code Generators', link: 'https://scanova.io/', pricing: 'freemium' },
            { name: 'Kaywa', description: 'QR code management platform', logo: 'https://www.qr-code-generator.com/favicon.ico', category: 'QR Code Generators', link: 'https://www.qr-code-generator.com/', pricing: 'freemium' },
            { name: 'QRickit', description: 'Free QR code generator', logo: 'https://qrickit.com/favicon.ico', category: 'QR Code Generators', link: 'https://qrickit.com/', pricing: 'free' },
            { name: 'QR Code Generator', description: 'Create QR codes instantly', logo: 'https://www.the-qrcode-generator.com/favicon.ico', category: 'QR Code Generators', link: 'https://www.the-qrcode-generator.com/', pricing: 'free' }
    ],
    'app-website-developers': [
            { name: 'TeleportHQ', description: 'Free AI-powered website builder and code generator', logo: 'https://teleporthq.io/favicon.ico', category: 'App/Website Developers', link: 'https://teleporthq.io/', pricing: 'free' },
            { name: 'Wix', description: 'Website builder with AI design', logo: 'https://www.wix.com/favicon.ico', category: 'App/Website Developers', link: 'https://www.wix.com/', pricing: 'freemium' },
            { name: 'Webflow', description: 'No-code website builder', logo: 'https://webflow.com/favicon.ico', category: 'App/Website Developers', link: 'https://webflow.com/', pricing: 'freemium' },
            { name: 'Squarespace', description: 'Website and e-commerce builder', logo: 'https://www.squarespace.com/favicon.ico', category: 'App/Website Developers', link: 'https://www.squarespace.com/', pricing: 'premium' },
            { name: 'Bubble', description: 'No-code app development platform', logo: 'https://bubble.io/favicon.ico', category: 'App/Website Developers', link: 'https://bubble.io/', pricing: 'freemium' },
            { name: 'Appy Pie', description: 'App builder for non-coders', logo: 'https://www.appypie.com/favicon.ico', category: 'App/Website Developers', link: 'https://www.appypie.com/', pricing: 'freemium' },
            { name: 'Zyro', description: 'AI-powered website builder', logo: 'https://zyro.com/favicon.ico', category: 'App/Website Developers', link: 'https://zyro.com/', pricing: 'freemium' },
            { name: 'Weebly', description: 'Drag-and-drop website builder', logo: 'https://www.weebly.com/favicon.ico', category: 'App/Website Developers', link: 'https://www.weebly.com/', pricing: 'freemium' },
            { name: 'Shopify', description: 'E-commerce website builder', logo: 'https://www.shopify.com/favicon.ico', category: 'App/Website Developers', link: 'https://www.shopify.com/', pricing: 'premium' },
            { name: 'WordPress.com', description: 'Website and blog platform', logo: 'https://wordpress.com/favicon.ico', category: 'App/Website Developers', link: 'https://wordpress.com/', pricing: 'freemium' },
            { name: 'Glide', description: 'No-code app builder for mobile', logo: 'https://www.glideapps.com/favicon.ico', category: 'App/Website Developers', link: 'https://www.glideapps.com/', pricing: 'freemium' },
            { name: 'Thunkable', description: 'No-code mobile app builder', logo: 'https://thunkable.com/favicon.ico', category: 'App/Website Developers', link: 'https://thunkable.com/', pricing: 'freemium' }
    ],
    'image-generators': [
        { name: 'DALL-E 2', description: 'Create realistic images from text descriptions', logo: 'https://openai.com/favicon.ico', category: 'Image Generation', link: 'https://openai.com/dall-e-2/', pricing: 'premium' },
        { name: 'Midjourney', description: 'AI art generator creating stunning artwork', logo: 'https://www.midjourney.com/favicon.ico', category: 'Image Generation', link: 'https://www.midjourney.com', pricing: 'premium' },
        { name: 'Stable Diffusion', description: 'Open-source text-to-image AI model', logo: 'https://stability.ai/favicon.ico', category: 'Image Generation', link: 'https://stability.ai', pricing: 'free' },
        { name: 'Adobe Firefly', description: 'Creative generative AI for images and text effects', logo: 'https://www.adobe.com/favicon.ico', category: 'Image Generation', link: 'https://firefly.adobe.com', pricing: 'premium' },
        { name: 'Canva AI', description: 'AI-powered design and image generation', logo: 'https://www.canva.com/favicon.ico', category: 'Image Generation', link: 'https://www.canva.com', pricing: 'freemium' },
        { name: 'Leonardo AI', description: 'AI art generator for creative projects', logo: 'https://leonardo.ai/favicon.ico', category: 'Image Generation', link: 'https://leonardo.ai', pricing: 'freemium' },
        { name: 'RunwayML', description: 'AI tools for creative content generation', logo: 'https://runwayml.com/favicon.ico', category: 'Image Generation', link: 'https://runwayml.com', pricing: 'premium' },
        { name: 'DeepAI', description: 'AI image generation and enhancement tools', logo: 'https://deepai.org/favicon.ico', category: 'Image Generation', link: 'https://deepai.org', pricing: 'freemium' },
        { name: 'Artbreeder', description: 'Create and explore AI-generated art', logo: 'https://www.artbreeder.com/favicon.ico', category: 'Image Generation', link: 'https://www.artbreeder.com', pricing: 'freemium' },
        { name: 'DreamStudio', description: 'Stable Diffusion web interface', logo: 'https://stability.ai/favicon.ico', category: 'Image Generation', link: 'https://dreamstudio.ai', pricing: 'premium' },
        { name: 'Craiyon', description: 'Free AI image generator', logo: 'https://www.craiyon.com/favicon.ico', category: 'Image Generation', link: 'https://www.craiyon.com', pricing: 'free' },
        { name: 'Lexica', description: 'Search engine for AI-generated images', logo: 'https://lexica.art/favicon.ico', category: 'Image Generation', link: 'https://lexica.art', pricing: 'freemium' },
        { name: 'Playground AI', description: 'Create AI art with simple prompts', logo: 'https://playgroundai.com/favicon.ico', category: 'Image Generation', link: 'https://playgroundai.com', pricing: 'freemium' },
        { name: 'NightCafe', description: 'AI art generator with various styles', logo: 'https://nightcafe.studio/favicon.ico', category: 'Image Generation', link: 'https://nightcafe.studio', pricing: 'freemium' },
        { name: 'Stable Diffusion WebUI', description: 'Open-source web interface for Stable Diffusion', logo: 'https://github.com/favicon.ico', category: 'Image Generation', link: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui', pricing: 'free' },
        { name: 'Stability AI', description: 'Creators of Stable Diffusion', logo: 'https://stability.ai/favicon.ico', category: 'Image Generation', link: 'https://stability.ai', pricing: 'freemium' },
        { name: 'DALL-E 3', description: 'Latest version of OpenAI\'s image generator', logo: 'https://openai.com/favicon.ico', category: 'Image Generation', link: 'https://openai.com/dall-e-3', pricing: 'premium' },


    ],
    'video-generators': [
    { name: 'FlexClip', description: 'Free online AI video maker and editor', logo: 'https://www.flexclip.com/favicon.ico', category: 'Video Generation', link: 'https://www.flexclip.com', pricing: 'free' },
    { name: 'Runway ML', description: 'AI-powered video editing and generation', logo: 'https://runwayml.com/favicon.ico', category: 'Video Generation', link: 'https://runwayml.com', pricing: 'premium' },
        { name: 'Synthesia', description: 'AI video generation with virtual presenters', logo: 'https://www.synthesia.io/favicon.ico', category: 'Video Generation', link: 'https://www.synthesia.io', pricing: 'premium' },
        { name: 'Pictory', description: 'AI video creation from text and blog posts', logo: 'https://pictory.ai/favicon.ico', category: 'Video Generation', link: 'https://pictory.ai', pricing: 'premium' },
        { name: 'Lumen5', description: 'AI-powered video creation platform', logo: 'https://lumen5.com/favicon.ico', category: 'Video Generation', link: 'https://lumen5.com', pricing: 'freemium' },
        { name: 'InVideo', description: 'AI video creation and editing platform', logo: 'https://invideo.io/favicon.ico', category: 'Video Generation', link: 'https://invideo.io', pricing: 'freemium' },
        { name: 'Fliki', description: 'AI video generator from text', logo: 'https://fliki.ai/favicon.ico', category: 'Video Generation', link: 'https://fliki.ai', pricing: 'freemium' },
        { name: 'Steve AI', description: 'AI video maker for animated and live videos', logo: 'https://www.steve.ai/favicon.ico', category: 'Video Generation', link: 'https://www.steve.ai', pricing: 'premium' },
        { name: 'Elai', description: 'AI video generation platform', logo: 'https://elai.io/favicon.ico', category: 'Video Generation', link: 'https://elai.io', pricing: 'premium' },
        { name: 'Pandora AI', description: 'AI-powered video editing and generation', logo: 'https://pandoraai.app/favicon.ico', category: 'Video Generation', link: 'https://pandoraia.com', pricing: 'premium' },
        { name: 'Hour One', description: 'AI video generation with virtual humans', logo: 'https://hourone.ai/favicon.ico', category: 'Video Generation', link: 'https://hourone.ai', pricing: 'premium' },
        { name: 'Colossyan', description: 'AI video creator with synthetic actors', logo: 'https://www.colossyan.com/favicon.ico', category: 'Video Generation', link: 'https://www.colossyan.com', pricing: 'premium' }
    ],
    'voice-generators': [
    { name: 'Uberduck', description: 'Free AI voice generator and text-to-speech', logo: 'https://uberduck.ai/favicon.ico', category: 'Voice Generation', link: 'https://uberduck.ai', pricing: 'free' },
    { name: 'ElevenLabs', description: 'AI voice synthesis and cloning platform', logo: 'https://elevenlabs.io/favicon.ico', category: 'Voice Generation', link: 'https://elevenlabs.io', pricing: 'freemium' },
        { name: 'Murf', description: 'AI voice generator for voiceovers', logo: 'https://murf.ai/favicon.ico', category: 'Voice Generation', link: 'https://murf.ai', pricing: 'premium' },
        { name: 'Speechify', description: 'Text-to-speech AI with natural voices', logo: 'https://speechify.com/favicon.ico', category: 'Voice Generation', link: 'https://speechify.com', pricing: 'freemium' },
        { name: 'Descript', description: 'AI-powered audio and video editing', logo: 'https://www.descript.com/favicon.ico', category: 'Voice Generation', link: 'https://www.descript.com', pricing: 'freemium' },
        { name: 'Resemble AI', description: 'AI voice generator and voice cloning', logo: 'https://www.resemble.ai/favicon.ico', category: 'Voice Generation', link: 'https://www.resemble.ai', pricing: 'premium' },
        { name: 'Replica Studios', description: 'AI voice actors for games and films', logo: 'https://replicastudios.com/favicon.ico', category: 'Voice Generation', link: 'https://replicastudios.com', pricing: 'premium' },
        { name: 'Lovo', description: 'AI voice generator and text-to-speech', logo: 'https://www.lovo.ai/favicon.ico', category: 'Voice Generation', link: 'https://www.lovo.ai', pricing: 'premium' },
        { name: 'WellSaid Labs', description: 'AI voice platform for enterprise', logo: 'https://wellsaidlabs.com/favicon.ico', category: 'Voice Generation', link: 'https://wellsaidlabs.com', pricing: 'premium' },
        { name: 'Voicemod', description: 'Real-time voice changer and soundboard', logo: 'https://www.voicemod.net/favicon.ico', category: 'Voice Generation', link: 'https://www.voicemod.net', pricing: 'freemium' },
        { name: 'Listnr', description: 'AI voice generator for podcasts and videos', logo: 'https://www.listnr.tech/favicon.ico', category: 'Voice Generation', link: 'https://www.listnr.tech', pricing: 'freemium' }
    ],
    'music-generators': [
    { name: 'Soundful', description: 'Free AI music generator for creators', logo: 'https://soundful.com/favicon.ico', category: 'Music Generation', link: 'https://soundful.com', pricing: 'free' },
    { name: 'AIVA', description: 'AI composer for emotional soundtrack music', logo: 'https://www.aiva.ai/favicon.ico', category: 'Music Generation', link: 'https://www.aiva.ai', pricing: 'freemium' },
        { name: 'Mubert', description: 'AI music generation platform', logo: 'https://mubert.com/favicon.ico', category: 'Music Generation', link: 'https://mubert.com', pricing: 'freemium' },
        { name: 'Amper Music', description: 'AI music composition for content creators', logo: 'https://www.ampermusic.com/favicon.ico', category: 'Music Generation', link: 'https://www.ampermusic.com', pricing: 'premium' },
        { name: 'Soundraw', description: 'AI music generator for creators', logo: 'https://soundraw.io/favicon.ico', category: 'Music Generation', link: 'https://soundraw.io', pricing: 'premium' },
        { name: 'Boomy', description: 'Create original music with AI', logo: 'https://boomy.com/favicon.ico', category: 'Music Generation', link: 'https://boomy.com', pricing: 'freemium' },
        { name: 'Endel', description: 'AI-powered adaptive music for focus', logo: 'https://endel.io/favicon.ico', category: 'Music Generation', link: 'https://endel.io', pricing: 'freemium' },
        { name: 'Beatoven.ai', description: 'AI music generator for videos and podcasts', logo: 'https://www.beatoven.ai/favicon.ico', category: 'Music Generation', link: 'https://www.beatoven.ai', pricing: 'premium' },
        { name: 'Loudly', description: 'AI music platform for content creators', logo: 'https://www.loudly.com/favicon.ico', category: 'Music Generation', link: 'https://www.loudly.com', pricing: 'premium' },
        { name: 'Ecrett Music', description: 'AI music generator for content creation', logo: 'https://ecrettmusic.com/favicon.ico', category: 'Music Generation', link: 'https://ecrettmusic.com', pricing: 'premium' },
        { name: 'Jukedeck', description: 'AI music composition platform', logo: 'https://www.jukedeck.com/favicon.ico', category: 'Music Generation', link: 'https://www.jukedeck.com', pricing: 'premium' }
    ],
    'chatbots': [
        { name: 'ChatGPT', description: 'Free AI chatbot by OpenAI', logo: 'https://chat.openai.com/favicon.ico', category: 'Chatbots', link: 'https://chat.openai.com', pricing: 'free' },
        { name: 'Google Bard', description: 'Free conversational AI by Google', logo: 'https://bard.google.com/favicon.ico', category: 'Chatbots', link: 'https://bard.google.com', pricing: 'free' },
        { name: 'Bing Chat', description: 'Free AI chat by Microsoft', logo: 'https://www.bing.com/favicon.ico', category: 'Chatbots', link: 'https://www.bing.com/chat', pricing: 'free' },
        { name: 'Claude', description: 'AI assistant by Anthropic', logo: 'https://claude.ai/favicon.ico', category: 'Chatbots', link: 'https://claude.ai', pricing: 'freemium' },
        { name: 'Perplexity AI', description: 'AI-powered answer engine', logo: 'https://www.perplexity.ai/favicon.ico', category: 'Chatbots', link: 'https://www.perplexity.ai', pricing: 'freemium' },
        { name: 'Character.AI', description: 'Chat with AI characters', logo: 'https://character.ai/favicon.ico', category: 'Chatbots', link: 'https://character.ai', pricing: 'freemium' },
        { name: 'Pi', description: 'Personal AI assistant', logo: 'https://heypi.com/favicon.ico', category: 'Chatbots', link: 'https://heypi.com', pricing: 'free' },
        { name: 'HuggingChat', description: 'Open-source AI chat', logo: 'https://huggingface.co/favicon.ico', category: 'Chatbots', link: 'https://huggingface.co/chat', pricing: 'free' },
        { name: 'YouChat', description: 'AI search assistant', logo: 'https://you.com/favicon.ico', category: 'Chatbots', link: 'https://you.com', pricing: 'free' },
        { name: 'Poe', description: 'Chat with multiple AI models', logo: 'https://poe.com/favicon.ico', category: 'Chatbots', link: 'https://poe.com', pricing: 'freemium' }
    ],
    'ai-chatbots': [
        { name: 'ChatGPT', description: 'AI language model by OpenAI', logo: 'https://chat.openai.com/favicon.ico', category: 'AI Chatbots', link: 'https://chat.openai.com', pricing: 'freemium' },
        { name: 'Claude', description: 'AI assistant by Anthropic', logo: 'https://claude.ai/favicon.ico', category: 'AI Chatbots', link: 'https://claude.ai', pricing: 'freemium' },
        { name: 'Bard', description: 'Google\'s conversational AI', logo: 'https://bard.google.com/favicon.ico', category: 'AI Chatbots', link: 'https://bard.google.com', pricing: 'free' },
        { name: 'Bing Chat', description: 'Microsoft\'s AI-powered chat', logo: 'https://www.bing.com/favicon.ico', category: 'AI Chatbots', link: 'https://www.bing.com/chat', pricing: 'free' },
        { name: 'Perplexity AI', description: 'AI-powered answer engine', logo: 'https://www.perplexity.ai/favicon.ico', category: 'AI Chatbots', link: 'https://www.perplexity.ai', pricing: 'freemium' },
        { name: 'Poe', description: 'Chat with multiple AI models', logo: 'https://poe.com/favicon.ico', category: 'AI Chatbots', link: 'https://poe.com', pricing: 'freemium' },
        { name: 'YouChat', description: 'AI search assistant', logo: 'https://you.com/favicon.ico', category: 'AI Chatbots', link: 'https://you.com', pricing: 'free' },
        { name: 'Character.AI', description: 'Chat with AI characters', logo: 'https://character.ai/favicon.ico', category: 'AI Chatbots', link: 'https://character.ai', pricing: 'freemium' },
        { name: 'Pi', description: 'Personal AI assistant', logo: 'https://heypi.com/favicon.ico', category: 'AI Chatbots', link: 'https://heypi.com', pricing: 'free' },
        { name: 'HuggingChat', description: 'Open-source AI chat', logo: 'https://huggingface.co/favicon.ico', category: 'AI Chatbots', link: 'https://huggingface.co/chat', pricing: 'free' },
        { name: 'ChatSonic', description: 'AI writing assistant', logo: 'https://writesonic.com/favicon.ico', category: 'AI Chatbots', link: 'https://writesonic.com/chat', pricing: 'freemium' },
        { name: 'DeepSeek Chat', description: 'AI chat by DeepSeek', logo: 'https://deepseek.com/favicon.ico', category: 'AI Chatbots', link: 'https://deepseek.com', pricing: 'free' },
        { name: 'Claude Instant', description: 'Faster version of Claude', logo: 'https://claude.ai/favicon.ico', category: 'AI Chatbots', link: 'https://claude.ai', pricing: 'free' },
        { name: 'ChatGPT Plus', description: 'Premium version of ChatGPT', logo: 'https://chat.openai.com/favicon.ico', category: 'AI Chatbots', link: 'https://chat.openai.com', pricing: 'premium' },
        { name: 'Bard Advanced', description: 'Advanced version of Google Bard', logo: 'https://bard.google.com/favicon.ico', category: 'AI Chatbots', link: 'https://bard.google.com', pricing: 'premium' },
        { name: 'ChatGPT Enterprise', description: 'ChatGPT for businesses', logo: 'https://chat.openai.com/favicon.ico', category: 'AI Chatbots', link: 'https://openai.com/enterprise', pricing: 'premium' },
        { name: 'Claude Pro', description: 'Pro version of Claude', logo: 'https://claude.ai/favicon.ico', category: 'AI Chatbots', link: 'https://claude.ai', pricing: 'premium' },
        { name: 'Bing Chat Enterprise', description: 'Enterprise version of Bing Chat', logo: 'https://www.bing.com/favicon.ico', category: 'AI Chatbots', link: 'https://www.bing.com/chat', pricing: 'premium' },
        { name: 'Perplexity Pro', description: 'Premium version of Perplexity', logo: 'https://www.perplexity.ai/favicon.ico', category: 'AI Chatbots', link: 'https://www.perplexity.ai/pro', pricing: 'premium' }
    ],
    'text-generators': [
        { name: 'ChatGPT', description: 'Free AI text generation and writing', logo: 'https://chat.openai.com/favicon.ico', category: 'Text Generators', link: 'https://chat.openai.com', pricing: 'free' },
        { name: 'Google Bard', description: 'Free AI writing assistant by Google', logo: 'https://bard.google.com/favicon.ico', category: 'Text Generators', link: 'https://bard.google.com', pricing: 'free' },
        { name: 'Jasper', description: 'AI content creation platform', logo: 'https://www.jasper.ai/favicon.ico', category: 'Text Generators', link: 'https://www.jasper.ai', pricing: 'premium' },
        { name: 'Copy.ai', description: 'AI copywriting assistant', logo: 'https://www.copy.ai/favicon.ico', category: 'Text Generators', link: 'https://www.copy.ai', pricing: 'freemium' },
        { name: 'Writesonic', description: 'AI writing and content creation', logo: 'https://writesonic.com/favicon.ico', category: 'Text Generators', link: 'https://writesonic.com', pricing: 'freemium' },
        { name: 'Rytr', description: 'AI writing assistant for content', logo: 'https://rytr.me/favicon.ico', category: 'Text Generators', link: 'https://rytr.me', pricing: 'freemium' },
        { name: 'QuillBot', description: 'AI paraphrasing and writing tool', logo: 'https://quillbot.com/favicon.ico', category: 'Text Generators', link: 'https://quillbot.com', pricing: 'freemium' },
        { name: 'Grammarly', description: 'AI writing assistant and grammar checker', logo: 'https://www.grammarly.com/favicon.ico', category: 'Text Generators', link: 'https://www.grammarly.com', pricing: 'freemium' },
        { name: 'Wordtune', description: 'AI writing companion', logo: 'https://www.wordtune.com/favicon.ico', category: 'Text Generators', link: 'https://www.wordtune.com', pricing: 'freemium' },
        { name: 'Notion AI', description: 'AI writing assistant in Notion', logo: 'https://www.notion.so/favicon.ico', category: 'Text Generators', link: 'https://www.notion.so/product/ai', pricing: 'premium' },
        { name: 'Anyword', description: 'AI copywriting for marketing', logo: 'https://anyword.com/favicon.ico', category: 'Text Generators', link: 'https://anyword.com', pricing: 'freemium' },
        { name: 'Peppertype', description: 'AI content creation platform', logo: 'https://www.peppertype.ai/favicon.ico', category: 'Text Generators', link: 'https://www.peppertype.ai', pricing: 'freemium' },
        { name: 'Copysmith', description: 'AI content generation for ecommerce', logo: 'https://copysmith.ai/favicon.ico', category: 'Text Generators', link: 'https://copysmith.ai', pricing: 'freemium' },
        { name: 'Hypotenuse AI', description: 'AI content writing tool', logo: 'https://www.hypotenuse.ai/favicon.ico', category: 'Text Generators', link: 'https://www.hypotenuse.ai', pricing: 'freemium' },
        { name: 'ContentBot', description: 'AI content automation', logo: 'https://contentbot.ai/favicon.ico', category: 'Text Generators', link: 'https://contentbot.ai', pricing: 'freemium' },
        { name: 'Simplified', description: 'AI content creation and design', logo: 'https://simplified.com/favicon.ico', category: 'Text Generators', link: 'https://simplified.com', pricing: 'freemium' },
        { name: 'Sudowrite', description: 'AI writing tool for fiction', logo: 'https://www.sudowrite.com/favicon.ico', category: 'Text Generators', link: 'https://www.sudowrite.com', pricing: 'premium' },
        { name: 'ShortlyAI', description: 'AI writing assistant', logo: 'https://www.shortlyai.com/favicon.ico', category: 'Text Generators', link: 'https://www.shortlyai.com', pricing: 'premium' }
    ],
    'ai-procurement': [
        { name: 'OpenProcure', description: 'Free open-source procurement platform', logo: 'https://openprocure.org/favicon.ico', category: 'AI Procurement', link: 'https://openprocure.org', pricing: 'free' },
        { name: 'Procurement Express', description: 'Free procurement management tools', logo: 'https://www.procurementexpress.com/favicon.ico', category: 'AI Procurement', link: 'https://www.procurementexpress.com', pricing: 'free' },
        { name: 'Coupa', description: 'AI-powered procurement platform', logo: 'https://www.coupa.com/favicon.ico', category: 'AI Procurement', link: 'https://www.coupa.com', pricing: 'premium' },
        { name: 'Ariba', description: 'SAP procurement and sourcing', logo: 'https://www.ariba.com/favicon.ico', category: 'AI Procurement', link: 'https://www.ariba.com', pricing: 'premium' },
        { name: 'Jaggaer', description: 'AI procurement and supply chain', logo: 'https://www.jaggaer.com/favicon.ico', category: 'AI Procurement', link: 'https://www.jaggaer.com', pricing: 'premium' },
        { name: 'Ivalua', description: 'Procurement and sourcing platform', logo: 'https://www.ivalua.com/favicon.ico', category: 'AI Procurement', link: 'https://www.ivalua.com', pricing: 'premium' },
        { name: 'Zycus', description: 'AI-powered procurement suite', logo: 'https://www.zycus.com/favicon.ico', category: 'AI Procurement', link: 'https://www.zycus.com', pricing: 'premium' },
        { name: 'GEP SMART', description: 'AI procurement platform', logo: 'https://www.gep.com/favicon.ico', category: 'AI Procurement', link: 'https://www.gep.com', pricing: 'premium' },
        { name: 'Basware', description: 'AI purchase-to-pay solutions', logo: 'https://www.basware.com/favicon.ico', category: 'AI Procurement', link: 'https://www.basware.com', pricing: 'premium' },
        { name: 'Procurify', description: 'Procurement management software', logo: 'https://www.procurify.com/favicon.ico', category: 'AI Procurement', link: 'https://www.procurify.com', pricing: 'freemium' },
        { name: 'ProcurePort', description: 'AI procurement analytics', logo: 'https://www.procureport.com/favicon.ico', category: 'AI Procurement', link: 'https://www.procureport.com', pricing: 'premium' },
        { name: 'Sievo', description: 'AI spend analytics platform', logo: 'https://sievo.com/favicon.ico', category: 'AI Procurement', link: 'https://sievo.com', pricing: 'premium' },
        { name: 'SpendHQ', description: 'AI spend analysis and procurement', logo: 'https://www.spendhq.com/favicon.ico', category: 'AI Procurement', link: 'https://www.spendhq.com', pricing: 'freemium' },
        { name: 'Fairmarkit', description: 'AI autonomous sourcing', logo: 'https://www.fairmarkit.com/favicon.ico', category: 'AI Procurement', link: 'https://www.fairmarkit.com', pricing: 'premium' },
        { name: 'Keelvar', description: 'AI sourcing optimization', logo: 'https://www.keelvar.com/favicon.ico', category: 'AI Procurement', link: 'https://www.keelvar.com', pricing: 'premium' },
        { name: 'Scout RFP', description: 'AI-powered sourcing platform', logo: 'https://www.scoutrfp.com/favicon.ico', category: 'AI Procurement', link: 'https://www.scoutrfp.com', pricing: 'premium' },
        { name: 'Zip', description: 'AI procurement orchestration', logo: 'https://www.zip.co/favicon.ico', category: 'AI Procurement', link: 'https://www.zip.co', pricing: 'freemium' }
    ],
    'data-analysis': [
        { name: 'Tableau', description: 'Data visualization and analytics platform', logo: 'https://www.tableau.com/favicon.ico', category: 'Data Analysis', link: 'https://www.tableau.com', pricing: 'premium' },
        { name: 'Power BI', description: 'Microsoft\'s business analytics tool', logo: 'https://powerbi.microsoft.com/favicon.ico', category: 'Data Analysis', link: 'https://powerbi.microsoft.com', pricing: 'freemium' },
        { name: 'DataRobot', description: 'Automated machine learning platform', logo: 'https://www.datarobot.com/favicon.ico', category: 'Data Analysis', link: 'https://www.datarobot.com', pricing: 'premium' },
        { name: 'H2O.ai', description: 'Open source machine learning platform', logo: 'https://www.h2o.ai/favicon.ico', category: 'Data Analysis', link: 'https://www.h2o.ai', pricing: 'free' },
        { name: 'MonkeyLearn', description: 'Text analysis with machine learning', logo: 'https://monkeylearn.com/favicon.ico', category: 'Data Analysis', link: 'https://monkeylearn.com', pricing: 'freemium' },
        { name: 'Alteryx', description: 'Self-service data analytics platform', logo: 'https://www.alteryx.com/favicon.ico', category: 'Data Analysis', link: 'https://www.alteryx.com', pricing: 'premium' },
        { name: 'Qlik Sense', description: 'Data analytics and visualization', logo: 'https://www.qlik.com/favicon.ico', category: 'Data Analysis', link: 'https://www.qlik.com', pricing: 'premium' },
        { name: 'Looker', description: 'Business intelligence platform', logo: 'https://looker.com/favicon.ico', category: 'Data Analysis', link: 'https://looker.com', pricing: 'premium' },
        { name: 'Sisense', description: 'AI-driven analytics platform', logo: 'https://www.sisense.com/favicon.ico', category: 'Data Analysis', link: 'https://www.sisense.com', pricing: 'premium' },
        { name: 'Palantir', description: 'Big data analytics platform', logo: 'https://www.palantir.com/favicon.ico', category: 'Data Analysis', link: 'https://www.palantir.com', pricing: 'premium' }
    ],
    'automation-tools': [
        { name: 'n8n', description: 'Free open-source workflow automation', logo: 'https://n8n.io/favicon.ico', category: 'Automation', link: 'https://n8n.io', pricing: 'free' },
        { name: 'Automate.io', description: 'Free automation for small teams', logo: 'https://automate.io/favicon.ico', category: 'Automation', link: 'https://automate.io', pricing: 'free' },
        { name: 'Zapier', description: 'Automate workflows between apps', logo: 'https://zapier.com/favicon.ico', category: 'Automation', link: 'https://zapier.com', pricing: 'freemium' },
        { name: 'Make (Integromat)', description: 'Visual platform for automation', logo: 'https://www.make.com/favicon.ico', category: 'Automation', link: 'https://www.make.com', pricing: 'freemium' },
        { name: 'UiPath', description: 'Robotic Process Automation platform', logo: 'https://www.uipath.com/favicon.ico', category: 'Automation', link: 'https://www.uipath.com', pricing: 'freemium' },
        { name: 'Microsoft Power Automate', description: 'Cloud-based automation service', logo: 'https://powerautomate.microsoft.com/favicon.ico', category: 'Automation', link: 'https://powerautomate.microsoft.com', pricing: 'freemium' },
        { name: 'IFTTT', description: 'Connect apps and devices', logo: 'https://ifttt.com/favicon.ico', category: 'Automation', link: 'https://ifttt.com', pricing: 'freemium' },
        { name: 'Automation Anywhere', description: 'RPA platform for business automation', logo: 'https://www.automationanywhere.com/favicon.ico', category: 'Automation', link: 'https://www.automationanywhere.com', pricing: 'premium' },
        { name: 'Blue Prism', description: 'Intelligent automation platform', logo: 'https://www.blueprism.com/favicon.ico', category: 'Automation', link: 'https://www.blueprism.com', pricing: 'premium' },
        { name: 'Workato', description: 'Integration and automation platform', logo: 'https://www.workato.com/favicon.ico', category: 'Automation', link: 'https://www.workato.com', pricing: 'premium' },
        { name: 'Nintex', description: 'Process automation and workflow', logo: 'https://www.nintex.com/favicon.ico', category: 'Automation', link: 'https://www.nintex.com', pricing: 'premium' },
        { name: 'Pipefy', description: 'Business process automation', logo: 'https://www.pipefy.com/favicon.ico', category: 'Automation', link: 'https://www.pipefy.com', pricing: 'freemium' }
    ]
};

// Add more categories with 10 tools each
Object.assign(aiToolsData, {
    'productivity-tools': [
        { name: 'Google Keep', description: 'Free note-taking and organization', logo: 'https://keep.google.com/favicon.ico', category: 'PD Tools', link: 'https://keep.google.com', pricing: 'free' },
        { name: 'Microsoft To Do', description: 'Free task management app', logo: 'https://to-do.microsoft.com/favicon.ico', category: 'PD Tools', link: 'https://to-do.microsoft.com', pricing: 'free' },
        { name: 'Notion', description: 'All-in-one workspace for notes, tasks, and wikis', logo: 'https://www.notion.so/favicon.ico', category: 'PD Tools', link: 'https://www.notion.so/', pricing: 'freemium' },
        { name: 'Evernote', description: 'Note-taking and organization app', logo: 'https://evernote.com/favicon.ico', category: 'PD Tools', link: 'https://evernote.com/', pricing: 'freemium' },
        { name: 'Todoist', description: 'Task manager and to-do list', logo: 'https://todoist.com/favicon.ico', category: 'PD Tools', link: 'https://todoist.com/', pricing: 'freemium' },
        { name: 'Trello', description: 'Visual project management tool', logo: 'https://trello.com/favicon.ico', category: 'PD Tools', link: 'https://trello.com/', pricing: 'freemium' },
        { name: 'ClickUp', description: 'Productivity platform for teams', logo: 'https://clickup.com/favicon.ico', category: 'PD Tools', link: 'https://clickup.com/', pricing: 'freemium' },
        { name: 'Asana', description: 'Work management platform', logo: 'https://asana.com/favicon.ico', category: 'PD Tools', link: 'https://asana.com/', pricing: 'freemium' },
        { name: 'RescueTime', description: 'Time tracking and productivity analytics', logo: 'https://www.rescuetime.com/favicon.ico', category: 'PD Tools', link: 'https://www.rescuetime.com/', pricing: 'freemium' },
        { name: 'Forest', description: 'Focus app to beat phone addiction', logo: 'https://www.forestapp.cc/favicon.ico', category: 'PD Tools', link: 'https://www.forestapp.cc/', pricing: 'premium' },
        { name: 'Focus@Will', description: 'Productivity music for focus', logo: 'https://www.focusatwill.com/favicon.ico', category: 'PD Tools', link: 'https://www.focusatwill.com/', pricing: 'premium' },
        { name: 'MindMeister', description: 'Mind mapping and brainstorming tool', logo: 'https://www.mindmeister.com/favicon.ico', category: 'PD Tools', link: 'https://www.mindmeister.com/', pricing: 'freemium' },
        { name: 'Freedom', description: 'Distraction blocker for productivity', logo: 'https://freedom.to/favicon.ico', category: 'PD Tools', link: 'https://freedom.to/', pricing: 'premium' }
    ],
    'marketing': [
        { name: 'Mailchimp Free', description: 'Free email marketing for small businesses', logo: 'https://mailchimp.com/favicon.ico', category: 'Marketing', link: 'https://mailchimp.com', pricing: 'free' },
        { name: 'Google Analytics', description: 'Free website analytics and insights', logo: 'https://analytics.google.com/favicon.ico', category: 'Marketing', link: 'https://analytics.google.com', pricing: 'free' },
        { name: 'HubSpot', description: 'Inbound marketing, sales, and CRM suite', logo: 'https://www.hubspot.com/favicon.ico', category: 'Marketing', link: 'https://www.hubspot.com/', pricing: 'freemium' },
        { name: 'Mailchimp', description: 'Email marketing and automation', logo: 'https://mailchimp.com/favicon.ico', category: 'Marketing', link: 'https://mailchimp.com/', pricing: 'freemium' },
        { name: 'Buffer', description: 'Social media management platform', logo: 'https://buffer.com/favicon.ico', category: 'Marketing', link: 'https://buffer.com/', pricing: 'freemium' },
        { name: 'Hootsuite', description: 'Social media scheduling and analytics', logo: 'https://hootsuite.com/favicon.ico', category: 'Marketing', link: 'https://hootsuite.com/', pricing: 'freemium' },
        { name: 'Canva', description: 'Design and content creation for marketing', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing', link: 'https://www.canva.com/', pricing: 'freemium' },
        { name: 'Sprout Social', description: 'Social media management and analytics', logo: 'https://sproutsocial.com/favicon.ico', category: 'Marketing', link: 'https://sproutsocial.com/', pricing: 'premium' },
        { name: 'SEMrush', description: 'SEO and online visibility management', logo: 'https://www.semrush.com/favicon.ico', category: 'Marketing', link: 'https://www.semrush.com/', pricing: 'premium' },
        { name: 'Moz', description: 'SEO software and tools', logo: 'https://moz.com/favicon.ico', category: 'Marketing', link: 'https://moz.com/', pricing: 'freemium' },
        { name: 'AdEspresso', description: 'Facebook and Instagram ads management', logo: 'https://adespresso.com/favicon.ico', category: 'Marketing', link: 'https://adespresso.com/', pricing: 'premium' },
        { name: 'Unbounce', description: 'Landing page builder for marketers', logo: 'https://unbounce.com/favicon.ico', category: 'Marketing', link: 'https://unbounce.com/', pricing: 'premium' },
        { name: 'Mailerlite', description: 'Email marketing and automation', logo: 'https://www.mailerlite.com/favicon.ico', category: 'Marketing', link: 'https://www.mailerlite.com/', pricing: 'freemium' }
    ],
    'noise-remover': [
        { name: 'Krisp', description: 'AI noise cancellation for calls', logo: 'https://krisp.ai/favicon.ico', category: 'Noise Remover', link: 'https://krisp.ai/', pricing: 'freemium' },
        { name: 'NVIDIA RTX Voice', description: 'Real-time voice noise removal', logo: 'https://www.nvidia.com/favicon.ico', category: 'Noise Remover', link: 'https://www.nvidia.com/en-us/geforce/guides/nvidia-rtx-voice-setup-guide/', pricing: 'free' },
        { name: 'Noise Blocker', description: 'Noise filtering for Windows', logo: 'https://noiseblocker.io/favicon.ico', category: 'Noise Remover', link: 'https://noiseblocker.io/', pricing: 'premium' },
        { name: 'Audo AI', description: 'AI-powered noise and sound effect enhancer', logo: 'https://audo.ai/favicon.ico', category: 'Noise Remover', link: 'https://audo.ai/', pricing: 'freemium' },
        { name: 'LALAL.AI', description: 'AI audio stem splitter and noise remover', logo: 'https://www.lalal.ai/favicon.ico', category: 'Noise Remover', link: 'https://www.lalal.ai/', pricing: 'freemium' },
        { name: 'Cleanvoice AI', description: 'Podcast noise and filler remover', logo: 'https://cleanvoice.ai/favicon.ico', category: 'Noise Remover', link: 'https://cleanvoice.ai/', pricing: 'premium' },
        { name: 'Adobe Podcast Enhance', description: 'AI-powered audio enhancement', logo: 'https://podcast.adobe.com/favicon.ico', category: 'Noise Remover', link: 'https://podcast.adobe.com/enhance', pricing: 'free' },
        { name: 'Descript Studio Sound', description: 'AI audio cleanup and noise removal', logo: 'https://www.descript.com/favicon.ico', category: 'Noise Remover', link: 'https://www.descript.com/', pricing: 'freemium' },
        { name: 'Zebracat', description: 'AI noise remover for video', logo: 'https://zebracat.com/favicon.ico', category: 'Noise Remover', link: 'https://zebracat.com/', pricing: 'premium' },
        { name: 'NoiseGator', description: 'Noise gate for voice chats', logo: 'https://sourceforge.net/p/noisegator/icon', category: 'Noise Remover', link: 'https://sourceforge.net/projects/noisegator/', pricing: 'free' },
        { name: 'SoliCall', description: 'Noise reduction for calls', logo: 'https://www.solicall.com/favicon.ico', category: 'Noise Remover', link: 'https://www.solicall.com/', pricing: 'freemium' }
    ],
    'programming': [
        { name: 'GitHub Copilot', description: 'AI pair programmer for code suggestions', logo: 'https://github.com/favicon.ico', category: 'Programming', link: 'https://github.com/features/copilot', pricing: 'premium' },
        { name: 'Tabnine', description: 'AI code completion for developers', logo: 'https://www.tabnine.com/favicon.ico', category: 'Programming', link: 'https://www.tabnine.com', pricing: 'freemium' },
        { name: 'Replit', description: 'Collaborative online IDE with AI', logo: 'https://replit.com/favicon.ico', category: 'Programming', link: 'https://replit.com/', pricing: 'freemium' },
        { name: 'Sourcegraph Cody', description: 'AI coding assistant for codebases', logo: 'https://sourcegraph.com/favicon.ico', category: 'Programming', link: 'https://sourcegraph.com/cody', pricing: 'freemium' },
        { name: 'Cursor', description: 'AI-first code editor', logo: 'https://cursor.sh/favicon.ico', category: 'Programming', link: 'https://cursor.sh', pricing: 'freemium' },
        { name: 'Codeium', description: 'AI-powered code acceleration toolkit', logo: 'https://codeium.com/favicon.ico', category: 'Programming', link: 'https://codeium.com', pricing: 'free' },
        { name: 'Amazon CodeWhisperer', description: 'AI coding companion from AWS', logo: 'https://aws.amazon.com/favicon.ico', category: 'Programming', link: 'https://aws.amazon.com/codewhisperer/', pricing: 'free' },
        { name: 'Blackbox AI', description: 'AI-powered coding assistant', logo: 'https://www.blackbox.ai/favicon.ico', category: 'Programming', link: 'https://www.blackbox.ai', pricing: 'freemium' },
        { name: 'CodiumAI', description: 'AI code integrity and test generation', logo: 'https://www.codium.ai/favicon.ico', category: 'Programming', link: 'https://www.codium.ai/', pricing: 'freemium' },
        { name: 'MutableAI', description: 'AI code completion and refactoring', logo: 'https://mutable.ai/favicon.ico', category: 'Programming', link: 'https://mutable.ai/', pricing: 'premium' },
        { name: 'Kite', description: 'AI-powered code completions', logo: 'https://www.kite.com/favicon.ico', category: 'Programming', link: 'https://www.kite.com/', pricing: 'free' }
    ],
    'supply-chain-management': [
    { name: 'OpenSC', description: 'Open-source supply chain transparency platform', logo: 'https://www.opensc.org/favicon.ico', category: 'Supply Chain Management', link: 'https://www.opensc.org/', pricing: 'free' },
    { name: 'SupplyChainBrain Free Tools', description: 'Free supply chain analysis resources', logo: 'https://www.supplychainbrain.com/favicon.ico', category: 'Supply Chain Management', link: 'https://www.supplychainbrain.com/', pricing: 'free' },
    { name: 'Llamasoft', description: 'AI-powered supply chain analytics and optimization', logo: 'https://www.llamasoft.com/favicon.ico', category: 'Supply Chain Management', link: 'https://www.llamasoft.com/', pricing: 'premium' },
        { name: 'o9 Solutions', description: 'AI platform for supply chain planning', logo: 'https://o9solutions.com/favicon.ico', category: 'Supply Chain Management', link: 'https://o9solutions.com/', pricing: 'premium' },
        { name: 'Blue Yonder', description: 'AI-driven supply chain management', logo: 'https://blueyonder.com/favicon.ico', category: 'Supply Chain Management', link: 'https://blueyonder.com/', pricing: 'premium' },
        { name: 'Kinaxis', description: 'AI supply chain planning and analytics', logo: 'https://www.kinaxis.com/favicon.ico', category: 'Supply Chain Management', link: 'https://www.kinaxis.com/', pricing: 'premium' },
        { name: 'ClearMetal', description: 'AI supply chain visibility and demand forecasting', logo: 'https://www.clearmetal.com/favicon.ico', category: 'Supply Chain Management', link: 'https://www.clearmetal.com/', pricing: 'premium' },
        { name: 'Elementum', description: 'AI-powered supply chain orchestration', logo: 'https://elementum.com/favicon.ico', category: 'Supply Chain Management', link: 'https://elementum.com/', pricing: 'premium' },
        { name: 'Infor Nexus', description: 'AI supply chain network platform', logo: 'https://www.infor.com/favicon.ico', category: 'Supply Chain Management', link: 'https://www.infor.com/solutions/scm/nexus', pricing: 'premium' },
        { name: 'E2open', description: 'AI-powered supply chain software', logo: 'https://www.e2open.com/favicon.ico', category: 'Supply Chain Management', link: 'https://www.e2open.com/', pricing: 'premium' },
        { name: 'Project44', description: 'AI supply chain visibility platform', logo: 'https://www.project44.com/favicon.ico', category: 'Supply Chain Management', link: 'https://www.project44.com/', pricing: 'premium' },
        { name: 'FourKites', description: 'AI-powered real-time supply chain visibility', logo: 'https://www.fourkites.com/favicon.ico', category: 'Supply Chain Management', link: 'https://www.fourkites.com/', pricing: 'premium' },
        { name: 'Resilinc', description: 'AI supply chain risk management', logo: 'https://www.resilinc.com/favicon.ico', category: 'Supply Chain Management', link: 'https://www.resilinc.com/', pricing: 'premium' }
    ],
    'quality-assurance': [
    { name: 'Stryker', description: 'Open-source mutation testing for JavaScript', logo: 'https://stryker-mutator.io/favicon.ico', category: 'Quality Assurance', link: 'https://stryker-mutator.io/', pricing: 'free' },
    { name: 'TestProject', description: 'Free end-to-end test automation platform', logo: 'https://testproject.io/favicon.ico', category: 'Quality Assurance', link: 'https://testproject.io/', pricing: 'free' },
    { name: 'Applitools', description: 'AI-powered visual testing and monitoring', logo: 'https://applitools.com/favicon.ico', category: 'Quality Assurance', link: 'https://applitools.com/', pricing: 'freemium' },
        { name: 'Testim', description: 'AI test automation for web apps', logo: 'https://www.testim.io/favicon.ico', category: 'Quality Assurance', link: 'https://www.testim.io/', pricing: 'premium' },
        { name: 'Functionize', description: 'AI-driven test automation platform', logo: 'https://www.functionize.com/favicon.ico', category: 'Quality Assurance', link: 'https://www.functionize.com/', pricing: 'premium' },
        { name: 'Mabl', description: 'AI-powered test automation for DevOps', logo: 'https://www.mabl.com/favicon.ico', category: 'Quality Assurance', link: 'https://www.mabl.com/', pricing: 'freemium' },
        { name: 'Test.AI', description: 'AI for mobile app testing', logo: 'https://test.ai/favicon.ico', category: 'Quality Assurance', link: 'https://test.ai/', pricing: 'premium' },
        { name: 'Sealights', description: 'AI quality intelligence platform', logo: 'https://www.sealights.io/favicon.ico', category: 'Quality Assurance', link: 'https://www.sealights.io/', pricing: 'premium' },
        { name: 'Eggplant', description: 'AI test automation and monitoring', logo: 'https://www.eggplantsoftware.com/favicon.ico', category: 'Quality Assurance', link: 'https://www.eggplantsoftware.com/', pricing: 'premium' },
        { name: 'TestCraft', description: 'AI-powered codeless test automation', logo: 'https://www.testcraft.io/favicon.ico', category: 'Quality Assurance', link: 'https://www.testcraft.io/', pricing: 'premium' },
        { name: 'Rainforest QA', description: 'AI crowdtesting and automation', logo: 'https://www.rainforestqa.com/favicon.ico', category: 'Quality Assurance', link: 'https://www.rainforestqa.com/', pricing: 'premium' },
        { name: 'Virtuoso', description: 'AI-driven test automation', logo: 'https://www.virtuoso.qa/favicon.ico', category: 'Quality Assurance', link: 'https://www.virtuoso.qa/', pricing: 'premium' },
        { name: 'TestSigma', description: 'AI-powered test automation platform', logo: 'https://testsigma.com/favicon.ico', category: 'Quality Assurance', link: 'https://testsigma.com/', pricing: 'freemium' }
    ],
      'pdf-tools': [
        { name: 'Tinywow', description: 'All-in-one PDF tools: compress, convert, edit, sign', logo: 'https://tinywow.com/favicon.ico', category: 'PDF Tools', link: 'https://tinywow.com/', pricing: 'free' },
        { name: 'ILovePDF', description: 'Merge, split, compress, convert PDFs online', logo: 'https://www.ilovepdf.com/favicon.ico', category: 'PDF Tools', link: 'https://www.ilovepdf.com/', pricing: 'freemium' },
        { name: 'PDFescape', description: 'Free online PDF editor and form filler', logo: 'https://www.pdfescape.com/favicon.ico', category: 'PDF Tools', link: 'https://www.pdfescape.com/', pricing: 'freemium' },
        { name: 'Smallpdf', description: 'All-in-one PDF tools: compress, convert, edit, sign', logo: 'https://smallpdf.com/favicon.ico', category: 'PDF Tools', link: 'https://smallpdf.com/', pricing: 'freemium' },
        { name: 'Sejda', description: 'Online PDF editor, merger, and converter', logo: 'https://www.sejda.com/favicon.ico', category: 'PDF Tools', link: 'https://www.sejda.com/', pricing: 'freemium' },
        { name: 'PDF24 Tools', description: 'Free PDF creator, converter, and editor', logo: 'https://tools.pdf24.org/favicon.ico', category: 'PDF Tools', link: 'https://tools.pdf24.org/', pricing: 'free' },
        { name: 'PDF Candy', description: 'Online PDF editor, converter, and OCR', logo: 'https://pdfcandy.com/favicon.ico', category: 'PDF Tools', link: 'https://pdfcandy.com/', pricing: 'freemium' },
        { name: 'DocHub', description: 'Edit, sign, and share PDFs online', logo: 'https://dochub.com/favicon.ico', category: 'PDF Tools', link: 'https://dochub.com/', pricing: 'freemium' },
        { name: 'PDF-XChange Editor', description: 'Feature-rich PDF editor for Windows', logo: 'https://www.tracker-software.com/favicon.ico', category: 'PDF Tools', link: 'https://www.tracker-software.com/product/pdf-xchange-editor', pricing: 'freemium' },
        { name: 'Adobe Acrobat Online', description: 'Official Adobe PDF tools online', logo: 'https://www.adobe.com/favicon.ico', category: 'PDF Tools', link: 'https://www.adobe.com/acrobat/online.html', pricing: 'premium' },
        { name: 'Soda PDF', description: 'Online PDF editor, converter, and reader', logo: 'https://www.sodapdf.com/favicon.ico', category: 'PDF Tools', link: 'https://www.sodapdf.com/', pricing: 'freemium' },
        { name: 'PDFsam', description: 'Free and open source PDF splitter and merger', logo: 'https://pdfsam.org/favicon.ico', category: 'PDF Tools', link: 'https://pdfsam.org/', pricing: 'free' }
    ],
    'compliance-and-audit': [
    { name: 'OpenRegTech', description: 'Free regulatory technology resources', logo: 'https://openreg.tech/favicon.ico', category: 'Compliance and Audit', link: 'https://openreg.tech/', pricing: 'free' },
    { name: 'Compliance.ai Free Tools', description: 'Free compliance monitoring tools', logo: 'https://compliance.ai/favicon.ico', category: 'Compliance and Audit', link: 'https://compliance.ai/', pricing: 'free' },
        { name: 'LogicGate', description: 'AI-powered risk and compliance platform', logo: 'https://www.logicgate.com/favicon.ico', category: 'Compliance and Audit', link: 'https://www.logicgate.com/', pricing: 'premium' },
        { name: 'Smartsheet Advance', description: 'AI compliance and audit management', logo: 'https://www.smartsheet.com/favicon.ico', category: 'Compliance and Audit', link: 'https://www.smartsheet.com/', pricing: 'premium' },
        { name: 'VComply', description: 'AI compliance management platform', logo: 'https://www.v-comply.com/favicon.ico', category: 'Compliance and Audit', link: 'https://www.v-comply.com/', pricing: 'premium' },
        { name: 'AuditBoard', description: 'AI-powered audit, risk, and compliance', logo: 'https://www.auditboard.com/favicon.ico', category: 'Compliance and Audit', link: 'https://www.auditboard.com/', pricing: 'premium' },
        { name: 'Onspring', description: 'AI audit and compliance automation', logo: 'https://onspring.com/favicon.ico', category: 'Compliance and Audit', link: 'https://onspring.com/', pricing: 'premium' },
        { name: 'Galvanize', description: 'AI risk and compliance management', logo: 'https://www.wegalvanize.com/favicon.ico', category: 'Compliance and Audit', link: 'https://www.wegalvanize.com/', pricing: 'premium' },
        { name: 'Smarsh', description: 'AI compliance and archiving', logo: 'https://www.smarsh.com/favicon.ico', category: 'Compliance and Audit', link: 'https://www.smarsh.com/', pricing: 'premium' },
        { name: 'ComplyAdvantage', description: 'AI financial crime compliance', logo: 'https://complyadvantage.com/favicon.ico', category: 'Compliance and Audit', link: 'https://complyadvantage.com/', pricing: 'premium' },
        { name: 'Alyne', description: 'AI-powered risk and compliance platform', logo: 'https://www.alyne.com/favicon.ico', category: 'Compliance and Audit', link: 'https://www.alyne.com/', pricing: 'premium' },
        { name: 'ClauseMatch', description: 'AI policy and compliance management', logo: 'https://www.clausematch.com/favicon.ico', category: 'Compliance and Audit', link: 'https://www.clausematch.com/', pricing: 'premium' },
        { name: 'Wolters Kluwer TeamMate', description: 'AI audit management software', logo: 'https://www.wolterskluwer.com/favicon.ico', category: 'Compliance and Audit', link: 'https://www.wolterskluwer.com/en/solutions/teammate', pricing: 'premium' }
    ],
    'risk-management': [
    { name: 'OpenRisk', description: 'Open-source risk analytics platform', logo: 'https://openriskmanual.org/favicon.ico', category: 'Risk Management', link: 'https://www.openriskmanual.org/', pricing: 'free' },
    { name: 'RiskTools', description: 'Free risk management calculators', logo: 'https://www.risktools.com/favicon.ico', category: 'Risk Management', link: 'https://www.risktools.com/', pricing: 'free' },
        { name: 'LogicManager', description: 'AI-powered risk management software', logo: 'https://www.logicmanager.com/favicon.ico', category: 'Risk Management', link: 'https://www.logicmanager.com/', pricing: 'premium' },
        { name: 'Riskified', description: 'AI fraud prevention and risk management', logo: 'https://www.riskified.com/favicon.ico', category: 'Risk Management', link: 'https://www.riskified.com/', pricing: 'premium' },
        { name: 'Resolver', description: 'AI risk and incident management', logo: 'https://www.resolver.com/favicon.ico', category: 'Risk Management', link: 'https://www.resolver.com/', pricing: 'premium' },
        { name: 'MetricStream', description: 'AI governance, risk, and compliance', logo: 'https://www.metricstream.com/favicon.ico', category: 'Risk Management', link: 'https://www.metricstream.com/', pricing: 'premium' },
        { name: 'RiskWatch', description: 'AI risk assessment and compliance', logo: 'https://riskwatch.com/favicon.ico', category: 'Risk Management', link: 'https://riskwatch.com/', pricing: 'premium' },
        { name: 'Fusion Risk Management', description: 'AI-powered risk and resilience platform', logo: 'https://www.fusionrm.com/favicon.ico', category: 'Risk Management', link: 'https://www.fusionrm.com/', pricing: 'premium' },
        { name: 'LogicGate', description: 'AI risk and compliance automation', logo: 'https://www.logicgate.com/favicon.ico', category: 'Risk Management', link: 'https://www.logicgate.com/', pricing: 'premium' },
        { name: 'RiskLens', description: 'AI cyber risk quantification', logo: 'https://www.risklens.com/favicon.ico', category: 'Risk Management', link: 'https://www.risklens.com/', pricing: 'premium' },
        { name: 'Acuity Risk Management', description: 'AI risk management and analytics', logo: 'https://acuityrm.com/favicon.ico', category: 'Risk Management', link: 'https://acuityrm.com/', pricing: 'premium' },
        { name: 'Protecht', description: 'AI enterprise risk management', logo: 'https://www.protechtgroup.com/favicon.ico', category: 'Risk Management', link: 'https://www.protechtgroup.com/', pricing: 'premium' },
        { name: 'Riskonnect', description: 'AI risk management platform', logo: 'https://riskonnect.com/favicon.ico', category: 'Risk Management', link: 'https://riskonnect.com/', pricing: 'premium' }
    ],

    // New categories
    'quantum-computing': [
        { name: 'IBM Quantum', description: 'Quantum computing cloud platform', logo: 'https://quantum-computing.ibm.com/favicon.ico', category: 'Quantum Computing', link: 'https://quantum-computing.ibm.com/', pricing: 'freemium' },
        { name: 'Microsoft Azure Quantum', description: 'Quantum computing on Azure', logo: 'https://azure.microsoft.com/favicon.ico', category: 'Quantum Computing', link: 'https://azure.microsoft.com/en-us/services/quantum/', pricing: 'freemium' },
        { name: 'D-Wave Leap', description: 'Quantum cloud service', logo: 'https://cloud.dwavesys.com/favicon.ico', category: 'Quantum Computing', link: 'https://cloud.dwavesys.com/leap/', pricing: 'freemium' },
        { name: 'Google Quantum AI', description: 'Quantum computing research tools', logo: 'https://quantumai.google/favicon.ico', category: 'Quantum Computing', link: 'https://quantumai.google/', pricing: 'free' },
        { name: 'Rigetti Forest', description: 'Quantum programming toolkit', logo: 'https://www.rigetti.com/favicon.ico', category: 'Quantum Computing', link: 'https://www.rigetti.com/forest', pricing: 'freemium' },
        { name: 'QuTech', description: 'Quantum internet and computing', logo: 'https://qutech.nl/favicon.ico', category: 'Quantum Computing', link: 'https://qutech.nl/', pricing: 'free' },
        { name: 'IonQ Cloud', description: 'Trapped-ion quantum computing', logo: 'https://ionq.com/favicon.ico', category: 'Quantum Computing', link: 'https://ionq.com/', pricing: 'freemium' },
        { name: 'Strangeworks', description: 'Quantum computing platform', logo: 'https://strangeworks.com/favicon.ico', category: 'Quantum Computing', link: 'https://strangeworks.com/', pricing: 'freemium' },
        { name: 'Classiq', description: 'Quantum algorithm design', logo: 'https://classiq.io/favicon.ico', category: 'Quantum Computing', link: 'https://classiq.io/', pricing: 'freemium' },
        { name: 'QC Ware', description: 'Quantum software and algorithms', logo: 'https://qcware.com/favicon.ico', category: 'Quantum Computing', link: 'https://qcware.com/', pricing: 'premium' },
        { name: 'QuEra', description: 'Neutral atom quantum computing', logo: 'https://www.quera.com/favicon.ico', category: 'Quantum Computing', link: 'https://www.quera.com/', pricing: 'premium' }
    ],
    'augmented-reality': [
        { name: 'ZapWorks', description: 'AR content creation platform', logo: 'https://zap.works/favicon.ico', category: 'Augmented Reality', link: 'https://zap.works/', pricing: 'freemium' },
        { name: '8th Wall', description: 'Web-based AR development', logo: 'https://www.8thwall.com/favicon.ico', category: 'Augmented Reality', link: 'https://www.8thwall.com/', pricing: 'premium' },
        { name: 'ARKit', description: 'Apple AR development framework', logo: 'https://developer.apple.com/favicon.ico', category: 'Augmented Reality', link: 'https://developer.apple.com/augmented-reality/arkit/', pricing: 'free' },
        { name: 'ARCore', description: 'Google AR development platform', logo: 'https://developers.google.com/favicon.ico', category: 'Augmented Reality', link: 'https://developers.google.com/ar', pricing: 'free' },
        { name: 'Vuforia', description: 'AR SDK for mobile apps', logo: 'https://developer.vuforia.com/favicon.ico', category: 'Augmented Reality', link: 'https://developer.vuforia.com/', pricing: 'freemium' },
        { name: 'Wikitude', description: 'AR SDK and cloud recognition', logo: 'https://www.wikitude.com/favicon.ico', category: 'Augmented Reality', link: 'https://www.wikitude.com/', pricing: 'freemium' },
        { name: 'Blippar', description: 'AR creation and publishing', logo: 'https://www.blippar.com/favicon.ico', category: 'Augmented Reality', link: 'https://www.blippar.com/', pricing: 'freemium' },
        { name: 'Spark AR Studio', description: 'Meta AR effects platform', logo: 'https://sparkar.facebook.com/favicon.ico', category: 'Augmented Reality', link: 'https://sparkar.facebook.com/', pricing: 'free' },
        { name: 'Banuba', description: 'AR face filters and effects', logo: 'https://www.banuba.com/favicon.ico', category: 'Augmented Reality', link: 'https://www.banuba.com/', pricing: 'freemium' },
        { name: 'EasyAR', description: 'AR development platform', logo: 'https://www.easyar.com/favicon.ico', category: 'Augmented Reality', link: 'https://www.easyar.com/', pricing: 'freemium' },
        { name: 'DeepAR', description: 'AI-powered AR SDK', logo: 'https://www.deepar.ai/favicon.ico', category: 'Augmented Reality', link: 'https://www.deepar.ai/', pricing: 'freemium' }
    ],
    'virtual-reality': [
        { name: 'Unity VR', description: 'VR development with Unity', logo: 'https://unity.com/favicon.ico', category: 'Virtual Reality', link: 'https://unity.com/solutions/vr', pricing: 'freemium' },
        { name: 'Unreal Engine VR', description: 'VR development with Unreal Engine', logo: 'https://www.unrealengine.com/favicon.ico', category: 'Virtual Reality', link: 'https://www.unrealengine.com/en-US/solutions/vr', pricing: 'free' },
        { name: 'Oculus', description: 'Meta VR platform and tools', logo: 'https://www.meta.com/favicon.ico', category: 'Virtual Reality', link: 'https://www.meta.com/quest/', pricing: 'premium' },
        { name: 'SteamVR', description: 'VR platform for PC', logo: 'https://store.steampowered.com/favicon.ico', category: 'Virtual Reality', link: 'https://store.steampowered.com/steamvr', pricing: 'freemium' },
        { name: 'Viveport', description: 'HTC VR app store and platform', logo: 'https://www.viveport.com/favicon.ico', category: 'Virtual Reality', link: 'https://www.viveport.com/', pricing: 'freemium' },
        { name: 'Mozilla Hubs', description: 'Open-source VR collaboration', logo: 'https://hubs.mozilla.com/favicon.ico', category: 'Virtual Reality', link: 'https://hubs.mozilla.com/', pricing: 'free' },
        { name: 'Varjo', description: 'Professional VR/XR headsets', logo: 'https://varjo.com/favicon.ico', category: 'Virtual Reality', link: 'https://varjo.com/', pricing: 'premium' },
        { name: 'Pico VR', description: 'Standalone VR headsets and platform', logo: 'https://www.picoxr.com/favicon.ico', category: 'Virtual Reality', link: 'https://www.picoxr.com/global/', pricing: 'premium' },
        { name: 'InstaVR', description: 'VR app creation platform', logo: 'https://www.instavr.co/favicon.ico', category: 'Virtual Reality', link: 'https://www.instavr.co/', pricing: 'freemium' },
        { name: 'Mindshow', description: 'VR animation and storytelling', logo: 'https://www.mindshow.com/favicon.ico', category: 'Virtual Reality', link: 'https://www.mindshow.com/', pricing: 'freemium' },
        { name: 'EON Reality', description: 'VR/AR knowledge transfer platform', logo: 'https://www.eonreality.com/favicon.ico', category: 'Virtual Reality', link: 'https://www.eonreality.com/', pricing: 'premium' }
    ],
    'metaverse-tools': [
        { name: 'Roblox Studio', description: 'Create and publish metaverse experiences', logo: 'https://www.roblox.com/favicon.ico', category: 'Metaverse Tools', link: 'https://www.roblox.com/create', pricing: 'free' },
        { name: 'Decentraland', description: 'Virtual world and metaverse platform', logo: 'https://decentraland.org/favicon.ico', category: 'Metaverse Tools', link: 'https://decentraland.org/', pricing: 'free' },
        { name: 'Sandbox', description: 'User-generated metaverse platform', logo: 'https://www.sandbox.game/favicon.ico', category: 'Metaverse Tools', link: 'https://www.sandbox.game/', pricing: 'free' },
        { name: 'Spatial', description: 'Collaborative metaverse platform', logo: 'https://www.spatial.io/favicon.ico', category: 'Metaverse Tools', link: 'https://www.spatial.io/', pricing: 'freemium' },
        { name: 'Somnium Space', description: 'Virtual reality metaverse', logo: 'https://somniumspace.com/favicon.ico', category: 'Metaverse Tools', link: 'https://somniumspace.com/', pricing: 'freemium' },
        { name: 'FrameVR', description: 'Web-based metaverse platform', logo: 'https://framevr.io/favicon.ico', category: 'Metaverse Tools', link: 'https://framevr.io/', pricing: 'freemium' },
        { name: 'Mozilla Hubs', description: 'Open-source metaverse collaboration', logo: 'https://hubs.mozilla.com/favicon.ico', category: 'Metaverse Tools', link: 'https://hubs.mozilla.com/', pricing: 'free' },
        { name: 'Upland', description: 'Virtual property trading metaverse', logo: 'https://www.upland.me/favicon.ico', category: 'Metaverse Tools', link: 'https://www.upland.me/', pricing: 'freemium' },
        { name: 'Viverse', description: 'HTC metaverse platform', logo: 'https://www.vive.com/favicon.ico', category: 'Metaverse Tools', link: 'https://www.vive.com/eu/viverse/', pricing: 'free' },
        { name: 'OpenSea', description: 'NFT marketplace for metaverse assets', logo: 'https://opensea.io/favicon.ico', category: 'Metaverse Tools', link: 'https://opensea.io/', pricing: 'freemium' },
        { name: 'Ready Player Me', description: 'Cross-platform avatar creator', logo: 'https://readyplayer.me/favicon.ico', category: 'Metaverse Tools', link: 'https://readyplayer.me/', pricing: 'free' }
    ],
    'web-blockchain-integration': [
        { name: 'Moralis', description: 'Web3 backend infrastructure', logo: 'https://moralis.io/favicon.ico', category: 'Web/Blockchain Integration', link: 'https://moralis.io/', pricing: 'freemium' },
        { name: 'Alchemy', description: 'Blockchain developer platform', logo: 'https://www.alchemy.com/favicon.ico', category: 'Web/Blockchain Integration', link: 'https://www.alchemy.com/', pricing: 'freemium' },
        { name: 'Infura', description: 'Ethereum and IPFS API', logo: 'https://infura.io/favicon.ico', category: 'Web/Blockchain Integration', link: 'https://infura.io/', pricing: 'freemium' },
        { name: 'Chainlink', description: 'Decentralized oracle network', logo: 'https://chain.link/favicon.ico', category: 'Web/Blockchain Integration', link: 'https://chain.link/', pricing: 'free' },
        { name: 'Thirdweb', description: 'Web3 development toolkit', logo: 'https://thirdweb.com/favicon.ico', category: 'Web/Blockchain Integration', link: 'https://thirdweb.com/', pricing: 'freemium' },
        { name: 'WalletConnect', description: 'Web3 wallet connection protocol', logo: 'https://walletconnect.com/favicon.ico', category: 'Web/Blockchain Integration', link: 'https://walletconnect.com/', pricing: 'free' },
        { name: 'QuickNode', description: 'Blockchain API and infrastructure', logo: 'https://www.quicknode.com/favicon.ico', category: 'Web/Blockchain Integration', link: 'https://www.quicknode.com/', pricing: 'freemium' },
        { name: 'Web3.js', description: 'Ethereum JavaScript API', logo: 'https://web3js.readthedocs.io/en/v1.2.11/_static/favicon.ico', category: 'Web/Blockchain Integration', link: 'https://web3js.readthedocs.io/', pricing: 'free' },
        { name: 'Ethers.js', description: 'Ethereum JavaScript library', logo: 'https://docs.ethers.org/v5/favicon.ico', category: 'Web/Blockchain Integration', link: 'https://docs.ethers.org/v5/', pricing: 'free' },
        { name: 'OpenZeppelin', description: 'Smart contract development tools', logo: 'https://openzeppelin.com/favicon.ico', category: 'Web/Blockchain Integration', link: 'https://openzeppelin.com/', pricing: 'free' },
        { name: 'Hardhat', description: 'Ethereum development environment', logo: 'https://hardhat.org/favicon.ico', category: 'Web/Blockchain Integration', link: 'https://hardhat.org/', pricing: 'free' }
    ],
    'storyboarding': [
        { name: 'Storyboard That', description: 'AI-powered storyboarding tool', logo: 'https://www.storyboardthat.com/favicon.ico', category: 'Storyboarding', link: 'https://www.storyboardthat.com/', pricing: 'freemium' },
        { name: 'Boords', description: 'AI storyboard creator for teams', logo: 'https://boords.com/favicon.ico', category: 'Storyboarding', link: 'https://boords.com/', pricing: 'freemium' },
        { name: 'FrameForge', description: 'AI-assisted storyboarding software', logo: 'https://www.frameforge.com/favicon.ico', category: 'Storyboarding', link: 'https://www.frameforge.com/', pricing: 'premium' },
        { name: 'Plot', description: 'AI storyboard and script tool', logo: 'https://www.plot.io/favicon.ico', category: 'Storyboarding', link: 'https://www.plot.io/', pricing: 'freemium' },
        { name: 'Canva Storyboard', description: 'Storyboard with AI design tools', logo: 'https://www.canva.com/favicon.ico', category: 'Storyboarding', link: 'https://www.canva.com/', pricing: 'freemium' },
        { name: 'MakeStoryboard', description: 'AI storyboard creator', logo: 'https://makestoryboard.com/favicon.ico', category: 'Storyboarding', link: 'https://makestoryboard.com/', pricing: 'freemium' },
        { name: 'StudioBinder', description: 'AI-powered production and storyboarding', logo: 'https://www.studiobinder.com/favicon.ico', category: 'Storyboarding', link: 'https://www.studiobinder.com/', pricing: 'freemium' },
        { name: 'Wonder Unit', description: 'AI storyboard generator', logo: 'https://wonderunit.com/favicon.ico', category: 'Storyboarding', link: 'https://wonderunit.com/', pricing: 'freemium' },
        { name: 'Storyboarder', description: 'Open-source AI storyboarding tool', logo: 'https://wonderunit.com/storyboarder/favicon.ico', category: 'Storyboarding', link: 'https://wonderunit.com/storyboarder/', pricing: 'free' },
        { name: 'Shotdeck', description: 'AI-powered visual storyboarding', logo: 'https://shotdeck.com/favicon.ico', category: 'Storyboarding', link: 'https://shotdeck.com/', pricing: 'premium' },
        { name: 'Previs Pro', description: 'AI previsualization and storyboarding', logo: 'https://previspro.com/favicon.ico', category: 'Storyboarding', link: 'https://previspro.com/', pricing: 'premium' }
    ],
    'sound-effects': [
        { name: 'Freesound', description: 'Free collaborative sound library', logo: 'https://freesound.org/favicon.ico', category: 'Sound Effects', link: 'https://freesound.org/', pricing: 'free' },
        { name: 'BBC Sound Effects', description: 'Free sound effects library', logo: 'https://sound-effects.bbcrewind.co.uk/favicon.ico', category: 'Sound Effects', link: 'https://sound-effects.bbcrewind.co.uk/', pricing: 'free' },
        { name: 'AIVA SFX', description: 'AI-generated sound effects', logo: 'https://www.aiva.ai/favicon.ico', category: 'Sound Effects', link: 'https://www.aiva.ai/', pricing: 'freemium' },
        { name: 'Boom Library', description: 'AI sound design and effects', logo: 'https://www.boomlibrary.com/favicon.ico', category: 'Sound Effects', link: 'https://www.boomlibrary.com/', pricing: 'premium' },
        { name: 'Soundly', description: 'AI sound effects search and creation', logo: 'https://getsoundly.com/favicon.ico', category: 'Sound Effects', link: 'https://getsoundly.com/', pricing: 'freemium' },
        { name: 'LANDR FX', description: 'AI-powered sound effects', logo: 'https://www.landr.com/favicon.ico', category: 'Sound Effects', link: 'https://www.landr.com/', pricing: 'freemium' },
        { name: 'Endlesss', description: 'AI collaborative sound creation', logo: 'https://endlesss.fm/favicon.ico', category: 'Sound Effects', link: 'https://endlesss.fm/', pricing: 'freemium' },
        { name: 'Audio Design Desk', description: 'AI sound design and effects', logo: 'https://add.app/favicon.ico', category: 'Sound Effects', link: 'https://add.app/', pricing: 'premium' },
        { name: 'Ecrett Music FX', description: 'AI sound effects generator', logo: 'https://ecrettmusic.com/favicon.ico', category: 'Sound Effects', link: 'https://ecrettmusic.com/', pricing: 'freemium' },
        { name: 'Zapsplat AI', description: 'AI sound effects library', logo: 'https://www.zapsplat.com/favicon.ico', category: 'Sound Effects', link: 'https://www.zapsplat.com/', pricing: 'freemium' },
        { name: 'Resemble AI FX', description: 'AI voice and sound effects', logo: 'https://www.resemble.ai/favicon.ico', category: 'Sound Effects', link: 'https://www.resemble.ai/', pricing: 'freemium' },
        { name: 'Sonify', description: 'AI sound and music generator', logo: 'https://sonify.io/favicon.ico', category: 'Sound Effects', link: 'https://sonify.io/', pricing: 'freemium' },
        { name: 'Audo AI', description: 'AI noise and sound effect enhancer', logo: 'https://audo.ai/favicon.ico', category: 'Sound Effects', link: 'https://audo.ai/', pricing: 'freemium' }
    ],
    'ai-mining': [
        { name: 'OpenMining', description: 'Open-source mining analytics', logo: 'https://openmining.io/favicon.ico', category: 'AI Mining', link: 'https://openmining.io/', pricing: 'free' },
        { name: 'Mining Toolkit', description: 'Free mining data and AI tools', logo: 'https://miningtoolkit.org/favicon.ico', category: 'AI Mining', link: 'https://miningtoolkit.org/', pricing: 'free' },
        { name: 'MineSense', description: 'AI ore data analytics for mining', logo: 'https://minesense.com/favicon.ico', category: 'AI Mining', link: 'https://minesense.com/', pricing: 'premium' },
        { name: 'Petra Data Science', description: 'AI for mining optimization', logo: 'https://www.petradatascience.com/favicon.ico', category: 'AI Mining', link: 'https://www.petradatascience.com/', pricing: 'premium' },
        { name: 'Exyn Technologies', description: 'AI mining robotics and automation', logo: 'https://www.exyn.com/favicon.ico', category: 'AI Mining', link: 'https://www.exyn.com/', pricing: 'premium' },
        { name: 'Goldspot Discoveries', description: 'AI mineral exploration', logo: 'https://www.goldspot.ca/favicon.ico', category: 'AI Mining', link: 'https://www.goldspot.ca/', pricing: 'premium' },
        { name: 'Datarock', description: 'AI core logging for mining', logo: 'https://datarock.com/favicon.ico', category: 'AI Mining', link: 'https://datarock.com/', pricing: 'premium' },
        { name: 'EnviroSuite', description: 'AI environmental management for mining', logo: 'https://envirosuite.com/favicon.ico', category: 'AI Mining', link: 'https://envirosuite.com/', pricing: 'premium' },
        { name: 'MineHub', description: 'AI supply chain for mining', logo: 'https://www.minehub.com/favicon.ico', category: 'AI Mining', link: 'https://www.minehub.com/', pricing: 'premium' },
        { name: 'Hexagon Mining', description: 'AI mining operations platform', logo: 'https://hexagonmining.com/favicon.ico', category: 'AI Mining', link: 'https://hexagonmining.com/', pricing: 'premium' },
        { name: 'Seequent', description: 'AI geoscience for mining', logo: 'https://www.seequent.com/favicon.ico', category: 'AI Mining', link: 'https://www.seequent.com/', pricing: 'premium' },
        { name: 'RPMGlobal', description: 'AI mining software and analytics', logo: 'https://www.rpmglobal.com/favicon.ico', category: 'AI Mining', link: 'https://www.rpmglobal.com/', pricing: 'premium' },
        { name: 'Imago', description: 'AI imagery for mining operations', logo: 'https://www.imago.live/favicon.ico', category: 'AI Mining', link: 'https://www.imago.live/', pricing: 'premium' }
    ],
    'telecommunications': [
        { name: 'OpenCellID', description: 'Open-source cell tower data', logo: 'https://www.opencellid.org/favicon.ico', category: 'Telecommunications', link: 'https://www.opencellid.org/', pricing: 'free' },
        { name: 'OpenSignal', description: 'Free mobile network analytics', logo: 'https://www.opensignal.com/favicon.ico', category: 'Telecommunications', link: 'https://www.opensignal.com/', pricing: 'free' },
        { name: 'Aria Networks', description: 'AI network optimization for telecom', logo: 'https://www.aria-networks.com/favicon.ico', category: 'Telecommunications', link: 'https://www.aria-networks.com/', pricing: 'premium' },
        { name: 'Nokia AVA', description: 'AI-powered telecom analytics', logo: 'https://www.nokia.com/favicon.ico', category: 'Telecommunications', link: 'https://www.nokia.com/networks/solutions/ava/', pricing: 'premium' },
        { name: 'Ericsson AI', description: 'AI for telecom network management', logo: 'https://www.ericsson.com/favicon.ico', category: 'Telecommunications', link: 'https://www.ericsson.com/en/artificial-intelligence', pricing: 'premium' },
        { name: 'Huawei iMaster', description: 'AI telecom network automation', logo: 'https://www.huawei.com/favicon.ico', category: 'Telecommunications', link: 'https://e.huawei.com/en/solutions/enterprise-networks/ai-network', pricing: 'premium' },
        { name: 'Amdocs amAIz', description: 'AI telecom customer experience', logo: 'https://www.amdocs.com/favicon.ico', category: 'Telecommunications', link: 'https://www.amdocs.com/', pricing: 'premium' },
        { name: 'Netcracker AI', description: 'AI operations for telecom', logo: 'https://www.netcracker.com/favicon.ico', category: 'Telecommunications', link: 'https://www.netcracker.com/', pricing: 'premium' },
        { name: 'Subex AI', description: 'AI fraud management for telecom', logo: 'https://www.subex.com/favicon.ico', category: 'Telecommunications', link: 'https://www.subex.com/', pricing: 'premium' },
        { name: 'Ciena Blue Planet', description: 'AI network automation', logo: 'https://www.ciena.com/favicon.ico', category: 'Telecommunications', link: 'https://www.ciena.com/solutions/blueplanet/', pricing: 'premium' },
        { name: 'Rakuten AI', description: 'AI telecom network operations', logo: 'https://global.rakuten.com/favicon.ico', category: 'Telecommunications', link: 'https://global.rakuten.com/corp/innovation/rakutenai/', pricing: 'premium' },
        { name: 'Taranis', description: 'AI telecom network analytics', logo: 'https://www.taranis.com/favicon.ico', category: 'Telecommunications', link: 'https://www.taranis.com/', pricing: 'premium' },
        { name: 'Optiva AI', description: 'AI-powered telecom monetization', logo: 'https://optiva.com/favicon.ico', category: 'Telecommunications', link: 'https://optiva.com/', pricing: 'premium' }
    ],
    'aerospace': [
    { name: 'NASA Open Data', description: 'Free aerospace datasets and AI models', logo: 'https://data.nasa.gov/favicon.ico', category: 'Aerospace', link: 'https://data.nasa.gov/', pricing: 'free' },
    { name: 'OpenAeroStruct', description: 'Open-source aerospace design tool', logo: 'https://openmdao.org/favicon.ico', category: 'Aerospace', link: 'https://openmdao.org/', pricing: 'free' },
        { name: 'SparkCognition', description: 'AI for aerospace asset management', logo: 'https://www.sparkcognition.com/favicon.ico', category: 'Aerospace', link: 'https://www.sparkcognition.com/', pricing: 'premium' },
        { name: 'Airbus Skywise', description: 'AI aviation analytics platform', logo: 'https://www.airbus.com/favicon.ico', category: 'Aerospace', link: 'https://airbus.com/innovation/skywise.html', pricing: 'premium' },
        { name: 'GE Aviation Digital', description: 'AI for aerospace operations', logo: 'https://www.geaviation.com/favicon.ico', category: 'Aerospace', link: 'https://www.geaviation.com/digital', pricing: 'premium' },
        { name: 'Honeywell Forge', description: 'AI aerospace analytics', logo: 'https://www.honeywell.com/favicon.ico', category: 'Aerospace', link: 'https://www.honeywell.com/us/en/forge/aerospace', pricing: 'premium' },
        { name: 'Palantir Foundry', description: 'AI data platform for aerospace', logo: 'https://www.palantir.com/favicon.ico', category: 'Aerospace', link: 'https://www.palantir.com/solutions/aerospace-defense/', pricing: 'premium' },
        { name: 'SatSure', description: 'AI satellite analytics', logo: 'https://satsure.co/favicon.ico', category: 'Aerospace', link: 'https://satsure.co/', pricing: 'premium' },
        { name: 'Orbital Insight', description: 'AI geospatial analytics', logo: 'https://orbitalinsight.com/favicon.ico', category: 'Aerospace', link: 'https://orbitalinsight.com/', pricing: 'premium' },
        { name: 'Spire', description: 'AI-powered satellite data', logo: 'https://spire.com/favicon.ico', category: 'Aerospace', link: 'https://spire.com/', pricing: 'premium' },
        { name: 'Descartes Labs', description: 'AI satellite imagery analytics', logo: 'https://descarteslabs.com/favicon.ico', category: 'Aerospace', link: 'https://descarteslabs.com/', pricing: 'premium' },
        { name: 'SkyWatch', description: 'AI satellite data platform', logo: 'https://skywatch.com/favicon.ico', category: 'Aerospace', link: 'https://skywatch.com/', pricing: 'premium' },
        { name: 'Satellogic', description: 'AI earth observation platform', logo: 'https://satellogic.com/favicon.ico', category: 'Aerospace', link: 'https://satellogic.com/', pricing: 'premium' }
    ],
    'maritime': [
    { name: 'MarineTraffic Free', description: 'Free vessel tracking and analytics', logo: 'https://www.marinetraffic.com/favicon.ico', category: 'Maritime', link: 'https://www.marinetraffic.com/', pricing: 'free' },
    { name: 'Global Fishing Watch', description: 'Open ocean monitoring platform', logo: 'https://globalfishingwatch.org/favicon.ico', category: 'Maritime', link: 'https://globalfishingwatch.org/', pricing: 'free' },
        { name: 'Windward', description: 'AI maritime risk analytics', logo: 'https://wnwd.com/favicon.ico', category: 'Maritime', link: 'https://wnwd.com/', pricing: 'premium' },
        { name: 'MarineTraffic AI', description: 'AI-powered vessel tracking', logo: 'https://www.marinetraffic.com/favicon.ico', category: 'Maritime', link: 'https://www.marinetraffic.com/', pricing: 'freemium' },
        { name: 'Spire Maritime', description: 'AI satellite data for shipping', logo: 'https://spire.com/favicon.ico', category: 'Maritime', link: 'https://spire.com/maritime/', pricing: 'premium' },
        { name: 'Nautilus Labs', description: 'AI-powered maritime analytics', logo: 'https://nautiluslabs.com/favicon.ico', category: 'Maritime', link: 'https://nautiluslabs.com/', pricing: 'premium' },
        { name: 'OrbitMI', description: 'AI maritime operations platform', logo: 'https://www.orbitmi.com/favicon.ico', category: 'Maritime', link: 'https://www.orbitmi.com/', pricing: 'premium' },
        { name: 'RightShip', description: 'AI vessel vetting and risk', logo: 'https://www.rightship.com/favicon.ico', category: 'Maritime', link: 'https://www.rightship.com/', pricing: 'premium' },
        { name: 'Marine AI', description: 'AI for marine navigation', logo: 'https://marineai.co.uk/favicon.ico', category: 'Maritime', link: 'https://marineai.co.uk/', pricing: 'premium' },
        { name: 'BunkerMetric', description: 'AI bunker procurement for shipping', logo: 'https://bunkermetric.com/favicon.ico', category: 'Maritime', link: 'https://bunkermetric.com/', pricing: 'premium' },
        { name: 'PortXchange', description: 'AI port call optimization', logo: 'https://port-xchange.com/favicon.ico', category: 'Maritime', link: 'https://port-xchange.com/', pricing: 'premium' },
        { name: 'ShipIn Systems', description: 'AI-powered maritime fleet management', logo: 'https://shipin.ai/favicon.ico', category: 'Maritime', link: 'https://shipin.ai/', pricing: 'premium' },
        { name: 'HiLo Maritime Risk Management', description: 'AI maritime risk analytics', logo: 'https://www.hilomrm.com/favicon.ico', category: 'Maritime', link: 'https://www.hilomrm.com/', pricing: 'premium' }
    ],
    // 'waste-management': [
    //     { name: 'Rubicon', description: 'AI-powered waste and recycling solutions', logo: 'https://www.rubicon.com/favicon.ico', category: 'Waste Management', link: 'https://www.rubicon.com/' },
    //     { name: 'AMP Robotics', description: 'AI recycling robots', logo: 'https://www.amprobotics.com/favicon.ico', category: 'Waste Management', link: 'https://www.amprobotics.com/' },
    //     { name: 'Waste Robotics', description: 'AI waste sorting robots', logo: 'https://wasterobotic.com/favicon.ico', category: 'Waste Management', link: 'https://wasterobotic.com/' },
    //     { name: 'Enevo', description: 'AI waste analytics and logistics', logo: 'https://www.enevo.com/favicon.ico', category: 'Waste Management', link: 'https://www.enevo.com/' },
    //     { name: 'Greyparrot', description: 'AI waste recognition and analytics', logo: 'https://www.greyparrot.ai/favicon.ico', category: 'Waste Management', link: 'https://www.greyparrot.ai/' },
    //     { name: 'Recycleye', description: 'AI-powered waste sorting', logo: 'https://www.recycleye.com/favicon.ico', category: 'Waste Management', link: 'https://www.recycleye.com/' },
    //     { name: 'Bin-e', description: 'AI smart waste bin', logo: 'https://bine.world/favicon.ico', category: 'Waste Management', link: 'https://bine.world/' },
    //     { name: 'SmartBin', description: 'AI waste bin monitoring', logo: 'https://www.smartbin.com/favicon.ico', category: 'Waste Management', link: 'https://www.smartbin.com/' },
    //     { name: 'Bigbelly', description: 'AI smart waste and recycling', logo: 'https://bigbelly.com/favicon.ico', category: 'Waste Management', link: 'https://bigbelly.com/' },
    //     { name: 'Sensoneo', description: 'AI waste management solutions', logo: 'https://www.sensoneo.com/favicon.ico', category: 'Waste Management', link: 'https://www.sensoneo.com/' },
    //     { name: 'Compology', description: 'AI waste container monitoring', logo: 'https://compology.com/favicon.ico', category: 'Waste Management', link: 'https://compology.com/' }
    // ],

    'ai-pet-care': [
        { name: 'PetDesk', description: 'Free pet health reminders and records', logo: 'https://www.petdesk.com/favicon.ico', category: 'AI Pet Care', link: 'https://www.petdesk.com/', pricing: 'free' },
        { name: 'Pet First Aid', description: 'Free AI pet care guidance app', logo: 'https://www.redcross.org/favicon.ico', category: 'AI Pet Care', link: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/mobile-apps.html', pricing: 'free' },
        { name: 'Pawscout', description: 'AI pet tracking and safety', logo: 'https://www.pawscout.com/favicon.ico', category: 'AI Pet Care', link: 'https://www.pawscout.com/', pricing: 'freemium' },
        { name: 'Petcube', description: 'AI pet camera and treat dispenser', logo: 'https://petcube.com/favicon.ico', category: 'AI Pet Care', link: 'https://petcube.com/', pricing: 'premium' },
        { name: 'Whistle', description: 'AI pet health and GPS tracker', logo: 'https://www.whistle.com/favicon.ico', category: 'AI Pet Care', link: 'https://www.whistle.com/', pricing: 'premium' },
        { name: 'BabelBark', description: 'AI pet health and wellness platform', logo: 'https://www.babelbark.com/favicon.ico', category: 'AI Pet Care', link: 'https://www.babelbark.com/', pricing: 'freemium' },
        { name: 'Felcana', description: 'AI pet health monitoring', logo: 'https://www.felcana.com/favicon.ico', category: 'AI Pet Care', link: 'https://www.felcana.com/', pricing: 'premium' },
        { name: 'Petnet', description: 'AI smart feeder for pets', logo: 'https://www.petnet.io/favicon.ico', category: 'AI Pet Care', link: 'https://www.petnet.io/', pricing: 'premium' },
        { name: 'Sure Petcare', description: 'AI pet doors and feeders', logo: 'https://www.surepetcare.com/favicon.ico', category: 'AI Pet Care', link: 'https://www.surepetcare.com/', pricing: 'premium' },
        { name: 'Dogness', description: 'AI pet robots and cameras', logo: 'https://www.dogness.com/favicon.ico', category: 'AI Pet Care', link: 'https://www.dogness.com/', pricing: 'premium' },
        { name: 'Tractive', description: 'AI GPS tracking for pets', logo: 'https://tractive.com/favicon.ico', category: 'AI Pet Care', link: 'https://tractive.com/', pricing: 'freemium' },
        { name: 'Vetrax', description: 'AI pet activity and health monitor', logo: 'https://www.vetrax.com/favicon.ico', category: 'AI Pet Care', link: 'https://www.vetrax.com/', pricing: 'premium' }
    ],
    'ai-podcasting': [
        { name: 'Anchor', description: 'Free podcast hosting and distribution by Spotify', logo: 'https://anchor.fm/favicon.ico', category: 'AI Podcasting', link: 'https://anchor.fm', pricing: 'free' },
        { name: 'Audacity', description: 'Free open-source audio editing software', logo: 'https://www.audacityteam.org/favicon.ico', category: 'AI Podcasting', link: 'https://www.audacityteam.org', pricing: 'free' },
        { name: 'Descript', description: 'AI podcast editing and transcription', logo: 'https://www.descript.com/favicon.ico', category: 'AI Podcasting', link: 'https://www.descript.com', pricing: 'freemium' },
        { name: 'Podcastle', description: 'AI-powered podcast creation', logo: 'https://podcastle.ai/favicon.ico', category: 'AI Podcasting', link: 'https://podcastle.ai', pricing: 'freemium' },
        { name: 'Riverside.fm', description: 'AI podcast recording and enhancement', logo: 'https://riverside.fm/favicon.ico', category: 'AI Podcasting', link: 'https://riverside.fm', pricing: 'freemium' },
        { name: 'Auphonic', description: 'AI audio post-production for podcasts', logo: 'https://auphonic.com/favicon.ico', category: 'AI Podcasting', link: 'https://auphonic.com', pricing: 'freemium' },
        { name: 'Cleanvoice AI', description: 'AI podcast noise and filler remover', logo: 'https://cleanvoice.ai/favicon.ico', category: 'AI Podcasting', link: 'https://cleanvoice.ai', pricing: 'freemium' }
    ,{ name: 'Podbean', description: 'AI podcast hosting and analytics', logo: 'https://www.podbean.com/favicon.ico', category: 'AI Podcasting', link: 'https://www.podbean.com', pricing: 'freemium' }
    ,{ name: 'Alitu', description: 'AI podcast editing and publishing', logo: 'https://alitu.com/favicon.ico', category: 'AI Podcasting', link: 'https://alitu.com', pricing: 'premium' }
    ,{ name: 'Castos', description: 'AI podcast analytics and distribution', logo: 'https://castos.com/favicon.ico', category: 'AI Podcasting', link: 'https://castos.com', pricing: 'freemium' }
    ,{ name: 'Podomatic', description: 'AI podcast creation and monetization', logo: 'https://www.podomatic.com/favicon.ico', category: 'AI Podcasting', link: 'https://www.podomatic.com', pricing: 'freemium' }
    ,{ name: 'Headliner', description: 'AI podcast audiogram and video creation', logo: 'https://www.headliner.app/favicon.ico', category: 'AI Podcasting', link: 'https://www.headliner.app', pricing: 'freemium' }
    ],
    'ai-event-planning': [
        { name: 'Google Calendar', description: 'Free AI-powered scheduling and event planning', logo: 'https://calendar.google.com/favicon.ico', category: 'AI Event Planning', link: 'https://calendar.google.com', pricing: 'free' },
        { name: 'Doodle', description: 'Free meeting scheduler with AI suggestions', logo: 'https://doodle.com/favicon.ico', category: 'AI Event Planning', link: 'https://doodle.com', pricing: 'free' },
        { name: 'Eventbrite AI', description: 'Smart event management', logo: 'https://www.eventbrite.com/favicon.ico', category: 'AI Event Planning', link: 'https://www.eventbrite.com', pricing: 'freemium' },
        { name: 'Zkipster', description: 'AI guest list and event check-in', logo: 'https://www.zkipster.com/favicon.ico', category: 'AI Event Planning', link: 'https://www.zkipster.com', pricing: 'premium' },
        { name: 'Social Tables', description: 'AI event diagramming', logo: 'https://www.socialtables.com/favicon.ico', category: 'AI Event Planning', link: 'https://www.socialtables.com', pricing: 'premium' },
        { name: 'Bizzabo', description: 'AI event marketing and analytics', logo: 'https://www.bizzabo.com/favicon.ico', category: 'AI Event Planning', link: 'https://www.bizzabo.com', pricing: 'premium' },
        { name: 'Splashthat', description: 'AI event design and automation', logo: 'https://splashthat.com/favicon.ico', category: 'AI Event Planning', link: 'https://splashthat.com', pricing: 'freemium' }
    ,{ name: 'Whova', description: 'AI event app and attendee engagement', logo: 'https://whova.com/favicon.ico', category: 'AI Event Planning', link: 'https://whova.com', pricing: 'freemium' }
    ,{ name: 'Cvent', description: 'AI event management platform', logo: 'https://www.cvent.com/favicon.ico', category: 'AI Event Planning', link: 'https://www.cvent.com', pricing: 'premium' }
    ,{ name: 'Hopin', description: 'AI virtual and hybrid event platform', logo: 'https://hopin.com/favicon.ico', category: 'AI Event Planning', link: 'https://hopin.com', pricing: 'freemium' }
    ,{ name: 'EventMobi', description: 'AI event app and analytics', logo: 'https://www.eventmobi.com/favicon.ico', category: 'AI Event Planning', link: 'https://www.eventmobi.com', pricing: 'premium' }
    ,{ name: 'Aventri', description: 'AI event management and marketing', logo: 'https://www.aventri.com/favicon.ico', category: 'AI Event Planning', link: 'https://www.aventri.com', pricing: 'premium' }
    ],
    'ai-personal-finance': [
        { name: 'Mint', description: 'Free budgeting and finance tracking', logo: 'https://mint.intuit.com/favicon.ico', category: 'AI Personal Finance', link: 'https://mint.intuit.com', pricing: 'free' },
        { name: 'Personal Capital', description: 'Free financial planning and wealth management', logo: 'https://www.personalcapital.com/favicon.ico', category: 'AI Personal Finance', link: 'https://www.personalcapital.com', pricing: 'free' },
        { name: 'Cleo', description: 'AI budgeting and finance assistant', logo: 'https://web.meetcleo.com/favicon.ico', category: 'AI Personal Finance', link: 'https://web.meetcleo.com', pricing: 'freemium' },
        { name: 'YNAB AI', description: 'AI-powered budgeting', logo: 'https://www.youneedabudget.com/favicon.ico', category: 'AI Personal Finance', link: 'https://www.youneedabudget.com', pricing: 'premium' },
        { name: 'Albert', description: 'AI financial advice', logo: 'https://albert.com/favicon.ico', category: 'AI Personal Finance', link: 'https://albert.com', pricing: 'freemium' },
        { name: 'Plum', description: 'AI savings and investment', logo: 'https://withplum.com/favicon.ico', category: 'AI Personal Finance', link: 'https://withplum.com', pricing: 'freemium' },
        { name: 'Wally AI', description: 'AI personal finance tracker', logo: 'https://wally.me/favicon.ico', category: 'AI Personal Finance', link: 'https://wally.me', pricing: 'freemium' }
    ,{ name: 'Emma', description: 'AI money management and budgeting', logo: 'https://emma-app.com/favicon.ico', category: 'AI Personal Finance', link: 'https://emma-app.com', pricing: 'freemium' }
    ,{ name: 'PocketSmith', description: 'AI personal finance forecasting', logo: 'https://www.pocketsmith.com/favicon.ico', category: 'AI Personal Finance', link: 'https://www.pocketsmith.com', pricing: 'freemium' }
    ,{ name: 'Truebill', description: 'AI subscription and bill management', logo: 'https://www.truebill.com/favicon.ico', category: 'AI Personal Finance', link: 'https://www.truebill.com', pricing: 'freemium' }
    ,{ name: 'Qapital', description: 'AI savings and goal planning', logo: 'https://www.qapital.com/favicon.ico', category: 'AI Personal Finance', link: 'https://www.qapital.com', pricing: 'freemium' }
    ,{ name: 'Digit', description: 'AI automatic savings tool', logo: 'https://digit.co/favicon.ico', category: 'AI Personal Finance', link: 'https://digit.co', pricing: 'freemium' }
    ],
    // 'ai-gardening': [
    //     { name: 'Planta', description: 'AI plant care assistant', logo: 'https://getplanta.com/favicon.ico', category: 'AI Gardening', link: 'https://getplanta.com' },
    //     { name: 'Gardenize', description: 'AI garden planner', logo: 'https://gardenize.com/favicon.ico', category: 'AI Gardening', link: 'https://gardenize.com' },
    //     { name: 'Blossom', description: 'AI plant identification', logo: 'https://blossomplant.com/favicon.ico', category: 'AI Gardening', link: 'https://blossomplant.com' },
    //     { name: 'PictureThis', description: 'AI plant diagnosis', logo: 'https://www.picturethisai.com/favicon.ico', category: 'AI Gardening', link: 'https://www.picturethisai.com' },
    //     { name: 'GrowIt!', description: 'AI gardening community', logo: 'https://www.growitmobile.com/favicon.ico', category: 'AI Gardening', link: 'https://www.growitmobile.com' }
    // ,{ name: 'SmartPlant', description: 'AI plant identification and care', logo: 'https://www.smartplantapp.com/favicon.ico', category: 'AI Gardening', link: 'https://www.smartplantapp.com' }
    // ,{ name: 'Garden Answers', description: 'AI plant identification app', logo: 'https://www.gardenanswers.com/favicon.ico', category: 'AI Gardening', link: 'https://www.gardenanswers.com' }
    // ,{ name: 'Plantix', description: 'AI plant disease diagnosis', logo: 'https://plantix.net/favicon.ico', category: 'AI Gardening', link: 'https://plantix.net' }
    // ,{ name: 'Vera', description: 'AI gardening journal and reminders', logo: 'https://www.myvera.com/favicon.ico', category: 'AI Gardening', link: 'https://www.myvera.com' }
    // ,{ name: 'Garden Planner', description: 'AI garden design and planning', logo: 'https://www.gardenplanner.com/favicon.ico', category: 'AI Gardening', link: 'https://www.gardenplanner.com' }
    // ],
    'ai-language-translation': [
        { name: 'DeepL', description: 'AI translation engine', logo: 'https://www.deepl.com/favicon.ico', category: 'AI Language Translation', link: 'https://www.deepl.com', pricing: 'freemium' },
        { name: 'Google Translate AI', description: 'Neural machine translation', logo: 'https://translate.google.com/favicon.ico', category: 'AI Language Translation', link: 'https://translate.google.com', pricing: 'free' },
        { name: 'Microsoft Translator', description: 'AI-powered translation', logo: 'https://translator.microsoft.com/favicon.ico', category: 'AI Language Translation', link: 'https://translator.microsoft.com', pricing: 'freemium' },
        { name: 'iTranslate', description: 'AI language translation', logo: 'https://www.itranslate.com/favicon.ico', category: 'AI Language Translation', link: 'https://www.itranslate.com', pricing: 'freemium' },
        { name: 'Unbabel', description: 'AI translation for business', logo: 'https://unbabel.com/favicon.ico', category: 'AI Language Translation', link: 'https://unbabel.com', pricing: 'premium' }
    ,{ name: 'Smartling', description: 'AI translation management platform', logo: 'https://www.smartling.com/favicon.ico', category: 'AI Language Translation', link: 'https://www.smartling.com', pricing: 'premium' }
    ,{ name: 'Lilt', description: 'AI-powered translation for enterprises', logo: 'https://lilt.com/favicon.ico', category: 'AI Language Translation', link: 'https://lilt.com', pricing: 'premium' }
    ,{ name: 'Memsource', description: 'AI translation automation', logo: 'https://www.memsource.com/favicon.ico', category: 'AI Language Translation', link: 'https://www.memsource.com', pricing: 'premium' }
    ,{ name: 'Phrase', description: 'AI translation platform', logo: 'https://phrase.com/favicon.ico', category: 'AI Language Translation', link: 'https://phrase.com', pricing: 'premium' }
    ,{ name: 'Sonix', description: 'AI transcription and translation', logo: 'https://sonix.ai/favicon.ico', category: 'AI Language Translation', link: 'https://sonix.ai', pricing: 'freemium' }
    ],
  
   
    'ai-sustainability': [
        { name: 'GHG Platform India', description: 'Free greenhouse gas data and analytics', logo: 'https://ghgplatform-india.org/favicon.ico', category: 'AI Sustainability', link: 'https://ghgplatform-india.org', pricing: 'free' },
        { name: 'OpenClimate', description: 'Free open climate data platform', logo: 'https://openclimate.network/favicon.ico', category: 'AI Sustainability', link: 'https://openclimate.network', pricing: 'free' },
        { name: 'ClimateAI', description: 'AI climate risk analytics', logo: 'https://climate.ai/favicon.ico', category: 'AI Sustainability', link: 'https://climate.ai', pricing: 'premium' },
        { name: 'Persefoni', description: 'AI carbon management', logo: 'https://persefoni.com/favicon.ico', category: 'AI Sustainability', link: 'https://persefoni.com', pricing: 'premium' },
        { name: 'Watershed', description: 'AI sustainability platform', logo: 'https://watershed.com/favicon.ico', category: 'AI Sustainability', link: 'https://watershed.com', pricing: 'premium' },
        { name: 'Plan A', description: 'AI ESG platform', logo: 'https://plana.earth/favicon.ico', category: 'AI Sustainability', link: 'https://plana.earth', pricing: 'premium' },
        { name: 'CarbonChain', description: 'AI carbon tracking', logo: 'https://carbonchain.com/favicon.ico', category: 'AI Sustainability', link: 'https://carbonchain.com', pricing: 'premium' }
    ,{ name: 'Enablon', description: 'AI-powered sustainability management', logo: 'https://enablon.com/favicon.ico', category: 'AI Sustainability', link: 'https://enablon.com', pricing: 'premium' }
    ,{ name: 'Sustainalytics', description: 'AI ESG risk ratings and analytics', logo: 'https://www.sustainalytics.com/favicon.ico', category: 'AI Sustainability', link: 'https://www.sustainalytics.com', pricing: 'premium' }
    ,{ name: 'EcoVadis', description: 'AI sustainability ratings platform', logo: 'https://www.ecovadis.com/favicon.ico', category: 'AI Sustainability', link: 'https://www.ecovadis.com', pricing: 'premium' }
    ,{ name: 'GHG Platform India', description: 'AI greenhouse gas data and analytics', logo: 'https://ghgplatform-india.org/favicon.ico', category: 'AI Sustainability', link: 'https://ghgplatform-india.org', pricing: 'free' }
    ,{ name: 'OpenClimate', description: 'AI open climate data platform', logo: 'https://openclimate.network/favicon.ico', category: 'AI Sustainability', link: 'https://openclimate.network', pricing: 'free' }
    ],
   
   
    'ai-education': [
        { name: 'Duolingo', description: 'AI-powered language learning platform', logo: 'https://www.duolingo.com/favicon.ico', category: 'Education AI', link: 'https://www.duolingo.com/', pricing: 'freemium' },
        { name: 'Coursera', description: 'AI-enhanced online learning platform', logo: 'https://www.coursera.org/favicon.ico', category: 'Education AI', link: 'https://www.coursera.org/', pricing: 'freemium' },
        { name: 'Khan Academy', description: 'Personalized learning with AI', logo: 'https://www.khanacademy.org/favicon.ico', category: 'Education AI', link: 'https://www.khanacademy.org/', pricing: 'free' },
        { name: 'Quizlet', description: 'AI-powered study tools and flashcards', logo: 'https://quizlet.com/favicon.ico', category: 'Education AI', link: 'https://quizlet.com/', pricing: 'freemium' },
        { name: 'Century Tech', description: 'AI learning platform for schools', logo: 'https://www.century.tech/favicon.ico', category: 'Education AI', link: 'https://www.century.tech/', pricing: 'premium' },
        { name: 'Squirrel AI', description: 'Adaptive learning platform with AI', logo: 'https://www.squirrelai.com/favicon.ico', category: 'Education AI', link: 'https://www.squirrelai.com/', pricing: 'premium' },
        { name: 'Carnegie Learning', description: 'AI-powered math learning software', logo: 'https://www.carnegielearning.com/favicon.ico', category: 'Education AI', link: 'https://www.carnegielearning.com/', pricing: 'premium' },
        { name: 'Cognii', description: 'Virtual learning assistant with AI', logo: 'https://www.cognii.com/favicon.ico', category: 'Education AI', link: 'https://www.cognii.com/', pricing: 'premium' },
        { name: 'Querium', description: 'AI tutoring for STEM subjects', logo: 'https://querium.com/favicon.ico', category: 'Education AI', link: 'https://querium.com/', pricing: 'freemium' },
        { name: 'Thinkster Math', description: 'AI math tutoring platform', logo: 'https://hellothinkster.com/favicon.ico', category: 'Education AI', link: 'https://hellothinkster.com/', pricing: 'freemium' }
    ],
        'logo-generators': [
            { name: 'Canva Free Logo', description: 'Free logo maker with templates', logo: 'https://www.canva.com/favicon.ico', category: 'Logo Generators', link: 'https://www.canva.com/create/logos', pricing: 'free' },
            { name: 'LogoMakr Free', description: 'Free simple logo design tool', logo: 'https://logomakr.com/favicon.ico', category: 'Logo Generators', link: 'https://logomakr.com', pricing: 'free' },
            { name: 'Looka', description: 'AI logo maker and brand identity', logo: 'https://looka.com/favicon.ico', category: 'Logo Generators', link: 'https://looka.com', pricing: 'freemium' },
            { name: 'Brandmark', description: 'AI-powered logo design tool', logo: 'https://brandmark.io/favicon.ico', category: 'Logo Generators', link: 'https://brandmark.io', pricing: 'freemium' },
            { name: 'Canva Logo Maker', description: 'Create logos with AI-powered design', logo: 'https://www.canva.com/favicon.ico', category: 'Logo Generators', link: 'https://www.canva.com', pricing: 'freemium' },
            { name: 'LogoAI', description: 'AI logo generator for businesses', logo: 'https://logoai.com/favicon.ico', category: 'Logo Generators', link: 'https://logoai.com', pricing: 'freemium' },
            { name: 'Hatchful', description: 'Free AI logo maker by Shopify', logo: 'https://hatchful.shopify.com/favicon.ico', category: 'Logo Generators', link: 'https://hatchful.shopify.com', pricing: 'free' }
            ,{ name: 'LogoMakr', description: 'Simple AI logo design tool', logo: 'https://logomakr.com/favicon.ico', category: 'Logo Generators', link: 'https://logomakr.com', pricing: 'freemium' }
            ,{ name: 'Tailor Brands', description: 'AI-powered branding and logo creation', logo: 'https://www.tailorbrands.com/favicon.ico', category: 'Logo Generators', link: 'https://www.tailorbrands.com', pricing: 'freemium' }
            ,{ name: 'Logo Genie', description: 'AI logo creation for businesses', logo: 'https://www.logogenie.net/favicon.ico', category: 'Logo Generators', link: 'https://www.logogenie.net', pricing: 'freemium' }
            ,{ name: 'Turbologo', description: 'Fast AI logo generator', logo: 'https://turbologo.com/favicon.ico', category: 'Logo Generators', link: 'https://turbologo.com', pricing: 'freemium' }
        ],
        'job-finder': [
            { name: 'Google for Jobs', description: 'Free job search aggregator by Google', logo: 'https://www.google.com/favicon.ico', category: 'Job Finder', link: 'https://www.google.com/search?q=jobs', pricing: 'free' },
            { name: 'SimplyHired', description: 'Free job search engine', logo: 'https://www.simplyhired.com/favicon.ico', category: 'Job Finder', link: 'https://www.simplyhired.com', pricing: 'free' },
            { name: 'LinkedIn Job Search', description: 'AI-powered job matching on LinkedIn', logo: 'https://www.linkedin.com/favicon.ico', category: 'Job Finder', link: 'https://www.linkedin.com/jobs', pricing: 'freemium' },
            { name: 'Indeed AI', description: 'AI-powered job search platform', logo: 'https://www.indeed.com/favicon.ico', category: 'Job Finder', link: 'https://www.indeed.com', pricing: 'freemium' },
            { name: 'ZipRecruiter AI', description: 'AI job matching and alerts', logo: 'https://www.ziprecruiter.com/favicon.ico', category: 'Job Finder', link: 'https://www.ziprecruiter.com', pricing: 'freemium' },
            { name: 'Glassdoor AI', description: 'AI-driven job search and company reviews', logo: 'https://www.glassdoor.com/favicon.ico', category: 'Job Finder', link: 'https://www.glassdoor.com', pricing: 'freemium' },
            { name: 'Monster AI', description: 'AI job search and career advice', logo: 'https://www.monster.com/favicon.ico', category: 'Job Finder', link: 'https://www.monster.com', pricing: 'freemium' },
            { name: 'CareerBuilder AI', description: 'AI-powered job matching', logo: 'https://www.careerbuilder.com/favicon.ico', category: 'Job Finder', link: 'https://www.careerbuilder.com', pricing: 'freemium' },
            { name: 'Adzuna AI', description: 'Smart job search engine', logo: 'https://www.adzuna.com/favicon.ico', category: 'Job Finder', link: 'https://www.adzuna.com', pricing: 'freemium' },
            { name: 'JobHero', description: 'AI job tracking and search', logo: 'https://www.jobhero.com/favicon.ico', category: 'Job Finder', link: 'https://www.jobhero.com', pricing: 'freemium' },
            { name: 'Jobvite', description: 'AI recruiting and job search', logo: 'https://www.jobvite.com/favicon.ico', category: 'Job Finder', link: 'https://www.jobvite.com', pricing: 'premium' }
        ],
        'job-applier': [
            { name: 'Resume.io', description: 'Free resume builder and job application tool', logo: 'https://resume.io/favicon.ico', category: 'Job Applier', link: 'https://resume.io', pricing: 'free' },
            { name: 'Canva Resume', description: 'Free resume and cover letter builder', logo: 'https://www.canva.com/favicon.ico', category: 'Job Applier', link: 'https://www.canva.com/resumes', pricing: 'free' },
            { name: 'Simplify Jobs', description: 'AI-powered job application automation', logo: 'https://simplify.jobs/favicon.ico', category: 'Job Applier', link: 'https://simplify.jobs', pricing: 'freemium' },
            { name: 'JobApplyBot', description: 'Automate job applications with AI', logo: 'https://jobapplybot.com/favicon.ico', category: 'Job Applier', link: 'https://jobapplybot.com', pricing: 'premium' },
            { name: 'LoopCV', description: 'Automated job application platform', logo: 'https://loopcv.pro/favicon.ico', category: 'Job Applier', link: 'https://loopcv.pro', pricing: 'freemium' },
            { name: 'Careerflow', description: 'AI job application tracker and automation', logo: 'https://careerflow.ai/favicon.ico', category: 'Job Applier', link: 'https://careerflow.ai', pricing: 'freemium' },
            { name: 'JobSeeker', description: 'AI-powered job application assistant', logo: 'https://jobseeker.com/favicon.ico', category: 'Job Applier', link: 'https://jobseeker.com', pricing: 'freemium' },
            { name: 'JobPal', description: 'AI chatbot for job applications', logo: 'https://jobpal.ai/favicon.ico', category: 'Job Applier', link: 'https://jobpal.ai', pricing: 'freemium' },
            { name: 'Applyya', description: 'Automated job application platform', logo: 'https://applyya.com/favicon.ico', category: 'Job Applier', link: 'https://applyya.com', pricing: 'freemium' },
            { name: 'JobBot', description: 'AI job application assistant', logo: 'https://jobbot.me/favicon.ico', category: 'Job Applier', link: 'https://jobbot.me', pricing: 'premium' },
            { name: 'JobWizard', description: 'AI-powered job application tracker', logo: 'https://jobwizard.io/favicon.ico', category: 'Job Applier', link: 'https://jobwizard.io', pricing: 'freemium' },
            { name: 'JobAutomator', description: 'Automate job applications with AI', logo: 'https://jobautomator.com/favicon.ico', category: 'Job Applier', link: 'https://jobautomator.com', pricing: 'premium' }
        ],
        'ai-sports-analytics': [
            { name: 'Strava', description: 'Free fitness tracking and social network for athletes', logo: 'https://www.strava.com/favicon.ico', category: 'AI Sports Analytics', link: 'https://www.strava.com', pricing: 'free' },
            { name: 'Nike Run Club', description: 'Free running app with AI coaching', logo: 'https://www.nike.com/favicon.ico', category: 'AI Sports Analytics', link: 'https://www.nike.com/nrc-app', pricing: 'free' },
            { name: 'Sportradar', description: 'AI-powered sports data analytics', logo: 'https://sportradar.com/favicon.ico', category: 'AI Sports Analytics', link: 'https://sportradar.com', pricing: 'premium' },
            { name: 'Stats Perform', description: 'AI-driven sports performance analytics', logo: 'https://www.statsperform.com/favicon.ico', category: 'AI Sports Analytics', link: 'https://www.statsperform.com', pricing: 'premium' },
            { name: 'Catapult Sports', description: 'AI athlete tracking and analytics', logo: 'https://catapultsports.com/favicon.ico', category: 'AI Sports Analytics', link: 'https://catapultsports.com', pricing: 'premium' },
            { name: 'Hudl', description: 'AI video analysis for sports teams', logo: 'https://www.hudl.com/favicon.ico', category: 'AI Sports Analytics', link: 'https://www.hudl.com', pricing: 'freemium' },
            { name: 'Zone7', description: 'AI injury prevention and performance analytics', logo: 'https://zone7.ai/favicon.ico', category: 'AI Sports Analytics', link: 'https://zone7.ai', pricing: 'premium' },
            { name: 'Sportlogiq', description: 'AI-powered sports analytics', logo: 'https://sportlogiq.com/favicon.ico', category: 'AI Sports Analytics', link: 'https://sportlogiq.com', pricing: 'premium' },
            { name: 'Playermaker', description: 'AI wearable for sports analytics', logo: 'https://www.playermaker.com/favicon.ico', category: 'AI Sports Analytics', link: 'https://www.playermaker.com', pricing: 'premium' },
            { name: 'Second Spectrum', description: 'AI video analysis for sports', logo: 'https://secondspectrum.com/favicon.ico', category: 'AI Sports Analytics', link: 'https://secondspectrum.com', pricing: 'premium' },
            { name: 'SportsTrace', description: 'AI performance analytics', logo: 'https://www.sportstrace.com/favicon.ico', category: 'AI Sports Analytics', link: 'https://www.sportstrace.com', pricing: 'freemium' },
            { name: 'Edge10', description: 'AI athlete management platform', logo: 'https://edge10.com/favicon.ico', category: 'AI Sports Analytics', link: 'https://edge10.com', pricing: 'premium' }
        ],
        'ai-parenting': [
            { name: 'WebMD Baby', description: 'Free pregnancy and parenting tracker', logo: 'https://www.webmd.com/favicon.ico', category: 'AI Parenting', link: 'https://www.webmd.com/parenting', pricing: 'free' },
            { name: 'ParentPal', description: 'AI-powered parenting tips and child development', logo: 'https://parentpal.com/favicon.ico', category: 'AI Parenting', link: 'https://parentpal.com', pricing: 'freemium' },
            { name: 'Kinedu', description: 'AI-driven child development activities', logo: 'https://www.kinedu.com/favicon.ico', category: 'AI Parenting', link: 'https://www.kinedu.com', pricing: 'freemium' },
            { name: 'Winnie', description: 'AI parenting community and resources', logo: 'https://winnie.com/favicon.ico', category: 'AI Parenting', link: 'https://winnie.com', pricing: 'freemium' },
            { name: 'BabyCenter AI', description: 'AI-powered parenting advice and tracking', logo: 'https://www.babycenter.com/favicon.ico', category: 'AI Parenting', link: 'https://www.babycenter.com', pricing: 'free' },
            { name: 'Parenting Hero', description: 'AI parenting assistant and tips', logo: 'https://parentinghero.com/favicon.ico', category: 'AI Parenting', link: 'https://parentinghero.com', pricing: 'freemium' },
            { name: 'BabySparks', description: 'AI-powered child development app', logo: 'https://babysparks.com/favicon.ico', category: 'AI Parenting', link: 'https://babysparks.com', pricing: 'freemium' },
            { name: 'Tinybeans', description: 'AI parenting journal and tips', logo: 'https://tinybeans.com/favicon.ico', category: 'AI Parenting', link: 'https://tinybeans.com', pricing: 'freemium' },
            { name: 'Sproutling', description: 'AI baby monitor and insights', logo: 'https://sproutling.com/favicon.ico', category: 'AI Parenting', link: 'https://sproutling.com', pricing: 'premium' },
            { name: 'Cubo AI', description: 'Smart baby monitor with AI', logo: 'https://us.getcubo.com/favicon.ico', category: 'AI Parenting', link: 'https://us.getcubo.com', pricing: 'premium' },
            { name: 'Huckleberry', description: 'AI sleep and parenting advice', logo: 'https://huckleberrycare.com/favicon.ico', category: 'AI Parenting', link: 'https://huckleberrycare.com', pricing: 'freemium' }
        ],
    'ai-cybersecurity': [
    { name: 'VirusTotal', description: 'Free malware scanning and threat intelligence', logo: 'https://www.virustotal.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.virustotal.com/', pricing: 'free' },
    { name: 'Cuckoo Sandbox', description: 'Open-source automated malware analysis', logo: 'https://cuckoosandbox.org/favicon.ico', category: 'Cybersecurity AI', link: 'https://cuckoosandbox.org/', pricing: 'free' },
        { name: 'Darktrace', description: 'AI-powered cyber defense platform', logo: 'https://www.darktrace.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.darktrace.com/', pricing: 'premium' },
        { name: 'CrowdStrike', description: 'AI endpoint protection platform', logo: 'https://www.crowdstrike.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.crowdstrike.com/', pricing: 'premium' },
        { name: 'Cylance', description: 'AI antivirus and endpoint security', logo: 'https://www.cylance.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.cylance.com/', pricing: 'premium' },
        { name: 'Vectra AI', description: 'AI-powered threat detection', logo: 'https://www.vectra.ai/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.vectra.ai/', pricing: 'premium' },
        { name: 'Deep Instinct', description: 'Deep learning cybersecurity', logo: 'https://www.deepinstinct.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.deepinstinct.com/', pricing: 'premium' },
        { name: 'SentinelOne', description: 'Autonomous endpoint protection', logo: 'https://www.sentinelone.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.sentinelone.com/', pricing: 'premium' },
        { name: 'Cybereason', description: 'AI-powered endpoint protection', logo: 'https://www.cybereason.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.cybereason.com/', pricing: 'premium' },
        { name: 'Securonix', description: 'AI security analytics platform', logo: 'https://www.securonix.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.securonix.com/', pricing: 'premium' },
        { name: 'Exabeam', description: 'Security intelligence and analytics', logo: 'https://www.exabeam.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.exabeam.com/', pricing: 'premium' },
        { name: 'Blue Hexagon', description: 'Real-time deep learning security', logo: 'https://bluehexagon.ai/favicon.ico', category: 'Cybersecurity AI', link: 'https://bluehexagon.ai/', pricing: 'premium' }
    ],
    'ai-robotics': [
    { name: 'OpenAI Gym', description: 'Open-source toolkit for developing and comparing reinforcement learning algorithms', logo: 'https://gym.openai.com/favicon.ico', category: 'Robotics AI', link: 'https://gym.openai.com/', pricing: 'free' },
    { name: 'ROS (Robot Operating System)', description: 'Open-source robotics middleware', logo: 'https://www.ros.org/favicon.ico', category: 'Robotics AI', link: 'https://www.ros.org/', pricing: 'free' },
        { name: 'Boston Dynamics', description: 'Advanced robotics with AI', logo: 'https://www.bostondynamics.com/favicon.ico', category: 'Robotics AI', link: 'https://www.bostondynamics.com/', pricing: 'premium' },
        { name: 'Fetch Robotics', description: 'Autonomous mobile robots', logo: 'https://fetchrobotics.com/favicon.ico', category: 'Robotics AI', link: 'https://fetchrobotics.com/', pricing: 'premium' },
        { name: 'Covariant', description: 'AI for robotic manipulation', logo: 'https://covariant.ai/favicon.ico', category: 'Robotics AI', link: 'https://covariant.ai/', pricing: 'premium' },
        { name: 'Vicarious', description: 'AI for industrial robots', logo: 'https://www.vicarious.com/favicon.ico', category: 'Robotics AI', link: 'https://www.vicarious.com/', pricing: 'premium' },
        { name: 'Robust.AI', description: 'Cognitive engine for robotics', logo: 'https://robust.ai/favicon.ico', category: 'Robotics AI', link: 'https://robust.ai/', pricing: 'premium' },
        { name: 'Diligent Robotics', description: 'AI-powered service robots', logo: 'https://www.diligentrobots.com/favicon.ico', category: 'Robotics AI', link: 'https://www.diligentrobots.com/', pricing: 'premium' },
        { name: 'Embodied', description: 'Social companion robots with AI', logo: 'https://embodied.com/favicon.ico', category: 'Robotics AI', link: 'https://embodied.com/', pricing: 'premium' },
        { name: 'Skydio', description: 'Autonomous drones with AI', logo: 'https://www.skydio.com/favicon.ico', category: 'Robotics AI', link: 'https://www.skydio.com/', pricing: 'premium' },
        { name: 'Waymo', description: 'Autonomous driving technology', logo: 'https://waymo.com/favicon.ico', category: 'Robotics AI', link: 'https://waymo.com/', pricing: 'premium' },
        { name: 'Cruise', description: 'Self-driving vehicle technology', logo: 'https://www.getcruise.com/favicon.ico', category: 'Robotics AI', link: 'https://www.getcruise.com/', pricing: 'premium' }
    ],
    'ai-art': [
        { name: 'Craiyon', description: 'Free AI image generator (formerly DALL-E mini)', logo: 'https://www.craiyon.com/favicon.ico', category: 'AI Art Tools', link: 'https://www.craiyon.com/', pricing: 'free' },
        { name: 'Bing Image Creator', description: 'Free AI image generation by Microsoft', logo: 'https://www.bing.com/favicon.ico', category: 'AI Art Tools', link: 'https://www.bing.com/images/create', pricing: 'free' },
        { name: 'Artbreeder', description: 'AI art creation and blending', logo: 'https://www.artbreeder.com/favicon.ico', category: 'AI Art Tools', link: 'https://www.artbreeder.com/', pricing: 'freemium' },
        { name: 'DeepArt', description: 'AI style transfer for images', logo: 'https://deepart.io/favicon.ico', category: 'AI Art Tools', link: 'https://deepart.io/', pricing: 'freemium' },
        { name: 'NightCafe Creator', description: 'AI art generator and community', logo: 'https://creator.nightcafe.studio/favicon.ico', category: 'AI Art Tools', link: 'https://creator.nightcafe.studio/', pricing: 'freemium' },
        { name: 'Deep Dream Generator', description: 'Neural network art creation', logo: 'https://deepdreamgenerator.com/favicon.ico', category: 'AI Art Tools', link: 'https://deepdreamgenerator.com/', pricing: 'freemium' },
        { name: 'Wombo Dream', description: 'AI-powered art creation app', logo: 'https://www.wombo.art/favicon.ico', category: 'AI Art Tools', link: 'https://www.wombo.art/', pricing: 'freemium' },
        { name: 'Prisma', description: 'AI photo effects and art filters', logo: 'https://prisma-ai.com/favicon.ico', category: 'AI Art Tools', link: 'https://prisma-ai.com/', pricing: 'freemium' },
        { name: 'Runway ML', description: 'Creative tools powered by AI', logo: 'https://runwayml.com/favicon.ico', category: 'AI Art Tools', link: 'https://runwayml.com/', pricing: 'freemium' },
        { name: 'Playform', description: 'AI art generation platform', logo: 'https://playform.io/favicon.ico', category: 'AI Art Tools', link: 'https://playform.io/', pricing: 'freemium' },
        { name: 'Fotor GoArt', description: 'AI art style transfer tool', logo: 'https://www.fotor.com/favicon.ico', category: 'AI Art Tools', link: 'https://www.fotor.com/features/goart.html', pricing: 'freemium' },
        { name: 'StarryAI', description: 'Text to image AI art generator', logo: 'https://starryai.com/favicon.ico', category: 'AI Art Tools', link: 'https://starryai.com/', pricing: 'freemium' }
    ],
    'ai-agriculture': [
    { name: 'OpenATK', description: 'Open-source agricultural toolkits', logo: 'https://openatk.com/favicon.ico', category: 'Agriculture AI', link: 'https://openatk.com/', pricing: 'free' },
    { name: 'FarmBot', description: 'Open-source precision farming robot', logo: 'https://farm.bot/favicon.ico', category: 'Agriculture AI', link: 'https://farm.bot/', pricing: 'free' },
        { name: 'Taranis', description: 'AI-powered crop intelligence', logo: 'https://www.taranis.com/favicon.ico', category: 'Agriculture AI', link: 'https://www.taranis.com/', pricing: 'premium' },
        { name: 'Prospera', description: 'AI-powered agricultural intelligence', logo: 'https://www.prospera.ag/favicon.ico', category: 'Agriculture AI', link: 'https://www.prospera.ag/', pricing: 'premium' },
        { name: 'aWhere', description: 'Agricultural intelligence platform', logo: 'https://www.awhere.com/favicon.ico', category: 'Agriculture AI', link: 'https://www.awhere.com/', pricing: 'premium' },
        { name: 'FarmWise', description: 'AI-powered precision agriculture', logo: 'https://farmwise.io/favicon.ico', category: 'Agriculture AI', link: 'https://farmwise.io/', pricing: 'premium' },
        { name: 'Blue River Technology', description: 'AI for precision agriculture', logo: 'https://bluerivertechnology.com/favicon.ico', category: 'Agriculture AI', link: 'https://bluerivertechnology.com/', pricing: 'premium' },
        { name: 'Farmers Edge', description: 'AI-powered farm management', logo: 'https://www.farmersedge.ca/favicon.ico', category: 'Agriculture AI', link: 'https://www.farmersedge.ca/', pricing: 'premium' },
        { name: 'Trace Genomics', description: 'AI soil analysis for agriculture', logo: 'https://www.tracegenomics.com/favicon.ico', category: 'Agriculture AI', link: 'https://www.tracegenomics.com/', pricing: 'premium' },
        { name: 'Ceres Imaging', description: 'AI aerial imagery for agriculture', logo: 'https://www.ceresimaging.net/favicon.ico', category: 'Agriculture AI', link: 'https://www.ceresimaging.net/', pricing: 'premium' },
        { name: 'Gamaya', description: 'Hyperspectral imaging for agriculture', logo: 'https://gamaya.com/favicon.ico', category: 'Agriculture AI', link: 'https://gamaya.com/', pricing: 'premium' },
        { name: 'AgEagle', description: 'AI drone solutions for agriculture', logo: 'https://www.ageagle.com/favicon.ico', category: 'Agriculture AI', link: 'https://www.ageagle.com/', pricing: 'premium' }
    ],
    'ai-manufacturing': [
    { name: 'OpenAI Manufacturing Toolkit', description: 'Free AI tools for manufacturing', logo: 'https://openai.com/favicon.ico', category: 'Manufacturing AI', link: 'https://openai.com/', pricing: 'free' },
    { name: 'OpenMFG', description: 'Open-source manufacturing ERP', logo: 'https://openmfg.org/favicon.ico', category: 'Manufacturing AI', link: 'https://openmfg.org/', pricing: 'free' },
        { name: 'Siemens MindSphere', description: 'Industrial IoT with AI capabilities', logo: 'https://siemens.mindsphere.io/favicon.ico', category: 'Manufacturing AI', link: 'https://siemens.mindsphere.io/', pricing: 'premium' },
        { name: 'Uptake', description: 'Industrial AI and analytics platform', logo: 'https://www.uptake.com/favicon.ico', category: 'Manufacturing AI', link: 'https://www.uptake.com/', pricing: 'premium' },
        { name: 'Sight Machine', description: 'Manufacturing analytics platform', logo: 'https://sightmachine.com/favicon.ico', category: 'Manufacturing AI', link: 'https://sightmachine.com/', pricing: 'premium' },
        { name: 'Augury', description: 'Machine health monitoring with AI', logo: 'https://www.augury.com/favicon.ico', category: 'Manufacturing AI', link: 'https://www.augury.com/', pricing: 'premium' },
        { name: 'Falkonry', description: 'AI for predictive operations', logo: 'https://falkonry.com/favicon.ico', category: 'Manufacturing AI', link: 'https://falkonry.com/', pricing: 'premium' },
        { name: 'Veo Robotics', description: 'AI for industrial robot safety', logo: 'https://www.veobot.com/favicon.ico', category: 'Manufacturing AI', link: 'https://www.veobot.com/', pricing: 'premium' },
        { name: 'Bright Machines', description: 'Intelligent automation for manufacturing', logo: 'https://www.brightmachines.com/favicon.ico', category: 'Manufacturing AI', link: 'https://www.brightmachines.com/', pricing: 'premium' },
        { name: 'Instrumental', description: 'AI-powered manufacturing optimization', logo: 'https://www.instrumental.com/favicon.ico', category: 'Manufacturing AI', link: 'https://www.instrumental.com/', pricing: 'premium' },
        { name: 'Landing AI', description: 'AI visual inspection for manufacturing', logo: 'https://landing.ai/favicon.ico', category: 'Manufacturing AI', link: 'https://landing.ai/', pricing: 'premium' },
        { name: 'Neurala', description: 'AI vision for industrial applications', logo: 'https://www.neurala.com/favicon.ico', category: 'Manufacturing AI', link: 'https://www.neurala.com/', pricing: 'premium' }
    ],
    'ai-energy': [
    { name: 'OpenEI', description: 'Open Energy Information platform', logo: 'https://openei.org/favicon.ico', category: 'Energy AI', link: 'https://openei.org/', pricing: 'free' },
    { name: 'REopt Lite', description: 'Free energy optimization tool', logo: 'https://reopt.nrel.gov/favicon.ico', category: 'Energy AI', link: 'https://reopt.nrel.gov/', pricing: 'free' },
        { name: 'Grid4C', description: 'AI for smart grid management', logo: 'https://grid4c.com/favicon.ico', category: 'Energy AI', link: 'https://grid4c.com/', pricing: 'premium' },
        { name: 'AutoGrid', description: 'AI-powered energy management', logo: 'https://www.auto-grid.com/favicon.ico', category: 'Energy AI', link: 'https://www.auto-grid.com/', pricing: 'premium' },
        { name: 'C3.ai', description: 'Enterprise AI for energy industry', logo: 'https://c3.ai/favicon.ico', category: 'Energy AI', link: 'https://c3.ai/', pricing: 'premium' },
        { name: 'Bidgely', description: 'AI energy analytics platform', logo: 'https://www.bidgely.com/favicon.ico', category: 'Energy AI', link: 'https://www.bidgely.com/', pricing: 'premium' },
        { name: 'Verdigris', description: 'AI energy management system', logo: 'https://verdigris.co/favicon.ico', category: 'Energy AI', link: 'https://verdigris.co/', pricing: 'premium' },
        { name: 'Stem', description: 'AI-driven energy storage', logo: 'https://www.stem.com/favicon.ico', category: 'Energy AI', link: 'https://www.stem.com/', pricing: 'premium' },
        { name: 'SparkCognition', description: 'AI solutions for energy sector', logo: 'https://www.sparkcognition.com/favicon.ico', category: 'Energy AI', link: 'https://www.sparkcognition.com/', pricing: 'premium' },
        { name: 'KrakenGrid', description: 'AI for grid optimization', logo: 'https://www.krakengrid.com/favicon.ico', category: 'Energy AI', link: 'https://www.krakengrid.com/', pricing: 'premium' },
        { name: 'Urbint', description: 'AI for infrastructure safety', logo: 'https://urbint.com/favicon.ico', category: 'Energy AI', link: 'https://urbint.com/', pricing: 'premium' },
        { name: 'Innowatts', description: 'AI energy analytics platform', logo: 'https://www.innowatts.com/favicon.ico', category: 'Energy AI', link: 'https://www.innowatts.com/', pricing: 'premium' }
    ],
    'ai-retail': [
    { name: 'Openbravo', description: 'Open-source retail management platform', logo: 'https://www.openbravo.com/favicon.ico', category: 'Retail AI', link: 'https://www.openbravo.com/', pricing: 'free' },
    { name: 'Odoo Community', description: 'Free open-source retail ERP', logo: 'https://www.odoo.com/favicon.ico', category: 'Retail AI', link: 'https://www.odoo.com/', pricing: 'free' },
        { name: 'Trax', description: 'Computer vision for retail execution', logo: 'https://traxretail.com/favicon.ico', category: 'Retail AI', link: 'https://traxretail.com/', pricing: 'premium' },
        { name: 'Standard Cognition', description: 'Autonomous checkout technology', logo: 'https://standard.ai/favicon.ico', category: 'Retail AI', link: 'https://standard.ai/', pricing: 'premium' },
        { name: 'Focal Systems', description: 'AI-powered store automation', logo: 'https://focal.systems/favicon.ico', category: 'Retail AI', link: 'https://focal.systems/', pricing: 'premium' },
        { name: 'Shelf Engine', description: 'AI-powered inventory management', logo: 'https://www.shelfengine.com/favicon.ico', category: 'Retail AI', link: 'https://www.shelfengine.com/', pricing: 'premium' },
        { name: 'Algonomy', description: 'AI-powered retail personalization', logo: 'https://www.algonomy.com/favicon.ico', category: 'Retail AI', link: 'https://www.algonomy.com/', pricing: 'premium' },
        { name: 'Lily AI', description: 'Product attribution platform', logo: 'https://www.lily.ai/favicon.ico', category: 'Retail AI', link: 'https://www.lily.ai/', pricing: 'premium' },
        { name: 'Vue.ai', description: 'Retail automation platform', logo: 'https://vue.ai/favicon.ico', category: 'Retail AI', link: 'https://vue.ai/', pricing: 'premium' },
        { name: 'Syte', description: 'Visual AI for retail', logo: 'https://www.syte.ai/favicon.ico', category: 'Retail AI', link: 'https://www.syte.ai/', pricing: 'premium' },
        { name: 'Shopify Flow', description: 'E-commerce automation platform', logo: 'https://www.shopify.com/favicon.ico', category: 'Retail AI', link: 'https://www.shopify.com/flow', pricing: 'freemium' },
        { name: 'Clarifai', description: 'AI visual recognition for retail', logo: 'https://www.clarifai.com/favicon.ico', category: 'Retail AI', link: 'https://www.clarifai.com/', pricing: 'freemium' }
    ],
    'ai-finance': [
    { name: 'QuantLib', description: 'Open-source quantitative finance library', logo: 'https://www.quantlib.org/favicon.ico', category: 'Finance AI', link: 'https://www.quantlib.org/', pricing: 'free' },
    { name: 'OpenBB Terminal', description: 'Free investment research platform', logo: 'https://openbb.co/favicon.ico', category: 'Finance AI', link: 'https://openbb.co/', pricing: 'free' },
        { name: 'Alpaca', description: 'AI-powered stock trading platform', logo: 'https://alpaca.markets/favicon.ico', category: 'Finance AI', link: 'https://alpaca.markets/', pricing: 'freemium' },
        { name: 'Kensho', description: 'AI analytics for financial markets', logo: 'https://www.kensho.com/favicon.ico', category: 'Finance AI', link: 'https://www.kensho.com/', pricing: 'premium' },
        { name: 'Kavout', description: 'AI-powered investment platform', logo: 'https://www.kavout.com/favicon.ico', category: 'Finance AI', link: 'https://www.kavout.com/', pricing: 'freemium' },
        { name: 'Numerai', description: 'AI-powered hedge fund', logo: 'https://numer.ai/favicon.ico', category: 'Finance AI', link: 'https://numer.ai/', pricing: 'freemium' },
        { name: 'DataRobot', description: 'AI platform for financial forecasting', logo: 'https://www.datarobot.com/favicon.ico', category: 'Finance AI', link: 'https://www.datarobot.com/', pricing: 'premium' },
        { name: 'Ayasdi', description: 'AI for financial risk management', logo: 'https://www.ayasdi.com/favicon.ico', category: 'Finance AI', link: 'https://www.ayasdi.com/', pricing: 'premium' },
        { name: 'Feedzai', description: 'AI fraud detection for banking', logo: 'https://feedzai.com/favicon.ico', category: 'Finance AI', link: 'https://feedzai.com/', pricing: 'premium' },
        { name: 'Onfido', description: 'AI identity verification for finance', logo: 'https://onfido.com/favicon.ico', category: 'Finance AI', link: 'https://onfido.com/', pricing: 'premium' },
        { name: 'Personetics', description: 'AI-powered banking personalization', logo: 'https://personetics.com/favicon.ico', category: 'Finance AI', link: 'https://personetics.com/', pricing: 'premium' },
        { name: 'Kasisto', description: 'Conversational AI for finance', logo: 'https://kasisto.com/favicon.ico', category: 'Finance AI', link: 'https://kasisto.com/', pricing: 'premium' }
    ],
    'ai-real-estate': [
        { name: 'Zillow', description: 'Free AI-powered home value estimates', logo: 'https://www.zillow.com/favicon.ico', category: 'Real Estate AI', link: 'https://www.zillow.com/', pricing: 'free' },
        { name: 'Realtor.com', description: 'Free property search with AI recommendations', logo: 'https://www.realtor.com/favicon.ico', category: 'Real Estate AI', link: 'https://www.realtor.com/', pricing: 'free' },
        { name: 'HouseCanary', description: 'AI property valuation platform', logo: 'https://www.housecanary.com/favicon.ico', category: 'Real Estate AI', link: 'https://www.housecanary.com/', pricing: 'premium' },
        { name: 'Skyline AI', description: 'AI for real estate investment', logo: 'https://skyline.ai/favicon.ico', category: 'Real Estate AI', link: 'https://skyline.ai/', pricing: 'premium' },
        { name: 'Cherre', description: 'Real estate data integration platform', logo: 'https://cherre.com/favicon.ico', category: 'Real Estate AI', link: 'https://cherre.com/', pricing: 'premium' },
        { name: 'Localize', description: 'AI location intelligence for real estate', logo: 'https://localize.city/favicon.ico', category: 'Real Estate AI', link: 'https://localize.city/', pricing: 'freemium' },
        { name: 'Enodo', description: 'AI multifamily property analysis', logo: 'https://enodoinc.com/favicon.ico', category: 'Real Estate AI', link: 'https://enodoinc.com/', pricing: 'premium' },
        { name: 'Restb.ai', description: 'Computer vision for real estate', logo: 'https://restb.ai/favicon.ico', category: 'Real Estate AI', link: 'https://restb.ai/', pricing: 'premium' },
        { name: 'Zillow Offers', description: 'AI-powered home buying platform', logo: 'https://www.zillow.com/favicon.ico', category: 'Real Estate AI', link: 'https://www.zillow.com/offers/', pricing: 'freemium' },
        { name: 'Opendoor', description: 'AI home valuation and buying', logo: 'https://www.opendoor.com/favicon.ico', category: 'Real Estate AI', link: 'https://www.opendoor.com/', pricing: 'freemium' },
        { name: 'Compass', description: 'AI-powered real estate platform', logo: 'https://www.compass.com/favicon.ico', category: 'Real Estate AI', link: 'https://www.compass.com/', pricing: 'freemium' },
        { name: 'Redfin', description: 'AI real estate brokerage', logo: 'https://www.redfin.com/favicon.ico', category: 'Real Estate AI', link: 'https://www.redfin.com/', pricing: 'freemium' }
    ],
    'ai-travel': [
        { name: 'Hopper', description: 'AI-powered travel booking app', logo: 'https://www.hopper.com/favicon.ico', category: 'Travel AI', link: 'https://www.hopper.com/', pricing: 'freemium' },
        { name: 'Skyscanner', description: 'AI flight search and prediction', logo: 'https://www.skyscanner.com/favicon.ico', category: 'Travel AI', link: 'https://www.skyscanner.com/', pricing: 'free' },
        { name: 'Kayak', description: 'AI travel search and planning', logo: 'https://www.kayak.com/favicon.ico', category: 'Travel AI', link: 'https://www.kayak.com/', pricing: 'free' },
        { name: 'Mezi', description: 'AI travel assistant', logo: 'https://mezi.com/favicon.ico', category: 'Travel AI', link: 'https://mezi.com/', pricing: 'freemium' },
        { name: 'Journera', description: 'AI travel data platform', logo: 'https://journera.com/favicon.ico', category: 'Travel AI', link: 'https://journera.com/', pricing: 'premium' },
        { name: 'Volantio', description: 'AI revenue optimization for airlines', logo: 'https://www.volantio.com/favicon.ico', category: 'Travel AI', link: 'https://www.volantio.com/', pricing: 'premium' },
        { name: 'Freebird', description: 'AI flight rebooking platform', logo: 'https://www.getfreebird.com/favicon.ico', category: 'Travel AI', link: 'https://www.getfreebird.com/', pricing: 'freemium' },
        { name: 'Maidbot', description: 'AI robotics for hotels', logo: 'https://www.maidbot.com/favicon.ico', category: 'Travel AI', link: 'https://www.maidbot.com/', pricing: 'premium' },
        { name: 'Connie', description: 'Hiltons AI concierge', logo: 'https://www.hilton.com/favicon.ico', category: 'Travel AI', link: 'https://www.hilton.com/', pricing: 'premium' },
        { name: 'Waylo', description: 'AI hotel price prediction', logo: 'https://waylo.com/favicon.ico', category: 'Travel AI', link: 'https://waylo.com/', pricing: 'freemium' }
    ],
    'ai-weather': [
        { name: 'Weather.gov', description: 'Free NOAA weather forecasts and data', logo: 'https://www.weather.gov/favicon.ico', category: 'Weather AI', link: 'https://www.weather.gov/', pricing: 'free' },
        { name: 'OpenWeatherMap', description: 'Free weather data and forecasts API', logo: 'https://openweathermap.org/favicon.ico', category: 'Weather AI', link: 'https://openweathermap.org/', pricing: 'free' },
        { name: 'ClimaCell', description: 'AI-powered weather forecasting', logo: 'https://www.climacell.co/favicon.ico', category: 'Weather AI', link: 'https://www.climacell.co/', pricing: 'premium' },
        { name: 'IBM Weather', description: 'AI weather intelligence platform', logo: 'https://www.ibm.com/weather/favicon.ico', category: 'Weather AI', link: 'https://www.ibm.com/weather', pricing: 'premium' },
        { name: 'Atmo', description: 'AI atmospheric modeling', logo: 'https://atmo.ai/favicon.ico', category: 'Weather AI', link: 'https://atmo.ai/', pricing: 'premium' },
        { name: 'Understory', description: 'AI weather monitoring network', logo: 'https://understory.com/favicon.ico', category: 'Weather AI', link: 'https://understory.com/', pricing: 'premium' },
        { name: 'Jupiter Intelligence', description: 'Climate risk analytics', logo: 'https://jupiterintel.com/favicon.ico', category: 'Weather AI', link: 'https://jupiterintel.com/', pricing: 'premium' },
        { name: 'Salient Predictions', description: 'AI long-range weather forecasting', logo: 'https://salientpredictions.com/favicon.ico', category: 'Weather AI', link: 'https://salientpredictions.com/', pricing: 'premium' },
        { name: 'Gro Intelligence', description: 'AI climate and agricultural data', logo: 'https://gro-intelligence.com/favicon.ico', category: 'Weather AI', link: 'https://gro-intelligence.com/', pricing: 'premium' },
        { name: 'WeatherBug', description: 'AI-enhanced weather forecasting', logo: 'https://www.weatherbug.com/favicon.ico', category: 'Weather AI', link: 'https://www.weatherbug.com/', pricing: 'freemium' },
        { name: 'Windy', description: 'Interactive weather forecasting', logo: 'https://www.windy.com/favicon.ico', category: 'Weather AI', link: 'https://www.windy.com/', pricing: 'freemium' },
        { name: 'Tempest', description: 'AI weather station network', logo: 'https://weatherflow.com/favicon.ico', category: 'Weather AI', link: 'https://weatherflow.com/tempest-weather-system/', pricing: 'premium' }
    ],
    'ai-sports': [
        { name: 'Strava Free', description: 'Free fitness tracking and social network', logo: 'https://www.strava.com/favicon.ico', category: 'Sports AI', link: 'https://www.strava.com', pricing: 'free' },
        { name: 'Runkeeper', description: 'Free running and fitness tracker', logo: 'https://runkeeper.com/favicon.ico', category: 'Sports AI', link: 'https://runkeeper.com', pricing: 'free' },
        { name: 'Sportlogiq', description: 'AI sports analytics platform', logo: 'https://www.sportlogiq.com/favicon.ico', category: 'Sports AI', link: 'https://www.sportlogiq.com/', pricing: 'premium' },
        { name: 'Second Spectrum', description: 'AI-powered sports tracking', logo: 'https://www.secondspectrum.com/favicon.ico', category: 'Sports AI', link: 'https://www.secondspectrum.com/', pricing: 'premium' },
        { name: 'Hawk-Eye', description: 'Computer vision for sports officiating', logo: 'https://www.hawkeyeinnovations.com/favicon.ico', category: 'Sports AI', link: 'https://www.hawkeyeinnovations.com/', pricing: 'premium' },
        { name: 'Stats Perform', description: 'Sports data and AI analytics', logo: 'https://www.statsperform.com/favicon.ico', category: 'Sports AI', link: 'https://www.statsperform.com/', pricing: 'premium' },
        { name: 'Kinexon', description: 'Athlete performance tracking', logo: 'https://kinexon.com/favicon.ico', category: 'Sports AI', link: 'https://kinexon.com/', pricing: 'premium' },
        { name: 'Kitman Labs', description: 'Sports performance analytics', logo: 'https://www.kitmanlabs.com/favicon.ico', category: 'Sports AI', link: 'https://www.kitmanlabs.com/', pricing: 'premium' },
        { name: 'Hudl', description: 'Video analysis for sports teams', logo: 'https://www.hudl.com/favicon.ico', category: 'Sports AI', link: 'https://www.hudl.com/', pricing: 'freemium' },
        { name: 'Catapult', description: 'Wearable analytics for athletes', logo: 'https://www.catapultsports.com/favicon.ico', category: 'Sports AI', link: 'https://www.catapultsports.com/', pricing: 'premium' },
        { name: 'Genius Sports', description: 'Sports data and technology', logo: 'https://www.geniussports.com/favicon.ico', category: 'Sports AI', link: 'https://www.geniussports.com/', pricing: 'premium' },
        { name: 'PlayerMaker', description: 'Football performance analytics', logo: 'https://playermaker.com/favicon.ico', category: 'Sports AI', link: 'https://playermaker.com/', pricing: 'premium' }
    ],
    'ai-music-analysis': [
        { name: 'Shazam Free', description: 'Free AI music recognition app', logo: 'https://www.shazam.com/favicon.ico', category: 'Music Analysis AI', link: 'https://www.shazam.com', pricing: 'free' },
        { name: 'SoundHound', description: 'Free music recognition and discovery', logo: 'https://www.soundhound.com/favicon.ico', category: 'Music Analysis AI', link: 'https://www.soundhound.com', pricing: 'free' },
        { name: 'Spotify', description: 'AI-powered music recommendations', logo: 'https://www.spotify.com/favicon.ico', category: 'Music Analysis AI', link: 'https://www.spotify.com/', pricing: 'freemium' },
        { name: 'Pandora', description: 'Music Genome Project', logo: 'https://www.pandora.com/favicon.ico', category: 'Music Analysis AI', link: 'https://www.pandora.com/', pricing: 'freemium' },
        { name: 'Shazam', description: 'AI music recognition', logo: 'https://www.shazam.com/favicon.ico', category: 'Music Analysis AI', link: 'https://www.shazam.com/', pricing: 'freemium' },
        { name: 'Musiio', description: 'AI music tagging and curation', logo: 'https://www.musiio.com/favicon.ico', category: 'Music Analysis AI', link: 'https://www.musiio.com/', pricing: 'premium' },
        { name: 'Melodrive', description: 'Adaptive music AI', logo: 'https://melodrive.com/favicon.ico', category: 'Music Analysis AI', link: 'https://melodrive.com/', pricing: 'premium' },
        { name: 'Landr', description: 'AI music mastering', logo: 'https://www.landr.com/favicon.ico', category: 'Music Analysis AI', link: 'https://www.landr.com/', pricing: 'freemium' },
        { name: 'Moises', description: 'AI music separation', logo: 'https://moises.ai/favicon.ico', category: 'Music Analysis AI', link: 'https://moises.ai/', pricing: 'freemium' },
        { name: 'Muzeek', description: 'AI music analysis for sync licensing', logo: 'https://muzeek.com/favicon.ico', category: 'Music Analysis AI', link: 'https://muzeek.com/', pricing: 'premium' },
        { name: 'Cyanite', description: 'AI music tagging and search', logo: 'https://cyanite.ai/favicon.ico', category: 'Music Analysis AI', link: 'https://cyanite.ai/', pricing: 'premium' },
        { name: 'Sononym', description: 'AI sample browser', logo: 'https://www.sononym.net/favicon.ico', category: 'Music Analysis AI', link: 'https://www.sononym.net/', pricing: 'freemium' }
    ],
    'ai-fashion': [
        { name: 'Pinterest Lens', description: 'Free AI visual search for fashion', logo: 'https://www.pinterest.com/favicon.ico', category: 'Fashion AI', link: 'https://www.pinterest.com/', pricing: 'free' },
        { name: 'Google Lens', description: 'Free AI fashion recognition and shopping', logo: 'https://lens.google.com/favicon.ico', category: 'Fashion AI', link: 'https://lens.google.com/', pricing: 'free' },
        { name: 'Vue.ai', description: 'AI for fashion retail', logo: 'https://vue.ai/favicon.ico', category: 'Fashion AI', link: 'https://vue.ai/', pricing: 'premium' },
        { name: 'Stitch Fix', description: 'AI-powered personal styling', logo: 'https://www.stitchfix.com/favicon.ico', category: 'Fashion AI', link: 'https://www.stitchfix.com/', pricing: 'premium' },
        { name: 'Stylumia', description: 'Fashion trend forecasting with AI', logo: 'https://stylumia.ai/favicon.ico', category: 'Fashion AI', link: 'https://stylumia.ai/', pricing: 'premium' },
        { name: 'Heuritech', description: 'AI fashion trend forecasting', logo: 'https://www.heuritech.com/favicon.ico', category: 'Fashion AI', link: 'https://www.heuritech.com/', pricing: 'premium' },
        { name: 'Virtusize', description: 'AI clothing size recommendation', logo: 'https://www.virtusize.com/favicon.ico', category: 'Fashion AI', link: 'https://www.virtusize.com/', pricing: 'premium' },
        { name: 'Syte', description: 'Visual AI for fashion', logo: 'https://www.syte.ai/favicon.ico', category: 'Fashion AI', link: 'https://www.syte.ai/', pricing: 'premium' },
        { name: 'Intelistyle', description: 'AI fashion styling platform', logo: 'https://intelistyle.com/favicon.ico', category: 'Fashion AI', link: 'https://intelistyle.com/', pricing: 'freemium' },
        { name: 'Finery', description: 'AI wardrobe operating system', logo: 'https://finery.com/favicon.ico', category: 'Fashion AI', link: 'https://finery.com/', pricing: 'freemium' },
        { name: 'Mode.ai', description: 'Fashion visual search and chatbots', logo: 'https://mode.ai/favicon.ico', category: 'Fashion AI', link: 'https://mode.ai/', pricing: 'premium' },
        { name: 'Dress-X', description: 'Digital fashion platform', logo: 'https://dress-x.com/favicon.ico', category: 'Fashion AI', link: 'https://dress-x.com/', pricing: 'freemium' }
    ],
    'ai-gaming-design': [
        { name: 'Unity ML-Agents', description: 'Machine learning for game development', logo: 'https://unity.com/favicon.ico', category: 'Game Design AI', link: 'https://unity.com/products/machine-learning-agents', pricing: 'free' },
        { name: 'NVIDIA GameGAN', description: 'AI game generation technology', logo: 'https://www.nvidia.com/favicon.ico', category: 'Game Design AI', link: 'https://www.nvidia.com/en-us/research/ai-playground/', pricing: 'free' },
        { name: 'Promethean AI', description: 'AI for game environment design', logo: 'https://www.prometheanai.com/favicon.ico', category: 'Game Design AI', link: 'https://www.prometheanai.com/', pricing: 'freemium' },
        { name: 'modl.ai', description: 'AI tools for game development', logo: 'https://modl.ai/favicon.ico', category: 'Game Design AI', link: 'https://modl.ai/', pricing: 'freemium' },
        { name: 'Spirit AI', description: 'AI for game character behavior', logo: 'https://spiritai.com/favicon.ico', category: 'Game Design AI', link: 'https://spiritai.com/', pricing: 'premium' },
        { name: 'Latent Space', description: 'AI-assisted game development', logo: 'https://latent.space/favicon.ico', category: 'Game Design AI', link: 'https://latent.space/', pricing: 'freemium' },
        { name: 'Anything World', description: '3D content generation for games', logo: 'https://anything.world/favicon.ico', category: 'Game Design AI', link: 'https://anything.world/', pricing: 'freemium' },
        { name: 'Replica Studios', description: 'AI voice actors for games', logo: 'https://replicastudios.com/favicon.ico', category: 'Game Design AI', link: 'https://replicastudios.com/', pricing: 'premium' },
        { name: 'Inworld AI', description: 'AI characters for games', logo: 'https://inworld.ai/favicon.ico', category: 'Game Design AI', link: 'https://inworld.ai/', pricing: 'freemium' },
        { name: 'Scenario', description: 'AI-generated game assets', logo: 'https://www.scenario.com/favicon.ico', category: 'Game Design AI', link: 'https://www.scenario.com/', pricing: 'freemium' }
    ],

        'code-debuggers': [
            { name: 'Chrome DevTools', description: 'Free built-in browser debugging tools', logo: 'https://www.google.com/chrome/static/images/favicons/favicon-96x96.png', category: 'Code Debuggers', link: 'https://developer.chrome.com/docs/devtools/', pricing: 'free' },
            { name: 'Sentry', description: 'Real-time error tracking and debugging for code', logo: 'https://sentry.io/_assets/favicon.ico', category: 'Code Debuggers', link: 'https://sentry.io/', pricing: 'freemium' },
            { name: 'Airbrake', description: 'Error monitoring and debugging for developers', logo: 'https://airbrake.io/favicon.ico', category: 'Code Debuggers', link: 'https://airbrake.io/', pricing: 'freemium' },
            { name: 'Rollbar', description: 'Continuous code improvement and debugging', logo: 'https://rollbar.com/favicon.ico', category: 'Code Debuggers', link: 'https://rollbar.com/', pricing: 'freemium' },
            { name: 'Raygun', description: 'Error, crash, and performance monitoring', logo: 'https://raygun.com/favicon.ico', category: 'Code Debuggers', link: 'https://raygun.com/', pricing: 'freemium' },
            { name: 'BugSnag', description: 'Error monitoring and reporting for apps', logo: 'https://www.bugsnag.com/favicon.ico', category: 'Code Debuggers', link: 'https://www.bugsnag.com/', pricing: 'freemium' },
            { name: 'Instabug', description: 'Bug reporting and in-app debugging', logo: 'https://instabug.com/favicon.ico', category: 'Code Debuggers', link: 'https://instabug.com/', pricing: 'freemium' },
            { name: 'LogRocket', description: 'Session replay and debugging for web apps', logo: 'https://logrocket.com/favicon.ico', category: 'Code Debuggers', link: 'https://logrocket.com/', pricing: 'freemium' },
            { name: 'Rookout', description: 'Live debugging for cloud-native apps', logo: 'https://www.rookout.com/favicon.ico', category: 'Code Debuggers', link: 'https://www.rookout.com/', pricing: 'freemium' },
            { name: 'AppSignal', description: 'Error tracking and performance monitoring', logo: 'https://appsignal.com/favicon.ico', category: 'Code Debuggers', link: 'https://appsignal.com/', pricing: 'freemium' },
            { name: 'Honeybadger', description: 'Exception, uptime, and error monitoring', logo: 'https://www.honeybadger.io/favicon.ico', category: 'Code Debuggers', link: 'https://www.honeybadger.io/', pricing: 'freemium' },
            { name: 'GlitchTip', description: 'Open-source error tracking and debugging', logo: 'https://glitchtip.com/favicon.ico', category: 'Code Debuggers', link: 'https://glitchtip.com/', pricing: 'free' },
            { name: 'Codecov', description: 'Code coverage and debugging insights', logo: 'https://about.codecov.io/wp-content/uploads/2021/06/favicon.png', category: 'Code Debuggers', link: 'https://about.codecov.io/', pricing: 'freemium' }
        ],
    'ai-ocean': [
        { name: 'Sofar Ocean', description: 'Ocean data platform with AI', logo: 'https://www.sofarocean.com/favicon.ico', category: 'Ocean AI', link: 'https://www.sofarocean.com/', pricing: 'premium' },
        { name: 'Saildrone', description: 'Autonomous ocean data collection', logo: 'https://www.saildrone.com/favicon.ico', category: 'Ocean AI', link: 'https://www.saildrone.com/', pricing: 'premium' },
        { name: 'Terradepth', description: 'Autonomous ocean data platform', logo: 'https://www.terradepth.com/favicon.ico', category: 'Ocean AI', link: 'https://www.terradepth.com/', pricing: 'premium' },
        { name: 'MBARI', description: 'AI for oceanographic research', logo: 'https://www.mbari.org/favicon.ico', category: 'Ocean AI', link: 'https://www.mbari.org/', pricing: 'free' },
        { name: 'OceanMind', description: 'AI for marine protection', logo: 'https://www.oceanmind.global/favicon.ico', category: 'Ocean AI', link: 'https://www.oceanmind.global/', pricing: 'premium' },
        { name: 'Planys Technologies', description: 'Underwater robotics with AI', logo: 'https://www.planystech.com/favicon.ico', category: 'Ocean AI', link: 'https://www.planystech.com/', pricing: 'premium' },
        { name: 'SINAY', description: 'Maritime data analytics platform', logo: 'https://sinay.ai/favicon.ico', category: 'Ocean AI', link: 'https://sinay.ai/', pricing: 'premium' },
        { name: 'FathomNet', description: 'Ocean image database for AI', logo: 'https://www.fathomnet.org/favicon.ico', category: 'Ocean AI', link: 'https://www.fathomnet.org/', pricing: 'free' },
        { name: 'Whale Seeker', description: 'AI whale detection from imagery', logo: 'https://www.whaleseeker.com/favicon.ico', category: 'Ocean AI', link: 'https://www.whaleseeker.com/', pricing: 'premium' },
        { name: 'NVIDIA AI for Ocean Science', description: 'AI solutions for oceanography', logo: 'https://www.nvidia.com/favicon.ico', category: 'Ocean AI', link: 'https://www.nvidia.com/en-us/industries/science/', pricing: 'premium' }
    ],

        'animation': [
    { name: 'OpenToonz', description: 'Open-source 2D animation software', logo: 'https://opentoonz.github.io/e/favicon.ico', category: 'Animation', link: 'https://opentoonz.github.io/e/', pricing: 'free' },
    { name: 'Pencil2D', description: 'Free and open-source animation tool', logo: 'https://www.pencil2d.org/favicon.ico', category: 'Animation', link: 'https://www.pencil2d.org/', pricing: 'free' },
    { name: 'Synfig Studio', description: 'Free 2D animation software', logo: 'https://www.synfig.org/favicon.ico', category: 'Animation', link: 'https://www.synfig.org/', pricing: 'free' },
    { name: 'n8n', description: 'Free and open workflow automation', logo: 'https://n8n.io/favicon.ico', category: 'Automation', link: 'https://n8n.io/', pricing: 'free' },
    { name: 'Node-RED', description: 'Open-source automation for IoT and more', logo: 'https://nodered.org/favicon.ico', category: 'Automation', link: 'https://nodered.org/', pricing: 'free' },
    { name: 'Automagica', description: 'Open-source RPA for automation', logo: 'https://automagica.com/favicon.ico', category: 'Automation', link: 'https://automagica.com/', pricing: 'free' },
            { name: 'Runway ML', description: 'AI-powered video and animation creation', logo: 'https://runwayml.com/favicon.ico', category: 'Animation', link: 'https://runwayml.com/', pricing: 'freemium' },
            { name: 'DeepMotion', description: 'AI motion capture and animation', logo: 'https://www.deepmotion.com/favicon.ico', category: 'Animation', link: 'https://www.deepmotion.com/', pricing: 'freemium' },
            { name: 'Kaiber', description: 'AI video and animation generator', logo: 'https://www.kaiber.ai/favicon.ico', category: 'Animation', link: 'https://www.kaiber.ai/', pricing: 'freemium' },
            { name: 'Animaker', description: 'DIY animation video maker with AI', logo: 'https://www.animaker.com/favicon.ico', category: 'Animation', link: 'https://www.animaker.com/', pricing: 'freemium' },
            { name: 'Powtoon', description: 'AI-powered animated video creation', logo: 'https://www.powtoon.com/favicon.ico', category: 'Animation', link: 'https://www.powtoon.com/', pricing: 'freemium' },
            { name: 'Vyond', description: 'AI-driven animation for business', logo: 'https://www.vyond.com/favicon.ico', category: 'Animation', link: 'https://www.vyond.com/', pricing: 'premium' },
            { name: 'Toonly', description: 'Drag-and-drop animation software', logo: 'https://www.toonly.com/favicon.ico', category: 'Animation', link: 'https://www.toonly.com/', pricing: 'premium' },
            { name: 'Animatron', description: 'Online animation maker with AI', logo: 'https://www.animatron.com/favicon.ico', category: 'Animation', link: 'https://www.animatron.com/', pricing: 'freemium' },
            { name: 'Moovly', description: 'AI-powered video and animation platform', logo: 'https://www.moovly.com/favicon.ico', category: 'Animation', link: 'https://www.moovly.com/', pricing: 'freemium' },
            { name: 'Renderforest', description: 'AI animation and video maker', logo: 'https://www.renderforest.com/favicon.ico', category: 'Animation', link: 'https://www.renderforest.com/', pricing: 'freemium' },
            { name: 'Synthesia', description: 'AI video and avatar animation', logo: 'https://www.synthesia.io/favicon.ico', category: 'Animation', link: 'https://www.synthesia.io/', pricing: 'premium' },
            { name: 'LottieFiles', description: 'AI-powered animation for web and apps', logo: 'https://lottiefiles.com/favicon.ico', category: 'Animation', link: 'https://lottiefiles.com/', pricing: 'freemium' }
        ],
    'ai-construction': [
    { name: 'OpenProject', description: 'Open-source project management for construction', logo: 'https://www.openproject.org/favicon.ico', category: 'Construction AI', link: 'https://www.openproject.org/', pricing: 'free' },
    { name: 'BIMserver', description: 'Open-source building information modeling server', logo: 'https://bimserver.org/favicon.ico', category: 'Construction AI', link: 'https://bimserver.org/', pricing: 'free' },
        { name: 'Buildots', description: 'AI construction site monitoring', logo: 'https://buildots.com/favicon.ico', category: 'Construction AI', link: 'https://buildots.com/', pricing: 'premium' },
        { name: 'Doxel', description: 'AI-powered construction monitoring', logo: 'https://www.doxel.ai/favicon.ico', category: 'Construction AI', link: 'https://www.doxel.ai/', pricing: 'premium' },
        { name: 'Disperse', description: 'AI construction progress tracking', logo: 'https://www.disperse.io/favicon.ico', category: 'Construction AI', link: 'https://www.disperse.io/', pricing: 'premium' },
        { name: 'Avvir', description: 'Construction verification platform', logo: 'https://www.avvir.io/favicon.ico', category: 'Construction AI', link: 'https://www.avvir.io/', pricing: 'premium' },
        { name: 'Smartvid.io', description: 'AI safety monitoring for construction', logo: 'https://www.smartvid.io/favicon.ico', category: 'Construction AI', link: 'https://www.smartvid.io/', pricing: 'premium' },
        { name: 'OpenSpace', description: 'AI construction site documentation', logo: 'https://www.openspace.ai/favicon.ico', category: 'Construction AI', link: 'https://www.openspace.ai/', pricing: 'premium' },
        { name: 'Indus.ai', description: 'Construction intelligence platform', logo: 'https://indus.ai/favicon.ico', category: 'Construction AI', link: 'https://indus.ai/', pricing: 'premium' },
        { name: 'Alice Technologies', description: 'AI construction scheduling', logo: 'https://www.alicetechnologies.com/favicon.ico', category: 'Construction AI', link: 'https://www.alicetechnologies.com/', pricing: 'premium' },
        { name: 'Versatile', description: 'AI-powered construction insights', logo: 'https://www.versatile.ai/favicon.ico', category: 'Construction AI', link: 'https://www.versatile.ai/', pricing: 'premium' },
        { name: 'Togal.AI', description: 'AI for construction estimating', logo: 'https://togal.ai/favicon.ico', category: 'Construction AI', link: 'https://togal.ai/', pricing: 'premium' }
    ],
    'ai-legal': [
    { name: 'Free Law Project', description: 'Open legal data and analytics', logo: 'https://free.law/favicon.ico', category: 'Legal AI', link: 'https://free.law/', pricing: 'free' },
    { name: 'CourtListener', description: 'Free legal research and alerts', logo: 'https://www.courtlistener.com/favicon.ico', category: 'Legal AI', link: 'https://www.courtlistener.com/', pricing: 'free' },
        { name: 'ROSS Intelligence', description: 'AI legal research platform', logo: 'https://rossintelligence.com/favicon.ico', category: 'Legal AI', link: 'https://rossintelligence.com/', pricing: 'premium' },
        { name: 'Casetext', description: 'AI-powered legal research assistant', logo: 'https://casetext.com/favicon.ico', category: 'Legal AI', link: 'https://casetext.com/', pricing: 'premium' },
        { name: 'Kira Systems', description: 'AI contract analysis software', logo: 'https://kirasystems.com/favicon.ico', category: 'Legal AI', link: 'https://kirasystems.com/', pricing: 'premium' },
        { name: 'Luminance', description: 'AI document analysis for legal teams', logo: 'https://www.luminance.com/favicon.ico', category: 'Legal AI', link: 'https://www.luminance.com/', pricing: 'premium' },
        { name: 'LawGeex', description: 'AI contract review automation', logo: 'https://www.lawgeex.com/favicon.ico', category: 'Legal AI', link: 'https://www.lawgeex.com/', pricing: 'premium' },
        { name: 'Everlaw', description: 'AI-powered litigation platform', logo: 'https://www.everlaw.com/favicon.ico', category: 'Legal AI', link: 'https://www.everlaw.com/', pricing: 'premium' },
        { name: 'Disco', description: 'AI-powered legal discovery', logo: 'https://www.csdisco.com/favicon.ico', category: 'Legal AI', link: 'https://www.csdisco.com/', pricing: 'premium' },
        { name: 'Relativity', description: 'E-discovery and compliance platform', logo: 'https://www.relativity.com/favicon.ico', category: 'Legal AI', link: 'https://www.relativity.com/', pricing: 'premium' },
        { name: 'Lexion', description: 'AI contract management', logo: 'https://lexion.ai/favicon.ico', category: 'Legal AI', link: 'https://lexion.ai/', pricing: 'premium' },
        { name: 'Evisort', description: 'AI-powered contract intelligence', logo: 'https://www.evisort.com/favicon.ico', category: 'Legal AI', link: 'https://www.evisort.com/', pricing: 'premium' }
    ],
    'ai-astronomy': [
        { name: 'Frontier Development Lab', description: 'AI for space science', logo: 'https://frontierdevelopmentlab.org/favicon.ico', category: 'Astronomy AI', link: 'https://frontierdevelopmentlab.org/', pricing: 'free' },
        { name: 'SpaceML', description: 'AI for Earth observation and space', logo: 'https://www.spaceml.org/favicon.ico', category: 'Astronomy AI', link: 'https://www.spaceml.org/', pricing: 'free' },
        { name: 'Astromatic', description: 'AI software for astronomical images', logo: 'https://www.astromatic.net/favicon.ico', category: 'Astronomy AI', link: 'https://www.astromatic.net/', pricing: 'free' },
        { name: 'Slooh', description: 'AI-enhanced telescope network', logo: 'https://www.slooh.com/favicon.ico', category: 'Astronomy AI', link: 'https://www.slooh.com/', pricing: 'freemium' },
        { name: 'Unistellar', description: 'Smart telescopes with AI', logo: 'https://unistellaroptics.com/favicon.ico', category: 'Astronomy AI', link: 'https://unistellaroptics.com/', pricing: 'premium' },
        { name: 'AstroAI', description: 'AI for astronomical discovery', logo: 'https://www.astroai.org/favicon.ico', category: 'Astronomy AI', link: 'https://www.astroai.org/', pricing: 'free' },
        { name: 'Astraea', description: 'Earth observation AI platform', logo: 'https://astraea.earth/favicon.ico', category: 'Astronomy AI', link: 'https://astraea.earth/', pricing: 'premium' },
        { name: 'Exoplanet AI', description: 'AI for exoplanet detection', logo: 'https://www.exoplanet.ai/favicon.ico', category: 'Astronomy AI', link: 'https://www.exoplanet.ai/', pricing: 'free' },
        { name: 'Cosmotech', description: 'AI for space situational awareness', logo: 'https://cosmotech.com/favicon.ico', category: 'Astronomy AI', link: 'https://cosmotech.com/', pricing: 'premium' },
        { name: 'Morpheus Space', description: 'AI spacecraft autonomy', logo: 'https://morpheus-space.com/favicon.ico', category: 'Astronomy AI', link: 'https://morpheus-space.com/', pricing: 'premium' }
    ],
    'ai-archaeology': [
        { name: 'ArchAI', description: 'AI for archaeological site detection', logo: 'https://www.archai.io/favicon.ico', category: 'Archaeology AI', link: 'https://www.archai.io/', pricing: 'premium' },
        { name: 'Arches Project', description: 'AI heritage inventory platform', logo: 'https://www.archesproject.org/favicon.ico', category: 'Archaeology AI', link: 'https://www.archesproject.org/', pricing: 'free' },
        { name: 'Archaeobotics', description: 'AI robotics for archaeology', logo: 'https://archaeobotics.com/favicon.ico', category: 'Archaeology AI', link: 'https://archaeobotics.com/', pricing: 'premium' },
        { name: 'Archeo', description: 'AI artifact recognition system', logo: 'https://archeo.ai/favicon.ico', category: 'Archaeology AI', link: 'https://archeo.ai/', pricing: 'freemium' },
        { name: 'Antiquity AI', description: 'AI for ancient text translation', logo: 'https://antiquity.ai/favicon.ico', category: 'Archaeology AI', link: 'https://antiquity.ai/', pricing: 'freemium' },
        { name: 'DeepDig', description: 'AI for archaeological excavation', logo: 'https://deepdig.org/favicon.ico', category: 'Archaeology AI', link: 'https://deepdig.org/', pricing: 'premium' },
        { name: 'Heritage AI', description: 'AI for cultural heritage preservation', logo: 'https://heritage.ai/favicon.ico', category: 'Archaeology AI', link: 'https://heritage.ai/', pricing: 'premium' },
        { name: 'Strabo', description: 'AI for archaeological mapping', logo: 'https://strabospot.org/favicon.ico', category: 'Archaeology AI', link: 'https://strabospot.org/', pricing: 'free' },
        { name: 'Artifact Analytics', description: 'AI artifact classification', logo: 'https://artifactanalytics.com/favicon.ico', category: 'Archaeology AI', link: 'https://artifactanalytics.com/', pricing: 'premium' },
        { name: 'DigitalAnthro', description: 'AI for anthropological research', logo: 'https://digitalanthro.ai/favicon.ico', category: 'Archaeology AI', link: 'https://digitalanthro.ai/', pricing: 'freemium' }
    ],
    'ai-wildlife': [
        { name: 'Wildbook', description: 'AI wildlife monitoring platform', logo: 'https://www.wildbook.org/favicon.ico', category: 'Wildlife AI', link: 'https://www.wildbook.org/', pricing: 'free' },
        { name: 'Conservation Metrics', description: 'AI wildlife monitoring solutions', logo: 'https://conservationmetrics.com/favicon.ico', category: 'Wildlife AI', link: 'https://conservationmetrics.com/', pricing: 'premium' },
        { name: 'Wildlife Insights', description: 'AI camera trap analysis', logo: 'https://www.wildlifeinsights.org/favicon.ico', category: 'Wildlife AI', link: 'https://www.wildlifeinsights.org/', pricing: 'free' },
        { name: 'Rainforest Connection', description: 'AI acoustic monitoring for conservation', logo: 'https://rfcx.org/favicon.ico', category: 'Wildlife AI', link: 'https://rfcx.org/', pricing: 'free' },
        { name: 'TrailGuard AI', description: 'AI camera system for anti-poaching', logo: 'https://www.resolve.ngo/favicon.ico', category: 'Wildlife AI', link: 'https://www.resolve.ngo/trailguard.htm', pricing: 'premium' },
        { name: 'Wild Me', description: 'AI for wildlife conservation', logo: 'https://www.wildme.org/favicon.ico', category: 'Wildlife AI', link: 'https://www.wildme.org/', pricing: 'free' },
        { name: 'Zamba Cloud', description: 'AI wildlife identification platform', logo: 'https://zamba.drivendata.org/favicon.ico', category: 'Wildlife AI', link: 'https://zamba.drivendata.org/', pricing: 'freemium' },
        { name: 'Conservify', description: 'AI tools for field biologists', logo: 'https://conservify.org/favicon.ico', category: 'Wildlife AI', link: 'https://conservify.org/', pricing: 'free' },
        { name: 'Wildtrack', description: 'AI footprint identification technology', logo: 'https://wildtrack.org/favicon.ico', category: 'Wildlife AI', link: 'https://wildtrack.org/', pricing: 'free' },
        { name: 'Whale Safe', description: 'AI whale detection system', logo: 'https://whalesafe.com/favicon.ico', category: 'Wildlife AI', link: 'https://whalesafe.com/', pricing: 'free' }
    ],
    'ai-transportation': [
        { name: 'Waymo', description: 'Autonomous driving technology', logo: 'https://waymo.com/favicon.ico', category: 'Transportation AI', link: 'https://waymo.com/', pricing: 'premium' },
        { name: 'Cruise', description: 'Self-driving vehicle technology', logo: 'https://www.getcruise.com/favicon.ico', category: 'Transportation AI', link: 'https://www.getcruise.com/', pricing: 'premium' },
        { name: 'Optibus', description: 'AI public transportation optimization', logo: 'https://www.optibus.com/favicon.ico', category: 'Transportation AI', link: 'https://www.optibus.com/', pricing: 'premium' },
        { name: 'Nexar', description: 'AI dash cam network', logo: 'https://www.getnexar.com/favicon.ico', category: 'Transportation AI', link: 'https://www.getnexar.com/', pricing: 'freemium' },
        { name: 'Nauto', description: 'AI fleet safety platform', logo: 'https://www.nauto.com/favicon.ico', category: 'Transportation AI', link: 'https://www.nauto.com/', pricing: 'premium' },
        { name: 'Bestmile', description: 'Fleet orchestration platform', logo: 'https://bestmile.com/favicon.ico', category: 'Transportation AI', link: 'https://bestmile.com/', pricing: 'premium' },
        { name: 'Swiftly', description: 'Public transit optimization platform', logo: 'https://www.goswift.ly/favicon.ico', category: 'Transportation AI', link: 'https://www.goswift.ly/', pricing: 'premium' },
        { name: 'Remix', description: 'Transit planning platform', logo: 'https://www.remix.com/favicon.ico', category: 'Transportation AI', link: 'https://www.remix.com/', pricing: 'premium' },
        { name: 'Waze', description: 'AI-powered navigation app', logo: 'https://www.waze.com/favicon.ico', category: 'Transportation AI', link: 'https://www.waze.com/', pricing: 'free' },
        { name: 'Mobileye', description: 'Computer vision for autonomous driving', logo: 'https://www.mobileye.com/favicon.ico', category: 'Transportation AI', link: 'https://www.mobileye.com/', pricing: 'premium' }
    ],
    'ai-insurance': [
    { name: 'OpenUnderwriter', description: 'Open-source insurance underwriting platform', logo: 'https://openunderwriter.com/favicon.ico', category: 'Insurance AI', link: 'https://openunderwriter.com/', pricing: 'free' },
    { name: 'RiskGenius Free', description: 'Free insurance policy analysis tools', logo: 'https://riskgenius.com/favicon.ico', category: 'Insurance AI', link: 'https://riskgenius.com/', pricing: 'free' },
        { name: 'Lemonade', description: 'AI-powered insurance company', logo: 'https://www.lemonade.com/favicon.ico', category: 'Insurance AI', link: 'https://www.lemonade.com/', pricing: 'freemium' },
        { name: 'Tractable', description: 'AI for accident and disaster recovery', logo: 'https://tractable.ai/favicon.ico', category: 'Insurance AI', link: 'https://tractable.ai/', pricing: 'premium' },
        { name: 'Shift Technology', description: 'AI fraud detection for insurance', logo: 'https://www.shift-technology.com/favicon.ico', category: 'Insurance AI', link: 'https://www.shift-technology.com/', pricing: 'premium' },
        { name: 'Cape Analytics', description: 'AI property intelligence', logo: 'https://capeanalytics.com/favicon.ico', category: 'Insurance AI', link: 'https://capeanalytics.com/', pricing: 'premium' },
        { name: 'Zesty.ai', description: 'AI property risk analytics', logo: 'https://zesty.ai/favicon.ico', category: 'Insurance AI', link: 'https://zesty.ai/', pricing: 'premium' },
        { name: 'Flyreel', description: 'AI property insurance assistant', logo: 'https://flyreel.co/favicon.ico', category: 'Insurance AI', link: 'https://flyreel.co/', pricing: 'premium' },
        { name: 'Planck', description: 'AI commercial insurance data platform', logo: 'https://planckdata.com/favicon.ico', category: 'Insurance AI', link: 'https://planckdata.com/', pricing: 'premium' },
        { name: 'Root Insurance', description: 'AI-based auto insurance', logo: 'https://www.joinroot.com/favicon.ico', category: 'Insurance AI', link: 'https://www.joinroot.com/', pricing: 'freemium' },
        { name: 'Clearcover', description: 'AI-driven car insurance', logo: 'https://clearcover.com/favicon.ico', category: 'Insurance AI', link: 'https://clearcover.com/', pricing: 'freemium' },
        { name: 'Snapsheet', description: 'Virtual claims processing platform', logo: 'https://www.snapsheetclaims.com/favicon.ico', category: 'Insurance AI', link: 'https://www.snapsheetclaims.com/', pricing: 'premium' }
    ],
    'ai-mental-health': [
        { name: 'Woebot', description: 'AI mental health chatbot', logo: 'https://woebothealth.com/favicon.ico', category: 'Mental Health AI', link: 'https://woebothealth.com/', pricing: 'freemium' },
        { name: 'Wysa', description: 'AI mental wellness coach', logo: 'https://www.wysa.io/favicon.ico', category: 'Mental Health AI', link: 'https://www.wysa.io/', pricing: 'freemium' },
        { name: 'Youper', description: 'AI emotional health assistant', logo: 'https://www.youper.ai/favicon.ico', category: 'Mental Health AI', link: 'https://www.youper.ai/', pricing: 'freemium' },
        { name: 'Replika', description: 'AI companion for mental wellbeing', logo: 'https://replika.ai/favicon.ico', category: 'Mental Health AI', link: 'https://replika.ai/', pricing: 'freemium' },
        { name: 'Mindstrong', description: 'Digital biomarkers for mental health', logo: 'https://mindstrong.com/favicon.ico', category: 'Mental Health AI', link: 'https://mindstrong.com/', pricing: 'premium' },
        { name: 'Spring Health', description: 'AI-powered mental healthcare', logo: 'https://www.springhealth.com/favicon.ico', category: 'Mental Health AI', link: 'https://www.springhealth.com/', pricing: 'premium' },
        { name: 'Quartet Health', description: 'AI mental health platform', logo: 'https://www.quartethealth.com/favicon.ico', category: 'Mental Health AI', link: 'https://www.quartethealth.com/', pricing: 'premium' },
        { name: 'Ginger', description: 'On-demand mental healthcare', logo: 'https://www.ginger.com/favicon.ico', category: 'Mental Health AI', link: 'https://www.ginger.com/', pricing: 'premium' },
        { name: 'Koko', description: 'AI peer support platform', logo: 'https://www.koko.ai/favicon.ico', category: 'Mental Health AI', link: 'https://www.koko.ai/', pricing: 'free' },
        { name: 'Moodpath', description: 'AI mood tracking and analysis', logo: 'https://mymoodpath.com/favicon.ico', category: 'Mental Health AI', link: 'https://mymoodpath.com/', pricing: 'freemium' }
    ],
    'ai-journalism': [
        { name: 'Automated Insights', description: 'Natural language generation for news', logo: 'https://automatedinsights.com/favicon.ico', category: 'Journalism AI', link: 'https://automatedinsights.com/', pricing: 'premium' },
        { name: 'Narrative Science', description: 'AI-powered news writing', logo: 'https://narrativescience.com/favicon.ico', category: 'Journalism AI', link: 'https://narrativescience.com/', pricing: 'premium' },
        { name: 'Juicer', description: 'AI news aggregation platform', logo: 'https://www.juicer.io/favicon.ico', category: 'Journalism AI', link: 'https://www.juicer.io/', pricing: 'freemium' },
        { name: 'Trint', description: 'AI transcription for journalists', logo: 'https://trint.com/favicon.ico', category: 'Journalism AI', link: 'https://trint.com/', pricing: 'freemium' },
        { name: 'Otter.ai', description: 'AI interview transcription', logo: 'https://otter.ai/favicon.ico', category: 'Journalism AI', link: 'https://otter.ai/', pricing: 'freemium' },
        { name: 'Knowhere News', description: 'AI-powered unbiased news', logo: 'https://knowherenews.com/favicon.ico', category: 'Journalism AI', link: 'https://knowherenews.com/', pricing: 'free' },
        { name: 'Primer', description: 'AI information analysis platform', logo: 'https://primer.ai/favicon.ico', category: 'Journalism AI', link: 'https://primer.ai/', pricing: 'premium' },
        { name: 'NewsWhip', description: 'AI content intelligence platform', logo: 'https://www.newswhip.com/favicon.ico', category: 'Journalism AI', link: 'https://www.newswhip.com/', pricing: 'premium' },
        { name: 'Dataminr', description: 'Real-time AI event detection', logo: 'https://www.dataminr.com/favicon.ico', category: 'Journalism AI', link: 'https://www.dataminr.com/', pricing: 'premium' },
        { name: 'Chartbeat', description: 'AI content analytics for publishers', logo: 'https://chartbeat.com/favicon.ico', category: 'Journalism AI', link: 'https://chartbeat.com/', pricing: 'premium' }
    ],
    'ai-water-management': [
    { name: 'Open Water Analytics', description: 'Open-source water management tools', logo: 'https://openwateranalytics.com/favicon.ico', category: 'Water Management AI', link: 'https://openwateranalytics.com/', pricing: 'free' },
    { name: 'AQUARIUS', description: 'Free water data management platform', logo: 'https://aquaticinformatics.com/favicon.ico', category: 'Water Management AI', link: 'https://aquaticinformatics.com/solutions/aquarius/', pricing: 'free' },
        { name: 'Pluto AI', description: 'AI water treatment analytics', logo: 'https://plutoai.com/favicon.ico', category: 'Water Management AI', link: 'https://plutoai.com/', pricing: 'premium' },
        { name: 'Ketos', description: 'AI water quality monitoring', logo: 'https://ketos.co/favicon.ico', category: 'Water Management AI', link: 'https://ketos.co/', pricing: 'premium' },
        { name: 'Aquasight', description: 'AI water utility optimization', logo: 'https://www.aquasight.io/favicon.ico', category: 'Water Management AI', link: 'https://www.aquasight.io/', pricing: 'premium' },
        { name: 'Fracta', description: 'AI water infrastructure assessment', logo: 'https://fracta.ai/favicon.ico', category: 'Water Management AI', link: 'https://fracta.ai/', pricing: 'premium' },
        { name: 'Emagin', description: 'AI water management platform', logo: 'https://emagin.ai/favicon.ico', category: 'Water Management AI', link: 'https://emagin.ai/', pricing: 'premium' },
        { name: 'Utilis', description: 'Satellite-based water leak detection', logo: 'https://utiliscorp.com/favicon.ico', category: 'Water Management AI', link: 'https://utiliscorp.com/', pricing: 'premium' },
        { name: 'Fathom', description: 'AI flood risk modeling', logo: 'https://www.fathom.global/favicon.ico', category: 'Water Management AI', link: 'https://www.fathom.global/', pricing: 'premium' },
        { name: 'Dropcountr', description: 'AI water conservation platform', logo: 'https://dropcountr.com/favicon.ico', category: 'Water Management AI', link: 'https://dropcountr.com/', pricing: 'freemium' },
        { name: 'Watchtower Robotics', description: 'AI water pipe inspection', logo: 'https://watchtower-robotics.com/favicon.ico', category: 'Water Management AI', link: 'https://watchtower-robotics.com/', pricing: 'premium' },
        { name: 'Varuna', description: 'AI water quality monitoring platform', logo: 'https://www.varuna.io/favicon.ico', category: 'Water Management AI', link: 'https://www.varuna.io/', pricing: 'premium' }
    ],
    'ai-space': [
    { name: 'OpenSpace', description: 'Open-source space data and analytics', logo: 'https://openspaceproject.com/favicon.ico', category: 'Space AI', link: 'https://openspaceproject.com/', pricing: 'free' },
    { name: 'ESA Open Data Portal', description: 'Free satellite and space data', logo: 'https://www.esa.int/favicon.ico', category: 'Space AI', link: 'https://www.esa.int/Applications/Observing_the_Earth/Open_data_portal', pricing: 'free' },
        { name: 'SpaceKnow', description: 'Satellite imagery analytics', logo: 'https://www.spaceknow.com/favicon.ico', category: 'Space AI', link: 'https://www.spaceknow.com/', pricing: 'premium' },
        { name: 'Orbital Insight', description: 'Geospatial analytics platform', logo: 'https://orbitalinsight.com/favicon.ico', category: 'Space AI', link: 'https://orbitalinsight.com/', pricing: 'premium' },
        { name: 'Descartes Labs', description: 'Geospatial intelligence platform', logo: 'https://www.descarteslabs.com/favicon.ico', category: 'Space AI', link: 'https://www.descarteslabs.com/', pricing: 'premium' },
        { name: 'Planet', description: 'Earth imaging and analytics', logo: 'https://www.planet.com/favicon.ico', category: 'Space AI', link: 'https://www.planet.com/', pricing: 'premium' },
        { name: 'Capella Space', description: 'SAR satellite imagery with AI', logo: 'https://www.capellaspace.com/favicon.ico', category: 'Space AI', link: 'https://www.capellaspace.com/', pricing: 'premium' },
        { name: 'Ursa Space', description: 'Satellite intelligence platform', logo: 'https://www.ursaspace.com/favicon.ico', category: 'Space AI', link: 'https://www.ursaspace.com/', pricing: 'premium' },
        { name: 'Hypergiant', description: 'AI solutions for space industry', logo: 'https://www.hypergiant.com/favicon.ico', category: 'Space AI', link: 'https://www.hypergiant.com/', pricing: 'premium' },
        { name: 'Maxar', description: 'Space infrastructure and intelligence', logo: 'https://www.maxar.com/favicon.ico', category: 'Space AI', link: 'https://www.maxar.com/', pricing: 'premium' },
        { name: 'Slingshot Aerospace', description: 'Space situational awareness', logo: 'https://slingshotaerospace.com/favicon.ico', category: 'Space AI', link: 'https://slingshotaerospace.com/', pricing: 'premium' },
        { name: 'AstroCognition', description: 'AI for space exploration', logo: 'https://astrocognition.org/favicon.ico', category: 'Space AI', link: 'https://astrocognition.org/', pricing: 'free' }
    ],
    'ai-blockchain': [
        { name: 'Chainlink AI', description: 'AI-powered oracle network for blockchain', logo: 'https://chain.link/favicon.ico', category: 'Blockchain AI', link: 'https://chain.link/', pricing: 'free' },
        { name: 'Ocean Protocol', description: 'Decentralized data exchange protocol', logo: 'https://oceanprotocol.com/favicon.ico', category: 'Blockchain AI', link: 'https://oceanprotocol.com/', pricing: 'free' },
        { name: 'SingularityNET', description: 'Decentralized AI marketplace', logo: 'https://singularitynet.io/favicon.ico', category: 'Blockchain AI', link: 'https://singularitynet.io/', pricing: 'freemium' },
        { name: 'Fetch.ai', description: 'AI-powered autonomous economic agents', logo: 'https://fetch.ai/favicon.ico', category: 'Blockchain AI', link: 'https://fetch.ai/', pricing: 'freemium' },
        { name: 'Numerai', description: 'AI-powered hedge fund on blockchain', logo: 'https://numer.ai/favicon.ico', category: 'Blockchain AI', link: 'https://numer.ai/', pricing: 'freemium' },
        { name: 'Cortex', description: 'AI on blockchain platform', logo: 'https://www.cortexlabs.ai/favicon.ico', category: 'Blockchain AI', link: 'https://www.cortexlabs.ai/', pricing: 'freemium' },
        { name: 'DeepBrain Chain', description: 'Distributed AI computing platform', logo: 'https://www.deepbrainchain.org/favicon.ico', category: 'Blockchain AI', link: 'https://www.deepbrainchain.org/', pricing: 'freemium' },
        { name: 'Matrix AI Network', description: 'Intelligent blockchain platform', logo: 'https://www.matrix.io/favicon.ico', category: 'Blockchain AI', link: 'https://www.matrix.io/', pricing: 'freemium' },
        { name: 'Velas', description: 'AI-enhanced blockchain network', logo: 'https://velas.com/favicon.ico', category: 'Blockchain AI', link: 'https://velas.com/', pricing: 'freemium' },
        { name: 'Oraichain', description: 'AI-powered oracle platform', logo: 'https://orai.io/favicon.ico', category: 'Blockchain AI', link: 'https://orai.io/', pricing: 'freemium' }
    ],
    'ai-science': [
        { name: 'DeepMind AlphaFold', description: 'AI system for protein structure prediction', logo: 'https://deepmind.com/favicon.ico', category: 'Scientific Research', link: 'https://deepmind.com/research/case-studies/alphafold', pricing: 'free' },
        { name: 'Semantic Scholar', description: 'AI-powered research paper search engine', logo: 'https://www.semanticscholar.org/favicon.ico', category: 'Scientific Research', link: 'https://www.semanticscholar.org/', pricing: 'free' },
        { name: 'Elicit', description: 'AI research assistant', logo: 'https://elicit.org/favicon.ico', category: 'Scientific Research', link: 'https://elicit.org/', pricing: 'freemium' },
        { name: 'Iris.ai', description: 'AI engine for scientific research', logo: 'https://iris.ai/favicon.ico', category: 'Scientific Research', link: 'https://iris.ai/', pricing: 'freemium' },
        { name: 'Consensus', description: 'AI-powered search for scientific papers', logo: 'https://consensus.app/favicon.ico', category: 'Scientific Research', link: 'https://consensus.app/', pricing: 'freemium' },
        { name: 'BenevolentAI', description: 'AI drug discovery platform', logo: 'https://www.benevolent.com/favicon.ico', category: 'Scientific Research', link: 'https://www.benevolent.com/', pricing: 'premium' },
        { name: 'Insilico Medicine', description: 'AI for drug discovery and aging research', logo: 'https://insilico.com/favicon.ico', category: 'Scientific Research', link: 'https://insilico.com/', pricing: 'premium' },
        { name: 'Atomwise', description: 'AI for drug discovery', logo: 'https://www.atomwise.com/favicon.ico', category: 'Scientific Research', link: 'https://www.atomwise.com/', pricing: 'premium' },
        { name: 'Recursion', description: 'AI-powered drug discovery', logo: 'https://www.recursion.com/favicon.ico', category: 'Scientific Research', link: 'https://www.recursion.com/', pricing: 'premium' },
        { name: 'SciBite', description: 'AI-driven scientific data analytics', logo: 'https://www.scibite.com/favicon.ico', category: 'Scientific Research', link: 'https://www.scibite.com/', pricing: 'premium' }
    ],
    'ai-iot': [
    { name: 'Home Assistant', description: 'Open-source smart home automation', logo: 'https://www.home-assistant.io/favicon.ico', category: 'IoT & Smart Home', link: 'https://www.home-assistant.io/', pricing: 'free' },
    { name: 'OpenHAB', description: 'Free home automation platform', logo: 'https://www.openhab.org/favicon.ico', category: 'IoT & Smart Home', link: 'https://www.openhab.org/', pricing: 'free' },
        { name: 'Google Nest', description: 'AI-powered smart home devices', logo: 'https://store.google.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://store.google.com/category/connected_home', pricing: 'premium' },
        { name: 'Amazon Alexa', description: 'Voice assistant for smart homes', logo: 'https://alexa.amazon.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://alexa.amazon.com/', pricing: 'freemium' },
        { name: 'Samsung SmartThings', description: 'Smart home platform with AI integration', logo: 'https://www.smartthings.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://www.smartthings.com/', pricing: 'freemium' },
        { name: 'Ecobee', description: 'Smart thermostats with AI features', logo: 'https://www.ecobee.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://www.ecobee.com/', pricing: 'premium' },
        { name: 'Wyze', description: 'AI-powered smart home cameras', logo: 'https://wyze.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://wyze.com/', pricing: 'freemium' },
        { name: 'Arlo', description: 'AI security cameras and systems', logo: 'https://www.arlo.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://www.arlo.com/', pricing: 'premium' },
        { name: 'Ring', description: 'Smart doorbells with AI detection', logo: 'https://ring.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://ring.com/', pricing: 'premium' },
        { name: 'Philips Hue', description: 'Smart lighting with AI integration', logo: 'https://www.philips-hue.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://www.philips-hue.com/', pricing: 'premium' },
        { name: 'Wemo', description: 'Smart home automation devices', logo: 'https://www.wemo.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://www.wemo.com/', pricing: 'premium' },
        { name: 'Sensibo', description: 'AI-powered climate control', logo: 'https://sensibo.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://sensibo.com/', pricing: 'premium' }
    ],
    'ai-accessibility': [
        { name: 'Seeing AI', description: 'AI app for visually impaired users', logo: 'https://www.microsoft.com/favicon.ico', category: 'Accessibility Tools', link: 'https://www.microsoft.com/en-us/ai/seeing-ai', pricing: 'free' },
        { name: 'Be My Eyes', description: 'Visual assistance for blind people', logo: 'https://www.bemyeyes.com/favicon.ico', category: 'Accessibility Tools', link: 'https://www.bemyeyes.com/', pricing: 'free' },
        { name: 'Otter.ai', description: 'Real-time transcription for hearing impaired', logo: 'https://otter.ai/favicon.ico', category: 'Accessibility Tools', link: 'https://otter.ai/', pricing: 'freemium' },
        { name: 'Speechify', description: 'Text-to-speech for reading disabilities', logo: 'https://speechify.com/favicon.ico', category: 'Accessibility Tools', link: 'https://speechify.com/', pricing: 'freemium' },
        { name: 'AccessiBe', description: 'AI web accessibility solution', logo: 'https://accessibe.com/favicon.ico', category: 'Accessibility Tools', link: 'https://accessibe.com/', pricing: 'premium' },
        { name: 'UserWay', description: 'AI-powered web accessibility widget', logo: 'https://userway.org/favicon.ico', category: 'Accessibility Tools', link: 'https://userway.org/', pricing: 'freemium' },
        { name: 'Voiceitt', description: 'Speech recognition for non-standard speech', logo: 'https://voiceitt.com/favicon.ico', category: 'Accessibility Tools', link: 'https://voiceitt.com/', pricing: 'premium' },
        { name: 'Lookout by Google', description: 'Vision assistance for blind users', logo: 'https://play.google.com/favicon.ico', category: 'Accessibility Tools', link: 'https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.reveal', pricing: 'free' },
        { name: 'Livox', description: 'Alternative communication app', logo: 'https://livox.com.br/favicon.ico', category: 'Accessibility Tools', link: 'https://livox.com.br/en/', pricing: 'freemium' },
        { name: 'Aira', description: 'Visual interpreter service for blind', logo: 'https://aira.io/favicon.ico', category: 'Accessibility Tools', link: 'https://aira.io/', pricing: 'premium' }
    ],
    'ai-document-processing': [
        { name: 'Google Docs', description: 'Free document creation and collaboration', logo: 'https://docs.google.com/favicon.ico', category: 'Document Processing', link: 'https://docs.google.com/', pricing: 'free' },
        { name: 'PDFtk Free', description: 'Free PDF toolkit', logo: 'https://www.pdflabs.com/favicon.ico', category: 'Document Processing', link: 'https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/', pricing: 'free' },
        { name: 'DocuSign AI', description: 'AI-powered document analysis and processing', logo: 'https://www.docusign.com/favicon.ico', category: 'Document Processing', link: 'https://www.docusign.com/products/ai', pricing: 'premium' },
        { name: 'Adobe Acrobat AI', description: 'Intelligent document processing and editing', logo: 'https://www.adobe.com/favicon.ico', category: 'Document Processing', link: 'https://www.adobe.com/acrobat/ai.html', pricing: 'premium' },
        { name: 'Nanonets', description: 'AI document data extraction and processing', logo: 'https://nanonets.com/favicon.ico', category: 'Document Processing', link: 'https://nanonets.com/', pricing: 'freemium' },
        { name: 'Docparser', description: 'Automated document data extraction', logo: 'https://docparser.com/favicon.ico', category: 'Document Processing', link: 'https://docparser.com/', pricing: 'freemium' },
        { name: 'Rossum', description: 'AI document understanding platform', logo: 'https://rossum.ai/favicon.ico', category: 'Document Processing', link: 'https://rossum.ai/', pricing: 'premium' },
        { name: 'Kofax', description: 'Intelligent automation for documents', logo: 'https://www.kofax.com/favicon.ico', category: 'Document Processing', link: 'https://www.kofax.com/', pricing: 'premium' },
        { name: 'ABBYY FlexiCapture', description: 'Document processing with machine learning', logo: 'https://www.abbyy.com/favicon.ico', category: 'Document Processing', link: 'https://www.abbyy.com/flexicapture/', pricing: 'premium' },
        { name: 'Hyperscience', description: 'Intelligent document processing platform', logo: 'https://hyperscience.com/favicon.ico', category: 'Document Processing', link: 'https://hyperscience.com/', pricing: 'premium' },
        { name: 'Automation Hero', description: 'AI-powered document processing', logo: 'https://automationhero.ai/favicon.ico', category: 'Document Processing', link: 'https://automationhero.ai/', pricing: 'premium' },
        { name: 'Instabase', description: 'Deep learning for document understanding', logo: 'https://instabase.com/favicon.ico', category: 'Document Processing', link: 'https://instabase.com/', pricing: 'premium' }
    ],
    'ai-healthcare': [
        { name: 'Ada Health', description: 'AI-powered symptom assessment', logo: 'https://ada.com/favicon.ico', category: 'Healthcare', link: 'https://ada.com/', pricing: 'free' },
        { name: 'Babylon Health', description: 'AI healthcare consultation platform', logo: 'https://www.babylonhealth.com/favicon.ico', category: 'Healthcare', link: 'https://www.babylonhealth.com/', pricing: 'premium' },
        { name: 'Viz.ai', description: 'AI for stroke detection and care coordination', logo: 'https://www.viz.ai/favicon.ico', category: 'Healthcare', link: 'https://www.viz.ai/', pricing: 'premium' },
        { name: 'PathAI', description: 'AI-powered pathology for diagnosis', logo: 'https://www.pathai.com/favicon.ico', category: 'Healthcare', link: 'https://www.pathai.com/', pricing: 'premium' },
        { name: 'Zebra Medical', description: 'AI medical imaging analytics', logo: 'https://www.zebra-med.com/favicon.ico', category: 'Healthcare', link: 'https://www.zebra-med.com/', pricing: 'premium' },
        { name: 'Tempus', description: 'AI-driven precision medicine', logo: 'https://www.tempus.com/favicon.ico', category: 'Healthcare', link: 'https://www.tempus.com/', pricing: 'premium' },
        { name: 'Atomwise', description: 'AI for drug discovery', logo: 'https://www.atomwise.com/favicon.ico', category: 'Healthcare', link: 'https://www.atomwise.com/', pricing: 'premium' },
        { name: 'Butterfly Network', description: 'AI-powered ultrasound technology', logo: 'https://www.butterflynetwork.com/favicon.ico', category: 'Healthcare', link: 'https://www.butterflynetwork.com/', pricing: 'premium' },
        { name: 'Enlitic', description: 'AI medical imaging diagnostics', logo: 'https://www.enlitic.com/favicon.ico', category: 'Healthcare', link: 'https://www.enlitic.com/', pricing: 'premium' },
        { name: 'Freenome', description: 'AI for early cancer detection', logo: 'https://www.freenome.com/favicon.ico', category: 'Healthcare', link: 'https://www.freenome.com/', pricing: 'premium' }
    ],
    'ai-music-creation': [
        { name: 'Suno', description: 'Create original songs with text prompts', logo: 'https://suno.ai/favicon.ico', category: 'Music Creation', link: 'https://suno.ai/', pricing: 'freemium' },
        { name: 'Udio', description: 'AI music generation platform', logo: 'https://udio.com/favicon.ico', category: 'Music Creation', link: 'https://udio.com/', pricing: 'freemium' },
        { name: 'Harmonai', description: 'Open-source music generation', logo: 'https://www.harmonai.org/favicon.ico', category: 'Music Creation', link: 'https://www.harmonai.org/', pricing: 'free' },
        { name: 'Splash', description: 'AI-powered music creation', logo: 'https://splashmusicai.com/favicon.ico', category: 'Music Creation', link: 'https://splashmusicai.com/', pricing: 'freemium' },
        { name: 'Amper Music', description: 'AI music composition for content creators', logo: 'https://www.ampermusic.com/favicon.ico', category: 'Music Creation', link: 'https://www.ampermusic.com/', pricing: 'premium' },
        { name: 'AIVA', description: 'AI composer for emotional soundtrack music', logo: 'https://www.aiva.ai/favicon.ico', category: 'Music Creation', link: 'https://www.aiva.ai/', pricing: 'freemium' },
        { name: 'Soundraw', description: 'AI music generator for creators', logo: 'https://soundraw.io/favicon.ico', category: 'Music Creation', link: 'https://soundraw.io/', pricing: 'freemium' },
        { name: 'Infinite Album', description: 'AI-generated music that never ends', logo: 'https://infinitealbum.io/favicon.ico', category: 'Music Creation', link: 'https://infinitealbum.io/', pricing: 'freemium' },
        { name: 'Amadeus Code', description: 'AI-powered songwriting assistant', logo: 'https://amadeuscode.com/favicon.ico', category: 'Music Creation', link: 'https://amadeuscode.com/', pricing: 'freemium' },
        { name: 'Humtap', description: 'Create music with your voice and AI', logo: 'https://www.humtap.com/favicon.ico', category: 'Music Creation', link: 'https://www.humtap.com/', pricing: 'freemium' }
    ],
    'ai-interior-design': [
        { name: 'RoomSketcher Free', description: 'Free floor plan and home design', logo: 'https://www.roomsketcher.com/favicon.ico', category: 'Interior Design', link: 'https://www.roomsketcher.com/', pricing: 'free' },
        { name: 'Sweet Home 3D', description: 'Free interior design software', logo: 'https://www.sweethome3d.com/favicon.ico', category: 'Interior Design', link: 'https://www.sweethome3d.com/', pricing: 'free' },
        { name: 'Interior AI', description: 'AI interior design visualization', logo: 'https://interiorai.com/favicon.ico', category: 'Interior Design', link: 'https://interiorai.com/', pricing: 'premium' },
        { name: 'Planner 5D', description: 'AI-powered interior design tool', logo: 'https://planner5d.com/favicon.ico', category: 'Interior Design', link: 'https://planner5d.com/', pricing: 'freemium' },
        { name: 'Modsy', description: 'AI interior design visualization service', logo: 'https://www.modsy.com/favicon.ico', category: 'Interior Design', link: 'https://www.modsy.com/', pricing: 'premium' },
        { name: 'Roomvo', description: 'AI room visualization platform', logo: 'https://www.roomvo.com/favicon.ico', category: 'Interior Design', link: 'https://www.roomvo.com/', pricing: 'premium' },
        { name: 'Foyr Neo', description: '3D interior design with AI assistance', logo: 'https://foyr.com/favicon.ico', category: 'Interior Design', link: 'https://foyr.com/neo/', pricing: 'freemium' },
        { name: 'RoomGPT', description: 'AI room design generator', logo: 'https://www.roomgpt.io/favicon.ico', category: 'Interior Design', link: 'https://www.roomgpt.io/', pricing: 'freemium' },
        { name: 'DecorMatters', description: 'AI interior design app', logo: 'https://decormatters.com/favicon.ico', category: 'Interior Design', link: 'https://decormatters.com/', pricing: 'freemium' },
        { name: 'Collov', description: 'AI interior design platform', logo: 'https://collov.com/favicon.ico', category: 'Interior Design', link: 'https://collov.com/', pricing: 'freemium' },
        { name: 'Spacejoy', description: 'Online interior design with AI', logo: 'https://www.spacejoy.com/favicon.ico', category: 'Interior Design', link: 'https://www.spacejoy.com/', pricing: 'premium' },
        { name: 'Homestyler', description: 'AI-powered interior design software', logo: 'https://www.homestyler.com/favicon.ico', category: 'Interior Design', link: 'https://www.homestyler.com/', pricing: 'freemium' }
    ],
    'ai-translation': [
        { name: 'DeepL', description: 'Neural machine translation service', logo: 'https://www.deepl.com/favicon.ico', category: 'Translation', link: 'https://www.deepl.com/', pricing: 'freemium' },
        { name: 'SYSTRAN', description: 'AI-powered translation solutions', logo: 'https://www.systransoft.com/favicon.ico', category: 'Translation', link: 'https://www.systransoft.com/', pricing: 'premium' },
        { name: 'Unbabel', description: 'AI + human translation platform', logo: 'https://unbabel.com/favicon.ico', category: 'Translation', link: 'https://unbabel.com/', pricing: 'premium' },
        { name: 'Lilt', description: 'AI translation for enterprises', logo: 'https://lilt.com/favicon.ico', category: 'Translation', link: 'https://lilt.com/', pricing: 'premium' },
        { name: 'Smartling', description: 'Translation management with AI', logo: 'https://www.smartling.com/favicon.ico', category: 'Translation', link: 'https://www.smartling.com/', pricing: 'premium' },
        { name: 'Lengoo', description: 'AI-powered translation platform', logo: 'https://www.lengoo.com/favicon.ico', category: 'Translation', link: 'https://www.lengoo.com/', pricing: 'premium' },
        { name: 'ModernMT', description: 'Adaptive neural machine translation', logo: 'https://www.modernmt.com/favicon.ico', category: 'Translation', link: 'https://www.modernmt.com/', pricing: 'freemium' },
        { name: 'Intento', description: 'AI translation comparison platform', logo: 'https://inten.to/favicon.ico', category: 'Translation', link: 'https://inten.to/', pricing: 'premium' },
        { name: 'Argos Translate', description: 'Open-source neural machine translation', logo: 'https://www.argosopentech.com/favicon.ico', category: 'Translation', link: 'https://www.argosopentech.com/', pricing: 'free' },
        { name: 'Papago', description: 'Neural machine translation by Naver', logo: 'https://papago.naver.com/favicon.ico', category: 'Translation', link: 'https://papago.naver.com/', pricing: 'free' }
    ],
    'ai-speech-recognition': [
        { name: 'Whisper', description: 'OpenAI speech recognition system', logo: 'https://openai.com/favicon.ico', category: 'Speech Recognition', link: 'https://openai.com/research/whisper', pricing: 'free' },
        { name: 'AssemblyAI', description: 'Speech-to-text API with AI models', logo: 'https://www.assemblyai.com/favicon.ico', category: 'Speech Recognition', link: 'https://www.assemblyai.com/', pricing: 'freemium' },
        { name: 'Speechmatics', description: 'Enterprise speech recognition', logo: 'https://www.speechmatics.com/favicon.ico', category: 'Speech Recognition', link: 'https://www.speechmatics.com/', pricing: 'premium' },
        { name: 'Deepgram', description: 'Real-time speech recognition API', logo: 'https://deepgram.com/favicon.ico', category: 'Speech Recognition', link: 'https://deepgram.com/', pricing: 'freemium' },
        { name: 'Picovoice', description: 'On-device voice AI platform', logo: 'https://picovoice.ai/favicon.ico', category: 'Speech Recognition', link: 'https://picovoice.ai/', pricing: 'freemium' },
        { name: 'Voicegain', description: 'Speech-to-text and voice analytics', logo: 'https://www.voicegain.ai/favicon.ico', category: 'Speech Recognition', link: 'https://www.voicegain.ai/', pricing: 'freemium' },
        { name: 'Soniox', description: 'High-accuracy speech recognition', logo: 'https://soniox.com/favicon.ico', category: 'Speech Recognition', link: 'https://soniox.com/', pricing: 'freemium' },
        { name: 'Verbit', description: 'AI transcription and captioning', logo: 'https://verbit.ai/favicon.ico', category: 'Speech Recognition', link: 'https://verbit.ai/', pricing: 'premium' },
        { name: 'Voci', description: 'Enterprise speech-to-text platform', logo: 'https://www.vocitec.com/favicon.ico', category: 'Speech Recognition', link: 'https://www.vocitec.com/', pricing: 'premium' },
        { name: 'Speechly', description: 'Voice UI for mobile and web apps', logo: 'https://www.speechly.com/favicon.ico', category: 'Speech Recognition', link: 'https://www.speechly.com/', pricing: 'freemium' }
    ],
    'code-generators': [
        { name: 'GitHub Copilot', description: 'AI pair programmer for code generation', logo: 'https://github.com/favicon.ico', category: 'Code Generators', link: 'https://github.com/features/copilot', pricing: 'premium' },
        { name: 'Tabnine', description: 'AI code completion and generation', logo: 'https://www.tabnine.com/favicon.ico', category: 'Code Generators', link: 'https://www.tabnine.com', pricing: 'freemium' },
        { name: 'Codeium', description: 'Free AI code acceleration toolkit', logo: 'https://codeium.com/favicon.ico', category: 'Code Generators', link: 'https://codeium.com', pricing: 'free' },
        { name: 'Amazon CodeWhisperer', description: 'AI coding companion from AWS', logo: 'https://aws.amazon.com/favicon.ico', category: 'Code Generators', link: 'https://aws.amazon.com/codewhisperer/', pricing: 'free' },
        { name: 'Replit Ghostwriter', description: 'AI code generation in browser IDE', logo: 'https://replit.com/favicon.ico', category: 'Code Generators', link: 'https://replit.com/ghostwriter', pricing: 'freemium' },
        { name: 'Cursor', description: 'AI-first code editor', logo: 'https://cursor.sh/favicon.ico', category: 'Code Generators', link: 'https://cursor.sh', pricing: 'freemium' },
        { name: 'Sourcegraph Cody', description: 'AI coding assistant for codebases', logo: 'https://sourcegraph.com/favicon.ico', category: 'Code Generators', link: 'https://sourcegraph.com/cody', pricing: 'freemium' },
        { name: 'CodeT5', description: 'Open-source code generation model', logo: 'https://huggingface.co/favicon.ico', category: 'Code Generators', link: 'https://huggingface.co/Salesforce/codet5-large', pricing: 'free' },
        { name: 'Blackbox AI', description: 'AI-powered coding assistant', logo: 'https://www.blackbox.ai/favicon.ico', category: 'Code Generators', link: 'https://www.blackbox.ai', pricing: 'freemium' },
        { name: 'MutableAI', description: 'AI code completion and refactoring', logo: 'https://mutable.ai/favicon.ico', category: 'Code Generators', link: 'https://mutable.ai/', pricing: 'freemium' },
        { name: 'CodeGPT', description: 'AI code generation extension', logo: 'https://codegpt.co/favicon.ico', category: 'Code Generators', link: 'https://codegpt.co/', pricing: 'freemium' },
        { name: 'Codex by OpenAI', description: 'AI system that translates natural language to code', logo: 'https://openai.com/favicon.ico', category: 'Code Generators', link: 'https://openai.com/blog/openai-codex/', pricing: 'premium' }
    ],
    'design-tools': [
        { name: 'Canva', description: 'AI-powered design platform', logo: 'https://www.canva.com/favicon.ico', category: 'Design Tools', link: 'https://www.canva.com/', pricing: 'freemium' },
        { name: 'Figma', description: 'Collaborative design tool with AI features', logo: 'https://www.figma.com/favicon.ico', category: 'Design Tools', link: 'https://www.figma.com/', pricing: 'freemium' },
        { name: 'Adobe Creative Cloud', description: 'AI-enhanced creative suite', logo: 'https://www.adobe.com/favicon.ico', category: 'Design Tools', link: 'https://www.adobe.com/creativecloud.html', pricing: 'premium' },
        { name: 'Sketch', description: 'Digital design toolkit with AI plugins', logo: 'https://www.sketch.com/favicon.ico', category: 'Design Tools', link: 'https://www.sketch.com/', pricing: 'premium' },
        { name: 'Framer', description: 'Interactive design and prototyping', logo: 'https://www.framer.com/favicon.ico', category: 'Design Tools', link: 'https://www.framer.com/', pricing: 'freemium' },
        { name: 'Uizard', description: 'AI-powered design tool', logo: 'https://uizard.io/favicon.ico', category: 'Design Tools', link: 'https://uizard.io/', pricing: 'freemium' },
        { name: 'Khroma', description: 'AI color palette generator', logo: 'https://www.khroma.co/favicon.ico', category: 'Design Tools', link: 'https://www.khroma.co/', pricing: 'free' },
        { name: 'Designs.ai', description: 'AI design suite for logos, videos, and more', logo: 'https://designs.ai/favicon.ico', category: 'Design Tools', link: 'https://designs.ai/', pricing: 'freemium' },
        { name: 'Looka', description: 'AI logo and brand identity designer', logo: 'https://looka.com/favicon.ico', category: 'Design Tools', link: 'https://looka.com/', pricing: 'freemium' },
        { name: 'Brandmark', description: 'AI-powered logo design tool', logo: 'https://brandmark.io/favicon.ico', category: 'Design Tools', link: 'https://brandmark.io/', pricing: 'freemium' },
        { name: 'Gamma', description: 'AI-powered presentation and design tool', logo: 'https://gamma.app/favicon.ico', category: 'Design Tools', link: 'https://gamma.app/', pricing: 'freemium' },
        { name: 'Beautiful.ai', description: 'AI presentation design platform', logo: 'https://www.beautiful.ai/favicon.ico', category: 'Design Tools', link: 'https://www.beautiful.ai/', pricing: 'freemium' }
    ],
    'ai-data-visualization': [
        { name: 'Google Data Studio', description: 'Free data visualization and reporting', logo: 'https://datastudio.google.com/favicon.ico', category: 'Data Visualization', link: 'https://datastudio.google.com/', pricing: 'free' },
        { name: 'Flourish', description: 'Free data visualization and storytelling', logo: 'https://flourish.studio/favicon.ico', category: 'Data Visualization', link: 'https://flourish.studio/', pricing: 'free' },
        { name: 'Tableau', description: 'Interactive data visualization with AI', logo: 'https://www.tableau.com/favicon.ico', category: 'Data Visualization', link: 'https://www.tableau.com/', pricing: 'premium' },
        { name: 'PowerBI', description: 'Microsoft business analytics with AI', logo: 'https://powerbi.microsoft.com/favicon.ico', category: 'Data Visualization', link: 'https://powerbi.microsoft.com/', pricing: 'freemium' },
        { name: 'Qlik', description: 'Data analytics and visualization platform', logo: 'https://www.qlik.com/favicon.ico', category: 'Data Visualization', link: 'https://www.qlik.com/', pricing: 'premium' },
        { name: 'Looker', description: 'Business intelligence and analytics', logo: 'https://looker.com/favicon.ico', category: 'Data Visualization', link: 'https://looker.com/', pricing: 'premium' },
        { name: 'Sisense', description: 'AI-driven analytics platform', logo: 'https://www.sisense.com/favicon.ico', category: 'Data Visualization', link: 'https://www.sisense.com/', pricing: 'premium' },
        { name: 'ThoughtSpot', description: 'AI-powered analytics platform', logo: 'https://www.thoughtspot.com/favicon.ico', category: 'Data Visualization', link: 'https://www.thoughtspot.com/', pricing: 'premium' },
        { name: 'Domo', description: 'Cloud-based business intelligence platform', logo: 'https://www.domo.com/favicon.ico', category: 'Data Visualization', link: 'https://www.domo.com/', pricing: 'premium' },
        { name: 'Plotly', description: 'Interactive data visualization platform', logo: 'https://plotly.com/favicon.ico', category: 'Data Visualization', link: 'https://plotly.com/', pricing: 'freemium' },
        { name: 'Observable', description: 'Collaborative data visualization platform', logo: 'https://observablehq.com/favicon.ico', category: 'Data Visualization', link: 'https://observablehq.com/', pricing: 'freemium' },
        { name: 'Grafana', description: 'Open-source analytics and monitoring', logo: 'https://grafana.com/favicon.ico', category: 'Data Visualization', link: 'https://grafana.com/', pricing: 'freemium' },
        { name: 'Toucan Toco', description: 'Data storytelling platform', logo: 'https://toucantoco.com/favicon.ico', category: 'Data Visualization', link: 'https://toucantoco.com/', pricing: 'premium' },
        { name: 'Graphext', description: 'AI-powered data analysis platform', logo: 'https://www.graphext.com/favicon.ico', category: 'Data Visualization', link: 'https://www.graphext.com/', pricing: 'premium' },
        { name: 'Kinetica', description: 'GPU-accelerated analytics platform', logo: 'https://www.kinetica.com/favicon.ico', category: 'Data Visualization', link: 'https://www.kinetica.com/', pricing: 'premium' }
    ],
    'ai-customer-insights': [
        { name: 'Google Forms', description: 'Free survey and feedback collection', logo: 'https://www.google.com/forms/about/favicon.ico', category: 'Customer Insights', link: 'https://www.google.com/forms/about/', pricing: 'free' },
        { name: 'SurveyMonkey Free', description: 'Free survey and feedback tool', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Customer Insights', link: 'https://www.surveymonkey.com/', pricing: 'free' },
        { name: 'Qualtrics XM', description: 'AI-powered experience management', logo: 'https://www.qualtrics.com/favicon.ico', category: 'Customer Insights', link: 'https://www.qualtrics.com/', pricing: 'premium' },
        { name: 'Medallia', description: 'Customer and employee experience platform', logo: 'https://www.medallia.com/favicon.ico', category: 'Customer Insights', link: 'https://www.medallia.com/', pricing: 'premium' },
        { name: 'Clarabridge', description: 'AI-powered customer experience analytics', logo: 'https://www.clarabridge.com/favicon.ico', category: 'Customer Insights', link: 'https://www.clarabridge.com/', pricing: 'premium' },
        { name: 'Chattermill', description: 'Unified customer feedback analysis', logo: 'https://chattermill.com/favicon.ico', category: 'Customer Insights', link: 'https://chattermill.com/', pricing: 'premium' },
        { name: 'Wonderflow', description: 'AI-powered customer feedback analysis', logo: 'https://www.wonderflow.ai/favicon.ico', category: 'Customer Insights', link: 'https://www.wonderflow.ai/', pricing: 'premium' },
        { name: 'Idiomatic', description: 'Customer feedback analysis platform', logo: 'https://www.idiomatic.com/favicon.ico', category: 'Customer Insights', link: 'https://www.idiomatic.com/', pricing: 'premium' },
        { name: 'Thematic', description: 'AI customer feedback analysis', logo: 'https://thematic.co/favicon.ico', category: 'Customer Insights', link: 'https://thematic.co/', pricing: 'freemium' },
        { name: 'Keatext', description: 'AI-powered customer feedback analytics', logo: 'https://www.keatext.ai/favicon.ico', category: 'Customer Insights', link: 'https://www.keatext.ai/', pricing: 'premium' },
        { name: 'Stratifyd', description: 'AI-powered analytics platform', logo: 'https://www.stratifyd.com/favicon.ico', category: 'Customer Insights', link: 'https://www.stratifyd.com/', pricing: 'premium' },
        { name: 'Viable', description: 'AI analysis of qualitative feedback', logo: 'https://www.askviable.com/favicon.ico', category: 'Customer Insights', link: 'https://www.askviable.com/', pricing: 'freemium' }
    ],
    'ai-legal-tech': [
        { name: 'Google Scholar', description: 'Free legal case and article search', logo: 'https://scholar.google.com/favicon.ico', category: 'Legal Tech', link: 'https://scholar.google.com/', pricing: 'free' },
        { name: 'Justia', description: 'Free legal information and resources', logo: 'https://www.justia.com/favicon.ico', category: 'Legal Tech', link: 'https://www.justia.com/', pricing: 'free' },
        { name: 'ROSS Intelligence', description: 'AI legal research platform', logo: 'https://rossintelligence.com/favicon.ico', category: 'Legal Tech', link: 'https://rossintelligence.com/', pricing: 'premium' },
        { name: 'Casetext', description: 'AI-powered legal research assistant', logo: 'https://casetext.com/favicon.ico', category: 'Legal Tech', link: 'https://casetext.com/', pricing: 'premium' },
        { name: 'Kira Systems', description: 'AI contract analysis software', logo: 'https://kirasystems.com/favicon.ico', category: 'Legal Tech', link: 'https://kirasystems.com/', pricing: 'premium' },
        { name: 'Luminance', description: 'AI document analysis for legal teams', logo: 'https://www.luminance.com/favicon.ico', category: 'Legal Tech', link: 'https://www.luminance.com/', pricing: 'premium' },
        { name: 'LawGeex', description: 'AI contract review automation', logo: 'https://www.lawgeex.com/favicon.ico', category: 'Legal Tech', link: 'https://www.lawgeex.com/', pricing: 'premium' },
        { name: 'Everlaw', description: 'AI-powered litigation platform', logo: 'https://www.everlaw.com/favicon.ico', category: 'Legal Tech', link: 'https://www.everlaw.com/', pricing: 'premium' },
        { name: 'Disco', description: 'AI-powered legal discovery', logo: 'https://www.csdisco.com/favicon.ico', category: 'Legal Tech', link: 'https://www.csdisco.com/', pricing: 'premium' },
        { name: 'Relativity', description: 'E-discovery and compliance platform', logo: 'https://www.relativity.com/favicon.ico', category: 'Legal Tech', link: 'https://www.relativity.com/', pricing: 'premium' },
        { name: 'Lexion', description: 'AI contract management', logo: 'https://lexion.ai/favicon.ico', category: 'Legal Tech', link: 'https://lexion.ai/', pricing: 'premium' },
        { name: 'Evisort', description: 'AI-powered contract intelligence', logo: 'https://www.evisort.com/favicon.ico', category: 'Legal Tech', link: 'https://www.evisort.com/', pricing: 'premium' }
    ],
    'ai-avatars': [
    { name: 'Avataaars Generator', description: 'Free open-source avatar generator', logo: 'https://avataaars.com/favicon.ico', category: 'AI Avatars', link: 'https://avataaars.com/', pricing: 'free' },
    { name: 'Multiavatar', description: 'Free multicultural avatar generator', logo: 'https://multiavatar.com/favicon.ico', category: 'AI Avatars', link: 'https://multiavatar.com/', pricing: 'free' },
    { name: 'Ready Player Me', description: 'Cross-platform avatar creator', logo: 'https://readyplayer.me/favicon.ico', category: 'AI Avatars', link: 'https://readyplayer.me/', pricing: 'freemium' },
    { name: 'Avatar AI', description: 'AI-powered avatar generation', logo: 'https://avatarai.me/favicon.ico', category: 'AI Avatars', link: 'https://avatarai.me/', pricing: 'premium' },
    { name: 'Midjourney', description: 'AI image generation for avatars', logo: 'https://www.midjourney.com/favicon.ico', category: 'AI Avatars', link: 'https://www.midjourney.com/', pricing: 'premium' },
    { name: 'HeyGen', description: 'AI video avatars for business', logo: 'https://www.heygen.com/favicon.ico', category: 'AI Avatars', link: 'https://www.heygen.com/', pricing: 'premium' },
    { name: 'Synthesia', description: 'AI video generation with avatars', logo: 'https://www.synthesia.io/favicon.ico', category: 'AI Avatars', link: 'https://www.synthesia.io/', pricing: 'premium' },
    { name: 'D-ID', description: 'AI-generated digital humans', logo: 'https://www.d-id.com/favicon.ico', category: 'AI Avatars', link: 'https://www.d-id.com/', pricing: 'freemium' },
    { name: 'Lensa', description: 'AI avatar creator app', logo: 'https://prisma-ai.com/favicon.ico', category: 'AI Avatars', link: 'https://prisma-ai.com/lensa', pricing: 'premium' },
    { name: 'Reface', description: 'Face swap app for videos and GIFs', logo: 'https://reface.ai/favicon.ico', category: 'AI Avatars', link: 'https://reface.ai/', pricing: 'freemium' },
    { name: 'Picter', description: 'AI profile picture generator', logo: 'https://picterai.com/favicon.ico', category: 'AI Avatars', link: 'https://picterai.com/', pricing: 'premium' },
    { name: 'Photosonic', description: 'AI image generation for avatars', logo: 'https://writesonic.com/favicon.ico', category: 'AI Avatars', link: 'https://writesonic.com/photosonic', pricing: 'freemium' }
    ],
    'ai-search': [
    { name: 'Perplexity', description: 'AI-powered answer engine', logo: 'https://www.perplexity.ai/favicon.ico', category: 'AI Search', link: 'https://www.perplexity.ai/', pricing: 'freemium' },
    { name: 'You.com', description: 'AI search engine', logo: 'https://you.com/favicon.ico', category: 'AI Search', link: 'https://you.com/', pricing: 'freemium' },
    { name: 'Bing AI', description: 'Microsoft AI-powered search', logo: 'https://www.bing.com/favicon.ico', category: 'AI Search', link: 'https://www.bing.com/', pricing: 'free' },
    { name: 'Google AI Overview', description: 'AI-powered search summaries', logo: 'https://www.google.com/favicon.ico', category: 'AI Search', link: 'https://www.google.com/', pricing: 'free' },
    { name: 'Kagi', description: 'Premium AI search engine', logo: 'https://kagi.com/favicon.ico', category: 'AI Search', link: 'https://kagi.com/', pricing: 'premium' },
    { name: 'Phind', description: 'AI search for developers', logo: 'https://www.phind.com/favicon.ico', category: 'AI Search', link: 'https://www.phind.com/', pricing: 'freemium' },
    { name: 'Consensus', description: 'AI search for research papers', logo: 'https://consensus.app/favicon.ico', category: 'AI Search', link: 'https://consensus.app/', pricing: 'freemium' },
    { name: 'Metaphor', description: 'AI search engine for the internet', logo: 'https://metaphor.systems/favicon.ico', category: 'AI Search', link: 'https://metaphor.systems/', pricing: 'freemium' },
    { name: 'Neeva', description: 'Ad-free search with AI', logo: 'https://neeva.com/favicon.ico', category: 'AI Search', link: 'https://neeva.com/', pricing: 'premium' },
    { name: 'Brave Search', description: 'Private search with AI summaries', logo: 'https://search.brave.com/favicon.ico', category: 'AI Search', link: 'https://search.brave.com/', pricing: 'free' }
    ],
    'ai-audio-enhancers': [
    { name: 'Descript', description: 'Audio editing with AI', logo: 'https://www.descript.com/favicon.ico', category: 'Audio Enhancement', link: 'https://www.descript.com/', pricing: 'freemium' },
    { name: 'Adobe Podcast', description: 'AI-powered audio enhancement', logo: 'https://podcast.adobe.com/favicon.ico', category: 'Audio Enhancement', link: 'https://podcast.adobe.com/', pricing: 'free' },
    { name: 'Auphonic', description: 'Automated audio post-production', logo: 'https://auphonic.com/favicon.ico', category: 'Audio Enhancement', link: 'https://auphonic.com/', pricing: 'freemium' },
    { name: 'Krisp', description: 'AI noise cancellation for calls', logo: 'https://krisp.ai/favicon.ico', category: 'Audio Enhancement', link: 'https://krisp.ai/', pricing: 'freemium' },
    { name: 'iZotope RX', description: 'Audio repair and enhancement', logo: 'https://www.izotope.com/favicon.ico', category: 'Audio Enhancement', link: 'https://www.izotope.com/en/products/rx.html', pricing: 'premium' },
    { name: 'Accusonus', description: 'AI-powered audio repair', logo: 'https://accusonus.com/favicon.ico', category: 'Audio Enhancement', link: 'https://accusonus.com/', pricing: 'premium' },
    { name: 'Lalal.ai', description: 'AI-powered stem separation', logo: 'https://www.lalal.ai/favicon.ico', category: 'Audio Enhancement', link: 'https://www.lalal.ai/', pricing: 'freemium' },
    { name: 'Audionamix', description: 'Professional audio separation', logo: 'https://audionamix.com/favicon.ico', category: 'Audio Enhancement', link: 'https://audionamix.com/', pricing: 'premium' },
    { name: 'Podcastle', description: 'AI-powered podcast creation', logo: 'https://podcastle.ai/favicon.ico', category: 'Audio Enhancement', link: 'https://podcastle.ai/', pricing: 'freemium' },
    { name: 'Cleanvoice', description: 'Remove filler words from audio', logo: 'https://cleanvoice.ai/favicon.ico', category: 'Audio Enhancement', link: 'https://cleanvoice.ai/', pricing: 'freemium' }
    ],
    'translation-tools': [
    { name: 'Google Translate', description: 'Free multilingual translation service', logo: 'https://translate.google.com/favicon.ico', category: 'Translation', link: 'https://translate.google.com', pricing: 'free' },
    { name: 'DeepL', description: 'AI-powered translation service', logo: 'https://www.deepl.com/favicon.ico', category: 'Translation', link: 'https://www.deepl.com', pricing: 'freemium' },
    { name: 'Microsoft Translator', description: 'Cloud-based translation service', logo: 'https://www.microsoft.com/favicon.ico', category: 'Translation', link: 'https://www.microsoft.com/en-us/translator', pricing: 'free' },
    { name: 'Reverso', description: 'Translation and language learning', logo: 'https://www.reverso.net/favicon.ico', category: 'Translation', link: 'https://www.reverso.net', pricing: 'freemium' },
    { name: 'Linguee', description: 'Dictionary and translation search engine', logo: 'https://www.linguee.com/favicon.ico', category: 'Translation', link: 'https://www.linguee.com', pricing: 'free' },
    { name: 'Babylon', description: 'Translation software and dictionary', logo: 'https://www.babylon-software.com/favicon.ico', category: 'Translation', link: 'https://www.babylon-software.com', pricing: 'premium' },
    { name: 'SDL Trados', description: 'Professional translation software', logo: 'https://www.sdltrados.com/favicon.ico', category: 'Translation', link: 'https://www.sdltrados.com', pricing: 'premium' },
    { name: 'Phrase', description: 'Localization platform for teams', logo: 'https://phrase.com/favicon.ico', category: 'Translation', link: 'https://phrase.com', pricing: 'premium' },
    { name: 'Lokalise', description: 'Translation management system', logo: 'https://lokalise.com/favicon.ico', category: 'Translation', link: 'https://lokalise.com', pricing: 'premium' },
    { name: 'Crowdin', description: 'Localization management platform', logo: 'https://crowdin.com/favicon.ico', category: 'Translation', link: 'https://crowdin.com', pricing: 'premium' }
    ],
    'seo-tools': [
    { name: 'SEMrush', description: 'All-in-one marketing toolkit', logo: 'https://www.semrush.com/favicon.ico', category: 'SEO Tools', link: 'https://www.semrush.com', pricing: 'premium' },
    { name: 'Ahrefs', description: 'SEO toolset for backlink analysis', logo: 'https://ahrefs.com/favicon.ico', category: 'SEO Tools', link: 'https://ahrefs.com', pricing: 'premium' },
    { name: 'Moz', description: 'SEO software and tools', logo: 'https://moz.com/favicon.ico', category: 'SEO Tools', link: 'https://moz.com', pricing: 'freemium' },
    { name: 'Google Search Console', description: 'Monitor website performance in search', logo: 'https://search.google.com/favicon.ico', category: 'SEO Tools', link: 'https://search.google.com/search-console', pricing: 'free' },
    { name: 'Screaming Frog', description: 'SEO spider tool for website crawling', logo: 'https://www.screamingfrog.co.uk/favicon.ico', category: 'SEO Tools', link: 'https://www.screamingfrog.co.uk', pricing: 'freemium' },
    { name: 'Ubersuggest', description: 'Keyword research and SEO tool', logo: 'https://neilpatel.com/favicon.ico', category: 'SEO Tools', link: 'https://neilpatel.com/ubersuggest', pricing: 'freemium' },
    { name: 'Surfer SEO', description: 'Content optimization tool', logo: 'https://surferseo.com/favicon.ico', category: 'SEO Tools', link: 'https://surferseo.com', pricing: 'premium' },
    { name: 'BrightEdge', description: 'Enterprise SEO platform', logo: 'https://www.brightedge.com/favicon.ico', category: 'SEO Tools', link: 'https://www.brightedge.com', pricing: 'premium' },
    { name: 'Conductor', description: 'Organic marketing platform', logo: 'https://www.conductor.com/favicon.ico', category: 'SEO Tools', link: 'https://www.conductor.com', pricing: 'premium' },
    { name: 'Searchmetrics', description: 'SEO and content optimization', logo: 'https://www.searchmetrics.com/favicon.ico', category: 'SEO Tools', link: 'https://www.searchmetrics.com', pricing: 'premium' }
    ],
    'email-tools': [
    { name: 'Gmail', description: 'Free email service by Google', logo: 'https://www.google.com/gmail/favicon.ico', category: 'Email Tools', link: 'https://www.google.com/gmail/', pricing: 'free' },
    { name: 'ProtonMail', description: 'Free encrypted email service', logo: 'https://proton.me/favicon.ico', category: 'Email Tools', link: 'https://proton.me/mail', pricing: 'free' },
    { name: 'Mailchimp', description: 'Email marketing platform', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Tools', link: 'https://mailchimp.com', pricing: 'freemium' },
    { name: 'Constant Contact', description: 'Email marketing and automation', logo: 'https://www.constantcontact.com/favicon.ico', category: 'Email Tools', link: 'https://www.constantcontact.com', pricing: 'premium' },
    { name: 'SendGrid', description: 'Email delivery service', logo: 'https://sendgrid.com/favicon.ico', category: 'Email Tools', link: 'https://sendgrid.com', pricing: 'freemium' },
    { name: 'Campaign Monitor', description: 'Email marketing software', logo: 'https://www.campaignmonitor.com/favicon.ico', category: 'Email Tools', link: 'https://www.campaignmonitor.com', pricing: 'freemium' },
    { name: 'ConvertKit', description: 'Email marketing for creators', logo: 'https://convertkit.com/favicon.ico', category: 'Email Tools', link: 'https://convertkit.com', pricing: 'freemium' },
    { name: 'AWeber', description: 'Email marketing and automation', logo: 'https://www.aweber.com/favicon.ico', category: 'Email Tools', link: 'https://www.aweber.com', pricing: 'freemium' },
    { name: 'GetResponse', description: 'Email marketing platform', logo: 'https://www.getresponse.com/favicon.ico', category: 'Email Tools', link: 'https://www.getresponse.com', pricing: 'freemium' },
    { name: 'ActiveCampaign', description: 'Customer experience automation', logo: 'https://www.activecampaign.com/favicon.ico', category: 'Email Tools', link: 'https://www.activecampaign.com', pricing: 'freemium' },
    { name: 'Klaviyo', description: 'Email and SMS marketing platform', logo: 'https://www.klaviyo.com/favicon.ico', category: 'Email Tools', link: 'https://www.klaviyo.com', pricing: 'freemium' },
    { name: 'Drip', description: 'E-commerce CRM and email marketing', logo: 'https://www.drip.com/favicon.ico', category: 'Email Tools', link: 'https://www.drip.com', pricing: 'premium' }
    ],
    'prompt-generation': [
    { name: 'PromptHero', description: 'Discover, share, and create AI prompts for art and text', logo: 'https://prompthero.com/favicon.ico', category: 'Prompt Generation', link: 'https://prompthero.com/', pricing: 'free' },
    { name: 'PromptBase', description: 'Marketplace for buying and selling quality AI prompts', logo: 'https://promptbase.com/favicon.ico', category: 'Prompt Generation', link: 'https://promptbase.com/', pricing: 'premium' },
    { name: 'FlowGPT', description: 'Share and discover the best ChatGPT prompts', logo: 'https://flowgpt.com/favicon.ico', category: 'Prompt Generation', link: 'https://flowgpt.com/', pricing: 'freemium' },
    { name: 'Promptist', description: 'AI prompt generator for Stable Diffusion', logo: 'https://promptist.ai/favicon.ico', category: 'Prompt Generation', link: 'https://promptist.ai/', pricing: 'free' },
    { name: 'PromptPerfect', description: 'Optimize and generate prompts for LLMs', logo: 'https://promptperfect.jina.ai/favicon.ico', category: 'Prompt Generation', link: 'https://promptperfect.jina.ai/', pricing: 'freemium' },
    { name: 'AIPRM', description: 'Prompt management and sharing for ChatGPT', logo: 'https://www.aiprm.com/favicon.ico', category: 'Prompt Generation', link: 'https://www.aiprm.com/', pricing: 'freemium' },
    { name: 'PromptLayer', description: 'Track, manage, and optimize LLM prompts', logo: 'https://promptlayer.com/favicon.ico', category: 'Prompt Generation', link: 'https://promptlayer.com/', pricing: 'freemium' },
    { name: 'PromptSpace', description: 'Prompt marketplace for AI models', logo: 'https://promptspace.ai/favicon.ico', category: 'Prompt Generation', link: 'https://promptspace.ai/', pricing: 'premium' },
    { name: 'PromptVibes', description: 'Curated prompt library for ChatGPT and more', logo: 'https://promptvibes.com/favicon.ico', category: 'Prompt Generation', link: 'https://promptvibes.com/', pricing: 'free' },
    { name: 'PromptAttack', description: 'Prompt generator and sharing platform', logo: 'https://promptattack.com/favicon.ico', category: 'Prompt Generation', link: 'https://promptattack.com/', pricing: 'free' },
    { name: 'Promptable', description: 'Prompt engineering and sharing platform', logo: 'https://promptable.ai/favicon.ico', category: 'Prompt Generation', link: 'https://promptable.ai/', pricing: 'freemium' }
    ],
    'presentation-tools': [
    { name: 'Google Slides', description: 'Free presentation software', logo: 'https://www.google.com/slides/about/favicon.ico', category: 'Presentation Tools', link: 'https://www.google.com/slides/about/', pricing: 'free' },
    { name: 'Canva Presentations', description: 'Free presentation design tool', logo: 'https://www.canva.com/favicon.ico', category: 'Presentation Tools', link: 'https://www.canva.com/presentations/', pricing: 'free' },
    { name: 'Gamma', description: 'AI-powered presentation maker', logo: 'https://gamma.app/favicon.ico', category: 'Presentation Tools', link: 'https://gamma.app', pricing: 'freemium' },
    { name: 'Beautiful.AI', description: 'Smart presentation software', logo: 'https://www.beautiful.ai/favicon.ico', category: 'Presentation Tools', link: 'https://www.beautiful.ai', pricing: 'freemium' },
    { name: 'Tome', description: 'AI storytelling format', logo: 'https://tome.app/favicon.ico', category: 'Presentation Tools', link: 'https://tome.app', pricing: 'freemium' },
    { name: 'Slidebean', description: 'AI pitch deck designer', logo: 'https://slidebean.com/favicon.ico', category: 'Presentation Tools', link: 'https://slidebean.com', pricing: 'freemium' },
    { name: 'Prezi', description: 'Conversational presentation software', logo: 'https://prezi.com/favicon.ico', category: 'Presentation Tools', link: 'https://prezi.com', pricing: 'freemium' },
    { name: 'Canva Presentations', description: 'Design presentations with AI', logo: 'https://www.canva.com/favicon.ico', category: 'Presentation Tools', link: 'https://www.canva.com/presentations', pricing: 'freemium' },
    { name: 'Slides', description: 'Online presentation editor', logo: 'https://slides.com/favicon.ico', category: 'Presentation Tools', link: 'https://slides.com', pricing: 'freemium' },
    { name: 'Genially', description: 'Interactive content creation', logo: 'https://genial.ly/favicon.ico', category: 'Presentation Tools', link: 'https://genial.ly', pricing: 'freemium' },
    { name: 'Mentimeter', description: 'Interactive presentation software', logo: 'https://www.mentimeter.com/favicon.ico', category: 'Presentation Tools', link: 'https://www.mentimeter.com', pricing: 'freemium' },
    { name: 'Haiku Deck', description: 'Simple presentation software', logo: 'https://www.haikudeck.com/favicon.ico', category: 'Presentation Tools', link: 'https://www.haikudeck.com', pricing: 'freemium' }
    ],
    'research-tools': [
    { name: 'Perplexity AI', description: 'AI-powered research assistant', logo: 'https://www.perplexity.ai/favicon.ico', category: 'Research Tools', link: 'https://www.perplexity.ai', pricing: 'freemium' },
    { name: 'Semantic Scholar', description: 'AI-powered research tool', logo: 'https://www.semanticscholar.org/favicon.ico', category: 'Research Tools', link: 'https://www.semanticscholar.org', pricing: 'free' },
    { name: 'Elicit', description: 'AI research assistant', logo: 'https://elicit.org/favicon.ico', category: 'Research Tools', link: 'https://elicit.org', pricing: 'free' },
    { name: 'ResearchGate', description: 'Social network for scientists', logo: 'https://www.researchgate.net/favicon.ico', category: 'Research Tools', link: 'https://www.researchgate.net', pricing: 'free' },
    { name: 'Mendeley', description: 'Reference manager and academic network', logo: 'https://www.mendeley.com/favicon.ico', category: 'Research Tools', link: 'https://www.mendeley.com', pricing: 'freemium' },
    { name: 'Zotero', description: 'Research assistant and citation manager', logo: 'https://www.zotero.org/favicon.ico', category: 'Research Tools', link: 'https://www.zotero.org', pricing: 'free' },
    { name: 'Consensus', description: 'AI-powered research engine', logo: 'https://consensus.app/favicon.ico', category: 'Research Tools', link: 'https://consensus.app', pricing: 'freemium' },
    { name: 'Scholarcy', description: 'AI-powered research summarization', logo: 'https://www.scholarcy.com/favicon.ico', category: 'Research Tools', link: 'https://www.scholarcy.com', pricing: 'freemium' },
    { name: 'Iris.ai', description: 'AI research assistant', logo: 'https://iris.ai/favicon.ico', category: 'Research Tools', link: 'https://iris.ai', pricing: 'premium' },
    { name: 'Connected Papers', description: 'Visual tool to find relevant papers', logo: 'https://www.connectedpapers.com/favicon.ico', category: 'Research Tools', link: 'https://www.connectedpapers.com', pricing: 'freemium' }
    ],
    'productivity-tools': [
    { name: 'Google Workspace', description: 'Free productivity suite (Docs, Sheets, Slides)', logo: 'https://workspace.google.com/favicon.ico', category: 'Productivity', link: 'https://workspace.google.com/', pricing: 'free' },
    { name: 'LibreOffice', description: 'Free open-source office suite', logo: 'https://www.libreoffice.org/favicon.ico', category: 'Productivity', link: 'https://www.libreoffice.org/', pricing: 'free' },
    { name: 'Notion', description: 'All-in-one workspace with AI', logo: 'https://www.notion.so/favicon.ico', category: 'Productivity', link: 'https://www.notion.so', pricing: 'freemium' },
    { name: 'Todoist', description: 'Task management with AI features', logo: 'https://todoist.com/favicon.ico', category: 'Productivity', link: 'https://todoist.com', pricing: 'freemium' },
    { name: 'Trello', description: 'Visual project management tool', logo: 'https://trello.com/favicon.ico', category: 'Productivity', link: 'https://trello.com', pricing: 'freemium' },
    { name: 'Asana', description: 'Team collaboration and project management', logo: 'https://asana.com/favicon.ico', category: 'Productivity', link: 'https://asana.com', pricing: 'freemium' },
    { name: 'Monday.com', description: 'Work operating system', logo: 'https://monday.com/favicon.ico', category: 'Productivity', link: 'https://monday.com', pricing: 'freemium' },
    { name: 'ClickUp', description: 'All-in-one productivity platform', logo: 'https://clickup.com/favicon.ico', category: 'Productivity', link: 'https://clickup.com', pricing: 'freemium' },
    { name: 'Airtable', description: 'Database and spreadsheet hybrid', logo: 'https://airtable.com/favicon.ico', category: 'Productivity', link: 'https://airtable.com', pricing: 'freemium' },
    { name: 'Slack', description: 'Business communication platform', logo: 'https://slack.com/favicon.ico', category: 'Productivity', link: 'https://slack.com', pricing: 'freemium' },
    { name: 'Microsoft Teams', description: 'Collaboration and communication', logo: 'https://www.microsoft.com/favicon.ico', category: 'Productivity', link: 'https://www.microsoft.com/en-us/microsoft-teams', pricing: 'freemium' },
    { name: 'Zoom', description: 'Video conferencing and communication', logo: 'https://zoom.us/favicon.ico', category: 'Productivity', link: 'https://zoom.us', pricing: 'freemium' }
    ],
    'finance-tools': [
    { name: 'Mint', description: 'Personal finance management', logo: 'https://mint.intuit.com/favicon.ico', category: 'Finance Tools', link: 'https://mint.intuit.com', pricing: 'free' },
    { name: 'YNAB', description: 'You Need A Budget - budgeting software', logo: 'https://www.youneedabudget.com/favicon.ico', category: 'Finance Tools', link: 'https://www.youneedabudget.com', pricing: 'premium' },
    { name: 'Personal Capital', description: 'Wealth management and tracking', logo: 'https://www.personalcapital.com/favicon.ico', category: 'Finance Tools', link: 'https://www.personalcapital.com', pricing: 'free' },
    { name: 'Quicken', description: 'Personal finance software', logo: 'https://www.quicken.com/favicon.ico', category: 'Finance Tools', link: 'https://www.quicken.com', pricing: 'premium' },
    { name: 'Tiller', description: 'Spreadsheet-based budgeting', logo: 'https://www.tillerhq.com/favicon.ico', category: 'Finance Tools', link: 'https://www.tillerhq.com', pricing: 'premium' },
    { name: 'PocketGuard', description: 'Budgeting and expense tracking', logo: 'https://pocketguard.com/favicon.ico', category: 'Finance Tools', link: 'https://pocketguard.com', pricing: 'freemium' },
    { name: 'Goodbudget', description: 'Envelope budgeting app', logo: 'https://goodbudget.com/favicon.ico', category: 'Finance Tools', link: 'https://goodbudget.com', pricing: 'freemium' },
    { name: 'EveryDollar', description: 'Zero-based budgeting tool', logo: 'https://www.everydollar.com/favicon.ico', category: 'Finance Tools', link: 'https://www.everydollar.com', pricing: 'freemium' },
    { name: 'Honeydue', description: 'Couples money management', logo: 'https://www.honeydue.com/favicon.ico', category: 'Finance Tools', link: 'https://www.honeydue.com', pricing: 'free' },
    { name: 'Spendee', description: 'Personal finance and budgeting', logo: 'https://www.spendee.com/favicon.ico', category: 'Finance Tools', link: 'https://www.spendee.com', pricing: 'freemium' }
    ],
    'health-tools': [
    { name: 'MyFitnessPal', description: 'Calorie counting and nutrition tracking', logo: 'https://www.myfitnesspal.com/favicon.ico', category: 'Health Tools', link: 'https://www.myfitnesspal.com', pricing: 'freemium' },
    { name: 'Fitbit', description: 'Fitness tracking and health monitoring', logo: 'https://www.fitbit.com/favicon.ico', category: 'Health Tools', link: 'https://www.fitbit.com', pricing: 'premium' },
    { name: 'Apple Health', description: 'Comprehensive health tracking', logo: 'https://www.apple.com/favicon.ico', category: 'Health Tools', link: 'https://www.apple.com/ios/health', pricing: 'free' },
    { name: 'Google Fit', description: 'Activity tracking and health insights', logo: 'https://www.google.com/favicon.ico', category: 'Health Tools', link: 'https://www.google.com/fit', pricing: 'free' },
    { name: 'Headspace', description: 'Meditation and mindfulness app', logo: 'https://www.headspace.com/favicon.ico', category: 'Health Tools', link: 'https://www.headspace.com', pricing: 'freemium' },
    { name: 'Calm', description: 'Sleep, meditation, and relaxation', logo: 'https://www.calm.com/favicon.ico', category: 'Health Tools', link: 'https://www.calm.com', pricing: 'freemium' },
    { name: 'Strava', description: 'Social fitness tracking', logo: 'https://www.strava.com/favicon.ico', category: 'Health Tools', link: 'https://www.strava.com', pricing: 'freemium' },
    { name: 'Lose It!', description: 'Calorie counting and weight loss', logo: 'https://www.loseit.com/favicon.ico', category: 'Health Tools', link: 'https://www.loseit.com', pricing: 'freemium' },
    { name: 'Sleep Cycle', description: 'Sleep tracking and smart alarm', logo: 'https://www.sleepcycle.com/favicon.ico', category: 'Health Tools', link: 'https://www.sleepcycle.com', pricing: 'freemium' },
    { name: 'Noom', description: 'Psychology-based weight loss', logo: 'https://www.noom.com/favicon.ico', category: 'Health Tools', link: 'https://www.noom.com', pricing: 'premium' }
    ],
    'education-tools': [
    { name: 'Khan Academy', description: 'Free online learning platform', logo: 'https://www.khanacademy.org/favicon.ico', category: 'Education Tools', link: 'https://www.khanacademy.org', pricing: 'free' },
    { name: 'Coursera', description: 'Online courses from universities', logo: 'https://www.coursera.org/favicon.ico', category: 'Education Tools', link: 'https://www.coursera.org', pricing: 'freemium' },
    { name: 'edX', description: 'University-level online courses', logo: 'https://www.edx.org/favicon.ico', category: 'Education Tools', link: 'https://www.edx.org', pricing: 'freemium' },
    { name: 'Udemy', description: 'Online learning marketplace', logo: 'https://www.udemy.com/favicon.ico', category: 'Education Tools', link: 'https://www.udemy.com', pricing: 'freemium' },
    { name: 'Duolingo', description: 'Language learning platform', logo: 'https://www.duolingo.com/favicon.ico', category: 'Education Tools', link: 'https://www.duolingo.com', pricing: 'freemium' },
    { name: 'Skillshare', description: 'Creative and business skills', logo: 'https://www.skillshare.com/favicon.ico', category: 'Education Tools', link: 'https://www.skillshare.com', pricing: 'freemium' },
    { name: 'MasterClass', description: 'Learn from experts and celebrities', logo: 'https://www.masterclass.com/favicon.ico', category: 'Education Tools', link: 'https://www.masterclass.com', pricing: 'premium' },
    { name: 'Pluralsight', description: 'Technology skills platform', logo: 'https://www.pluralsight.com/favicon.ico', category: 'Education Tools', link: 'https://www.pluralsight.com', pricing: 'premium' },
    { name: 'LinkedIn Learning', description: 'Professional development courses', logo: 'https://www.linkedin.com/favicon.ico', category: 'Education Tools', link: 'https://www.linkedin.com/learning', pricing: 'premium' },
    { name: 'Codecademy', description: 'Interactive coding lessons', logo: 'https://www.codecademy.com/favicon.ico', category: 'Education Tools', link: 'https://www.codecademy.com', pricing: 'freemium' }
    ],
    'gaming-tools': [
    { name: 'Unity', description: 'Game development platform', logo: 'https://unity.com/favicon.ico', category: 'Gaming Tools', link: 'https://unity.com', pricing: 'freemium' },
    { name: 'Unreal Engine', description: 'Game engine and development tools', logo: 'https://www.unrealengine.com/favicon.ico', category: 'Gaming Tools', link: 'https://www.unrealengine.com', pricing: 'freemium' },
    { name: 'GameMaker Studio', description: '2D game development platform', logo: 'https://www.yoyogames.com/favicon.ico', category: 'Gaming Tools', link: 'https://www.yoyogames.com/gamemaker', pricing: 'premium' },
    { name: 'Construct 3', description: 'Browser-based game development', logo: 'https://www.construct.net/favicon.ico', category: 'Gaming Tools', link: 'https://www.construct.net', pricing: 'freemium' },
    { name: 'Godot', description: 'Open source game engine', logo: 'https://godotengine.org/favicon.ico', category: 'Gaming Tools', link: 'https://godotengine.org', pricing: 'free' },
    { name: 'RPG Maker', description: 'Create RPGs without programming', logo: 'https://www.rpgmakerweb.com/favicon.ico', category: 'Gaming Tools', link: 'https://www.rpgmakerweb.com', pricing: 'premium' },
    { name: 'Buildbox', description: 'No-code game development', logo: 'https://www.buildbox.com/favicon.ico', category: 'Gaming Tools', link: 'https://www.buildbox.com', pricing: 'premium' },
    { name: 'Stencyl', description: 'Game creation without code', logo: 'https://www.stencyl.com/favicon.ico', category: 'Gaming Tools', link: 'https://www.stencyl.com', pricing: 'freemium' },
    { name: 'Corona SDK', description: 'Cross-platform mobile game development', logo: 'https://coronalabs.com/favicon.ico', category: 'Gaming Tools', link: 'https://coronalabs.com', pricing: 'free' },
    { name: 'Defold', description: 'Game engine for mobile games', logo: 'https://defold.com/favicon.ico', category: 'Gaming Tools', link: 'https://defold.com', pricing: 'free' }
    ],
    'social-media-tools': [
    { name: 'TweetDeck', description: 'Free Twitter management tool', logo: 'https://tweetdeck.twitter.com/favicon.ico', category: 'Social Media', link: 'https://tweetdeck.twitter.com/', pricing: 'free' },
    { name: 'Later Free', description: 'Free social media scheduler', logo: 'https://later.com/favicon.ico', category: 'Social Media', link: 'https://later.com/', pricing: 'free' },
    { name: 'Hootsuite', description: 'Social media management platform', logo: 'https://hootsuite.com/favicon.ico', category: 'Social Media', link: 'https://hootsuite.com', pricing: 'premium' },
    { name: 'Buffer', description: 'Social media scheduling and analytics', logo: 'https://buffer.com/favicon.ico', category: 'Social Media', link: 'https://buffer.com', pricing: 'freemium' },
    { name: 'Sprout Social', description: 'Social media management and analytics', logo: 'https://sproutsocial.com/favicon.ico', category: 'Social Media', link: 'https://sproutsocial.com', pricing: 'premium' },
    { name: 'Later', description: 'Visual social media scheduler', logo: 'https://later.com/favicon.ico', category: 'Social Media', link: 'https://later.com', pricing: 'freemium' },
    { name: 'SocialBee', description: 'Social media management tool', logo: 'https://socialbee.io/favicon.ico', category: 'Social Media', link: 'https://socialbee.io', pricing: 'freemium' },
    { name: 'CoSchedule', description: 'Marketing calendar and social media', logo: 'https://coschedule.com/favicon.ico', category: 'Social Media', link: 'https://coschedule.com', pricing: 'premium' },
    { name: 'Sendible', description: 'Social media management for agencies', logo: 'https://www.sendible.com/favicon.ico', category: 'Social Media', link: 'https://www.sendible.com', pricing: 'premium' },
    { name: 'Agorapulse', description: 'Social media management and CRM', logo: 'https://www.agorapulse.com/favicon.ico', category: 'Social Media', link: 'https://www.agorapulse.com', pricing: 'premium' },
    { name: 'MeetEdgar', description: 'Social media automation', logo: 'https://meetedgar.com/favicon.ico', category: 'Social Media', link: 'https://meetedgar.com', pricing: 'premium' },
    { name: 'Socialbakers', description: 'AI-powered social media marketing', logo: 'https://www.socialbakers.com/favicon.ico', category: 'Social Media', link: 'https://www.socialbakers.com', pricing: 'premium' }
    ],
    'legal-tools': [
    { name: 'LawHelp.org', description: 'Free legal aid resources', logo: 'https://www.lawhelp.org/favicon.ico', category: 'Legal Tools', link: 'https://www.lawhelp.org/', pricing: 'free' },
    { name: 'Legal Services Corporation', description: 'Free legal assistance finder', logo: 'https://www.lsc.gov/favicon.ico', category: 'Legal Tools', link: 'https://www.lsc.gov/', pricing: 'free' },
    { name: 'LegalZoom', description: 'Online legal services', logo: 'https://www.legalzoom.com/favicon.ico', category: 'Legal Tools', link: 'https://www.legalzoom.com', pricing: 'premium' },
    { name: 'Rocket Lawyer', description: 'Legal documents and advice', logo: 'https://www.rocketlawyer.com/favicon.ico', category: 'Legal Tools', link: 'https://www.rocketlawyer.com', pricing: 'premium' },
    { name: 'Nolo', description: 'Legal information and software', logo: 'https://www.nolo.com/favicon.ico', category: 'Legal Tools', link: 'https://www.nolo.com', pricing: 'freemium' },
    { name: 'LawDepot', description: 'Legal document templates', logo: 'https://www.lawdepot.com/favicon.ico', category: 'Legal Tools', link: 'https://www.lawdepot.com', pricing: 'premium' },
    { name: 'DoNotPay', description: 'AI lawyer for consumer rights', logo: 'https://donotpay.com/favicon.ico', category: 'Legal Tools', link: 'https://donotpay.com', pricing: 'freemium' },
    { name: 'Clio', description: 'Legal practice management software', logo: 'https://www.clio.com/favicon.ico', category: 'Legal Tools', link: 'https://www.clio.com', pricing: 'premium' },
    { name: 'MyCase', description: 'Legal case management software', logo: 'https://www.mycase.com/favicon.ico', category: 'Legal Tools', link: 'https://www.mycase.com', pricing: 'premium' },
    { name: 'PracticePanther', description: 'Legal practice management', logo: 'https://www.practicepanther.com/favicon.ico', category: 'Legal Tools', link: 'https://www.practicepanther.com', pricing: 'premium' },
    { name: 'Smokeball', description: 'Legal practice management software', logo: 'https://www.smokeball.com/favicon.ico', category: 'Legal Tools', link: 'https://www.smokeball.com', pricing: 'premium' },
    { name: 'TimeSolv', description: 'Legal time tracking and billing', logo: 'https://www.timesolv.com/favicon.ico', category: 'Legal Tools', link: 'https://www.timesolv.com', pricing: 'premium' }
    ],
    'hr-tools': [
    { name: 'OrangeHRM', description: 'Free open-source HR management', logo: 'https://www.orangehrm.com/favicon.ico', category: 'HR Tools', link: 'https://www.orangehrm.com/', pricing: 'free' },
    { name: 'Bitrix24 Free', description: 'Free HR and collaboration platform', logo: 'https://www.bitrix24.com/favicon.ico', category: 'HR Tools', link: 'https://www.bitrix24.com/', pricing: 'free' },
    { name: 'BambooHR', description: 'Human resources software', logo: 'https://www.bamboohr.com/favicon.ico', category: 'HR Tools', link: 'https://www.bamboohr.com', pricing: 'premium' },
    { name: 'Workday', description: 'Enterprise HR and finance software', logo: 'https://www.workday.com/favicon.ico', category: 'HR Tools', link: 'https://www.workday.com', pricing: 'premium' },
    { name: 'ADP', description: 'Payroll and HR services', logo: 'https://www.adp.com/favicon.ico', category: 'HR Tools', link: 'https://www.adp.com', pricing: 'premium' },
    { name: 'Gusto', description: 'Payroll, benefits, and HR', logo: 'https://gusto.com/favicon.ico', category: 'HR Tools', link: 'https://gusto.com', pricing: 'premium' },
    { name: 'Zenefits', description: 'HR platform for small businesses', logo: 'https://www.zenefits.com/favicon.ico', category: 'HR Tools', link: 'https://www.zenefits.com', pricing: 'freemium' },
    { name: 'Namely', description: 'HR platform for mid-sized companies', logo: 'https://www.namely.com/favicon.ico', category: 'HR Tools', link: 'https://www.namely.com', pricing: 'premium' },
    { name: 'Paycor', description: 'HR and payroll software', logo: 'https://www.paycor.com/favicon.ico', category: 'HR Tools', link: 'https://www.paycor.com', pricing: 'premium' },
    { name: 'UltiPro', description: 'HR, payroll, and talent management', logo: 'https://www.ultimatesoftware.com/favicon.ico', category: 'HR Tools', link: 'https://www.ultimatesoftware.com', pricing: 'premium' },
    { name: 'SuccessFactors', description: 'SAP HR management suite', logo: 'https://www.successfactors.com/favicon.ico', category: 'HR Tools', link: 'https://www.successfactors.com', pricing: 'premium' },
    { name: 'Greenhouse', description: 'Recruiting and hiring software', logo: 'https://www.greenhouse.io/favicon.ico', category: 'HR Tools', link: 'https://www.greenhouse.io', pricing: 'premium' }
    ],
    'real-estate-tools': [
    { name: 'Zillow', description: 'Real estate search and valuation', logo: 'https://www.zillow.com/favicon.ico', category: 'Real Estate', link: 'https://www.zillow.com', pricing: 'free' },
    { name: 'Realtor.com', description: 'Real estate listings and tools', logo: 'https://www.realtor.com/favicon.ico', category: 'Real Estate', link: 'https://www.realtor.com', pricing: 'free' },
    { name: 'Redfin', description: 'Real estate brokerage and search', logo: 'https://www.redfin.com/favicon.ico', category: 'Real Estate', link: 'https://www.redfin.com', pricing: 'free' },
    { name: 'BiggerPockets', description: 'Real estate investing community', logo: 'https://www.biggerpockets.com/favicon.ico', category: 'Real Estate', link: 'https://www.biggerpockets.com', pricing: 'freemium' },
    { name: 'LoopNet', description: 'Commercial real estate marketplace', logo: 'https://www.loopnet.com/favicon.ico', category: 'Real Estate', link: 'https://www.loopnet.com', pricing: 'freemium' },
    { name: 'CoStar', description: 'Commercial real estate information', logo: 'https://www.costar.com/favicon.ico', category: 'Real Estate', link: 'https://www.costar.com', pricing: 'premium' },
    { name: 'MLS', description: 'Multiple listing service', logo: 'https://www.mls.com/favicon.ico', category: 'Real Estate', link: 'https://www.mls.com', pricing: 'free' },
    { name: 'Chime', description: 'Real estate CRM and lead management', logo: 'https://www.chime.me/favicon.ico', category: 'Real Estate', link: 'https://www.chime.me', pricing: 'premium' },
    { name: 'Top Producer', description: 'Real estate CRM software', logo: 'https://www.topproducer.com/favicon.ico', category: 'Real Estate', link: 'https://www.topproducer.com', pricing: 'premium' },
    { name: 'Wise Agent', description: 'Real estate CRM and marketing', logo: 'https://www.wiseagent.com/favicon.ico', category: 'Real Estate', link: 'https://www.wiseagent.com', pricing: 'premium' }
    ],
    'sales-tools': [
    { name: 'HubSpot CRM Free', description: 'Free CRM and sales tools', logo: 'https://www.hubspot.com/favicon.ico', category: 'Sales Tools', link: 'https://www.hubspot.com/products/crm', pricing: 'free' },
    { name: 'Bitrix24 CRM', description: 'Free CRM for sales teams', logo: 'https://www.bitrix24.com/favicon.ico', category: 'Sales Tools', link: 'https://www.bitrix24.com/tools/crm/', pricing: 'free' },
        // { name: 'Salesforce', description: 'Customer relationship management', logo: 'https://www.salesforce.com/favicon.ico', category: 'Sales Tools', link: 'https://www.salesforce.com' },
    { name: 'HubSpot', description: 'Inbound marketing and sales platform', logo: 'https://www.hubspot.com/favicon.ico', category: 'Sales Tools', link: 'https://www.hubspot.com', pricing: 'freemium' },
    { name: 'Pipedrive', description: 'Sales CRM and pipeline management', logo: 'https://www.pipedrive.com/favicon.ico', category: 'Sales Tools', link: 'https://www.pipedrive.com', pricing: 'premium' },
    { name: 'Zoho CRM', description: 'Customer relationship management', logo: 'https://www.zoho.com/favicon.ico', category: 'Sales Tools', link: 'https://www.zoho.com/crm', pricing: 'freemium' },
    { name: 'Monday Sales CRM', description: 'Visual sales pipeline management', logo: 'https://monday.com/favicon.ico', category: 'Sales Tools', link: 'https://monday.com/crm', pricing: 'premium' },
    { name: 'Freshsales', description: 'Sales CRM software', logo: 'https://www.freshworks.com/favicon.ico', category: 'Sales Tools', link: 'https://www.freshworks.com/crm/sales', pricing: 'freemium' },
    { name: 'Close', description: 'Inside sales CRM', logo: 'https://close.com/favicon.ico', category: 'Sales Tools', link: 'https://close.com', pricing: 'premium' },
    { name: 'Outreach', description: 'Sales engagement platform', logo: 'https://www.outreach.io/favicon.ico', category: 'Sales Tools', link: 'https://www.outreach.io', pricing: 'premium' },
    { name: 'SalesLoft', description: 'Sales engagement platform', logo: 'https://salesloft.com/favicon.ico', category: 'Sales Tools', link: 'https://salesloft.com', pricing: 'premium' },
    { name: 'Gong', description: 'Revenue intelligence platform', logo: 'https://www.gong.io/favicon.ico', category: 'Sales Tools', link: 'https://www.gong.io', pricing: 'premium' }
    ],
    'customer-service-tools': [
    { name: 'Tidio Free', description: 'Free live chat and chatbots', logo: 'https://www.tidio.com/favicon.ico', category: 'Customer Service', link: 'https://www.tidio.com/', pricing: 'free' },
    { name: 'Tawk.to', description: 'Free live chat software', logo: 'https://www.tawk.to/favicon.ico', category: 'Customer Service', link: 'https://www.tawk.to/', pricing: 'free' },
    { name: 'Zendesk', description: 'Customer service and support platform', logo: 'https://www.zendesk.com/favicon.ico', category: 'Customer Service', link: 'https://www.zendesk.com', pricing: 'premium' },
    { name: 'Freshdesk', description: 'Customer support software', logo: 'https://freshdesk.com/favicon.ico', category: 'Customer Service', link: 'https://freshdesk.com', pricing: 'freemium' },
    { name: 'Intercom', description: 'Customer messaging platform', logo: 'https://www.intercom.com/favicon.ico', category: 'Customer Service', link: 'https://www.intercom.com', pricing: 'premium' },
    { name: 'Help Scout', description: 'Customer service platform', logo: 'https://www.helpscout.com/favicon.ico', category: 'Customer Service', link: 'https://www.helpscout.com', pricing: 'premium' },
    { name: 'LiveChat', description: 'Customer service live chat software', logo: 'https://www.livechat.com/favicon.ico', category: 'Customer Service', link: 'https://www.livechat.com', pricing: 'premium' },
    { name: 'Drift', description: 'Conversational marketing platform', logo: 'https://www.drift.com/favicon.ico', category: 'Customer Service', link: 'https://www.drift.com', pricing: 'premium' },
    { name: 'Crisp', description: 'Customer messaging platform', logo: 'https://crisp.chat/favicon.ico', category: 'Customer Service', link: 'https://crisp.chat', pricing: 'freemium' },
    { name: 'Kayako', description: 'Customer service software', logo: 'https://www.kayako.com/favicon.ico', category: 'Customer Service', link: 'https://www.kayako.com', pricing: 'premium' },
    { name: 'ServiceNow', description: 'Enterprise service management', logo: 'https://www.servicenow.com/favicon.ico', category: 'Customer Service', link: 'https://www.servicenow.com', pricing: 'premium' },
    { name: 'Jira Service Management', description: 'IT service management', logo: 'https://www.atlassian.com/favicon.ico', category: 'Customer Service', link: 'https://www.atlassian.com/software/jira/service-management', pricing: 'premium' }
    ],
    'cybersecurity-tools': [
    { name: 'Norton', description: 'Antivirus and internet security', logo: 'https://us.norton.com/favicon.ico', category: 'Cybersecurity', link: 'https://us.norton.com', pricing: 'premium' },
    { name: 'McAfee', description: 'Antivirus and cybersecurity solutions', logo: 'https://www.mcafee.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.mcafee.com', pricing: 'premium' },
    { name: 'Kaspersky', description: 'Antivirus and internet security', logo: 'https://www.kaspersky.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.kaspersky.com', pricing: 'premium' },
    { name: 'Bitdefender', description: 'Cybersecurity and antivirus solutions', logo: 'https://www.bitdefender.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.bitdefender.com', pricing: 'premium' },
    { name: 'Avast', description: 'Antivirus and internet security', logo: 'https://www.avast.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.avast.com', pricing: 'freemium' },
    { name: 'Malwarebytes', description: 'Anti-malware and cybersecurity', logo: 'https://www.malwarebytes.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.malwarebytes.com', pricing: 'freemium' },
    { name: 'CrowdStrike', description: 'Endpoint protection platform', logo: 'https://www.crowdstrike.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.crowdstrike.com', pricing: 'premium' },
    { name: 'SentinelOne', description: 'AI-powered cybersecurity platform', logo: 'https://www.sentinelone.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.sentinelone.com', pricing: 'premium' },
    { name: 'Palo Alto Networks', description: 'Cybersecurity platform', logo: 'https://www.paloaltonetworks.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.paloaltonetworks.com', pricing: 'premium' },
    { name: 'Fortinet', description: 'Cybersecurity solutions', logo: 'https://www.fortinet.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.fortinet.com', pricing: 'premium' },
    { name: 'VirusTotal', description: 'Free malware scanning and threat intelligence', logo: 'https://www.virustotal.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.virustotal.com/', pricing: 'free' },
    { name: 'Cuckoo Sandbox', description: 'Open-source automated malware analysis', logo: 'https://cuckoosandbox.org/favicon.ico', category: 'Cybersecurity', link: 'https://cuckoosandbox.org/', pricing: 'free' },
    { name: 'Metasploit Community', description: 'Free penetration testing framework', logo: 'https://www.metasploit.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.metasploit.com/', pricing: 'free' }
    ],
    'logistics-tools': [
    { name: 'ShipStation', description: 'Shipping and order fulfillment', logo: 'https://www.shipstation.com/favicon.ico', category: 'Logistics', link: 'https://www.shipstation.com', pricing: 'premium' },
    { name: 'Easyship', description: 'Global shipping platform', logo: 'https://www.easyship.com/favicon.ico', category: 'Logistics', link: 'https://www.easyship.com', pricing: 'freemium' },
    { name: 'ShipBob', description: 'E-commerce fulfillment service', logo: 'https://www.shipbob.com/favicon.ico', category: 'Logistics', link: 'https://www.shipbob.com', pricing: 'premium' },
    { name: 'Flexport', description: 'Global freight forwarder', logo: 'https://www.flexport.com/favicon.ico', category: 'Logistics', link: 'https://www.flexport.com', pricing: 'premium' },
    { name: 'FreightWaves', description: 'Freight market intelligence', logo: 'https://www.freightwaves.com/favicon.ico', category: 'Logistics', link: 'https://www.freightwaves.com', pricing: 'freemium' },
    { name: 'Project44', description: 'Supply chain visibility platform', logo: 'https://www.project44.com/favicon.ico', category: 'Logistics', link: 'https://www.project44.com', pricing: 'premium' },
    { name: 'Convoy', description: 'Digital freight network', logo: 'https://convoy.com/favicon.ico', category: 'Logistics', link: 'https://convoy.com', pricing: 'freemium' },
    { name: 'Uber Freight', description: 'Freight marketplace', logo: 'https://www.uberfreight.com/favicon.ico', category: 'Logistics', link: 'https://www.uberfreight.com', pricing: 'freemium' },
    { name: 'C.H. Robinson', description: 'Third-party logistics provider', logo: 'https://www.chrobinson.com/favicon.ico', category: 'Logistics', link: 'https://www.chrobinson.com', pricing: 'premium' },
    { name: 'XPO Logistics', description: 'Supply chain solutions', logo: 'https://www.xpo.com/favicon.ico', category: 'Logistics', link: 'https://www.xpo.com', pricing: 'premium' },
    { name: 'OpenLMIS', description: 'Open-source logistics management', logo: 'https://openlmis.org/favicon.ico', category: 'Logistics', link: 'https://openlmis.org/', pricing: 'free' },
    { name: 'Logistimo', description: 'Free supply chain and logistics platform', logo: 'https://www.logistimo.com/favicon.ico', category: 'Logistics', link: 'https://www.logistimo.com/', pricing: 'free' },
    { name: 'Transporeon Free', description: 'Free logistics management tools', logo: 'https://www.transporeon.com/favicon.ico', category: 'Logistics', link: 'https://www.transporeon.com/', pricing: 'free' }
    ],
    'agriculture-tools': [
    { name: 'Climate FieldView', description: 'Digital agriculture platform', logo: 'https://www.climate.com/favicon.ico', category: 'Agriculture', link: 'https://www.climate.com', pricing: 'premium' },
    { name: 'John Deere Operations Center', description: 'Farm management software', logo: 'https://www.deere.com/favicon.ico', category: 'Agriculture', link: 'https://www.deere.com', pricing: 'premium' },
    { name: 'Granular', description: 'Farm management software', logo: 'https://www.granular.ag/favicon.ico', category: 'Agriculture', link: 'https://www.granular.ag', pricing: 'premium' },
    { name: 'FarmLogs', description: 'Farm record keeping and analytics', logo: 'https://farmlogs.com/favicon.ico', category: 'Agriculture', link: 'https://farmlogs.com', pricing: 'freemium' },
    { name: 'AgriWebb', description: 'Livestock and farm management', logo: 'https://www.agriwebb.com/favicon.ico', category: 'Agriculture', link: 'https://www.agriwebb.com', pricing: 'premium' },
    { name: 'Trimble Ag', description: 'Precision agriculture solutions', logo: 'https://agriculture.trimble.com/favicon.ico', category: 'Agriculture', link: 'https://agriculture.trimble.com', pricing: 'premium' },
    { name: 'Farmers Edge', description: 'Digital agriculture platform', logo: 'https://www.farmersedge.ca/favicon.ico', category: 'Agriculture', link: 'https://www.farmersedge.ca', pricing: 'premium' },
    { name: 'Cropio', description: 'Satellite field monitoring', logo: 'https://www.cropio.com/favicon.ico', category: 'Agriculture', link: 'https://www.cropio.com', pricing: 'premium' },
    { name: 'PrecisionHawk', description: 'Drone-based agriculture analytics', logo: 'https://www.precisionhawk.com/favicon.ico', category: 'Agriculture', link: 'https://www.precisionhawk.com', pricing: 'premium' },
    { name: 'Taranis', description: 'AI-powered crop intelligence', logo: 'https://www.taranis.com/favicon.ico', category: 'Agriculture', link: 'https://www.taranis.com', pricing: 'premium' },
    { name: 'FarmLogs', description: 'Free farm management software', logo: 'https://farmlogs.com/favicon.ico', category: 'Agriculture', link: 'https://farmlogs.com/', pricing: 'free' },
    { name: 'AgriWebb Free', description: 'Free digital farm management', logo: 'https://www.agriwebb.com/favicon.ico', category: 'Agriculture', link: 'https://www.agriwebb.com/', pricing: 'free' },
    { name: 'OpenATK', description: 'Open-source agricultural toolkits', logo: 'https://openatk.com/favicon.ico', category: 'Agriculture', link: 'https://openatk.com/', pricing: 'free' }
    ],
    'photo-editing-tools': [
    { name: 'Photoshop AI', description: 'Adobe Photoshop with AI-powered features', logo: 'https://www.adobe.com/favicon.ico', category: 'Photo Editing', link: 'https://www.adobe.com/products/photoshop.html', pricing: 'premium' },
    { name: 'Luminar AI', description: 'AI-powered photo editing software', logo: 'https://skylum.com/favicon.ico', category: 'Photo Editing', link: 'https://skylum.com/luminar-ai', pricing: 'premium' },
    { name: 'Topaz Labs', description: 'AI image enhancement and upscaling', logo: 'https://www.topazlabs.com/favicon.ico', category: 'Photo Editing', link: 'https://www.topazlabs.com', pricing: 'premium' },
    { name: 'Remove.bg', description: 'AI background removal tool', logo: 'https://www.remove.bg/favicon.ico', category: 'Photo Editing', link: 'https://www.remove.bg', pricing: 'freemium' },
    { name: 'Upscale.media', description: 'AI image upscaling and enhancement', logo: 'https://upscale.media/favicon.ico', category: 'Photo Editing', link: 'https://upscale.media', pricing: 'freemium' },
    { name: 'Cleanup.pictures', description: 'Remove objects from photos with AI', logo: 'https://cleanup.pictures/favicon.ico', category: 'Photo Editing', link: 'https://cleanup.pictures', pricing: 'freemium' },
    { name: 'Colorize.cc', description: 'AI-powered photo colorization', logo: 'https://colorize.cc/favicon.ico', category: 'Photo Editing', link: 'https://colorize.cc', pricing: 'freemium' },
    { name: 'Enhance.Pho.to', description: 'AI photo enhancement and filters', logo: 'https://enhance.pho.to/favicon.ico', category: 'Photo Editing', link: 'https://enhance.pho.to', pricing: 'free' },
    { name: 'Fotor', description: 'AI-powered photo editor and design tool', logo: 'https://www.fotor.com/favicon.ico', category: 'Photo Editing', link: 'https://www.fotor.com', pricing: 'freemium' },
    { name: 'Pixlr AI', description: 'Online photo editor with AI features', logo: 'https://pixlr.com/favicon.ico', category: 'Photo Editing', link: 'https://pixlr.com', pricing: 'freemium' }
    ],
    'writing-assistants': [
    { name: 'Hemingway App Free', description: 'Free writing clarity tool', logo: 'https://hemingwayapp.com/favicon.ico', category: 'Writing Assistant', link: 'https://hemingwayapp.com/', pricing: 'free' },
    { name: 'LanguageTool Free', description: 'Free grammar and style checker', logo: 'https://languagetool.org/favicon.ico', category: 'Writing Assistant', link: 'https://languagetool.org/', pricing: 'free' },
    { name: 'Grammarly', description: 'AI writing assistant for grammar and style', logo: 'https://www.grammarly.com/favicon.ico', category: 'Writing Assistant', link: 'https://www.grammarly.com', pricing: 'freemium' },
    { name: 'ProWritingAid', description: 'Grammar checker and writing coach', logo: 'https://prowritingaid.com/favicon.ico', category: 'Writing Assistant', link: 'https://prowritingaid.com', pricing: 'freemium' },
    { name: 'Hemingway Editor', description: 'Make your writing bold and clear', logo: 'https://hemingwayapp.com/favicon.ico', category: 'Writing Assistant', link: 'https://hemingwayapp.com', pricing: 'freemium' },
    { name: 'LanguageTool', description: 'Grammar and style checker', logo: 'https://languagetool.org/favicon.ico', category: 'Writing Assistant', link: 'https://languagetool.org', pricing: 'freemium' },
    { name: 'Ginger', description: 'Grammar and spell checker', logo: 'https://www.gingersoftware.com/favicon.ico', category: 'Writing Assistant', link: 'https://www.gingersoftware.com', pricing: 'freemium' },
    { name: 'WhiteSmoke', description: 'English writing enhancement software', logo: 'https://www.whitesmoke.com/favicon.ico', category: 'Writing Assistant', link: 'https://www.whitesmoke.com', pricing: 'premium' },
    { name: 'Sapling', description: 'AI writing assistant for teams', logo: 'https://sapling.ai/favicon.ico', category: 'Writing Assistant', link: 'https://sapling.ai', pricing: 'freemium' },
    { name: 'Outwrite', description: 'AI writing assistant and editor', logo: 'https://www.outwrite.com/favicon.ico', category: 'Writing Assistant', link: 'https://www.outwrite.com', pricing: 'freemium' },
    { name: 'Writer', description: 'AI writing platform for teams', logo: 'https://writer.com/favicon.ico', category: 'Writing Assistant', link: 'https://writer.com', pricing: 'premium' },
    { name: 'Wordtune', description: 'AI writing companion', logo: 'https://www.wordtune.com/favicon.ico', category: 'Writing Assistant', link: 'https://www.wordtune.com', pricing: 'freemium' }
    ],
    'meeting-tools': [
    { name: 'Google Meet', description: 'Free video conferencing', logo: 'https://meet.google.com/favicon.ico', category: 'Meeting Tools', link: 'https://meet.google.com/', pricing: 'free' },
    { name: 'Jitsi Meet', description: 'Free open-source video conferencing', logo: 'https://meet.jit.si/favicon.ico', category: 'Meeting Tools', link: 'https://meet.jit.si/', pricing: 'free' },
    { name: 'Otter.ai', description: 'AI meeting transcription and notes', logo: 'https://otter.ai/favicon.ico', category: 'Meeting Tools', link: 'https://otter.ai', pricing: 'freemium' },
    { name: 'Zoom AI Companion', description: 'AI-powered meeting assistant', logo: 'https://zoom.us/favicon.ico', category: 'Meeting Tools', link: 'https://zoom.us', pricing: 'freemium' },
    { name: 'Microsoft Teams AI', description: 'AI features in Microsoft Teams', logo: 'https://www.microsoft.com/favicon.ico', category: 'Meeting Tools', link: 'https://www.microsoft.com/en-us/microsoft-teams', pricing: 'freemium' },
    { name: 'Fireflies.ai', description: 'AI meeting recorder and transcriber', logo: 'https://fireflies.ai/favicon.ico', category: 'Meeting Tools', link: 'https://fireflies.ai', pricing: 'freemium' },
    { name: 'Grain', description: 'AI-powered meeting recorder', logo: 'https://grain.com/favicon.ico', category: 'Meeting Tools', link: 'https://grain.com', pricing: 'freemium' },
    { name: 'Chorus', description: 'Conversation intelligence platform', logo: 'https://www.chorus.ai/favicon.ico', category: 'Meeting Tools', link: 'https://www.chorus.ai', pricing: 'premium' },
    { name: 'Rev', description: 'AI transcription and captioning', logo: 'https://www.rev.com/favicon.ico', category: 'Meeting Tools', link: 'https://www.rev.com', pricing: 'premium' },
    { name: 'Trint', description: 'AI transcription software', logo: 'https://trint.com/favicon.ico', category: 'Meeting Tools', link: 'https://trint.com', pricing: 'premium' },
    { name: 'Sonix', description: 'Automated transcription service', logo: 'https://sonix.ai/favicon.ico', category: 'Meeting Tools', link: 'https://sonix.ai', pricing: 'premium' },
    { name: 'Happy Scribe', description: 'Transcription and subtitling service', logo: 'https://www.happyscribe.com/favicon.ico', category: 'Meeting Tools', link: 'https://www.happyscribe.com', pricing: 'premium' }
    ],
    'recruitment-tools': [
    { name: 'HireVue', description: 'AI-powered video interviewing', logo: 'https://www.hirevue.com/favicon.ico', category: 'Recruitment', link: 'https://www.hirevue.com', pricing: 'premium' },
    { name: 'Pymetrics', description: 'AI-based talent matching', logo: 'https://www.pymetrics.ai/favicon.ico', category: 'Recruitment', link: 'https://www.pymetrics.ai', pricing: 'premium' },
    { name: 'Textio', description: 'Augmented writing for job posts', logo: 'https://textio.com/favicon.ico', category: 'Recruitment', link: 'https://textio.com', pricing: 'premium' },
    { name: 'Ideal', description: 'AI recruiting automation', logo: 'https://ideal.com/favicon.ico', category: 'Recruitment', link: 'https://ideal.com', pricing: 'premium' },
    { name: 'Eightfold AI', description: 'AI talent intelligence platform', logo: 'https://eightfold.ai/favicon.ico', category: 'Recruitment', link: 'https://eightfold.ai', pricing: 'premium' },
    { name: 'Paradox', description: 'Conversational AI for recruiting', logo: 'https://www.paradox.ai/favicon.ico', category: 'Recruitment', link: 'https://www.paradox.ai', pricing: 'premium' },
    { name: 'SeekOut', description: 'AI-powered talent search', logo: 'https://seekout.com/favicon.ico', category: 'Recruitment', link: 'https://seekout.com', pricing: 'premium' },
    { name: 'Fetcher', description: 'AI recruiting outreach', logo: 'https://fetcher.ai/favicon.ico', category: 'Recruitment', link: 'https://fetcher.ai', pricing: 'premium' },
    { name: 'Humanly', description: 'AI screening and scheduling', logo: 'https://humanly.io/favicon.ico', category: 'Recruitment', link: 'https://humanly.io', pricing: 'premium' },
    { name: 'Mya', description: 'Conversational AI recruiter', logo: 'https://mya.com/favicon.ico', category: 'Recruitment', link: 'https://mya.com', pricing: 'premium' },
    { name: 'Recruitee Free', description: 'Free recruitment software', logo: 'https://recruitee.com/favicon.ico', category: 'Recruitment', link: 'https://recruitee.com/', pricing: 'free' },
    { name: 'Zoho Recruit Free', description: 'Free applicant tracking system', logo: 'https://www.zoho.com/recruit/favicon.ico', category: 'Recruitment', link: 'https://www.zoho.com/recruit/', pricing: 'free' },
    { name: 'Workable Free', description: 'Free recruitment and hiring platform', logo: 'https://www.workable.com/favicon.ico', category: 'Recruitment', link: 'https://www.workable.com/', pricing: 'free' }
    ],
    'analytics-tools': [
    { name: 'Google Analytics', description: 'Web analytics and reporting', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com', pricing: 'free' },
    { name: 'Mixpanel', description: 'Product analytics platform', logo: 'https://mixpanel.com/favicon.ico', category: 'Analytics', link: 'https://mixpanel.com', pricing: 'freemium' },
    { name: 'Amplitude', description: 'Digital analytics platform', logo: 'https://amplitude.com/favicon.ico', category: 'Analytics', link: 'https://amplitude.com', pricing: 'freemium' },
    { name: 'Hotjar', description: 'Website heatmaps and behavior analytics', logo: 'https://www.hotjar.com/favicon.ico', category: 'Analytics', link: 'https://www.hotjar.com', pricing: 'freemium' },
    { name: 'Segment', description: 'Customer data platform', logo: 'https://segment.com/favicon.ico', category: 'Analytics', link: 'https://segment.com', pricing: 'freemium' },
    { name: 'Adobe Analytics', description: 'Enterprise analytics solution', logo: 'https://www.adobe.com/favicon.ico', category: 'Analytics', link: 'https://www.adobe.com/analytics', pricing: 'premium' },
    { name: 'Heap', description: 'Digital insights platform', logo: 'https://heap.io/favicon.ico', category: 'Analytics', link: 'https://heap.io', pricing: 'freemium' },
    { name: 'Kissmetrics', description: 'Customer engagement automation', logo: 'https://www.kissmetrics.io/favicon.ico', category: 'Analytics', link: 'https://www.kissmetrics.io', pricing: 'premium' },
    { name: 'Crazy Egg', description: 'Website optimization and analytics', logo: 'https://www.crazyegg.com/favicon.ico', category: 'Analytics', link: 'https://www.crazyegg.com', pricing: 'freemium' },
    { name: 'FullStory', description: 'Digital experience analytics', logo: 'https://www.fullstory.com/favicon.ico', category: 'Analytics', link: 'https://www.fullstory.com', pricing: 'freemium' }
    ],
    'inventory-management': [
    { name: 'TradeGecko', description: 'Inventory and order management', logo: 'https://www.tradegecko.com/favicon.ico', category: 'Inventory', link: 'https://www.tradegecko.com', pricing: 'premium' },
    { name: 'Cin7', description: 'Inventory management system', logo: 'https://cin7.com/favicon.ico', category: 'Inventory', link: 'https://cin7.com', pricing: 'premium' },
    { name: 'Zoho Inventory', description: 'Online inventory management', logo: 'https://www.zoho.com/favicon.ico', category: 'Inventory', link: 'https://www.zoho.com/inventory', pricing: 'freemium' },
    { name: 'inFlow Inventory', description: 'Small business inventory software', logo: 'https://www.inflowinventory.com/favicon.ico', category: 'Inventory', link: 'https://www.inflowinventory.com', pricing: 'freemium' },
    { name: 'Fishbowl', description: 'Manufacturing and warehouse management', logo: 'https://www.fishbowlinventory.com/favicon.ico', category: 'Inventory', link: 'https://www.fishbowlinventory.com', pricing: 'premium' },
    { name: 'NetSuite', description: 'ERP and inventory management', logo: 'https://www.netsuite.com/favicon.ico', category: 'Inventory', link: 'https://www.netsuite.com', pricing: 'premium' },
    { name: 'Ordoro', description: 'Inventory and shipping management', logo: 'https://www.ordoro.com/favicon.ico', category: 'Inventory', link: 'https://www.ordoro.com', pricing: 'premium' },
    { name: 'Katana', description: 'Manufacturing inventory software', logo: 'https://katanamrp.com/favicon.ico', category: 'Inventory', link: 'https://katanamrp.com', pricing: 'premium' },
    { name: 'Unleashed', description: 'Cloud inventory management', logo: 'https://www.unleashedsoftware.com/favicon.ico', category: 'Inventory', link: 'https://www.unleashedsoftware.com', pricing: 'premium' },
    { name: 'DEAR Inventory', description: 'Inventory management system', logo: 'https://dearsystems.com/favicon.ico', category: 'Inventory', link: 'https://dearsystems.com', pricing: 'premium' },
    { name: 'inFlow Inventory Free', description: 'Free inventory management software', logo: 'https://www.inflowinventory.com/favicon.ico', category: 'Inventory', link: 'https://www.inflowinventory.com/', pricing: 'free' },
    { name: 'Zoho Inventory Free', description: 'Free inventory management for small business', logo: 'https://www.zoho.com/inventory/favicon.ico', category: 'Inventory', link: 'https://www.zoho.com/inventory/', pricing: 'free' },
    { name: 'Sortly Free', description: 'Free inventory tracking app', logo: 'https://www.sortly.com/favicon.ico', category: 'Inventory', link: 'https://www.sortly.com/', pricing: 'free' }
    ],
    'content-moderation': [
    { name: 'Perspective API', description: 'AI content moderation by Google', logo: 'https://www.perspectiveapi.com/favicon.ico', category: 'Content Moderation', link: 'https://www.perspectiveapi.com', pricing: 'free' },
    { name: 'AWS Rekognition', description: 'Image and video analysis', logo: 'https://aws.amazon.com/favicon.ico', category: 'Content Moderation', link: 'https://aws.amazon.com/rekognition', pricing: 'premium' },
    { name: 'Microsoft Content Moderator', description: 'AI content moderation service', logo: 'https://www.microsoft.com/favicon.ico', category: 'Content Moderation', link: 'https://azure.microsoft.com/en-us/services/cognitive-services/content-moderator', pricing: 'premium' },
    { name: 'Hive Moderation', description: 'AI content moderation platform', logo: 'https://hivemoderation.com/favicon.ico', category: 'Content Moderation', link: 'https://hivemoderation.com', pricing: 'premium' },
    { name: 'Clarifai', description: 'Computer vision AI platform', logo: 'https://www.clarifai.com/favicon.ico', category: 'Content Moderation', link: 'https://www.clarifai.com', pricing: 'premium' },
    { name: 'Sightengine', description: 'Image and video moderation API', logo: 'https://sightengine.com/favicon.ico', category: 'Content Moderation', link: 'https://sightengine.com', pricing: 'premium' },
    { name: 'WebPurify', description: 'Content moderation and filtering', logo: 'https://www.webpurify.com/favicon.ico', category: 'Content Moderation', link: 'https://www.webpurify.com', pricing: 'premium' },
    { name: 'Two Hat Security', description: 'AI content moderation', logo: 'https://www.twohat.com/favicon.ico', category: 'Content Moderation', link: 'https://www.twohat.com', pricing: 'premium' },
    { name: 'Besedo', description: 'Content moderation services', logo: 'https://www.besedo.com/favicon.ico', category: 'Content Moderation', link: 'https://www.besedo.com', pricing: 'premium' },
    { name: 'Crisp Thinking', description: 'AI content moderation', logo: 'https://www.crispthinking.com/favicon.ico', category: 'Content Moderation', link: 'https://www.crispthinking.com', pricing: 'premium' }
    ],
    'survey-tools': [
    { name: 'SurveyMonkey', description: 'Online survey platform', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Survey Tools', link: 'https://www.surveymonkey.com', pricing: 'premium' },
    { name: 'Typeform', description: 'Interactive forms and surveys', logo: 'https://www.typeform.com/favicon.ico', category: 'Survey Tools', link: 'https://www.typeform.com', pricing: 'freemium' },
    { name: 'Google Forms', description: 'Free online form builder', logo: 'https://www.google.com/favicon.ico', category: 'Survey Tools', link: 'https://forms.google.com', pricing: 'free' },
    { name: 'Qualtrics', description: 'Experience management platform', logo: 'https://www.qualtrics.com/favicon.ico', category: 'Survey Tools', link: 'https://www.qualtrics.com', pricing: 'premium' },
    { name: 'JotForm', description: 'Online form builder', logo: 'https://www.jotform.com/favicon.ico', category: 'Survey Tools', link: 'https://www.jotform.com', pricing: 'freemium' },
    { name: 'Formstack', description: 'Workplace productivity platform', logo: 'https://www.formstack.com/favicon.ico', category: 'Survey Tools', link: 'https://www.formstack.com', pricing: 'premium' },
    { name: 'SurveyGizmo', description: 'Advanced survey software', logo: 'https://www.surveygizmo.com/favicon.ico', category: 'Survey Tools', link: 'https://www.surveygizmo.com', pricing: 'premium' },
    { name: 'Wufoo', description: 'Online form builder', logo: 'https://www.wufoo.com/favicon.ico', category: 'Survey Tools', link: 'https://www.wufoo.com', pricing: 'freemium' },
    { name: 'Formsite', description: 'Online form and survey builder', logo: 'https://www.formsite.com/favicon.ico', category: 'Survey Tools', link: 'https://www.formsite.com', pricing: 'freemium' },
    { name: 'SoGoSurvey', description: 'Online survey software', logo: 'https://www.sogosurvey.com/favicon.ico', category: 'Survey Tools', link: 'https://www.sogosurvey.com', pricing: 'premium' }
    ],
    'api-tools': [
    { name: 'Postman Free', description: 'Free API development platform', logo: 'https://www.postman.com/favicon.ico', category: 'API Tools', link: 'https://www.postman.com/', pricing: 'free' },
    { name: 'Insomnia Free', description: 'Free API testing tool', logo: 'https://insomnia.rest/favicon.ico', category: 'API Tools', link: 'https://insomnia.rest/', pricing: 'free' },
    { name: 'OpenAI API', description: 'Access to GPT and other AI models', logo: 'https://openai.com/favicon.ico', category: 'API Tools', link: 'https://openai.com/api', pricing: 'premium' },
    { name: 'Hugging Face API', description: 'Machine learning model APIs', logo: 'https://huggingface.co/favicon.ico', category: 'API Tools', link: 'https://huggingface.co/inference-api', pricing: 'freemium' },
    { name: 'Google Cloud AI APIs', description: 'AI and ML APIs by Google', logo: 'https://cloud.google.com/favicon.ico', category: 'API Tools', link: 'https://cloud.google.com/ai', pricing: 'premium' },
    { name: 'AWS AI Services', description: 'AI APIs and services by Amazon', logo: 'https://aws.amazon.com/favicon.ico', category: 'API Tools', link: 'https://aws.amazon.com/machine-learning/ai-services', pricing: 'premium' },
    { name: 'Azure Cognitive Services', description: 'AI APIs by Microsoft', logo: 'https://azure.microsoft.com/favicon.ico', category: 'API Tools', link: 'https://azure.microsoft.com/en-us/services/cognitive-services', pricing: 'premium' },
    { name: 'Cohere API', description: 'Natural language processing API', logo: 'https://cohere.ai/favicon.ico', category: 'API Tools', link: 'https://cohere.ai', pricing: 'premium' },
    { name: 'Anthropic API', description: 'Claude AI model API', logo: 'https://www.anthropic.com/favicon.ico', category: 'API Tools', link: 'https://www.anthropic.com', pricing: 'premium' },
    { name: 'Stability AI API', description: 'Stable Diffusion and other AI APIs', logo: 'https://stability.ai/favicon.ico', category: 'API Tools', link: 'https://stability.ai', pricing: 'freemium' },
    { name: 'Replicate', description: 'Run AI models via API', logo: 'https://replicate.com/favicon.ico', category: 'API Tools', link: 'https://replicate.com', pricing: 'freemium' },
    { name: 'AI21 Labs API', description: 'Language model APIs', logo: 'https://www.ai21.com/favicon.ico', category: 'API Tools', link: 'https://www.ai21.com', pricing: 'premium' }
    ],
    'resume-builders': [
    { name: 'Novoresume Free', description: 'Free resume builder', logo: 'https://novoresume.com/favicon.ico', category: 'Resume Builders', link: 'https://novoresume.com/', pricing: 'free' },
    { name: 'Canva Resume', description: 'Free resume templates and builder', logo: 'https://www.canva.com/favicon.ico', category: 'Resume Builders', link: 'https://www.canva.com/', pricing: 'free' },
    { name: 'Resume.com', description: 'Free online resume builder', logo: 'https://www.resume.com/favicon.ico', category: 'Resume Builders', link: 'https://www.resume.com/', pricing: 'free' },
    { name: 'Ready Player Me', description: 'Free cross-platform avatar creator', logo: 'https://readyplayer.me/favicon.ico', category: 'AI Avatars', link: 'https://readyplayer.me/', pricing: 'free' },
    { name: 'Avatarify', description: 'Open-source avatar animation', logo: 'https://avatarify.ai/favicon.ico', category: 'AI Avatars', link: 'https://avatarify.ai/', pricing: 'free' },
    { name: 'Bitmoji', description: 'Personalized cartoon avatar creator', logo: 'https://www.bitmoji.com/favicon.ico', category: 'AI Avatars', link: 'https://www.bitmoji.com/', pricing: 'free' },
    { name: 'Google Slides', description: 'Free online presentation editor', logo: 'https://www.google.com/slides/about/favicon.ico', category: 'Presentation Tools', link: 'https://www.google.com/slides/about/', pricing: 'free' },
    { name: 'Canva Presentations', description: 'Free presentation templates and editor', logo: 'https://www.canva.com/favicon.ico', category: 'Presentation Tools', link: 'https://www.canva.com/', pricing: 'free' },
    { name: 'Zoho Show', description: 'Free online presentation software', logo: 'https://www.zoho.com/show/favicon.ico', category: 'Presentation Tools', link: 'https://www.zoho.com/show/', pricing: 'free' },
    { name: 'Overleaf', description: 'AI-powered resume builder with professional templates', logo: 'https://overleaf.com/favicon.ico', category: 'Resume Builders', link: 'https://overleaf.com', pricing: 'freemium' },
    { name: 'Zety', description: 'Smart resume builder with AI suggestions', logo: 'https://zety.com/favicon.ico', category: 'Resume Builders', link: 'https://zety.com', pricing: 'premium' },
    { name: 'Novoresume', description: 'Modern resume builder with AI optimization', logo: 'https://novoresume.com/favicon.ico', category: 'Resume Builders', link: 'https://novoresume.com', pricing: 'freemium' },
    { name: 'Canva Resume', description: 'AI-enhanced resume design platform', logo: 'https://www.canva.com/favicon.ico', category: 'Resume Builders', link: 'https://www.canva.com/resumes', pricing: 'freemium' },
    { name: 'ResumeGenius', description: 'AI resume builder with expert guidance', logo: 'https://resumegenius.com/favicon.ico', category: 'Resume Builders', link: 'https://resumegenius.com', pricing: 'premium' },
    { name: 'LiveCareer', description: 'Professional resume builder with AI tips', logo: 'https://www.livecareer.com/favicon.ico', category: 'Resume Builders', link: 'https://www.livecareer.com', pricing: 'premium' },
    { name: 'MyPerfectResume', description: 'AI-powered resume creation tool', logo: 'https://www.myperfectresume.com/favicon.ico', category: 'Resume Builders', link: 'https://www.myperfectresume.com', pricing: 'premium' },
    { name: 'Kickresume', description: 'AI resume builder with ATS optimization', logo: 'https://www.kickresume.com/favicon.ico', category: 'Resume Builders', link: 'https://www.kickresume.com', pricing: 'freemium' },
    { name: 'Enhancv', description: 'Modern resume builder with AI insights', logo: 'https://enhancv.com/favicon.ico', category: 'Resume Builders', link: 'https://enhancv.com', pricing: 'freemium' },
    { name: 'VisualCV', description: 'Professional resume builder with AI features', logo: 'https://www.visualcv.com/favicon.ico', category: 'Resume Builders', link: 'https://www.visualcv.com', pricing: 'freemium' }
    ],
    'ai-summarizers': [
    { name: 'QuillBot Summarizer', description: 'Free AI text summarization tool', logo: 'https://quillbot.com/favicon.ico', category: 'AI Summarization', link: 'https://quillbot.com/summarize', pricing: 'free' },
    { name: 'Resoomer', description: 'Free online text summarizer', logo: 'https://resoomer.com/favicon.ico', category: 'AI Summarization', link: 'https://resoomer.com/', pricing: 'free' },
    { name: 'TLDR This', description: 'Summarize any article or webpage', logo: 'https://tldrthis.com/favicon.ico', category: 'AI Summarization', link: 'https://tldrthis.com/', pricing: 'freemium' },
    { name: 'Summari', description: 'AI article summarization', logo: 'https://www.summari.com/favicon.ico', category: 'AI Summarization', link: 'https://www.summari.com/', pricing: 'freemium' },
    { name: 'Scholarcy', description: 'Research paper summarization', logo: 'https://www.scholarcy.com/favicon.ico', category: 'AI Summarization', link: 'https://www.scholarcy.com/', pricing: 'freemium' },
    { name: 'Wordtune Read', description: 'AI document summarization', logo: 'https://www.wordtune.com/favicon.ico', category: 'AI Summarization', link: 'https://www.wordtune.com/read', pricing: 'freemium' },
    { name: 'Quillbot Summarizer', description: 'Free text summarization tool', logo: 'https://quillbot.com/favicon.ico', category: 'AI Summarization', link: 'https://quillbot.com/summarize', pricing: 'freemium' },
    { name: 'Resoomer', description: 'Online automatic text summarizer', logo: 'https://resoomer.com/favicon.ico', category: 'AI Summarization', link: 'https://resoomer.com/', pricing: 'freemium' },
    { name: 'Genei', description: 'AI research summarization', logo: 'https://www.genei.io/favicon.ico', category: 'AI Summarization', link: 'https://www.genei.io/', pricing: 'premium' },
    { name: 'Summify', description: 'AI document summarization', logo: 'https://summify.io/favicon.ico', category: 'AI Summarization', link: 'https://summify.io/', pricing: 'freemium' },
    { name: 'Summarize.tech', description: 'YouTube video summarization', logo: 'https://www.summarize.tech/favicon.ico', category: 'AI Summarization', link: 'https://www.summarize.tech/', pricing: 'freemium' },
    { name: 'Summate', description: 'AI-powered text summarization', logo: 'https://summate.it/favicon.ico', category: 'AI Summarization', link: 'https://summate.it/', pricing: 'freemium' }
    ],
    'ai-video-editors': [
    { name: 'Clipchamp', description: 'Free online video editor by Microsoft', logo: 'https://clipchamp.com/favicon.ico', category: 'AI Video Editors', link: 'https://clipchamp.com/', pricing: 'free' },
    { name: 'Kapwing', description: 'Free online video editing platform', logo: 'https://www.kapwing.com/favicon.ico', category: 'AI Video Editors', link: 'https://www.kapwing.com/', pricing: 'free' },
    { name: 'OpenShot', description: 'Free and open-source video editor', logo: 'https://www.openshot.org/favicon.ico', category: 'AI Video Editors', link: 'https://www.openshot.org/', pricing: 'free' },
    { name: 'Runway', description: 'AI-powered video editing', logo: 'https://runwayml.com/favicon.ico', category: 'Video Editing', link: 'https://runwayml.com/', pricing: 'freemium' },
    { name: 'Descript', description: 'All-in-one video editing', logo: 'https://www.descript.com/favicon.ico', category: 'Video Editing', link: 'https://www.descript.com/', pricing: 'freemium' },
    { name: 'Pictory', description: 'Video creation from text', logo: 'https://pictory.ai/favicon.ico', category: 'Video Editing', link: 'https://pictory.ai/', pricing: 'freemium' },
    { name: 'Synthesia', description: 'AI video generation', logo: 'https://www.synthesia.io/favicon.ico', category: 'Video Editing', link: 'https://www.synthesia.io/', pricing: 'premium' },
    { name: 'Fliki', description: 'Turn text into videos with AI', logo: 'https://fliki.ai/favicon.ico', category: 'Video Editing', link: 'https://fliki.ai/', pricing: 'freemium' },
    { name: 'Kapwing', description: 'Online video editor with AI', logo: 'https://www.kapwing.com/favicon.ico', category: 'Video Editing', link: 'https://www.kapwing.com/', pricing: 'freemium' },
    { name: 'InVideo', description: 'Online video creation platform', logo: 'https://invideo.io/favicon.ico', category: 'Video Editing', link: 'https://invideo.io/', pricing: 'freemium' },
    { name: 'Elai', description: 'AI video generation platform', logo: 'https://elai.io/favicon.ico', category: 'Video Editing', link: 'https://elai.io/', pricing: 'premium' },
    { name: 'Opus Clip', description: 'AI video clip generator', logo: 'https://www.opus.pro/favicon.ico', category: 'Video Editing', link: 'https://www.opus.pro/', pricing: 'freemium' },
    { name: 'Topaz Video AI', description: 'Video enhancement with AI', logo: 'https://www.topazlabs.com/favicon.ico', category: 'Video Editing', link: 'https://www.topazlabs.com/topaz-video-ai', pricing: 'premium' }
    ],
    'ai-language-learning': [
    { name: 'Duolingo', description: 'Free language learning app', logo: 'https://www.duolingo.com/favicon.ico', category: 'AI Language Learning', link: 'https://www.duolingo.com/', pricing: 'free' },
    { name: 'Memrise', description: 'Free language learning platform', logo: 'https://www.memrise.com/favicon.ico', category: 'AI Language Learning', link: 'https://www.memrise.com/', pricing: 'free' },
    { name: 'Busuu', description: 'Free language learning community', logo: 'https://www.busuu.com/favicon.ico', category: 'AI Language Learning', link: 'https://www.busuu.com/', pricing: 'free' },
    { name: 'Duolingo', description: 'AI-powered language learning', logo: 'https://www.duolingo.com/favicon.ico', category: 'Language Learning', link: 'https://www.duolingo.com/', pricing: 'freemium' },
    { name: 'Babbel', description: 'Language learning with AI assistance', logo: 'https://www.babbel.com/favicon.ico', category: 'Language Learning', link: 'https://www.babbel.com/', pricing: 'premium' },
    { name: 'Rosetta Stone', description: 'Immersive language learning', logo: 'https://www.rosettastone.com/favicon.ico', category: 'Language Learning', link: 'https://www.rosettastone.com/', pricing: 'premium' },
    { name: 'Lingvist', description: 'AI-powered vocabulary learning', logo: 'https://lingvist.com/favicon.ico', category: 'Language Learning', link: 'https://lingvist.com/', pricing: 'freemium' },
    { name: 'Memrise', description: 'Language learning with videos', logo: 'https://www.memrise.com/favicon.ico', category: 'Language Learning', link: 'https://www.memrise.com/', pricing: 'freemium' },
    { name: 'Busuu', description: 'Social language learning', logo: 'https://www.busuu.com/favicon.ico', category: 'Language Learning', link: 'https://www.busuu.com/', pricing: 'freemium' },
    { name: 'HelloTalk', description: 'Language exchange with natives', logo: 'https://www.hellotalk.com/favicon.ico', category: 'Language Learning', link: 'https://www.hellotalk.com/', pricing: 'freemium' },
    { name: 'Tandem', description: 'Language exchange community', logo: 'https://www.tandem.net/favicon.ico', category: 'Language Learning', link: 'https://www.tandem.net/', pricing: 'freemium' },
    { name: 'Speechling', description: 'AI pronunciation feedback', logo: 'https://speechling.com/favicon.ico', category: 'Language Learning', link: 'https://speechling.com/', pricing: 'freemium' },
    { name: 'Pimsleur', description: 'Audio-based language learning', logo: 'https://www.pimsleur.com/favicon.ico', category: 'Language Learning', link: 'https://www.pimsleur.com/', pricing: 'premium' }
    ],
    'ai-fitness': [
    { name: 'Nike Training Club', description: 'Free fitness and workout app', logo: 'https://www.nike.com/favicon.ico', category: 'AI Fitness', link: 'https://www.nike.com/ntc-app', pricing: 'free' },
    { name: 'FitOn', description: 'Free fitness and workout videos', logo: 'https://fitonapp.com/favicon.ico', category: 'AI Fitness', link: 'https://fitonapp.com/', pricing: 'free' },
    { name: 'JEFIT', description: 'Free workout planner and tracker', logo: 'https://www.jefit.com/favicon.ico', category: 'AI Fitness', link: 'https://www.jefit.com/', pricing: 'free' },
    { name: 'VirusTotal', description: 'Free malware scanning and threat intelligence', logo: 'https://www.virustotal.com/favicon.ico', category: 'Cybersecurity Tools', link: 'https://www.virustotal.com/', pricing: 'free' },
    { name: 'Cuckoo Sandbox', description: 'Open-source automated malware analysis', logo: 'https://cuckoosandbox.org/favicon.ico', category: 'Cybersecurity Tools', link: 'https://cuckoosandbox.org/', pricing: 'free' },
    { name: 'Metasploit Community', description: 'Free penetration testing framework', logo: 'https://www.metasploit.com/favicon.ico', category: 'Cybersecurity Tools', link: 'https://www.metasploit.com/', pricing: 'free' },
    { name: 'Future', description: 'Personal training with AI coaching', logo: 'https://www.future.co/favicon.ico', category: 'AI Fitness', link: 'https://www.future.co/', pricing: 'premium' },
    { name: 'Fitbod', description: 'AI workout planning', logo: 'https://www.fitbod.me/favicon.ico', category: 'AI Fitness', link: 'https://www.fitbod.me/', pricing: 'freemium' },
    { name: 'Aaptiv', description: 'Audio-based fitness coaching', logo: 'https://aaptiv.com/favicon.ico', category: 'AI Fitness', link: 'https://aaptiv.com/', pricing: 'premium' },
    { name: 'Freeletics', description: 'AI personal trainer', logo: 'https://www.freeletics.com/favicon.ico', category: 'AI Fitness', link: 'https://www.freeletics.com/', pricing: 'freemium' },
    { name: 'Tonal', description: 'Smart home gym with AI', logo: 'https://www.tonal.com/favicon.ico', category: 'AI Fitness', link: 'https://www.tonal.com/', pricing: 'premium' },
    { name: 'Mirror', description: 'Interactive home fitness system', logo: 'https://www.mirror.co/favicon.ico', category: 'AI Fitness', link: 'https://www.mirror.co/', pricing: 'premium' },
    { name: 'Tempo', description: 'AI-powered home gym', logo: 'https://tempo.fit/favicon.ico', category: 'AI Fitness', link: 'https://tempo.fit/', pricing: 'premium' },
    { name: 'FitnessAI', description: 'AI workout planner', logo: 'https://www.fitnessai.com/favicon.ico', category: 'AI Fitness', link: 'https://www.fitnessai.com/', pricing: 'premium' },
    { name: 'Whoop', description: 'AI fitness and recovery tracking', logo: 'https://www.whoop.com/favicon.ico', category: 'AI Fitness', link: 'https://www.whoop.com/', pricing: 'premium' },
    { name: 'Oura Ring', description: 'AI sleep and activity tracking', logo: 'https://ouraring.com/favicon.ico', category: 'AI Fitness', link: 'https://ouraring.com/', pricing: 'premium' }
    ],
    'ai-gaming': [
    { name: 'Godot', description: 'Free and open-source game engine', logo: 'https://godotengine.org/favicon.ico', category: 'AI Gaming', link: 'https://godotengine.org/', pricing: 'free' },
    { name: 'GDevelop', description: 'Free game creator for everyone', logo: 'https://gdevelop.io/favicon.ico', category: 'AI Gaming', link: 'https://gdevelop.io/', pricing: 'free' },
    { name: 'Defold', description: 'Free game engine for indie developers', logo: 'https://defold.com/favicon.ico', category: 'AI Gaming', link: 'https://defold.com/', pricing: 'free' },
    { name: 'Gmail', description: 'Free email by Google', logo: 'https://mail.google.com/favicon.ico', category: 'Email Tools', link: 'https://mail.google.com/', pricing: 'free' },
    { name: 'Thunderbird', description: 'Free and open-source email client', logo: 'https://www.thunderbird.net/favicon.ico', category: 'Email Tools', link: 'https://www.thunderbird.net/', pricing: 'free' },
    { name: 'Mailchimp Free', description: 'Free email marketing platform', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Tools', link: 'https://mailchimp.com/', pricing: 'free' },
    { name: 'SMMRY', description: 'Free online text summarizer', logo: 'https://smmry.com/favicon.ico', category: 'AI Summarizers', link: 'https://smmry.com/', pricing: 'free' },
    { name: 'Scholarcy Free', description: 'Free research paper summarizer', logo: 'https://www.scholarcy.com/favicon.ico', category: 'AI Summarizers', link: 'https://www.scholarcy.com/', pricing: 'free' },
    { name: 'Split and Merge PDF', description: 'Free PDF summarizer and splitter', logo: 'https://www.splitandmergepdf.com/favicon.ico', category: 'AI Summarizers', link: 'https://www.splitandmergepdf.com/', pricing: 'free' },
    { name: 'Jobscan Free', description: 'Free resume and job match analysis', logo: 'https://www.jobscan.co/favicon.ico', category: 'Job Applier', link: 'https://www.jobscan.co/', pricing: 'free' },
    { name: 'Indeed Apply', description: 'Free job application platform', logo: 'https://www.indeed.com/favicon.ico', category: 'Job Applier', link: 'https://www.indeed.com/', pricing: 'free' },
    { name: 'LinkedIn Easy Apply', description: 'Free job application tool', logo: 'https://www.linkedin.com/favicon.ico', category: 'Job Applier', link: 'https://www.linkedin.com/', pricing: 'free' },
    { name: 'Google Keep', description: 'Free note-taking and organization', logo: 'https://keep.google.com/favicon.ico', category: 'Productivity Tools', link: 'https://keep.google.com/', pricing: 'free' },
    { name: 'Trello', description: 'Free project management boards', logo: 'https://trello.com/favicon.ico', category: 'Productivity Tools', link: 'https://trello.com/', pricing: 'free' },
    { name: 'Todoist Free', description: 'Free task manager and to-do list', logo: 'https://todoist.com/favicon.ico', category: 'Productivity Tools', link: 'https://todoist.com/', pricing: 'free' },
    { name: 'AI Dungeon', description: 'AI-generated text adventure game', logo: 'https://play.aidungeon.io/favicon.ico', category: 'AI Gaming', link: 'https://play.aidungeon.io/', pricing: 'freemium' },
    { name: 'NVIDIA GameGAN', description: 'AI game generation technology', logo: 'https://www.nvidia.com/favicon.ico', category: 'AI Gaming', link: 'https://www.nvidia.com/en-us/research/ai-playground/', pricing: 'free' },
    { name: 'Chess.com', description: 'AI chess opponents', logo: 'https://www.chess.com/favicon.ico', category: 'AI Gaming', link: 'https://www.chess.com/', pricing: 'freemium' },
    { name: 'Replika', description: 'AI companion and chat game', logo: 'https://replika.ai/favicon.ico', category: 'AI Gaming', link: 'https://replika.ai/', pricing: 'freemium' },
    { name: 'Latitude', description: 'AI-powered game creation', logo: 'https://latitude.io/favicon.ico', category: 'AI Gaming', link: 'https://latitude.io/', pricing: 'premium' },
    { name: 'Scenario', description: 'AI-generated game assets', logo: 'https://www.scenario.com/favicon.ico', category: 'AI Gaming', link: 'https://www.scenario.com/', pricing: 'premium' },
    { name: 'Inworld AI', description: 'AI characters for games', logo: 'https://inworld.ai/favicon.ico', category: 'AI Gaming', link: 'https://inworld.ai/', pricing: 'premium' },
    { name: 'Charisma.ai', description: 'Interactive AI characters', logo: 'https://charisma.ai/favicon.ico', category: 'AI Gaming', link: 'https://charisma.ai/', pricing: 'premium' },
    { name: 'Hidden Door', description: 'AI narrative game worlds', logo: 'https://www.hiddendoor.co/favicon.ico', category: 'AI Gaming', link: 'https://www.hiddendoor.co/', pricing: 'premium' },
    { name: 'Convai', description: 'AI NPCs for games', logo: 'https://www.convai.com/favicon.ico', category: 'AI Gaming', link: 'https://www.convai.com/', pricing: 'premium' }
    ],
    'ai-dating': [
    { name: 'Tinder', description: 'Free dating app with AI features', logo: 'https://tinder.com/favicon.ico', category: 'AI Dating', link: 'https://tinder.com/', pricing: 'free' },
    { name: 'OkCupid', description: 'Free AI-powered dating platform', logo: 'https://www.okcupid.com/favicon.ico', category: 'AI Dating', link: 'https://www.okcupid.com/', pricing: 'free' },
    { name: 'Bumble', description: 'Free dating app with AI moderation', logo: 'https://bumble.com/favicon.ico', category: 'AI Dating', link: 'https://bumble.com/', pricing: 'free' },
    { name: 'Buffer Free', description: 'Free social media scheduling', logo: 'https://buffer.com/favicon.ico', category: 'Social Media Tools', link: 'https://buffer.com/', pricing: 'free' },
    { name: 'Hootsuite Free', description: 'Free social media management', logo: 'https://hootsuite.com/favicon.ico', category: 'Social Media Tools', link: 'https://hootsuite.com/', pricing: 'free' },
    { name: 'Later Free', description: 'Free Instagram scheduling tool', logo: 'https://later.com/favicon.ico', category: 'Social Media Tools', link: 'https://later.com/', pricing: 'free' },
    { name: 'Docassemble', description: 'Open-source legal document automation', logo: 'https://docassemble.org/favicon.ico', category: 'Legal Tools', link: 'https://docassemble.org/', pricing: 'free' },
    { name: 'LawDepot Free', description: 'Free legal document templates', logo: 'https://www.lawdepot.com/favicon.ico', category: 'Legal Tools', link: 'https://www.lawdepot.com/', pricing: 'free' },
    { name: 'HelloSign', description: 'Free e-signature for legal docs', logo: 'https://www.hellosign.com/favicon.ico', category: 'Legal Tools', link: 'https://www.hellosign.com/', pricing: 'free' },
    { name: 'BambooHR Free', description: 'Free HR management platform', logo: 'https://www.bamboohr.com/favicon.ico', category: 'HR Tools', link: 'https://www.bamboohr.com/', pricing: 'free' },
    { name: 'Zoho People Free', description: 'Free HR software', logo: 'https://www.zoho.com/people/favicon.ico', category: 'HR Tools', link: 'https://www.zoho.com/people/', pricing: 'free' },
    { name: 'Freshteam', description: 'Free applicant tracking system', logo: 'https://freshteam.com/favicon.ico', category: 'HR Tools', link: 'https://freshteam.com/', pricing: 'free' },
    { name: 'HubSpot CRM Free', description: 'Free sales CRM platform', logo: 'https://www.hubspot.com/favicon.ico', category: 'Sales Tools', link: 'https://www.hubspot.com/products/crm', pricing: 'free' },
    { name: 'Zoho CRM Free', description: 'Free CRM for sales teams', logo: 'https://www.zoho.com/crm/favicon.ico', category: 'Sales Tools', link: 'https://www.zoho.com/crm/', pricing: 'free' },
    { name: 'Bitrix24 Free', description: 'Free sales and collaboration suite', logo: 'https://www.bitrix24.com/favicon.ico', category: 'Sales Tools', link: 'https://www.bitrix24.com/', pricing: 'free' },
    { name: 'Freshdesk Free', description: 'Free customer support software', logo: 'https://freshdesk.com/favicon.ico', category: 'Customer Service Tools', link: 'https://freshdesk.com/', pricing: 'free' },
    { name: 'Zoho Desk Free', description: 'Free help desk software', logo: 'https://www.zoho.com/desk/favicon.ico', category: 'Customer Service Tools', link: 'https://www.zoho.com/desk/', pricing: 'free' },
    { name: 'Tawk.to', description: 'Free live chat customer support', logo: 'https://www.tawk.to/favicon.ico', category: 'Customer Service Tools', link: 'https://www.tawk.to/', pricing: 'free' },
    { name: 'OpenLMIS', description: 'Open-source logistics management', logo: 'https://openlmis.org/favicon.ico', category: 'Logistics Tools', link: 'https://openlmis.org/', pricing: 'free' },
    { name: 'Logistimo', description: 'Free supply chain and logistics platform', logo: 'https://www.logistimo.com/favicon.ico', category: 'Logistics Tools', link: 'https://www.logistimo.com/', pricing: 'free' },
    { name: 'Transporeon Free', description: 'Free logistics management tools', logo: 'https://www.transporeon.com/favicon.ico', category: 'Logistics Tools', link: 'https://www.transporeon.com/', pricing: 'free' },
    { name: 'FarmLogs', description: 'Free farm management software', logo: 'https://farmlogs.com/favicon.ico', category: 'Agriculture Tools', link: 'https://farmlogs.com/', pricing: 'free' },
    { name: 'AgriWebb Free', description: 'Free digital farm management', logo: 'https://www.agriwebb.com/favicon.ico', category: 'Agriculture Tools', link: 'https://www.agriwebb.com/', pricing: 'free' },
    { name: 'OpenATK', description: 'Open-source agricultural toolkits', logo: 'https://openatk.com/favicon.ico', category: 'Agriculture Tools', link: 'https://openatk.com/', pricing: 'free' },
    { name: 'Grammarly Free', description: 'Free grammar and writing assistant', logo: 'https://www.grammarly.com/favicon.ico', category: 'Writing Assistants', link: 'https://www.grammarly.com/', pricing: 'free' },
    { name: 'Hemingway Editor', description: 'Free writing clarity tool', logo: 'https://hemingwayapp.com/favicon.ico', category: 'Writing Assistants', link: 'https://hemingwayapp.com/', pricing: 'free' },
    { name: 'LanguageTool Free', description: 'Free grammar and style checker', logo: 'https://languagetool.org/favicon.ico', category: 'Writing Assistants', link: 'https://languagetool.org/', pricing: 'free' },
    { name: 'Google Meet', description: 'Free video meetings and conferencing', logo: 'https://meet.google.com/favicon.ico', category: 'Meeting Tools', link: 'https://meet.google.com/', pricing: 'free' },
    { name: 'Jitsi Meet', description: 'Free and open-source video meetings', logo: 'https://jitsi.org/favicon.ico', category: 'Meeting Tools', link: 'https://jitsi.org/', pricing: 'free' },
    { name: 'Zoom Basic', description: 'Free video conferencing plan', logo: 'https://zoom.us/favicon.ico', category: 'Meeting Tools', link: 'https://zoom.us/', pricing: 'free' },
    { name: 'Recruitee Free', description: 'Free recruitment software', logo: 'https://recruitee.com/favicon.ico', category: 'Recruitment Tools', link: 'https://recruitee.com/', pricing: 'free' },
    { name: 'Zoho Recruit Free', description: 'Free applicant tracking system', logo: 'https://www.zoho.com/recruit/favicon.ico', category: 'Recruitment Tools', link: 'https://www.zoho.com/recruit/', pricing: 'free' },
    { name: 'Workable Free', description: 'Free recruitment and hiring platform', logo: 'https://www.workable.com/favicon.ico', category: 'Recruitment Tools', link: 'https://www.workable.com/', pricing: 'free' },
    { name: 'inFlow Inventory Free', description: 'Free inventory management software', logo: 'https://www.inflowinventory.com/favicon.ico', category: 'Inventory Management', link: 'https://www.inflowinventory.com/', pricing: 'free' },
    { name: 'Zoho Inventory Free', description: 'Free inventory management for small business', logo: 'https://www.zoho.com/inventory/favicon.ico', category: 'Inventory Management', link: 'https://www.zoho.com/inventory/', pricing: 'free' },
    { name: 'Sortly Free', description: 'Free inventory tracking app', logo: 'https://www.sortly.com/favicon.ico', category: 'Inventory Management', link: 'https://www.sortly.com/', pricing: 'free' },
    { name: 'Replika', description: 'AI companion and romantic partner', logo: 'https://replika.ai/favicon.ico', category: 'AI Dating', link: 'https://replika.ai/', pricing: 'freemium' },
    { name: 'Blush', description: 'AI dating coach', logo: 'https://blush.ai/favicon.ico', category: 'AI Dating', link: 'https://blush.ai/', pricing: 'premium' },
    { name: 'Hinge', description: 'Dating app with AI matching', logo: 'https://hinge.co/favicon.ico', category: 'AI Dating', link: 'https://hinge.co/', pricing: 'freemium' },
    { name: 'eHarmony', description: 'AI matchmaking algorithm', logo: 'https://www.eharmony.com/favicon.ico', category: 'AI Dating', link: 'https://www.eharmony.com/', pricing: 'premium' },
    { name: 'Match', description: 'Dating with AI recommendations', logo: 'https://match.com/favicon.ico', category: 'AI Dating', link: 'https://match.com/', pricing: 'premium' },
    { name: 'OkCupid', description: 'AI-powered compatibility matching', logo: 'https://www.okcupid.com/favicon.ico', category: 'AI Dating', link: 'https://www.okcupid.com/', pricing: 'freemium' },
    { name: 'Bumble', description: 'Dating app with AI features', logo: 'https://bumble.com/favicon.ico', category: 'AI Dating', link: 'https://bumble.com/', pricing: 'freemium' },
    { name: 'Tinder', description: 'Dating app with AI matching', logo: 'https://tinder.com/favicon.ico', category: 'AI Dating', link: 'https://tinder.com/', pricing: 'freemium' },
    { name: 'Iris', description: 'AI matchmaking app', logo: 'https://www.iris.ai/favicon.ico', category: 'AI Dating', link: 'https://www.iris.ai/', pricing: 'premium' },
    { name: 'Loveflutter', description: 'Personality-based dating with AI', logo: 'https://loveflutter.com/favicon.ico', category: 'AI Dating', link: 'https://loveflutter.com/', pricing: 'premium' }
    ],
    'ai-cooking': [
    { name: 'Plant Jammer', description: 'AI-powered recipe creation', logo: 'https://www.plantjammer.com/favicon.ico', category: 'AI Cooking', link: 'https://www.plantjammer.com/', pricing: 'freemium' },
    { name: 'Whisk', description: 'AI meal planning and recipes', logo: 'https://whisk.com/favicon.ico', category: 'AI Cooking', link: 'https://whisk.com/', pricing: 'freemium' },
    { name: 'Chefling', description: 'AI kitchen assistant app', logo: 'https://www.chefling.net/favicon.ico', category: 'AI Cooking', link: 'https://www.chefling.net/', pricing: 'free' },
    { name: 'Cookpad', description: 'Recipe sharing with AI recommendations', logo: 'https://cookpad.com/favicon.ico', category: 'AI Cooking', link: 'https://cookpad.com/', pricing: 'free' },
    { name: 'Yummly', description: 'Personalized recipe recommendations', logo: 'https://www.yummly.com/favicon.ico', category: 'AI Cooking', link: 'https://www.yummly.com/', pricing: 'freemium' },
    { name: 'Innit', description: 'Smart cooking platform', logo: 'https://www.innit.com/favicon.ico', category: 'AI Cooking', link: 'https://www.innit.com/', pricing: 'freemium' },
    { name: 'SideChef', description: 'Step-by-step cooking app', logo: 'https://www.sidechef.com/favicon.ico', category: 'AI Cooking', link: 'https://www.sidechef.com/', pricing: 'freemium' },
    { name: 'Cooklist', description: 'Recipe app based on your groceries', logo: 'https://cooklist.com/favicon.ico', category: 'AI Cooking', link: 'https://cooklist.com/', pricing: 'freemium' },
    { name: 'Kitchenful', description: 'AI meal planning and grocery shopping', logo: 'https://www.kitchenful.com/favicon.ico', category: 'AI Cooking', link: 'https://www.kitchenful.com/', pricing: 'freemium' },
    { name: 'Foodpairing', description: 'AI flavor pairing suggestions', logo: 'https://www.foodpairing.com/favicon.ico', category: 'AI Cooking', link: 'https://www.foodpairing.com/', pricing: 'freemium' }
    ],
    'ats-resume-checkers': [
    { name: 'Jobscan', description: 'AI-powered ATS resume optimization tool', logo: 'https://www.jobscan.co/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.jobscan.co', pricing: 'freemium' },
    { name: 'Resume Worded', description: 'AI resume checker and LinkedIn optimizer', logo: 'https://resumeworded.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://resumeworded.com', pricing: 'freemium' },
    { name: 'Skillsyncer', description: 'ATS resume scanner and keyword optimizer', logo: 'https://skillsyncer.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://skillsyncer.com', pricing: 'freemium' },
    { name: 'TopResume', description: 'Professional resume review and ATS optimization', logo: 'https://www.topresume.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.topresume.com', pricing: 'premium' },
    { name: 'VMock', description: 'AI resume review and career guidance platform', logo: 'https://www.vmock.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.vmock.com', pricing: 'freemium' },
    { name: 'RezScore', description: 'Free ATS resume checker and scorer', logo: 'https://www.rezscore.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.rezscore.com', pricing: 'free' },
    { name: 'Targeted Resume', description: 'ATS-friendly resume optimization tool', logo: 'https://www.targetedresume.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.targetedresume.com', pricing: 'freemium' },
    { name: 'Resume Checker', description: 'AI-powered resume analysis and improvement', logo: 'https://www.resumechecker.net/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.resumechecker.net', pricing: 'freemium' },
    { name: 'Optimize Resume', description: 'ATS resume optimization and keyword matching', logo: 'https://www.optimizeresume.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.optimizeresume.com', pricing: 'freemium' },
    { name: 'Resume Matcher', description: 'AI tool to match resume with job descriptions', logo: 'https://www.resumematcher.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.resumematcher.com', pricing: 'freemium' }
    ]
});

// Workflow data with comprehensive task workflows
const workflowData = {
    'youtube-video-creation': [
        { name: 'ChatGPT', description: 'Free AI script writing and content planning', logo: 'https://openai.com/favicon.ico', category: 'Content Planning', link: 'https://chat.openai.com' },
        { name: 'Google Docs', description: 'Free collaborative script writing', logo: 'https://docs.google.com/favicon.ico', category: 'Content Planning', link: 'https://docs.google.com' },
        { name: 'VidIQ', description: 'Free YouTube SEO and keyword research', logo: 'https://vidiq.com/favicon.ico', category: 'SEO Research', link: 'https://vidiq.com' },
        { name: 'TubeBuddy', description: 'Free YouTube optimization tools', logo: 'https://www.tubebuddy.com/favicon.ico', category: 'SEO Research', link: 'https://www.tubebuddy.com' },
        { name: 'OBS Studio', description: 'Free screen recording and streaming', logo: 'https://obsproject.com/favicon.ico', category: 'Video Recording', link: 'https://obsproject.com' },
        { name: 'Loom', description: 'Free screen recording for tutorials', logo: 'https://www.loom.com/favicon.ico', category: 'Video Recording', link: 'https://www.loom.com' },
        { name: 'DaVinci Resolve', description: 'Free professional video editing', logo: 'https://www.blackmagicdesign.com/favicon.ico', category: 'Video Editing', link: 'https://www.blackmagicdesign.com/products/davinciresolve' },
        { name: 'OpenShot', description: 'Free open-source video editor', logo: 'https://www.openshot.org/favicon.ico', category: 'Video Editing', link: 'https://www.openshot.org' },
        { name: 'Canva', description: 'Free thumbnail and graphics design', logo: 'https://www.canva.com/favicon.ico', category: 'Thumbnail Design', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced image editing for thumbnails', logo: 'https://www.gimp.org/favicon.ico', category: 'Thumbnail Design', link: 'https://www.gimp.org' },
        { name: 'Audacity', description: 'Free audio editing and enhancement', logo: 'https://www.audacityteam.org/favicon.ico', category: 'Audio Editing', link: 'https://www.audacityteam.org' },
        { name: 'YouTube Studio', description: 'Free video upload and channel management', logo: 'https://studio.youtube.com/favicon.ico', category: 'Publishing', link: 'https://studio.youtube.com' }
    ],
    'website-building': [
        { name: 'Figma', description: 'Free website wireframing and design', logo: 'https://www.figma.com/favicon.ico', category: 'Planning & Design', link: 'https://www.figma.com' },
        { name: 'Canva', description: 'Free graphics and visual elements', logo: 'https://www.canva.com/favicon.ico', category: 'Graphics Creation', link: 'https://www.canva.com' },
        { name: 'Unsplash', description: 'Free high-quality stock photos', logo: 'https://unsplash.com/favicon.ico', category: 'Graphics Creation', link: 'https://unsplash.com' },
        { name: 'ChatGPT', description: 'Free AI content generation', logo: 'https://openai.com/favicon.ico', category: 'Content Writing', link: 'https://chat.openai.com' },
        { name: 'Google Docs', description: 'Free collaborative content writing', logo: 'https://docs.google.com/favicon.ico', category: 'Content Writing', link: 'https://docs.google.com' },
        { name: 'VS Code', description: 'Free code editor with extensions', logo: 'https://code.visualstudio.com/favicon.ico', category: 'Development', link: 'https://code.visualstudio.com' },
        { name: 'GitHub', description: 'Free code hosting and version control', logo: 'https://github.com/favicon.ico', category: 'Development', link: 'https://github.com' },
        { name: 'Netlify', description: 'Free website hosting and deployment', logo: 'https://www.netlify.com/favicon.ico', category: 'Hosting & Deployment', link: 'https://www.netlify.com' },
        { name: 'Vercel', description: 'Free website hosting platform', logo: 'https://vercel.com/favicon.ico', category: 'Hosting & Deployment', link: 'https://vercel.com' },
        { name: 'Google Search Console', description: 'Free SEO monitoring and optimization', logo: 'https://search.google.com/favicon.ico', category: 'SEO & Analytics', link: 'https://search.google.com/search-console' },
        { name: 'Google Analytics', description: 'Free website traffic analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'SEO & Analytics', link: 'https://analytics.google.com' }
    ],
    'content-marketing': [
        { name: 'Google Trends', description: 'Free trend research and topic discovery', logo: 'https://trends.google.com/favicon.ico', category: 'Research & Planning', link: 'https://trends.google.com' },
        { name: 'Notion', description: 'Free content strategy and planning', logo: 'https://www.notion.so/favicon.ico', category: 'Research & Planning', link: 'https://www.notion.so' },
        { name: 'Trello', description: 'Free content calendar management', logo: 'https://trello.com/favicon.ico', category: 'Content Calendar', link: 'https://trello.com' },
        { name: 'Google Calendar', description: 'Free scheduling and calendar management', logo: 'https://calendar.google.com/favicon.ico', category: 'Content Calendar', link: 'https://calendar.google.com' },
        { name: 'ChatGPT', description: 'Free AI content generation', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Grammarly', description: 'Free writing assistant and grammar checker', logo: 'https://www.grammarly.com/favicon.ico', category: 'Content Creation', link: 'https://www.grammarly.com' },
        { name: 'Canva', description: 'Free visual content and graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Visual Content', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced image editing', logo: 'https://www.gimp.org/favicon.ico', category: 'Visual Content', link: 'https://www.gimp.org' },
        { name: 'Buffer', description: 'Free social media scheduling', logo: 'https://buffer.com/favicon.ico', category: 'Distribution', link: 'https://buffer.com' },
        { name: 'Hootsuite', description: 'Free social media management', logo: 'https://hootsuite.com/favicon.ico', category: 'Distribution', link: 'https://hootsuite.com' },
        { name: 'Google Analytics', description: 'Free content performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics & Optimization', link: 'https://analytics.google.com' },
        { name: 'Google Search Console', description: 'Free SEO performance monitoring', logo: 'https://search.google.com/favicon.ico', category: 'Analytics & Optimization', link: 'https://search.google.com/search-console' }
    ],
    'social-media-management': [
        { name: 'Google Trends', description: 'Free trend research for content ideas', logo: 'https://trends.google.com/favicon.ico', category: 'Content Planning', link: 'https://trends.google.com' },
        { name: 'Trello', description: 'Free social media content calendar', logo: 'https://trello.com/favicon.ico', category: 'Content Planning', link: 'https://trello.com' },
        { name: 'ChatGPT', description: 'Free AI content and caption generation', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free social media post design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced image editing', logo: 'https://www.gimp.org/favicon.ico', category: 'Visual Design', link: 'https://www.gimp.org' },
        { name: 'Unsplash', description: 'Free high-quality stock photos', logo: 'https://unsplash.com/favicon.ico', category: 'Visual Design', link: 'https://unsplash.com' },
        { name: 'Buffer', description: 'Free social media scheduling', logo: 'https://buffer.com/favicon.ico', category: 'Scheduling & Publishing', link: 'https://buffer.com' },
        { name: 'Hootsuite', description: 'Free social media management', logo: 'https://hootsuite.com/favicon.ico', category: 'Scheduling & Publishing', link: 'https://hootsuite.com' },
        { name: 'Facebook Insights', description: 'Free Facebook page analytics', logo: 'https://www.facebook.com/favicon.ico', category: 'Analytics & Monitoring', link: 'https://www.facebook.com/business/insights' },
        { name: 'Google Analytics', description: 'Free social media traffic tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics & Monitoring', link: 'https://analytics.google.com' }
    ],
    'podcast-creation': [
        { name: 'Google Trends', description: 'Free podcast topic research', logo: 'https://trends.google.com/favicon.ico', category: 'Planning & Research', link: 'https://trends.google.com' },
        { name: 'Notion', description: 'Free podcast planning and organization', logo: 'https://www.notion.so/favicon.ico', category: 'Planning & Research', link: 'https://www.notion.so' },
        { name: 'ChatGPT', description: 'Free AI podcast script writing', logo: 'https://openai.com/favicon.ico', category: 'Script Writing', link: 'https://chat.openai.com' },
        { name: 'Google Docs', description: 'Free collaborative script writing', logo: 'https://docs.google.com/favicon.ico', category: 'Script Writing', link: 'https://docs.google.com' },
        { name: 'Audacity', description: 'Free audio recording and editing', logo: 'https://www.audacityteam.org/favicon.ico', category: 'Recording & Editing', link: 'https://www.audacityteam.org' },
        { name: 'GarageBand', description: 'Free audio production and music', logo: 'https://www.apple.com/favicon.ico', category: 'Recording & Editing', link: 'https://www.apple.com/mac/garageband' },
        { name: 'Canva', description: 'Free podcast cover art design', logo: 'https://www.canva.com/favicon.ico', category: 'Branding & Design', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced graphic design', logo: 'https://www.gimp.org/favicon.ico', category: 'Branding & Design', link: 'https://www.gimp.org' },
        { name: 'Otter.ai', description: 'Free AI transcription for show notes', logo: 'https://otter.ai/favicon.ico', category: 'Post-Production', link: 'https://otter.ai' },
        { name: 'Anchor', description: 'Free podcast hosting and distribution', logo: 'https://anchor.fm/favicon.ico', category: 'Publishing & Distribution', link: 'https://anchor.fm' },
        { name: 'Spotify for Podcasters', description: 'Free podcast analytics and promotion', logo: 'https://podcasters.spotify.com/favicon.ico', category: 'Analytics & Promotion', link: 'https://podcasters.spotify.com' }
    ],
    'ecommerce-store-setup': [
        { name: 'Google Trends', description: 'Free market research and product validation', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'SurveyMonkey', description: 'Free customer surveys and feedback', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Market Research', link: 'https://www.surveymonkey.com' },
        { name: 'WooCommerce', description: 'Free WordPress e-commerce plugin', logo: 'https://woocommerce.com/favicon.ico', category: 'Platform Setup', link: 'https://woocommerce.com' },
        { name: 'Square Online', description: 'Free e-commerce website builder', logo: 'https://squareup.com/favicon.ico', category: 'Platform Setup', link: 'https://squareup.com/us/en/online-store' },
        { name: 'ChatGPT', description: 'Free AI product descriptions and content', logo: 'https://openai.com/favicon.ico', category: 'Product Content', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free product images and banners', logo: 'https://www.canva.com/favicon.ico', category: 'Product Content', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced product image editing', logo: 'https://www.gimp.org/favicon.ico', category: 'Visual Design', link: 'https://www.gimp.org' },
        { name: 'Unsplash', description: 'Free high-quality stock photos', logo: 'https://unsplash.com/favicon.ico', category: 'Visual Design', link: 'https://unsplash.com' },
        { name: 'PayPal', description: 'Free payment processing setup', logo: 'https://www.paypal.com/favicon.ico', category: 'Payment & Shipping', link: 'https://www.paypal.com' },
        { name: 'Stripe', description: 'Free payment gateway integration', logo: 'https://stripe.com/favicon.ico', category: 'Payment & Shipping', link: 'https://stripe.com' },
        { name: 'Tawk.to', description: 'Free live chat customer support', logo: 'https://www.tawk.to/favicon.ico', category: 'Customer Support', link: 'https://www.tawk.to' },
        { name: 'Google Analytics', description: 'Free e-commerce analytics tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics & Optimization', link: 'https://analytics.google.com' },
        { name: 'Google Search Console', description: 'Free SEO monitoring for store', logo: 'https://search.google.com/favicon.ico', category: 'Analytics & Optimization', link: 'https://search.google.com/search-console' }
    ],
    'app-development': [
        { name: 'Google Trends', description: 'Free app market research and validation', logo: 'https://trends.google.com/favicon.ico', category: 'Planning & Research', link: 'https://trends.google.com' },
        { name: 'Notion', description: 'Free app planning and documentation', logo: 'https://www.notion.so/favicon.ico', category: 'Planning & Research', link: 'https://www.notion.so' },
        { name: 'Figma', description: 'Free UI/UX design and prototyping', logo: 'https://www.figma.com/favicon.ico', category: 'Design & Prototyping', link: 'https://www.figma.com' },
        { name: 'Adobe XD', description: 'Free app interface design tool', logo: 'https://www.adobe.com/favicon.ico', category: 'Design & Prototyping', link: 'https://www.adobe.com/products/xd.html' },
        { name: 'VS Code', description: 'Free code editor with mobile extensions', logo: 'https://code.visualstudio.com/favicon.ico', category: 'Development', link: 'https://code.visualstudio.com' },
        { name: 'React Native', description: 'Free cross-platform mobile framework', logo: 'https://reactnative.dev/favicon.ico', category: 'Development', link: 'https://reactnative.dev' },
        { name: 'Flutter', description: 'Free Google mobile development framework', logo: 'https://flutter.dev/favicon.ico', category: 'Development', link: 'https://flutter.dev' },
        { name: 'Firebase', description: 'Free backend services and database', logo: 'https://firebase.google.com/favicon.ico', category: 'Backend & Database', link: 'https://firebase.google.com' },
        { name: 'Supabase', description: 'Free open-source backend alternative', logo: 'https://supabase.com/favicon.ico', category: 'Backend & Database', link: 'https://supabase.com' },
        { name: 'GitHub', description: 'Free code repository and version control', logo: 'https://github.com/favicon.ico', category: 'Version Control', link: 'https://github.com' },
        { name: 'TestFlight', description: 'Free iOS app testing and distribution', logo: 'https://developer.apple.com/favicon.ico', category: 'Testing & Deployment', link: 'https://developer.apple.com/testflight' },
        { name: 'Google Play Console', description: 'Free Android app testing and publishing', logo: 'https://play.google.com/favicon.ico', category: 'Testing & Deployment', link: 'https://play.google.com/console' },
        { name: 'Firebase Analytics', description: 'Free app usage analytics and insights', logo: 'https://firebase.google.com/favicon.ico', category: 'Analytics & Monitoring', link: 'https://firebase.google.com/products/analytics' }
    ],
    'email-marketing-campaign': [
        { name: 'Google Forms', description: 'Free lead capture and email collection', logo: 'https://forms.google.com/favicon.ico', category: 'Lead Generation', link: 'https://forms.google.com' },
        { name: 'Typeform', description: 'Free interactive forms for subscribers', logo: 'https://www.typeform.com/favicon.ico', category: 'Lead Generation', link: 'https://www.typeform.com' },
        { name: 'Google Sheets', description: 'Free email list management and segmentation', logo: 'https://sheets.google.com/favicon.ico', category: 'List Management', link: 'https://sheets.google.com' },
        { name: 'Mailchimp', description: 'Free email marketing platform', logo: 'https://mailchimp.com/favicon.ico', category: 'List Management', link: 'https://mailchimp.com' },
        { name: 'ChatGPT', description: 'Free AI email content and subject lines', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Grammarly', description: 'Free email copy editing and optimization', logo: 'https://www.grammarly.com/favicon.ico', category: 'Content Creation', link: 'https://www.grammarly.com' },
        { name: 'Canva', description: 'Free email template design and graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Design & Templates', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced email graphics editing', logo: 'https://www.gimp.org/favicon.ico', category: 'Design & Templates', link: 'https://www.gimp.org' },
        { name: 'Sendinblue', description: 'Free email automation and scheduling', logo: 'https://www.sendinblue.com/favicon.ico', category: 'Campaign Automation', link: 'https://www.sendinblue.com' },
        { name: 'MailerLite', description: 'Free email automation workflows', logo: 'https://www.mailerlite.com/favicon.ico', category: 'Campaign Automation', link: 'https://www.mailerlite.com' },
        { name: 'Google Analytics', description: 'Free email campaign performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics & Testing', link: 'https://analytics.google.com' },
        { name: 'Mail Tester', description: 'Free email deliverability testing', logo: 'https://www.mail-tester.com/favicon.ico', category: 'Analytics & Testing', link: 'https://www.mail-tester.com' }
    ],
    'data-science-project': [
        { name: 'Google Trends', description: 'Free trend analysis and problem identification', logo: 'https://trends.google.com/favicon.ico', category: 'Problem Definition', link: 'https://trends.google.com' },
        { name: 'Notion', description: 'Free project planning and documentation', logo: 'https://www.notion.so/favicon.ico', category: 'Problem Definition', link: 'https://www.notion.so' },
        { name: 'Kaggle', description: 'Free datasets and data science platform', logo: 'https://www.kaggle.com/favicon.ico', category: 'Data Collection', link: 'https://www.kaggle.com' },
        { name: 'Google Dataset Search', description: 'Free dataset discovery tool', logo: 'https://datasetsearch.research.google.com/favicon.ico', category: 'Data Collection', link: 'https://datasetsearch.research.google.com' },
        { name: 'OpenRefine', description: 'Free data cleaning and transformation', logo: 'https://openrefine.org/favicon.ico', category: 'Data Cleaning', link: 'https://openrefine.org' },
        { name: 'Python Pandas', description: 'Free data manipulation library', logo: 'https://pandas.pydata.org/favicon.ico', category: 'Data Cleaning', link: 'https://pandas.pydata.org' },
        { name: 'Google Colab', description: 'Free Jupyter notebook environment', logo: 'https://colab.research.google.com/favicon.ico', category: 'Analysis & Modeling', link: 'https://colab.research.google.com' },
        { name: 'Jupyter Notebook', description: 'Free interactive computing environment', logo: 'https://jupyter.org/favicon.ico', category: 'Analysis & Modeling', link: 'https://jupyter.org' },
        { name: 'Scikit-learn', description: 'Free machine learning library', logo: 'https://scikit-learn.org/favicon.ico', category: 'Machine Learning', link: 'https://scikit-learn.org' },
        { name: 'TensorFlow', description: 'Free deep learning framework', logo: 'https://www.tensorflow.org/favicon.ico', category: 'Machine Learning', link: 'https://www.tensorflow.org' },
        { name: 'Matplotlib', description: 'Free Python plotting library', logo: 'https://matplotlib.org/favicon.ico', category: 'Visualization', link: 'https://matplotlib.org' },
        { name: 'Plotly', description: 'Free interactive visualization library', logo: 'https://plotly.com/favicon.ico', category: 'Visualization', link: 'https://plotly.com' },
        { name: 'GitHub', description: 'Free code repository and version control', logo: 'https://github.com/favicon.ico', category: 'Deployment & Sharing', link: 'https://github.com' },
        { name: 'Streamlit', description: 'Free web app framework for data science', logo: 'https://streamlit.io/favicon.ico', category: 'Deployment & Sharing', link: 'https://streamlit.io' }
    ],
    'online-course-creation': [
        { name: 'Google Trends', description: 'Free market research for course topics', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'SurveyMonkey', description: 'Free audience surveys and validation', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Market Research', link: 'https://www.surveymonkey.com' },
        { name: 'Notion', description: 'Free course planning and curriculum design', logo: 'https://www.notion.so/favicon.ico', category: 'Course Planning', link: 'https://www.notion.so' },
        { name: 'Trello', description: 'Free course project management', logo: 'https://trello.com/favicon.ico', category: 'Course Planning', link: 'https://trello.com' },
        { name: 'ChatGPT', description: 'Free AI course content and script writing', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Google Docs', description: 'Free collaborative content writing', logo: 'https://docs.google.com/favicon.ico', category: 'Content Creation', link: 'https://docs.google.com' },
        { name: 'Canva', description: 'Free course graphics and slide design', logo: 'https://www.canva.com/favicon.ico', category: 'Visual Design', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced graphic design', logo: 'https://www.gimp.org/favicon.ico', category: 'Visual Design', link: 'https://www.gimp.org' },
        { name: 'OBS Studio', description: 'Free video recording and streaming', logo: 'https://obsproject.com/favicon.ico', category: 'Video Production', link: 'https://obsproject.com' },
        { name: 'Loom', description: 'Free screen recording for tutorials', logo: 'https://www.loom.com/favicon.ico', category: 'Video Production', link: 'https://www.loom.com' },
        { name: 'DaVinci Resolve', description: 'Free professional video editing', logo: 'https://www.blackmagicdesign.com/favicon.ico', category: 'Video Editing', link: 'https://www.blackmagicdesign.com/products/davinciresolve' },
        { name: 'Teachable', description: 'Free course hosting platform', logo: 'https://www.teachable.com/favicon.ico', category: 'Course Platform', link: 'https://www.teachable.com' },
        { name: 'Thinkific', description: 'Free online course platform', logo: 'https://www.thinkific.com/favicon.ico', category: 'Course Platform', link: 'https://www.thinkific.com' },
        { name: 'Google Analytics', description: 'Free course performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics & Marketing', link: 'https://analytics.google.com' }
    ],
    'startup-launch': [
        { name: 'ChatGPT', description: 'Free AI business idea validation and planning', logo: 'https://openai.com/favicon.ico', category: 'Idea Validation', link: 'https://chat.openai.com' },
        { name: 'Google Trends', description: 'Free market trend analysis and validation', logo: 'https://trends.google.com/favicon.ico', category: 'Idea Validation', link: 'https://trends.google.com' },
        { name: 'SurveyMonkey', description: 'Free customer surveys and market research', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Market Research', link: 'https://www.surveymonkey.com' },
        { name: 'Typeform', description: 'Free interactive surveys and feedback forms', logo: 'https://www.typeform.com/favicon.ico', category: 'Market Research', link: 'https://www.typeform.com' },
        { name: 'Lean Canvas', description: 'Free business model canvas tool', logo: 'https://leanstack.com/favicon.ico', category: 'Business Planning', link: 'https://leanstack.com' },
        { name: 'Google Docs', description: 'Free business plan writing and collaboration', logo: 'https://docs.google.com/favicon.ico', category: 'Business Planning', link: 'https://docs.google.com' },
        { name: 'Canva', description: 'Free logo and brand identity design', logo: 'https://www.canva.com/favicon.ico', category: 'Brand Identity', link: 'https://www.canva.com' },
        { name: 'Looka', description: 'Free AI-powered logo maker', logo: 'https://looka.com/favicon.ico', category: 'Brand Identity', link: 'https://looka.com' },
        { name: 'Figma', description: 'Free product design and prototyping', logo: 'https://www.figma.com/favicon.ico', category: 'Product Development', link: 'https://www.figma.com' },
        { name: 'GitHub', description: 'Free code repository and version control', logo: 'https://github.com/favicon.ico', category: 'Product Development', link: 'https://github.com' },
        { name: 'Google Sheets', description: 'Free financial modeling and projections', logo: 'https://sheets.google.com/favicon.ico', category: 'Financial Planning', link: 'https://sheets.google.com' },
        { name: 'Wave Accounting', description: 'Free accounting software for startups', logo: 'https://www.waveapps.com/favicon.ico', category: 'Financial Planning', link: 'https://www.waveapps.com' },
        { name: 'Mailchimp', description: 'Free email marketing for customer outreach', logo: 'https://mailchimp.com/favicon.ico', category: 'Marketing & Launch', link: 'https://mailchimp.com' },
        { name: 'Buffer', description: 'Free social media marketing', logo: 'https://buffer.com/favicon.ico', category: 'Marketing & Launch', link: 'https://buffer.com' }
    ],
    'digital-marketing-strategy': [
        { name: 'Google Trends', description: 'Free market trend analysis', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'SurveyMonkey', description: 'Free customer surveys and insights', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Market Research', link: 'https://www.surveymonkey.com' },
        { name: 'Google Keyword Planner', description: 'Free keyword research', logo: 'https://ads.google.com/favicon.ico', category: 'Keyword Research', link: 'https://ads.google.com/home/tools/keyword-planner' },
        { name: 'Ubersuggest', description: 'Free SEO and keyword tool', logo: 'https://neilpatel.com/favicon.ico', category: 'Keyword Research', link: 'https://neilpatel.com/ubersuggest' },
        { name: 'ChatGPT', description: 'Free AI marketing strategy and content', logo: 'https://openai.com/favicon.ico', category: 'Strategy Planning', link: 'https://chat.openai.com' },
        { name: 'Trello', description: 'Free marketing campaign planning', logo: 'https://trello.com/favicon.ico', category: 'Strategy Planning', link: 'https://trello.com' },
        { name: 'Canva', description: 'Free marketing graphics and visuals', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced graphic design', logo: 'https://www.gimp.org/favicon.ico', category: 'Content Creation', link: 'https://www.gimp.org' },
        { name: 'Mailchimp', description: 'Free email marketing automation', logo: 'https://mailchimp.com/favicon.ico', category: 'Campaign Execution', link: 'https://mailchimp.com' },
        { name: 'Buffer', description: 'Free social media scheduling', logo: 'https://buffer.com/favicon.ico', category: 'Campaign Execution', link: 'https://buffer.com' },
        { name: 'Google Analytics', description: 'Free marketing performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics & Optimization', link: 'https://analytics.google.com' },
        { name: 'Google Search Console', description: 'Free SEO performance monitoring', logo: 'https://search.google.com/favicon.ico', category: 'Analytics & Optimization', link: 'https://search.google.com/search-console' }
    ],
    'brand-identity-creation': [
        { name: 'Google Trends', description: 'Free brand research and market analysis', logo: 'https://trends.google.com/favicon.ico', category: 'Brand Research', link: 'https://trends.google.com' },
        { name: 'SurveyMonkey', description: 'Free brand perception surveys', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Brand Research', link: 'https://www.surveymonkey.com' },
        { name: 'ChatGPT', description: 'Free AI brand strategy and positioning', logo: 'https://openai.com/favicon.ico', category: 'Brand Strategy', link: 'https://chat.openai.com' },
        { name: 'Notion', description: 'Free brand strategy documentation', logo: 'https://www.notion.so/favicon.ico', category: 'Brand Strategy', link: 'https://www.notion.so' },
        { name: 'Canva', description: 'Free logo design and brand graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Logo Design', link: 'https://www.canva.com' },
        { name: 'Looka', description: 'Free AI-powered logo maker', logo: 'https://looka.com/favicon.ico', category: 'Logo Design', link: 'https://looka.com' },
        { name: 'Coolors', description: 'Free color palette generator', logo: 'https://coolors.co/favicon.ico', category: 'Color & Typography', link: 'https://coolors.co' },
        { name: 'Google Fonts', description: 'Free typography and font selection', logo: 'https://fonts.google.com/favicon.ico', category: 'Color & Typography', link: 'https://fonts.google.com' },
        { name: 'GIMP', description: 'Free advanced graphic design', logo: 'https://www.gimp.org/favicon.ico', category: 'Visual Assets', link: 'https://www.gimp.org' },
        { name: 'Unsplash', description: 'Free high-quality brand photography', logo: 'https://unsplash.com/favicon.ico', category: 'Visual Assets', link: 'https://unsplash.com' },
        { name: 'Figma', description: 'Free brand style guide creation', logo: 'https://www.figma.com/favicon.ico', category: 'Brand Guidelines', link: 'https://www.figma.com' },
        { name: 'Google Docs', description: 'Free brand guidelines documentation', logo: 'https://docs.google.com/favicon.ico', category: 'Brand Guidelines', link: 'https://docs.google.com' }
    ],
    'customer-research': [
        { name: 'Google Trends', description: 'Free customer behavior and trend analysis', logo: 'https://trends.google.com/favicon.ico', category: 'Market Analysis', link: 'https://trends.google.com' },
        { name: 'Google Analytics', description: 'Free website visitor behavior analysis', logo: 'https://analytics.google.com/favicon.ico', category: 'Market Analysis', link: 'https://analytics.google.com' },
        { name: 'SurveyMonkey', description: 'Free customer surveys and feedback collection', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Data Collection', link: 'https://www.surveymonkey.com' },
        { name: 'Google Forms', description: 'Free survey creation and response collection', logo: 'https://forms.google.com/favicon.ico', category: 'Data Collection', link: 'https://forms.google.com' },
        { name: 'Typeform', description: 'Free interactive surveys and questionnaires', logo: 'https://www.typeform.com/favicon.ico', category: 'Survey Design', link: 'https://www.typeform.com' },
        { name: 'Tally', description: 'Free advanced form builder', logo: 'https://tally.so/favicon.ico', category: 'Survey Design', link: 'https://tally.so' },
        { name: 'Google Sheets', description: 'Free data analysis and visualization', logo: 'https://sheets.google.com/favicon.ico', category: 'Data Analysis', link: 'https://sheets.google.com' },
        { name: 'ChatGPT', description: 'Free AI customer insight generation', logo: 'https://openai.com/favicon.ico', category: 'Data Analysis', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free customer persona visualization', logo: 'https://www.canva.com/favicon.ico', category: 'Persona Development', link: 'https://www.canva.com' },
        { name: 'Figma', description: 'Free customer journey mapping', logo: 'https://www.figma.com/favicon.ico', category: 'Persona Development', link: 'https://www.figma.com' },
        { name: 'Notion', description: 'Free research documentation and insights', logo: 'https://www.notion.so/favicon.ico', category: 'Insight Documentation', link: 'https://www.notion.so' },
        { name: 'Google Docs', description: 'Free collaborative research reporting', logo: 'https://docs.google.com/favicon.ico', category: 'Insight Documentation', link: 'https://docs.google.com' }
    ],
    'product-development': [
        { name: 'Google Trends', description: 'Free market validation and demand analysis', logo: 'https://trends.google.com/favicon.ico', category: 'Idea Validation', link: 'https://trends.google.com' },
        { name: 'SurveyMonkey', description: 'Free customer validation surveys', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Idea Validation', link: 'https://www.surveymonkey.com' },
        { name: 'Notion', description: 'Free product planning and documentation', logo: 'https://www.notion.so/favicon.ico', category: 'Product Planning', link: 'https://www.notion.so' },
        { name: 'Trello', description: 'Free product roadmap and task management', logo: 'https://trello.com/favicon.ico', category: 'Product Planning', link: 'https://trello.com' },
        { name: 'Figma', description: 'Free product design and prototyping', logo: 'https://www.figma.com/favicon.ico', category: 'Design & Prototyping', link: 'https://www.figma.com' },
        { name: 'Adobe XD', description: 'Free user experience design', logo: 'https://www.adobe.com/favicon.ico', category: 'Design & Prototyping', link: 'https://www.adobe.com/products/xd.html' },
        { name: 'GitHub', description: 'Free code repository and version control', logo: 'https://github.com/favicon.ico', category: 'Development', link: 'https://github.com' },
        { name: 'VS Code', description: 'Free development environment', logo: 'https://code.visualstudio.com/favicon.ico', category: 'Development', link: 'https://code.visualstudio.com' },
        { name: 'Google Forms', description: 'Free user testing and feedback collection', logo: 'https://forms.google.com/favicon.ico', category: 'User Testing', link: 'https://forms.google.com' },
        { name: 'Hotjar', description: 'Free user behavior analytics', logo: 'https://www.hotjar.com/favicon.ico', category: 'User Testing', link: 'https://www.hotjar.com' },
        { name: 'ChatGPT', description: 'Free AI launch strategy and planning', logo: 'https://openai.com/favicon.ico', category: 'Launch Strategy', link: 'https://chat.openai.com' },
        { name: 'Buffer', description: 'Free product launch marketing', logo: 'https://buffer.com/favicon.ico', category: 'Launch Strategy', link: 'https://buffer.com' }
    ],
    'business-automation': [
        { name: 'Notion', description: 'Free process documentation and mapping', logo: 'https://www.notion.so/favicon.ico', category: 'Process Analysis', link: 'https://www.notion.so' },
        { name: 'Lucidchart', description: 'Free flowchart and process mapping', logo: 'https://www.lucidchart.com/favicon.ico', category: 'Process Analysis', link: 'https://www.lucidchart.com' },
        { name: 'Zapier', description: 'Free workflow automation between apps', logo: 'https://zapier.com/favicon.ico', category: 'Workflow Automation', link: 'https://zapier.com' },
        { name: 'IFTTT', description: 'Free simple automation triggers', logo: 'https://ifttt.com/favicon.ico', category: 'Workflow Automation', link: 'https://ifttt.com' },
        { name: 'Google Workspace', description: 'Free document and form automation', logo: 'https://workspace.google.com/favicon.ico', category: 'Document Automation', link: 'https://workspace.google.com' },
        { name: 'Airtable', description: 'Free database and workflow management', logo: 'https://airtable.com/favicon.ico', category: 'Document Automation', link: 'https://airtable.com' },
        { name: 'Trello', description: 'Free task and project automation', logo: 'https://trello.com/favicon.ico', category: 'Task Automation', link: 'https://trello.com' },
        { name: 'Asana', description: 'Free team workflow automation', logo: 'https://asana.com/favicon.ico', category: 'Task Automation', link: 'https://asana.com' },
        { name: 'Google Analytics', description: 'Free automation performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Performance Monitoring', link: 'https://analytics.google.com' },
        { name: 'Google Sheets', description: 'Free automated reporting and dashboards', logo: 'https://sheets.google.com/favicon.ico', category: 'Performance Monitoring', link: 'https://sheets.google.com' }
    ],
    'content-creation-pipeline': [
        { name: 'Google Trends', description: 'Free content topic research and trends', logo: 'https://trends.google.com/favicon.ico', category: 'Content Research', link: 'https://trends.google.com' },
        { name: 'Google Keyword Planner', description: 'Free keyword research for content', logo: 'https://ads.google.com/favicon.ico', category: 'Content Research', link: 'https://ads.google.com/home/tools/keyword-planner' },
        { name: 'Notion', description: 'Free content calendar and planning', logo: 'https://www.notion.so/favicon.ico', category: 'Content Planning', link: 'https://www.notion.so' },
        { name: 'Trello', description: 'Free content workflow management', logo: 'https://trello.com/favicon.ico', category: 'Content Planning', link: 'https://trello.com' },
        { name: 'ChatGPT', description: 'Free AI content generation and writing', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Grammarly', description: 'Free writing enhancement and editing', logo: 'https://www.grammarly.com/favicon.ico', category: 'Content Creation', link: 'https://www.grammarly.com' },
        { name: 'Canva', description: 'Free visual content and graphics creation', logo: 'https://www.canva.com/favicon.ico', category: 'Visual Content', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced image editing', logo: 'https://www.gimp.org/favicon.ico', category: 'Visual Content', link: 'https://www.gimp.org' },
        { name: 'Google Search Console', description: 'Free SEO optimization and monitoring', logo: 'https://search.google.com/favicon.ico', category: 'SEO Optimization', link: 'https://search.google.com/search-console' },
        { name: 'Yoast SEO', description: 'Free WordPress SEO optimization', logo: 'https://yoast.com/favicon.ico', category: 'SEO Optimization', link: 'https://yoast.com' },
        { name: 'Buffer', description: 'Free social media content distribution', logo: 'https://buffer.com/favicon.ico', category: 'Content Distribution', link: 'https://buffer.com' },
        { name: 'Hootsuite', description: 'Free multi-platform content publishing', logo: 'https://hootsuite.com/favicon.ico', category: 'Content Distribution', link: 'https://hootsuite.com' },
        { name: 'Google Analytics', description: 'Free content performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Performance Analysis', link: 'https://analytics.google.com' }
    ],
    'lead-generation': [
        { name: 'Google Trends', description: 'Free market research for lead targeting', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'LinkedIn', description: 'Free professional networking and prospecting', logo: 'https://www.linkedin.com/favicon.ico', category: 'Market Research', link: 'https://www.linkedin.com' },
        { name: 'Google Forms', description: 'Free lead capture forms and surveys', logo: 'https://forms.google.com/favicon.ico', category: 'Lead Capture', link: 'https://forms.google.com' },
        { name: 'Typeform', description: 'Free interactive lead generation forms', logo: 'https://www.typeform.com/favicon.ico', category: 'Lead Capture', link: 'https://www.typeform.com' },
        { name: 'Canva', description: 'Free lead magnets and marketing materials', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'ChatGPT', description: 'Free AI content for lead magnets', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Mailchimp', description: 'Free email marketing and automation', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Outreach', link: 'https://mailchimp.com' },
        { name: 'Gmail', description: 'Free email outreach and follow-up', logo: 'https://gmail.com/favicon.ico', category: 'Email Outreach', link: 'https://gmail.com' },
        { name: 'Google Sheets', description: 'Free lead tracking and scoring', logo: 'https://sheets.google.com/favicon.ico', category: 'Lead Management', link: 'https://sheets.google.com' },
        { name: 'HubSpot CRM', description: 'Free customer relationship management', logo: 'https://www.hubspot.com/favicon.ico', category: 'Lead Management', link: 'https://www.hubspot.com' },
        { name: 'Google Analytics', description: 'Free conversion tracking and optimization', logo: 'https://analytics.google.com/favicon.ico', category: 'Conversion Optimization', link: 'https://analytics.google.com' },
        { name: 'Hotjar', description: 'Free user behavior and conversion analysis', logo: 'https://www.hotjar.com/favicon.ico', category: 'Conversion Optimization', link: 'https://www.hotjar.com' }
    ],
    'market-analysis': [
        { name: 'Google Trends', description: 'Free market trend analysis and insights', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'Google Keyword Planner', description: 'Free market demand and search analysis', logo: 'https://ads.google.com/favicon.ico', category: 'Market Research', link: 'https://ads.google.com/home/tools/keyword-planner' },
        { name: 'SurveyMonkey', description: 'Free customer and market surveys', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Primary Research', link: 'https://www.surveymonkey.com' },
        { name: 'Google Forms', description: 'Free market research questionnaires', logo: 'https://forms.google.com/favicon.ico', category: 'Primary Research', link: 'https://forms.google.com' },
        { name: 'SimilarWeb', description: 'Free competitor website analysis', logo: 'https://www.similarweb.com/favicon.ico', category: 'Competitor Analysis', link: 'https://www.similarweb.com' },
        { name: 'Ubersuggest', description: 'Free competitor SEO and content analysis', logo: 'https://neilpatel.com/favicon.ico', category: 'Competitor Analysis', link: 'https://neilpatel.com/ubersuggest' },
        { name: 'Google Sheets', description: 'Free data analysis and market calculations', logo: 'https://sheets.google.com/favicon.ico', category: 'Data Analysis', link: 'https://sheets.google.com' },
        { name: 'ChatGPT', description: 'Free AI market insights and analysis', logo: 'https://openai.com/favicon.ico', category: 'Data Analysis', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free market research presentation design', logo: 'https://www.canva.com/favicon.ico', category: 'Report Creation', link: 'https://www.canva.com' },
        { name: 'Google Docs', description: 'Free market analysis report writing', logo: 'https://docs.google.com/favicon.ico', category: 'Report Creation', link: 'https://docs.google.com' }
    ],
    'seo-optimization': [
        { name: 'Google Keyword Planner', description: 'Free keyword research tool', logo: 'https://ads.google.com/favicon.ico', category: 'Keyword Research', link: 'https://ads.google.com/home/tools/keyword-planner' },
        { name: 'Ubersuggest', description: 'Free keyword ideas and volume data', logo: 'https://neilpatel.com/favicon.ico', category: 'Keyword Research', link: 'https://neilpatel.com/ubersuggest' },
        { name: 'Google Trends', description: 'Free trend analysis for topics', logo: 'https://trends.google.com/favicon.ico', category: 'Topic Research', link: 'https://trends.google.com' },
        { name: 'AnswerThePublic', description: 'Free question-based keyword research', logo: 'https://answerthepublic.com/favicon.ico', category: 'Topic Research', link: 'https://answerthepublic.com' },
        { name: 'Yoast SEO', description: 'Free WordPress SEO optimization', logo: 'https://yoast.com/favicon.ico', category: 'On-Page SEO', link: 'https://yoast.com' },
        { name: 'Rank Math', description: 'Free WordPress SEO plugin', logo: 'https://rankmath.com/favicon.ico', category: 'On-Page SEO', link: 'https://rankmath.com' },
        { name: 'Google Search Console', description: 'Free SEO monitoring and insights', logo: 'https://search.google.com/favicon.ico', category: 'Technical SEO', link: 'https://search.google.com/search-console' },
        { name: 'Screaming Frog Free', description: 'Free SEO spider tool (limited)', logo: 'https://www.screamingfrog.co.uk/favicon.ico', category: 'Technical SEO', link: 'https://www.screamingfrog.co.uk/seo-spider' },
        { name: 'PageSpeed Insights', description: 'Free page speed analysis', logo: 'https://pagespeed.web.dev/favicon.ico', category: 'Performance SEO', link: 'https://pagespeed.web.dev' },
        { name: 'GTmetrix', description: 'Free website performance testing', logo: 'https://gtmetrix.com/favicon.ico', category: 'Performance SEO', link: 'https://gtmetrix.com' },
        { name: 'Google Analytics', description: 'Free SEO performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'SEO Analytics', link: 'https://analytics.google.com' },
        { name: 'Bing Webmaster Tools', description: 'Free Bing SEO insights', logo: 'https://www.bing.com/favicon.ico', category: 'SEO Analytics', link: 'https://www.bing.com/webmasters' }
    ],
    'influencer-marketing': [
        { name: 'Instagram', description: 'Free influencer discovery platform', logo: 'https://www.instagram.com/favicon.ico', category: 'Influencer Research', link: 'https://www.instagram.com' },
        { name: 'TikTok', description: 'Free creator discovery and trends', logo: 'https://www.tiktok.com/favicon.ico', category: 'Influencer Research', link: 'https://www.tiktok.com' },
        { name: 'YouTube Studio', description: 'Free creator collaboration tools', logo: 'https://studio.youtube.com/favicon.ico', category: 'Creator Collaboration', link: 'https://studio.youtube.com' },
        { name: 'LinkedIn', description: 'Free B2B influencer networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Creator Collaboration', link: 'https://www.linkedin.com' },
        { name: 'Google Sheets', description: 'Free influencer outreach tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Campaign Management', link: 'https://sheets.google.com' },
        { name: 'Trello', description: 'Free influencer campaign planning', logo: 'https://trello.com/favicon.ico', category: 'Campaign Management', link: 'https://trello.com' },
        { name: 'Canva', description: 'Free influencer content design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'ChatGPT', description: 'Free AI content briefs for influencers', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Google Analytics', description: 'Free influencer traffic tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Performance Tracking', link: 'https://analytics.google.com' },
        { name: 'Bitly', description: 'Free link tracking for campaigns', logo: 'https://bitly.com/favicon.ico', category: 'Performance Tracking', link: 'https://bitly.com' }
    ],
    'video-marketing': [
        { name: 'Google Trends', description: 'Free video topic research', logo: 'https://trends.google.com/favicon.ico', category: 'Video Strategy', link: 'https://trends.google.com' },
        { name: 'YouTube Keyword Tool', description: 'Free video keyword research', logo: 'https://keywordtool.io/favicon.ico', category: 'Video Strategy', link: 'https://keywordtool.io/youtube' },
        { name: 'Canva Video', description: 'Free video creation templates', logo: 'https://www.canva.com/favicon.ico', category: 'Video Creation', link: 'https://www.canva.com/video' },
        { name: 'Loom', description: 'Free screen recording videos', logo: 'https://www.loom.com/favicon.ico', category: 'Video Creation', link: 'https://www.loom.com' },
        { name: 'DaVinci Resolve', description: 'Free professional video editing', logo: 'https://www.blackmagicdesign.com/favicon.ico', category: 'Video Editing', link: 'https://www.blackmagicdesign.com/products/davinciresolve' },
        { name: 'Shotcut', description: 'Free open-source video editor', logo: 'https://shotcut.org/favicon.ico', category: 'Video Editing', link: 'https://shotcut.org' },
        { name: 'Kapwing', description: 'Free online video editor', logo: 'https://www.kapwing.com/favicon.ico', category: 'Video Enhancement', link: 'https://www.kapwing.com' },
        { name: 'Headliner', description: 'Free video captions and audiograms', logo: 'https://www.headliner.app/favicon.ico', category: 'Video Enhancement', link: 'https://www.headliner.app' },
        { name: 'YouTube', description: 'Free video hosting and distribution', logo: 'https://www.youtube.com/favicon.ico', category: 'Video Distribution', link: 'https://www.youtube.com' },
        { name: 'Vimeo Basic', description: 'Free video hosting platform', logo: 'https://vimeo.com/favicon.ico', category: 'Video Distribution', link: 'https://vimeo.com' },
        { name: 'YouTube Analytics', description: 'Free video performance tracking', logo: 'https://studio.youtube.com/favicon.ico', category: 'Video Analytics', link: 'https://studio.youtube.com/channel/analytics' },
        { name: 'Google Analytics', description: 'Free video traffic analysis', logo: 'https://analytics.google.com/favicon.ico', category: 'Video Analytics', link: 'https://analytics.google.com' }
    ],
    'affiliate-marketing': [
        { name: 'Google Trends', description: 'Free affiliate product research', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'Amazon Associates', description: 'Free affiliate program signup', logo: 'https://affiliate-program.amazon.com/favicon.ico', category: 'Market Research', link: 'https://affiliate-program.amazon.com' },
        { name: 'WordPress', description: 'Free affiliate website platform', logo: 'https://wordpress.org/favicon.ico', category: 'Website Setup', link: 'https://wordpress.org' },
        { name: 'Wix', description: 'Free website builder for affiliates', logo: 'https://www.wix.com/favicon.ico', category: 'Website Setup', link: 'https://www.wix.com' },
        { name: 'Google Keyword Planner', description: 'Free affiliate keyword research', logo: 'https://ads.google.com/favicon.ico', category: 'SEO & Content', link: 'https://ads.google.com/home/tools/keyword-planner' },
        { name: 'ChatGPT', description: 'Free AI content for affiliate sites', logo: 'https://openai.com/favicon.ico', category: 'SEO & Content', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free affiliate graphics creation', logo: 'https://www.canva.com/favicon.ico', category: 'Creative Assets', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free image editing for affiliates', logo: 'https://www.gimp.org/favicon.ico', category: 'Creative Assets', link: 'https://www.gimp.org' },
        { name: 'Pretty Links Lite', description: 'Free affiliate link management', logo: 'https://prettylinks.com/favicon.ico', category: 'Link Management', link: 'https://prettylinks.com' },
        { name: 'Bitly', description: 'Free link shortening and tracking', logo: 'https://bitly.com/favicon.ico', category: 'Link Management', link: 'https://bitly.com' },
        { name: 'Google Analytics', description: 'Free affiliate traffic tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Performance Tracking', link: 'https://analytics.google.com' },
        { name: 'Google Search Console', description: 'Free SEO performance monitoring', logo: 'https://search.google.com/favicon.ico', category: 'Performance Tracking', link: 'https://search.google.com/search-console' }
    ],
    'crm-setup': [
        { name: 'HubSpot CRM', description: 'Free CRM platform', logo: 'https://www.hubspot.com/favicon.ico', category: 'CRM Platform', link: 'https://www.hubspot.com/products/crm' },
        { name: 'Zoho CRM', description: 'Free CRM for small businesses', logo: 'https://www.zoho.com/favicon.ico', category: 'CRM Platform', link: 'https://www.zoho.com/crm' },
        { name: 'Google Sheets', description: 'Free data preparation and cleaning', logo: 'https://sheets.google.com/favicon.ico', category: 'Data Preparation', link: 'https://sheets.google.com' },
        { name: 'Excel Online', description: 'Free data formatting for import', logo: 'https://www.microsoft.com/favicon.ico', category: 'Data Preparation', link: 'https://www.microsoft.com/en-us/microsoft-365/free-office-online-for-the-web' },
        { name: 'Zapier', description: 'Free basic automation between apps', logo: 'https://zapier.com/favicon.ico', category: 'Workflow Automation', link: 'https://zapier.com' },
        { name: 'IFTTT', description: 'Free simple CRM automations', logo: 'https://ifttt.com/favicon.ico', category: 'Workflow Automation', link: 'https://ifttt.com' },
        { name: 'Google Forms', description: 'Free data collection for CRM', logo: 'https://forms.google.com/favicon.ico', category: 'Data Collection', link: 'https://forms.google.com' },
        { name: 'Typeform', description: 'Free interactive lead forms', logo: 'https://www.typeform.com/favicon.ico', category: 'Data Collection', link: 'https://www.typeform.com' },
        { name: 'Gmail', description: 'Free email integration with CRM', logo: 'https://mail.google.com/favicon.ico', category: 'Email Integration', link: 'https://mail.google.com' },
        { name: 'Mailchimp', description: 'Free email marketing integration', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Integration', link: 'https://mailchimp.com' },
        { name: 'Google Data Studio', description: 'Free CRM reporting dashboards', logo: 'https://datastudio.google.com/favicon.ico', category: 'Reporting & Analytics', link: 'https://datastudio.google.com' },
        { name: 'Google Analytics', description: 'Free customer behavior tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Reporting & Analytics', link: 'https://analytics.google.com' }
    ],
    'newsletter-creation': [
        { name: 'Google Trends', description: 'Free newsletter topic research', logo: 'https://trends.google.com/favicon.ico', category: 'Content Planning', link: 'https://trends.google.com' },
        { name: 'Feedly', description: 'Free content curation for newsletters', logo: 'https://feedly.com/favicon.ico', category: 'Content Planning', link: 'https://feedly.com' },
        { name: 'ChatGPT', description: 'Free AI newsletter content writing', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Google Docs', description: 'Free newsletter writing and editing', logo: 'https://docs.google.com/favicon.ico', category: 'Content Creation', link: 'https://docs.google.com' },
        { name: 'Canva', description: 'Free newsletter templates and design', logo: 'https://www.canva.com/favicon.ico', category: 'Newsletter Design', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free image editing for newsletters', logo: 'https://www.gimp.org/favicon.ico', category: 'Newsletter Design', link: 'https://www.gimp.org' },
        { name: 'Mailchimp', description: 'Free email marketing platform', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Platform', link: 'https://mailchimp.com' },
        { name: 'Sendinblue', description: 'Free newsletter sending service', logo: 'https://www.sendinblue.com/favicon.ico', category: 'Email Platform', link: 'https://www.sendinblue.com' },
        { name: 'Google Sheets', description: 'Free subscriber list management', logo: 'https://sheets.google.com/favicon.ico', category: 'List Management', link: 'https://sheets.google.com' },
        { name: 'MailerLite', description: 'Free subscriber segmentation', logo: 'https://www.mailerlite.com/favicon.ico', category: 'List Management', link: 'https://www.mailerlite.com' },
        { name: 'Google Analytics', description: 'Free newsletter performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Performance Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp Reports', description: 'Free email campaign analytics', logo: 'https://mailchimp.com/favicon.ico', category: 'Performance Analytics', link: 'https://mailchimp.com/features/email-marketing-analytics' }
    ],
    'event-planning': [
        { name: 'Google Forms', description: 'Free event registration forms', logo: 'https://forms.google.com/favicon.ico', category: 'Event Planning', link: 'https://forms.google.com' },
        { name: 'Trello', description: 'Free event planning boards', logo: 'https://trello.com/favicon.ico', category: 'Event Planning', link: 'https://trello.com' },
        { name: 'Google Calendar', description: 'Free event scheduling', logo: 'https://calendar.google.com/favicon.ico', category: 'Scheduling', link: 'https://calendar.google.com' },
        { name: 'Doodle', description: 'Free date coordination tool', logo: 'https://doodle.com/favicon.ico', category: 'Scheduling', link: 'https://doodle.com' },
        { name: 'Canva', description: 'Free event graphics and invitations', logo: 'https://www.canva.com/favicon.ico', category: 'Event Marketing', link: 'https://www.canva.com' },
        { name: 'Mailchimp', description: 'Free event email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Event Marketing', link: 'https://mailchimp.com' },
        { name: 'Eventbrite', description: 'Free event ticketing platform', logo: 'https://www.eventbrite.com/favicon.ico', category: 'Registration', link: 'https://www.eventbrite.com' },
        { name: 'Google Sheets', description: 'Free attendee tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Registration', link: 'https://sheets.google.com' },
        { name: 'Zoom', description: 'Free virtual event hosting', logo: 'https://zoom.us/favicon.ico', category: 'Event Hosting', link: 'https://zoom.us' },
        { name: 'YouTube Live', description: 'Free event livestreaming', logo: 'https://www.youtube.com/favicon.ico', category: 'Event Hosting', link: 'https://www.youtube.com/live' },
        { name: 'Google Analytics', description: 'Free event website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Post-Event Analysis', link: 'https://analytics.google.com' },
        { name: 'Google Forms', description: 'Free post-event feedback surveys', logo: 'https://forms.google.com/favicon.ico', category: 'Post-Event Analysis', link: 'https://forms.google.com' }
    ],
    'competitive-analysis': [
        { name: 'Google', description: 'Free competitor search and discovery', logo: 'https://www.google.com/favicon.ico', category: 'Competitor Identification', link: 'https://www.google.com' },
        { name: 'LinkedIn', description: 'Free competitor research platform', logo: 'https://www.linkedin.com/favicon.ico', category: 'Competitor Identification', link: 'https://www.linkedin.com' },
        { name: 'SimilarWeb', description: 'Free website traffic comparison', logo: 'https://www.similarweb.com/favicon.ico', category: 'Traffic Analysis', link: 'https://www.similarweb.com' },
        { name: 'Alexa', description: 'Free website ranking comparison', logo: 'https://www.alexa.com/favicon.ico', category: 'Traffic Analysis', link: 'https://www.alexa.com' },
        { name: 'Google Trends', description: 'Free market trend comparison', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'Google Keyword Planner', description: 'Free competitor keyword research', logo: 'https://ads.google.com/favicon.ico', category: 'Market Research', link: 'https://ads.google.com/home/tools/keyword-planner' },
        { name: 'Google Alerts', description: 'Free competitor monitoring', logo: 'https://www.google.com/alerts/favicon.ico', category: 'Monitoring', link: 'https://www.google.com/alerts' },
        { name: 'Social Blade', description: 'Free social media competitor tracking', logo: 'https://socialblade.com/favicon.ico', category: 'Monitoring', link: 'https://socialblade.com' },
        { name: 'Google Search Console', description: 'Free SEO performance comparison', logo: 'https://search.google.com/favicon.ico', category: 'Performance Analysis', link: 'https://search.google.com/search-console' },
        { name: 'Google Analytics', description: 'Free website performance benchmarking', logo: 'https://analytics.google.com/favicon.ico', category: 'Performance Analysis', link: 'https://analytics.google.com' },
        { name: 'Google Sheets', description: 'Free SWOT analysis templates', logo: 'https://sheets.google.com/favicon.ico', category: 'Strategic Analysis', link: 'https://sheets.google.com' },
        { name: 'Canva', description: 'Free competitive analysis reports', logo: 'https://www.canva.com/favicon.ico', category: 'Strategic Analysis', link: 'https://www.canva.com' }
    ],
    'freelance-business': [
        { name: 'Google Sheets', description: 'Free client contact management', logo: 'https://sheets.google.com/favicon.ico', category: 'Client Management', link: 'https://sheets.google.com' },
        { name: 'HubSpot CRM', description: 'Free client relationship management', logo: 'https://www.hubspot.com/favicon.ico', category: 'Client Management', link: 'https://www.hubspot.com/products/crm' },
        { name: 'Trello', description: 'Free project management boards', logo: 'https://trello.com/favicon.ico', category: 'Project Management', link: 'https://trello.com' },
        { name: 'Notion', description: 'Free project tracking workspace', logo: 'https://www.notion.so/favicon.ico', category: 'Project Management', link: 'https://www.notion.so' },
        { name: 'Toggl Track', description: 'Free time tracking for freelancers', logo: 'https://toggl.com/favicon.ico', category: 'Time Management', link: 'https://toggl.com/track' },
        { name: 'Clockify', description: 'Free time tracking software', logo: 'https://clockify.me/favicon.ico', category: 'Time Management', link: 'https://clockify.me' },
        { name: 'Wave', description: 'Free invoicing and accounting', logo: 'https://www.waveapps.com/favicon.ico', category: 'Finance & Invoicing', link: 'https://www.waveapps.com' },
        { name: 'Invoice Generator', description: 'Free invoice creation tool', logo: 'https://invoice-generator.com/favicon.ico', category: 'Finance & Invoicing', link: 'https://invoice-generator.com' },
        { name: 'Canva', description: 'Free portfolio and proposal design', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing', link: 'https://www.canva.com' },
        { name: 'LinkedIn', description: 'Free freelance networking platform', logo: 'https://www.linkedin.com/favicon.ico', category: 'Marketing', link: 'https://www.linkedin.com' },
        { name: 'Google Drive', description: 'Free file storage and sharing', logo: 'https://drive.google.com/favicon.ico', category: 'File Management', link: 'https://drive.google.com' },
        { name: 'Dropbox Basic', description: 'Free cloud storage for files', logo: 'https://www.dropbox.com/favicon.ico', category: 'File Management', link: 'https://www.dropbox.com/basic' }
    ],
    'book-publishing': [
        { name: 'Google Docs', description: 'Free book writing and editing', logo: 'https://docs.google.com/favicon.ico', category: 'Writing & Editing', link: 'https://docs.google.com' },
        { name: 'ChatGPT', description: 'Free AI writing assistance and editing', logo: 'https://openai.com/favicon.ico', category: 'Writing & Editing', link: 'https://chat.openai.com' },
        { name: 'Grammarly', description: 'Free grammar and style checking', logo: 'https://www.grammarly.com/favicon.ico', category: 'Writing & Editing', link: 'https://www.grammarly.com' },
        { name: 'Hemingway Editor', description: 'Free readability improvement tool', logo: 'https://hemingwayapp.com/favicon.ico', category: 'Writing & Editing', link: 'https://hemingwayapp.com' },
        { name: 'Canva', description: 'Free book cover design', logo: 'https://www.canva.com/favicon.ico', category: 'Cover Design', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced image editing for covers', logo: 'https://www.gimp.org/favicon.ico', category: 'Cover Design', link: 'https://www.gimp.org' },
        { name: 'Kindle Direct Publishing', description: 'Free self-publishing platform', logo: 'https://kdp.amazon.com/favicon.ico', category: 'Publishing', link: 'https://kdp.amazon.com' },
        { name: 'Draft2Digital', description: 'Free ebook distribution service', logo: 'https://www.draft2digital.com/favicon.ico', category: 'Publishing', link: 'https://www.draft2digital.com' },
        { name: 'Reedsy', description: 'Free book formatting tool', logo: 'https://reedsy.com/favicon.ico', category: 'Formatting', link: 'https://reedsy.com' },
        { name: 'Calibre', description: 'Free ebook management and conversion', logo: 'https://calibre-ebook.com/favicon.ico', category: 'Formatting', link: 'https://calibre-ebook.com' },
        { name: 'BookFunnel', description: 'Free book delivery service', logo: 'https://bookfunnel.com/favicon.ico', category: 'Distribution', link: 'https://bookfunnel.com' },
        { name: 'Goodreads', description: 'Free book promotion platform', logo: 'https://www.goodreads.com/favicon.ico', category: 'Marketing', link: 'https://www.goodreads.com' }
    ],
    'virtual-event-planning': [
        { name: 'Zoom', description: 'Free video conferencing platform', logo: 'https://zoom.us/favicon.ico', category: 'Event Platform', link: 'https://zoom.us' },
        { name: 'Google Meet', description: 'Free video meetings service', logo: 'https://meet.google.com/favicon.ico', category: 'Event Platform', link: 'https://meet.google.com' },
        { name: 'Eventbrite', description: 'Free event registration and ticketing', logo: 'https://www.eventbrite.com/favicon.ico', category: 'Registration', link: 'https://www.eventbrite.com' },
        { name: 'Google Forms', description: 'Free attendee registration forms', logo: 'https://forms.google.com/favicon.ico', category: 'Registration', link: 'https://forms.google.com' },
        { name: 'Canva', description: 'Free virtual event graphics and materials', logo: 'https://www.canva.com/favicon.ico', category: 'Event Design', link: 'https://www.canva.com' },
        { name: 'StreamYard', description: 'Free live streaming studio', logo: 'https://streamyard.com/favicon.ico', category: 'Live Streaming', link: 'https://streamyard.com' },
        { name: 'OBS Studio', description: 'Free broadcasting software', logo: 'https://obsproject.com/favicon.ico', category: 'Live Streaming', link: 'https://obsproject.com' },
        { name: 'YouTube Live', description: 'Free live streaming platform', logo: 'https://www.youtube.com/favicon.ico', category: 'Live Streaming', link: 'https://www.youtube.com/live' },
        { name: 'Slido', description: 'Free Q&A and polling platform', logo: 'https://www.slido.com/favicon.ico', category: 'Audience Engagement', link: 'https://www.slido.com' },
        { name: 'Mentimeter', description: 'Free interactive presentations', logo: 'https://www.mentimeter.com/favicon.ico', category: 'Audience Engagement', link: 'https://www.mentimeter.com' },
        { name: 'Google Analytics', description: 'Free event analytics tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free event email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Promotion', link: 'https://mailchimp.com' }
    ],
    'personal-branding': [
        { name: 'Google Docs', description: 'Free personal brand strategy planning', logo: 'https://docs.google.com/favicon.ico', category: 'Brand Strategy', link: 'https://docs.google.com' },
        { name: 'Canva', description: 'Free personal brand design toolkit', logo: 'https://www.canva.com/favicon.ico', category: 'Visual Identity', link: 'https://www.canva.com' },
        { name: 'WordPress.com', description: 'Free personal website builder', logo: 'https://wordpress.com/favicon.ico', category: 'Website Creation', link: 'https://wordpress.com' },
        { name: 'GitHub Pages', description: 'Free portfolio hosting for developers', logo: 'https://github.com/favicon.ico', category: 'Website Creation', link: 'https://pages.github.com' },
        { name: 'LinkedIn', description: 'Free professional networking platform', logo: 'https://www.linkedin.com/favicon.ico', category: 'Social Presence', link: 'https://www.linkedin.com' },
        { name: 'Twitter', description: 'Free thought leadership platform', logo: 'https://twitter.com/favicon.ico', category: 'Social Presence', link: 'https://twitter.com' },
        { name: 'Medium', description: 'Free content publishing platform', logo: 'https://medium.com/favicon.ico', category: 'Content Creation', link: 'https://medium.com' },
        { name: 'ChatGPT', description: 'Free AI content creation assistant', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Unsplash', description: 'Free high-quality stock photos', logo: 'https://unsplash.com/favicon.ico', category: 'Visual Content', link: 'https://unsplash.com' },
        { name: 'Mailchimp', description: 'Free email newsletter platform', logo: 'https://mailchimp.com/favicon.ico', category: 'Audience Building', link: 'https://mailchimp.com' },
        { name: 'Google Analytics', description: 'Free personal brand analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' },
        { name: 'Buffer', description: 'Free social media scheduling', logo: 'https://buffer.com/favicon.ico', category: 'Content Distribution', link: 'https://buffer.com' }
    ],
    'remote-team-management': [
        { name: 'Slack', description: 'Free team communication platform', logo: 'https://slack.com/favicon.ico', category: 'Communication', link: 'https://slack.com' },
        { name: 'Discord', description: 'Free voice and text chat for teams', logo: 'https://discord.com/favicon.ico', category: 'Communication', link: 'https://discord.com' },
        { name: 'Zoom', description: 'Free video conferencing tool', logo: 'https://zoom.us/favicon.ico', category: 'Video Meetings', link: 'https://zoom.us' },
        { name: 'Google Meet', description: 'Free video meetings service', logo: 'https://meet.google.com/favicon.ico', category: 'Video Meetings', link: 'https://meet.google.com' },
        { name: 'Trello', description: 'Free visual project management', logo: 'https://trello.com/favicon.ico', category: 'Project Management', link: 'https://trello.com' },
        { name: 'Asana', description: 'Free task and project tracking', logo: 'https://asana.com/favicon.ico', category: 'Project Management', link: 'https://asana.com' },
        { name: 'Google Workspace', description: 'Free collaborative document editing', logo: 'https://workspace.google.com/favicon.ico', category: 'Document Collaboration', link: 'https://workspace.google.com' },
        { name: 'Notion', description: 'Free team wiki and knowledge base', logo: 'https://www.notion.so/favicon.ico', category: 'Document Collaboration', link: 'https://www.notion.so' },
        { name: 'Toggl Track', description: 'Free time tracking for teams', logo: 'https://toggl.com/favicon.ico', category: 'Time Management', link: 'https://toggl.com/track' },
        { name: 'Clockify', description: 'Free time tracking software', logo: 'https://clockify.me/favicon.ico', category: 'Time Management', link: 'https://clockify.me' },
        { name: '15Five', description: 'Free team feedback and check-ins', logo: 'https://www.15five.com/favicon.ico', category: 'Team Engagement', link: 'https://www.15five.com' },
        { name: 'Miro', description: 'Free online collaborative whiteboard', logo: 'https://miro.com/favicon.ico', category: 'Visual Collaboration', link: 'https://miro.com' }
    ],
    'mobile-app-marketing': [
        { name: 'Google Keyword Planner', description: 'Free app store keyword research', logo: 'https://ads.google.com/favicon.ico', category: 'ASO Research', link: 'https://ads.google.com/home/tools/keyword-planner' },
        { name: 'App Annie', description: 'Free app market data and analytics', logo: 'https://www.appannie.com/favicon.ico', category: 'ASO Research', link: 'https://www.appannie.com' },
        { name: 'Canva', description: 'Free app store screenshots design', logo: 'https://www.canva.com/favicon.ico', category: 'App Store Assets', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced image editing for app assets', logo: 'https://www.gimp.org/favicon.ico', category: 'App Store Assets', link: 'https://www.gimp.org' },
        { name: 'ChatGPT', description: 'Free AI app store description writing', logo: 'https://openai.com/favicon.ico', category: 'App Store Listing', link: 'https://chat.openai.com' },
        { name: 'Google Play Console', description: 'Free Android app analytics', logo: 'https://play.google.com/favicon.ico', category: 'App Analytics', link: 'https://play.google.com/console' },
        { name: 'App Store Connect', description: 'Free iOS app analytics', logo: 'https://appstoreconnect.apple.com/favicon.ico', category: 'App Analytics', link: 'https://appstoreconnect.apple.com' },
        { name: 'Firebase', description: 'Free app analytics and engagement', logo: 'https://firebase.google.com/favicon.ico', category: 'App Analytics', link: 'https://firebase.google.com' },
        { name: 'Product Hunt', description: 'Free app launch platform', logo: 'https://www.producthunt.com/favicon.ico', category: 'App Launch', link: 'https://www.producthunt.com' },
        { name: 'Reddit', description: 'Free community marketing platform', logo: 'https://www.reddit.com/favicon.ico', category: 'Community Marketing', link: 'https://www.reddit.com' },
        { name: 'Buffer', description: 'Free social media scheduling', logo: 'https://buffer.com/favicon.ico', category: 'Social Media', link: 'https://buffer.com' },
        { name: 'Mailchimp', description: 'Free email marketing for apps', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],
    'online-teaching': [
        { name: 'Google Classroom', description: 'Free learning management system', logo: 'https://classroom.google.com/favicon.ico', category: 'Course Platform', link: 'https://classroom.google.com' },
        { name: 'Moodle', description: 'Free open-source learning platform', logo: 'https://moodle.org/favicon.ico', category: 'Course Platform', link: 'https://moodle.org' },
        { name: 'Zoom', description: 'Free video teaching platform', logo: 'https://zoom.us/favicon.ico', category: 'Live Teaching', link: 'https://zoom.us' },
        { name: 'OBS Studio', description: 'Free screen recording for lessons', logo: 'https://obsproject.com/favicon.ico', category: 'Content Creation', link: 'https://obsproject.com' },
        { name: 'Canva', description: 'Free course materials design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Forms', description: 'Free quiz and assessment creation', logo: 'https://forms.google.com/favicon.ico', category: 'Assessment', link: 'https://forms.google.com' },
        { name: 'Kahoot', description: 'Free interactive learning games', logo: 'https://kahoot.com/favicon.ico', category: 'Assessment', link: 'https://kahoot.com' },
        { name: 'YouTube', description: 'Free video lesson hosting', logo: 'https://www.youtube.com/favicon.ico', category: 'Content Hosting', link: 'https://www.youtube.com' },
        { name: 'Google Drive', description: 'Free course material storage', logo: 'https://drive.google.com/favicon.ico', category: 'Content Hosting', link: 'https://drive.google.com' },
        { name: 'Padlet', description: 'Free collaborative boards', logo: 'https://padlet.com/favicon.ico', category: 'Collaboration', link: 'https://padlet.com' },
        { name: 'Slack', description: 'Free student community platform', logo: 'https://slack.com/favicon.ico', category: 'Community', link: 'https://slack.com' },
        { name: 'Google Analytics', description: 'Free course performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' }
    ],
    'crowdfunding-campaign': [
        { name: 'Google Trends', description: 'Free market validation research', logo: 'https://trends.google.com/favicon.ico', category: 'Campaign Research', link: 'https://trends.google.com' },
        { name: 'Google Forms', description: 'Free audience survey tool', logo: 'https://forms.google.com/favicon.ico', category: 'Campaign Research', link: 'https://forms.google.com' },
        { name: 'Kickstarter', description: 'Free crowdfunding platform', logo: 'https://www.kickstarter.com/favicon.ico', category: 'Funding Platform', link: 'https://www.kickstarter.com' },
        { name: 'Indiegogo', description: 'Free flexible funding platform', logo: 'https://www.indiegogo.com/favicon.ico', category: 'Funding Platform', link: 'https://www.indiegogo.com' },
        { name: 'Canva', description: 'Free campaign graphics creation', logo: 'https://www.canva.com/favicon.ico', category: 'Campaign Design', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced image editing', logo: 'https://www.gimp.org/favicon.ico', category: 'Campaign Design', link: 'https://www.gimp.org' },
        { name: 'DaVinci Resolve', description: 'Free video editing for campaign', logo: 'https://www.blackmagicdesign.com/favicon.ico', category: 'Video Production', link: 'https://www.blackmagicdesign.com/products/davinciresolve' },
        { name: 'OBS Studio', description: 'Free screen recording software', logo: 'https://obsproject.com/favicon.ico', category: 'Video Production', link: 'https://obsproject.com' },
        { name: 'ChatGPT', description: 'Free AI campaign copy writing', logo: 'https://openai.com/favicon.ico', category: 'Campaign Copy', link: 'https://chat.openai.com' },
        { name: 'Mailchimp', description: 'Free email marketing for backers', logo: 'https://mailchimp.com/favicon.ico', category: 'Backer Communication', link: 'https://mailchimp.com' },
        { name: 'Buffer', description: 'Free social media campaign scheduling', logo: 'https://buffer.com/favicon.ico', category: 'Promotion', link: 'https://buffer.com' },
        { name: 'Google Analytics', description: 'Free campaign traffic tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' }
    ],
    'webinar-production': [
        { name: 'Zoom Webinar', description: 'Free webinar hosting platform', logo: 'https://zoom.us/favicon.ico', category: 'Webinar Platform', link: 'https://zoom.us/webinar' },
        { name: 'YouTube Live', description: 'Free livestreaming platform', logo: 'https://www.youtube.com/favicon.ico', category: 'Webinar Platform', link: 'https://www.youtube.com/live' },
        { name: 'Google Forms', description: 'Free webinar registration forms', logo: 'https://forms.google.com/favicon.ico', category: 'Registration', link: 'https://forms.google.com' },
        { name: 'Eventbrite', description: 'Free webinar ticketing system', logo: 'https://www.eventbrite.com/favicon.ico', category: 'Registration', link: 'https://www.eventbrite.com' },
        { name: 'Canva', description: 'Free webinar slide design', logo: 'https://www.canva.com/favicon.ico', category: 'Presentation Design', link: 'https://www.canva.com' },
        { name: 'Google Slides', description: 'Free presentation software', logo: 'https://slides.google.com/favicon.ico', category: 'Presentation Design', link: 'https://slides.google.com' },
        { name: 'OBS Studio', description: 'Free broadcasting software', logo: 'https://obsproject.com/favicon.ico', category: 'Production', link: 'https://obsproject.com' },
        { name: 'StreamYard', description: 'Free live streaming studio', logo: 'https://streamyard.com/favicon.ico', category: 'Production', link: 'https://streamyard.com' },
        { name: 'Slido', description: 'Free Q&A and polling platform', logo: 'https://www.slido.com/favicon.ico', category: 'Audience Engagement', link: 'https://www.slido.com' },
        { name: 'Mentimeter', description: 'Free interactive presentations', logo: 'https://www.mentimeter.com/favicon.ico', category: 'Audience Engagement', link: 'https://www.mentimeter.com' },
        { name: 'Mailchimp', description: 'Free webinar email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Promotion', link: 'https://mailchimp.com' },
        { name: 'Google Analytics', description: 'Free webinar performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' }
    ],
    'social-media-contest': [
        { name: 'Google Forms', description: 'Free contest entry collection', logo: 'https://forms.google.com/favicon.ico', category: 'Contest Setup', link: 'https://forms.google.com' },
        { name: 'Gleam', description: 'Free contest and giveaway platform', logo: 'https://gleam.io/favicon.ico', category: 'Contest Setup', link: 'https://gleam.io' },
        { name: 'Canva', description: 'Free contest graphics creation', logo: 'https://www.canva.com/favicon.ico', category: 'Contest Design', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced image editing', logo: 'https://www.gimp.org/favicon.ico', category: 'Contest Design', link: 'https://www.gimp.org' },
        { name: 'ChatGPT', description: 'Free AI contest copy writing', logo: 'https://openai.com/favicon.ico', category: 'Contest Copy', link: 'https://chat.openai.com' },
        { name: 'Instagram', description: 'Free visual contest platform', logo: 'https://www.instagram.com/favicon.ico', category: 'Contest Platform', link: 'https://www.instagram.com' },
        { name: 'Twitter', description: 'Free hashtag contest platform', logo: 'https://twitter.com/favicon.ico', category: 'Contest Platform', link: 'https://twitter.com' },
        { name: 'Facebook', description: 'Free social contest platform', logo: 'https://www.facebook.com/favicon.ico', category: 'Contest Platform', link: 'https://www.facebook.com' },
        { name: 'Random.org', description: 'Free random winner picker', logo: 'https://www.random.org/favicon.ico', category: 'Winner Selection', link: 'https://www.random.org' },
        { name: 'Google Sheets', description: 'Free entry tracking and management', logo: 'https://sheets.google.com/favicon.ico', category: 'Contest Management', link: 'https://sheets.google.com' },
        { name: 'Buffer', description: 'Free contest promotion scheduling', logo: 'https://buffer.com/favicon.ico', category: 'Promotion', link: 'https://buffer.com' },
        { name: 'Google Analytics', description: 'Free contest traffic tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' }
    ],
    'niche-blog-creation': [
        { name: 'Google Trends', description: 'Free niche research and validation', logo: 'https://trends.google.com/favicon.ico', category: 'Niche Research', link: 'https://trends.google.com' },
        { name: 'Google Keyword Planner', description: 'Free keyword research for blog', logo: 'https://ads.google.com/favicon.ico', category: 'Niche Research', link: 'https://ads.google.com/home/tools/keyword-planner' },
        { name: 'WordPress.com', description: 'Free blog hosting platform', logo: 'https://wordpress.com/favicon.ico', category: 'Blog Platform', link: 'https://wordpress.com' },
        { name: 'Blogger', description: 'Free Google blogging platform', logo: 'https://www.blogger.com/favicon.ico', category: 'Blog Platform', link: 'https://www.blogger.com' },
        { name: 'Canva', description: 'Free blog graphics creation', logo: 'https://www.canva.com/favicon.ico', category: 'Visual Content', link: 'https://www.canva.com' },
        { name: 'Unsplash', description: 'Free high-quality stock photos', logo: 'https://unsplash.com/favicon.ico', category: 'Visual Content', link: 'https://unsplash.com' },
        { name: 'ChatGPT', description: 'Free AI blog content assistance', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Grammarly', description: 'Free writing enhancement tool', logo: 'https://www.grammarly.com/favicon.ico', category: 'Content Creation', link: 'https://www.grammarly.com' },
        { name: 'Yoast SEO', description: 'Free WordPress SEO plugin', logo: 'https://yoast.com/favicon.ico', category: 'SEO', link: 'https://yoast.com' },
        { name: 'Google Search Console', description: 'Free blog SEO monitoring', logo: 'https://search.google.com/favicon.ico', category: 'SEO', link: 'https://search.google.com/search-console' },
        { name: 'Buffer', description: 'Free blog promotion scheduling', logo: 'https://buffer.com/favicon.ico', category: 'Promotion', link: 'https://buffer.com' },
        { name: 'Google Analytics', description: 'Free blog traffic analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' }
    ],
    'ai-saas-development': [
        { name: 'Google Trends', description: 'Free market research and SaaS idea validation', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'SurveyMonkey', description: 'Free customer validation surveys', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Market Research', link: 'https://www.surveymonkey.com' },
        { name: 'Figma', description: 'Free UI/UX design and prototyping', logo: 'https://www.figma.com/favicon.ico', category: 'Design & Planning', link: 'https://www.figma.com' },
        { name: 'Notion', description: 'Free project planning and documentation', logo: 'https://www.notion.so/favicon.ico', category: 'Design & Planning', link: 'https://www.notion.so' },
        { name: 'VS Code', description: 'Free development environment', logo: 'https://code.visualstudio.com/favicon.ico', category: 'Development', link: 'https://code.visualstudio.com' },
        { name: 'GitHub', description: 'Free code repository and version control', logo: 'https://github.com/favicon.ico', category: 'Development', link: 'https://github.com' },
        { name: 'Supabase', description: 'Free backend-as-a-service platform', logo: 'https://supabase.com/favicon.ico', category: 'Backend Services', link: 'https://supabase.com' },
        { name: 'Firebase', description: 'Free Google backend services', logo: 'https://firebase.google.com/favicon.ico', category: 'Backend Services', link: 'https://firebase.google.com' },
        { name: 'OpenAI API', description: 'Free tier AI model integration', logo: 'https://openai.com/favicon.ico', category: 'AI Integration', link: 'https://openai.com/api' },
        { name: 'Hugging Face', description: 'Free AI model hosting and APIs', logo: 'https://huggingface.co/favicon.ico', category: 'AI Integration', link: 'https://huggingface.co' },
        { name: 'Vercel', description: 'Free SaaS hosting and deployment', logo: 'https://vercel.com/favicon.ico', category: 'Deployment', link: 'https://vercel.com' },
        { name: 'Netlify', description: 'Free web application hosting', logo: 'https://www.netlify.com/favicon.ico', category: 'Deployment', link: 'https://www.netlify.com' },
        { name: 'Google Analytics', description: 'Free SaaS usage analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics & Monitoring', link: 'https://analytics.google.com' }
    ],
    'automated-trading-bot': [
        { name: 'TradingView', description: 'Free market analysis and charting', logo: 'https://www.tradingview.com/favicon.ico', category: 'Market Research', link: 'https://www.tradingview.com' },
        { name: 'Yahoo Finance', description: 'Free financial data and market news', logo: 'https://finance.yahoo.com/favicon.ico', category: 'Market Research', link: 'https://finance.yahoo.com' },
        { name: 'Python', description: 'Free programming language for trading bots', logo: 'https://www.python.org/favicon.ico', category: 'Development', link: 'https://www.python.org' },
        { name: 'VS Code', description: 'Free development environment', logo: 'https://code.visualstudio.com/favicon.ico', category: 'Development', link: 'https://code.visualstudio.com' },
        { name: 'GitHub', description: 'Free code repository and version control', logo: 'https://github.com/favicon.ico', category: 'Development', link: 'https://github.com' },
        { name: 'Binance API', description: 'Free cryptocurrency trading API', logo: 'https://www.binance.com/favicon.ico', category: 'Trading APIs', link: 'https://www.binance.com/en/binance-api' },
        { name: 'Coinbase Pro API', description: 'Free crypto exchange API', logo: 'https://pro.coinbase.com/favicon.ico', category: 'Trading APIs', link: 'https://pro.coinbase.com' },
        { name: 'Alpha Vantage', description: 'Free stock market API', logo: 'https://www.alphavantage.co/favicon.ico', category: 'Market Data APIs', link: 'https://www.alphavantage.co' },
        { name: 'IEX Cloud', description: 'Free financial data API', logo: 'https://iexcloud.io/favicon.ico', category: 'Market Data APIs', link: 'https://iexcloud.io' },
        { name: 'Jupyter Notebook', description: 'Free strategy development environment', logo: 'https://jupyter.org/favicon.ico', category: 'Strategy Development', link: 'https://jupyter.org' },
        { name: 'Google Colab', description: 'Free cloud-based Python environment', logo: 'https://colab.research.google.com/favicon.ico', category: 'Strategy Development', link: 'https://colab.research.google.com' },
        { name: 'Heroku', description: 'Free bot hosting platform', logo: 'https://www.heroku.com/favicon.ico', category: 'Bot Deployment', link: 'https://www.heroku.com' },
        { name: 'PythonAnywhere', description: 'Free Python hosting service', logo: 'https://www.pythonanywhere.com/favicon.ico', category: 'Bot Deployment', link: 'https://www.pythonanywhere.com' }
    ],
    'ai-content-agency': [
        { name: 'Google Trends', description: 'Free content trend research', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'LinkedIn', description: 'Free client prospecting and networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Client Acquisition', link: 'https://www.linkedin.com' },
        { name: 'Google Forms', description: 'Free client intake and project forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Acquisition', link: 'https://forms.google.com' },
        { name: 'Calendly', description: 'Free client meeting scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Client Management', link: 'https://calendly.com' },
        { name: 'HubSpot CRM', description: 'Free client relationship management', logo: 'https://www.hubspot.com/favicon.ico', category: 'Client Management', link: 'https://www.hubspot.com/products/crm' },
        { name: 'ChatGPT', description: 'Free AI content generation', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Claude', description: 'Free AI writing assistant', logo: 'https://claude.ai/favicon.ico', category: 'Content Creation', link: 'https://claude.ai' },
        { name: 'Grammarly', description: 'Free content editing and proofreading', logo: 'https://www.grammarly.com/favicon.ico', category: 'Content Editing', link: 'https://www.grammarly.com' },
        { name: 'Hemingway Editor', description: 'Free readability improvement tool', logo: 'https://hemingwayapp.com/favicon.ico', category: 'Content Editing', link: 'https://hemingwayapp.com' },
        { name: 'Canva', description: 'Free visual content creation', logo: 'https://www.canva.com/favicon.ico', category: 'Visual Content', link: 'https://www.canva.com' },
        { name: 'Unsplash', description: 'Free high-quality stock photos', logo: 'https://unsplash.com/favicon.ico', category: 'Visual Content', link: 'https://unsplash.com' },
        { name: 'Trello', description: 'Free project management for clients', logo: 'https://trello.com/favicon.ico', category: 'Project Management', link: 'https://trello.com' },
        { name: 'Wave', description: 'Free invoicing and accounting', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' }
    ],
    'ai-chatbot-business': [
        { name: 'Google Trends', description: 'Free chatbot market research', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'LinkedIn', description: 'Free client prospecting for chatbot services', logo: 'https://www.linkedin.com/favicon.ico', category: 'Client Acquisition', link: 'https://www.linkedin.com' },
        { name: 'Chatfuel', description: 'Free chatbot builder for Facebook', logo: 'https://chatfuel.com/favicon.ico', category: 'Chatbot Development', link: 'https://chatfuel.com' },
        { name: 'ManyChat', description: 'Free messenger marketing platform', logo: 'https://manychat.com/favicon.ico', category: 'Chatbot Development', link: 'https://manychat.com' },
        { name: 'Botpress', description: 'Free open-source chatbot platform', logo: 'https://botpress.com/favicon.ico', category: 'Chatbot Development', link: 'https://botpress.com' },
        { name: 'Rasa Open Source', description: 'Free conversational AI framework', logo: 'https://rasa.com/favicon.ico', category: 'Advanced Chatbots', link: 'https://rasa.com' },
        { name: 'Dialogflow', description: 'Free Google conversational AI platform', logo: 'https://cloud.google.com/favicon.ico', category: 'Advanced Chatbots', link: 'https://cloud.google.com/dialogflow' },
        { name: 'OpenAI API', description: 'Free tier for AI chatbot integration', logo: 'https://openai.com/favicon.ico', category: 'AI Integration', link: 'https://openai.com/api' },
        { name: 'Hugging Face', description: 'Free AI model hosting for chatbots', logo: 'https://huggingface.co/favicon.ico', category: 'AI Integration', link: 'https://huggingface.co' },
        { name: 'GitHub', description: 'Free code repository for chatbot projects', logo: 'https://github.com/favicon.ico', category: 'Development Tools', link: 'https://github.com' },
        { name: 'VS Code', description: 'Free development environment', logo: 'https://code.visualstudio.com/favicon.ico', category: 'Development Tools', link: 'https://code.visualstudio.com' },
        { name: 'Heroku', description: 'Free chatbot hosting platform', logo: 'https://www.heroku.com/favicon.ico', category: 'Deployment', link: 'https://www.heroku.com' },
        { name: 'Wave', description: 'Free invoicing for chatbot services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Management', link: 'https://www.waveapps.com' }
    ],
    'ai-video-automation': [
        { name: 'Google Trends', description: 'Free video content trend research', logo: 'https://trends.google.com/favicon.ico', category: 'Content Research', link: 'https://trends.google.com' },
        { name: 'YouTube Keyword Tool', description: 'Free video keyword research', logo: 'https://keywordtool.io/favicon.ico', category: 'Content Research', link: 'https://keywordtool.io/youtube' },
        { name: 'ChatGPT', description: 'Free AI script and content generation', logo: 'https://openai.com/favicon.ico', category: 'Script Writing', link: 'https://chat.openai.com' },
        { name: 'Google Docs', description: 'Free collaborative script writing', logo: 'https://docs.google.com/favicon.ico', category: 'Script Writing', link: 'https://docs.google.com' },
        { name: 'Runway ML', description: 'Free AI video generation tools', logo: 'https://runwayml.com/favicon.ico', category: 'AI Video Tools', link: 'https://runwayml.com' },
        { name: 'Stable Video Diffusion', description: 'Free AI video generation model', logo: 'https://stability.ai/favicon.ico', category: 'AI Video Tools', link: 'https://stability.ai' },
        { name: 'DaVinci Resolve', description: 'Free professional video editing', logo: 'https://www.blackmagicdesign.com/favicon.ico', category: 'Video Editing', link: 'https://www.blackmagicdesign.com/products/davinciresolve' },
        { name: 'OpenShot', description: 'Free open-source video editor', logo: 'https://www.openshot.org/favicon.ico', category: 'Video Editing', link: 'https://www.openshot.org' },
        { name: 'ElevenLabs', description: 'Free AI voice generation', logo: 'https://elevenlabs.io/favicon.ico', category: 'AI Voice & Audio', link: 'https://elevenlabs.io' },
        { name: 'Murf', description: 'Free AI voiceover generation', logo: 'https://murf.ai/favicon.ico', category: 'AI Voice & Audio', link: 'https://murf.ai' },
        { name: 'Python', description: 'Free automation scripting language', logo: 'https://www.python.org/favicon.ico', category: 'Automation Tools', link: 'https://www.python.org' },
        { name: 'GitHub Actions', description: 'Free workflow automation', logo: 'https://github.com/favicon.ico', category: 'Automation Tools', link: 'https://github.com/features/actions' },
        { name: 'YouTube', description: 'Free video hosting and distribution', logo: 'https://www.youtube.com/favicon.ico', category: 'Video Distribution', link: 'https://www.youtube.com' }
    ],
    'ecommerce-store-setup': [
        { name: 'Google Trends', description: 'Free market research for product validation', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'SurveyMonkey', description: 'Free customer surveys and feedback', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Market Research', link: 'https://www.surveymonkey.com' },
        { name: 'WooCommerce', description: 'Free WordPress e-commerce plugin', logo: 'https://woocommerce.com/favicon.ico', category: 'Store Platform', link: 'https://woocommerce.com' },
        { name: 'Shopify', description: 'Free trial e-commerce platform', logo: 'https://www.shopify.com/favicon.ico', category: 'Store Platform', link: 'https://www.shopify.com' },
        { name: 'Square Online', description: 'Free e-commerce website builder', logo: 'https://squareup.com/favicon.ico', category: 'Store Platform', link: 'https://squareup.com/us/en/online-store' },
        { name: 'Canva', description: 'Free product images and store graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Product Design', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced image editing', logo: 'https://www.gimp.org/favicon.ico', category: 'Product Design', link: 'https://www.gimp.org' },
        { name: 'Unsplash', description: 'Free high-quality product photos', logo: 'https://unsplash.com/favicon.ico', category: 'Product Design', link: 'https://unsplash.com' },
        { name: 'Google My Business', description: 'Free local business listing', logo: 'https://business.google.com/favicon.ico', category: 'Store Marketing', link: 'https://business.google.com' },
        { name: 'Facebook Business', description: 'Free social media marketing', logo: 'https://business.facebook.com/favicon.ico', category: 'Store Marketing', link: 'https://business.facebook.com' },
        { name: 'Mailchimp', description: 'Free email marketing for customers', logo: 'https://mailchimp.com/favicon.ico', category: 'Customer Management', link: 'https://mailchimp.com' },
        { name: 'Google Analytics', description: 'Free store performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' },
        { name: 'Google Search Console', description: 'Free SEO monitoring for store', logo: 'https://search.google.com/favicon.ico', category: 'SEO & Optimization', link: 'https://search.google.com/search-console' }
    ],
    'podcast-production': [
        { name: 'Google Trends', description: 'Free podcast topic research', logo: 'https://trends.google.com/favicon.ico', category: 'Content Planning', link: 'https://trends.google.com' },
        { name: 'ChatGPT', description: 'Free AI podcast script writing', logo: 'https://openai.com/favicon.ico', category: 'Content Planning', link: 'https://chat.openai.com' },
        { name: 'Google Docs', description: 'Free collaborative script writing', logo: 'https://docs.google.com/favicon.ico', category: 'Content Planning', link: 'https://docs.google.com' },
        { name: 'Audacity', description: 'Free audio recording and editing', logo: 'https://www.audacityteam.org/favicon.ico', category: 'Audio Recording', link: 'https://www.audacityteam.org' },
        { name: 'GarageBand', description: 'Free Mac audio production software', logo: 'https://www.apple.com/favicon.ico', category: 'Audio Recording', link: 'https://www.apple.com/mac/garageband' },
        { name: 'Anchor', description: 'Free podcast hosting and distribution', logo: 'https://anchor.fm/favicon.ico', category: 'Podcast Hosting', link: 'https://anchor.fm' },
        { name: 'Spotify for Podcasters', description: 'Free podcast hosting platform', logo: 'https://podcasters.spotify.com/favicon.ico', category: 'Podcast Hosting', link: 'https://podcasters.spotify.com' },
        { name: 'Canva', description: 'Free podcast cover art design', logo: 'https://www.canva.com/favicon.ico', category: 'Visual Design', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced graphic design', logo: 'https://www.gimp.org/favicon.ico', category: 'Visual Design', link: 'https://www.gimp.org' },
        { name: 'Buffer', description: 'Free social media promotion', logo: 'https://buffer.com/favicon.ico', category: 'Promotion', link: 'https://buffer.com' },
        { name: 'Mailchimp', description: 'Free email marketing for listeners', logo: 'https://mailchimp.com/favicon.ico', category: 'Audience Building', link: 'https://mailchimp.com' },
        { name: 'Google Analytics', description: 'Free podcast performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' },
        { name: 'Otter.ai', description: 'Free AI transcription service', logo: 'https://otter.ai/favicon.ico', category: 'Post-Production', link: 'https://otter.ai' }
    ],
    'online-coaching-business': [
        { name: 'Google Trends', description: 'Free coaching niche research', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'LinkedIn', description: 'Free client prospecting and networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Client Acquisition', link: 'https://www.linkedin.com' },
        { name: 'Google Forms', description: 'Free client intake forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Acquisition', link: 'https://forms.google.com' },
        { name: 'Calendly', description: 'Free appointment scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Client Management', link: 'https://calendly.com' },
        { name: 'Zoom', description: 'Free video coaching sessions', logo: 'https://zoom.us/favicon.ico', category: 'Coaching Delivery', link: 'https://zoom.us' },
        { name: 'Google Meet', description: 'Free video conferencing', logo: 'https://meet.google.com/favicon.ico', category: 'Coaching Delivery', link: 'https://meet.google.com' },
        { name: 'Notion', description: 'Free client progress tracking', logo: 'https://www.notion.so/favicon.ico', category: 'Client Management', link: 'https://www.notion.so' },
        { name: 'Trello', description: 'Free coaching program management', logo: 'https://trello.com/favicon.ico', category: 'Program Management', link: 'https://trello.com' },
        { name: 'Canva', description: 'Free coaching materials design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Docs', description: 'Free coaching resources creation', logo: 'https://docs.google.com/favicon.ico', category: 'Content Creation', link: 'https://docs.google.com' },
        { name: 'Wave', description: 'Free invoicing and payments', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Mailchimp', description: 'Free email marketing for leads', logo: 'https://mailchimp.com/favicon.ico', category: 'Marketing', link: 'https://mailchimp.com' },
        { name: 'Google Analytics', description: 'Free website and business analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' }
    ],
    'digital-product-launch': [
        { name: 'Google Trends', description: 'Free product market validation', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'SurveyMonkey', description: 'Free audience research surveys', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Market Research', link: 'https://www.surveymonkey.com' },
        { name: 'Canva', description: 'Free product design and graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Product Design', link: 'https://www.canva.com' },
        { name: 'Figma', description: 'Free UI/UX design for digital products', logo: 'https://www.figma.com/favicon.ico', category: 'Product Design', link: 'https://www.figma.com' },
        { name: 'Notion', description: 'Free product development planning', logo: 'https://www.notion.so/favicon.ico', category: 'Product Development', link: 'https://www.notion.so' },
        { name: 'GitHub', description: 'Free code repository and collaboration', logo: 'https://github.com/favicon.ico', category: 'Product Development', link: 'https://github.com' },
        { name: 'Mailchimp', description: 'Free email marketing for launch', logo: 'https://mailchimp.com/favicon.ico', category: 'Launch Marketing', link: 'https://mailchimp.com' },
        { name: 'Buffer', description: 'Free social media launch campaign', logo: 'https://buffer.com/favicon.ico', category: 'Launch Marketing', link: 'https://buffer.com' },
        { name: 'Product Hunt', description: 'Free product launch platform', logo: 'https://www.producthunt.com/favicon.ico', category: 'Launch Platforms', link: 'https://www.producthunt.com' },
        { name: 'Gumroad', description: 'Free digital product selling platform', logo: 'https://gumroad.com/favicon.ico', category: 'Sales Platform', link: 'https://gumroad.com' },
        { name: 'Google Analytics', description: 'Free launch performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' },
        { name: 'Hotjar', description: 'Free user behavior analytics', logo: 'https://www.hotjar.com/favicon.ico', category: 'User Analytics', link: 'https://www.hotjar.com' },
        { name: 'Typeform', description: 'Free customer feedback collection', logo: 'https://www.typeform.com/favicon.ico', category: 'Customer Feedback', link: 'https://www.typeform.com' }
    ],
    'social-media-management-agency': [
        { name: 'Google Trends', description: 'Free social media trend research', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'LinkedIn', description: 'Free client prospecting platform', logo: 'https://www.linkedin.com/favicon.ico', category: 'Client Acquisition', link: 'https://www.linkedin.com' },
        { name: 'Google Forms', description: 'Free client onboarding forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Acquisition', link: 'https://forms.google.com' },
        { name: 'HubSpot CRM', description: 'Free client relationship management', logo: 'https://www.hubspot.com/favicon.ico', category: 'Client Management', link: 'https://www.hubspot.com/products/crm' },
        { name: 'Canva', description: 'Free social media content design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'ChatGPT', description: 'Free AI content and caption writing', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Unsplash', description: 'Free high-quality stock photos', logo: 'https://unsplash.com/favicon.ico', category: 'Content Creation', link: 'https://unsplash.com' },
        { name: 'Buffer', description: 'Free social media scheduling', logo: 'https://buffer.com/favicon.ico', category: 'Content Management', link: 'https://buffer.com' },
        { name: 'Hootsuite', description: 'Free social media management', logo: 'https://hootsuite.com/favicon.ico', category: 'Content Management', link: 'https://hootsuite.com' },
        { name: 'Facebook Creator Studio', description: 'Free Facebook and Instagram management', logo: 'https://business.facebook.com/favicon.ico', category: 'Platform Management', link: 'https://business.facebook.com/creatorstudio' },
        { name: 'Google Analytics', description: 'Free social media traffic tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics & Reporting', link: 'https://analytics.google.com' },
        { name: 'Wave', description: 'Free invoicing and accounting', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Trello', description: 'Free project management for clients', logo: 'https://trello.com/favicon.ico', category: 'Project Management', link: 'https://trello.com' }
    ],
    'affiliate-marketing-mastery': [
        { name: 'Google Trends', description: 'Free market and niche research', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'ClickBank', description: 'Free affiliate marketplace', logo: 'https://www.clickbank.com/favicon.ico', category: 'Affiliate Networks', link: 'https://www.clickbank.com' },
        { name: 'Amazon Associates', description: 'Free Amazon affiliate program', logo: 'https://affiliate-program.amazon.com/favicon.ico', category: 'Affiliate Networks', link: 'https://affiliate-program.amazon.com' },
        { name: 'ShareASale', description: 'Free affiliate network platform', logo: 'https://www.shareasale.com/favicon.ico', category: 'Affiliate Networks', link: 'https://www.shareasale.com' },
        { name: 'WordPress.com', description: 'Free website and blog creation', logo: 'https://wordpress.com/favicon.ico', category: 'Website Creation', link: 'https://wordpress.com' },
        { name: 'Wix', description: 'Free website builder', logo: 'https://www.wix.com/favicon.ico', category: 'Website Creation', link: 'https://www.wix.com' },
        { name: 'Canva', description: 'Free affiliate marketing graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'ChatGPT', description: 'Free AI content and review writing', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'YouTube', description: 'Free video marketing platform', logo: 'https://www.youtube.com/favicon.ico', category: 'Traffic Generation', link: 'https://www.youtube.com' },
        { name: 'Pinterest', description: 'Free visual marketing platform', logo: 'https://www.pinterest.com/favicon.ico', category: 'Traffic Generation', link: 'https://www.pinterest.com' },
        { name: 'Google Analytics', description: 'Free traffic and conversion tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics & Tracking', link: 'https://analytics.google.com' },
        { name: 'Bitly', description: 'Free link tracking and management', logo: 'https://bitly.com/favicon.ico', category: 'Analytics & Tracking', link: 'https://bitly.com' },
        { name: 'Mailchimp', description: 'Free email marketing for affiliates', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],
    'online-course-creation': [
        { name: 'Google Trends', description: 'Free course topic validation', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'SurveyMonkey', description: 'Free audience research surveys', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Market Research', link: 'https://www.surveymonkey.com' },
        { name: 'Canva', description: 'Free course graphics and presentations', logo: 'https://www.canva.com/favicon.ico', category: 'Course Design', link: 'https://www.canva.com' },
        { name: 'Google Slides', description: 'Free presentation creation', logo: 'https://slides.google.com/favicon.ico', category: 'Course Design', link: 'https://slides.google.com' },
        { name: 'OBS Studio', description: 'Free screen recording software', logo: 'https://obsproject.com/favicon.ico', category: 'Video Production', link: 'https://obsproject.com' },
        { name: 'DaVinci Resolve', description: 'Free professional video editing', logo: 'https://www.blackmagicdesign.com/favicon.ico', category: 'Video Production', link: 'https://www.blackmagicdesign.com/products/davinciresolve' },
        { name: 'Audacity', description: 'Free audio recording and editing', logo: 'https://www.audacityteam.org/favicon.ico', category: 'Audio Production', link: 'https://www.audacityteam.org' },
        { name: 'Teachable', description: 'Free course hosting platform', logo: 'https://teachable.com/favicon.ico', category: 'Course Platform', link: 'https://teachable.com' },
        { name: 'Thinkific', description: 'Free online course platform', logo: 'https://www.thinkific.com/favicon.ico', category: 'Course Platform', link: 'https://www.thinkific.com' },
        { name: 'YouTube', description: 'Free course video hosting', logo: 'https://www.youtube.com/favicon.ico', category: 'Content Hosting', link: 'https://www.youtube.com' },
        { name: 'Mailchimp', description: 'Free student email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Student Engagement', link: 'https://mailchimp.com' },
        { name: 'Google Analytics', description: 'Free course performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' },
        { name: 'ChatGPT', description: 'Free AI course content creation', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' }
    ],
    'email-marketing-automation': [
        { name: 'Mailchimp', description: 'Free email marketing platform', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Platform', link: 'https://mailchimp.com' },
        { name: 'Sendinblue', description: 'Free email automation service', logo: 'https://www.sendinblue.com/favicon.ico', category: 'Email Platform', link: 'https://www.sendinblue.com' },
        { name: 'MailerLite', description: 'Free email marketing automation', logo: 'https://www.mailerlite.com/favicon.ico', category: 'Email Platform', link: 'https://www.mailerlite.com' },
        { name: 'Google Forms', description: 'Free lead capture forms', logo: 'https://forms.google.com/favicon.ico', category: 'Lead Generation', link: 'https://forms.google.com' },
        { name: 'Typeform', description: 'Free interactive lead forms', logo: 'https://www.typeform.com/favicon.ico', category: 'Lead Generation', link: 'https://www.typeform.com' },
        { name: 'ChatGPT', description: 'Free AI email content writing', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free email template design', logo: 'https://www.canva.com/favicon.ico', category: 'Email Design', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced email graphics', logo: 'https://www.gimp.org/favicon.ico', category: 'Email Design', link: 'https://www.gimp.org' },
        { name: 'Google Sheets', description: 'Free subscriber list management', logo: 'https://sheets.google.com/favicon.ico', category: 'List Management', link: 'https://sheets.google.com' },
        { name: 'Zapier', description: 'Free basic automation workflows', logo: 'https://zapier.com/favicon.ico', category: 'Automation', link: 'https://zapier.com' },
        { name: 'Google Analytics', description: 'Free email campaign tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp Reports', description: 'Free email performance analytics', logo: 'https://mailchimp.com/favicon.ico', category: 'Analytics', link: 'https://mailchimp.com/features/email-marketing-analytics' },
        { name: 'A/B Testing Tools', description: 'Free email split testing', logo: 'https://www.mailerlite.com/favicon.ico', category: 'Optimization', link: 'https://www.mailerlite.com' }
    ],
    'seo-agency-business': [
        { name: 'Google Trends', description: 'Free SEO market research', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'LinkedIn', description: 'Free client prospecting platform', logo: 'https://www.linkedin.com/favicon.ico', category: 'Client Acquisition', link: 'https://www.linkedin.com' },
        { name: 'Google Forms', description: 'Free SEO audit forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Acquisition', link: 'https://forms.google.com' },
        { name: 'Google Keyword Planner', description: 'Free keyword research tool', logo: 'https://ads.google.com/favicon.ico', category: 'SEO Tools', link: 'https://ads.google.com/home/tools/keyword-planner' },
        { name: 'Google Search Console', description: 'Free SEO monitoring and analysis', logo: 'https://search.google.com/favicon.ico', category: 'SEO Tools', link: 'https://search.google.com/search-console' },
        { name: 'Google Analytics', description: 'Free website traffic analysis', logo: 'https://analytics.google.com/favicon.ico', category: 'SEO Tools', link: 'https://analytics.google.com' },
        { name: 'Ubersuggest', description: 'Free SEO and keyword tool', logo: 'https://neilpatel.com/favicon.ico', category: 'SEO Tools', link: 'https://neilpatel.com/ubersuggest' },
        { name: 'ChatGPT', description: 'Free AI SEO content creation', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Google Docs', description: 'Free SEO strategy documentation', logo: 'https://docs.google.com/favicon.ico', category: 'Project Management', link: 'https://docs.google.com' },
        { name: 'Trello', description: 'Free SEO project management', logo: 'https://trello.com/favicon.ico', category: 'Project Management', link: 'https://trello.com' },
        { name: 'Wave', description: 'Free invoicing for SEO services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Data Studio', description: 'Free SEO reporting dashboards', logo: 'https://datastudio.google.com/favicon.ico', category: 'Reporting', link: 'https://datastudio.google.com' },
        { name: 'Screaming Frog', description: 'Free SEO website crawler', logo: 'https://www.screamingfrog.co.uk/favicon.ico', category: 'Technical SEO', link: 'https://www.screamingfrog.co.uk/seo-spider' }
    ],
    'content-creator-monetization': [
        { name: 'Google Trends', description: 'Free content trend research', logo: 'https://trends.google.com/favicon.ico', category: 'Content Strategy', link: 'https://trends.google.com' },
        { name: 'YouTube', description: 'Free video monetization platform', logo: 'https://www.youtube.com/favicon.ico', category: 'Content Platforms', link: 'https://www.youtube.com' },
        { name: 'TikTok', description: 'Free short-form video platform', logo: 'https://www.tiktok.com/favicon.ico', category: 'Content Platforms', link: 'https://www.tiktok.com' },
        { name: 'Instagram', description: 'Free visual content platform', logo: 'https://www.instagram.com/favicon.ico', category: 'Content Platforms', link: 'https://www.instagram.com' },
        { name: 'Canva', description: 'Free content design and graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'ChatGPT', description: 'Free AI content generation', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'OBS Studio', description: 'Free streaming and recording', logo: 'https://obsproject.com/favicon.ico', category: 'Content Creation', link: 'https://obsproject.com' },
        { name: 'Patreon', description: 'Free subscription monetization', logo: 'https://www.patreon.com/favicon.ico', category: 'Monetization', link: 'https://www.patreon.com' },
        { name: 'Ko-fi', description: 'Free tip and donation platform', logo: 'https://ko-fi.com/favicon.ico', category: 'Monetization', link: 'https://ko-fi.com' },
        { name: 'Gumroad', description: 'Free digital product sales', logo: 'https://gumroad.com/favicon.ico', category: 'Product Sales', link: 'https://gumroad.com' },
        { name: 'Mailchimp', description: 'Free fan email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Audience Building', link: 'https://mailchimp.com' },
        { name: 'Google Analytics', description: 'Free content performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' },
        { name: 'Buffer', description: 'Free social media scheduling', logo: 'https://buffer.com/favicon.ico', category: 'Content Distribution', link: 'https://buffer.com' }
    ],
    'dropshipping-empire': [
        { name: 'Google Trends', description: 'Free product trend research', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'AliExpress', description: 'Free supplier marketplace', logo: 'https://www.aliexpress.com/favicon.ico', category: 'Product Sourcing', link: 'https://www.aliexpress.com' },
        { name: 'Oberlo', description: 'Free dropshipping app for Shopify', logo: 'https://www.oberlo.com/favicon.ico', category: 'Product Sourcing', link: 'https://www.oberlo.com' },
        { name: 'Shopify', description: 'Free trial e-commerce platform', logo: 'https://www.shopify.com/favicon.ico', category: 'Store Platform', link: 'https://www.shopify.com' },
        { name: 'WooCommerce', description: 'Free WordPress e-commerce plugin', logo: 'https://woocommerce.com/favicon.ico', category: 'Store Platform', link: 'https://woocommerce.com' },
        { name: 'Canva', description: 'Free product and ad graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing Design', link: 'https://www.canva.com' },
        { name: 'Facebook Ads Manager', description: 'Free ad platform setup', logo: 'https://www.facebook.com/favicon.ico', category: 'Advertising', link: 'https://www.facebook.com/business/ads' },
        { name: 'Google Ads', description: 'Free Google advertising platform', logo: 'https://ads.google.com/favicon.ico', category: 'Advertising', link: 'https://ads.google.com' },
        { name: 'ChatGPT', description: 'Free AI product descriptions', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Mailchimp', description: 'Free email marketing for customers', logo: 'https://mailchimp.com/favicon.ico', category: 'Customer Retention', link: 'https://mailchimp.com' },
        { name: 'Google Analytics', description: 'Free store performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' },
        { name: 'Hotjar', description: 'Free website heatmap analysis', logo: 'https://www.hotjar.com/favicon.ico', category: 'Conversion Optimization', link: 'https://www.hotjar.com' }
    ],
    'ai-consulting-business': [
        { name: 'LinkedIn', description: 'Free professional networking and lead generation', logo: 'https://www.linkedin.com/favicon.ico', category: 'Lead Generation', link: 'https://www.linkedin.com' },
        { name: 'Google Forms', description: 'Free client assessment forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Onboarding', link: 'https://forms.google.com' },
        { name: 'Calendly', description: 'Free appointment scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Client Management', link: 'https://calendly.com' },
        { name: 'Zoom', description: 'Free video consulting calls', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'ChatGPT', description: 'Free AI solution development', logo: 'https://openai.com/favicon.ico', category: 'AI Development', link: 'https://chat.openai.com' },
        { name: 'GitHub', description: 'Free code repository and collaboration', logo: 'https://github.com/favicon.ico', category: 'Project Management', link: 'https://github.com' },
        { name: 'Google Colab', description: 'Free AI model development environment', logo: 'https://colab.research.google.com/favicon.ico', category: 'AI Development', link: 'https://colab.research.google.com' },
        { name: 'Canva', description: 'Free presentation and proposal design', logo: 'https://www.canva.com/favicon.ico', category: 'Proposal Creation', link: 'https://www.canva.com' },
        { name: 'Google Docs', description: 'Free document collaboration', logo: 'https://docs.google.com/favicon.ico', category: 'Documentation', link: 'https://docs.google.com' },
        { name: 'Slack', description: 'Free team communication', logo: 'https://slack.com/favicon.ico', category: 'Team Collaboration', link: 'https://slack.com' },
        { name: 'Wave', description: 'Free invoicing and accounting', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Loom', description: 'Free video explanations and demos', logo: 'https://www.loom.com/favicon.ico', category: 'Client Communication', link: 'https://www.loom.com' }
    ],
    'virtual-assistant-agency': [
        { name: 'LinkedIn', description: 'Free VA recruitment and client acquisition', logo: 'https://www.linkedin.com/favicon.ico', category: 'Recruitment & Sales', link: 'https://www.linkedin.com' },
        { name: 'Upwork', description: 'Free freelancer marketplace', logo: 'https://www.upwork.com/favicon.ico', category: 'VA Recruitment', link: 'https://www.upwork.com' },
        { name: 'Fiverr', description: 'Free service marketplace', logo: 'https://www.fiverr.com/favicon.ico', category: 'Service Listing', link: 'https://www.fiverr.com' },
        { name: 'Slack', description: 'Free team communication platform', logo: 'https://slack.com/favicon.ico', category: 'Team Management', link: 'https://slack.com' },
        { name: 'Trello', description: 'Free project management for VA tasks', logo: 'https://trello.com/favicon.ico', category: 'Project Management', link: 'https://trello.com' },
        { name: 'Google Workspace', description: 'Free productivity suite for VAs', logo: 'https://workspace.google.com/favicon.ico', category: 'Productivity Tools', link: 'https://workspace.google.com' },
        { name: 'Zoom', description: 'Free video meetings with clients', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'Calendly', description: 'Free scheduling for VA services', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'ChatGPT', description: 'Free AI assistance for VA tasks', logo: 'https://openai.com/favicon.ico', category: 'AI Tools', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free design work for clients', logo: 'https://www.canva.com/favicon.ico', category: 'Design Services', link: 'https://www.canva.com' },
        { name: 'Wave', description: 'Free invoicing for VA services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Billing & Payments', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free performance tracking for clients', logo: 'https://analytics.google.com/favicon.ico', category: 'Client Reporting', link: 'https://analytics.google.com' }
    ],
    'print-on-demand-store': [
        { name: 'Printful', description: 'Free print-on-demand integration', logo: 'https://www.printful.com/favicon.ico', category: 'Print Services', link: 'https://www.printful.com' },
        { name: 'Printify', description: 'Free print-on-demand marketplace', logo: 'https://printify.com/favicon.ico', category: 'Print Services', link: 'https://printify.com' },
        { name: 'Canva', description: 'Free design creation for products', logo: 'https://www.canva.com/favicon.ico', category: 'Design Creation', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced graphic design', logo: 'https://www.gimp.org/favicon.ico', category: 'Design Creation', link: 'https://www.gimp.org' },
        { name: 'ChatGPT', description: 'Free AI design ideas and descriptions', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Etsy', description: 'Free marketplace for custom products', logo: 'https://www.etsy.com/favicon.ico', category: 'Sales Platform', link: 'https://www.etsy.com' },
        { name: 'Shopify', description: 'Free trial e-commerce platform', logo: 'https://www.shopify.com/favicon.ico', category: 'Sales Platform', link: 'https://www.shopify.com' },
        { name: 'Pinterest', description: 'Free visual marketing platform', logo: 'https://www.pinterest.com/favicon.ico', category: 'Marketing', link: 'https://www.pinterest.com' },
        { name: 'Instagram', description: 'Free social media marketing', logo: 'https://www.instagram.com/favicon.ico', category: 'Marketing', link: 'https://www.instagram.com' },
        { name: 'Google Trends', description: 'Free design trend research', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'Google Analytics', description: 'Free store performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free customer email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Customer Retention', link: 'https://mailchimp.com' }
    ],
    'freelance-writing-business': [
        { name: 'Upwork', description: 'Free freelance writing marketplace', logo: 'https://www.upwork.com/favicon.ico', category: 'Job Platforms', link: 'https://www.upwork.com' },
        { name: 'Fiverr', description: 'Free writing service marketplace', logo: 'https://www.fiverr.com/favicon.ico', category: 'Job Platforms', link: 'https://www.fiverr.com' },
        { name: 'Contently', description: 'Free content marketing platform', logo: 'https://contently.com/favicon.ico', category: 'Job Platforms', link: 'https://contently.com' },
        { name: 'ChatGPT', description: 'Free AI writing assistance and research', logo: 'https://openai.com/favicon.ico', category: 'Writing Tools', link: 'https://chat.openai.com' },
        { name: 'Grammarly', description: 'Free grammar and style checking', logo: 'https://www.grammarly.com/favicon.ico', category: 'Writing Tools', link: 'https://www.grammarly.com' },
        { name: 'Google Docs', description: 'Free document creation and collaboration', logo: 'https://docs.google.com/favicon.ico', category: 'Writing Tools', link: 'https://docs.google.com' },
        { name: 'Hemingway Editor', description: 'Free writing clarity tool', logo: 'https://hemingwayapp.com/favicon.ico', category: 'Writing Tools', link: 'https://hemingwayapp.com' },
        { name: 'LinkedIn', description: 'Free professional networking and client acquisition', logo: 'https://www.linkedin.com/favicon.ico', category: 'Client Acquisition', link: 'https://www.linkedin.com' },
        { name: 'Medium', description: 'Free writing platform for portfolio building', logo: 'https://medium.com/favicon.ico', category: 'Portfolio Building', link: 'https://medium.com' },
        { name: 'Google Drive', description: 'Free file storage and sharing', logo: 'https://drive.google.com/favicon.ico', category: 'File Management', link: 'https://drive.google.com' },
        { name: 'Wave', description: 'Free invoicing for writing services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Toggl', description: 'Free time tracking for projects', logo: 'https://toggl.com/favicon.ico', category: 'Time Management', link: 'https://toggl.com' }
    ],
    'real-estate-investment': [
        { name: 'Zillow', description: 'Free property research and analysis', logo: 'https://www.zillow.com/favicon.ico', category: 'Property Research', link: 'https://www.zillow.com' },
        { name: 'Realtor.com', description: 'Free property listings and market data', logo: 'https://www.realtor.com/favicon.ico', category: 'Property Research', link: 'https://www.realtor.com' },
        { name: 'BiggerPockets', description: 'Free real estate education and networking', logo: 'https://www.biggerpockets.com/favicon.ico', category: 'Education & Networking', link: 'https://www.biggerpockets.com' },
        { name: 'Google Sheets', description: 'Free investment analysis spreadsheets', logo: 'https://sheets.google.com/favicon.ico', category: 'Financial Analysis', link: 'https://sheets.google.com' },
        { name: 'ChatGPT', description: 'Free AI market analysis and research', logo: 'https://openai.com/favicon.ico', category: 'Market Analysis', link: 'https://chat.openai.com' },
        { name: 'Google Maps', description: 'Free neighborhood and location analysis', logo: 'https://maps.google.com/favicon.ico', category: 'Location Analysis', link: 'https://maps.google.com' },
        { name: 'Canva', description: 'Free property marketing materials', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing', link: 'https://www.canva.com' },
        { name: 'Facebook Marketplace', description: 'Free property marketing platform', logo: 'https://www.facebook.com/favicon.ico', category: 'Marketing', link: 'https://www.facebook.com/marketplace' },
        { name: 'Craigslist', description: 'Free rental and property listings', logo: 'https://craigslist.org/favicon.ico', category: 'Property Listings', link: 'https://craigslist.org' },
        { name: 'Google Analytics', description: 'Free website traffic analysis', logo: 'https://analytics.google.com/favicon.ico', category: 'Digital Marketing', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free investor email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Investor Relations', link: 'https://mailchimp.com' },
        { name: 'Wave', description: 'Free accounting for real estate business', logo: 'https://www.waveapps.com/favicon.ico', category: 'Financial Management', link: 'https://www.waveapps.com' }
    ],
    'stock-trading-bot': [
        { name: 'Python', description: 'Free programming language for trading bots', logo: 'https://www.python.org/favicon.ico', category: 'Development Tools', link: 'https://www.python.org' },
        { name: 'GitHub', description: 'Free code repository and version control', logo: 'https://github.com/favicon.ico', category: 'Development Tools', link: 'https://github.com' },
        { name: 'Google Colab', description: 'Free cloud-based development environment', logo: 'https://colab.research.google.com/favicon.ico', category: 'Development Environment', link: 'https://colab.research.google.com' },
        { name: 'Alpha Vantage', description: 'Free stock market API', logo: 'https://www.alphavantage.co/favicon.ico', category: 'Market Data', link: 'https://www.alphavantage.co' },
        { name: 'Yahoo Finance', description: 'Free financial data and APIs', logo: 'https://finance.yahoo.com/favicon.ico', category: 'Market Data', link: 'https://finance.yahoo.com' },
        { name: 'TradingView', description: 'Free charting and market analysis', logo: 'https://www.tradingview.com/favicon.ico', category: 'Technical Analysis', link: 'https://www.tradingview.com' },
        { name: 'ChatGPT', description: 'Free AI trading strategy development', logo: 'https://openai.com/favicon.ico', category: 'Strategy Development', link: 'https://chat.openai.com' },
        { name: 'Jupyter Notebook', description: 'Free data analysis and backtesting', logo: 'https://jupyter.org/favicon.ico', category: 'Backtesting', link: 'https://jupyter.org' },
        { name: 'Pandas', description: 'Free data manipulation library', logo: 'https://pandas.pydata.org/favicon.ico', category: 'Data Analysis', link: 'https://pandas.pydata.org' },
        { name: 'QuantConnect', description: 'Free algorithmic trading platform', logo: 'https://www.quantconnect.com/favicon.ico', category: 'Trading Platform', link: 'https://www.quantconnect.com' },
        { name: 'Discord', description: 'Free trading community and alerts', logo: 'https://discord.com/favicon.ico', category: 'Community', link: 'https://discord.com' },
        { name: 'Google Sheets', description: 'Free trading performance tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Performance Tracking', link: 'https://sheets.google.com' }
    ],
    'cryptocurrency-mining': [
        { name: 'NiceHash', description: 'Free mining software and marketplace', logo: 'https://www.nicehash.com/favicon.ico', category: 'Mining Software', link: 'https://www.nicehash.com' },
        { name: 'Minerstat', description: 'Free mining monitoring and management', logo: 'https://minerstat.com/favicon.ico', category: 'Mining Management', link: 'https://minerstat.com' },
        { name: 'WhatToMine', description: 'Free mining profitability calculator', logo: 'https://whattomine.com/favicon.ico', category: 'Profitability Analysis', link: 'https://whattomine.com' },
        { name: 'CoinMarketCap', description: 'Free cryptocurrency market data', logo: 'https://coinmarketcap.com/favicon.ico', category: 'Market Data', link: 'https://coinmarketcap.com' },
        { name: 'CoinGecko', description: 'Free crypto price tracking', logo: 'https://www.coingecko.com/favicon.ico', category: 'Market Data', link: 'https://www.coingecko.com' },
        { name: 'MSI Afterburner', description: 'Free GPU overclocking software', logo: 'https://www.msi.com/favicon.ico', category: 'Hardware Optimization', link: 'https://www.msi.com/Landing/afterburner' },
        { name: 'HWiNFO', description: 'Free hardware monitoring software', logo: 'https://www.hwinfo.com/favicon.ico', category: 'Hardware Monitoring', link: 'https://www.hwinfo.com' },
        { name: 'ChatGPT', description: 'Free AI mining optimization advice', logo: 'https://openai.com/favicon.ico', category: 'Optimization', link: 'https://chat.openai.com' },
        { name: 'Reddit', description: 'Free mining community and support', logo: 'https://www.reddit.com/favicon.ico', category: 'Community', link: 'https://www.reddit.com/r/gpumining' },
        { name: 'Discord', description: 'Free mining community and alerts', logo: 'https://discord.com/favicon.ico', category: 'Community', link: 'https://discord.com' },
        { name: 'Google Sheets', description: 'Free mining profitability tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Profit Tracking', link: 'https://sheets.google.com' },
        { name: 'Telegram', description: 'Free mining alerts and notifications', logo: 'https://telegram.org/favicon.ico', category: 'Alerts & Notifications', link: 'https://telegram.org' }
    ],
    'influencer-marketing': [
        { name: 'Instagram', description: 'Free influencer content platform', logo: 'https://www.instagram.com/favicon.ico', category: 'Content Platforms', link: 'https://www.instagram.com' },
        { name: 'TikTok', description: 'Free short-form video platform', logo: 'https://www.tiktok.com/favicon.ico', category: 'Content Platforms', link: 'https://www.tiktok.com' },
        { name: 'YouTube', description: 'Free video content monetization', logo: 'https://www.youtube.com/favicon.ico', category: 'Content Platforms', link: 'https://www.youtube.com' },
        { name: 'Twitter', description: 'Free social media engagement platform', logo: 'https://twitter.com/favicon.ico', category: 'Content Platforms', link: 'https://twitter.com' },
        { name: 'Canva', description: 'Free content design and graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'ChatGPT', description: 'Free AI content generation and captions', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Later', description: 'Free social media scheduling', logo: 'https://later.com/favicon.ico', category: 'Content Scheduling', link: 'https://later.com' },
        { name: 'Buffer', description: 'Free social media management', logo: 'https://buffer.com/favicon.ico', category: 'Content Scheduling', link: 'https://buffer.com' },
        { name: 'Google Analytics', description: 'Free audience and engagement tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' },
        { name: 'Linktree', description: 'Free bio link management', logo: 'https://linktr.ee/favicon.ico', category: 'Link Management', link: 'https://linktr.ee' },
        { name: 'Mailchimp', description: 'Free audience email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Audience Building', link: 'https://mailchimp.com' },
        { name: 'Google Trends', description: 'Free content trend research', logo: 'https://trends.google.com/favicon.ico', category: 'Trend Research', link: 'https://trends.google.com' }
    ],
    'digital-marketing-agency': [
        { name: 'Google Ads', description: 'Free advertising platform setup', logo: 'https://ads.google.com/favicon.ico', category: 'Paid Advertising', link: 'https://ads.google.com' },
        { name: 'Facebook Ads Manager', description: 'Free social media advertising', logo: 'https://www.facebook.com/favicon.ico', category: 'Paid Advertising', link: 'https://www.facebook.com/business/ads' },
        { name: 'LinkedIn', description: 'Free B2B lead generation and networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Lead Generation', link: 'https://www.linkedin.com' },
        { name: 'Google Analytics', description: 'Free website and campaign analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics & Reporting', link: 'https://analytics.google.com' },
        { name: 'Google Search Console', description: 'Free SEO monitoring and optimization', logo: 'https://search.google.com/favicon.ico', category: 'SEO Tools', link: 'https://search.google.com/search-console' },
        { name: 'Mailchimp', description: 'Free email marketing automation', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' },
        { name: 'Canva', description: 'Free marketing design and graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Creative Services', link: 'https://www.canva.com' },
        { name: 'ChatGPT', description: 'Free AI content creation and strategy', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Hootsuite', description: 'Free social media management', logo: 'https://hootsuite.com/favicon.ico', category: 'Social Media Management', link: 'https://hootsuite.com' },
        { name: 'Google Data Studio', description: 'Free client reporting dashboards', logo: 'https://datastudio.google.com/favicon.ico', category: 'Client Reporting', link: 'https://datastudio.google.com' },
        { name: 'Trello', description: 'Free project management for clients', logo: 'https://trello.com/favicon.ico', category: 'Project Management', link: 'https://trello.com' },
        { name: 'Wave', description: 'Free invoicing and client billing', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' }
    ],
    'saas-subscription-business': [
        { name: 'Google Trends', description: 'Free market research for SaaS ideas', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'SurveyMonkey', description: 'Free customer validation surveys', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Market Research', link: 'https://www.surveymonkey.com' },
        { name: 'GitHub', description: 'Free code repository and version control', logo: 'https://github.com/favicon.ico', category: 'Development', link: 'https://github.com' },
        { name: 'Heroku', description: 'Free cloud hosting platform', logo: 'https://www.heroku.com/favicon.ico', category: 'Development', link: 'https://www.heroku.com' },
        { name: 'Firebase', description: 'Free backend services by Google', logo: 'https://firebase.google.com/favicon.ico', category: 'Development', link: 'https://firebase.google.com' },
        { name: 'Canva', description: 'Free UI/UX design and marketing materials', logo: 'https://www.canva.com/favicon.ico', category: 'Design & Marketing', link: 'https://www.canva.com' },
        { name: 'Figma', description: 'Free collaborative design tool', logo: 'https://www.figma.com/favicon.ico', category: 'Design & Marketing', link: 'https://www.figma.com' },
        { name: 'Stripe', description: 'Free payment processing setup', logo: 'https://stripe.com/favicon.ico', category: 'Payment Processing', link: 'https://stripe.com' },
        { name: 'Mailchimp', description: 'Free email marketing for customers', logo: 'https://mailchimp.com/favicon.ico', category: 'Customer Engagement', link: 'https://mailchimp.com' },
        { name: 'Google Analytics', description: 'Free user behavior tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' },
        { name: 'Hotjar', description: 'Free user experience analytics', logo: 'https://www.hotjar.com/favicon.ico', category: 'Analytics', link: 'https://www.hotjar.com' },
        { name: 'ChatGPT', description: 'Free AI for feature development', logo: 'https://openai.com/favicon.ico', category: 'AI Integration', link: 'https://chat.openai.com' }
    ],
    'mobile-app-development': [
        { name: 'React Native', description: 'Free cross-platform mobile framework', logo: 'https://reactnative.dev/favicon.ico', category: 'Development Framework', link: 'https://reactnative.dev' },
        { name: 'Flutter', description: 'Free Google mobile development kit', logo: 'https://flutter.dev/favicon.ico', category: 'Development Framework', link: 'https://flutter.dev' },
        { name: 'Android Studio', description: 'Free Android development IDE', logo: 'https://developer.android.com/favicon.ico', category: 'Development Tools', link: 'https://developer.android.com/studio' },
        { name: 'Xcode', description: 'Free iOS development environment', logo: 'https://developer.apple.com/favicon.ico', category: 'Development Tools', link: 'https://developer.apple.com/xcode' },
        { name: 'GitHub', description: 'Free code repository and collaboration', logo: 'https://github.com/favicon.ico', category: 'Version Control', link: 'https://github.com' },
        { name: 'Figma', description: 'Free mobile app design tool', logo: 'https://www.figma.com/favicon.ico', category: 'UI/UX Design', link: 'https://www.figma.com' },
        { name: 'Canva', description: 'Free app store graphics and marketing', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing Design', link: 'https://www.canva.com' },
        { name: 'Firebase', description: 'Free backend and analytics', logo: 'https://firebase.google.com/favicon.ico', category: 'Backend Services', link: 'https://firebase.google.com' },
        { name: 'ChatGPT', description: 'Free AI for app feature development', logo: 'https://openai.com/favicon.ico', category: 'AI Integration', link: 'https://chat.openai.com' },
        { name: 'TestFlight', description: 'Free iOS app testing platform', logo: 'https://developer.apple.com/favicon.ico', category: 'Testing', link: 'https://developer.apple.com/testflight' },
        { name: 'Google Play Console', description: 'Free Android app publishing', logo: 'https://play.google.com/favicon.ico', category: 'App Distribution', link: 'https://play.google.com/console' },
        { name: 'App Store Connect', description: 'Free iOS app publishing', logo: 'https://developer.apple.com/favicon.ico', category: 'App Distribution', link: 'https://appstoreconnect.apple.com' }
    ],
    'youtube-automation': [
        { name: 'YouTube Studio', description: 'Free YouTube channel management', logo: 'https://studio.youtube.com/favicon.ico', category: 'Channel Management', link: 'https://studio.youtube.com' },
        { name: 'ChatGPT', description: 'Free AI script and content generation', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free thumbnail and graphics design', logo: 'https://www.canva.com/favicon.ico', category: 'Visual Content', link: 'https://www.canva.com' },
        { name: 'OBS Studio', description: 'Free screen recording and streaming', logo: 'https://obsproject.com/favicon.ico', category: 'Video Production', link: 'https://obsproject.com' },
        { name: 'DaVinci Resolve', description: 'Free professional video editing', logo: 'https://www.blackmagicdesign.com/favicon.ico', category: 'Video Editing', link: 'https://www.blackmagicdesign.com/products/davinciresolve' },
        { name: 'Audacity', description: 'Free audio editing and enhancement', logo: 'https://www.audacityteam.org/favicon.ico', category: 'Audio Production', link: 'https://www.audacityteam.org' },
        { name: 'TubeBuddy', description: 'Free YouTube optimization tools', logo: 'https://www.tubebuddy.com/favicon.ico', category: 'SEO & Optimization', link: 'https://www.tubebuddy.com' },
        { name: 'VidIQ', description: 'Free YouTube analytics and optimization', logo: 'https://vidiq.com/favicon.ico', category: 'SEO & Optimization', link: 'https://vidiq.com' },
        { name: 'Google Trends', description: 'Free trending topic research', logo: 'https://trends.google.com/favicon.ico', category: 'Content Research', link: 'https://trends.google.com' },
        { name: 'Hootsuite', description: 'Free social media scheduling', logo: 'https://hootsuite.com/favicon.ico', category: 'Content Distribution', link: 'https://hootsuite.com' },
        { name: 'YouTube Analytics', description: 'Free channel performance tracking', logo: 'https://www.youtube.com/favicon.ico', category: 'Analytics', link: 'https://www.youtube.com/analytics' },
        { name: 'IFTTT', description: 'Free automation workflows', logo: 'https://ifttt.com/favicon.ico', category: 'Automation', link: 'https://ifttt.com' }
    ],
    'blockchain-development': [
        { name: 'Ethereum', description: 'Free blockchain development platform', logo: 'https://ethereum.org/favicon.ico', category: 'Blockchain Platform', link: 'https://ethereum.org' },
        { name: 'Solidity', description: 'Free smart contract programming language', logo: 'https://soliditylang.org/favicon.ico', category: 'Development Language', link: 'https://soliditylang.org' },
        { name: 'Remix IDE', description: 'Free online Solidity development environment', logo: 'https://remix.ethereum.org/favicon.ico', category: 'Development Tools', link: 'https://remix.ethereum.org' },
        { name: 'MetaMask', description: 'Free Ethereum wallet and browser extension', logo: 'https://metamask.io/favicon.ico', category: 'Wallet & Testing', link: 'https://metamask.io' },
        { name: 'Ganache', description: 'Free personal blockchain for testing', logo: 'https://trufflesuite.com/favicon.ico', category: 'Testing Environment', link: 'https://trufflesuite.com/ganache' },
        { name: 'OpenZeppelin', description: 'Free secure smart contract library', logo: 'https://openzeppelin.com/favicon.ico', category: 'Security & Libraries', link: 'https://openzeppelin.com' },
        { name: 'GitHub', description: 'Free code repository for blockchain projects', logo: 'https://github.com/favicon.ico', category: 'Version Control', link: 'https://github.com' },
        { name: 'Etherscan', description: 'Free Ethereum blockchain explorer', logo: 'https://etherscan.io/favicon.ico', category: 'Blockchain Analytics', link: 'https://etherscan.io' },
        { name: 'ChatGPT', description: 'Free AI for smart contract development', logo: 'https://openai.com/favicon.ico', category: 'AI Development', link: 'https://chat.openai.com' },
        { name: 'Polygon', description: 'Free Layer 2 scaling solution', logo: 'https://polygon.technology/favicon.ico', category: 'Scaling Solutions', link: 'https://polygon.technology' },
        { name: 'IPFS', description: 'Free decentralized storage network', logo: 'https://ipfs.io/favicon.ico', category: 'Decentralized Storage', link: 'https://ipfs.io' },
        { name: 'Web3.js', description: 'Free Ethereum JavaScript library', logo: 'https://web3js.readthedocs.io/favicon.ico', category: 'Frontend Integration', link: 'https://web3js.readthedocs.io' }
    ],
    'ai-fitness-coaching': [
        { name: 'MyFitnessPal', description: 'Free nutrition tracking and database', logo: 'https://www.myfitnesspal.com/favicon.ico', category: 'Nutrition Tracking', link: 'https://www.myfitnesspal.com' },
        { name: 'ChatGPT', description: 'Free AI workout and meal planning', logo: 'https://openai.com/favicon.ico', category: 'AI Coaching', link: 'https://chat.openai.com' },
        { name: 'Google Fit', description: 'Free fitness tracking platform', logo: 'https://www.google.com/fit/favicon.ico', category: 'Fitness Tracking', link: 'https://www.google.com/fit' },
        { name: 'Strava', description: 'Free activity tracking and social fitness', logo: 'https://www.strava.com/favicon.ico', category: 'Activity Tracking', link: 'https://www.strava.com' },
        { name: 'YouTube', description: 'Free workout video hosting', logo: 'https://www.youtube.com/favicon.ico', category: 'Content Delivery', link: 'https://www.youtube.com' },
        { name: 'Canva', description: 'Free fitness content and meal plan design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Zoom', description: 'Free virtual training sessions', logo: 'https://zoom.us/favicon.ico', category: 'Virtual Training', link: 'https://zoom.us' },
        { name: 'Calendly', description: 'Free client scheduling system', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Google Forms', description: 'Free client assessment forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Instagram', description: 'Free fitness content marketing', logo: 'https://www.instagram.com/favicon.ico', category: 'Social Marketing', link: 'https://www.instagram.com' },
        { name: 'Mailchimp', description: 'Free client email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Client Communication', link: 'https://mailchimp.com' },
        { name: 'Google Sheets', description: 'Free progress tracking and analytics', logo: 'https://sheets.google.com/favicon.ico', category: 'Progress Tracking', link: 'https://sheets.google.com' }
    ],
    'online-tutoring-platform': [
        { name: 'Zoom', description: 'Free video conferencing for lessons', logo: 'https://zoom.us/favicon.ico', category: 'Virtual Classroom', link: 'https://zoom.us' },
        { name: 'Google Meet', description: 'Free video calling platform', logo: 'https://meet.google.com/favicon.ico', category: 'Virtual Classroom', link: 'https://meet.google.com' },
        { name: 'Google Classroom', description: 'Free classroom management system', logo: 'https://classroom.google.com/favicon.ico', category: 'Course Management', link: 'https://classroom.google.com' },
        { name: 'Khan Academy', description: 'Free educational content library', logo: 'https://www.khanacademy.org/favicon.ico', category: 'Educational Resources', link: 'https://www.khanacademy.org' },
        { name: 'ChatGPT', description: 'Free AI tutoring assistance and content', logo: 'https://openai.com/favicon.ico', category: 'AI Teaching Assistant', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free educational materials design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Docs', description: 'Free collaborative document editing', logo: 'https://docs.google.com/favicon.ico', category: 'Document Sharing', link: 'https://docs.google.com' },
        { name: 'Calendly', description: 'Free lesson scheduling system', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Padlet', description: 'Free collaborative learning boards', logo: 'https://padlet.com/favicon.ico', category: 'Interactive Learning', link: 'https://padlet.com' },
        { name: 'Quizlet', description: 'Free flashcards and study tools', logo: 'https://quizlet.com/favicon.ico', category: 'Study Tools', link: 'https://quizlet.com' },
        { name: 'YouTube', description: 'Free educational video hosting', logo: 'https://www.youtube.com/favicon.ico', category: 'Video Content', link: 'https://www.youtube.com' },
        { name: 'Google Analytics', description: 'Free student engagement tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' }
    ],
    'food-delivery-business': [
        { name: 'Google Maps', description: 'Free route optimization and location services', logo: 'https://maps.google.com/favicon.ico', category: 'Logistics & Navigation', link: 'https://maps.google.com' },
        { name: 'WhatsApp Business', description: 'Free customer communication platform', logo: 'https://business.whatsapp.com/favicon.ico', category: 'Customer Communication', link: 'https://business.whatsapp.com' },
        { name: 'Instagram', description: 'Free food marketing and promotion', logo: 'https://www.instagram.com/favicon.ico', category: 'Social Marketing', link: 'https://www.instagram.com' },
        { name: 'Facebook Business', description: 'Free business page and advertising', logo: 'https://business.facebook.com/favicon.ico', category: 'Social Marketing', link: 'https://business.facebook.com' },
        { name: 'Canva', description: 'Free menu design and marketing materials', logo: 'https://www.canva.com/favicon.ico', category: 'Design & Marketing', link: 'https://www.canva.com' },
        { name: 'Google My Business', description: 'Free local business listing', logo: 'https://business.google.com/favicon.ico', category: 'Local SEO', link: 'https://business.google.com' },
        { name: 'ChatGPT', description: 'Free AI menu optimization and descriptions', logo: 'https://openai.com/favicon.ico', category: 'Menu Optimization', link: 'https://chat.openai.com' },
        { name: 'Google Sheets', description: 'Free order tracking and inventory', logo: 'https://sheets.google.com/favicon.ico', category: 'Operations Management', link: 'https://sheets.google.com' },
        { name: 'Stripe', description: 'Free payment processing setup', logo: 'https://stripe.com/favicon.ico', category: 'Payment Processing', link: 'https://stripe.com' },
        { name: 'Mailchimp', description: 'Free customer email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Customer Retention', link: 'https://mailchimp.com' },
        { name: 'Google Analytics', description: 'Free website and order analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Yelp for Business', description: 'Free customer review management', logo: 'https://biz.yelp.com/favicon.ico', category: 'Reputation Management', link: 'https://biz.yelp.com' }
    ],
    'travel-planning-agency': [
        { name: 'Google Flights', description: 'Free flight search and price tracking', logo: 'https://www.google.com/travel/favicon.ico', category: 'Flight Booking', link: 'https://www.google.com/travel/flights' },
        { name: 'Booking.com', description: 'Free hotel booking platform', logo: 'https://www.booking.com/favicon.ico', category: 'Accommodation', link: 'https://www.booking.com' },
        { name: 'Airbnb', description: 'Free vacation rental platform', logo: 'https://www.airbnb.com/favicon.ico', category: 'Accommodation', link: 'https://www.airbnb.com' },
        { name: 'TripAdvisor', description: 'Free travel reviews and recommendations', logo: 'https://www.tripadvisor.com/favicon.ico', category: 'Travel Research', link: 'https://www.tripadvisor.com' },
        { name: 'ChatGPT', description: 'Free AI travel itinerary planning', logo: 'https://openai.com/favicon.ico', category: 'Itinerary Planning', link: 'https://chat.openai.com' },
        { name: 'Google Maps', description: 'Free destination research and navigation', logo: 'https://maps.google.com/favicon.ico', category: 'Navigation & Research', link: 'https://maps.google.com' },
        { name: 'Canva', description: 'Free travel brochures and marketing', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing Materials', link: 'https://www.canva.com' },
        { name: 'Instagram', description: 'Free travel content marketing', logo: 'https://www.instagram.com/favicon.ico', category: 'Social Marketing', link: 'https://www.instagram.com' },
        { name: 'Google Docs', description: 'Free itinerary creation and sharing', logo: 'https://docs.google.com/favicon.ico', category: 'Document Creation', link: 'https://docs.google.com' },
        { name: 'Calendly', description: 'Free consultation scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Client Scheduling', link: 'https://calendly.com' },
        { name: 'Mailchimp', description: 'Free travel newsletter marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' },
        { name: 'Google Analytics', description: 'Free website traffic analysis', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'personal-finance-coaching': [
        { name: 'Mint', description: 'Free personal finance tracking', logo: 'https://mint.intuit.com/favicon.ico', category: 'Financial Tracking', link: 'https://mint.intuit.com' },
        { name: 'YNAB', description: 'Free trial budgeting software', logo: 'https://www.youneedabudget.com/favicon.ico', category: 'Budgeting Tools', link: 'https://www.youneedabudget.com' },
        { name: 'ChatGPT', description: 'Free AI financial advice and planning', logo: 'https://openai.com/favicon.ico', category: 'AI Financial Planning', link: 'https://chat.openai.com' },
        { name: 'Google Sheets', description: 'Free budget templates and tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Budget Planning', link: 'https://sheets.google.com' },
        { name: 'Zoom', description: 'Free virtual coaching sessions', logo: 'https://zoom.us/favicon.ico', category: 'Client Coaching', link: 'https://zoom.us' },
        { name: 'Calendly', description: 'Free appointment scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Canva', description: 'Free financial education materials', logo: 'https://www.canva.com/favicon.ico', category: 'Educational Content', link: 'https://www.canva.com' },
        { name: 'YouTube', description: 'Free financial education videos', logo: 'https://www.youtube.com/favicon.ico', category: 'Content Creation', link: 'https://www.youtube.com' },
        { name: 'LinkedIn', description: 'Free professional networking and content', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Marketing', link: 'https://www.linkedin.com' },
        { name: 'Mailchimp', description: 'Free financial newsletter marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' },
        { name: 'Google Forms', description: 'Free financial assessment forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Wave', description: 'Free invoicing for coaching services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' }
    ],
    'gaming-content-creation': [
        { name: 'OBS Studio', description: 'Free streaming and recording software', logo: 'https://obsproject.com/favicon.ico', category: 'Streaming & Recording', link: 'https://obsproject.com' },
        { name: 'Twitch', description: 'Free live streaming platform', logo: 'https://www.twitch.tv/favicon.ico', category: 'Streaming Platform', link: 'https://www.twitch.tv' },
        { name: 'YouTube Gaming', description: 'Free gaming video platform', logo: 'https://gaming.youtube.com/favicon.ico', category: 'Video Platform', link: 'https://gaming.youtube.com' },
        { name: 'Discord', description: 'Free community building platform', logo: 'https://discord.com/favicon.ico', category: 'Community Building', link: 'https://discord.com' },
        { name: 'DaVinci Resolve', description: 'Free professional video editing', logo: 'https://www.blackmagicdesign.com/favicon.ico', category: 'Video Editing', link: 'https://www.blackmagicdesign.com/products/davinciresolve' },
        { name: 'Canva', description: 'Free gaming thumbnails and graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Graphic Design', link: 'https://www.canva.com' },
        { name: 'ChatGPT', description: 'Free AI content ideas and scripts', logo: 'https://openai.com/favicon.ico', category: 'Content Creation', link: 'https://chat.openai.com' },
        { name: 'Steam', description: 'Free game discovery and community', logo: 'https://store.steampowered.com/favicon.ico', category: 'Game Platform', link: 'https://store.steampowered.com' },
        { name: 'Twitter', description: 'Free gaming community engagement', logo: 'https://twitter.com/favicon.ico', category: 'Social Media', link: 'https://twitter.com' },
        { name: 'TikTok', description: 'Free short-form gaming content', logo: 'https://www.tiktok.com/favicon.ico', category: 'Short-form Content', link: 'https://www.tiktok.com' },
        { name: 'Streamlabs', description: 'Free streaming tools and alerts', logo: 'https://streamlabs.com/favicon.ico', category: 'Streaming Enhancement', link: 'https://streamlabs.com' },
        { name: 'Google Analytics', description: 'Free audience and engagement tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' }
    ],
    'ai-photography-business': [
        { name: 'GIMP', description: 'Free advanced photo editing software', logo: 'https://www.gimp.org/favicon.ico', category: 'Photo Editing', link: 'https://www.gimp.org' },
        { name: 'Canva', description: 'Free photo editing and design tools', logo: 'https://www.canva.com/favicon.ico', category: 'Photo Editing', link: 'https://www.canva.com' },
        { name: 'Unsplash', description: 'Free stock photography platform', logo: 'https://unsplash.com/favicon.ico', category: 'Stock Photography', link: 'https://unsplash.com' },
        { name: 'Pexels', description: 'Free stock photos and videos', logo: 'https://www.pexels.com/favicon.ico', category: 'Stock Photography', link: 'https://www.pexels.com' },
        { name: 'ChatGPT', description: 'Free AI photo concept and caption generation', logo: 'https://openai.com/favicon.ico', category: 'AI Enhancement', link: 'https://chat.openai.com' },
        { name: 'Instagram', description: 'Free photography portfolio and marketing', logo: 'https://www.instagram.com/favicon.ico', category: 'Portfolio & Marketing', link: 'https://www.instagram.com' },
        { name: 'Flickr', description: 'Free photo hosting and community', logo: 'https://www.flickr.com/favicon.ico', category: 'Portfolio & Marketing', link: 'https://www.flickr.com' },
        { name: 'Google Photos', description: 'Free photo storage and organization', logo: 'https://photos.google.com/favicon.ico', category: 'Storage & Organization', link: 'https://photos.google.com' },
        { name: 'Calendly', description: 'Free client booking and scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Client Management', link: 'https://calendly.com' },
        { name: 'Google Forms', description: 'Free client inquiry and booking forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Management', link: 'https://forms.google.com' },
        { name: 'Wave', description: 'Free invoicing for photography services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free website and portfolio tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' }
    ],
    'voice-acting-services': [
        { name: 'Audacity', description: 'Free audio recording and editing', logo: 'https://www.audacityteam.org/favicon.ico', category: 'Audio Recording', link: 'https://www.audacityteam.org' },
        { name: 'GarageBand', description: 'Free audio production (Mac)', logo: 'https://www.apple.com/favicon.ico', category: 'Audio Recording', link: 'https://www.apple.com/mac/garageband' },
        { name: 'Voice123', description: 'Free voice acting marketplace', logo: 'https://voice123.com/favicon.ico', category: 'Job Platforms', link: 'https://voice123.com' },
        { name: 'Voices.com', description: 'Free voice talent marketplace', logo: 'https://www.voices.com/favicon.ico', category: 'Job Platforms', link: 'https://www.voices.com' },
        { name: 'Fiverr', description: 'Free voice acting service marketplace', logo: 'https://www.fiverr.com/favicon.ico', category: 'Job Platforms', link: 'https://www.fiverr.com' },
        { name: 'ChatGPT', description: 'Free AI script writing and character development', logo: 'https://openai.com/favicon.ico', category: 'Script Development', link: 'https://chat.openai.com' },
        { name: 'Google Drive', description: 'Free audio file storage and sharing', logo: 'https://drive.google.com/favicon.ico', category: 'File Management', link: 'https://drive.google.com' },
        { name: 'YouTube', description: 'Free voice acting demo reel hosting', logo: 'https://www.youtube.com/favicon.ico', category: 'Portfolio Showcase', link: 'https://www.youtube.com' },
        { name: 'SoundCloud', description: 'Free audio hosting and sharing', logo: 'https://soundcloud.com/favicon.ico', category: 'Portfolio Showcase', link: 'https://soundcloud.com' },
        { name: 'LinkedIn', description: 'Free professional networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Calendly', description: 'Free client scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Client Management', link: 'https://calendly.com' },
        { name: 'Wave', description: 'Free invoicing for voice services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' }
    ],
    'music-production-studio': [
        { name: 'Audacity', description: 'Free audio recording and editing', logo: 'https://www.audacityteam.org/favicon.ico', category: 'Audio Production', link: 'https://www.audacityteam.org' },
        { name: 'GarageBand', description: 'Free music production software (Mac)', logo: 'https://www.apple.com/favicon.ico', category: 'Audio Production', link: 'https://www.apple.com/mac/garageband' },
        { name: 'Reaper', description: 'Free trial professional DAW', logo: 'https://www.reaper.fm/favicon.ico', category: 'Audio Production', link: 'https://www.reaper.fm' },
        { name: 'BandLab', description: 'Free online music creation platform', logo: 'https://www.bandlab.com/favicon.ico', category: 'Online Production', link: 'https://www.bandlab.com' },
        { name: 'ChatGPT', description: 'Free AI music composition and lyrics', logo: 'https://openai.com/favicon.ico', category: 'AI Music Creation', link: 'https://chat.openai.com' },
        { name: 'Freesound', description: 'Free sound effects and samples', logo: 'https://freesound.org/favicon.ico', category: 'Sound Libraries', link: 'https://freesound.org' },
        { name: 'YouTube', description: 'Free music distribution and promotion', logo: 'https://www.youtube.com/favicon.ico', category: 'Music Distribution', link: 'https://www.youtube.com' },
        { name: 'SoundCloud', description: 'Free music hosting and sharing', logo: 'https://soundcloud.com/favicon.ico', category: 'Music Distribution', link: 'https://soundcloud.com' },
        { name: 'Spotify for Artists', description: 'Free artist dashboard and analytics', logo: 'https://artists.spotify.com/favicon.ico', category: 'Music Analytics', link: 'https://artists.spotify.com' },
        { name: 'Canva', description: 'Free album artwork and promotional graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Visual Design', link: 'https://www.canva.com' },
        { name: 'Instagram', description: 'Free music promotion and marketing', logo: 'https://www.instagram.com/favicon.ico', category: 'Music Marketing', link: 'https://www.instagram.com' },
        { name: 'Mailchimp', description: 'Free fan email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Fan Engagement', link: 'https://mailchimp.com' }
    ],
    'language-translation-services': [
        { name: 'Google Translate', description: 'Free translation API and tools', logo: 'https://translate.google.com/favicon.ico', category: 'Translation Tools', link: 'https://translate.google.com' },
        { name: 'DeepL', description: 'Free high-quality translation service', logo: 'https://www.deepl.com/favicon.ico', category: 'Translation Tools', link: 'https://www.deepl.com' },
        { name: 'ChatGPT', description: 'Free AI translation and localization', logo: 'https://openai.com/favicon.ico', category: 'AI Translation', link: 'https://chat.openai.com' },
        { name: 'Upwork', description: 'Free translation job marketplace', logo: 'https://www.upwork.com/favicon.ico', category: 'Job Platforms', link: 'https://www.upwork.com' },
        { name: 'Fiverr', description: 'Free translation service marketplace', logo: 'https://www.fiverr.com/favicon.ico', category: 'Job Platforms', link: 'https://www.fiverr.com' },
        { name: 'ProZ', description: 'Free translator community and jobs', logo: 'https://www.proz.com/favicon.ico', category: 'Professional Network', link: 'https://www.proz.com' },
        { name: 'Google Docs', description: 'Free document collaboration and editing', logo: 'https://docs.google.com/favicon.ico', category: 'Document Management', link: 'https://docs.google.com' },
        { name: 'Grammarly', description: 'Free grammar and style checking', logo: 'https://www.grammarly.com/favicon.ico', category: 'Quality Assurance', link: 'https://www.grammarly.com' },
        { name: 'LinkedIn', description: 'Free professional networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Marketing', link: 'https://www.linkedin.com' },
        { name: 'Calendly', description: 'Free client consultation scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Client Management', link: 'https://calendly.com' },
        { name: 'Wave', description: 'Free invoicing for translation services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free website traffic analysis', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'virtual-event-planning': [
        { name: 'Zoom', description: 'Free video conferencing for events', logo: 'https://zoom.us/favicon.ico', category: 'Event Platform', link: 'https://zoom.us' },
        { name: 'Google Meet', description: 'Free video meeting platform', logo: 'https://meet.google.com/favicon.ico', category: 'Event Platform', link: 'https://meet.google.com' },
        { name: 'Eventbrite', description: 'Free event registration and ticketing', logo: 'https://www.eventbrite.com/favicon.ico', category: 'Event Registration', link: 'https://www.eventbrite.com' },
        { name: 'Facebook Events', description: 'Free event promotion and management', logo: 'https://www.facebook.com/favicon.ico', category: 'Event Promotion', link: 'https://www.facebook.com/events' },
        { name: 'Canva', description: 'Free event graphics and promotional materials', logo: 'https://www.canva.com/favicon.ico', category: 'Event Design', link: 'https://www.canva.com' },
        { name: 'ChatGPT', description: 'Free AI event planning and content creation', logo: 'https://openai.com/favicon.ico', category: 'Event Planning', link: 'https://chat.openai.com' },
        { name: 'Google Forms', description: 'Free event surveys and feedback forms', logo: 'https://forms.google.com/favicon.ico', category: 'Event Feedback', link: 'https://forms.google.com' },
        { name: 'Calendly', description: 'Free event scheduling and coordination', logo: 'https://calendly.com/favicon.ico', category: 'Event Scheduling', link: 'https://calendly.com' },
        { name: 'Slack', description: 'Free team coordination for events', logo: 'https://slack.com/favicon.ico', category: 'Team Coordination', link: 'https://slack.com' },
        { name: 'Mailchimp', description: 'Free event email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Event Marketing', link: 'https://mailchimp.com' },
        { name: 'Google Analytics', description: 'Free event website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Event Analytics', link: 'https://analytics.google.com' },
        { name: 'OBS Studio', description: 'Free live streaming for events', logo: 'https://obsproject.com/favicon.ico', category: 'Live Streaming', link: 'https://obsproject.com' }
    ],
    'cybersecurity-consulting': [
        { name: 'Nmap', description: 'Free network security scanner', logo: 'https://nmap.org/favicon.ico', category: 'Security Tools', link: 'https://nmap.org' },
        { name: 'Wireshark', description: 'Free network protocol analyzer', logo: 'https://www.wireshark.org/favicon.ico', category: 'Security Tools', link: 'https://www.wireshark.org' },
        { name: 'OWASP ZAP', description: 'Free web application security scanner', logo: 'https://www.zaproxy.org/favicon.ico', category: 'Security Tools', link: 'https://www.zaproxy.org' },
        { name: 'Metasploit Community', description: 'Free penetration testing framework', logo: 'https://www.metasploit.com/favicon.ico', category: 'Penetration Testing', link: 'https://www.metasploit.com' },
        { name: 'ChatGPT', description: 'Free AI security analysis and reporting', logo: 'https://openai.com/favicon.ico', category: 'AI Security Analysis', link: 'https://chat.openai.com' },
        { name: 'LinkedIn', description: 'Free professional networking and lead generation', logo: 'https://www.linkedin.com/favicon.ico', category: 'Business Development', link: 'https://www.linkedin.com' },
        { name: 'Google Docs', description: 'Free security report documentation', logo: 'https://docs.google.com/favicon.ico', category: 'Documentation', link: 'https://docs.google.com' },
        { name: 'Canva', description: 'Free security awareness materials', logo: 'https://www.canva.com/favicon.ico', category: 'Training Materials', link: 'https://www.canva.com' },
        { name: 'Zoom', description: 'Free client consultations and training', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'Calendly', description: 'Free security consultation scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Client Scheduling', link: 'https://calendly.com' },
        { name: 'Wave', description: 'Free invoicing for security services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'GitHub', description: 'Free security tool development and sharing', logo: 'https://github.com/favicon.ico', category: 'Tool Development', link: 'https://github.com' }
    ],
    'data-analytics-consulting': [
        { name: 'Google Analytics', description: 'Free web analytics platform', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics Platforms', link: 'https://analytics.google.com' },
        { name: 'Google Data Studio', description: 'Free data visualization and reporting', logo: 'https://datastudio.google.com/favicon.ico', category: 'Data Visualization', link: 'https://datastudio.google.com' },
        { name: 'Python', description: 'Free programming language for data analysis', logo: 'https://www.python.org/favicon.ico', category: 'Programming Tools', link: 'https://www.python.org' },
        { name: 'R', description: 'Free statistical computing language', logo: 'https://www.r-project.org/favicon.ico', category: 'Programming Tools', link: 'https://www.r-project.org' },
        { name: 'Jupyter Notebook', description: 'Free interactive data analysis environment', logo: 'https://jupyter.org/favicon.ico', category: 'Development Environment', link: 'https://jupyter.org' },
        { name: 'ChatGPT', description: 'Free AI data analysis and insights', logo: 'https://openai.com/favicon.ico', category: 'AI Analytics', link: 'https://chat.openai.com' },
        { name: 'Google Sheets', description: 'Free spreadsheet analysis and visualization', logo: 'https://sheets.google.com/favicon.ico', category: 'Data Processing', link: 'https://sheets.google.com' },
        { name: 'Tableau Public', description: 'Free data visualization platform', logo: 'https://public.tableau.com/favicon.ico', category: 'Data Visualization', link: 'https://public.tableau.com' },
        { name: 'LinkedIn', description: 'Free professional networking and lead generation', logo: 'https://www.linkedin.com/favicon.ico', category: 'Business Development', link: 'https://www.linkedin.com' },
        { name: 'Calendly', description: 'Free consultation scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Client Management', link: 'https://calendly.com' },
        { name: 'GitHub', description: 'Free code repository for analytics projects', logo: 'https://github.com/favicon.ico', category: 'Project Management', link: 'https://github.com' },
        { name: 'Wave', description: 'Free invoicing for consulting services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' }
    ],
    'ai-art-generation-business': [
        { name: 'DALL-E', description: 'Free AI image generation (limited)', logo: 'https://openai.com/favicon.ico', category: 'AI Art Generation', link: 'https://openai.com/dall-e-2' },
        { name: 'Midjourney', description: 'Free trial AI art generation', logo: 'https://www.midjourney.com/favicon.ico', category: 'AI Art Generation', link: 'https://www.midjourney.com' },
        { name: 'Stable Diffusion', description: 'Free open-source AI art generation', logo: 'https://stability.ai/favicon.ico', category: 'AI Art Generation', link: 'https://stability.ai' },
        { name: 'ChatGPT', description: 'Free AI art prompts and descriptions', logo: 'https://openai.com/favicon.ico', category: 'Prompt Engineering', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free art editing and enhancement', logo: 'https://www.canva.com/favicon.ico', category: 'Art Enhancement', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free advanced image editing', logo: 'https://www.gimp.org/favicon.ico', category: 'Art Enhancement', link: 'https://www.gimp.org' },
        { name: 'Etsy', description: 'Free marketplace for digital art sales', logo: 'https://www.etsy.com/favicon.ico', category: 'Art Sales', link: 'https://www.etsy.com' },
        { name: 'Instagram', description: 'Free art portfolio and marketing', logo: 'https://www.instagram.com/favicon.ico', category: 'Art Marketing', link: 'https://www.instagram.com' },
        { name: 'Pinterest', description: 'Free visual art marketing platform', logo: 'https://www.pinterest.com/favicon.ico', category: 'Art Marketing', link: 'https://www.pinterest.com' },
        { name: 'DeviantArt', description: 'Free art community and portfolio', logo: 'https://www.deviantart.com/favicon.ico', category: 'Art Community', link: 'https://www.deviantart.com' },
        { name: 'Google Drive', description: 'Free art file storage and sharing', logo: 'https://drive.google.com/favicon.ico', category: 'File Management', link: 'https://drive.google.com' },
        { name: 'Wave', description: 'Free invoicing for art sales', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' }
    ],
    'remote-team-management': [
        { name: 'Slack', description: 'Free team communication platform', logo: 'https://slack.com/favicon.ico', category: 'Team Communication', link: 'https://slack.com' },
        { name: 'Discord', description: 'Free voice and text communication', logo: 'https://discord.com/favicon.ico', category: 'Team Communication', link: 'https://discord.com' },
        { name: 'Zoom', description: 'Free video conferencing for team meetings', logo: 'https://zoom.us/favicon.ico', category: 'Video Meetings', link: 'https://zoom.us' },
        { name: 'Trello', description: 'Free project management and task tracking', logo: 'https://trello.com/favicon.ico', category: 'Project Management', link: 'https://trello.com' },
        { name: 'Asana', description: 'Free team task management', logo: 'https://asana.com/favicon.ico', category: 'Project Management', link: 'https://asana.com' },
        { name: 'Google Workspace', description: 'Free collaborative productivity suite', logo: 'https://workspace.google.com/favicon.ico', category: 'Productivity Tools', link: 'https://workspace.google.com' },
        { name: 'GitHub', description: 'Free code collaboration and version control', logo: 'https://github.com/favicon.ico', category: 'Code Collaboration', link: 'https://github.com' },
        { name: 'ChatGPT', description: 'Free AI team productivity and automation', logo: 'https://openai.com/favicon.ico', category: 'AI Productivity', link: 'https://chat.openai.com' },
        { name: 'Calendly', description: 'Free team scheduling and coordination', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Toggl', description: 'Free time tracking for remote teams', logo: 'https://toggl.com/favicon.ico', category: 'Time Management', link: 'https://toggl.com' },
        { name: 'Loom', description: 'Free video messaging and screen recording', logo: 'https://www.loom.com/favicon.ico', category: 'Async Communication', link: 'https://www.loom.com' },
        { name: 'Google Analytics', description: 'Free team productivity analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Team Analytics', link: 'https://analytics.google.com' }
    ],
    'subscription-box-business': [
        { name: 'Google Trends', description: 'Free market research for subscription niches', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'SurveyMonkey', description: 'Free customer preference surveys', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Customer Research', link: 'https://www.surveymonkey.com' },
        { name: 'Shopify', description: 'Free trial subscription e-commerce platform', logo: 'https://www.shopify.com/favicon.ico', category: 'E-commerce Platform', link: 'https://www.shopify.com' },
        { name: 'WooCommerce', description: 'Free WordPress subscription plugin', logo: 'https://woocommerce.com/favicon.ico', category: 'E-commerce Platform', link: 'https://woocommerce.com' },
        { name: 'Canva', description: 'Free packaging design and marketing materials', logo: 'https://www.canva.com/favicon.ico', category: 'Design & Branding', link: 'https://www.canva.com' },
        { name: 'ChatGPT', description: 'Free AI product curation and descriptions', logo: 'https://openai.com/favicon.ico', category: 'Product Curation', link: 'https://chat.openai.com' },
        { name: 'Instagram', description: 'Free subscription box marketing', logo: 'https://www.instagram.com/favicon.ico', category: 'Social Marketing', link: 'https://www.instagram.com' },
        { name: 'YouTube', description: 'Free unboxing video content creation', logo: 'https://www.youtube.com/favicon.ico', category: 'Content Marketing', link: 'https://www.youtube.com' },
        { name: 'Mailchimp', description: 'Free subscriber email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' },
        { name: 'Google Sheets', description: 'Free inventory and subscriber management', logo: 'https://sheets.google.com/favicon.ico', category: 'Operations Management', link: 'https://sheets.google.com' },
        { name: 'Stripe', description: 'Free recurring payment processing', logo: 'https://stripe.com/favicon.ico', category: 'Payment Processing', link: 'https://stripe.com' },
        { name: 'Google Analytics', description: 'Free subscription business analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'legal-services-automation': [
        { name: 'Google Docs', description: 'Free legal document creation and collaboration', logo: 'https://docs.google.com/favicon.ico', category: 'Document Management', link: 'https://docs.google.com' },
        { name: 'ChatGPT', description: 'Free AI legal research and document drafting', logo: 'https://openai.com/favicon.ico', category: 'AI Legal Assistant', link: 'https://chat.openai.com' },
        { name: 'Clio', description: 'Free trial legal practice management', logo: 'https://www.clio.com/favicon.ico', category: 'Practice Management', link: 'https://www.clio.com' },
        { name: 'Calendly', description: 'Free client appointment scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Client Management', link: 'https://calendly.com' },
        { name: 'Zoom', description: 'Free client consultations and depositions', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'Google Forms', description: 'Free client intake and case forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Intake', link: 'https://forms.google.com' },
        { name: 'Canva', description: 'Free legal marketing materials', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing', link: 'https://www.canva.com' },
        { name: 'LinkedIn', description: 'Free professional networking and lead generation', logo: 'https://www.linkedin.com/favicon.ico', category: 'Business Development', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free invoicing and legal billing', logo: 'https://www.waveapps.com/favicon.ico', category: 'Billing & Payments', link: 'https://www.waveapps.com' },
        { name: 'Google Drive', description: 'Free secure document storage', logo: 'https://drive.google.com/favicon.ico', category: 'Document Storage', link: 'https://drive.google.com' },
        { name: 'Trello', description: 'Free case management and task tracking', logo: 'https://trello.com/favicon.ico', category: 'Case Management', link: 'https://trello.com' },
        { name: 'Google Analytics', description: 'Free law firm website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'hr-consulting-business': [
        { name: 'Google Workspace', description: 'Free HR document management suite', logo: 'https://workspace.google.com/favicon.ico', category: 'Document Management', link: 'https://workspace.google.com' },
        { name: 'ChatGPT', description: 'Free AI HR policy and procedure writing', logo: 'https://openai.com/favicon.ico', category: 'AI HR Assistant', link: 'https://chat.openai.com' },
        { name: 'LinkedIn', description: 'Free professional networking and recruitment', logo: 'https://www.linkedin.com/favicon.ico', category: 'Recruitment', link: 'https://www.linkedin.com' },
        { name: 'Indeed', description: 'Free job posting and candidate sourcing', logo: 'https://www.indeed.com/favicon.ico', category: 'Recruitment', link: 'https://www.indeed.com' },
        { name: 'Google Forms', description: 'Free employee surveys and assessments', logo: 'https://forms.google.com/favicon.ico', category: 'Employee Assessment', link: 'https://forms.google.com' },
        { name: 'SurveyMonkey', description: 'Free employee engagement surveys', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Employee Assessment', link: 'https://www.surveymonkey.com' },
        { name: 'Zoom', description: 'Free HR training and client meetings', logo: 'https://zoom.us/favicon.ico', category: 'Training & Communication', link: 'https://zoom.us' },
        { name: 'Canva', description: 'Free HR training materials and presentations', logo: 'https://www.canva.com/favicon.ico', category: 'Training Materials', link: 'https://www.canva.com' },
        { name: 'Calendly', description: 'Free HR consultation scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Client Management', link: 'https://calendly.com' },
        { name: 'Slack', description: 'Free team communication for HR projects', logo: 'https://slack.com/favicon.ico', category: 'Team Communication', link: 'https://slack.com' },
        { name: 'Wave', description: 'Free invoicing for HR services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free HR website performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'interior-design-services': [
        { name: 'SketchUp Free', description: 'Free 3D design and modeling software', logo: 'https://www.sketchup.com/favicon.ico', category: '3D Design', link: 'https://www.sketchup.com/plans-and-pricing/sketchup-free' },
        { name: 'Canva', description: 'Free mood boards and design presentations', logo: 'https://www.canva.com/favicon.ico', category: 'Design Presentation', link: 'https://www.canva.com' },
        { name: 'Pinterest', description: 'Free design inspiration and mood boards', logo: 'https://www.pinterest.com/favicon.ico', category: 'Design Inspiration', link: 'https://www.pinterest.com' },
        { name: 'ChatGPT', description: 'Free AI design concepts and color schemes', logo: 'https://openai.com/favicon.ico', category: 'AI Design Assistant', link: 'https://chat.openai.com' },
        { name: 'GIMP', description: 'Free image editing for design mockups', logo: 'https://www.gimp.org/favicon.ico', category: 'Image Editing', link: 'https://www.gimp.org' },
        { name: 'Google Drive', description: 'Free design file storage and client sharing', logo: 'https://drive.google.com/favicon.ico', category: 'File Management', link: 'https://drive.google.com' },
        { name: 'Instagram', description: 'Free design portfolio and marketing', logo: 'https://www.instagram.com/favicon.ico', category: 'Portfolio & Marketing', link: 'https://www.instagram.com' },
        { name: 'Houzz', description: 'Free design portfolio and client acquisition', logo: 'https://www.houzz.com/favicon.ico', category: 'Portfolio & Marketing', link: 'https://www.houzz.com' },
        { name: 'Calendly', description: 'Free client consultation scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Client Management', link: 'https://calendly.com' },
        { name: 'Google Forms', description: 'Free client design questionnaires', logo: 'https://forms.google.com/favicon.ico', category: 'Client Management', link: 'https://forms.google.com' },
        { name: 'Wave', description: 'Free invoicing for design services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free design website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'wedding-planning-business': [
        { name: 'Google Sheets', description: 'Free wedding planning spreadsheets and budgets', logo: 'https://sheets.google.com/favicon.ico', category: 'Planning & Budgeting', link: 'https://sheets.google.com' },
        { name: 'Trello', description: 'Free wedding task and timeline management', logo: 'https://trello.com/favicon.ico', category: 'Project Management', link: 'https://trello.com' },
        { name: 'ChatGPT', description: 'Free AI wedding planning and vendor suggestions', logo: 'https://openai.com/favicon.ico', category: 'AI Planning Assistant', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free wedding invitations and marketing materials', logo: 'https://www.canva.com/favicon.ico', category: 'Design & Marketing', link: 'https://www.canva.com' },
        { name: 'Pinterest', description: 'Free wedding inspiration and mood boards', logo: 'https://www.pinterest.com/favicon.ico', category: 'Design Inspiration', link: 'https://www.pinterest.com' },
        { name: 'Instagram', description: 'Free wedding portfolio and marketing', logo: 'https://www.instagram.com/favicon.ico', category: 'Portfolio & Marketing', link: 'https://www.instagram.com' },
        { name: 'Google Forms', description: 'Free client intake and vendor forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Management', link: 'https://forms.google.com' },
        { name: 'Calendly', description: 'Free client and vendor meeting scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Zoom', description: 'Free virtual wedding planning meetings', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'Mailchimp', description: 'Free wedding client email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' },
        { name: 'Wave', description: 'Free invoicing for wedding services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free wedding business website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'pet-care-services': [
        { name: 'Rover', description: 'Free pet care service marketplace', logo: 'https://www.rover.com/favicon.ico', category: 'Service Platform', link: 'https://www.rover.com' },
        { name: 'Wag', description: 'Free dog walking service platform', logo: 'https://wagwalking.com/favicon.ico', category: 'Service Platform', link: 'https://wagwalking.com' },
        { name: 'ChatGPT', description: 'Free AI pet care advice and training tips', logo: 'https://openai.com/favicon.ico', category: 'AI Pet Care Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Forms', description: 'Free pet intake and health forms', logo: 'https://forms.google.com/favicon.ico', category: 'Pet Management', link: 'https://forms.google.com' },
        { name: 'Calendly', description: 'Free pet care appointment scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Instagram', description: 'Free pet care portfolio and marketing', logo: 'https://www.instagram.com/favicon.ico', category: 'Marketing', link: 'https://www.instagram.com' },
        { name: 'Facebook Business', description: 'Free local pet care marketing', logo: 'https://business.facebook.com/favicon.ico', category: 'Local Marketing', link: 'https://business.facebook.com' },
        { name: 'Canva', description: 'Free pet care flyers and social media posts', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing Materials', link: 'https://www.canva.com' },
        { name: 'Google My Business', description: 'Free local pet care business listing', logo: 'https://business.google.com/favicon.ico', category: 'Local SEO', link: 'https://business.google.com' },
        { name: 'WhatsApp Business', description: 'Free client communication for pet updates', logo: 'https://business.whatsapp.com/favicon.ico', category: 'Client Communication', link: 'https://business.whatsapp.com' },
        { name: 'Wave', description: 'Free invoicing for pet care services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free pet care website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'fitness-equipment-rental': [
        { name: 'Google Sheets', description: 'Free equipment inventory and rental tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Inventory Management', link: 'https://sheets.google.com' },
        { name: 'Calendly', description: 'Free equipment rental scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Rental Scheduling', link: 'https://calendly.com' },
        { name: 'ChatGPT', description: 'Free AI equipment recommendations and workout plans', logo: 'https://openai.com/favicon.ico', category: 'AI Fitness Assistant', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free rental marketing materials and equipment guides', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing Materials', link: 'https://www.canva.com' },
        { name: 'Facebook Marketplace', description: 'Free local equipment rental marketing', logo: 'https://www.facebook.com/favicon.ico', category: 'Local Marketing', link: 'https://www.facebook.com/marketplace' },
        { name: 'Craigslist', description: 'Free local equipment rental listings', logo: 'https://craigslist.org/favicon.ico', category: 'Local Marketing', link: 'https://craigslist.org' },
        { name: 'Instagram', description: 'Free fitness equipment showcase and marketing', logo: 'https://www.instagram.com/favicon.ico', category: 'Social Marketing', link: 'https://www.instagram.com' },
        { name: 'Google Forms', description: 'Free rental agreements and customer forms', logo: 'https://forms.google.com/favicon.ico', category: 'Rental Management', link: 'https://forms.google.com' },
        { name: 'WhatsApp Business', description: 'Free customer communication and support', logo: 'https://business.whatsapp.com/favicon.ico', category: 'Customer Support', link: 'https://business.whatsapp.com' },
        { name: 'Stripe', description: 'Free payment processing for rentals', logo: 'https://stripe.com/favicon.ico', category: 'Payment Processing', link: 'https://stripe.com' },
        { name: 'Wave', description: 'Free invoicing and rental billing', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free rental business analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'book-publishing-services': [
        { name: 'Google Docs', description: 'Free collaborative book writing and editing', logo: 'https://docs.google.com/favicon.ico', category: 'Writing & Editing', link: 'https://docs.google.com' },
        { name: 'ChatGPT', description: 'Free AI book writing, editing, and marketing', logo: 'https://openai.com/favicon.ico', category: 'AI Writing Assistant', link: 'https://chat.openai.com' },
        { name: 'Grammarly', description: 'Free grammar and style checking', logo: 'https://www.grammarly.com/favicon.ico', category: 'Editing Tools', link: 'https://www.grammarly.com' },
        { name: 'Canva', description: 'Free book cover design and marketing materials', logo: 'https://www.canva.com/favicon.ico', category: 'Book Design', link: 'https://www.canva.com' },
        { name: 'Amazon KDP', description: 'Free self-publishing platform', logo: 'https://kdp.amazon.com/favicon.ico', category: 'Publishing Platform', link: 'https://kdp.amazon.com' },
        { name: 'Draft2Digital', description: 'Free multi-platform book distribution', logo: 'https://www.draft2digital.com/favicon.ico', category: 'Book Distribution', link: 'https://www.draft2digital.com' },
        { name: 'Goodreads', description: 'Free book marketing and reader engagement', logo: 'https://www.goodreads.com/favicon.ico', category: 'Book Marketing', link: 'https://www.goodreads.com' },
        { name: 'BookBub', description: 'Free book promotion platform', logo: 'https://www.bookbub.com/favicon.ico', category: 'Book Marketing', link: 'https://www.bookbub.com' },
        { name: 'Mailchimp', description: 'Free author email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Author Marketing', link: 'https://mailchimp.com' },
        { name: 'Social media platforms', description: 'Free book promotion on social media', logo: 'https://www.instagram.com/favicon.ico', category: 'Social Marketing', link: 'https://www.instagram.com' },
        { name: 'Wave', description: 'Free invoicing for publishing services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free author website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Marketing Analytics', link: 'https://analytics.google.com' }
    ],
    'event-photography': [
        { name: 'GIMP', description: 'Free professional photo editing software', logo: 'https://www.gimp.org/favicon.ico', category: 'Photo Editing', link: 'https://www.gimp.org' },
        { name: 'Canva', description: 'Free photo editing and client galleries', logo: 'https://www.canva.com/favicon.ico', category: 'Photo Editing', link: 'https://www.canva.com' },
        { name: 'Google Photos', description: 'Free photo storage and client sharing', logo: 'https://photos.google.com/favicon.ico', category: 'Photo Storage', link: 'https://photos.google.com' },
        { name: 'Flickr', description: 'Free photo hosting and portfolio', logo: 'https://www.flickr.com/favicon.ico', category: 'Portfolio', link: 'https://www.flickr.com' },
        { name: 'Instagram', description: 'Free photography portfolio and marketing', logo: 'https://www.instagram.com/favicon.ico', category: 'Portfolio & Marketing', link: 'https://www.instagram.com' },
        { name: 'ChatGPT', description: 'Free AI photo captions and marketing content', logo: 'https://openai.com/favicon.ico', category: 'AI Marketing Assistant', link: 'https://chat.openai.com' },
        { name: 'Facebook Business', description: 'Free event photography marketing', logo: 'https://business.facebook.com/favicon.ico', category: 'Social Marketing', link: 'https://business.facebook.com' },
        { name: 'Google Forms', description: 'Free client booking and event forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Management', link: 'https://forms.google.com' },
        { name: 'Calendly', description: 'Free event photography scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'WeTransfer', description: 'Free large photo file sharing', logo: 'https://wetransfer.com/favicon.ico', category: 'File Sharing', link: 'https://wetransfer.com' },
        { name: 'Wave', description: 'Free invoicing for photography services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free photography website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'software-testing-services': [
        { name: 'Selenium', description: 'Free automated testing framework', logo: 'https://selenium.dev/favicon.ico', category: 'Test Automation', link: 'https://selenium.dev' },
        { name: 'Postman', description: 'Free API testing platform', logo: 'https://www.postman.com/favicon.ico', category: 'API Testing', link: 'https://www.postman.com' },
        { name: 'JMeter', description: 'Free performance testing tool', logo: 'https://jmeter.apache.org/favicon.ico', category: 'Performance Testing', link: 'https://jmeter.apache.org' },
        { name: 'TestRail', description: 'Free trial test case management', logo: 'https://www.testrail.com/favicon.ico', category: 'Test Management', link: 'https://www.testrail.com' },
        { name: 'GitHub', description: 'Free code repository and bug tracking', logo: 'https://github.com/favicon.ico', category: 'Version Control', link: 'https://github.com' },
        { name: 'ChatGPT', description: 'Free AI test case generation and documentation', logo: 'https://openai.com/favicon.ico', category: 'AI Testing Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Sheets', description: 'Free test case documentation and tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Test Documentation', link: 'https://sheets.google.com' },
        { name: 'Slack', description: 'Free team communication for testing projects', logo: 'https://slack.com/favicon.ico', category: 'Team Communication', link: 'https://slack.com' },
        { name: 'Zoom', description: 'Free client meetings and test reviews', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'LinkedIn', description: 'Free professional networking and lead generation', logo: 'https://www.linkedin.com/favicon.ico', category: 'Business Development', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free invoicing for testing services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free testing business website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'online-therapy-practice': [
        { name: 'Zoom', description: 'Free HIPAA-compliant video therapy sessions', logo: 'https://zoom.us/favicon.ico', category: 'Therapy Platform', link: 'https://zoom.us' },
        { name: 'Google Meet', description: 'Free secure video conferencing', logo: 'https://meet.google.com/favicon.ico', category: 'Therapy Platform', link: 'https://meet.google.com' },
        { name: 'Calendly', description: 'Free therapy appointment scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'ChatGPT', description: 'Free AI therapy notes and treatment planning', logo: 'https://openai.com/favicon.ico', category: 'AI Therapy Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Forms', description: 'Free client intake and assessment forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Google Docs', description: 'Free secure therapy notes and documentation', logo: 'https://docs.google.com/favicon.ico', category: 'Documentation', link: 'https://docs.google.com' },
        { name: 'Canva', description: 'Free therapy worksheets and educational materials', logo: 'https://www.canva.com/favicon.ico', category: 'Therapy Materials', link: 'https://www.canva.com' },
        { name: 'Psychology Today', description: 'Free therapist directory listing', logo: 'https://www.psychologytoday.com/favicon.ico', category: 'Professional Listing', link: 'https://www.psychologytoday.com' },
        { name: 'LinkedIn', description: 'Free professional networking and referrals', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Mailchimp', description: 'Free mental health newsletter and client communication', logo: 'https://mailchimp.com/favicon.ico', category: 'Client Communication', link: 'https://mailchimp.com' },
        { name: 'Wave', description: 'Free invoicing for therapy services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free therapy practice website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Practice Analytics', link: 'https://analytics.google.com' }
    ],
    'real-estate-investment': [
        { name: 'Zillow', description: 'Free property search and market analysis', logo: 'https://www.zillow.com/favicon.ico', category: 'Property Research', link: 'https://www.zillow.com' },
        { name: 'Realtor.com', description: 'Free property listings and market data', logo: 'https://www.realtor.com/favicon.ico', category: 'Property Research', link: 'https://www.realtor.com' },
        { name: 'ChatGPT', description: 'Free AI real estate market analysis and investment advice', logo: 'https://openai.com/favicon.ico', category: 'AI Investment Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Sheets', description: 'Free property analysis and investment tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Investment Analysis', link: 'https://sheets.google.com' },
        { name: 'BiggerPockets', description: 'Free real estate investment community and tools', logo: 'https://www.biggerpockets.com/favicon.ico', category: 'Investment Education', link: 'https://www.biggerpockets.com' },
        { name: 'LoopNet', description: 'Free commercial real estate listings', logo: 'https://www.loopnet.com/favicon.ico', category: 'Commercial Properties', link: 'https://www.loopnet.com' },
        { name: 'Rentometer', description: 'Free rental market analysis', logo: 'https://www.rentometer.com/favicon.ico', category: 'Rental Analysis', link: 'https://www.rentometer.com' },
        { name: 'Google Maps', description: 'Free neighborhood and location analysis', logo: 'https://maps.google.com/favicon.ico', category: 'Location Analysis', link: 'https://maps.google.com' },
        { name: 'Canva', description: 'Free real estate marketing materials', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing Materials', link: 'https://www.canva.com' },
        { name: 'LinkedIn', description: 'Free real estate networking and lead generation', logo: 'https://www.linkedin.com/favicon.ico', category: 'Networking', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free invoicing for real estate services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free real estate website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'cryptocurrency-trading': [
        { name: 'CoinGecko', description: 'Free cryptocurrency market data and analysis', logo: 'https://www.coingecko.com/favicon.ico', category: 'Market Data', link: 'https://www.coingecko.com' },
        { name: 'CoinMarketCap', description: 'Free crypto market capitalization and prices', logo: 'https://coinmarketcap.com/favicon.ico', category: 'Market Data', link: 'https://coinmarketcap.com' },
        { name: 'TradingView', description: 'Free crypto charting and technical analysis', logo: 'https://www.tradingview.com/favicon.ico', category: 'Technical Analysis', link: 'https://www.tradingview.com' },
        { name: 'ChatGPT', description: 'Free AI crypto market analysis and trading strategies', logo: 'https://openai.com/favicon.ico', category: 'AI Trading Assistant', link: 'https://chat.openai.com' },
        { name: 'Binance', description: 'Free cryptocurrency exchange and trading', logo: 'https://www.binance.com/favicon.ico', category: 'Trading Platform', link: 'https://www.binance.com' },
        { name: 'Coinbase', description: 'Free cryptocurrency exchange and wallet', logo: 'https://www.coinbase.com/favicon.ico', category: 'Trading Platform', link: 'https://www.coinbase.com' },
        { name: 'CryptoCompare', description: 'Free crypto news and market analysis', logo: 'https://www.cryptocompare.com/favicon.ico', category: 'Market News', link: 'https://www.cryptocompare.com' },
        { name: 'Google Sheets', description: 'Free crypto portfolio tracking and analysis', logo: 'https://sheets.google.com/favicon.ico', category: 'Portfolio Management', link: 'https://sheets.google.com' },
        { name: 'Reddit', description: 'Free crypto community discussions and insights', logo: 'https://www.reddit.com/favicon.ico', category: 'Community Research', link: 'https://www.reddit.com/r/cryptocurrency' },
        { name: 'YouTube', description: 'Free crypto education and analysis videos', logo: 'https://www.youtube.com/favicon.ico', category: 'Education', link: 'https://www.youtube.com' },
        { name: 'Telegram', description: 'Free crypto trading groups and signals', logo: 'https://telegram.org/favicon.ico', category: 'Trading Signals', link: 'https://telegram.org' },
        { name: 'Google Analytics', description: 'Free crypto trading website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'stock-market-analysis': [
        { name: 'Yahoo Finance', description: 'Free stock market data and analysis', logo: 'https://finance.yahoo.com/favicon.ico', category: 'Market Data', link: 'https://finance.yahoo.com' },
        { name: 'Google Finance', description: 'Free stock quotes and financial news', logo: 'https://www.google.com/finance/favicon.ico', category: 'Market Data', link: 'https://www.google.com/finance' },
        { name: 'TradingView', description: 'Free stock charting and technical analysis', logo: 'https://www.tradingview.com/favicon.ico', category: 'Technical Analysis', link: 'https://www.tradingview.com' },
        { name: 'ChatGPT', description: 'Free AI stock market analysis and investment research', logo: 'https://openai.com/favicon.ico', category: 'AI Investment Assistant', link: 'https://chat.openai.com' },
        { name: 'SEC EDGAR', description: 'Free company filings and financial reports', logo: 'https://www.sec.gov/favicon.ico', category: 'Financial Research', link: 'https://www.sec.gov/edgar' },
        { name: 'Finviz', description: 'Free stock screener and market maps', logo: 'https://finviz.com/favicon.ico', category: 'Stock Screening', link: 'https://finviz.com' },
        { name: 'Seeking Alpha', description: 'Free stock analysis and investment insights', logo: 'https://seekingalpha.com/favicon.ico', category: 'Investment Research', link: 'https://seekingalpha.com' },
        { name: 'Google Sheets', description: 'Free portfolio tracking and analysis', logo: 'https://sheets.google.com/favicon.ico', category: 'Portfolio Management', link: 'https://sheets.google.com' },
        { name: 'Reddit', description: 'Free stock market discussions and DD', logo: 'https://www.reddit.com/favicon.ico', category: 'Community Research', link: 'https://www.reddit.com/r/investing' },
        { name: 'Morningstar', description: 'Free stock research and ratings', logo: 'https://www.morningstar.com/favicon.ico', category: 'Investment Research', link: 'https://www.morningstar.com' },
        { name: 'Canva', description: 'Free investment analysis presentations', logo: 'https://www.canva.com/favicon.ico', category: 'Presentation Tools', link: 'https://www.canva.com' },
        { name: 'Google Analytics', description: 'Free investment website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'personal-finance-coaching': [
        { name: 'Mint', description: 'Free personal budgeting and expense tracking', logo: 'https://www.mint.com/favicon.ico', category: 'Budgeting Tools', link: 'https://www.mint.com' },
        { name: 'YNAB', description: 'Free trial budgeting and financial planning', logo: 'https://www.youneedabudget.com/favicon.ico', category: 'Budgeting Tools', link: 'https://www.youneedabudget.com' },
        { name: 'ChatGPT', description: 'Free AI personal finance advice and planning', logo: 'https://openai.com/favicon.ico', category: 'AI Finance Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Sheets', description: 'Free budget templates and financial tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Financial Planning', link: 'https://sheets.google.com' },
        { name: 'Zoom', description: 'Free client coaching sessions', logo: 'https://zoom.us/favicon.ico', category: 'Client Coaching', link: 'https://zoom.us' },
        { name: 'Calendly', description: 'Free coaching appointment scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Canva', description: 'Free financial education materials', logo: 'https://www.canva.com/favicon.ico', category: 'Educational Materials', link: 'https://www.canva.com' },
        { name: 'YouTube', description: 'Free financial education content creation', logo: 'https://www.youtube.com/favicon.ico', category: 'Content Creation', link: 'https://www.youtube.com' },
        { name: 'Mailchimp', description: 'Free financial newsletter and client communication', logo: 'https://mailchimp.com/favicon.ico', category: 'Client Communication', link: 'https://mailchimp.com' },
        { name: 'LinkedIn', description: 'Free financial coaching networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free invoicing for coaching services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free coaching website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'insurance-brokerage': [
        { name: 'Insurify', description: 'Free insurance quote comparison platform', logo: 'https://www.insurify.com/favicon.ico', category: 'Quote Comparison', link: 'https://www.insurify.com' },
        { name: 'The Zebra', description: 'Free auto insurance comparison', logo: 'https://www.thezebra.com/favicon.ico', category: 'Auto Insurance', link: 'https://www.thezebra.com' },
        { name: 'ChatGPT', description: 'Free AI insurance advice and policy explanations', logo: 'https://openai.com/favicon.ico', category: 'AI Insurance Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Sheets', description: 'Free client policy tracking and comparison', logo: 'https://sheets.google.com/favicon.ico', category: 'Policy Management', link: 'https://sheets.google.com' },
        { name: 'Zoom', description: 'Free client consultations and policy reviews', logo: 'https://zoom.us/favicon.ico', category: 'Client Consultation', link: 'https://zoom.us' },
        { name: 'Calendly', description: 'Free insurance consultation scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Google Forms', description: 'Free client intake and insurance needs assessment', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Canva', description: 'Free insurance marketing materials', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing Materials', link: 'https://www.canva.com' },
        { name: 'LinkedIn', description: 'Free insurance industry networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Mailchimp', description: 'Free insurance newsletter and client updates', logo: 'https://mailchimp.com/favicon.ico', category: 'Client Communication', link: 'https://mailchimp.com' },
        { name: 'Wave', description: 'Free invoicing for brokerage services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free insurance website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'tax-preparation-services': [
        { name: 'IRS Free File', description: 'Free tax filing software and forms', logo: 'https://www.irs.gov/favicon.ico', category: 'Tax Filing', link: 'https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free' },
        { name: 'TurboTax', description: 'Free basic tax preparation software', logo: 'https://turbotax.intuit.com/favicon.ico', category: 'Tax Software', link: 'https://turbotax.intuit.com' },
        { name: 'ChatGPT', description: 'Free AI tax advice and deduction suggestions', logo: 'https://openai.com/favicon.ico', category: 'AI Tax Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Sheets', description: 'Free tax document organization and tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Document Management', link: 'https://sheets.google.com' },
        { name: 'Zoom', description: 'Free client tax consultations', logo: 'https://zoom.us/favicon.ico', category: 'Client Consultation', link: 'https://zoom.us' },
        { name: 'Calendly', description: 'Free tax appointment scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Google Forms', description: 'Free client tax information intake forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Intake', link: 'https://forms.google.com' },
        { name: 'DocuSign', description: 'Free electronic signature for tax documents', logo: 'https://www.docusign.com/favicon.ico', category: 'Document Signing', link: 'https://www.docusign.com' },
        { name: 'Canva', description: 'Free tax service marketing materials', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing Materials', link: 'https://www.canva.com' },
        { name: 'LinkedIn', description: 'Free tax professional networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free invoicing for tax services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free tax service website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'accounting-services': [
        { name: 'Wave Accounting', description: 'Free small business accounting software', logo: 'https://www.waveapps.com/favicon.ico', category: 'Accounting Software', link: 'https://www.waveapps.com' },
        { name: 'GnuCash', description: 'Free open-source accounting software', logo: 'https://www.gnucash.org/favicon.ico', category: 'Accounting Software', link: 'https://www.gnucash.org' },
        { name: 'ChatGPT', description: 'Free AI accounting advice and bookkeeping help', logo: 'https://openai.com/favicon.ico', category: 'AI Accounting Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Sheets', description: 'Free accounting templates and financial tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Financial Management', link: 'https://sheets.google.com' },
        { name: 'Zoom', description: 'Free client accounting consultations', logo: 'https://zoom.us/favicon.ico', category: 'Client Consultation', link: 'https://zoom.us' },
        { name: 'Calendly', description: 'Free accounting appointment scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Google Forms', description: 'Free client financial information intake', logo: 'https://forms.google.com/favicon.ico', category: 'Client Intake', link: 'https://forms.google.com' },
        { name: 'QuickBooks', description: 'Free trial accounting and bookkeeping', logo: 'https://quickbooks.intuit.com/favicon.ico', category: 'Accounting Software', link: 'https://quickbooks.intuit.com' },
        { name: 'Canva', description: 'Free accounting service marketing materials', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing Materials', link: 'https://www.canva.com' },
        { name: 'LinkedIn', description: 'Free accounting professional networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'DocuSign', description: 'Free electronic signatures for contracts', logo: 'https://www.docusign.com/favicon.ico', category: 'Document Management', link: 'https://www.docusign.com' },
        { name: 'Google Analytics', description: 'Free accounting website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'business-consulting': [
        { name: 'ChatGPT', description: 'Free AI business strategy and consulting advice', logo: 'https://openai.com/favicon.ico', category: 'AI Business Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Sheets', description: 'Free business analysis and planning templates', logo: 'https://sheets.google.com/favicon.ico', category: 'Business Planning', link: 'https://sheets.google.com' },
        { name: 'Canva', description: 'Free business presentations and proposals', logo: 'https://www.canva.com/favicon.ico', category: 'Presentation Tools', link: 'https://www.canva.com' },
        { name: 'Zoom', description: 'Free client business consultations', logo: 'https://zoom.us/favicon.ico', category: 'Client Consultation', link: 'https://zoom.us' },
        { name: 'Calendly', description: 'Free consulting appointment scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'LinkedIn', description: 'Free business networking and lead generation', logo: 'https://www.linkedin.com/favicon.ico', category: 'Business Development', link: 'https://www.linkedin.com' },
        { name: 'Google Forms', description: 'Free business assessment and intake forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Trello', description: 'Free project management for consulting engagements', logo: 'https://trello.com/favicon.ico', category: 'Project Management', link: 'https://trello.com' },
        { name: 'SurveyMonkey', description: 'Free business surveys and market research', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Market Research', link: 'https://www.surveymonkey.com' },
        { name: 'Google Analytics', description: 'Free business website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Wave', description: 'Free invoicing for consulting services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Slack', description: 'Free team communication for consulting projects', logo: 'https://slack.com/favicon.ico', category: 'Team Communication', link: 'https://slack.com' }
    ],
    'market-research-services': [
        { name: 'Google Trends', description: 'Free market trend analysis and insights', logo: 'https://trends.google.com/favicon.ico', category: 'Trend Analysis', link: 'https://trends.google.com' },
        { name: 'SurveyMonkey', description: 'Free market research surveys and data collection', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Survey Research', link: 'https://www.surveymonkey.com' },
        { name: 'ChatGPT', description: 'Free AI market analysis and research insights', logo: 'https://openai.com/favicon.ico', category: 'AI Research Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Forms', description: 'Free survey creation and data collection', logo: 'https://forms.google.com/favicon.ico', category: 'Data Collection', link: 'https://forms.google.com' },
        { name: 'Google Sheets', description: 'Free data analysis and research reporting', logo: 'https://sheets.google.com/favicon.ico', category: 'Data Analysis', link: 'https://sheets.google.com' },
        { name: 'Statista', description: 'Free market statistics and industry reports', logo: 'https://www.statista.com/favicon.ico', category: 'Market Data', link: 'https://www.statista.com' },
        { name: 'Census.gov', description: 'Free demographic and economic data', logo: 'https://www.census.gov/favicon.ico', category: 'Demographic Data', link: 'https://www.census.gov' },
        { name: 'Pew Research', description: 'Free social and demographic research', logo: 'https://www.pewresearch.org/favicon.ico', category: 'Social Research', link: 'https://www.pewresearch.org' },
        { name: 'Canva', description: 'Free research report design and presentations', logo: 'https://www.canva.com/favicon.ico', category: 'Report Design', link: 'https://www.canva.com' },
        { name: 'LinkedIn', description: 'Free professional networking and B2B research', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Research', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free invoicing for research services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free research website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'brand-strategy-consulting': [
        { name: 'Canva', description: 'Free brand design and visual identity creation', logo: 'https://www.canva.com/favicon.ico', category: 'Brand Design', link: 'https://www.canva.com' },
        { name: 'ChatGPT', description: 'Free AI brand strategy and messaging development', logo: 'https://openai.com/favicon.ico', category: 'AI Brand Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Trends', description: 'Free brand trend analysis and market insights', logo: 'https://trends.google.com/favicon.ico', category: 'Brand Research', link: 'https://trends.google.com' },
        { name: 'Coolors', description: 'Free brand color palette generator', logo: 'https://coolors.co/favicon.ico', category: 'Brand Design', link: 'https://coolors.co' },
        { name: 'Google Fonts', description: 'Free typography for brand identity', logo: 'https://fonts.google.com/favicon.ico', category: 'Brand Typography', link: 'https://fonts.google.com' },
        { name: 'Unsplash', description: 'Free stock photos for brand materials', logo: 'https://unsplash.com/favicon.ico', category: 'Brand Assets', link: 'https://unsplash.com' },
        { name: 'SurveyMonkey', description: 'Free brand perception surveys', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Brand Research', link: 'https://www.surveymonkey.com' },
        { name: 'Google Sheets', description: 'Free brand strategy planning and tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Strategy Planning', link: 'https://sheets.google.com' },
        { name: 'Zoom', description: 'Free brand strategy client consultations', logo: 'https://zoom.us/favicon.ico', category: 'Client Consultation', link: 'https://zoom.us' },
        { name: 'LinkedIn', description: 'Free brand consulting networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free invoicing for brand consulting services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free brand website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Brand Analytics', link: 'https://analytics.google.com' }
    ],
    'digital-product-creation': [
        { name: 'Canva', description: 'Free digital product design and graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Product Design', link: 'https://www.canva.com' },
        { name: 'ChatGPT', description: 'Free AI content creation and product ideation', logo: 'https://openai.com/favicon.ico', category: 'AI Content Assistant', link: 'https://chat.openai.com' },
        { name: 'GIMP', description: 'Free image editing for digital products', logo: 'https://www.gimp.org/favicon.ico', category: 'Image Editing', link: 'https://www.gimp.org' },
        { name: 'Gumroad', description: 'Free digital product marketplace and sales', logo: 'https://gumroad.com/favicon.ico', category: 'Sales Platform', link: 'https://gumroad.com' },
        { name: 'Etsy', description: 'Free digital product marketplace', logo: 'https://www.etsy.com/favicon.ico', category: 'Marketplace', link: 'https://www.etsy.com' },
        { name: 'Google Drive', description: 'Free digital product storage and delivery', logo: 'https://drive.google.com/favicon.ico', category: 'File Management', link: 'https://drive.google.com' },
        { name: 'Mailchimp', description: 'Free email marketing for product launches', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' },
        { name: 'Pinterest', description: 'Free product marketing and inspiration', logo: 'https://www.pinterest.com/favicon.ico', category: 'Marketing', link: 'https://www.pinterest.com' },
        { name: 'Instagram', description: 'Free product showcase and marketing', logo: 'https://www.instagram.com/favicon.ico', category: 'Social Marketing', link: 'https://www.instagram.com' },
        { name: 'Stripe', description: 'Free payment processing for digital sales', logo: 'https://stripe.com/favicon.ico', category: 'Payment Processing', link: 'https://stripe.com' },
        { name: 'Wave', description: 'Free invoicing for digital product sales', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free product website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' }
    ],
    'online-course-development': [
        { name: 'YouTube', description: 'Free video hosting and course delivery', logo: 'https://www.youtube.com/favicon.ico', category: 'Video Hosting', link: 'https://www.youtube.com' },
        { name: 'OBS Studio', description: 'Free screen recording and video creation', logo: 'https://obsproject.com/favicon.ico', category: 'Video Creation', link: 'https://obsproject.com' },
        { name: 'ChatGPT', description: 'Free AI course content and curriculum creation', logo: 'https://openai.com/favicon.ico', category: 'AI Course Assistant', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free course materials and slide design', logo: 'https://www.canva.com/favicon.ico', category: 'Course Design', link: 'https://www.canva.com' },
        { name: 'Google Classroom', description: 'Free course management and delivery', logo: 'https://classroom.google.com/favicon.ico', category: 'Course Platform', link: 'https://classroom.google.com' },
        { name: 'Zoom', description: 'Free live course sessions and webinars', logo: 'https://zoom.us/favicon.ico', category: 'Live Teaching', link: 'https://zoom.us' },
        { name: 'Google Forms', description: 'Free course assessments and quizzes', logo: 'https://forms.google.com/favicon.ico', category: 'Assessment Tools', link: 'https://forms.google.com' },
        { name: 'Udemy', description: 'Free course marketplace and hosting', logo: 'https://www.udemy.com/favicon.ico', category: 'Course Marketplace', link: 'https://www.udemy.com' },
        { name: 'Coursera', description: 'Free course platform and certification', logo: 'https://www.coursera.org/favicon.ico', category: 'Course Platform', link: 'https://www.coursera.org' },
        { name: 'Mailchimp', description: 'Free student email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Student Communication', link: 'https://mailchimp.com' },
        { name: 'Wave', description: 'Free invoicing for course sales', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free course website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' }
    ],
    'membership-site-business': [
        { name: 'Discord', description: 'Free community platform and member engagement', logo: 'https://discord.com/favicon.ico', category: 'Community Platform', link: 'https://discord.com' },
        { name: 'Facebook Groups', description: 'Free private membership communities', logo: 'https://www.facebook.com/favicon.ico', category: 'Community Platform', link: 'https://www.facebook.com/groups' },
        { name: 'ChatGPT', description: 'Free AI community content and engagement ideas', logo: 'https://openai.com/favicon.ico', category: 'AI Community Assistant', link: 'https://chat.openai.com' },
        { name: 'Mailchimp', description: 'Free member email newsletters', logo: 'https://mailchimp.com/favicon.ico', category: 'Member Communication', link: 'https://mailchimp.com' },
        { name: 'Zoom', description: 'Free member meetings and exclusive sessions', logo: 'https://zoom.us/favicon.ico', category: 'Member Events', link: 'https://zoom.us' },
        { name: 'Canva', description: 'Free membership materials and graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Drive', description: 'Free member resource sharing', logo: 'https://drive.google.com/favicon.ico', category: 'Resource Sharing', link: 'https://drive.google.com' },
        { name: 'Calendly', description: 'Free member consultation scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Member Services', link: 'https://calendly.com' },
        { name: 'Stripe', description: 'Free recurring membership payments', logo: 'https://stripe.com/favicon.ico', category: 'Payment Processing', link: 'https://stripe.com' },
        { name: 'Google Forms', description: 'Free member surveys and feedback', logo: 'https://forms.google.com/favicon.ico', category: 'Member Feedback', link: 'https://forms.google.com' },
        { name: 'Wave', description: 'Free membership billing and invoicing', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free membership site analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' }
    ],
    'affiliate-marketing-network': [
        { name: 'Amazon Associates', description: 'Free affiliate marketing program', logo: 'https://affiliate-program.amazon.com/favicon.ico', category: 'Affiliate Programs', link: 'https://affiliate-program.amazon.com' },
        { name: 'ShareASale', description: 'Free affiliate network and tracking', logo: 'https://www.shareasale.com/favicon.ico', category: 'Affiliate Networks', link: 'https://www.shareasale.com' },
        { name: 'ChatGPT', description: 'Free AI affiliate content and strategy', logo: 'https://openai.com/favicon.ico', category: 'AI Marketing Assistant', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free affiliate marketing graphics and banners', logo: 'https://www.canva.com/favicon.ico', category: 'Marketing Materials', link: 'https://www.canva.com' },
        { name: 'YouTube', description: 'Free affiliate product reviews and marketing', logo: 'https://www.youtube.com/favicon.ico', category: 'Content Marketing', link: 'https://www.youtube.com' },
        { name: 'Instagram', description: 'Free affiliate product promotion', logo: 'https://www.instagram.com/favicon.ico', category: 'Social Marketing', link: 'https://www.instagram.com' },
        { name: 'Pinterest', description: 'Free affiliate link sharing and traffic', logo: 'https://www.pinterest.com/favicon.ico', category: 'Traffic Generation', link: 'https://www.pinterest.com' },
        { name: 'Google Sheets', description: 'Free affiliate tracking and analytics', logo: 'https://sheets.google.com/favicon.ico', category: 'Performance Tracking', link: 'https://sheets.google.com' },
        { name: 'Mailchimp', description: 'Free affiliate email marketing campaigns', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' },
        { name: 'LinkedIn', description: 'Free B2B affiliate networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free affiliate commission tracking', logo: 'https://www.waveapps.com/favicon.ico', category: 'Financial Tracking', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free affiliate website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' }
    ],
    'influencer-management': [
        { name: 'Instagram', description: 'Free influencer platform and content creation', logo: 'https://www.instagram.com/favicon.ico', category: 'Content Platform', link: 'https://www.instagram.com' },
        { name: 'TikTok', description: 'Free short-form video content platform', logo: 'https://www.tiktok.com/favicon.ico', category: 'Video Platform', link: 'https://www.tiktok.com' },
        { name: 'ChatGPT', description: 'Free AI content ideas and campaign strategies', logo: 'https://openai.com/favicon.ico', category: 'AI Content Assistant', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free influencer content design and templates', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Later', description: 'Free social media scheduling and planning', logo: 'https://later.com/favicon.ico', category: 'Content Scheduling', link: 'https://later.com' },
        { name: 'Linktree', description: 'Free bio link management for influencers', logo: 'https://linktr.ee/favicon.ico', category: 'Link Management', link: 'https://linktr.ee' },
        { name: 'YouTube', description: 'Free long-form content and monetization', logo: 'https://www.youtube.com/favicon.ico', category: 'Video Platform', link: 'https://www.youtube.com' },
        { name: 'Google Sheets', description: 'Free influencer campaign tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Campaign Management', link: 'https://sheets.google.com' },
        { name: 'Mailchimp', description: 'Free influencer audience email marketing', logo: 'https://mailchimp.com/favicon.ico', category: 'Audience Engagement', link: 'https://mailchimp.com' },
        { name: 'Zoom', description: 'Free brand collaboration meetings', logo: 'https://zoom.us/favicon.ico', category: 'Brand Relations', link: 'https://zoom.us' },
        { name: 'Wave', description: 'Free influencer payment and invoicing', logo: 'https://www.waveapps.com/favicon.ico', category: 'Financial Management', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free influencer website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Performance Analytics', link: 'https://analytics.google.com' }
    ],
    'social-media-agency': [
        { name: 'Buffer', description: 'Free social media scheduling and management', logo: 'https://buffer.com/favicon.ico', category: 'Social Media Management', link: 'https://buffer.com' },
        { name: 'Hootsuite', description: 'Free social media dashboard and scheduling', logo: 'https://hootsuite.com/favicon.ico', category: 'Social Media Management', link: 'https://hootsuite.com' },
        { name: 'ChatGPT', description: 'Free AI social media content and strategy', logo: 'https://openai.com/favicon.ico', category: 'AI Content Assistant', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free social media graphics and templates', logo: 'https://www.canva.com/favicon.ico', category: 'Content Design', link: 'https://www.canva.com' },
        { name: 'Unsplash', description: 'Free stock photos for social media', logo: 'https://unsplash.com/favicon.ico', category: 'Visual Content', link: 'https://unsplash.com' },
        { name: 'Facebook Business', description: 'Free Facebook and Instagram advertising', logo: 'https://business.facebook.com/favicon.ico', category: 'Advertising Platform', link: 'https://business.facebook.com' },
        { name: 'Google Trends', description: 'Free trending topics and hashtag research', logo: 'https://trends.google.com/favicon.ico', category: 'Trend Research', link: 'https://trends.google.com' },
        { name: 'Google Sheets', description: 'Free client campaign tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Campaign Management', link: 'https://sheets.google.com' },
        { name: 'Zoom', description: 'Free client strategy meetings', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'Calendly', description: 'Free client consultation scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Client Management', link: 'https://calendly.com' },
        { name: 'Wave', description: 'Free agency invoicing and billing', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free social media performance analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Performance Analytics', link: 'https://analytics.google.com' }
    ],
    
    'email-marketing-services': [
        { name: 'Mailchimp', description: 'Free email marketing platform and automation', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Platform', link: 'https://mailchimp.com' },
        { name: 'ConvertKit', description: 'Free email marketing for creators', logo: 'https://convertkit.com/favicon.ico', category: 'Email Platform', link: 'https://convertkit.com' },
        { name: 'ChatGPT', description: 'Free AI email content and campaign ideas', logo: 'https://openai.com/favicon.ico', category: 'AI Email Assistant', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free email template design and graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Email Design', link: 'https://www.canva.com' },
        { name: 'Google Forms', description: 'Free lead capture and subscriber forms', logo: 'https://forms.google.com/favicon.ico', category: 'Lead Generation', link: 'https://forms.google.com' },
        { name: 'Typeform', description: 'Free interactive forms and surveys', logo: 'https://www.typeform.com/favicon.ico', category: 'Lead Generation', link: 'https://www.typeform.com' },
        { name: 'Google Sheets', description: 'Free email list management and tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'List Management', link: 'https://sheets.google.com' },
        { name: 'Unsplash', description: 'Free images for email campaigns', logo: 'https://unsplash.com/favicon.ico', category: 'Visual Content', link: 'https://unsplash.com' },
        { name: 'Zoom', description: 'Free client email strategy consultations', logo: 'https://zoom.us/favicon.ico', category: 'Client Consultation', link: 'https://zoom.us' },
        { name: 'LinkedIn', description: 'Free B2B email marketing networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free invoicing for email marketing services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free email campaign performance tracking', logo: 'https://analytics.google.com/favicon.ico', category: 'Campaign Analytics', link: 'https://analytics.google.com' }
    ],
    'seo-consulting': [
        { name: 'Google Search Console', description: 'Free SEO monitoring and optimization', logo: 'https://search.google.com/favicon.ico', category: 'SEO Tools', link: 'https://search.google.com/search-console' },
        { name: 'Google Analytics', description: 'Free website traffic and SEO analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'SEO Analytics', link: 'https://analytics.google.com' },
        { name: 'ChatGPT', description: 'Free AI SEO content and keyword research', logo: 'https://openai.com/favicon.ico', category: 'AI SEO Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Keyword Planner', description: 'Free keyword research and planning', logo: 'https://ads.google.com/favicon.ico', category: 'Keyword Research', link: 'https://ads.google.com/home/tools/keyword-planner' },
        { name: 'Ubersuggest', description: 'Free SEO keyword and competitor analysis', logo: 'https://neilpatel.com/favicon.ico', category: 'SEO Research', link: 'https://neilpatel.com/ubersuggest' },
        { name: 'Answer The Public', description: 'Free keyword and content idea generation', logo: 'https://answerthepublic.com/favicon.ico', category: 'Content Research', link: 'https://answerthepublic.com' },
        { name: 'Google Trends', description: 'Free trending keyword and topic research', logo: 'https://trends.google.com/favicon.ico', category: 'Trend Research', link: 'https://trends.google.com' },
        { name: 'Screaming Frog', description: 'Free SEO website crawler and audit tool', logo: 'https://www.screamingfrog.co.uk/favicon.ico', category: 'SEO Audit', link: 'https://www.screamingfrog.co.uk/seo-spider' },
        { name: 'Google PageSpeed Insights', description: 'Free website speed optimization', logo: 'https://pagespeed.web.dev/favicon.ico', category: 'Site Optimization', link: 'https://pagespeed.web.dev' },
        { name: 'Zoom', description: 'Free SEO client consultations', logo: 'https://zoom.us/favicon.ico', category: 'Client Consultation', link: 'https://zoom.us' },
        { name: 'Wave', description: 'Free invoicing for SEO services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Sheets', description: 'Free SEO reporting and tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'SEO Reporting', link: 'https://sheets.google.com' }
    ],
    'web-development-services': [
        { name: 'Visual Studio Code', description: 'Free code editor and development environment', logo: 'https://code.visualstudio.com/favicon.ico', category: 'Development Tools', link: 'https://code.visualstudio.com' },
        { name: 'GitHub', description: 'Free code repository and version control', logo: 'https://github.com/favicon.ico', category: 'Version Control', link: 'https://github.com' },
        { name: 'ChatGPT', description: 'Free AI code assistance and debugging', logo: 'https://openai.com/favicon.ico', category: 'AI Development Assistant', link: 'https://chat.openai.com' },
        { name: 'Netlify', description: 'Free website hosting and deployment', logo: 'https://www.netlify.com/favicon.ico', category: 'Web Hosting', link: 'https://www.netlify.com' },
        { name: 'Vercel', description: 'Free frontend hosting and deployment', logo: 'https://vercel.com/favicon.ico', category: 'Web Hosting', link: 'https://vercel.com' },
        { name: 'Figma', description: 'Free web design and prototyping', logo: 'https://www.figma.com/favicon.ico', category: 'Design Tools', link: 'https://www.figma.com' },
        { name: 'Bootstrap', description: 'Free CSS framework for responsive design', logo: 'https://getbootstrap.com/favicon.ico', category: 'CSS Framework', link: 'https://getbootstrap.com' },
        { name: 'Stack Overflow', description: 'Free developer community and problem solving', logo: 'https://stackoverflow.com/favicon.ico', category: 'Developer Community', link: 'https://stackoverflow.com' },
        { name: 'Google Fonts', description: 'Free web fonts and typography', logo: 'https://fonts.google.com/favicon.ico', category: 'Web Fonts', link: 'https://fonts.google.com' },
        { name: 'Zoom', description: 'Free client project meetings', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'Wave', description: 'Free invoicing for development services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free website performance analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Web Analytics', link: 'https://analytics.google.com' }
    ],
    'app-development-business': [
        { name: 'Android Studio', description: 'Free Android app development IDE', logo: 'https://developer.android.com/favicon.ico', category: 'Development Tools', link: 'https://developer.android.com/studio' },
        { name: 'Xcode', description: 'Free iOS app development environment', logo: 'https://developer.apple.com/favicon.ico', category: 'Development Tools', link: 'https://developer.apple.com/xcode' },
        { name: 'ChatGPT', description: 'Free AI app development and coding assistance', logo: 'https://openai.com/favicon.ico', category: 'AI Development Assistant', link: 'https://chat.openai.com' },
        { name: 'Flutter', description: 'Free cross-platform app development framework', logo: 'https://flutter.dev/favicon.ico', category: 'Development Framework', link: 'https://flutter.dev' },
        { name: 'React Native', description: 'Free mobile app development framework', logo: 'https://reactnative.dev/favicon.ico', category: 'Development Framework', link: 'https://reactnative.dev' },
        { name: 'GitHub', description: 'Free app code repository and collaboration', logo: 'https://github.com/favicon.ico', category: 'Version Control', link: 'https://github.com' },
        { name: 'Figma', description: 'Free app UI/UX design and prototyping', logo: 'https://www.figma.com/favicon.ico', category: 'Design Tools', link: 'https://www.figma.com' },
        { name: 'Firebase', description: 'Free app backend and database services', logo: 'https://firebase.google.com/favicon.ico', category: 'Backend Services', link: 'https://firebase.google.com' },
        { name: 'Google Play Console', description: 'Free Android app publishing platform', logo: 'https://play.google.com/favicon.ico', category: 'App Publishing', link: 'https://play.google.com/console' },
        { name: 'App Store Connect', description: 'Free iOS app publishing platform', logo: 'https://appstoreconnect.apple.com/favicon.ico', category: 'App Publishing', link: 'https://appstoreconnect.apple.com' },
        { name: 'Wave', description: 'Free invoicing for app development services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free app performance and user analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'App Analytics', link: 'https://analytics.google.com' }
    ],
    'virtual-assistant-services': [
        { name: 'ChatGPT', description: 'Free AI assistance for virtual admin tasks', logo: 'https://openai.com/favicon.ico', category: 'AI Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Workspace', description: 'Free productivity suite for VA services', logo: 'https://workspace.google.com/favicon.ico', category: 'Productivity Tools', link: 'https://workspace.google.com' },
        { name: 'Calendly', description: 'Free appointment scheduling for clients', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Zoom', description: 'Free client meetings and consultations', logo: 'https://zoom.us/favicon.ico', category: 'Communication', link: 'https://zoom.us' },
        { name: 'Slack', description: 'Free team communication and client updates', logo: 'https://slack.com/favicon.ico', category: 'Communication', link: 'https://slack.com' },
        { name: 'Trello', description: 'Free project management and task tracking', logo: 'https://trello.com/favicon.ico', category: 'Project Management', link: 'https://trello.com' },
        { name: 'Canva', description: 'Free design tools for client presentations', logo: 'https://www.canva.com/favicon.ico', category: 'Design Tools', link: 'https://www.canva.com' },
        { name: 'LinkedIn', description: 'Free professional networking and lead generation', logo: 'https://www.linkedin.com/favicon.ico', category: 'Business Development', link: 'https://www.linkedin.com' },
        { name: 'Upwork', description: 'Free freelance platform for VA services', logo: 'https://www.upwork.com/favicon.ico', category: 'Freelance Platform', link: 'https://www.upwork.com' },
        { name: 'Fiverr', description: 'Free marketplace for virtual assistant services', logo: 'https://www.fiverr.com/favicon.ico', category: 'Service Marketplace', link: 'https://www.fiverr.com' },
        { name: 'Wave', description: 'Free invoicing for VA services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free VA business website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'data-entry-services': [
        { name: 'Google Sheets', description: 'Free spreadsheet and data management', logo: 'https://sheets.google.com/favicon.ico', category: 'Data Management', link: 'https://sheets.google.com' },
        { name: 'Microsoft Excel Online', description: 'Free online spreadsheet application', logo: 'https://office.live.com/favicon.ico', category: 'Data Management', link: 'https://office.live.com/start/Excel.aspx' },
        { name: 'ChatGPT', description: 'Free AI data processing and formatting assistance', logo: 'https://openai.com/favicon.ico', category: 'AI Data Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Forms', description: 'Free data collection and form creation', logo: 'https://forms.google.com/favicon.ico', category: 'Data Collection', link: 'https://forms.google.com' },
        { name: 'Airtable', description: 'Free database and data organization', logo: 'https://airtable.com/favicon.ico', category: 'Database Management', link: 'https://airtable.com' },
        { name: 'OpenRefine', description: 'Free data cleaning and transformation tool', logo: 'https://openrefine.org/favicon.ico', category: 'Data Processing', link: 'https://openrefine.org' },
        { name: 'Upwork', description: 'Free platform for data entry projects', logo: 'https://www.upwork.com/favicon.ico', category: 'Freelance Platform', link: 'https://www.upwork.com' },
        { name: 'Fiverr', description: 'Free marketplace for data entry services', logo: 'https://www.fiverr.com/favicon.ico', category: 'Service Marketplace', link: 'https://www.fiverr.com' },
        { name: 'Zoom', description: 'Free client consultations and project reviews', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'LinkedIn', description: 'Free professional networking for data services', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free invoicing for data entry services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free data service website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'translation-services': [
        { name: 'Google Translate', description: 'Free AI translation for reference and assistance', logo: 'https://translate.google.com/favicon.ico', category: 'Translation Tools', link: 'https://translate.google.com' },
        { name: 'DeepL', description: 'Free high-quality AI translation service', logo: 'https://www.deepl.com/favicon.ico', category: 'Translation Tools', link: 'https://www.deepl.com' },
        { name: 'ChatGPT', description: 'Free AI translation and localization assistance', logo: 'https://openai.com/favicon.ico', category: 'AI Translation Assistant', link: 'https://chat.openai.com' },
        { name: 'Linguee', description: 'Free translation dictionary and examples', logo: 'https://www.linguee.com/favicon.ico', category: 'Translation Reference', link: 'https://www.linguee.com' },
        { name: 'Google Docs', description: 'Free document translation and collaboration', logo: 'https://docs.google.com/favicon.ico', category: 'Document Management', link: 'https://docs.google.com' },
        { name: 'Grammarly', description: 'Free grammar checking for translated content', logo: 'https://www.grammarly.com/favicon.ico', category: 'Quality Assurance', link: 'https://www.grammarly.com' },
        { name: 'Upwork', description: 'Free platform for translation projects', logo: 'https://www.upwork.com/favicon.ico', category: 'Freelance Platform', link: 'https://www.upwork.com' },
        { name: 'Fiverr', description: 'Free marketplace for translation services', logo: 'https://www.fiverr.com/favicon.ico', category: 'Service Marketplace', link: 'https://www.fiverr.com' },
        { name: 'ProZ', description: 'Free translator community and resources', logo: 'https://www.proz.com/favicon.ico', category: 'Professional Community', link: 'https://www.proz.com' },
        { name: 'Zoom', description: 'Free client consultations and project discussions', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'Wave', description: 'Free invoicing for translation services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free translation service website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'transcription-services': [
        { name: 'Otter.ai', description: 'Free AI transcription and note-taking', logo: 'https://otter.ai/favicon.ico', category: 'AI Transcription', link: 'https://otter.ai' },
        { name: 'Google Docs Voice Typing', description: 'Free voice-to-text transcription', logo: 'https://docs.google.com/favicon.ico', category: 'Voice Transcription', link: 'https://docs.google.com' },
        { name: 'ChatGPT', description: 'Free AI transcription editing and formatting', logo: 'https://openai.com/favicon.ico', category: 'AI Transcription Assistant', link: 'https://chat.openai.com' },
        { name: 'Audacity', description: 'Free audio editing and enhancement', logo: 'https://www.audacityteam.org/favicon.ico', category: 'Audio Processing', link: 'https://www.audacityteam.org' },
        { name: 'VLC Media Player', description: 'Free audio and video playback for transcription', logo: 'https://www.videolan.org/favicon.ico', category: 'Media Playback', link: 'https://www.videolan.org/vlc' },
        { name: 'Express Scribe', description: 'Free transcription playback software', logo: 'https://www.nch.com.au/favicon.ico', category: 'Transcription Software', link: 'https://www.nch.com.au/scribe' },
        { name: 'Rev', description: 'Free transcription platform and marketplace', logo: 'https://www.rev.com/favicon.ico', category: 'Transcription Platform', link: 'https://www.rev.com' },
        { name: 'TranscribeMe', description: 'Free transcription work platform', logo: 'https://transcribeme.com/favicon.ico', category: 'Transcription Platform', link: 'https://transcribeme.com' },
        { name: 'Zoom', description: 'Free client meetings and audio collection', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'Google Drive', description: 'Free audio file storage and sharing', logo: 'https://drive.google.com/favicon.ico', category: 'File Management', link: 'https://drive.google.com' },
        { name: 'Wave', description: 'Free invoicing for transcription services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free transcription service website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'graphic-design-agency': [
        { name: 'Canva', description: 'Free graphic design platform and templates', logo: 'https://www.canva.com/favicon.ico', category: 'Design Platform', link: 'https://www.canva.com' },
        { name: 'GIMP', description: 'Free professional image editing software', logo: 'https://www.gimp.org/favicon.ico', category: 'Image Editing', link: 'https://www.gimp.org' },
        { name: 'ChatGPT', description: 'Free AI design concepts and creative assistance', logo: 'https://openai.com/favicon.ico', category: 'AI Design Assistant', link: 'https://chat.openai.com' },
        { name: 'Figma', description: 'Free collaborative design and prototyping', logo: 'https://www.figma.com/favicon.ico', category: 'Design Collaboration', link: 'https://www.figma.com' },
        { name: 'Unsplash', description: 'Free high-quality stock photos', logo: 'https://unsplash.com/favicon.ico', category: 'Stock Images', link: 'https://unsplash.com' },
        { name: 'Google Fonts', description: 'Free web fonts and typography', logo: 'https://fonts.google.com/favicon.ico', category: 'Typography', link: 'https://fonts.google.com' },
        { name: 'Coolors', description: 'Free color palette generator', logo: 'https://coolors.co/favicon.ico', category: 'Color Tools', link: 'https://coolors.co' },
        { name: 'Behance', description: 'Free design portfolio and inspiration', logo: 'https://www.behance.net/favicon.ico', category: 'Portfolio Platform', link: 'https://www.behance.net' },
        { name: 'Dribbble', description: 'Free design community and showcase', logo: 'https://dribbble.com/favicon.ico', category: 'Design Community', link: 'https://dribbble.com' },
        { name: 'LinkedIn', description: 'Free professional networking for designers', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free invoicing for design services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free design agency website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'video-editing-services': [
        { name: 'DaVinci Resolve', description: 'Free professional video editing software', logo: 'https://www.blackmagicdesign.com/favicon.ico', category: 'Video Editing', link: 'https://www.blackmagicdesign.com/products/davinciresolve' },
        { name: 'OpenShot', description: 'Free open-source video editor', logo: 'https://www.openshot.org/favicon.ico', category: 'Video Editing', link: 'https://www.openshot.org' },
        { name: 'ChatGPT', description: 'Free AI video concepts and script assistance', logo: 'https://openai.com/favicon.ico', category: 'AI Video Assistant', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free video templates and graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Video Graphics', link: 'https://www.canva.com' },
        { name: 'Unsplash', description: 'Free stock footage and images', logo: 'https://unsplash.com/favicon.ico', category: 'Stock Media', link: 'https://unsplash.com' },
        { name: 'Pixabay', description: 'Free videos, images, and music', logo: 'https://pixabay.com/favicon.ico', category: 'Stock Media', link: 'https://pixabay.com' },
        { name: 'YouTube', description: 'Free video hosting and portfolio showcase', logo: 'https://www.youtube.com/favicon.ico', category: 'Video Platform', link: 'https://www.youtube.com' },
        { name: 'Vimeo', description: 'Free professional video hosting', logo: 'https://vimeo.com/favicon.ico', category: 'Video Platform', link: 'https://vimeo.com' },
        { name: 'Zoom', description: 'Free client consultations and project reviews', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'Google Drive', description: 'Free video file storage and sharing', logo: 'https://drive.google.com/favicon.ico', category: 'File Management', link: 'https://drive.google.com' },
        { name: 'Wave', description: 'Free invoicing for video editing services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free video service website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'podcast-production-agency': [
        { name: 'Audacity', description: 'Free podcast recording and editing software', logo: 'https://www.audacityteam.org/favicon.ico', category: 'Audio Editing', link: 'https://www.audacityteam.org' },
        { name: 'Anchor', description: 'Free podcast hosting and distribution', logo: 'https://anchor.fm/favicon.ico', category: 'Podcast Hosting', link: 'https://anchor.fm' },
        { name: 'ChatGPT', description: 'Free AI podcast content and script writing', logo: 'https://openai.com/favicon.ico', category: 'AI Podcast Assistant', link: 'https://chat.openai.com' },
        { name: 'Canva', description: 'Free podcast cover art and promotional graphics', logo: 'https://www.canva.com/favicon.ico', category: 'Podcast Graphics', link: 'https://www.canva.com' },
        { name: 'Zoom', description: 'Free remote podcast recording', logo: 'https://zoom.us/favicon.ico', category: 'Recording Platform', link: 'https://zoom.us' },
        { name: 'Google Podcasts', description: 'Free podcast distribution platform', logo: 'https://podcasts.google.com/favicon.ico', category: 'Podcast Distribution', link: 'https://podcasts.google.com' },
        { name: 'Spotify for Podcasters', description: 'Free podcast analytics and hosting', logo: 'https://podcasters.spotify.com/favicon.ico', category: 'Podcast Platform', link: 'https://podcasters.spotify.com' },
        { name: 'Freesound', description: 'Free sound effects and audio clips', logo: 'https://freesound.org/favicon.ico', category: 'Audio Resources', link: 'https://freesound.org' },
        { name: 'YouTube', description: 'Free video podcast hosting and promotion', logo: 'https://www.youtube.com/favicon.ico', category: 'Video Podcasting', link: 'https://www.youtube.com' },
        { name: 'LinkedIn', description: 'Free podcast promotion and networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Podcast Marketing', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free invoicing for podcast production services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free podcast website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Podcast Analytics', link: 'https://analytics.google.com' }
    ],
    'content-writing-services': [
        { name: 'Google Docs', description: 'Free collaborative writing and editing', logo: 'https://docs.google.com/favicon.ico', category: 'Writing Platform', link: 'https://docs.google.com' },
        { name: 'ChatGPT', description: 'Free AI writing assistance and content generation', logo: 'https://openai.com/favicon.ico', category: 'AI Writing Assistant', link: 'https://chat.openai.com' },
        { name: 'Grammarly', description: 'Free grammar and style checking', logo: 'https://www.grammarly.com/favicon.ico', category: 'Writing Tools', link: 'https://www.grammarly.com' },
        { name: 'Hemingway Editor', description: 'Free writing clarity and readability tool', logo: 'https://hemingwayapp.com/favicon.ico', category: 'Writing Tools', link: 'https://hemingwayapp.com' },
        { name: 'Google Trends', description: 'Free content topic research and trends', logo: 'https://trends.google.com/favicon.ico', category: 'Content Research', link: 'https://trends.google.com' },
        { name: 'Answer The Public', description: 'Free content idea generation', logo: 'https://answerthepublic.com/favicon.ico', category: 'Content Research', link: 'https://answerthepublic.com' },
        { name: 'Upwork', description: 'Free platform for content writing projects', logo: 'https://www.upwork.com/favicon.ico', category: 'Freelance Platform', link: 'https://www.upwork.com' },
        { name: 'Contently', description: 'Free content marketing platform', logo: 'https://contently.com/favicon.ico', category: 'Content Platform', link: 'https://contently.com' },
        { name: 'Medium', description: 'Free writing platform and portfolio', logo: 'https://medium.com/favicon.ico', category: 'Publishing Platform', link: 'https://medium.com' },
        { name: 'LinkedIn', description: 'Free professional writing and networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free invoicing for content writing services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free content service website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Content Analytics', link: 'https://analytics.google.com' }
    ],
    'copywriting-agency': [
        { name: 'Google Docs', description: 'Free copywriting and client collaboration', logo: 'https://docs.google.com/favicon.ico', category: 'Writing Platform', link: 'https://docs.google.com' },
        { name: 'ChatGPT', description: 'Free AI copywriting and marketing content', logo: 'https://openai.com/favicon.ico', category: 'AI Copywriting Assistant', link: 'https://chat.openai.com' },
        { name: 'Grammarly', description: 'Free copy editing and proofreading', logo: 'https://www.grammarly.com/favicon.ico', category: 'Editing Tools', link: 'https://www.grammarly.com' },
        { name: 'Canva', description: 'Free marketing materials and ad designs', logo: 'https://www.canva.com/favicon.ico', category: 'Design Tools', link: 'https://www.canva.com' },
        { name: 'Google Trends', description: 'Free market research for copy angles', logo: 'https://trends.google.com/favicon.ico', category: 'Market Research', link: 'https://trends.google.com' },
        { name: 'CoSchedule Headline Analyzer', description: 'Free headline optimization tool', logo: 'https://coschedule.com/favicon.ico', category: 'Copy Optimization', link: 'https://coschedule.com/headline-analyzer' },
        { name: 'Upwork', description: 'Free platform for copywriting projects', logo: 'https://www.upwork.com/favicon.ico', category: 'Freelance Platform', link: 'https://www.upwork.com' },
        { name: 'Fiverr', description: 'Free marketplace for copywriting services', logo: 'https://www.fiverr.com/favicon.ico', category: 'Service Marketplace', link: 'https://www.fiverr.com' },
        { name: 'LinkedIn', description: 'Free copywriter networking and lead generation', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Zoom', description: 'Free client strategy sessions and briefings', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'Wave', description: 'Free invoicing for copywriting services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free copywriting agency website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],
    'virtual-bookkeeping': [
        { name: 'Wave Accounting', description: 'Free bookkeeping and accounting software', logo: 'https://www.waveapps.com/favicon.ico', category: 'Accounting Software', link: 'https://www.waveapps.com' },
        { name: 'GnuCash', description: 'Free open-source accounting software', logo: 'https://www.gnucash.org/favicon.ico', category: 'Accounting Software', link: 'https://www.gnucash.org' },
        { name: 'ChatGPT', description: 'Free AI bookkeeping assistance and guidance', logo: 'https://openai.com/favicon.ico', category: 'AI Bookkeeping Assistant', link: 'https://chat.openai.com' },
        { name: 'Google Sheets', description: 'Free financial tracking and reporting', logo: 'https://sheets.google.com/favicon.ico', category: 'Financial Management', link: 'https://sheets.google.com' },
        { name: 'QuickBooks', description: 'Free trial professional bookkeeping software', logo: 'https://quickbooks.intuit.com/favicon.ico', category: 'Accounting Software', link: 'https://quickbooks.intuit.com' },
        { name: 'Zoom', description: 'Free client bookkeeping consultations', logo: 'https://zoom.us/favicon.ico', category: 'Client Communication', link: 'https://zoom.us' },
        { name: 'Google Drive', description: 'Free secure document storage and sharing', logo: 'https://drive.google.com/favicon.ico', category: 'Document Management', link: 'https://drive.google.com' },
        { name: 'DocuSign', description: 'Free electronic signatures for contracts', logo: 'https://www.docusign.com/favicon.ico', category: 'Document Signing', link: 'https://www.docusign.com' },
        { name: 'LinkedIn', description: 'Free bookkeeping professional networking', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Calendly', description: 'Free client appointment scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Upwork', description: 'Free platform for bookkeeping projects', logo: 'https://www.upwork.com/favicon.ico', category: 'Freelance Platform', link: 'https://www.upwork.com' },
        { name: 'Google Analytics', description: 'Free bookkeeping service website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],

    'online-tutoring-platform': [
        { name: 'Zoom', description: 'Video conferencing platform for online tutoring sessions', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Video Conferencing', link: 'https://zoom.us' },
        { name: 'Google Meet', description: 'Free video conferencing for online education', logo: 'https://cdn.worldvectorlogo.com/logos/google-meet.svg', category: 'Video Conferencing', link: 'https://meet.google.com' },
        { name: 'Microsoft Teams', description: 'Collaboration platform with video calling for education', logo: 'https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg', category: 'Video Conferencing', link: 'https://teams.microsoft.com' },
        { name: 'Khan Academy', description: 'Free online courses and educational resources', logo: 'https://cdn.worldvectorlogo.com/logos/khan-academy.svg', category: 'Educational Resources', link: 'https://www.khanacademy.org' },
        { name: 'Coursera', description: 'Online courses from top universities and companies', logo: 'https://cdn.worldvectorlogo.com/logos/coursera.svg', category: 'Educational Resources', link: 'https://www.coursera.org' },
        { name: 'edX', description: 'Free online courses from Harvard, MIT, and more', logo: 'https://cdn.worldvectorlogo.com/logos/edx.svg', category: 'Educational Resources', link: 'https://www.edx.org' },
        { name: 'Google Classroom', description: 'Free web service for schools to create and distribute assignments', logo: 'https://cdn.worldvectorlogo.com/logos/google-classroom.svg', category: 'Learning Management', link: 'https://classroom.google.com' },
        { name: 'Moodle', description: 'Open-source learning management system', logo: 'https://cdn.worldvectorlogo.com/logos/moodle.svg', category: 'Learning Management', link: 'https://moodle.org' },
        { name: 'Canvas', description: 'Learning management system for educational institutions', logo: 'https://cdn.worldvectorlogo.com/logos/instructure-canvas.svg', category: 'Learning Management', link: 'https://www.instructure.com/canvas' },
        { name: 'Padlet', description: 'Digital canvas for collaborative learning', logo: 'https://padlet.com/favicon.ico', category: 'Collaboration Tools', link: 'https://padlet.com' },
        { name: 'Jamboard', description: 'Digital whiteboard for interactive learning', logo: 'https://ssl.gstatic.com/jamboard/img/favicon.ico', category: 'Collaboration Tools', link: 'https://jamboard.google.com' },
        { name: 'Mentimeter', description: 'Interactive presentation software for engagement', logo: 'https://www.mentimeter.com/favicon.ico', category: 'Interactive Tools', link: 'https://www.mentimeter.com' },
        { name: 'Kahoot!', description: 'Game-based learning platform for education', logo: 'https://cdn.worldvectorlogo.com/logos/kahoot.svg', category: 'Interactive Tools', link: 'https://kahoot.com' },
        { name: 'Quizlet', description: 'Study tools including flashcards and practice tests', logo: 'https://cdn.worldvectorlogo.com/logos/quizlet.svg', category: 'Study Tools', link: 'https://quizlet.com' },
        { name: 'Anki', description: 'Spaced repetition flashcard program for learning', logo: 'https://apps.ankiweb.net/favicon.ico', category: 'Study Tools', link: 'https://apps.ankiweb.net' }
    ],

    'language-learning-services': [
        { name: 'Duolingo', description: 'Free language learning app with gamification', logo: 'https://cdn.worldvectorlogo.com/logos/duolingo.svg', category: 'Language Learning Apps', link: 'https://www.duolingo.com' },
        { name: 'Memrise', description: 'Language learning through spaced repetition and mnemonics', logo: 'https://static.memrise.com/img/favicon.ico', category: 'Language Learning Apps', link: 'https://www.memrise.com' },
        { name: 'Busuu', description: 'AI-powered language learning with speech recognition', logo: 'https://www.busuu.com/favicon.ico', category: 'Language Learning Apps', link: 'https://www.busuu.com' },
        { name: 'HelloTalk', description: 'Language exchange app connecting native speakers', logo: 'https://www.hellotalk.com/favicon.ico', category: 'Language Exchange', link: 'https://www.hellotalk.com' },
        { name: 'Tandem', description: 'Language exchange community for conversation practice', logo: 'https://www.tandem.net/favicon.ico', category: 'Language Exchange', link: 'https://www.tandem.net' },
        { name: 'italki', description: 'Online language tutoring marketplace', logo: 'https://www.italki.com/favicon.ico', category: 'Online Tutoring', link: 'https://www.italki.com' },
        { name: 'Preply', description: 'Online language tutoring platform', logo: 'https://preply.com/favicon.ico', category: 'Online Tutoring', link: 'https://preply.com' },
        { name: 'Google Translate', description: 'Free translation service supporting 100+ languages', logo: 'https://cdn.worldvectorlogo.com/logos/google-translate.svg', category: 'Translation Tools', link: 'https://translate.google.com' },
        { name: 'DeepL', description: 'AI-powered translation service with high accuracy', logo: 'https://www.deepl.com/favicon.ico', category: 'Translation Tools', link: 'https://www.deepl.com' },
        { name: 'Reverso', description: 'Translation and language learning tools', logo: 'https://www.reverso.net/favicon.ico', category: 'Translation Tools', link: 'https://www.reverso.net' },
        { name: 'Anki', description: 'Spaced repetition flashcard system for vocabulary', logo: 'https://apps.ankiweb.net/favicon.ico', category: 'Vocabulary Tools', link: 'https://apps.ankiweb.net' },
        { name: 'Quizlet', description: 'Digital flashcards and study sets for language learning', logo: 'https://cdn.worldvectorlogo.com/logos/quizlet.svg', category: 'Vocabulary Tools', link: 'https://quizlet.com' },
        { name: 'Forvo', description: 'Pronunciation dictionary with native speaker audio', logo: 'https://forvo.com/favicon.ico', category: 'Pronunciation Tools', link: 'https://forvo.com' },
        { name: 'Speechling', description: 'Free pronunciation coaching with AI feedback', logo: 'https://speechling.com/favicon.ico', category: 'Pronunciation Tools', link: 'https://speechling.com' },
        { name: 'News in Slow', description: 'Language learning through current events', logo: 'https://www.newsinslowspanish.com/favicon.ico', category: 'Content Resources', link: 'https://www.newsinslowspanish.com' }
    ],

    'music-lessons-online': [
        { name: 'YouTube', description: 'Free music tutorials and lessons from creators worldwide', logo: 'https://cdn.worldvectorlogo.com/logos/youtube-icon.svg', category: 'Video Learning', link: 'https://www.youtube.com' },
        { name: 'Simply Piano', description: 'AI-powered piano learning app for beginners', logo: 'https://www.joytunes.com/favicon.ico', category: 'Instrument Learning', link: 'https://www.joytunes.com/simply-piano' },
        { name: 'Yousician', description: 'Gamified music learning for multiple instruments', logo: 'https://yousician.com/favicon.ico', category: 'Instrument Learning', link: 'https://yousician.com' },
        { name: 'Flowkey', description: 'Interactive piano lessons with popular songs', logo: 'https://www.flowkey.com/favicon.ico', category: 'Instrument Learning', link: 'https://www.flowkey.com' },
        { name: 'Fender Play', description: 'Guitar, bass, and ukulele lessons online', logo: 'https://www.fender.com/favicon.ico', category: 'Instrument Learning', link: 'https://www.fender.com/play' },
        { name: 'MuseScore', description: 'Free music notation software for composers', logo: 'https://cdn.worldvectorlogo.com/logos/musescore.svg', category: 'Music Creation', link: 'https://musescore.org' },
        { name: 'Audacity', description: 'Free, open-source audio editing software', logo: 'https://www.audacityteam.org/favicon.ico', category: 'Audio Production', link: 'https://www.audacityteam.org' },
        { name: 'GarageBand', description: 'Free music creation software for Mac and iOS', logo: 'https://www.apple.com/favicon.ico', category: 'Music Creation', link: 'https://www.apple.com/mac/garageband' },
        { name: 'BandLab', description: 'Free online music creation and collaboration platform', logo: 'https://www.bandlab.com/favicon.ico', category: 'Music Creation', link: 'https://www.bandlab.com' },
        { name: 'Metronome Online', description: 'Free online metronome for practice', logo: 'https://www.metronomeonline.com/favicon.ico', category: 'Practice Tools', link: 'https://www.metronomeonline.com' },
        { name: 'Teoria', description: 'Music theory and ear training exercises', logo: 'https://www.teoria.com/favicon.ico', category: 'Music Theory', link: 'https://www.teoria.com' },
        { name: 'Tenuto', description: 'Music theory and ear training app', logo: 'https://www.musictheory.net/favicon.ico', category: 'Music Theory', link: 'https://www.musictheory.net' },
        { name: 'Zoom', description: 'Video conferencing for online music lessons', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Online Teaching', link: 'https://zoom.us' },
        { name: 'Skype', description: 'Free video calling for music instruction', logo: 'https://cdn.worldvectorlogo.com/logos/skype.svg', category: 'Online Teaching', link: 'https://www.skype.com' },
        { name: 'Discord', description: 'Voice and video chat for music communities', logo: 'https://cdn.worldvectorlogo.com/logos/discord.svg', category: 'Community Building', link: 'https://discord.com' }
    ],

    'art-classes-business': [
        { name: 'Procreate', description: 'Digital illustration app for iPad', logo: 'https://procreate.art/favicon.ico', category: 'Digital Art Tools', link: 'https://procreate.art' },
        { name: 'GIMP', description: 'Free and open-source image editor', logo: 'https://cdn.worldvectorlogo.com/logos/gimp.svg', category: 'Digital Art Tools', link: 'https://www.gimp.org' },
        { name: 'Krita', description: 'Free painting program for digital artists', logo: 'https://krita.org/favicon.ico', category: 'Digital Art Tools', link: 'https://krita.org' },
        { name: 'Blender', description: 'Free 3D creation suite for modeling and animation', logo: 'https://cdn.worldvectorlogo.com/logos/blender-2.svg', category: '3D Art Tools', link: 'https://www.blender.org' },
        { name: 'SketchBook', description: 'Free drawing and painting software', logo: 'https://www.sketchbook.com/favicon.ico', category: 'Digital Art Tools', link: 'https://www.sketchbook.com' },
        { name: 'YouTube', description: 'Free art tutorials and technique demonstrations', logo: 'https://cdn.worldvectorlogo.com/logos/youtube-icon.svg', category: 'Learning Resources', link: 'https://www.youtube.com' },
        { name: 'Proko', description: 'Free art education and drawing tutorials', logo: 'https://www.proko.com/favicon.ico', category: 'Learning Resources', link: 'https://www.proko.com' },
        { name: 'Drawabox', description: 'Free drawing fundamentals course', logo: 'https://drawabox.com/favicon.ico', category: 'Learning Resources', link: 'https://drawabox.com' },
        { name: 'Pinterest', description: 'Visual inspiration and art reference platform', logo: 'https://cdn.worldvectorlogo.com/logos/pinterest.svg', category: 'Inspiration Tools', link: 'https://www.pinterest.com' },
        { name: 'Unsplash', description: 'Free high-quality photos for reference', logo: 'https://cdn.worldvectorlogo.com/logos/unsplash-2.svg', category: 'Reference Materials', link: 'https://unsplash.com' },
        { name: 'Adobe Color', description: 'Free color palette generator and explorer', logo: 'https://color.adobe.com/favicon.ico', category: 'Color Tools', link: 'https://color.adobe.com' },
        { name: 'Coolors', description: 'Fast color scheme generator', logo: 'https://coolors.co/favicon.ico', category: 'Color Tools', link: 'https://coolors.co' },
        { name: 'Zoom', description: 'Video conferencing for online art classes', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Online Teaching', link: 'https://zoom.us' },
        { name: 'Google Meet', description: 'Free video conferencing for art instruction', logo: 'https://cdn.worldvectorlogo.com/logos/google-meet.svg', category: 'Online Teaching', link: 'https://meet.google.com' },
        { name: 'Discord', description: 'Community platform for art groups and feedback', logo: 'https://cdn.worldvectorlogo.com/logos/discord.svg', category: 'Community Building', link: 'https://discord.com' }
    ],

    'cooking-classes-online': [
        { name: 'YouTube', description: 'Free cooking tutorials and recipe demonstrations', logo: 'https://cdn.worldvectorlogo.com/logos/youtube-icon.svg', category: 'Video Learning', link: 'https://www.youtube.com' },
        { name: 'Zoom', description: 'Video conferencing for interactive cooking classes', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Online Teaching', link: 'https://zoom.us' },
        { name: 'Google Meet', description: 'Free video conferencing for cooking instruction', logo: 'https://cdn.worldvectorlogo.com/logos/google-meet.svg', category: 'Online Teaching', link: 'https://meet.google.com' },
        { name: 'Canva', description: 'Free recipe card and cooking class graphics design', logo: 'https://www.canva.com/favicon.ico', category: 'Design Tools', link: 'https://www.canva.com' },
        { name: 'Google Docs', description: 'Free recipe sharing and class material creation', logo: 'https://docs.google.com/favicon.ico', category: 'Content Creation', link: 'https://docs.google.com' },
        { name: 'Pinterest', description: 'Recipe inspiration and cooking ideas platform', logo: 'https://cdn.worldvectorlogo.com/logos/pinterest.svg', category: 'Recipe Resources', link: 'https://www.pinterest.com' },
        { name: 'Allrecipes', description: 'Free recipe database and cooking community', logo: 'https://www.allrecipes.com/favicon.ico', category: 'Recipe Resources', link: 'https://www.allrecipes.com' },
        { name: 'Food Network', description: 'Free cooking videos and recipe tutorials', logo: 'https://www.foodnetwork.com/favicon.ico', category: 'Learning Resources', link: 'https://www.foodnetwork.com' },
        { name: 'Tasty', description: 'Free quick cooking videos and recipes', logo: 'https://www.tasty.co/favicon.ico', category: 'Learning Resources', link: 'https://www.tasty.co' },
        { name: 'Instagram', description: 'Visual cooking content and class promotion', logo: 'https://cdn.worldvectorlogo.com/logos/instagram-2016.svg', category: 'Social Media Marketing', link: 'https://www.instagram.com' },
        { name: 'Facebook', description: 'Cooking community groups and class promotion', logo: 'https://cdn.worldvectorlogo.com/logos/facebook.svg', category: 'Community Building', link: 'https://www.facebook.com' },
        { name: 'Discord', description: 'Cooking community and student interaction', logo: 'https://cdn.worldvectorlogo.com/logos/discord.svg', category: 'Community Building', link: 'https://discord.com' },
        { name: 'Calendly', description: 'Free cooking class scheduling and bookings', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Wave', description: 'Free invoicing for cooking class services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free cooking class website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],

    'fitness-coaching-online': [
        { name: 'MyFitnessPal', description: 'Free calorie tracking and nutrition planning', logo: 'https://www.myfitnesspal.com/favicon.ico', category: 'Nutrition Tracking', link: 'https://www.myfitnesspal.com' },
        { name: 'Zoom', description: 'Video conferencing for online fitness coaching sessions', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Online Training', link: 'https://zoom.us' },
        { name: 'YouTube', description: 'Free workout videos and fitness tutorials', logo: 'https://cdn.worldvectorlogo.com/logos/youtube-icon.svg', category: 'Workout Resources', link: 'https://www.youtube.com' },
        { name: 'Nike Training Club', description: 'Free workout app with guided training', logo: 'https://www.nike.com/favicon.ico', category: 'Workout Apps', link: 'https://www.nike.com/ntc-app' },
        { name: 'Adidas Training', description: 'Free fitness app with bodyweight workouts', logo: 'https://www.adidas.com/favicon.ico', category: 'Workout Apps', link: 'https://www.adidas.com/us/training-app' },
        { name: 'FitOn', description: 'Free fitness classes and workout videos', logo: 'https://fitonapp.com/favicon.ico', category: 'Workout Apps', link: 'https://fitonapp.com' },
        { name: 'Google Fit', description: 'Free activity tracking and health monitoring', logo: 'https://www.google.com/fit/favicon.ico', category: 'Fitness Tracking', link: 'https://www.google.com/fit' },
        { name: 'Strava', description: 'Free running and cycling tracking community', logo: 'https://www.strava.com/favicon.ico', category: 'Activity Tracking', link: 'https://www.strava.com' },
        { name: 'Canva', description: 'Free workout plan and nutrition guide design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Sheets', description: 'Free client progress tracking and meal planning', logo: 'https://sheets.google.com/favicon.ico', category: 'Client Management', link: 'https://sheets.google.com' },
        { name: 'Calendly', description: 'Free fitness coaching session scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Instagram', description: 'Fitness content sharing and client engagement', logo: 'https://cdn.worldvectorlogo.com/logos/instagram-2016.svg', category: 'Social Media Marketing', link: 'https://www.instagram.com' },
        { name: 'WhatsApp', description: 'Free client communication and motivation', logo: 'https://cdn.worldvectorlogo.com/logos/whatsapp.svg', category: 'Client Communication', link: 'https://www.whatsapp.com' },
        { name: 'Wave', description: 'Free invoicing for fitness coaching services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free fitness coaching website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' }
    ],

    'life-coaching-services': [
        { name: 'Zoom', description: 'Video conferencing for life coaching sessions', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Coaching Sessions', link: 'https://zoom.us' },
        { name: 'Google Meet', description: 'Free video conferencing for client meetings', logo: 'https://cdn.worldvectorlogo.com/logos/google-meet.svg', category: 'Coaching Sessions', link: 'https://meet.google.com' },
        { name: 'Calendly', description: 'Free coaching session scheduling and bookings', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Google Forms', description: 'Free client intake forms and assessments', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Notion', description: 'Free client notes and goal tracking system', logo: 'https://www.notion.so/favicon.ico', category: 'Client Management', link: 'https://www.notion.so' },
        { name: 'Trello', description: 'Free goal setting and progress tracking boards', logo: 'https://trello.com/favicon.ico', category: 'Goal Management', link: 'https://trello.com' },
        { name: 'Canva', description: 'Free coaching materials and worksheet design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Docs', description: 'Free coaching plans and session notes', logo: 'https://docs.google.com/favicon.ico', category: 'Documentation', link: 'https://docs.google.com' },
        { name: 'Headspace', description: 'Free meditation and mindfulness resources', logo: 'https://www.headspace.com/favicon.ico', category: 'Wellness Tools', link: 'https://www.headspace.com' },
        { name: 'LinkedIn', description: 'Free professional networking and client acquisition', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Psychology Today', description: 'Free therapist directory and mental health resources', logo: 'https://www.psychologytoday.com/favicon.ico', category: 'Professional Resources', link: 'https://www.psychologytoday.com' },
        { name: 'WhatsApp', description: 'Free client communication and check-ins', logo: 'https://cdn.worldvectorlogo.com/logos/whatsapp.svg', category: 'Client Communication', link: 'https://www.whatsapp.com' },
        { name: 'Wave', description: 'Free invoicing for life coaching services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free life coaching website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free email marketing for coaching content', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],

    'career-coaching-business': [
        { name: 'LinkedIn', description: 'Professional networking and career development platform', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Zoom', description: 'Video conferencing for career coaching sessions', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Coaching Sessions', link: 'https://zoom.us' },
        { name: 'Indeed', description: 'Free job search and career resources', logo: 'https://www.indeed.com/favicon.ico', category: 'Job Search Resources', link: 'https://www.indeed.com' },
        { name: 'Glassdoor', description: 'Free company reviews and salary information', logo: 'https://www.glassdoor.com/favicon.ico', category: 'Career Research', link: 'https://www.glassdoor.com' },
        { name: 'Canva', description: 'Free resume and cover letter design templates', logo: 'https://www.canva.com/favicon.ico', category: 'Resume Building', link: 'https://www.canva.com' },
        { name: 'Google Docs', description: 'Free resume writing and career planning documents', logo: 'https://docs.google.com/favicon.ico', category: 'Document Creation', link: 'https://docs.google.com' },
        { name: 'Calendly', description: 'Free career coaching session scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Google Forms', description: 'Free career assessment and intake forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Coursera', description: 'Free professional development courses', logo: 'https://cdn.worldvectorlogo.com/logos/coursera.svg', category: 'Skill Development', link: 'https://www.coursera.org' },
        { name: 'edX', description: 'Free career-focused online courses', logo: 'https://cdn.worldvectorlogo.com/logos/edx.svg', category: 'Skill Development', link: 'https://www.edx.org' },
        { name: 'GitHub', description: 'Free portfolio hosting for tech careers', logo: 'https://cdn.worldvectorlogo.com/logos/github-icon.svg', category: 'Portfolio Building', link: 'https://github.com' },
        { name: 'Behance', description: 'Free creative portfolio showcase', logo: 'https://www.behance.net/favicon.ico', category: 'Portfolio Building', link: 'https://www.behance.net' },
        { name: 'Wave', description: 'Free invoicing for career coaching services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free career coaching website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free career tips email newsletter', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],

    'relationship-coaching': [
        { name: 'Zoom', description: 'Video conferencing for relationship coaching sessions', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Coaching Sessions', link: 'https://zoom.us' },
        { name: 'Google Meet', description: 'Free video conferencing for couples sessions', logo: 'https://cdn.worldvectorlogo.com/logos/google-meet.svg', category: 'Coaching Sessions', link: 'https://meet.google.com' },
        { name: 'Calendly', description: 'Free relationship coaching session scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Google Forms', description: 'Free relationship assessment and intake forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Canva', description: 'Free relationship worksheets and exercise design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Docs', description: 'Free session notes and relationship plans', logo: 'https://docs.google.com/favicon.ico', category: 'Documentation', link: 'https://docs.google.com' },
        { name: 'Psychology Today', description: 'Free relationship therapy resources and directory', logo: 'https://www.psychologytoday.com/favicon.ico', category: 'Professional Resources', link: 'https://www.psychologytoday.com' },
        { name: 'Gottman Institute', description: 'Free relationship research and assessment tools', logo: 'https://www.gottman.com/favicon.ico', category: 'Assessment Tools', link: 'https://www.gottman.com' },
        { name: 'Headspace', description: 'Free meditation and mindfulness for couples', logo: 'https://www.headspace.com/favicon.ico', category: 'Wellness Tools', link: 'https://www.headspace.com' },
        { name: 'WhatsApp', description: 'Free secure client communication', logo: 'https://cdn.worldvectorlogo.com/logos/whatsapp.svg', category: 'Client Communication', link: 'https://www.whatsapp.com' },
        { name: 'LinkedIn', description: 'Free professional networking for coaches', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Facebook', description: 'Free relationship coaching community groups', logo: 'https://cdn.worldvectorlogo.com/logos/facebook.svg', category: 'Community Building', link: 'https://www.facebook.com' },
        { name: 'Wave', description: 'Free invoicing for relationship coaching services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free relationship coaching website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free relationship tips email newsletter', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],

    'health-coaching-services': [
        { name: 'MyFitnessPal', description: 'Free nutrition tracking and meal planning', logo: 'https://www.myfitnesspal.com/favicon.ico', category: 'Nutrition Tools', link: 'https://www.myfitnesspal.com' },
        { name: 'Zoom', description: 'Video conferencing for health coaching sessions', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Coaching Sessions', link: 'https://zoom.us' },
        { name: 'Google Forms', description: 'Free health assessment and intake forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Canva', description: 'Free health plan and nutrition guide design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Sheets', description: 'Free client health progress tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Progress Tracking', link: 'https://sheets.google.com' },
        { name: 'Calendly', description: 'Free health coaching session scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Headspace', description: 'Free meditation and mental wellness resources', logo: 'https://www.headspace.com/favicon.ico', category: 'Mental Wellness', link: 'https://www.headspace.com' },
        { name: 'Cronometer', description: 'Free detailed nutrition tracking and analysis', logo: 'https://cronometer.com/favicon.ico', category: 'Nutrition Analysis', link: 'https://cronometer.com' },
        { name: 'Sleep Cycle', description: 'Free sleep tracking and optimization', logo: 'https://www.sleepcycle.com/favicon.ico', category: 'Sleep Health', link: 'https://www.sleepcycle.com' },
        { name: 'Google Fit', description: 'Free activity and health data tracking', logo: 'https://www.google.com/fit/favicon.ico', category: 'Health Tracking', link: 'https://www.google.com/fit' },
        { name: 'WebMD', description: 'Free health information and symptom checker', logo: 'https://www.webmd.com/favicon.ico', category: 'Health Resources', link: 'https://www.webmd.com' },
        { name: 'LinkedIn', description: 'Free professional networking for health coaches', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Wave', description: 'Free invoicing for health coaching services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free health coaching website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free health tips email newsletter', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],

    'meditation-coaching': [
        { name: 'Headspace', description: 'Free meditation guides and mindfulness resources', logo: 'https://www.headspace.com/favicon.ico', category: 'Meditation Resources', link: 'https://www.headspace.com' },
        { name: 'Insight Timer', description: 'Free meditation timer and guided sessions', logo: 'https://insighttimer.com/favicon.ico', category: 'Meditation Apps', link: 'https://insighttimer.com' },
        { name: 'Calm', description: 'Free meditation and sleep stories', logo: 'https://www.calm.com/favicon.ico', category: 'Meditation Apps', link: 'https://www.calm.com' },
        { name: 'Zoom', description: 'Video conferencing for meditation coaching sessions', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Coaching Sessions', link: 'https://zoom.us' },
        { name: 'YouTube', description: 'Free guided meditation videos and tutorials', logo: 'https://cdn.worldvectorlogo.com/logos/youtube-icon.svg', category: 'Learning Resources', link: 'https://www.youtube.com' },
        { name: 'Canva', description: 'Free meditation guide and mindfulness content design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Forms', description: 'Free mindfulness assessment and progress forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Calendly', description: 'Free meditation coaching session scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Spotify', description: 'Free meditation music and ambient sounds', logo: 'https://cdn.worldvectorlogo.com/logos/spotify-1.svg', category: 'Audio Resources', link: 'https://www.spotify.com' },
        { name: 'Freesound', description: 'Free nature sounds and meditation audio', logo: 'https://freesound.org/favicon.ico', category: 'Audio Resources', link: 'https://freesound.org' },
        { name: 'Google Docs', description: 'Free meditation session notes and plans', logo: 'https://docs.google.com/favicon.ico', category: 'Documentation', link: 'https://docs.google.com' },
        { name: 'WhatsApp', description: 'Free daily mindfulness reminders and check-ins', logo: 'https://cdn.worldvectorlogo.com/logos/whatsapp.svg', category: 'Client Communication', link: 'https://www.whatsapp.com' },
        { name: 'Wave', description: 'Free invoicing for meditation coaching services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free meditation coaching website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free mindfulness tips email newsletter', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],

    'productivity-coaching': [
        { name: 'Notion', description: 'Free productivity system and goal tracking', logo: 'https://www.notion.so/favicon.ico', category: 'Productivity Tools', link: 'https://www.notion.so' },
        { name: 'Trello', description: 'Free task management and project boards', logo: 'https://trello.com/favicon.ico', category: 'Task Management', link: 'https://trello.com' },
        { name: 'Zoom', description: 'Video conferencing for productivity coaching sessions', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Coaching Sessions', link: 'https://zoom.us' },
        { name: 'Google Calendar', description: 'Free time blocking and schedule optimization', logo: 'https://calendar.google.com/favicon.ico', category: 'Time Management', link: 'https://calendar.google.com' },
        { name: 'Toggl Track', description: 'Free time tracking and productivity analysis', logo: 'https://toggl.com/favicon.ico', category: 'Time Tracking', link: 'https://toggl.com/track' },
        { name: 'RescueTime', description: 'Free automatic productivity tracking', logo: 'https://www.rescuetime.com/favicon.ico', category: 'Productivity Analytics', link: 'https://www.rescuetime.com' },
        { name: 'Forest', description: 'Free focus app with gamified productivity', logo: 'https://www.forestapp.cc/favicon.ico', category: 'Focus Tools', link: 'https://www.forestapp.cc' },
        { name: 'Canva', description: 'Free productivity planner and habit tracker design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Forms', description: 'Free productivity assessment and goal setting forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Calendly', description: 'Free productivity coaching session scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Habitica', description: 'Free gamified habit tracking and goal achievement', logo: 'https://habitica.com/favicon.ico', category: 'Habit Tracking', link: 'https://habitica.com' },
        { name: 'Google Docs', description: 'Free productivity plans and session notes', logo: 'https://docs.google.com/favicon.ico', category: 'Documentation', link: 'https://docs.google.com' },
        { name: 'Wave', description: 'Free invoicing for productivity coaching services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free productivity coaching website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free productivity tips email newsletter', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],

    'financial-advisory-services': [
        { name: 'Mint', description: 'Free personal finance tracking and budgeting', logo: 'https://mint.intuit.com/favicon.ico', category: 'Financial Planning', link: 'https://mint.intuit.com' },
        { name: 'Personal Capital', description: 'Free wealth management and investment tracking', logo: 'https://www.personalcapital.com/favicon.ico', category: 'Investment Tracking', link: 'https://www.personalcapital.com' },
        { name: 'Zoom', description: 'Video conferencing for financial advisory sessions', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Client Meetings', link: 'https://zoom.us' },
        { name: 'Google Sheets', description: 'Free financial planning and analysis spreadsheets', logo: 'https://sheets.google.com/favicon.ico', category: 'Financial Analysis', link: 'https://sheets.google.com' },
        { name: 'Canva', description: 'Free financial report and presentation design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Calendly', description: 'Free financial advisory session scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Yahoo Finance', description: 'Free market data and financial news', logo: 'https://finance.yahoo.com/favicon.ico', category: 'Market Research', link: 'https://finance.yahoo.com' },
        { name: 'Google Finance', description: 'Free stock quotes and portfolio tracking', logo: 'https://www.google.com/finance/favicon.ico', category: 'Market Data', link: 'https://www.google.com/finance' },
        { name: 'SEC.gov', description: 'Free regulatory filings and investment education', logo: 'https://www.sec.gov/favicon.ico', category: 'Regulatory Resources', link: 'https://www.sec.gov' },
        { name: 'Morningstar', description: 'Free investment research and analysis', logo: 'https://www.morningstar.com/favicon.ico', category: 'Investment Research', link: 'https://www.morningstar.com' },
        { name: 'LinkedIn', description: 'Free professional networking for financial advisors', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Google Forms', description: 'Free client financial assessment forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Wave', description: 'Free invoicing for financial advisory services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free financial advisory website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free financial tips email newsletter', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],

    'investment-consulting': [
        { name: 'Yahoo Finance', description: 'Free comprehensive market data and analysis', logo: 'https://finance.yahoo.com/favicon.ico', category: 'Market Research', link: 'https://finance.yahoo.com' },
        { name: 'Google Finance', description: 'Free stock screening and portfolio tools', logo: 'https://www.google.com/finance/favicon.ico', category: 'Investment Tools', link: 'https://www.google.com/finance' },
        { name: 'Morningstar', description: 'Free investment research and fund analysis', logo: 'https://www.morningstar.com/favicon.ico', category: 'Investment Research', link: 'https://www.morningstar.com' },
        { name: 'SEC.gov', description: 'Free regulatory filings and investor education', logo: 'https://www.sec.gov/favicon.ico', category: 'Regulatory Resources', link: 'https://www.sec.gov' },
        { name: 'Zoom', description: 'Video conferencing for investment consulting sessions', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Client Meetings', link: 'https://zoom.us' },
        { name: 'Google Sheets', description: 'Free investment analysis and portfolio modeling', logo: 'https://sheets.google.com/favicon.ico', category: 'Investment Analysis', link: 'https://sheets.google.com' },
        { name: 'TradingView', description: 'Free charting and technical analysis tools', logo: 'https://www.tradingview.com/favicon.ico', category: 'Technical Analysis', link: 'https://www.tradingview.com' },
        { name: 'FINRA', description: 'Free investor education and broker verification', logo: 'https://www.finra.org/favicon.ico', category: 'Regulatory Resources', link: 'https://www.finra.org' },
        { name: 'Canva', description: 'Free investment report and presentation design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Calendly', description: 'Free investment consulting session scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'LinkedIn', description: 'Free professional networking for investment consultants', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Google Forms', description: 'Free investment risk assessment forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Wave', description: 'Free invoicing for investment consulting services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free investment consulting website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free investment insights email newsletter', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],

    'retirement-planning-services': [
        { name: 'Social Security Administration', description: 'Free retirement benefit calculators and planning', logo: 'https://www.ssa.gov/favicon.ico', category: 'Government Resources', link: 'https://www.ssa.gov' },
        { name: 'IRS Retirement Plans', description: 'Free retirement account rules and contribution limits', logo: 'https://www.irs.gov/favicon.ico', category: 'Tax Resources', link: 'https://www.irs.gov/retirement-plans' },
        { name: 'Zoom', description: 'Video conferencing for retirement planning sessions', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Client Meetings', link: 'https://zoom.us' },
        { name: 'Google Sheets', description: 'Free retirement planning calculators and projections', logo: 'https://sheets.google.com/favicon.ico', category: 'Retirement Calculations', link: 'https://sheets.google.com' },
        { name: 'Personal Capital', description: 'Free retirement planning and 401k tracking', logo: 'https://www.personalcapital.com/favicon.ico', category: 'Retirement Tracking', link: 'https://www.personalcapital.com' },
        { name: 'Fidelity Retirement Planning', description: 'Free retirement planning tools and calculators', logo: 'https://www.fidelity.com/favicon.ico', category: 'Planning Tools', link: 'https://www.fidelity.com/viewpoints/retirement' },
        { name: 'Vanguard Retirement Planner', description: 'Free retirement planning and investment guidance', logo: 'https://investor.vanguard.com/favicon.ico', category: 'Investment Planning', link: 'https://investor.vanguard.com/calculator-tools/retirement-income-calculator' },
        { name: 'Canva', description: 'Free retirement plan presentations and reports', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Calendly', description: 'Free retirement planning session scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'AARP Retirement Calculator', description: 'Free retirement planning tools and resources', logo: 'https://www.aarp.org/favicon.ico', category: 'Planning Resources', link: 'https://www.aarp.org/work/retirement-planning' },
        { name: 'LinkedIn', description: 'Free professional networking for retirement planners', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Google Forms', description: 'Free retirement planning assessment forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Wave', description: 'Free invoicing for retirement planning services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free retirement planning website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free retirement planning tips email newsletter', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],

    'estate-planning-services': [
        { name: 'LegalZoom', description: 'Free estate planning resources and document templates', logo: 'https://www.legalzoom.com/favicon.ico', category: 'Legal Resources', link: 'https://www.legalzoom.com' },
        { name: 'Nolo', description: 'Free legal guides and estate planning information', logo: 'https://www.nolo.com/favicon.ico', category: 'Legal Education', link: 'https://www.nolo.com' },
        { name: 'IRS Estate and Gift Tax', description: 'Free estate tax information and forms', logo: 'https://www.irs.gov/favicon.ico', category: 'Tax Resources', link: 'https://www.irs.gov/businesses/small-businesses-self-employed/estate-and-gift-taxes' },
        { name: 'Zoom', description: 'Video conferencing for estate planning consultations', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Client Meetings', link: 'https://zoom.us' },
        { name: 'Google Docs', description: 'Free estate planning document drafting and collaboration', logo: 'https://docs.google.com/favicon.ico', category: 'Document Creation', link: 'https://docs.google.com' },
        { name: 'DocuSign', description: 'Free electronic signatures for estate documents', logo: 'https://www.docusign.com/favicon.ico', category: 'Document Signing', link: 'https://www.docusign.com' },
        { name: 'Google Sheets', description: 'Free estate inventory and asset tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Asset Management', link: 'https://sheets.google.com' },
        { name: 'Canva', description: 'Free estate planning guides and educational materials', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Calendly', description: 'Free estate planning consultation scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'American Bar Association', description: 'Free estate planning legal resources', logo: 'https://www.americanbar.org/favicon.ico', category: 'Professional Resources', link: 'https://www.americanbar.org' },
        { name: 'LinkedIn', description: 'Free professional networking for estate planners', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Google Forms', description: 'Free estate planning intake and assessment forms', logo: 'https://forms.google.com/favicon.ico', category: 'Client Assessment', link: 'https://forms.google.com' },
        { name: 'Wave', description: 'Free invoicing for estate planning services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free estate planning website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free estate planning tips email newsletter', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],

    'business-valuation-services': [
        { name: 'BizBuySell', description: 'Free business valuation tools and market data', logo: 'https://www.bizbuysell.com/favicon.ico', category: 'Valuation Tools', link: 'https://www.bizbuysell.com' },
        { name: 'SEC.gov', description: 'Free public company financial data and filings', logo: 'https://www.sec.gov/favicon.ico', category: 'Financial Data', link: 'https://www.sec.gov' },
        { name: 'Google Sheets', description: 'Free business valuation models and calculations', logo: 'https://sheets.google.com/favicon.ico', category: 'Valuation Analysis', link: 'https://sheets.google.com' },
        { name: 'Zoom', description: 'Video conferencing for business valuation consultations', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Client Meetings', link: 'https://zoom.us' },
        { name: 'Yahoo Finance', description: 'Free market data and comparable company analysis', logo: 'https://finance.yahoo.com/favicon.ico', category: 'Market Research', link: 'https://finance.yahoo.com' },
        { name: 'BVR (Business Valuation Resources)', description: 'Free valuation articles and industry data', logo: 'https://www.bvresources.com/favicon.ico', category: 'Industry Resources', link: 'https://www.bvresources.com' },
        { name: 'SBA.gov', description: 'Free small business valuation guidance', logo: 'https://www.sba.gov/favicon.ico', category: 'Government Resources', link: 'https://www.sba.gov' },
        { name: 'Canva', description: 'Free valuation report and presentation design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Docs', description: 'Free valuation report writing and collaboration', logo: 'https://docs.google.com/favicon.ico', category: 'Report Writing', link: 'https://docs.google.com' },
        { name: 'Calendly', description: 'Free business valuation consultation scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'LinkedIn', description: 'Free professional networking for valuation experts', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Google Forms', description: 'Free business information gathering forms', logo: 'https://forms.google.com/favicon.ico', category: 'Data Collection', link: 'https://forms.google.com' },
        { name: 'Wave', description: 'Free invoicing for business valuation services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free business valuation website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free business valuation insights newsletter', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],

    'mergers-acquisitions-consulting': [
        { name: 'SEC.gov', description: 'Free M&A filings and regulatory information', logo: 'https://www.sec.gov/favicon.ico', category: 'Regulatory Resources', link: 'https://www.sec.gov' },
        { name: 'Yahoo Finance', description: 'Free M&A news and deal tracking', logo: 'https://finance.yahoo.com/favicon.ico', category: 'Deal Intelligence', link: 'https://finance.yahoo.com' },
        { name: 'Zoom', description: 'Video conferencing for M&A consultations and due diligence', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Client Meetings', link: 'https://zoom.us' },
        { name: 'Google Sheets', description: 'Free M&A financial models and analysis', logo: 'https://sheets.google.com/favicon.ico', category: 'Financial Analysis', link: 'https://sheets.google.com' },
        { name: 'Google Docs', description: 'Free M&A documentation and collaboration', logo: 'https://docs.google.com/favicon.ico', category: 'Document Management', link: 'https://docs.google.com' },
        { name: 'DocuSign', description: 'Free electronic signatures for M&A documents', logo: 'https://www.docusign.com/favicon.ico', category: 'Document Signing', link: 'https://www.docusign.com' },
        { name: 'LinkedIn', description: 'Free M&A professional networking and deal sourcing', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Canva', description: 'Free M&A presentation and pitch deck design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Drive', description: 'Free secure M&A document storage and sharing', logo: 'https://drive.google.com/favicon.ico', category: 'Data Room', link: 'https://drive.google.com' },
        { name: 'Calendly', description: 'Free M&A consultation and meeting scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'FINRA', description: 'Free M&A regulatory guidance and compliance', logo: 'https://www.finra.org/favicon.ico', category: 'Regulatory Compliance', link: 'https://www.finra.org' },
        { name: 'Google Forms', description: 'Free M&A due diligence checklists and forms', logo: 'https://forms.google.com/favicon.ico', category: 'Due Diligence', link: 'https://forms.google.com' },
        { name: 'Wave', description: 'Free invoicing for M&A consulting services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free M&A consulting website analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Business Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free M&A market insights newsletter', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],

    'venture-capital-services': [
        { name: 'AngelList', description: 'Free startup and investor networking platform', logo: 'https://angel.co/favicon.ico', category: 'Startup Platform', link: 'https://angel.co' },
        { name: 'Crunchbase', description: 'Free startup and funding database', logo: 'https://www.crunchbase.com/favicon.ico', category: 'Market Intelligence', link: 'https://www.crunchbase.com' },
        { name: 'PitchBook (Free)', description: 'Free startup and VC market data', logo: 'https://pitchbook.com/favicon.ico', category: 'Market Research', link: 'https://pitchbook.com' },
        { name: 'Zoom', description: 'Video conferencing for startup pitches and due diligence', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Investor Meetings', link: 'https://zoom.us' },
        { name: 'Google Sheets', description: 'Free startup financial models and portfolio tracking', logo: 'https://sheets.google.com/favicon.ico', category: 'Investment Analysis', link: 'https://sheets.google.com' },
        { name: 'LinkedIn', description: 'Free VC professional networking and deal flow', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'SEC.gov', description: 'Free VC regulatory filings and compliance information', logo: 'https://www.sec.gov/favicon.ico', category: 'Regulatory Resources', link: 'https://www.sec.gov' },
        { name: 'Canva', description: 'Free VC presentation and investment thesis design', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Docs', description: 'Free investment memos and due diligence documentation', logo: 'https://docs.google.com/favicon.ico', category: 'Investment Documentation', link: 'https://docs.google.com' },
        { name: 'Calendly', description: 'Free VC meeting and pitch scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Y Combinator Startup School', description: 'Free startup education and resources', logo: 'https://www.startupschool.org/favicon.ico', category: 'Startup Education', link: 'https://www.startupschool.org' },
        { name: 'Google Forms', description: 'Free startup application and screening forms', logo: 'https://forms.google.com/favicon.ico', category: 'Deal Screening', link: 'https://forms.google.com' },
        { name: 'Wave', description: 'Free invoicing for VC services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Google Analytics', description: 'Free VC website and portfolio analytics', logo: 'https://analytics.google.com/favicon.ico', category: 'Portfolio Analytics', link: 'https://analytics.google.com' },
        { name: 'Mailchimp', description: 'Free VC insights and portfolio updates newsletter', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Marketing', link: 'https://mailchimp.com' }
    ],

    'angel-investment-network': [
        { name: 'AngelList', description: 'Free angel investor and startup matching platform', logo: 'https://angel.co/favicon.ico', category: 'Investment Platform', link: 'https://angel.co' },
        { name: 'Gust', description: 'Free angel investment deal flow and management', logo: 'https://gust.com/favicon.ico', category: 'Deal Management', link: 'https://gust.com' },
        { name: 'SeedInvest', description: 'Free startup investment opportunities', logo: 'https://www.seedinvest.com/favicon.ico', category: 'Investment Opportunities', link: 'https://www.seedinvest.com' },
        { name: 'Zoom', description: 'Video conferencing for angel investor meetings', logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', category: 'Investor Meetings', link: 'https://zoom.us' },
        { name: 'LinkedIn', description: 'Free angel investor networking and deal sourcing', logo: 'https://www.linkedin.com/favicon.ico', category: 'Professional Networking', link: 'https://www.linkedin.com' },
        { name: 'Crunchbase', description: 'Free startup research and due diligence', logo: 'https://www.crunchbase.com/favicon.ico', category: 'Startup Research', link: 'https://www.crunchbase.com' },
        { name: 'Google Sheets', description: 'Free angel investment tracking and portfolio management', logo: 'https://sheets.google.com/favicon.ico', category: 'Portfolio Management', link: 'https://sheets.google.com' },
        { name: 'SEC.gov', description: 'Free angel investment regulations and compliance', logo: 'https://www.sec.gov/favicon.ico', category: 'Regulatory Resources', link: 'https://www.sec.gov' },
        { name: 'Canva', description: 'Free angel group presentations and materials', logo: 'https://www.canva.com/favicon.ico', category: 'Content Creation', link: 'https://www.canva.com' },
        { name: 'Google Docs', description: 'Free investment agreements and documentation', logo: 'https://docs.google.com/favicon.ico', category: 'Investment Documentation', link: 'https://docs.google.com' },
        { name: 'Calendly', description: 'Free angel investor meeting scheduling', logo: 'https://calendly.com/favicon.ico', category: 'Scheduling', link: 'https://calendly.com' },
        { name: 'Angel Capital Association', description: 'Free angel investor education and resources', logo: 'https://www.angelcapitalassociation.org/favicon.ico', category: 'Angel Education', link: 'https://www.angelcapitalassociation.org' },
        { name: 'Google Forms', description: 'Free startup screening and application forms', logo: 'https://forms.google.com/favicon.ico', category: 'Deal Screening', link: 'https://forms.google.com' },
        { name: 'Wave', description: 'Free invoicing for angel network services', logo: 'https://www.waveapps.com/favicon.ico', category: 'Business Operations', link: 'https://www.waveapps.com' },
        { name: 'Mailchimp', description: 'Free angel investment opportunities newsletter', logo: 'https://mailchimp.com/favicon.ico', category: 'Deal Flow Communication', link: 'https://mailchimp.com' }
    ],

    'ai-blockchain': [
        { name: 'Ethereum', description: 'Free blockchain development platform', logo: 'https://ethereum.org/favicon.ico', category: 'Blockchain Platforms', link: 'https://ethereum.org' },
        { name: 'Solidity', description: 'Free smart contract programming language', logo: 'https://soliditylang.org/favicon.ico', category: 'Development Tools', link: 'https://soliditylang.org' },
        { name: 'Remix IDE', description: 'Free online Solidity IDE for smart contracts', logo: 'https://remix.ethereum.org/favicon.ico', category: 'Development Tools', link: 'https://remix.ethereum.org' },
        { name: 'MetaMask', description: 'Free blockchain wallet and browser extension', logo: 'https://metamask.io/favicon.ico', category: 'Blockchain Tools', link: 'https://metamask.io' },
        { name: 'OpenZeppelin', description: 'Free secure smart contract library', logo: 'https://openzeppelin.com/favicon.ico', category: 'Security Libraries', link: 'https://openzeppelin.com' },
        { name: 'Truffle Suite', description: 'Free blockchain development framework', logo: 'https://trufflesuite.com/favicon.ico', category: 'Development Framework', link: 'https://trufflesuite.com' },
        { name: 'Ganache', description: 'Free personal blockchain for development', logo: 'https://trufflesuite.com/favicon.ico', category: 'Testing Tools', link: 'https://trufflesuite.com/ganache' },
        { name: 'Web3.js', description: 'Free JavaScript library for blockchain interaction', logo: 'https://web3js.readthedocs.io/favicon.ico', category: 'JavaScript Libraries', link: 'https://web3js.readthedocs.io' },
        { name: 'IPFS', description: 'Free decentralized storage protocol', logo: 'https://ipfs.io/favicon.ico', category: 'Decentralized Storage', link: 'https://ipfs.io' },
        { name: 'GitHub', description: 'Free blockchain project repository and collaboration', logo: 'https://github.com/favicon.ico', category: 'Version Control', link: 'https://github.com' },
        { name: 'ChatGPT', description: 'Free AI assistance for blockchain development', logo: 'https://openai.com/favicon.ico', category: 'AI Development Assistant', link: 'https://chat.openai.com' },
        { name: 'Etherscan', description: 'Free Ethereum blockchain explorer and analytics', logo: 'https://etherscan.io/favicon.ico', category: 'Blockchain Analytics', link: 'https://etherscan.io' },
        { name: 'CoinGecko', description: 'Free cryptocurrency market data and analysis', logo: 'https://www.coingecko.com/favicon.ico', category: 'Market Data', link: 'https://www.coingecko.com' },
        { name: 'Hardhat', description: 'Free Ethereum development environment', logo: 'https://hardhat.org/favicon.ico', category: 'Development Environment', link: 'https://hardhat.org' },
        { name: 'Polygon', description: 'Free Layer 2 scaling solution for Ethereum', logo: 'https://polygon.technology/favicon.ico', category: 'Scaling Solutions', link: 'https://polygon.technology' }
    ],

    'ai-cybersecurity': [
        { name: 'Nmap', description: 'Free network security scanner and discovery tool', logo: 'https://nmap.org/favicon.ico', category: 'Network Security', link: 'https://nmap.org' },
        { name: 'Wireshark', description: 'Free network protocol analyzer and packet capture', logo: 'https://www.wireshark.org/favicon.ico', category: 'Network Analysis', link: 'https://www.wireshark.org' },
        { name: 'OWASP ZAP', description: 'Free web application security scanner', logo: 'https://www.zaproxy.org/favicon.ico', category: 'Web Security', link: 'https://www.zaproxy.org' },
        { name: 'Metasploit Community', description: 'Free penetration testing framework', logo: 'https://www.metasploit.com/favicon.ico', category: 'Penetration Testing', link: 'https://www.metasploit.com' },
        { name: 'Burp Suite Community', description: 'Free web vulnerability scanner', logo: 'https://portswigger.net/favicon.ico', category: 'Web Security', link: 'https://portswigger.net/burp/communitydownload' },
        { name: 'Nikto', description: 'Free web server vulnerability scanner', logo: 'https://cirt.net/favicon.ico', category: 'Web Security', link: 'https://cirt.net/Nikto2' },
        { name: 'OpenVAS', description: 'Free vulnerability assessment and management', logo: 'https://www.openvas.org/favicon.ico', category: 'Vulnerability Management', link: 'https://www.openvas.org' },
        { name: 'Snort', description: 'Free intrusion detection and prevention system', logo: 'https://www.snort.org/favicon.ico', category: 'Intrusion Detection', link: 'https://www.snort.org' },
        { name: 'YARA', description: 'Free malware identification and classification tool', logo: 'https://virustotal.github.io/yara/favicon.ico', category: 'Malware Analysis', link: 'https://virustotal.github.io/yara' },
        { name: 'ChatGPT', description: 'Free AI security analysis and threat intelligence', logo: 'https://openai.com/favicon.ico', category: 'AI Security Assistant', link: 'https://chat.openai.com' },
        { name: 'VirusTotal', description: 'Free malware analysis and threat intelligence', logo: 'https://www.virustotal.com/favicon.ico', category: 'Threat Intelligence', link: 'https://www.virustotal.com' },
        { name: 'Shodan', description: 'Free internet-connected device search engine', logo: 'https://www.shodan.io/favicon.ico', category: 'Reconnaissance', link: 'https://www.shodan.io' },
        { name: 'Maltego Community', description: 'Free link analysis and data mining tool', logo: 'https://www.maltego.com/favicon.ico', category: 'OSINT', link: 'https://www.maltego.com' },
        { name: 'John the Ripper', description: 'Free password cracking tool', logo: 'https://www.openwall.com/favicon.ico', category: 'Password Security', link: 'https://www.openwall.com/john' },
        { name: 'Hashcat', description: 'Free advanced password recovery tool', logo: 'https://hashcat.net/favicon.ico', category: 'Password Security', link: 'https://hashcat.net/hashcat' }
    ],

    'ai-robotics': [
        { name: 'ROS (Robot Operating System)', description: 'Free robotics development framework', logo: 'https://www.ros.org/favicon.ico', category: 'Robotics Framework', link: 'https://www.ros.org' },
        { name: 'Gazebo', description: 'Free robot simulation environment', logo: 'http://gazebosim.org/favicon.ico', category: 'Simulation', link: 'http://gazebosim.org' },
        { name: 'Arduino IDE', description: 'Free microcontroller programming environment', logo: 'https://www.arduino.cc/favicon.ico', category: 'Hardware Programming', link: 'https://www.arduino.cc' },
        { name: 'OpenCV', description: 'Free computer vision and machine learning library', logo: 'https://opencv.org/favicon.ico', category: 'Computer Vision', link: 'https://opencv.org' },
        { name: 'TensorFlow', description: 'Free machine learning framework for robotics AI', logo: 'https://www.tensorflow.org/favicon.ico', category: 'Machine Learning', link: 'https://www.tensorflow.org' },
        { name: 'PyTorch', description: 'Free deep learning framework for robotics', logo: 'https://pytorch.org/favicon.ico', category: 'Deep Learning', link: 'https://pytorch.org' },
        { name: 'MoveIt', description: 'Free motion planning framework for ROS', logo: 'https://moveit.ros.org/favicon.ico', category: 'Motion Planning', link: 'https://moveit.ros.org' },
        { name: 'V-REP (CoppeliaSim)', description: 'Free robot simulation platform', logo: 'https://www.coppeliarobotics.com/favicon.ico', category: 'Simulation', link: 'https://www.coppeliarobotics.com' },
        { name: 'FreeCAD', description: 'Free 3D CAD modeler for robot design', logo: 'https://www.freecadweb.org/favicon.ico', category: '3D Design', link: 'https://www.freecadweb.org' },
        { name: 'Blender', description: 'Free 3D modeling and animation for robotics', logo: 'https://www.blender.org/favicon.ico', category: '3D Modeling', link: 'https://www.blender.org' },
        { name: 'ChatGPT', description: 'Free AI assistance for robotics programming', logo: 'https://openai.com/favicon.ico', category: 'AI Programming Assistant', link: 'https://chat.openai.com' },
        { name: 'GitHub', description: 'Free robotics project repository and collaboration', logo: 'https://github.com/favicon.ico', category: 'Version Control', link: 'https://github.com' },
        { name: 'Jupyter Notebook', description: 'Free interactive robotics development environment', logo: 'https://jupyter.org/favicon.ico', category: 'Development Environment', link: 'https://jupyter.org' },
        { name: 'MATLAB Online', description: 'Free robotics toolbox and simulation (limited)', logo: 'https://www.mathworks.com/favicon.ico', category: 'Robotics Toolbox', link: 'https://www.mathworks.com/products/matlab-online.html' },
        { name: 'RigidBodyDynamics.jl', description: 'Free robotics dynamics library in Julia', logo: 'https://julialang.org/favicon.ico', category: 'Dynamics Simulation', link: 'https://github.com/JuliaRobotics/RigidBodyDynamics.jl' }
    ],

    'ai-agriculture': [
        { name: 'QGIS', description: 'Free geographic information system for precision agriculture', logo: 'https://qgis.org/favicon.ico', category: 'GIS Mapping', link: 'https://qgis.org' },
        { name: 'Google Earth Engine', description: 'Free satellite imagery and geospatial analysis', logo: 'https://earthengine.google.com/favicon.ico', category: 'Satellite Imagery', link: 'https://earthengine.google.com' },
        { name: 'OpenDroneMap', description: 'Free drone mapping and photogrammetry software', logo: 'https://www.opendronemap.org/favicon.ico', category: 'Drone Mapping', link: 'https://www.opendronemap.org' },
        { name: 'R for Agriculture', description: 'Free statistical computing for agricultural data', logo: 'https://www.r-project.org/favicon.ico', category: 'Data Analysis', link: 'https://www.r-project.org' },
        { name: 'Python AgriTech', description: 'Free programming language for agricultural AI', logo: 'https://www.python.org/favicon.ico', category: 'Programming Tools', link: 'https://www.python.org' },
        { name: 'TensorFlow', description: 'Free machine learning for crop disease detection', logo: 'https://www.tensorflow.org/favicon.ico', category: 'Machine Learning', link: 'https://www.tensorflow.org' },
        { name: 'OpenCV', description: 'Free computer vision for crop monitoring', logo: 'https://opencv.org/favicon.ico', category: 'Computer Vision', link: 'https://opencv.org' },
        { name: 'Sentinel Hub', description: 'Free satellite data access for agriculture', logo: 'https://www.sentinel-hub.com/favicon.ico', category: 'Satellite Data', link: 'https://www.sentinel-hub.com' },
        { name: 'NASA GISS', description: 'Free climate data for agricultural planning', logo: 'https://data.giss.nasa.gov/favicon.ico', category: 'Climate Data', link: 'https://data.giss.nasa.gov' },
        { name: 'ChatGPT', description: 'Free AI assistance for agricultural optimization', logo: 'https://openai.com/favicon.ico', category: 'AI Agriculture Assistant', link: 'https://chat.openai.com' },
        { name: 'PlantNet', description: 'Free plant identification and botanical database', logo: 'https://plantnet.org/favicon.ico', category: 'Plant Identification', link: 'https://plantnet.org' },
        { name: 'iNaturalist', description: 'Free biodiversity observation and species identification', logo: 'https://www.inaturalist.org/favicon.ico', category: 'Biodiversity Monitoring', link: 'https://www.inaturalist.org' },
        { name: 'Weather Underground', description: 'Free weather data and forecasting for farms', logo: 'https://www.wunderground.com/favicon.ico', category: 'Weather Data', link: 'https://www.wunderground.com' },
        { name: 'Jupyter Notebook', description: 'Free agricultural data analysis environment', logo: 'https://jupyter.org/favicon.ico', category: 'Data Analysis', link: 'https://jupyter.org' },
        { name: 'GitHub', description: 'Free agricultural AI project repository', logo: 'https://github.com/favicon.ico', category: 'Version Control', link: 'https://github.com' }
    ],

    'ai-energy': [
        { name: 'OpenEI', description: 'Free energy data and analysis platform', logo: 'https://openei.org/favicon.ico', category: 'Energy Data', link: 'https://openei.org' },
        { name: 'NREL SAM', description: 'Free renewable energy system modeling', logo: 'https://sam.nrel.gov/favicon.ico', category: 'Energy Modeling', link: 'https://sam.nrel.gov' },
        { name: 'PVLib Python', description: 'Free solar photovoltaic modeling library', logo: 'https://pvlib-python.readthedocs.io/favicon.ico', category: 'Solar Energy', link: 'https://pvlib-python.readthedocs.io' },
        { name: 'WindPowerLib', description: 'Free wind power modeling and analysis', logo: 'https://windpowerlib.readthedocs.io/favicon.ico', category: 'Wind Energy', link: 'https://windpowerlib.readthedocs.io' },
        { name: 'EnergyPLAN', description: 'Free energy system analysis tool', logo: 'https://www.energyplan.eu/favicon.ico', category: 'Energy Planning', link: 'https://www.energyplan.eu' },
        { name: 'OpenDSS', description: 'Free electric power distribution system simulator', logo: 'https://www.epri.com/favicon.ico', category: 'Grid Simulation', link: 'https://www.epri.com/pages/sa/opendss' },
        { name: 'TensorFlow', description: 'Free machine learning for energy optimization', logo: 'https://www.tensorflow.org/favicon.ico', category: 'Machine Learning', link: 'https://www.tensorflow.org' },
        { name: 'Python Energy', description: 'Free programming for energy management systems', logo: 'https://www.python.org/favicon.ico', category: 'Programming Tools', link: 'https://www.python.org' },
        { name: 'HOMER Grid', description: 'Free microgrid and distributed energy modeling', logo: 'https://www.homerenergy.com/favicon.ico', category: 'Microgrid Design', link: 'https://www.homerenergy.com' },
        { name: 'ChatGPT', description: 'Free AI assistance for energy optimization', logo: 'https://openai.com/favicon.ico', category: 'AI Energy Assistant', link: 'https://chat.openai.com' },
        { name: 'EIA Data', description: 'Free US energy information and statistics', logo: 'https://www.eia.gov/favicon.ico', category: 'Energy Statistics', link: 'https://www.eia.gov' },
        { name: 'IEA Data', description: 'Free international energy data and analysis', logo: 'https://www.iea.org/favicon.ico', category: 'Global Energy Data', link: 'https://www.iea.org' },
        { name: 'Jupyter Notebook', description: 'Free energy data analysis environment', logo: 'https://jupyter.org/favicon.ico', category: 'Data Analysis', link: 'https://jupyter.org' },
        { name: 'GitHub', description: 'Free energy management project repository', logo: 'https://github.com/favicon.ico', category: 'Version Control', link: 'https://github.com' },
        { name: 'MATLAB Online', description: 'Free energy system modeling (limited access)', logo: 'https://www.mathworks.com/favicon.ico', category: 'Energy Modeling', link: 'https://www.mathworks.com/products/matlab-online.html' }
    ]
};

// Show tools for a specific category with history support
function showTools(category, updateHistory = true) {
    const toolsSection = document.getElementById('tools-display');
    const toolsTitle = document.getElementById('tools-title');
    const toolsGrid = document.getElementById('tools-grid');
    
    // Hide main content completely
    hideAllSections();
    
    // Hide hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) heroSection.style.display = 'none';
    
    // Show tools section
    toolsSection.style.display = 'block';
    
    // Set title
    const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    toolsTitle.textContent = categoryName;

    // Inject pricing filter UI below the title (checkboxes)
    let pricingFilter = document.getElementById('pricing-filter');
    if (pricingFilter) pricingFilter.remove(); // Remove any existing filter
    pricingFilter = document.createElement('div');
    pricingFilter.id = 'pricing-filter';
    pricingFilter.style.display = 'flex';
    pricingFilter.style.justifyContent = 'center';
    pricingFilter.style.gap = '24px';
    pricingFilter.style.margin = '16px 0 24px 0';
    pricingFilter.innerHTML = `
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 600; color: var(--text-primary);">
            <input type="checkbox" class="pricing-checkbox" data-pricing="all" checked style="accent-color: #6366f1; width: 18px; height: 18px;"> All
        </label>
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 600; color: var(--text-primary);">
            <input type="checkbox" class="pricing-checkbox" data-pricing="free" style="accent-color: #10b981; width: 18px; height: 18px;"> Free
        </label>
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 600; color: var(--text-primary);">
            <input type="checkbox" class="pricing-checkbox" data-pricing="freemium" style="accent-color: #f59e0b; width: 18px; height: 18px;"> Freemium
        </label>
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: 600; color: var(--text-primary);">
            <input type="checkbox" class="pricing-checkbox" data-pricing="premium" style="accent-color: #ef4444; width: 18px; height: 18px;"> Premium
        </label>
    `;
    // Move filter to always be between heading and tool list
    // Remove any existing filter from anywhere in the container
    const container = toolsSection.querySelector('.container');
    const oldFilter = container.querySelector('#pricing-filter');
    if (oldFilter) oldFilter.remove();
    // Insert filter after the header (tools-header), before tools-grid
    const toolsHeader = container.querySelector('.tools-header');
    const toolsGridEl = container.querySelector('#tools-grid');
    if (toolsHeader && toolsGridEl) {
        toolsHeader.after(pricingFilter);
    }

    // Clear previous tools
    toolsGrid.innerHTML = '';
    
    // Get tools for this category
    const tools = aiToolsData[category] || [];
    
    // Sort tools - free tools first
    const freeTools = [
        'ChatGPT', 'Claude', 'Google Bard', 'Character.AI', 'Replika', 'Canva', 'Figma', 'GIMP',
        'VS Code', 'GitHub', 'Google Translate', 'DeepL', 'Grammarly', 'Hemingway Editor',
        'Google Search Console', 'Google Analytics', 'Notion', 'Trello', 'Asana', 'Slack', 'Zoom',
        'Buffer', 'Hootsuite', 'Later', 'Audacity', 'GarageBand', 'Anchor', 'Otter.ai', 'Google Docs'
    ];
    const sortedTools = tools.sort((a, b) => {
        const aIsFree = freeTools.includes(a.name);
        const bIsFree = freeTools.includes(b.name);
        if (aIsFree && !bIsFree) return -1;
        if (!aIsFree && bIsFree) return 1;
        return 0;
    });
    
    // Helper to render tool cards by pricing (checkbox logic)
    function renderToolCards(selected) {
        toolsGrid.innerHTML = '';
        let filtered = sortedTools;
        if (selected.length === 0 || selected.includes('all')) {
            // Show all tools
        } else {
            filtered = sortedTools.filter(tool => selected.includes((tool.pricing || 'free').toLowerCase()));
        }
        if (filtered.length === 0) {
            const noResult = document.createElement('div');
            noResult.textContent = 'No tools found for this pricing.';
            noResult.style.cssText = 'grid-column: 1 / -1; text-align: center; color: var(--text-muted); margin: 32px 0; font-size: 1.2rem;';
            toolsGrid.appendChild(noResult);
        } else {
            filtered.forEach(tool => {
                const toolCard = createToolCard(tool);
                toolsGrid.appendChild(toolCard);
            });
        }
    }

    // Initial render (all)
    renderToolCards(['all']);

    // Add event listeners to pricing filter checkboxes
    const pricingCheckboxes = document.querySelectorAll('#pricing-filter .pricing-checkbox');
    pricingCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            let checked = Array.from(pricingCheckboxes).filter(cb => cb.checked).map(cb => cb.dataset.pricing);
            // If 'all' is checked, uncheck others
            if (this.dataset.pricing === 'all' && this.checked) {
                pricingCheckboxes.forEach(cb => { if (cb.dataset.pricing !== 'all') cb.checked = false; });
                checked = ['all'];
            } else if (this.dataset.pricing !== 'all' && this.checked) {
                document.querySelector('#pricing-filter .pricing-checkbox[data-pricing="all"]').checked = false;
                checked = Array.from(pricingCheckboxes).filter(cb => cb.checked).map(cb => cb.dataset.pricing);
            } else if (Array.from(pricingCheckboxes).filter(cb => cb.checked).length === 0) {
                // If none checked, default to 'all'
                document.querySelector('#pricing-filter .pricing-checkbox[data-pricing="all"]').checked = true;
                checked = ['all'];
            }
            renderToolCards(checked);
        });
    });
    
    // Update history
    if (updateHistory) {
        updateState({ page: 'home', section: 'ai-tools', category }, true);
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Show workflow tools with history support
function showWorkflow(workflow, updateHistory = true) {
    // Remove pricing filter if present (prevents filter from showing in workflows)
    const pricingFilter = document.getElementById('pricing-filter');
    if (pricingFilter) pricingFilter.remove();
    const toolsSection = document.getElementById('tools-display');
    const toolsTitle = document.getElementById('tools-title');
    const toolsGrid = document.getElementById('tools-grid');
    
    // Hide main content completely
    hideAllSections();
    
    // Hide hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) heroSection.style.display = 'none';
    
    // Show tools section
    toolsSection.style.display = 'block';
    
    // Set title
    const workflowName = workflow.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    toolsTitle.textContent = workflowName;
    
    // Clear previous tools
    toolsGrid.innerHTML = '';
    
    // Get tools for this workflow
    const tools = workflowData[workflow] || [];
    
    // Group tools by category
    const groupedTools = {};
    tools.forEach(tool => {
        if (!groupedTools[tool.category]) {
            groupedTools[tool.category] = [];
        }
        groupedTools[tool.category].push(tool);
    });
    
    // Create sections with headings for each category
    Object.keys(groupedTools).forEach(category => {
        // Create category heading
        const categoryHeading = document.createElement('h3');
        categoryHeading.textContent = category;
        categoryHeading.style.cssText = 'grid-column: 1 / -1; font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin: 20px 0 10px 0; border-bottom: 2px solid var(--primary-color); padding-bottom: 8px;';
        toolsGrid.appendChild(categoryHeading);
        
        // Create tool cards for this category
        groupedTools[category].forEach(tool => {
            const toolCard = createWorkflowToolCard(tool);
            toolsGrid.appendChild(toolCard);
        });
    });
    
    // Update history
    if (updateHistory) {
        updateState({ page: 'home', section: 'workflows', category: workflow }, true);
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Get fallback icon based on category
function getFallbackIcon(category) {
    const iconMap = {
        // AI Tools Categories
        '3D Generation': 'fa-cube',
        'AI Assistant': 'fa-robot',
        'AI Detection': 'fa-search',
        'Image Generation': 'fa-image',

        'Photo Editing': 'fa-camera',
        'Code Generation': 'fa-code',
        'Text Generation': 'fa-file-alt',
        'Writing Assistant': 'fa-pen',
        'Video Generation': 'fa-video',
        'Voice Generation': 'fa-microphone',
        'Music Generation': 'fa-music',
        'Chatbots': 'fa-comments',
        'Design Tools': 'fa-palette',
        'Data Analysis': 'fa-chart-bar',
        'Analytics': 'fa-chart-bar',
        'Automation': 'fa-cogs',
        'Translation': 'fa-language',
        'SEO Tools': 'fa-laptop-code',
        'Email Tools': 'fa-envelope',
        'Presentation Tools': 'fa-chalkboard-teacher',
        'Research Tools': 'fa-search',
        'Research': 'fa-search',
        'Productivity': 'fa-tasks',
        'Finance Tools': 'fa-dollar-sign',
        'Health Tools': 'fa-heartbeat',
        'Education Tools': 'fa-graduation-cap',
        'Gaming Tools': 'fa-gamepad',
        'Social Media': 'fa-share-alt',
        'Legal Tools': 'fa-gavel',
        'HR Tools': 'fa-users',
        'Recruitment': 'fa-user-tie',
        'Real Estate': 'fa-home',
        'Sales Tools': 'fa-handshake',
        'Customer Service': 'fa-headset',
        'Cybersecurity': 'fa-shield-alt',
        'Content Moderation': 'fa-shield-alt',
        'Logistics': 'fa-truck',
        'Inventory': 'fa-boxes',
        'Agriculture': 'fa-seedling',
        'Survey Tools': 'fa-poll',
        'Meeting Tools': 'fa-video',
        'API Tools': 'fa-plug',
        'Resume Builders': 'fa-file-alt',
        'ATS Resume Checkers': 'fa-search-plus',
        'Document Processing': 'fa-file-invoice',
        
        // Extended AI Categories
        'Education AI': 'fa-graduation-cap',
        'Cybersecurity AI': 'fa-shield-alt',
        'Robotics AI': 'fa-robot',
        'AI Art Tools': 'fa-palette',
        'Agriculture AI': 'fa-seedling',
        'Manufacturing AI': 'fa-industry',
        'Energy AI': 'fa-bolt',
        'Retail AI': 'fa-shopping-cart',
        'Finance AI': 'fa-dollar-sign',
        'Real Estate AI': 'fa-home',
        'Travel AI': 'fa-plane',
        'Weather AI': 'fa-cloud',
        'Sports AI': 'fa-futbol',
        'Music Analysis AI': 'fa-music',
        'Fashion AI': 'fa-tshirt',
        'Game Design AI': 'fa-gamepad',
        'Ocean AI': 'fa-water',
        'Construction AI': 'fa-hard-hat',
        'Legal AI': 'fa-gavel',
        'Astronomy AI': 'fa-star',
        'Archaeology AI': 'fa-search',
        'Wildlife AI': 'fa-paw',
        'Transportation AI': 'fa-car',
        'Insurance AI': 'fa-shield-alt',
        'Mental Health AI': 'fa-brain',
        'Journalism AI': 'fa-newspaper',
        'Water Management AI': 'fa-tint',
        'Space AI': 'fa-rocket',
        'Blockchain AI': 'fa-link',
        'Scientific Research': 'fa-flask',
        'IoT & Smart Home': 'fa-home',
        'Accessibility Tools': 'fa-universal-access',
        'Healthcare': 'fa-heartbeat',
        'Music Creation': 'fa-music',
        'Interior Design': 'fa-couch',
        'Speech Recognition': 'fa-microphone',
        'Data Visualization': 'fa-chart-pie',
        'Customer Insights': 'fa-users',
        'Legal Tech': 'fa-gavel',
        'AI Avatars': 'fa-user-circle',
        'AI Search': 'fa-search',
        'Audio Enhancement': 'fa-volume-up',
        'AI Summarization': 'fa-compress-alt',
        'Video Editing': 'fa-cut',
        'Language Learning': 'fa-language',
        'AI Fitness': 'fa-dumbbell',
        'AI Gaming': 'fa-gamepad',
        'AI Dating': 'fa-heart',
        'AI Cooking': 'fa-utensils',
        'AI Parenting': 'fa-baby',
         'AI Cooking': 'fa-utensils',
         'AI Sustainability': 'fa-leaf',
         'Logo Generators': 'fa-paint-brush',
         'AI Sports Analytics':'fa-football-ball',
         'Job Finder': 'fa-briefcase',
         'Job Applier': 'fa-paper-plane',
         'AI Podcasting': 'fa-podcast',
         'AI Event Planning': 'fa-calendar-check',
         'AI Personal Finance': 'fa-wallet',
         'AI Gardening': 'fa-seedling',
         'AI Pet Care': 'fa-paw',
         'Supply Chain Management': 'fa-truck',
         'Quality Assurance': 'fa-check-circle',
         'Compliance And Audit': 'fa-balance-scale',
         'Risk Management': 'fa-shield-alt',
         'AI Procurement': 'fa-shopping-cart',
         'Animation': 'fa-film',
         'Storyboarding': 'fa-sticky-note',
         'Sound Effects': 'fa-volume-up',
         'AI Mining': 'fa-diamond',
         'Telecommunications': 'fa-phone',
         'Aerospace': 'fa-plane',
         'Maritime': 'fa-anchor',
         'Waste Management': 'fa-recycle',
         'Quantum Computing': 'fa-microchip',
         'Augmented Reality': 'fa-eye',
         'Virtual Reality': 'fa-vr-cardboard',
         'Metaverse Tools': 'fa-globe',
         'Web Blockchain Integration': 'fa-link',
         'Code Debuggers': 'fa-bug',
         'Pdf Tools': 'fa-file-pdf',
         'Noise Remover': 'fa-volume-mute',
        
        // Workflow Categories
        'Content Planning': 'fa-calendar-alt',
        'Content Creation': 'fa-pen-fancy',
        'Design': 'fa-palette',
        'Video Production': 'fa-video',
        'Marketing': 'fa-bullhorn',
        'Development': 'fa-code',
        'Content': 'fa-file-alt',
        'Strategy': 'fa-chess',
        'Creation': 'fa-plus-circle',
        'Distribution': 'fa-share',
        'Analysis': 'fa-chart-pie',
        'Production': 'fa-microphone',
        'Post-Production': 'fa-edit',
        'Visual': 'fa-image',
        'Support': 'fa-life-ring',
        'Management': 'fa-users-cog',
        'SEO Research': 'fa-search-plus',
        'Content SEO': 'fa-file-alt',
        'Technical SEO': 'fa-cogs',
        'SEO Monitoring': 'fa-chart-line',
        'Influencer Search': 'fa-star',
        'Campaign Management': 'fa-tasks',
        'Video Creation': 'fa-video',
        'Network Management': 'fa-network-wired',
        'Tracking': 'fa-chart-line',
        'Optimization': 'fa-chart-up',
        'Configuration': 'fa-cogs',
        'Data Migration': 'fa-database',
        'Integration': 'fa-plug',
        'List Management': 'fa-list',
        'Event Management': 'fa-calendar-alt',
        'Venue Selection': 'fa-map-marker-alt',
        'Registration': 'fa-clipboard-list',
        'Market Intelligence': 'fa-chart-pie',
        'Price Monitoring': 'fa-dollar-sign',
        'Client Management': 'fa-handshake',
        'Project Management': 'fa-project-diagram',
        'Invoicing': 'fa-file-invoice',
        'Time Tracking': 'fa-clock',
        'Resume Building': 'fa-file-alt',
        'ATS Optimization': 'fa-search-plus',
        'Graphics Creation': 'fa-image',
        'Content Writing': 'fa-pen',
        'Hosting & Deployment': 'fa-server',
        'SEO & Analytics': 'fa-chart-line',
        'Content Calendar': 'fa-calendar',
        'Visual Content': 'fa-image',
        'Analytics & Optimization': 'fa-chart-bar',
        'Scheduling & Publishing': 'fa-clock',
        'Analytics & Monitoring': 'fa-chart-line',
        'Script Writing': 'fa-file-text',
        'Recording & Editing': 'fa-microphone',
        'Branding & Design': 'fa-palette',
        'Publishing & Distribution': 'fa-share',
        'Analytics & Promotion': 'fa-chart-bar',
        'Market Research': 'fa-search',
        'Platform Setup': 'fa-cogs',
        'Product Content': 'fa-box',
        'Visual Design': 'fa-palette',
        'Payment & Shipping': 'fa-credit-card',
        'Planning & Research': 'fa-clipboard-list',
        'Design & Prototyping': 'fa-drafting-compass',
        'Backend & Database': 'fa-database',
        'Version Control': 'fa-code-branch',
        'Testing & Deployment': 'fa-rocket',
        'Lead Generation': 'fa-magnet'
    };
    return iconMap[category] || 'fa-laptop-code';
}

// Get user-specific saved tools key
function getSavedToolsKey() {
    return currentUser ? `savedTools_${currentUser.id}` : null;
}

// Get saved tools for current user
function getSavedTools() {
    const key = getSavedToolsKey();
    return key ? JSON.parse(localStorage.getItem(key) || '[]') : [];
}

// Save tools for current user
function setSavedTools(tools) {
    const key = getSavedToolsKey();
    if (key) {
        localStorage.setItem(key, JSON.stringify(tools));
    }
}

// Create tool card element with fallback for broken images
function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    const fallbackIcon = getFallbackIcon(tool.category);
    
    // Check if tool is saved (only if user is logged in)
    const savedTools = getSavedTools();
    const isSaved = currentUser && savedTools.some(t => t.name === tool.name);

    // Determine badge label and class
    let badgeLabel = 'FREE';
    let badgeClass = 'free';
    if (tool.pricing) {
        if (tool.pricing.toLowerCase() === 'premium') {
            badgeLabel = 'PREMIUM';
            badgeClass = 'premium';
        } else if (tool.pricing.toLowerCase() === 'freemium') {
            badgeLabel = 'FREEMIUM';
            badgeClass = 'freemium';
        } else {
            badgeLabel = tool.pricing.toUpperCase();
            badgeClass = tool.pricing.toLowerCase();
        }
    }
    card.innerHTML = `
        <div class="tool-header" style="position:relative;">
            <div class="tool-logo">
                <img src="${tool.logo}" alt="${tool.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <i class="fas ${fallbackIcon}" style="display: none;"></i>
            </div>
            <div class="tool-info">
                <h3>${tool.name}</h3>
                <p>${tool.category}</p>
            </div>
            <button class="bookmark-btn" title="${currentUser ? 'Save tool' : 'Login to save tools'}" style="position:absolute;top:0;right:0;background:none;border:none;outline:none;cursor:pointer;padding:8px;z-index:2;">
                <i class="fa${isSaved ? 's' : 'r'} fa-bookmark" style="color:${isSaved ? '#6366f1' : '#b0b0b0'};font-size:22px;"></i>
            </button>
        </div>
        <p class="tool-description">${tool.description}</p>
        <div class="tool-actions">
            <div class="tool-status">
                <span class="status-badge ${badgeClass}">${badgeLabel}</span>
            </div>
            <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <i class="fas fa-external-link-alt"></i>
                Visit Tool
            </a>
        </div>
    `;

    // Bookmark button logic
    const bookmarkBtn = card.querySelector('.bookmark-btn');
    bookmarkBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!currentUser) {
            alert('Please login to save tools.');
            return;
        }
        let saved = getSavedTools();
        const alreadySaved = saved.some(t => t.name === tool.name);
        if (alreadySaved) {
            saved = saved.filter(t => t.name !== tool.name);
        } else {
            saved.push(tool);
        }
        setSavedTools(saved);
        // Update icon
        const icon = bookmarkBtn.querySelector('i');
        icon.className = `fa${alreadySaved ? 'r' : 's'} fa-bookmark`;
        icon.style.color = alreadySaved ? '#b0b0b0' : '#6366f1';
    });
    return card;
}

// Create workflow tool card with rating bar instead of status badge
function createWorkflowToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    const fallbackIcon = getFallbackIcon(tool.category);
    
    // Check if tool is saved (only if user is logged in)
    const savedTools = getSavedTools();
    const isSaved = currentUser && savedTools.some(t => t.name === tool.name);

    // Generate rating based on tool popularity and quality
    const getRating = (toolName) => {
        const ratings = {
            'HubSpot': '4.8', 'Salesforce': '4.7', 'Slack': '4.6', 'Zoom': '4.5', 'Trello': '4.4',
            'Asana': '4.3', 'Monday.com': '4.2', 'Notion': '4.6', 'Google Workspace': '4.5',
            'Microsoft 365': '4.4', 'Zendesk': '4.3', 'Freshdesk': '4.2', 'Intercom': '4.4',
            'Mailchimp': '4.1', 'Canva': '4.7', 'Adobe Creative Suite': '4.6', 'Figma': '4.8',
            'Sketch': '4.3', 'InVision': '4.0', 'Zapier': '4.5', 'IFTTT': '4.2'
        };
        return ratings[toolName] || (Math.random() * 1.0 + 4.0).toFixed(1);
    };
    const rating = getRating(tool.name);
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    card.innerHTML = `
        <div class="tool-header" style="position:relative;">
            <div class="tool-logo">
                <img src="${tool.logo}" alt="${tool.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <i class="fas ${fallbackIcon}" style="display: none;"></i>
            </div>
            <div class="tool-info">
                <h3>${tool.name}</h3>
                <p>${tool.category}</p>
            </div>
            <button class="bookmark-btn" title="${currentUser ? 'Save tool' : 'Login to save tools'}" style="position:absolute;top:0;right:0;background:none;border:none;outline:none;cursor:pointer;padding:8px;z-index:2;">
                <i class="fa${isSaved ? 's' : 'r'} fa-bookmark" style="color:${isSaved ? '#6366f1' : '#b0b0b0'};font-size:22px;"></i>
            </button>
        </div>
        <p class="tool-description">${tool.description}</p>
        <div class="tool-actions">
            <div class="tool-rating" style="display:flex;align-items:center;gap:8px;">
                <div class="stars" style="display:flex;gap:2px;">
                    ${Array.from({length: 5}, (_, i) => {
                        if (i < fullStars) {
                            return '<i class="fas fa-star" style="color:#fbbf24;font-size:14px;"></i>';
                        } else if (i === fullStars && hasHalfStar) {
                            return '<i class="fas fa-star-half-alt" style="color:#fbbf24;font-size:14px;"></i>';
                        } else {
                            return '<i class="far fa-star" style="color:#d1d5db;font-size:14px;"></i>';
                        }
                    }).join('')}
                </div>
                <span style="font-size:14px;color:var(--text-secondary);">${rating}</span>
            </div>
            <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <i class="fas fa-external-link-alt"></i>
                Visit Tool
            </a>
        </div>
    `;

    // Bookmark button logic
    const bookmarkBtn = card.querySelector('.bookmark-btn');
    bookmarkBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!currentUser) {
            alert('Please login to save tools.');
            return;
        }
        let saved = getSavedTools();
        const alreadySaved = saved.some(t => t.name === tool.name);
        if (alreadySaved) {
            saved = saved.filter(t => t.name !== tool.name);
        } else {
            saved.push(tool);
        }
        setSavedTools(saved);
        // Update icon
        const icon = bookmarkBtn.querySelector('i');
        icon.className = `fa${alreadySaved ? 'r' : 's'} fa-bookmark`;
        icon.style.color = alreadySaved ? '#b0b0b0' : '#6366f1';
    });
    return card;
}

// Go back to main view with history support
function goBack() {
    if (currentState.page === 'saved-tools') {
        // Go back to home page from saved tools
        updateState({ page: 'home', section: 'ai-tools', category: null }, true);
    } else if (currentState.category) {
        // Go back from tools view to category view
        updateState({ page: 'home', section: currentState.section || 'ai-tools', category: null }, true);
    } else {
        // Default back to home
        updateState({ page: 'home', section: 'ai-tools', category: null }, true);
    }
    renderCurrentState();
}

// Search functionality
function searchTools() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const activeTab = document.querySelector('.tab-btn.active');
    const isAITools = activeTab && activeTab.getAttribute('data-section') === 'ai-tools';
    
    if (searchTerm.length === 0) {
        clearSearch();
        return;
    }
    
    if (isAITools) {
        // Search AI tools categories
        const categories = document.querySelectorAll('#ai-tools .category-card');
        categories.forEach(category => {
            const title = category.querySelector('.category-title').textContent.toLowerCase();
            const description = category.querySelector('.category-description')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                category.style.display = 'block';
            } else {
                category.style.display = 'none';
            }
        });
    } else {
        // Search workflow categories
        const categories = document.querySelectorAll('#workflows .category-card');
        categories.forEach(category => {
            const title = category.querySelector('.category-title').textContent.toLowerCase();
            const description = category.querySelector('.category-description')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                category.style.display = 'block';
            } else {
                category.style.display = 'none';
            }
        });
    }
}

// Clear search when switching tabs or on input clear
function clearSearch() {
    const categories = document.querySelectorAll('.category-card');
    categories.forEach(category => {
        category.style.display = 'block';
    });
}
// No custom JS submit handler for submit-tool-form. Let Formspree handle the form natively.



























