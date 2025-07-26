// Browser History Management
let currentState = {
    page: 'home',
    section: 'ai-tools',
    category: null
};

// Initialize page state
function initializePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'home';
    const section = urlParams.get('section') || 'ai-tools';
    const category = urlParams.get('category');
    
    currentState = { page, section, category };
    renderCurrentState();
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
        showMainContent();
        if (currentState.section) {
            switchTab(currentState.section, false);
        }
        if (currentState.category) {
            showTools(currentState.category, false);
        }
    } else {
        showPage(currentState.page);
    }
}

// Hide all sections
function hideAllSections() {
    document.querySelector('.main-content').style.display = 'none';
    document.getElementById('tools-display').style.display = 'none';
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

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('.dark-mode-btn i').className = 'fas fa-sun';
    }
    
    // Initialize page state
    initializePage();
    
    // Set default active tab
    document.getElementById('ai-tools').classList.add('active');
    
    // Add event listeners for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
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
            if (page) {
                updateState({ page, section: null, category: null }, true);
                renderCurrentState();
            }
        });
    });
    
    // Logo click handler
    document.querySelector('.logo').addEventListener('click', function() {
        updateState({ page: 'home', section: 'ai-tools', category: null }, false);
        renderCurrentState();
    });
    
    document.querySelector('.footer-logo').addEventListener('click', function() {
        updateState({ page: 'home', section: 'ai-tools', category: null }, false);
        renderCurrentState();
    });
    
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

// Tab switching with history support
function switchTab(tabName, updateHistory = true) {
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
        { name: 'Spline', description: 'Create and publish 3D web experiences', logo: 'https://spline.design/favicon.ico', category: '3D Generation', link: 'https://spline.design/' },
        { name: 'Meshy', description: 'AI-powered 3D asset generation', logo: 'https://www.meshy.ai/favicon.ico', category: '3D Generation', link: 'https://www.meshy.ai/' },
        { name: 'Kaedim', description: 'Turn 2D images into 3D models', logo: 'https://www.kaedim3d.com/favicon.ico', category: '3D Generation', link: 'https://www.kaedim3d.com/' },
        { name: 'Leonardo.AI', description: '3D model generation with AI', logo: 'https://leonardo.ai/favicon.ico', category: '3D Generation', link: 'https://leonardo.ai/' },
        { name: 'Luma AI', description: 'Create 3D objects from text', logo: 'https://lumalabs.ai/favicon.ico', category: '3D Generation', link: 'https://lumalabs.ai/' },
        { name: 'Masterpiece Studio', description: 'AI-powered 3D creation', logo: 'https://masterpiecestudio.com/favicon.ico', category: '3D Generation', link: 'https://masterpiecestudio.com/' },
        { name: 'Poly', description: '3D modeling with AI assistance', logo: 'https://withpoly.com/favicon.ico', category: '3D Generation', link: 'https://withpoly.com/' },
        { name: 'Skybox Lab', description: 'AI-generated 3D environments', logo: 'https://skyboxlabs.com/favicon.ico', category: '3D Generation', link: 'https://skyboxlabs.com/' },
        { name: 'Mirageml', description: 'AI-powered 3D asset creation', logo: 'https://mirageml.com/favicon.ico', category: '3D Generation', link: 'https://mirageml.com/' },
        { name: 'Scenario', description: 'AI-generated game assets', logo: 'https://www.scenario.com/favicon.ico', category: '3D Generation', link: 'https://www.scenario.com/' }
    ],
    'ai-assistants': [
        { name: 'Claude', description: 'Advanced AI assistant by Anthropic', logo: 'https://claude.ai/favicon.ico', category: 'AI Assistant', link: 'https://claude.ai/' },
        { name: 'Perplexity', description: 'AI-powered answer engine', logo: 'https://www.perplexity.ai/favicon.ico', category: 'AI Assistant', link: 'https://www.perplexity.ai/' },
        { name: 'Copilot', description: 'Microsoft AI companion', logo: 'https://copilot.microsoft.com/favicon.ico', category: 'AI Assistant', link: 'https://copilot.microsoft.com/' },
        { name: 'Gemini', description: 'Google AI assistant', logo: 'https://gemini.google.com/favicon.ico', category: 'AI Assistant', link: 'https://gemini.google.com/' },
        { name: 'Pi', description: 'Personal AI assistant', logo: 'https://heypi.com/favicon.ico', category: 'AI Assistant', link: 'https://heypi.com/' },
        { name: 'Poe', description: 'AI chat platform with multiple models', logo: 'https://poe.com/favicon.ico', category: 'AI Assistant', link: 'https://poe.com/' },
        { name: 'Bing Chat', description: 'Microsoft AI search assistant', logo: 'https://www.bing.com/favicon.ico', category: 'AI Assistant', link: 'https://www.bing.com/chat' },
        { name: 'Jasper', description: 'AI assistant for marketing teams', logo: 'https://www.jasper.ai/favicon.ico', category: 'AI Assistant', link: 'https://www.jasper.ai/' },
        { name: 'YouChat', description: 'AI search assistant', logo: 'https://you.com/favicon.ico', category: 'AI Assistant', link: 'https://you.com/' },
        { name: 'Character.AI', description: 'Conversational AI characters', logo: 'https://character.ai/favicon.ico', category: 'AI Assistant', link: 'https://character.ai/' }
    ],
    'ai-detectors': [
        { name: 'GPTZero', description: 'Detect AI-generated text', logo: 'https://gptzero.me/favicon.ico', category: 'AI Detection', link: 'https://gptzero.me/' },
        { name: 'Content at Scale', description: 'AI content detector', logo: 'https://contentatscale.ai/favicon.ico', category: 'AI Detection', link: 'https://contentatscale.ai/ai-content-detector/' },
        { name: 'Originality.ai', description: 'AI content detection for businesses', logo: 'https://originality.ai/favicon.ico', category: 'AI Detection', link: 'https://originality.ai/' },
        { name: 'Copyleaks', description: 'AI content detector and plagiarism checker', logo: 'https://copyleaks.com/favicon.ico', category: 'AI Detection', link: 'https://copyleaks.com/' },
        { name: 'Winston AI', description: 'AI content detection tool', logo: 'https://gowinston.ai/favicon.ico', category: 'AI Detection', link: 'https://gowinston.ai/' },
        { name: 'Sapling', description: 'AI writing assistant with detection', logo: 'https://sapling.ai/favicon.ico', category: 'AI Detection', link: 'https://sapling.ai/' },
        { name: 'Writer', description: 'AI content detector for teams', logo: 'https://writer.com/favicon.ico', category: 'AI Detection', link: 'https://writer.com/' },
        { name: 'HiveModeration', description: 'AI content moderation platform', logo: 'https://www.hivemoderation.com/favicon.ico', category: 'AI Detection', link: 'https://www.hivemoderation.com/' },
        { name: 'Undetectable.ai', description: 'AI humanizer for content', logo: 'https://undetectable.ai/favicon.ico', category: 'AI Detection', link: 'https://undetectable.ai/' },
        { name: 'ZeroGPT', description: 'Free AI content detector', logo: 'https://zerogpt.com/favicon.ico', category: 'AI Detection', link: 'https://zerogpt.com/' }
    ],
    'image-generators': [
        { name: 'DALL-E 2', description: 'Create realistic images from text descriptions', logo: 'https://openai.com/favicon.ico', category: 'Image Generation', link: 'https://openai.com/dall-e-2/' },
        { name: 'Midjourney', description: 'AI art generator creating stunning artwork', logo: 'https://www.midjourney.com/favicon.ico', category: 'Image Generation', link: 'https://www.midjourney.com' },
        { name: 'Stable Diffusion', description: 'Open-source text-to-image AI model', logo: 'https://stability.ai/favicon.ico', category: 'Image Generation', link: 'https://stability.ai' },
        { name: 'Adobe Firefly', description: 'Creative generative AI for images and text effects', logo: 'https://www.adobe.com/favicon.ico', category: 'Image Generation', link: 'https://firefly.adobe.com' },
        { name: 'Canva AI', description: 'AI-powered design and image generation', logo: 'https://www.canva.com/favicon.ico', category: 'Image Generation', link: 'https://www.canva.com' },
        { name: 'Leonardo AI', description: 'AI art generator for creative projects', logo: 'https://leonardo.ai/favicon.ico', category: 'Image Generation', link: 'https://leonardo.ai' },
        { name: 'RunwayML', description: 'AI tools for creative content generation', logo: 'https://runwayml.com/favicon.ico', category: 'Image Generation', link: 'https://runwayml.com' },
        { name: 'DeepAI', description: 'AI image generation and enhancement tools', logo: 'https://deepai.org/favicon.ico', category: 'Image Generation', link: 'https://deepai.org' },
        { name: 'NightCafe', description: 'AI art generator with multiple algorithms', logo: 'https://creator.nightcafe.studio/favicon.ico', category: 'Image Generation', link: 'https://creator.nightcafe.studio' }
    ],
    'code-generators': [
        { name: 'GitHub Copilot', description: 'AI pair programmer for code suggestions', logo: 'https://github.com/favicon.ico', category: 'Code Generation', link: 'https://github.com/features/copilot' },
        { name: 'Tabnine', description: 'AI code completion for developers', logo: 'https://www.tabnine.com/favicon.ico', category: 'Code Generation', link: 'https://www.tabnine.com' },
        { name: 'CodeT5', description: 'AI model for code understanding and generation', logo: 'https://huggingface.co/favicon.ico', category: 'Code Generation', link: 'https://huggingface.co/Salesforce/codet5-base' },
        { name: 'Replit Ghostwriter', description: 'AI coding assistant in the browser', logo: 'https://replit.com/favicon.ico', category: 'Code Generation', link: 'https://replit.com' },
        { name: 'Amazon CodeWhisperer', description: 'AI coding companion from AWS', logo: 'https://aws.amazon.com/favicon.ico', category: 'Code Generation', link: 'https://aws.amazon.com/codewhisperer/' },
        { name: 'Codeium', description: 'Free AI-powered code acceleration toolkit', logo: 'https://codeium.com/favicon.ico', category: 'Code Generation', link: 'https://codeium.com' },
        { name: 'Sourcegraph Cody', description: 'AI coding assistant that knows your codebase', logo: 'https://sourcegraph.com/favicon.ico', category: 'Code Generation', link: 'https://sourcegraph.com/cody' },
        { name: 'Cursor', description: 'AI-first code editor', logo: 'https://cursor.sh/favicon.ico', category: 'Code Generation', link: 'https://cursor.sh' },
        { name: 'Blackbox AI', description: 'AI-powered coding assistant', logo: 'https://www.blackbox.ai/favicon.ico', category: 'Code Generation', link: 'https://www.blackbox.ai' },
        { name: 'Codex', description: 'OpenAI\'s code generation model', logo: 'https://openai.com/favicon.ico', category: 'Code Generation', link: 'https://openai.com/blog/openai-codex/' }
    ],
    'text-generators': [
        { name: 'ChatGPT', description: 'Advanced AI chatbot for text generation', logo: 'https://openai.com/favicon.ico', category: 'Text Generation', link: 'https://chat.openai.com' },
        { name: 'Claude', description: 'AI assistant for helpful, harmless, and honest conversations', logo: 'https://claude.ai/favicon.ico', category: 'Text Generation', link: 'https://claude.ai' },
        { name: 'Jasper', description: 'AI content platform for enterprise teams', logo: 'https://www.jasper.ai/favicon.ico', category: 'Text Generation', link: 'https://www.jasper.ai' },
        { name: 'Copy.ai', description: 'AI-powered copywriting tool', logo: 'https://www.copy.ai/favicon.ico', category: 'Text Generation', link: 'https://www.copy.ai' },
        { name: 'Writesonic', description: 'AI writing assistant for content creation', logo: 'https://writesonic.com/favicon.ico', category: 'Text Generation', link: 'https://writesonic.com' },
        { name: 'Grammarly', description: 'AI writing assistant for grammar and style', logo: 'https://www.grammarly.com/favicon.ico', category: 'Text Generation', link: 'https://www.grammarly.com' },
        { name: 'Notion AI', description: 'AI writing assistant integrated with Notion', logo: 'https://www.notion.so/favicon.ico', category: 'Text Generation', link: 'https://www.notion.so/product/ai' },
        { name: 'Rytr', description: 'AI writing assistant for content creation', logo: 'https://rytr.me/favicon.ico', category: 'Text Generation', link: 'https://rytr.me' },
        { name: 'QuillBot', description: 'AI paraphrasing and writing tool', logo: 'https://quillbot.com/favicon.ico', category: 'Text Generation', link: 'https://quillbot.com' },
        { name: 'Wordtune', description: 'AI writing companion for better expression', logo: 'https://www.wordtune.com/favicon.ico', category: 'Text Generation', link: 'https://www.wordtune.com' }
    ],
    'video-generators': [
        { name: 'Runway ML', description: 'AI-powered video editing and generation', logo: 'https://runwayml.com/favicon.ico', category: 'Video Generation', link: 'https://runwayml.com' },
        { name: 'Synthesia', description: 'AI video generation with virtual presenters', logo: 'https://www.synthesia.io/favicon.ico', category: 'Video Generation', link: 'https://www.synthesia.io' },
        { name: 'Pictory', description: 'AI video creation from text and blog posts', logo: 'https://pictory.ai/favicon.ico', category: 'Video Generation', link: 'https://pictory.ai' },
        { name: 'Lumen5', description: 'AI-powered video creation platform', logo: 'https://lumen5.com/favicon.ico', category: 'Video Generation', link: 'https://lumen5.com' },
        { name: 'InVideo', description: 'AI video creation and editing platform', logo: 'https://invideo.io/favicon.ico', category: 'Video Generation', link: 'https://invideo.io' },
        { name: 'Fliki', description: 'AI video generator from text', logo: 'https://fliki.ai/favicon.ico', category: 'Video Generation', link: 'https://fliki.ai' },
        { name: 'Steve AI', description: 'AI video maker for animated and live videos', logo: 'https://www.steve.ai/favicon.ico', category: 'Video Generation', link: 'https://www.steve.ai' },
        { name: 'Elai', description: 'AI video generation platform', logo: 'https://elai.io/favicon.ico', category: 'Video Generation', link: 'https://elai.io' },
        { name: 'Hour One', description: 'AI video generation with virtual humans', logo: 'https://hourone.ai/favicon.ico', category: 'Video Generation', link: 'https://hourone.ai' },
        { name: 'Colossyan', description: 'AI video creator with synthetic actors', logo: 'https://www.colossyan.com/favicon.ico', category: 'Video Generation', link: 'https://www.colossyan.com' }
    ],
    'voice-generators': [
        { name: 'ElevenLabs', description: 'AI voice synthesis and cloning platform', logo: 'https://elevenlabs.io/favicon.ico', category: 'Voice Generation', link: 'https://elevenlabs.io' },
        { name: 'Murf', description: 'AI voice generator for voiceovers', logo: 'https://murf.ai/favicon.ico', category: 'Voice Generation', link: 'https://murf.ai' },
        { name: 'Speechify', description: 'Text-to-speech AI with natural voices', logo: 'https://speechify.com/favicon.ico', category: 'Voice Generation', link: 'https://speechify.com' },
        { name: 'Descript', description: 'AI-powered audio and video editing', logo: 'https://www.descript.com/favicon.ico', category: 'Voice Generation', link: 'https://www.descript.com' },
        { name: 'Resemble AI', description: 'AI voice generator and voice cloning', logo: 'https://www.resemble.ai/favicon.ico', category: 'Voice Generation', link: 'https://www.resemble.ai' },
        { name: 'Replica Studios', description: 'AI voice actors for games and films', logo: 'https://replicastudios.com/favicon.ico', category: 'Voice Generation', link: 'https://replicastudios.com' },
        { name: 'Lovo', description: 'AI voice generator and text-to-speech', logo: 'https://www.lovo.ai/favicon.ico', category: 'Voice Generation', link: 'https://www.lovo.ai' },
        { name: 'WellSaid Labs', description: 'AI voice platform for enterprise', logo: 'https://wellsaidlabs.com/favicon.ico', category: 'Voice Generation', link: 'https://wellsaidlabs.com' },
        { name: 'Voicemod', description: 'Real-time voice changer and soundboard', logo: 'https://www.voicemod.net/favicon.ico', category: 'Voice Generation', link: 'https://www.voicemod.net' },
        { name: 'Listnr', description: 'AI voice generator for podcasts and videos', logo: 'https://www.listnr.tech/favicon.ico', category: 'Voice Generation', link: 'https://www.listnr.tech' }
    ],
    'music-generators': [
        { name: 'AIVA', description: 'AI composer for emotional soundtrack music', logo: 'https://www.aiva.ai/favicon.ico', category: 'Music Generation', link: 'https://www.aiva.ai' },
        { name: 'Mubert', description: 'AI music generation platform', logo: 'https://mubert.com/favicon.ico', category: 'Music Generation', link: 'https://mubert.com' },
        { name: 'Amper Music', description: 'AI music composition for content creators', logo: 'https://www.ampermusic.com/favicon.ico', category: 'Music Generation', link: 'https://www.ampermusic.com' },
        { name: 'Soundraw', description: 'AI music generator for creators', logo: 'https://soundraw.io/favicon.ico', category: 'Music Generation', link: 'https://soundraw.io' },
        { name: 'Boomy', description: 'Create original music with AI', logo: 'https://boomy.com/favicon.ico', category: 'Music Generation', link: 'https://boomy.com' },
        { name: 'Endel', description: 'AI-powered adaptive music for focus', logo: 'https://endel.io/favicon.ico', category: 'Music Generation', link: 'https://endel.io' },
        { name: 'Beatoven.ai', description: 'AI music generator for videos and podcasts', logo: 'https://www.beatoven.ai/favicon.ico', category: 'Music Generation', link: 'https://www.beatoven.ai' },
        { name: 'Loudly', description: 'AI music platform for content creators', logo: 'https://www.loudly.com/favicon.ico', category: 'Music Generation', link: 'https://www.loudly.com' },
        { name: 'Ecrett Music', description: 'AI music generator for content creation', logo: 'https://ecrettmusic.com/favicon.ico', category: 'Music Generation', link: 'https://ecrettmusic.com' },
        { name: 'Jukedeck', description: 'AI music composition platform', logo: 'https://www.jukedeck.com/favicon.ico', category: 'Music Generation', link: 'https://www.jukedeck.com' }
    ],
    'chatbots': [
        { name: 'ChatGPT', description: 'Advanced conversational AI assistant', logo: 'https://openai.com/favicon.ico', category: 'Chatbots', link: 'https://chat.openai.com' },
        { name: 'Claude', description: 'AI assistant by Anthropic', logo: 'https://claude.ai/favicon.ico', category: 'Chatbots', link: 'https://claude.ai' },
        { name: 'Bard', description: 'Google\'s conversational AI service', logo: 'https://bard.google.com/favicon.ico', category: 'Chatbots', link: 'https://bard.google.com' },
        { name: 'Character.AI', description: 'AI characters for conversation', logo: 'https://character.ai/favicon.ico', category: 'Chatbots', link: 'https://character.ai' },
        { name: 'Replika', description: 'AI companion chatbot', logo: 'https://replika.ai/favicon.ico', category: 'Chatbots', link: 'https://replika.ai' },
        { name: 'Dialogflow', description: 'Google\'s conversational AI platform', logo: 'https://cloud.google.com/favicon.ico', category: 'Chatbots', link: 'https://cloud.google.com/dialogflow' },
        { name: 'Microsoft Bot Framework', description: 'Build and deploy chatbots', logo: 'https://dev.botframework.com/favicon.ico', category: 'Chatbots', link: 'https://dev.botframework.com' },
        { name: 'Rasa', description: 'Open source conversational AI', logo: 'https://rasa.com/favicon.ico', category: 'Chatbots', link: 'https://rasa.com' },
        { name: 'Botpress', description: 'Open-source chatbot platform', logo: 'https://botpress.com/favicon.ico', category: 'Chatbots', link: 'https://botpress.com' },
        { name: 'Landbot', description: 'No-code chatbot builder', logo: 'https://landbot.io/favicon.ico', category: 'Chatbots', link: 'https://landbot.io' }
    ],
    'design-tools': [
        { name: 'Figma', description: 'Collaborative design platform', logo: 'https://www.figma.com/favicon.ico', category: 'Design Tools', link: 'https://www.figma.com' },
        { name: 'Canva', description: 'AI-powered graphic design platform', logo: 'https://www.canva.com/favicon.ico', category: 'Design Tools', link: 'https://www.canva.com' },
        { name: 'Adobe Creative Suite', description: 'Professional creative tools with AI', logo: 'https://www.adobe.com/favicon.ico', category: 'Design Tools', link: 'https://www.adobe.com' },
        { name: 'Sketch', description: 'Digital design toolkit', logo: 'https://www.sketch.com/favicon.ico', category: 'Design Tools', link: 'https://www.sketch.com' },
        { name: 'Framer', description: 'Interactive design and prototyping', logo: 'https://www.framer.com/favicon.ico', category: 'Design Tools', link: 'https://www.framer.com' },
        { name: 'Looka', description: 'AI logo maker and brand identity', logo: 'https://looka.com/favicon.ico', category: 'Design Tools', link: 'https://looka.com' },
        { name: 'Brandmark', description: 'AI-powered logo design tool', logo: 'https://brandmark.io/favicon.ico', category: 'Design Tools', link: 'https://brandmark.io' },
        { name: 'Designs.ai', description: 'AI-powered design suite', logo: 'https://designs.ai/favicon.ico', category: 'Design Tools', link: 'https://designs.ai' },
        { name: 'Uizard', description: 'AI-powered design tool', logo: 'https://uizard.io/favicon.ico', category: 'Design Tools', link: 'https://uizard.io' },
        { name: 'Khroma', description: 'AI color tool for designers', logo: 'https://www.khroma.co/favicon.ico', category: 'Design Tools', link: 'https://www.khroma.co' }
    ],
    'data-analysis': [
        { name: 'Tableau', description: 'Data visualization and analytics platform', logo: 'https://www.tableau.com/favicon.ico', category: 'Data Analysis', link: 'https://www.tableau.com' },
        { name: 'Power BI', description: 'Microsoft\'s business analytics tool', logo: 'https://powerbi.microsoft.com/favicon.ico', category: 'Data Analysis', link: 'https://powerbi.microsoft.com' },
        { name: 'DataRobot', description: 'Automated machine learning platform', logo: 'https://www.datarobot.com/favicon.ico', category: 'Data Analysis', link: 'https://www.datarobot.com' },
        { name: 'H2O.ai', description: 'Open source machine learning platform', logo: 'https://www.h2o.ai/favicon.ico', category: 'Data Analysis', link: 'https://www.h2o.ai' },
        { name: 'MonkeyLearn', description: 'Text analysis with machine learning', logo: 'https://monkeylearn.com/favicon.ico', category: 'Data Analysis', link: 'https://monkeylearn.com' },
        { name: 'Alteryx', description: 'Self-service data analytics platform', logo: 'https://www.alteryx.com/favicon.ico', category: 'Data Analysis', link: 'https://www.alteryx.com' },
        { name: 'Qlik Sense', description: 'Data analytics and visualization', logo: 'https://www.qlik.com/favicon.ico', category: 'Data Analysis', link: 'https://www.qlik.com' },
        { name: 'Looker', description: 'Business intelligence platform', logo: 'https://looker.com/favicon.ico', category: 'Data Analysis', link: 'https://looker.com' },
        { name: 'Sisense', description: 'AI-driven analytics platform', logo: 'https://www.sisense.com/favicon.ico', category: 'Data Analysis', link: 'https://www.sisense.com' },
        { name: 'Palantir', description: 'Big data analytics platform', logo: 'https://www.palantir.com/favicon.ico', category: 'Data Analysis', link: 'https://www.palantir.com' }
    ],
    'automation-tools': [
        { name: 'Zapier', description: 'Automate workflows between apps', logo: 'https://zapier.com/favicon.ico', category: 'Automation', link: 'https://zapier.com' },
        { name: 'Make (Integromat)', description: 'Visual platform for automation', logo: 'https://www.make.com/favicon.ico', category: 'Automation', link: 'https://www.make.com' },
        { name: 'UiPath', description: 'Robotic Process Automation platform', logo: 'https://www.uipath.com/favicon.ico', category: 'Automation', link: 'https://www.uipath.com' },
        { name: 'Microsoft Power Automate', description: 'Cloud-based automation service', logo: 'https://powerautomate.microsoft.com/favicon.ico', category: 'Automation', link: 'https://powerautomate.microsoft.com' },
        { name: 'IFTTT', description: 'Connect apps and devices', logo: 'https://ifttt.com/favicon.ico', category: 'Automation', link: 'https://ifttt.com' },
        { name: 'Automation Anywhere', description: 'RPA platform for business automation', logo: 'https://www.automationanywhere.com/favicon.ico', category: 'Automation', link: 'https://www.automationanywhere.com' },
        { name: 'Blue Prism', description: 'Intelligent automation platform', logo: 'https://www.blueprism.com/favicon.ico', category: 'Automation', link: 'https://www.blueprism.com' },
        { name: 'Workato', description: 'Integration and automation platform', logo: 'https://www.workato.com/favicon.ico', category: 'Automation', link: 'https://www.workato.com' },
        { name: 'Nintex', description: 'Process automation and workflow', logo: 'https://www.nintex.com/favicon.ico', category: 'Automation', link: 'https://www.nintex.com' },
        { name: 'Pipefy', description: 'Business process automation', logo: 'https://www.pipefy.com/favicon.ico', category: 'Automation', link: 'https://www.pipefy.com' }
    ]
};

// Add more categories with 10 tools each
Object.assign(aiToolsData, {
    'ai-education': [
        { name: 'Duolingo', description: 'AI-powered language learning platform', logo: 'https://www.duolingo.com/favicon.ico', category: 'Education AI', link: 'https://www.duolingo.com/' },
        { name: 'Coursera', description: 'AI-enhanced online learning platform', logo: 'https://www.coursera.org/favicon.ico', category: 'Education AI', link: 'https://www.coursera.org/' },
        { name: 'Khan Academy', description: 'Personalized learning with AI', logo: 'https://www.khanacademy.org/favicon.ico', category: 'Education AI', link: 'https://www.khanacademy.org/' },
        { name: 'Quizlet', description: 'AI-powered study tools and flashcards', logo: 'https://quizlet.com/favicon.ico', category: 'Education AI', link: 'https://quizlet.com/' },
        { name: 'Century Tech', description: 'AI learning platform for schools', logo: 'https://www.century.tech/favicon.ico', category: 'Education AI', link: 'https://www.century.tech/' },
        { name: 'Squirrel AI', description: 'Adaptive learning platform with AI', logo: 'https://www.squirrelai.com/favicon.ico', category: 'Education AI', link: 'https://www.squirrelai.com/' },
        { name: 'Carnegie Learning', description: 'AI-powered math learning software', logo: 'https://www.carnegielearning.com/favicon.ico', category: 'Education AI', link: 'https://www.carnegielearning.com/' },
        { name: 'Cognii', description: 'Virtual learning assistant with AI', logo: 'https://www.cognii.com/favicon.ico', category: 'Education AI', link: 'https://www.cognii.com/' },
        { name: 'Querium', description: 'AI tutoring for STEM subjects', logo: 'https://querium.com/favicon.ico', category: 'Education AI', link: 'https://querium.com/' },
        { name: 'Thinkster Math', description: 'AI math tutoring platform', logo: 'https://hellothinkster.com/favicon.ico', category: 'Education AI', link: 'https://hellothinkster.com/' }
    ],
    'ai-cybersecurity': [
        { name: 'Darktrace', description: 'AI-powered cyber defense platform', logo: 'https://www.darktrace.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.darktrace.com/' },
        { name: 'CrowdStrike', description: 'AI endpoint protection platform', logo: 'https://www.crowdstrike.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.crowdstrike.com/' },
        { name: 'Cylance', description: 'AI antivirus and endpoint security', logo: 'https://www.cylance.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.cylance.com/' },
        { name: 'Vectra AI', description: 'AI-powered threat detection', logo: 'https://www.vectra.ai/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.vectra.ai/' },
        { name: 'Deep Instinct', description: 'Deep learning cybersecurity', logo: 'https://www.deepinstinct.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.deepinstinct.com/' },
        { name: 'SentinelOne', description: 'Autonomous endpoint protection', logo: 'https://www.sentinelone.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.sentinelone.com/' },
        { name: 'Cybereason', description: 'AI-powered endpoint protection', logo: 'https://www.cybereason.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.cybereason.com/' },
        { name: 'Securonix', description: 'AI security analytics platform', logo: 'https://www.securonix.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.securonix.com/' },
        { name: 'Exabeam', description: 'Security intelligence and analytics', logo: 'https://www.exabeam.com/favicon.ico', category: 'Cybersecurity AI', link: 'https://www.exabeam.com/' },
        { name: 'Blue Hexagon', description: 'Real-time deep learning security', logo: 'https://bluehexagon.ai/favicon.ico', category: 'Cybersecurity AI', link: 'https://bluehexagon.ai/' }
    ],
    'ai-robotics': [
        { name: 'Boston Dynamics', description: 'Advanced robotics with AI', logo: 'https://www.bostondynamics.com/favicon.ico', category: 'Robotics AI', link: 'https://www.bostondynamics.com/' },
        { name: 'Fetch Robotics', description: 'Autonomous mobile robots', logo: 'https://fetchrobotics.com/favicon.ico', category: 'Robotics AI', link: 'https://fetchrobotics.com/' },
        { name: 'Covariant', description: 'AI for robotic manipulation', logo: 'https://covariant.ai/favicon.ico', category: 'Robotics AI', link: 'https://covariant.ai/' },
        { name: 'Vicarious', description: 'AI for industrial robots', logo: 'https://www.vicarious.com/favicon.ico', category: 'Robotics AI', link: 'https://www.vicarious.com/' },
        { name: 'Robust.AI', description: 'Cognitive engine for robotics', logo: 'https://robust.ai/favicon.ico', category: 'Robotics AI', link: 'https://robust.ai/' },
        { name: 'Diligent Robotics', description: 'AI-powered service robots', logo: 'https://www.diligentrobots.com/favicon.ico', category: 'Robotics AI', link: 'https://www.diligentrobots.com/' },
        { name: 'Embodied', description: 'Social companion robots with AI', logo: 'https://embodied.com/favicon.ico', category: 'Robotics AI', link: 'https://embodied.com/' },
        { name: 'Skydio', description: 'Autonomous drones with AI', logo: 'https://www.skydio.com/favicon.ico', category: 'Robotics AI', link: 'https://www.skydio.com/' },
        { name: 'Waymo', description: 'Autonomous driving technology', logo: 'https://waymo.com/favicon.ico', category: 'Robotics AI', link: 'https://waymo.com/' },
        { name: 'Cruise', description: 'Self-driving vehicle technology', logo: 'https://www.getcruise.com/favicon.ico', category: 'Robotics AI', link: 'https://www.getcruise.com/' }
    ],
    'ai-art': [
        { name: 'Artbreeder', description: 'AI art creation and blending', logo: 'https://www.artbreeder.com/favicon.ico', category: 'AI Art Tools', link: 'https://www.artbreeder.com/' },
        { name: 'DeepArt', description: 'AI style transfer for images', logo: 'https://deepart.io/favicon.ico', category: 'AI Art Tools', link: 'https://deepart.io/' },
        { name: 'NightCafe Creator', description: 'AI art generator and community', logo: 'https://creator.nightcafe.studio/favicon.ico', category: 'AI Art Tools', link: 'https://creator.nightcafe.studio/' },
        { name: 'Deep Dream Generator', description: 'Neural network art creation', logo: 'https://deepdreamgenerator.com/favicon.ico', category: 'AI Art Tools', link: 'https://deepdreamgenerator.com/' },
        { name: 'Wombo Dream', description: 'AI-powered art creation app', logo: 'https://www.wombo.art/favicon.ico', category: 'AI Art Tools', link: 'https://www.wombo.art/' },
        { name: 'Prisma', description: 'AI photo effects and art filters', logo: 'https://prisma-ai.com/favicon.ico', category: 'AI Art Tools', link: 'https://prisma-ai.com/' },
        { name: 'Runway ML', description: 'Creative tools powered by AI', logo: 'https://runwayml.com/favicon.ico', category: 'AI Art Tools', link: 'https://runwayml.com/' },
        { name: 'Playform', description: 'AI art generation platform', logo: 'https://playform.io/favicon.ico', category: 'AI Art Tools', link: 'https://playform.io/' },
        { name: 'Fotor GoArt', description: 'AI art style transfer tool', logo: 'https://www.fotor.com/favicon.ico', category: 'AI Art Tools', link: 'https://www.fotor.com/features/goart.html' },
        { name: 'StarryAI', description: 'Text to image AI art generator', logo: 'https://starryai.com/favicon.ico', category: 'AI Art Tools', link: 'https://starryai.com/' }
    ],
    'ai-agriculture': [
        { name: 'Taranis', description: 'AI-powered crop intelligence', logo: 'https://www.taranis.com/favicon.ico', category: 'Agriculture AI', link: 'https://www.taranis.com/' },
        { name: 'Prospera', description: 'AI-powered agricultural intelligence', logo: 'https://www.prospera.ag/favicon.ico', category: 'Agriculture AI', link: 'https://www.prospera.ag/' },
        { name: 'aWhere', description: 'Agricultural intelligence platform', logo: 'https://www.awhere.com/favicon.ico', category: 'Agriculture AI', link: 'https://www.awhere.com/' },
        { name: 'FarmWise', description: 'AI-powered precision agriculture', logo: 'https://farmwise.io/favicon.ico', category: 'Agriculture AI', link: 'https://farmwise.io/' },
        { name: 'Blue River Technology', description: 'AI for precision agriculture', logo: 'https://bluerivertechnology.com/favicon.ico', category: 'Agriculture AI', link: 'https://bluerivertechnology.com/' },
        { name: 'Farmers Edge', description: 'AI-powered farm management', logo: 'https://www.farmersedge.ca/favicon.ico', category: 'Agriculture AI', link: 'https://www.farmersedge.ca/' },
        { name: 'Trace Genomics', description: 'AI soil analysis for agriculture', logo: 'https://www.tracegenomics.com/favicon.ico', category: 'Agriculture AI', link: 'https://www.tracegenomics.com/' },
        { name: 'Ceres Imaging', description: 'AI aerial imagery for agriculture', logo: 'https://www.ceresimaging.net/favicon.ico', category: 'Agriculture AI', link: 'https://www.ceresimaging.net/' },
        { name: 'Gamaya', description: 'Hyperspectral imaging for agriculture', logo: 'https://gamaya.com/favicon.ico', category: 'Agriculture AI', link: 'https://gamaya.com/' },
        { name: 'AgEagle', description: 'AI drone solutions for agriculture', logo: 'https://www.ageagle.com/favicon.ico', category: 'Agriculture AI', link: 'https://www.ageagle.com/' }
    ],
    'ai-manufacturing': [
        { name: 'Siemens MindSphere', description: 'Industrial IoT with AI capabilities', logo: 'https://siemens.mindsphere.io/favicon.ico', category: 'Manufacturing AI', link: 'https://siemens.mindsphere.io/' },
        { name: 'Uptake', description: 'Industrial AI and analytics platform', logo: 'https://www.uptake.com/favicon.ico', category: 'Manufacturing AI', link: 'https://www.uptake.com/' },
        { name: 'Sight Machine', description: 'Manufacturing analytics platform', logo: 'https://sightmachine.com/favicon.ico', category: 'Manufacturing AI', link: 'https://sightmachine.com/' },
        { name: 'Augury', description: 'Machine health monitoring with AI', logo: 'https://www.augury.com/favicon.ico', category: 'Manufacturing AI', link: 'https://www.augury.com/' },
        { name: 'Falkonry', description: 'AI for predictive operations', logo: 'https://falkonry.com/favicon.ico', category: 'Manufacturing AI', link: 'https://falkonry.com/' },
        { name: 'Veo Robotics', description: 'AI for industrial robot safety', logo: 'https://www.veobot.com/favicon.ico', category: 'Manufacturing AI', link: 'https://www.veobot.com/' },
        { name: 'Bright Machines', description: 'Intelligent automation for manufacturing', logo: 'https://www.brightmachines.com/favicon.ico', category: 'Manufacturing AI', link: 'https://www.brightmachines.com/' },
        { name: 'Instrumental', description: 'AI-powered manufacturing optimization', logo: 'https://www.instrumental.com/favicon.ico', category: 'Manufacturing AI', link: 'https://www.instrumental.com/' },
        { name: 'Landing AI', description: 'AI visual inspection for manufacturing', logo: 'https://landing.ai/favicon.ico', category: 'Manufacturing AI', link: 'https://landing.ai/' },
        { name: 'Neurala', description: 'AI vision for industrial applications', logo: 'https://www.neurala.com/favicon.ico', category: 'Manufacturing AI', link: 'https://www.neurala.com/' }
    ],
    'ai-energy': [
        { name: 'Grid4C', description: 'AI for smart grid management', logo: 'https://grid4c.com/favicon.ico', category: 'Energy AI', link: 'https://grid4c.com/' },
        { name: 'AutoGrid', description: 'AI-powered energy management', logo: 'https://www.auto-grid.com/favicon.ico', category: 'Energy AI', link: 'https://www.auto-grid.com/' },
        { name: 'C3.ai', description: 'Enterprise AI for energy industry', logo: 'https://c3.ai/favicon.ico', category: 'Energy AI', link: 'https://c3.ai/' },
        { name: 'Bidgely', description: 'AI energy analytics platform', logo: 'https://www.bidgely.com/favicon.ico', category: 'Energy AI', link: 'https://www.bidgely.com/' },
        { name: 'Verdigris', description: 'AI energy management system', logo: 'https://verdigris.co/favicon.ico', category: 'Energy AI', link: 'https://verdigris.co/' },
        { name: 'Stem', description: 'AI-driven energy storage', logo: 'https://www.stem.com/favicon.ico', category: 'Energy AI', link: 'https://www.stem.com/' },
        { name: 'SparkCognition', description: 'AI solutions for energy sector', logo: 'https://www.sparkcognition.com/favicon.ico', category: 'Energy AI', link: 'https://www.sparkcognition.com/' },
        { name: 'KrakenGrid', description: 'AI for grid optimization', logo: 'https://www.krakengrid.com/favicon.ico', category: 'Energy AI', link: 'https://www.krakengrid.com/' },
        { name: 'Urbint', description: 'AI for infrastructure safety', logo: 'https://urbint.com/favicon.ico', category: 'Energy AI', link: 'https://urbint.com/' },
        { name: 'Innowatts', description: 'AI energy analytics platform', logo: 'https://www.innowatts.com/favicon.ico', category: 'Energy AI', link: 'https://www.innowatts.com/' }
    ],
    'ai-retail': [
        { name: 'Trax', description: 'Computer vision for retail execution', logo: 'https://traxretail.com/favicon.ico', category: 'Retail AI', link: 'https://traxretail.com/' },
        { name: 'Standard Cognition', description: 'Autonomous checkout technology', logo: 'https://standard.ai/favicon.ico', category: 'Retail AI', link: 'https://standard.ai/' },
        { name: 'Focal Systems', description: 'AI-powered store automation', logo: 'https://focal.systems/favicon.ico', category: 'Retail AI', link: 'https://focal.systems/' },
        { name: 'Shelf Engine', description: 'AI-powered inventory management', logo: 'https://www.shelfengine.com/favicon.ico', category: 'Retail AI', link: 'https://www.shelfengine.com/' },
        { name: 'Algonomy', description: 'AI-powered retail personalization', logo: 'https://www.algonomy.com/favicon.ico', category: 'Retail AI', link: 'https://www.algonomy.com/' },
        { name: 'Lily AI', description: 'Product attribution platform', logo: 'https://www.lily.ai/favicon.ico', category: 'Retail AI', link: 'https://www.lily.ai/' },
        { name: 'Vue.ai', description: 'Retail automation platform', logo: 'https://vue.ai/favicon.ico', category: 'Retail AI', link: 'https://vue.ai/' },
        { name: 'Syte', description: 'Visual AI for retail', logo: 'https://www.syte.ai/favicon.ico', category: 'Retail AI', link: 'https://www.syte.ai/' },
        { name: 'Shopify Flow', description: 'E-commerce automation platform', logo: 'https://www.shopify.com/favicon.ico', category: 'Retail AI', link: 'https://www.shopify.com/flow' },
        { name: 'Clarifai', description: 'AI visual recognition for retail', logo: 'https://www.clarifai.com/favicon.ico', category: 'Retail AI', link: 'https://www.clarifai.com/' }
    ],
    'ai-finance': [
        { name: 'Alpaca', description: 'AI-powered stock trading platform', logo: 'https://alpaca.markets/favicon.ico', category: 'Finance AI', link: 'https://alpaca.markets/' },
        { name: 'Kensho', description: 'AI analytics for financial markets', logo: 'https://www.kensho.com/favicon.ico', category: 'Finance AI', link: 'https://www.kensho.com/' },
        { name: 'Kavout', description: 'AI-powered investment platform', logo: 'https://www.kavout.com/favicon.ico', category: 'Finance AI', link: 'https://www.kavout.com/' },
        { name: 'Numerai', description: 'AI-powered hedge fund', logo: 'https://numer.ai/favicon.ico', category: 'Finance AI', link: 'https://numer.ai/' },
        { name: 'DataRobot', description: 'AI platform for financial forecasting', logo: 'https://www.datarobot.com/favicon.ico', category: 'Finance AI', link: 'https://www.datarobot.com/' },
        { name: 'Ayasdi', description: 'AI for financial risk management', logo: 'https://www.ayasdi.com/favicon.ico', category: 'Finance AI', link: 'https://www.ayasdi.com/' },
        { name: 'Feedzai', description: 'AI fraud detection for banking', logo: 'https://feedzai.com/favicon.ico', category: 'Finance AI', link: 'https://feedzai.com/' },
        { name: 'Onfido', description: 'AI identity verification for finance', logo: 'https://onfido.com/favicon.ico', category: 'Finance AI', link: 'https://onfido.com/' },
        { name: 'Personetics', description: 'AI-powered banking personalization', logo: 'https://personetics.com/favicon.ico', category: 'Finance AI', link: 'https://personetics.com/' },
        { name: 'Kasisto', description: 'Conversational AI for finance', logo: 'https://kasisto.com/favicon.ico', category: 'Finance AI', link: 'https://kasisto.com/' }
    ],
    'ai-real-estate': [
        { name: 'HouseCanary', description: 'AI property valuation platform', logo: 'https://www.housecanary.com/favicon.ico', category: 'Real Estate AI', link: 'https://www.housecanary.com/' },
        { name: 'Skyline AI', description: 'AI for real estate investment', logo: 'https://skyline.ai/favicon.ico', category: 'Real Estate AI', link: 'https://skyline.ai/' },
        { name: 'Cherre', description: 'Real estate data integration platform', logo: 'https://cherre.com/favicon.ico', category: 'Real Estate AI', link: 'https://cherre.com/' },
        { name: 'Localize', description: 'AI location intelligence for real estate', logo: 'https://localize.city/favicon.ico', category: 'Real Estate AI', link: 'https://localize.city/' },
        { name: 'Enodo', description: 'AI multifamily property analysis', logo: 'https://enodoinc.com/favicon.ico', category: 'Real Estate AI', link: 'https://enodoinc.com/' },
        { name: 'Restb.ai', description: 'Computer vision for real estate', logo: 'https://restb.ai/favicon.ico', category: 'Real Estate AI', link: 'https://restb.ai/' },
        { name: 'Zillow Offers', description: 'AI-powered home buying platform', logo: 'https://www.zillow.com/favicon.ico', category: 'Real Estate AI', link: 'https://www.zillow.com/offers/' },
        { name: 'Opendoor', description: 'AI home valuation and buying', logo: 'https://www.opendoor.com/favicon.ico', category: 'Real Estate AI', link: 'https://www.opendoor.com/' },
        { name: 'Compass', description: 'AI-powered real estate platform', logo: 'https://www.compass.com/favicon.ico', category: 'Real Estate AI', link: 'https://www.compass.com/' },
        { name: 'Redfin', description: 'AI real estate brokerage', logo: 'https://www.redfin.com/favicon.ico', category: 'Real Estate AI', link: 'https://www.redfin.com/' }
    ],
    'ai-travel': [
        { name: 'Hopper', description: 'AI-powered travel booking app', logo: 'https://www.hopper.com/favicon.ico', category: 'Travel AI', link: 'https://www.hopper.com/' },
        { name: 'Skyscanner', description: 'AI flight search and prediction', logo: 'https://www.skyscanner.com/favicon.ico', category: 'Travel AI', link: 'https://www.skyscanner.com/' },
        { name: 'Kayak', description: 'AI travel search and planning', logo: 'https://www.kayak.com/favicon.ico', category: 'Travel AI', link: 'https://www.kayak.com/' },
        { name: 'Mezi', description: 'AI travel assistant', logo: 'https://mezi.com/favicon.ico', category: 'Travel AI', link: 'https://mezi.com/' },
        { name: 'Journera', description: 'AI travel data platform', logo: 'https://journera.com/favicon.ico', category: 'Travel AI', link: 'https://journera.com/' },
        { name: 'Volantio', description: 'AI revenue optimization for airlines', logo: 'https://www.volantio.com/favicon.ico', category: 'Travel AI', link: 'https://www.volantio.com/' },
        { name: 'Freebird', description: 'AI flight rebooking platform', logo: 'https://www.getfreebird.com/favicon.ico', category: 'Travel AI', link: 'https://www.getfreebird.com/' },
        { name: 'Maidbot', description: 'AI robotics for hotels', logo: 'https://www.maidbot.com/favicon.ico', category: 'Travel AI', link: 'https://www.maidbot.com/' },
        { name: 'Connie', description: 'Hiltons AI concierge', logo: 'https://www.hilton.com/favicon.ico', category: 'Travel AI', link: 'https://www.hilton.com/' },
        { name: 'Waylo', description: 'AI hotel price prediction', logo: 'https://waylo.com/favicon.ico', category: 'Travel AI', link: 'https://waylo.com/' }
    ],
    'ai-weather': [
        { name: 'ClimaCell', description: 'AI-powered weather forecasting', logo: 'https://www.climacell.co/favicon.ico', category: 'Weather AI', link: 'https://www.climacell.co/' },
        { name: 'IBM Weather', description: 'AI weather intelligence platform', logo: 'https://www.ibm.com/weather/favicon.ico', category: 'Weather AI', link: 'https://www.ibm.com/weather' },
        { name: 'Atmo', description: 'AI atmospheric modeling', logo: 'https://atmo.ai/favicon.ico', category: 'Weather AI', link: 'https://atmo.ai/' },
        { name: 'Understory', description: 'AI weather monitoring network', logo: 'https://understory.com/favicon.ico', category: 'Weather AI', link: 'https://understory.com/' },
        { name: 'Jupiter Intelligence', description: 'Climate risk analytics', logo: 'https://jupiterintel.com/favicon.ico', category: 'Weather AI', link: 'https://jupiterintel.com/' },
        { name: 'Salient Predictions', description: 'AI long-range weather forecasting', logo: 'https://salientpredictions.com/favicon.ico', category: 'Weather AI', link: 'https://salientpredictions.com/' },
        { name: 'Gro Intelligence', description: 'AI climate and agricultural data', logo: 'https://gro-intelligence.com/favicon.ico', category: 'Weather AI', link: 'https://gro-intelligence.com/' },
        { name: 'WeatherBug', description: 'AI-enhanced weather forecasting', logo: 'https://www.weatherbug.com/favicon.ico', category: 'Weather AI', link: 'https://www.weatherbug.com/' },
        { name: 'Windy', description: 'Interactive weather forecasting', logo: 'https://www.windy.com/favicon.ico', category: 'Weather AI', link: 'https://www.windy.com/' },
        { name: 'Tempest', description: 'AI weather station network', logo: 'https://weatherflow.com/favicon.ico', category: 'Weather AI', link: 'https://weatherflow.com/tempest-weather-system/' }
    ],
    'ai-sports': [
        { name: 'Sportlogiq', description: 'AI sports analytics platform', logo: 'https://www.sportlogiq.com/favicon.ico', category: 'Sports AI', link: 'https://www.sportlogiq.com/' },
        { name: 'Second Spectrum', description: 'AI-powered sports tracking', logo: 'https://www.secondspectrum.com/favicon.ico', category: 'Sports AI', link: 'https://www.secondspectrum.com/' },
        { name: 'Hawk-Eye', description: 'Computer vision for sports officiating', logo: 'https://www.hawkeyeinnovations.com/favicon.ico', category: 'Sports AI', link: 'https://www.hawkeyeinnovations.com/' },
        { name: 'Stats Perform', description: 'Sports data and AI analytics', logo: 'https://www.statsperform.com/favicon.ico', category: 'Sports AI', link: 'https://www.statsperform.com/' },
        { name: 'Kinexon', description: 'Athlete performance tracking', logo: 'https://kinexon.com/favicon.ico', category: 'Sports AI', link: 'https://kinexon.com/' },
        { name: 'Kitman Labs', description: 'Sports performance analytics', logo: 'https://www.kitmanlabs.com/favicon.ico', category: 'Sports AI', link: 'https://www.kitmanlabs.com/' },
        { name: 'Hudl', description: 'Video analysis for sports teams', logo: 'https://www.hudl.com/favicon.ico', category: 'Sports AI', link: 'https://www.hudl.com/' },
        { name: 'Catapult', description: 'Wearable analytics for athletes', logo: 'https://www.catapultsports.com/favicon.ico', category: 'Sports AI', link: 'https://www.catapultsports.com/' },
        { name: 'Genius Sports', description: 'Sports data and technology', logo: 'https://www.geniussports.com/favicon.ico', category: 'Sports AI', link: 'https://www.geniussports.com/' },
        { name: 'PlayerMaker', description: 'Football performance analytics', logo: 'https://playermaker.com/favicon.ico', category: 'Sports AI', link: 'https://playermaker.com/' }
    ],
    'ai-music-analysis': [
        { name: 'Spotify', description: 'AI-powered music recommendations', logo: 'https://www.spotify.com/favicon.ico', category: 'Music Analysis AI', link: 'https://www.spotify.com/' },
        { name: 'Pandora', description: 'Music Genome Project', logo: 'https://www.pandora.com/favicon.ico', category: 'Music Analysis AI', link: 'https://www.pandora.com/' },
        { name: 'Shazam', description: 'AI music recognition', logo: 'https://www.shazam.com/favicon.ico', category: 'Music Analysis AI', link: 'https://www.shazam.com/' },
        { name: 'Musiio', description: 'AI music tagging and curation', logo: 'https://www.musiio.com/favicon.ico', category: 'Music Analysis AI', link: 'https://www.musiio.com/' },
        { name: 'Melodrive', description: 'Adaptive music AI', logo: 'https://melodrive.com/favicon.ico', category: 'Music Analysis AI', link: 'https://melodrive.com/' },
        { name: 'Landr', description: 'AI music mastering', logo: 'https://www.landr.com/favicon.ico', category: 'Music Analysis AI', link: 'https://www.landr.com/' },
        { name: 'Moises', description: 'AI music separation', logo: 'https://moises.ai/favicon.ico', category: 'Music Analysis AI', link: 'https://moises.ai/' },
        { name: 'Muzeek', description: 'AI music analysis for sync licensing', logo: 'https://muzeek.com/favicon.ico', category: 'Music Analysis AI', link: 'https://muzeek.com/' },
        { name: 'Cyanite', description: 'AI music tagging and search', logo: 'https://cyanite.ai/favicon.ico', category: 'Music Analysis AI', link: 'https://cyanite.ai/' },
        { name: 'Sononym', description: 'AI sample browser', logo: 'https://www.sononym.net/favicon.ico', category: 'Music Analysis AI', link: 'https://www.sononym.net/' }
    ],
    'ai-fashion': [
        { name: 'Vue.ai', description: 'AI for fashion retail', logo: 'https://vue.ai/favicon.ico', category: 'Fashion AI', link: 'https://vue.ai/' },
        { name: 'Stitch Fix', description: 'AI-powered personal styling', logo: 'https://www.stitchfix.com/favicon.ico', category: 'Fashion AI', link: 'https://www.stitchfix.com/' },
        { name: 'Stylumia', description: 'Fashion trend forecasting with AI', logo: 'https://stylumia.ai/favicon.ico', category: 'Fashion AI', link: 'https://stylumia.ai/' },
        { name: 'Heuritech', description: 'AI fashion trend forecasting', logo: 'https://www.heuritech.com/favicon.ico', category: 'Fashion AI', link: 'https://www.heuritech.com/' },
        { name: 'Virtusize', description: 'AI clothing size recommendation', logo: 'https://www.virtusize.com/favicon.ico', category: 'Fashion AI', link: 'https://www.virtusize.com/' },
        { name: 'Syte', description: 'Visual AI for fashion', logo: 'https://www.syte.ai/favicon.ico', category: 'Fashion AI', link: 'https://www.syte.ai/' },
        { name: 'Intelistyle', description: 'AI fashion styling platform', logo: 'https://intelistyle.com/favicon.ico', category: 'Fashion AI', link: 'https://intelistyle.com/' },
        { name: 'Finery', description: 'AI wardrobe operating system', logo: 'https://finery.com/favicon.ico', category: 'Fashion AI', link: 'https://finery.com/' },
        { name: 'Mode.ai', description: 'Fashion visual search and chatbots', logo: 'https://mode.ai/favicon.ico', category: 'Fashion AI', link: 'https://mode.ai/' },
        { name: 'Dress-X', description: 'Digital fashion platform', logo: 'https://dress-x.com/favicon.ico', category: 'Fashion AI', link: 'https://dress-x.com/' }
    ],
    'ai-gaming-design': [
        { name: 'Unity ML-Agents', description: 'Machine learning for game development', logo: 'https://unity.com/favicon.ico', category: 'Game Design AI', link: 'https://unity.com/products/machine-learning-agents' },
        { name: 'NVIDIA GameGAN', description: 'AI game generation technology', logo: 'https://www.nvidia.com/favicon.ico', category: 'Game Design AI', link: 'https://www.nvidia.com/en-us/research/ai-playground/' },
        { name: 'Promethean AI', description: 'AI for game environment design', logo: 'https://www.prometheanai.com/favicon.ico', category: 'Game Design AI', link: 'https://www.prometheanai.com/' },
        { name: 'modl.ai', description: 'AI tools for game development', logo: 'https://modl.ai/favicon.ico', category: 'Game Design AI', link: 'https://modl.ai/' },
        { name: 'Spirit AI', description: 'AI for game character behavior', logo: 'https://spiritai.com/favicon.ico', category: 'Game Design AI', link: 'https://spiritai.com/' },
        { name: 'Latent Space', description: 'AI-assisted game development', logo: 'https://latent.space/favicon.ico', category: 'Game Design AI', link: 'https://latent.space/' },
        { name: 'Anything World', description: '3D content generation for games', logo: 'https://anything.world/favicon.ico', category: 'Game Design AI', link: 'https://anything.world/' },
        { name: 'Replica Studios', description: 'AI voice actors for games', logo: 'https://replicastudios.com/favicon.ico', category: 'Game Design AI', link: 'https://replicastudios.com/' },
        { name: 'Inworld AI', description: 'AI characters for games', logo: 'https://inworld.ai/favicon.ico', category: 'Game Design AI', link: 'https://inworld.ai/' },
        { name: 'Scenario', description: 'AI-generated game assets', logo: 'https://www.scenario.com/favicon.ico', category: 'Game Design AI', link: 'https://www.scenario.com/' }
    ],
    'ai-ocean': [
        { name: 'Sofar Ocean', description: 'Ocean data platform with AI', logo: 'https://www.sofarocean.com/favicon.ico', category: 'Ocean AI', link: 'https://www.sofarocean.com/' },
        { name: 'Saildrone', description: 'Autonomous ocean data collection', logo: 'https://www.saildrone.com/favicon.ico', category: 'Ocean AI', link: 'https://www.saildrone.com/' },
        { name: 'Terradepth', description: 'Autonomous ocean data platform', logo: 'https://www.terradepth.com/favicon.ico', category: 'Ocean AI', link: 'https://www.terradepth.com/' },
        { name: 'MBARI', description: 'AI for oceanographic research', logo: 'https://www.mbari.org/favicon.ico', category: 'Ocean AI', link: 'https://www.mbari.org/' },
        { name: 'OceanMind', description: 'AI for marine protection', logo: 'https://www.oceanmind.global/favicon.ico', category: 'Ocean AI', link: 'https://www.oceanmind.global/' },
        { name: 'Planys Technologies', description: 'Underwater robotics with AI', logo: 'https://www.planystech.com/favicon.ico', category: 'Ocean AI', link: 'https://www.planystech.com/' },
        { name: 'SINAY', description: 'Maritime data analytics platform', logo: 'https://sinay.ai/favicon.ico', category: 'Ocean AI', link: 'https://sinay.ai/' },
        { name: 'FathomNet', description: 'Ocean image database for AI', logo: 'https://www.fathomnet.org/favicon.ico', category: 'Ocean AI', link: 'https://www.fathomnet.org/' },
        { name: 'Whale Seeker', description: 'AI whale detection from imagery', logo: 'https://www.whaleseeker.com/favicon.ico', category: 'Ocean AI', link: 'https://www.whaleseeker.com/' },
        { name: 'NVIDIA AI for Ocean Science', description: 'AI solutions for oceanography', logo: 'https://www.nvidia.com/favicon.ico', category: 'Ocean AI', link: 'https://www.nvidia.com/en-us/industries/science/' }
    ],
    'ai-construction': [
        { name: 'Buildots', description: 'AI construction site monitoring', logo: 'https://buildots.com/favicon.ico', category: 'Construction AI', link: 'https://buildots.com/' },
        { name: 'Doxel', description: 'AI-powered construction monitoring', logo: 'https://www.doxel.ai/favicon.ico', category: 'Construction AI', link: 'https://www.doxel.ai/' },
        { name: 'Disperse', description: 'AI construction progress tracking', logo: 'https://www.disperse.io/favicon.ico', category: 'Construction AI', link: 'https://www.disperse.io/' },
        { name: 'Avvir', description: 'Construction verification platform', logo: 'https://www.avvir.io/favicon.ico', category: 'Construction AI', link: 'https://www.avvir.io/' },
        { name: 'Smartvid.io', description: 'AI safety monitoring for construction', logo: 'https://www.smartvid.io/favicon.ico', category: 'Construction AI', link: 'https://www.smartvid.io/' },
        { name: 'OpenSpace', description: 'AI construction site documentation', logo: 'https://www.openspace.ai/favicon.ico', category: 'Construction AI', link: 'https://www.openspace.ai/' },
        { name: 'Indus.ai', description: 'Construction intelligence platform', logo: 'https://indus.ai/favicon.ico', category: 'Construction AI', link: 'https://indus.ai/' },
        { name: 'Alice Technologies', description: 'AI construction scheduling', logo: 'https://www.alicetechnologies.com/favicon.ico', category: 'Construction AI', link: 'https://www.alicetechnologies.com/' },
        { name: 'Versatile', description: 'AI-powered construction insights', logo: 'https://www.versatile.ai/favicon.ico', category: 'Construction AI', link: 'https://www.versatile.ai/' },
        { name: 'Togal.AI', description: 'AI for construction estimating', logo: 'https://togal.ai/favicon.ico', category: 'Construction AI', link: 'https://togal.ai/' }
    ],
    'ai-legal': [
        { name: 'ROSS Intelligence', description: 'AI legal research platform', logo: 'https://rossintelligence.com/favicon.ico', category: 'Legal AI', link: 'https://rossintelligence.com/' },
        { name: 'Casetext', description: 'AI-powered legal research assistant', logo: 'https://casetext.com/favicon.ico', category: 'Legal AI', link: 'https://casetext.com/' },
        { name: 'Kira Systems', description: 'AI contract analysis software', logo: 'https://kirasystems.com/favicon.ico', category: 'Legal AI', link: 'https://kirasystems.com/' },
        { name: 'Luminance', description: 'AI document analysis for legal teams', logo: 'https://www.luminance.com/favicon.ico', category: 'Legal AI', link: 'https://www.luminance.com/' },
        { name: 'LawGeex', description: 'AI contract review automation', logo: 'https://www.lawgeex.com/favicon.ico', category: 'Legal AI', link: 'https://www.lawgeex.com/' },
        { name: 'Everlaw', description: 'AI-powered litigation platform', logo: 'https://www.everlaw.com/favicon.ico', category: 'Legal AI', link: 'https://www.everlaw.com/' },
        { name: 'Disco', description: 'AI-powered legal discovery', logo: 'https://www.csdisco.com/favicon.ico', category: 'Legal AI', link: 'https://www.csdisco.com/' },
        { name: 'Relativity', description: 'E-discovery and compliance platform', logo: 'https://www.relativity.com/favicon.ico', category: 'Legal AI', link: 'https://www.relativity.com/' },
        { name: 'Lexion', description: 'AI contract management', logo: 'https://lexion.ai/favicon.ico', category: 'Legal AI', link: 'https://lexion.ai/' },
        { name: 'Evisort', description: 'AI-powered contract intelligence', logo: 'https://www.evisort.com/favicon.ico', category: 'Legal AI', link: 'https://www.evisort.com/' }
    ],
    'ai-astronomy': [
        { name: 'Frontier Development Lab', description: 'AI for space science', logo: 'https://frontierdevelopmentlab.org/favicon.ico', category: 'Astronomy AI', link: 'https://frontierdevelopmentlab.org/' },
        { name: 'SpaceML', description: 'AI for Earth observation and space', logo: 'https://www.spaceml.org/favicon.ico', category: 'Astronomy AI', link: 'https://www.spaceml.org/' },
        { name: 'Astromatic', description: 'AI software for astronomical images', logo: 'https://www.astromatic.net/favicon.ico', category: 'Astronomy AI', link: 'https://www.astromatic.net/' },
        { name: 'Slooh', description: 'AI-enhanced telescope network', logo: 'https://www.slooh.com/favicon.ico', category: 'Astronomy AI', link: 'https://www.slooh.com/' },
        { name: 'Unistellar', description: 'Smart telescopes with AI', logo: 'https://unistellaroptics.com/favicon.ico', category: 'Astronomy AI', link: 'https://unistellaroptics.com/' },
        { name: 'AstroAI', description: 'AI for astronomical discovery', logo: 'https://www.astroai.org/favicon.ico', category: 'Astronomy AI', link: 'https://www.astroai.org/' },
        { name: 'Astraea', description: 'Earth observation AI platform', logo: 'https://astraea.earth/favicon.ico', category: 'Astronomy AI', link: 'https://astraea.earth/' },
        { name: 'Exoplanet AI', description: 'AI for exoplanet detection', logo: 'https://www.exoplanet.ai/favicon.ico', category: 'Astronomy AI', link: 'https://www.exoplanet.ai/' },
        { name: 'Cosmotech', description: 'AI for space situational awareness', logo: 'https://cosmotech.com/favicon.ico', category: 'Astronomy AI', link: 'https://cosmotech.com/' },
        { name: 'Morpheus Space', description: 'AI spacecraft autonomy', logo: 'https://morpheus-space.com/favicon.ico', category: 'Astronomy AI', link: 'https://morpheus-space.com/' }
    ],
    'ai-archaeology': [
        { name: 'ArchAI', description: 'AI for archaeological site detection', logo: 'https://www.archai.io/favicon.ico', category: 'Archaeology AI', link: 'https://www.archai.io/' },
        { name: 'Arches Project', description: 'AI heritage inventory platform', logo: 'https://www.archesproject.org/favicon.ico', category: 'Archaeology AI', link: 'https://www.archesproject.org/' },
        { name: 'Archaeobotics', description: 'AI robotics for archaeology', logo: 'https://archaeobotics.com/favicon.ico', category: 'Archaeology AI', link: 'https://archaeobotics.com/' },
        { name: 'Archeo', description: 'AI artifact recognition system', logo: 'https://archeo.ai/favicon.ico', category: 'Archaeology AI', link: 'https://archeo.ai/' },
        { name: 'Antiquity AI', description: 'AI for ancient text translation', logo: 'https://antiquity.ai/favicon.ico', category: 'Archaeology AI', link: 'https://antiquity.ai/' },
        { name: 'DeepDig', description: 'AI for archaeological excavation', logo: 'https://deepdig.org/favicon.ico', category: 'Archaeology AI', link: 'https://deepdig.org/' },
        { name: 'Heritage AI', description: 'AI for cultural heritage preservation', logo: 'https://heritage.ai/favicon.ico', category: 'Archaeology AI', link: 'https://heritage.ai/' },
        { name: 'Strabo', description: 'AI for archaeological mapping', logo: 'https://strabospot.org/favicon.ico', category: 'Archaeology AI', link: 'https://strabospot.org/' },
        { name: 'Artifact Analytics', description: 'AI artifact classification', logo: 'https://artifactanalytics.com/favicon.ico', category: 'Archaeology AI', link: 'https://artifactanalytics.com/' },
        { name: 'DigitalAnthro', description: 'AI for anthropological research', logo: 'https://digitalanthro.ai/favicon.ico', category: 'Archaeology AI', link: 'https://digitalanthro.ai/' }
    ],
    'ai-wildlife': [
        { name: 'Wildbook', description: 'AI wildlife monitoring platform', logo: 'https://www.wildbook.org/favicon.ico', category: 'Wildlife AI', link: 'https://www.wildbook.org/' },
        { name: 'Conservation Metrics', description: 'AI wildlife monitoring solutions', logo: 'https://conservationmetrics.com/favicon.ico', category: 'Wildlife AI', link: 'https://conservationmetrics.com/' },
        { name: 'Wildlife Insights', description: 'AI camera trap analysis', logo: 'https://www.wildlifeinsights.org/favicon.ico', category: 'Wildlife AI', link: 'https://www.wildlifeinsights.org/' },
        { name: 'Rainforest Connection', description: 'AI acoustic monitoring for conservation', logo: 'https://rfcx.org/favicon.ico', category: 'Wildlife AI', link: 'https://rfcx.org/' },
        { name: 'TrailGuard AI', description: 'AI camera system for anti-poaching', logo: 'https://www.resolve.ngo/favicon.ico', category: 'Wildlife AI', link: 'https://www.resolve.ngo/trailguard.htm' },
        { name: 'Wild Me', description: 'AI for wildlife conservation', logo: 'https://www.wildme.org/favicon.ico', category: 'Wildlife AI', link: 'https://www.wildme.org/' },
        { name: 'Zamba Cloud', description: 'AI wildlife identification platform', logo: 'https://zamba.drivendata.org/favicon.ico', category: 'Wildlife AI', link: 'https://zamba.drivendata.org/' },
        { name: 'Conservify', description: 'AI tools for field biologists', logo: 'https://conservify.org/favicon.ico', category: 'Wildlife AI', link: 'https://conservify.org/' },
        { name: 'Wildtrack', description: 'AI footprint identification technology', logo: 'https://wildtrack.org/favicon.ico', category: 'Wildlife AI', link: 'https://wildtrack.org/' },
        { name: 'Whale Safe', description: 'AI whale detection system', logo: 'https://whalesafe.com/favicon.ico', category: 'Wildlife AI', link: 'https://whalesafe.com/' }
    ],
    'ai-transportation': [
        { name: 'Waymo', description: 'Autonomous driving technology', logo: 'https://waymo.com/favicon.ico', category: 'Transportation AI', link: 'https://waymo.com/' },
        { name: 'Cruise', description: 'Self-driving vehicle technology', logo: 'https://www.getcruise.com/favicon.ico', category: 'Transportation AI', link: 'https://www.getcruise.com/' },
        { name: 'Optibus', description: 'AI public transportation optimization', logo: 'https://www.optibus.com/favicon.ico', category: 'Transportation AI', link: 'https://www.optibus.com/' },
        { name: 'Nexar', description: 'AI dash cam network', logo: 'https://www.getnexar.com/favicon.ico', category: 'Transportation AI', link: 'https://www.getnexar.com/' },
        { name: 'Nauto', description: 'AI fleet safety platform', logo: 'https://www.nauto.com/favicon.ico', category: 'Transportation AI', link: 'https://www.nauto.com/' },
        { name: 'Bestmile', description: 'Fleet orchestration platform', logo: 'https://bestmile.com/favicon.ico', category: 'Transportation AI', link: 'https://bestmile.com/' },
        { name: 'Swiftly', description: 'Public transit optimization platform', logo: 'https://www.goswift.ly/favicon.ico', category: 'Transportation AI', link: 'https://www.goswift.ly/' },
        { name: 'Remix', description: 'Transit planning platform', logo: 'https://www.remix.com/favicon.ico', category: 'Transportation AI', link: 'https://www.remix.com/' },
        { name: 'Waze', description: 'AI-powered navigation app', logo: 'https://www.waze.com/favicon.ico', category: 'Transportation AI', link: 'https://www.waze.com/' },
        { name: 'Mobileye', description: 'Computer vision for autonomous driving', logo: 'https://www.mobileye.com/favicon.ico', category: 'Transportation AI', link: 'https://www.mobileye.com/' }
    ],
    'ai-insurance': [
        { name: 'Lemonade', description: 'AI-powered insurance company', logo: 'https://www.lemonade.com/favicon.ico', category: 'Insurance AI', link: 'https://www.lemonade.com/' },
        { name: 'Tractable', description: 'AI for accident and disaster recovery', logo: 'https://tractable.ai/favicon.ico', category: 'Insurance AI', link: 'https://tractable.ai/' },
        { name: 'Shift Technology', description: 'AI fraud detection for insurance', logo: 'https://www.shift-technology.com/favicon.ico', category: 'Insurance AI', link: 'https://www.shift-technology.com/' },
        { name: 'Cape Analytics', description: 'AI property intelligence', logo: 'https://capeanalytics.com/favicon.ico', category: 'Insurance AI', link: 'https://capeanalytics.com/' },
        { name: 'Zesty.ai', description: 'AI property risk analytics', logo: 'https://zesty.ai/favicon.ico', category: 'Insurance AI', link: 'https://zesty.ai/' },
        { name: 'Flyreel', description: 'AI property insurance assistant', logo: 'https://flyreel.co/favicon.ico', category: 'Insurance AI', link: 'https://flyreel.co/' },
        { name: 'Planck', description: 'AI commercial insurance data platform', logo: 'https://planckdata.com/favicon.ico', category: 'Insurance AI', link: 'https://planckdata.com/' },
        { name: 'Root Insurance', description: 'AI-based auto insurance', logo: 'https://www.joinroot.com/favicon.ico', category: 'Insurance AI', link: 'https://www.joinroot.com/' },
        { name: 'Clearcover', description: 'AI-driven car insurance', logo: 'https://clearcover.com/favicon.ico', category: 'Insurance AI', link: 'https://clearcover.com/' },
        { name: 'Snapsheet', description: 'Virtual claims processing platform', logo: 'https://www.snapsheetclaims.com/favicon.ico', category: 'Insurance AI', link: 'https://www.snapsheetclaims.com/' }
    ],
    'ai-mental-health': [
        { name: 'Woebot', description: 'AI mental health chatbot', logo: 'https://woebothealth.com/favicon.ico', category: 'Mental Health AI', link: 'https://woebothealth.com/' },
        { name: 'Wysa', description: 'AI mental wellness coach', logo: 'https://www.wysa.io/favicon.ico', category: 'Mental Health AI', link: 'https://www.wysa.io/' },
        { name: 'Youper', description: 'AI emotional health assistant', logo: 'https://www.youper.ai/favicon.ico', category: 'Mental Health AI', link: 'https://www.youper.ai/' },
        { name: 'Replika', description: 'AI companion for mental wellbeing', logo: 'https://replika.ai/favicon.ico', category: 'Mental Health AI', link: 'https://replika.ai/' },
        { name: 'Mindstrong', description: 'Digital biomarkers for mental health', logo: 'https://mindstrong.com/favicon.ico', category: 'Mental Health AI', link: 'https://mindstrong.com/' },
        { name: 'Spring Health', description: 'AI-powered mental healthcare', logo: 'https://www.springhealth.com/favicon.ico', category: 'Mental Health AI', link: 'https://www.springhealth.com/' },
        { name: 'Quartet Health', description: 'AI mental health platform', logo: 'https://www.quartethealth.com/favicon.ico', category: 'Mental Health AI', link: 'https://www.quartethealth.com/' },
        { name: 'Ginger', description: 'On-demand mental healthcare', logo: 'https://www.ginger.com/favicon.ico', category: 'Mental Health AI', link: 'https://www.ginger.com/' },
        { name: 'Koko', description: 'AI peer support platform', logo: 'https://www.koko.ai/favicon.ico', category: 'Mental Health AI', link: 'https://www.koko.ai/' },
        { name: 'Moodpath', description: 'AI mood tracking and analysis', logo: 'https://mymoodpath.com/favicon.ico', category: 'Mental Health AI', link: 'https://mymoodpath.com/' }
    ],
    'ai-journalism': [
        { name: 'Automated Insights', description: 'Natural language generation for news', logo: 'https://automatedinsights.com/favicon.ico', category: 'Journalism AI', link: 'https://automatedinsights.com/' },
        { name: 'Narrative Science', description: 'AI-powered news writing', logo: 'https://narrativescience.com/favicon.ico', category: 'Journalism AI', link: 'https://narrativescience.com/' },
        { name: 'Juicer', description: 'AI news aggregation platform', logo: 'https://www.juicer.io/favicon.ico', category: 'Journalism AI', link: 'https://www.juicer.io/' },
        { name: 'Trint', description: 'AI transcription for journalists', logo: 'https://trint.com/favicon.ico', category: 'Journalism AI', link: 'https://trint.com/' },
        { name: 'Otter.ai', description: 'AI interview transcription', logo: 'https://otter.ai/favicon.ico', category: 'Journalism AI', link: 'https://otter.ai/' },
        { name: 'Knowhere News', description: 'AI-powered unbiased news', logo: 'https://knowherenews.com/favicon.ico', category: 'Journalism AI', link: 'https://knowherenews.com/' },
        { name: 'Primer', description: 'AI information analysis platform', logo: 'https://primer.ai/favicon.ico', category: 'Journalism AI', link: 'https://primer.ai/' },
        { name: 'NewsWhip', description: 'AI content intelligence platform', logo: 'https://www.newswhip.com/favicon.ico', category: 'Journalism AI', link: 'https://www.newswhip.com/' },
        { name: 'Dataminr', description: 'Real-time AI event detection', logo: 'https://www.dataminr.com/favicon.ico', category: 'Journalism AI', link: 'https://www.dataminr.com/' },
        { name: 'Chartbeat', description: 'AI content analytics for publishers', logo: 'https://chartbeat.com/favicon.ico', category: 'Journalism AI', link: 'https://chartbeat.com/' }
    ],
    'ai-water-management': [
        { name: 'Pluto AI', description: 'AI water treatment analytics', logo: 'https://plutoai.com/favicon.ico', category: 'Water Management AI', link: 'https://plutoai.com/' },
        { name: 'Ketos', description: 'AI water quality monitoring', logo: 'https://ketos.co/favicon.ico', category: 'Water Management AI', link: 'https://ketos.co/' },
        { name: 'Aquasight', description: 'AI water utility optimization', logo: 'https://www.aquasight.io/favicon.ico', category: 'Water Management AI', link: 'https://www.aquasight.io/' },
        { name: 'Fracta', description: 'AI water infrastructure assessment', logo: 'https://fracta.ai/favicon.ico', category: 'Water Management AI', link: 'https://fracta.ai/' },
        { name: 'Emagin', description: 'AI water management platform', logo: 'https://emagin.ai/favicon.ico', category: 'Water Management AI', link: 'https://emagin.ai/' },
        { name: 'Utilis', description: 'Satellite-based water leak detection', logo: 'https://utiliscorp.com/favicon.ico', category: 'Water Management AI', link: 'https://utiliscorp.com/' },
        { name: 'Fathom', description: 'AI flood risk modeling', logo: 'https://www.fathom.global/favicon.ico', category: 'Water Management AI', link: 'https://www.fathom.global/' },
        { name: 'Dropcountr', description: 'AI water conservation platform', logo: 'https://dropcountr.com/favicon.ico', category: 'Water Management AI', link: 'https://dropcountr.com/' },
        { name: 'Watchtower Robotics', description: 'AI water pipe inspection', logo: 'https://watchtower-robotics.com/favicon.ico', category: 'Water Management AI', link: 'https://watchtower-robotics.com/' },
        { name: 'Varuna', description: 'AI water quality monitoring platform', logo: 'https://www.varuna.io/favicon.ico', category: 'Water Management AI', link: 'https://www.varuna.io/' }
    ],
    'ai-space': [
        { name: 'SpaceKnow', description: 'Satellite imagery analytics', logo: 'https://www.spaceknow.com/favicon.ico', category: 'Space AI', link: 'https://www.spaceknow.com/' },
        { name: 'Orbital Insight', description: 'Geospatial analytics platform', logo: 'https://orbitalinsight.com/favicon.ico', category: 'Space AI', link: 'https://orbitalinsight.com/' },
        { name: 'Descartes Labs', description: 'Geospatial intelligence platform', logo: 'https://www.descarteslabs.com/favicon.ico', category: 'Space AI', link: 'https://www.descarteslabs.com/' },
        { name: 'Planet', description: 'Earth imaging and analytics', logo: 'https://www.planet.com/favicon.ico', category: 'Space AI', link: 'https://www.planet.com/' },
        { name: 'Capella Space', description: 'SAR satellite imagery with AI', logo: 'https://www.capellaspace.com/favicon.ico', category: 'Space AI', link: 'https://www.capellaspace.com/' },
        { name: 'Ursa Space', description: 'Satellite intelligence platform', logo: 'https://www.ursaspace.com/favicon.ico', category: 'Space AI', link: 'https://www.ursaspace.com/' },
        { name: 'Hypergiant', description: 'AI solutions for space industry', logo: 'https://www.hypergiant.com/favicon.ico', category: 'Space AI', link: 'https://www.hypergiant.com/' },
        { name: 'Maxar', description: 'Space infrastructure and intelligence', logo: 'https://www.maxar.com/favicon.ico', category: 'Space AI', link: 'https://www.maxar.com/' },
        { name: 'Slingshot Aerospace', description: 'Space situational awareness', logo: 'https://slingshotaerospace.com/favicon.ico', category: 'Space AI', link: 'https://slingshotaerospace.com/' },
        { name: 'AstroCognition', description: 'AI for space exploration', logo: 'https://astrocognition.org/favicon.ico', category: 'Space AI', link: 'https://astrocognition.org/' }
    ],
    'ai-blockchain': [
        { name: 'Chainlink AI', description: 'AI-powered oracle network for blockchain', logo: 'https://chain.link/favicon.ico', category: 'Blockchain AI', link: 'https://chain.link/' },
        { name: 'Ocean Protocol', description: 'Decentralized data exchange protocol', logo: 'https://oceanprotocol.com/favicon.ico', category: 'Blockchain AI', link: 'https://oceanprotocol.com/' },
        { name: 'SingularityNET', description: 'Decentralized AI marketplace', logo: 'https://singularitynet.io/favicon.ico', category: 'Blockchain AI', link: 'https://singularitynet.io/' },
        { name: 'Fetch.ai', description: 'AI-powered autonomous economic agents', logo: 'https://fetch.ai/favicon.ico', category: 'Blockchain AI', link: 'https://fetch.ai/' },
        { name: 'Numerai', description: 'AI-powered hedge fund on blockchain', logo: 'https://numer.ai/favicon.ico', category: 'Blockchain AI', link: 'https://numer.ai/' },
        { name: 'Cortex', description: 'AI on blockchain platform', logo: 'https://www.cortexlabs.ai/favicon.ico', category: 'Blockchain AI', link: 'https://www.cortexlabs.ai/' },
        { name: 'DeepBrain Chain', description: 'Distributed AI computing platform', logo: 'https://www.deepbrainchain.org/favicon.ico', category: 'Blockchain AI', link: 'https://www.deepbrainchain.org/' },
        { name: 'Matrix AI Network', description: 'Intelligent blockchain platform', logo: 'https://www.matrix.io/favicon.ico', category: 'Blockchain AI', link: 'https://www.matrix.io/' },
        { name: 'Velas', description: 'AI-enhanced blockchain network', logo: 'https://velas.com/favicon.ico', category: 'Blockchain AI', link: 'https://velas.com/' },
        { name: 'Oraichain', description: 'AI-powered oracle platform', logo: 'https://orai.io/favicon.ico', category: 'Blockchain AI', link: 'https://orai.io/' }
    ],
    'ai-science': [
        { name: 'DeepMind AlphaFold', description: 'AI system for protein structure prediction', logo: 'https://deepmind.com/favicon.ico', category: 'Scientific Research', link: 'https://deepmind.com/research/case-studies/alphafold' },
        { name: 'Semantic Scholar', description: 'AI-powered research paper search engine', logo: 'https://www.semanticscholar.org/favicon.ico', category: 'Scientific Research', link: 'https://www.semanticscholar.org/' },
        { name: 'Elicit', description: 'AI research assistant', logo: 'https://elicit.org/favicon.ico', category: 'Scientific Research', link: 'https://elicit.org/' },
        { name: 'Iris.ai', description: 'AI engine for scientific research', logo: 'https://iris.ai/favicon.ico', category: 'Scientific Research', link: 'https://iris.ai/' },
        { name: 'Consensus', description: 'AI-powered search for scientific papers', logo: 'https://consensus.app/favicon.ico', category: 'Scientific Research', link: 'https://consensus.app/' },
        { name: 'BenevolentAI', description: 'AI drug discovery platform', logo: 'https://www.benevolent.com/favicon.ico', category: 'Scientific Research', link: 'https://www.benevolent.com/' },
        { name: 'Insilico Medicine', description: 'AI for drug discovery and aging research', logo: 'https://insilico.com/favicon.ico', category: 'Scientific Research', link: 'https://insilico.com/' },
        { name: 'Atomwise', description: 'AI for drug discovery', logo: 'https://www.atomwise.com/favicon.ico', category: 'Scientific Research', link: 'https://www.atomwise.com/' },
        { name: 'Recursion', description: 'AI-powered drug discovery', logo: 'https://www.recursion.com/favicon.ico', category: 'Scientific Research', link: 'https://www.recursion.com/' },
        { name: 'SciBite', description: 'AI-driven scientific data analytics', logo: 'https://www.scibite.com/favicon.ico', category: 'Scientific Research', link: 'https://www.scibite.com/' }
    ],
    'ai-iot': [
        { name: 'Google Nest', description: 'AI-powered smart home devices', logo: 'https://store.google.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://store.google.com/category/connected_home' },
        { name: 'Amazon Alexa', description: 'Voice assistant for smart homes', logo: 'https://alexa.amazon.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://alexa.amazon.com/' },
        { name: 'Samsung SmartThings', description: 'Smart home platform with AI integration', logo: 'https://www.smartthings.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://www.smartthings.com/' },
        { name: 'Ecobee', description: 'Smart thermostats with AI features', logo: 'https://www.ecobee.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://www.ecobee.com/' },
        { name: 'Wyze', description: 'AI-powered smart home cameras', logo: 'https://wyze.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://wyze.com/' },
        { name: 'Arlo', description: 'AI security cameras and systems', logo: 'https://www.arlo.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://www.arlo.com/' },
        { name: 'Ring', description: 'Smart doorbells with AI detection', logo: 'https://ring.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://ring.com/' },
        { name: 'Philips Hue', description: 'Smart lighting with AI integration', logo: 'https://www.philips-hue.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://www.philips-hue.com/' },
        { name: 'Wemo', description: 'Smart home automation devices', logo: 'https://www.wemo.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://www.wemo.com/' },
        { name: 'Sensibo', description: 'AI-powered climate control', logo: 'https://sensibo.com/favicon.ico', category: 'IoT & Smart Home', link: 'https://sensibo.com/' }
    ],
    'ai-accessibility': [
        { name: 'Seeing AI', description: 'AI app for visually impaired users', logo: 'https://www.microsoft.com/favicon.ico', category: 'Accessibility Tools', link: 'https://www.microsoft.com/en-us/ai/seeing-ai' },
        { name: 'Be My Eyes', description: 'Visual assistance for blind people', logo: 'https://www.bemyeyes.com/favicon.ico', category: 'Accessibility Tools', link: 'https://www.bemyeyes.com/' },
        { name: 'Otter.ai', description: 'Real-time transcription for hearing impaired', logo: 'https://otter.ai/favicon.ico', category: 'Accessibility Tools', link: 'https://otter.ai/' },
        { name: 'Speechify', description: 'Text-to-speech for reading disabilities', logo: 'https://speechify.com/favicon.ico', category: 'Accessibility Tools', link: 'https://speechify.com/' },
        { name: 'AccessiBe', description: 'AI web accessibility solution', logo: 'https://accessibe.com/favicon.ico', category: 'Accessibility Tools', link: 'https://accessibe.com/' },
        { name: 'UserWay', description: 'AI-powered web accessibility widget', logo: 'https://userway.org/favicon.ico', category: 'Accessibility Tools', link: 'https://userway.org/' },
        { name: 'Voiceitt', description: 'Speech recognition for non-standard speech', logo: 'https://voiceitt.com/favicon.ico', category: 'Accessibility Tools', link: 'https://voiceitt.com/' },
        { name: 'Lookout by Google', description: 'Vision assistance for blind users', logo: 'https://play.google.com/favicon.ico', category: 'Accessibility Tools', link: 'https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.reveal' },
        { name: 'Livox', description: 'Alternative communication app', logo: 'https://livox.com.br/favicon.ico', category: 'Accessibility Tools', link: 'https://livox.com.br/en/' },
        { name: 'Aira', description: 'Visual interpreter service for blind', logo: 'https://aira.io/favicon.ico', category: 'Accessibility Tools', link: 'https://aira.io/' }
    ],
    'ai-document-processing': [
        { name: 'DocuSign AI', description: 'AI-powered document analysis and processing', logo: 'https://www.docusign.com/favicon.ico', category: 'Document Processing', link: 'https://www.docusign.com/products/ai' },
        { name: 'Adobe Acrobat AI', description: 'Intelligent document processing and editing', logo: 'https://www.adobe.com/favicon.ico', category: 'Document Processing', link: 'https://www.adobe.com/acrobat/ai.html' },
        { name: 'Nanonets', description: 'AI document data extraction and processing', logo: 'https://nanonets.com/favicon.ico', category: 'Document Processing', link: 'https://nanonets.com/' },
        { name: 'Docparser', description: 'Automated document data extraction', logo: 'https://docparser.com/favicon.ico', category: 'Document Processing', link: 'https://docparser.com/' },
        { name: 'Rossum', description: 'AI document understanding platform', logo: 'https://rossum.ai/favicon.ico', category: 'Document Processing', link: 'https://rossum.ai/' },
        { name: 'Kofax', description: 'Intelligent automation for documents', logo: 'https://www.kofax.com/favicon.ico', category: 'Document Processing', link: 'https://www.kofax.com/' },
        { name: 'ABBYY FlexiCapture', description: 'Document processing with machine learning', logo: 'https://www.abbyy.com/favicon.ico', category: 'Document Processing', link: 'https://www.abbyy.com/flexicapture/' },
        { name: 'Hyperscience', description: 'Intelligent document processing platform', logo: 'https://hyperscience.com/favicon.ico', category: 'Document Processing', link: 'https://hyperscience.com/' },
        { name: 'Automation Hero', description: 'AI-powered document processing', logo: 'https://automationhero.ai/favicon.ico', category: 'Document Processing', link: 'https://automationhero.ai/' },
        { name: 'Instabase', description: 'Deep learning for document understanding', logo: 'https://instabase.com/favicon.ico', category: 'Document Processing', link: 'https://instabase.com/' }
    ],
    'ai-healthcare': [
        { name: 'Ada Health', description: 'AI-powered symptom assessment', logo: 'https://ada.com/favicon.ico', category: 'Healthcare', link: 'https://ada.com/' },
        { name: 'Babylon Health', description: 'AI healthcare consultation platform', logo: 'https://www.babylonhealth.com/favicon.ico', category: 'Healthcare', link: 'https://www.babylonhealth.com/' },
        { name: 'Viz.ai', description: 'AI for stroke detection and care coordination', logo: 'https://www.viz.ai/favicon.ico', category: 'Healthcare', link: 'https://www.viz.ai/' },
        { name: 'PathAI', description: 'AI-powered pathology for diagnosis', logo: 'https://www.pathai.com/favicon.ico', category: 'Healthcare', link: 'https://www.pathai.com/' },
        { name: 'Zebra Medical', description: 'AI medical imaging analytics', logo: 'https://www.zebra-med.com/favicon.ico', category: 'Healthcare', link: 'https://www.zebra-med.com/' },
        { name: 'Tempus', description: 'AI-driven precision medicine', logo: 'https://www.tempus.com/favicon.ico', category: 'Healthcare', link: 'https://www.tempus.com/' },
        { name: 'Atomwise', description: 'AI for drug discovery', logo: 'https://www.atomwise.com/favicon.ico', category: 'Healthcare', link: 'https://www.atomwise.com/' },
        { name: 'Butterfly Network', description: 'AI-powered ultrasound technology', logo: 'https://www.butterflynetwork.com/favicon.ico', category: 'Healthcare', link: 'https://www.butterflynetwork.com/' },
        { name: 'Enlitic', description: 'AI medical imaging diagnostics', logo: 'https://www.enlitic.com/favicon.ico', category: 'Healthcare', link: 'https://www.enlitic.com/' },
        { name: 'Freenome', description: 'AI for early cancer detection', logo: 'https://www.freenome.com/favicon.ico', category: 'Healthcare', link: 'https://www.freenome.com/' }
    ],
    'ai-music-creation': [
        { name: 'Suno', description: 'Create original songs with text prompts', logo: 'https://suno.ai/favicon.ico', category: 'Music Creation', link: 'https://suno.ai/' },
        { name: 'Udio', description: 'AI music generation platform', logo: 'https://udio.com/favicon.ico', category: 'Music Creation', link: 'https://udio.com/' },
        { name: 'Harmonai', description: 'Open-source music generation', logo: 'https://www.harmonai.org/favicon.ico', category: 'Music Creation', link: 'https://www.harmonai.org/' },
        { name: 'Splash', description: 'AI-powered music creation', logo: 'https://splashmusicai.com/favicon.ico', category: 'Music Creation', link: 'https://splashmusicai.com/' },
        { name: 'Amper Music', description: 'AI music composition for content creators', logo: 'https://www.ampermusic.com/favicon.ico', category: 'Music Creation', link: 'https://www.ampermusic.com/' },
        { name: 'AIVA', description: 'AI composer for emotional soundtrack music', logo: 'https://www.aiva.ai/favicon.ico', category: 'Music Creation', link: 'https://www.aiva.ai/' },
        { name: 'Soundraw', description: 'AI music generator for creators', logo: 'https://soundraw.io/favicon.ico', category: 'Music Creation', link: 'https://soundraw.io/' },
        { name: 'Infinite Album', description: 'AI-generated music that never ends', logo: 'https://infinitealbum.io/favicon.ico', category: 'Music Creation', link: 'https://infinitealbum.io/' },
        { name: 'Amadeus Code', description: 'AI-powered songwriting assistant', logo: 'https://amadeuscode.com/favicon.ico', category: 'Music Creation', link: 'https://amadeuscode.com/' },
        { name: 'Humtap', description: 'Create music with your voice and AI', logo: 'https://www.humtap.com/favicon.ico', category: 'Music Creation', link: 'https://www.humtap.com/' }
    ],
    'ai-interior-design': [
        { name: 'Interior AI', description: 'AI interior design visualization', logo: 'https://interiorai.com/favicon.ico', category: 'Interior Design', link: 'https://interiorai.com/' },
        { name: 'Planner 5D', description: 'AI-powered interior design tool', logo: 'https://planner5d.com/favicon.ico', category: 'Interior Design', link: 'https://planner5d.com/' },
        { name: 'Modsy', description: 'AI interior design visualization service', logo: 'https://www.modsy.com/favicon.ico', category: 'Interior Design', link: 'https://www.modsy.com/' },
        { name: 'Roomvo', description: 'AI room visualization platform', logo: 'https://www.roomvo.com/favicon.ico', category: 'Interior Design', link: 'https://www.roomvo.com/' },
        { name: 'Foyr Neo', description: '3D interior design with AI assistance', logo: 'https://foyr.com/favicon.ico', category: 'Interior Design', link: 'https://foyr.com/neo/' },
        { name: 'RoomGPT', description: 'AI room design generator', logo: 'https://www.roomgpt.io/favicon.ico', category: 'Interior Design', link: 'https://www.roomgpt.io/' },
        { name: 'DecorMatters', description: 'AI interior design app', logo: 'https://decormatters.com/favicon.ico', category: 'Interior Design', link: 'https://decormatters.com/' },
        { name: 'Collov', description: 'AI interior design platform', logo: 'https://collov.com/favicon.ico', category: 'Interior Design', link: 'https://collov.com/' },
        { name: 'Spacejoy', description: 'Online interior design with AI', logo: 'https://www.spacejoy.com/favicon.ico', category: 'Interior Design', link: 'https://www.spacejoy.com/' },
        { name: 'Homestyler', description: 'AI-powered interior design software', logo: 'https://www.homestyler.com/favicon.ico', category: 'Interior Design', link: 'https://www.homestyler.com/' }
    ],
    'ai-translation': [
        { name: 'DeepL', description: 'Neural machine translation service', logo: 'https://www.deepl.com/favicon.ico', category: 'Translation', link: 'https://www.deepl.com/' },
        { name: 'SYSTRAN', description: 'AI-powered translation solutions', logo: 'https://www.systransoft.com/favicon.ico', category: 'Translation', link: 'https://www.systransoft.com/' },
        { name: 'Unbabel', description: 'AI + human translation platform', logo: 'https://unbabel.com/favicon.ico', category: 'Translation', link: 'https://unbabel.com/' },
        { name: 'Lilt', description: 'AI translation for enterprises', logo: 'https://lilt.com/favicon.ico', category: 'Translation', link: 'https://lilt.com/' },
        { name: 'Smartling', description: 'Translation management with AI', logo: 'https://www.smartling.com/favicon.ico', category: 'Translation', link: 'https://www.smartling.com/' },
        { name: 'Lengoo', description: 'AI-powered translation platform', logo: 'https://www.lengoo.com/favicon.ico', category: 'Translation', link: 'https://www.lengoo.com/' },
        { name: 'ModernMT', description: 'Adaptive neural machine translation', logo: 'https://www.modernmt.com/favicon.ico', category: 'Translation', link: 'https://www.modernmt.com/' },
        { name: 'Intento', description: 'AI translation comparison platform', logo: 'https://inten.to/favicon.ico', category: 'Translation', link: 'https://inten.to/' },
        { name: 'Argos Translate', description: 'Open-source neural machine translation', logo: 'https://www.argosopentech.com/favicon.ico', category: 'Translation', link: 'https://www.argosopentech.com/' },
        { name: 'Papago', description: 'Neural machine translation by Naver', logo: 'https://papago.naver.com/favicon.ico', category: 'Translation', link: 'https://papago.naver.com/' }
    ],
    'ai-speech-recognition': [
        { name: 'Whisper', description: 'OpenAI speech recognition system', logo: 'https://openai.com/favicon.ico', category: 'Speech Recognition', link: 'https://openai.com/research/whisper' },
        { name: 'AssemblyAI', description: 'Speech-to-text API with AI models', logo: 'https://www.assemblyai.com/favicon.ico', category: 'Speech Recognition', link: 'https://www.assemblyai.com/' },
        { name: 'Speechmatics', description: 'Enterprise speech recognition', logo: 'https://www.speechmatics.com/favicon.ico', category: 'Speech Recognition', link: 'https://www.speechmatics.com/' },
        { name: 'Deepgram', description: 'Real-time speech recognition API', logo: 'https://deepgram.com/favicon.ico', category: 'Speech Recognition', link: 'https://deepgram.com/' },
        { name: 'Picovoice', description: 'On-device voice AI platform', logo: 'https://picovoice.ai/favicon.ico', category: 'Speech Recognition', link: 'https://picovoice.ai/' },
        { name: 'Voicegain', description: 'Speech-to-text and voice analytics', logo: 'https://www.voicegain.ai/favicon.ico', category: 'Speech Recognition', link: 'https://www.voicegain.ai/' },
        { name: 'Soniox', description: 'High-accuracy speech recognition', logo: 'https://soniox.com/favicon.ico', category: 'Speech Recognition', link: 'https://soniox.com/' },
        { name: 'Verbit', description: 'AI transcription and captioning', logo: 'https://verbit.ai/favicon.ico', category: 'Speech Recognition', link: 'https://verbit.ai/' },
        { name: 'Voci', description: 'Enterprise speech-to-text platform', logo: 'https://www.vocitec.com/favicon.ico', category: 'Speech Recognition', link: 'https://www.vocitec.com/' },
        { name: 'Speechly', description: 'Voice UI for mobile and web apps', logo: 'https://www.speechly.com/favicon.ico', category: 'Speech Recognition', link: 'https://www.speechly.com/' }
    ],
    'ai-data-visualization': [
        { name: 'Tableau', description: 'Interactive data visualization with AI', logo: 'https://www.tableau.com/favicon.ico', category: 'Data Visualization', link: 'https://www.tableau.com/' },
        { name: 'PowerBI', description: 'Microsoft business analytics with AI', logo: 'https://powerbi.microsoft.com/favicon.ico', category: 'Data Visualization', link: 'https://powerbi.microsoft.com/' },
        { name: 'Qlik', description: 'Data analytics and visualization platform', logo: 'https://www.qlik.com/favicon.ico', category: 'Data Visualization', link: 'https://www.qlik.com/' },
        { name: 'Looker', description: 'Business intelligence and analytics', logo: 'https://looker.com/favicon.ico', category: 'Data Visualization', link: 'https://looker.com/' },
        { name: 'Sisense', description: 'AI-driven analytics platform', logo: 'https://www.sisense.com/favicon.ico', category: 'Data Visualization', link: 'https://www.sisense.com/' },
        { name: 'ThoughtSpot', description: 'AI-powered analytics platform', logo: 'https://www.thoughtspot.com/favicon.ico', category: 'Data Visualization', link: 'https://www.thoughtspot.com/' },
        { name: 'Domo', description: 'Business intelligence and data visualization', logo: 'https://www.domo.com/favicon.ico', category: 'Data Visualization', link: 'https://www.domo.com/' },
        { name: 'Toucan Toco', description: 'Data storytelling platform', logo: 'https://toucantoco.com/favicon.ico', category: 'Data Visualization', link: 'https://toucantoco.com/' },
        { name: 'Graphext', description: 'AI-powered data analysis platform', logo: 'https://www.graphext.com/favicon.ico', category: 'Data Visualization', link: 'https://www.graphext.com/' },
        { name: 'Kinetica', description: 'GPU-accelerated analytics platform', logo: 'https://www.kinetica.com/favicon.ico', category: 'Data Visualization', link: 'https://www.kinetica.com/' }
    ],
    'ai-customer-insights': [
        { name: 'Qualtrics XM', description: 'AI-powered experience management', logo: 'https://www.qualtrics.com/favicon.ico', category: 'Customer Insights', link: 'https://www.qualtrics.com/' },
        { name: 'Medallia', description: 'Customer and employee experience platform', logo: 'https://www.medallia.com/favicon.ico', category: 'Customer Insights', link: 'https://www.medallia.com/' },
        { name: 'Clarabridge', description: 'AI-powered customer experience analytics', logo: 'https://www.clarabridge.com/favicon.ico', category: 'Customer Insights', link: 'https://www.clarabridge.com/' },
        { name: 'Chattermill', description: 'Unified customer feedback analysis', logo: 'https://chattermill.com/favicon.ico', category: 'Customer Insights', link: 'https://chattermill.com/' },
        { name: 'Wonderflow', description: 'AI-powered customer feedback analysis', logo: 'https://www.wonderflow.ai/favicon.ico', category: 'Customer Insights', link: 'https://www.wonderflow.ai/' },
        { name: 'Idiomatic', description: 'Customer feedback analysis platform', logo: 'https://www.idiomatic.com/favicon.ico', category: 'Customer Insights', link: 'https://www.idiomatic.com/' },
        { name: 'Thematic', description: 'AI customer feedback analysis', logo: 'https://thematic.co/favicon.ico', category: 'Customer Insights', link: 'https://thematic.co/' },
        { name: 'Keatext', description: 'AI-powered customer feedback analytics', logo: 'https://www.keatext.ai/favicon.ico', category: 'Customer Insights', link: 'https://www.keatext.ai/' },
        { name: 'Stratifyd', description: 'AI-powered analytics platform', logo: 'https://www.stratifyd.com/favicon.ico', category: 'Customer Insights', link: 'https://www.stratifyd.com/' },
        { name: 'Viable', description: 'AI analysis of qualitative feedback', logo: 'https://www.askviable.com/favicon.ico', category: 'Customer Insights', link: 'https://www.askviable.com/' }
    ],
    'ai-legal-tech': [
        { name: 'ROSS Intelligence', description: 'AI legal research platform', logo: 'https://rossintelligence.com/favicon.ico', category: 'Legal Tech', link: 'https://rossintelligence.com/' },
        { name: 'Casetext', description: 'AI-powered legal research assistant', logo: 'https://casetext.com/favicon.ico', category: 'Legal Tech', link: 'https://casetext.com/' },
        { name: 'Kira Systems', description: 'AI contract analysis software', logo: 'https://kirasystems.com/favicon.ico', category: 'Legal Tech', link: 'https://kirasystems.com/' },
        { name: 'Luminance', description: 'AI document analysis for legal teams', logo: 'https://www.luminance.com/favicon.ico', category: 'Legal Tech', link: 'https://www.luminance.com/' },
        { name: 'LawGeex', description: 'AI contract review automation', logo: 'https://www.lawgeex.com/favicon.ico', category: 'Legal Tech', link: 'https://www.lawgeex.com/' },
        { name: 'Everlaw', description: 'AI-powered litigation platform', logo: 'https://www.everlaw.com/favicon.ico', category: 'Legal Tech', link: 'https://www.everlaw.com/' },
        { name: 'Disco', description: 'AI-powered legal discovery', logo: 'https://www.csdisco.com/favicon.ico', category: 'Legal Tech', link: 'https://www.csdisco.com/' },
        { name: 'Relativity', description: 'E-discovery and compliance platform', logo: 'https://www.relativity.com/favicon.ico', category: 'Legal Tech', link: 'https://www.relativity.com/' },
        { name: 'Lexion', description: 'AI contract management', logo: 'https://lexion.ai/favicon.ico', category: 'Legal Tech', link: 'https://lexion.ai/' },
        { name: 'Evisort', description: 'AI-powered contract intelligence', logo: 'https://www.evisort.com/favicon.ico', category: 'Legal Tech', link: 'https://www.evisort.com/' }
    ],
    'ai-avatars': [
        { name: 'Ready Player Me', description: 'Cross-platform avatar creator', logo: 'https://readyplayer.me/favicon.ico', category: 'AI Avatars', link: 'https://readyplayer.me/' },
        { name: 'Avatar AI', description: 'AI-powered avatar generation', logo: 'https://avatarai.me/favicon.ico', category: 'AI Avatars', link: 'https://avatarai.me/' },
        { name: 'Midjourney', description: 'AI image generation for avatars', logo: 'https://www.midjourney.com/favicon.ico', category: 'AI Avatars', link: 'https://www.midjourney.com/' },
        { name: 'HeyGen', description: 'AI video avatars for business', logo: 'https://www.heygen.com/favicon.ico', category: 'AI Avatars', link: 'https://www.heygen.com/' },
        { name: 'Synthesia', description: 'AI video generation with avatars', logo: 'https://www.synthesia.io/favicon.ico', category: 'AI Avatars', link: 'https://www.synthesia.io/' },
        { name: 'D-ID', description: 'AI-generated digital humans', logo: 'https://www.d-id.com/favicon.ico', category: 'AI Avatars', link: 'https://www.d-id.com/' },
        { name: 'Lensa', description: 'AI avatar creator app', logo: 'https://prisma-ai.com/favicon.ico', category: 'AI Avatars', link: 'https://prisma-ai.com/lensa' },
        { name: 'Reface', description: 'Face swap app for videos and GIFs', logo: 'https://reface.ai/favicon.ico', category: 'AI Avatars', link: 'https://reface.ai/' },
        { name: 'Picter', description: 'AI profile picture generator', logo: 'https://picterai.com/favicon.ico', category: 'AI Avatars', link: 'https://picterai.com/' },
        { name: 'Photosonic', description: 'AI image generation for avatars', logo: 'https://writesonic.com/favicon.ico', category: 'AI Avatars', link: 'https://writesonic.com/photosonic' }
    ],
    'ai-search': [
        { name: 'Perplexity', description: 'AI-powered answer engine', logo: 'https://www.perplexity.ai/favicon.ico', category: 'AI Search', link: 'https://www.perplexity.ai/' },
        { name: 'You.com', description: 'AI search engine', logo: 'https://you.com/favicon.ico', category: 'AI Search', link: 'https://you.com/' },
        { name: 'Bing AI', description: 'Microsoft AI-powered search', logo: 'https://www.bing.com/favicon.ico', category: 'AI Search', link: 'https://www.bing.com/' },
        { name: 'Google AI Overview', description: 'AI-powered search summaries', logo: 'https://www.google.com/favicon.ico', category: 'AI Search', link: 'https://www.google.com/' },
        { name: 'Kagi', description: 'Premium AI search engine', logo: 'https://kagi.com/favicon.ico', category: 'AI Search', link: 'https://kagi.com/' },
        { name: 'Phind', description: 'AI search for developers', logo: 'https://www.phind.com/favicon.ico', category: 'AI Search', link: 'https://www.phind.com/' },
        { name: 'Consensus', description: 'AI search for research papers', logo: 'https://consensus.app/favicon.ico', category: 'AI Search', link: 'https://consensus.app/' },
        { name: 'Metaphor', description: 'AI search engine for the internet', logo: 'https://metaphor.systems/favicon.ico', category: 'AI Search', link: 'https://metaphor.systems/' },
        { name: 'Neeva', description: 'Ad-free search with AI', logo: 'https://neeva.com/favicon.ico', category: 'AI Search', link: 'https://neeva.com/' },
        { name: 'Brave Search', description: 'Private search with AI summaries', logo: 'https://search.brave.com/favicon.ico', category: 'AI Search', link: 'https://search.brave.com/' }
    ],
    'ai-audio-enhancers': [
        { name: 'Descript', description: 'Audio editing with AI', logo: 'https://www.descript.com/favicon.ico', category: 'Audio Enhancement', link: 'https://www.descript.com/' },
        { name: 'Adobe Podcast', description: 'AI-powered audio enhancement', logo: 'https://podcast.adobe.com/favicon.ico', category: 'Audio Enhancement', link: 'https://podcast.adobe.com/' },
        { name: 'Auphonic', description: 'Automated audio post-production', logo: 'https://auphonic.com/favicon.ico', category: 'Audio Enhancement', link: 'https://auphonic.com/' },
        { name: 'Krisp', description: 'AI noise cancellation for calls', logo: 'https://krisp.ai/favicon.ico', category: 'Audio Enhancement', link: 'https://krisp.ai/' },
        { name: 'iZotope RX', description: 'Audio repair and enhancement', logo: 'https://www.izotope.com/favicon.ico', category: 'Audio Enhancement', link: 'https://www.izotope.com/en/products/rx.html' },
        { name: 'Accusonus', description: 'AI-powered audio repair', logo: 'https://accusonus.com/favicon.ico', category: 'Audio Enhancement', link: 'https://accusonus.com/' },
        { name: 'Lalal.ai', description: 'AI-powered stem separation', logo: 'https://www.lalal.ai/favicon.ico', category: 'Audio Enhancement', link: 'https://www.lalal.ai/' },
        { name: 'Audionamix', description: 'Professional audio separation', logo: 'https://audionamix.com/favicon.ico', category: 'Audio Enhancement', link: 'https://audionamix.com/' },
        { name: 'Podcastle', description: 'AI-powered podcast creation', logo: 'https://podcastle.ai/favicon.ico', category: 'Audio Enhancement', link: 'https://podcastle.ai/' },
        { name: 'Cleanvoice', description: 'Remove filler words from audio', logo: 'https://cleanvoice.ai/favicon.ico', category: 'Audio Enhancement', link: 'https://cleanvoice.ai/' }
    ],
    'translation-tools': [
        { name: 'Google Translate', description: 'Free multilingual translation service', logo: 'https://translate.google.com/favicon.ico', category: 'Translation', link: 'https://translate.google.com' },
        { name: 'DeepL', description: 'AI-powered translation service', logo: 'https://www.deepl.com/favicon.ico', category: 'Translation', link: 'https://www.deepl.com' },
        { name: 'Microsoft Translator', description: 'Cloud-based translation service', logo: 'https://www.microsoft.com/favicon.ico', category: 'Translation', link: 'https://www.microsoft.com/en-us/translator' },
        { name: 'Reverso', description: 'Translation and language learning', logo: 'https://www.reverso.net/favicon.ico', category: 'Translation', link: 'https://www.reverso.net' },
        { name: 'Linguee', description: 'Dictionary and translation search engine', logo: 'https://www.linguee.com/favicon.ico', category: 'Translation', link: 'https://www.linguee.com' },
        { name: 'Babylon', description: 'Translation software and dictionary', logo: 'https://www.babylon-software.com/favicon.ico', category: 'Translation', link: 'https://www.babylon-software.com' },
        { name: 'SDL Trados', description: 'Professional translation software', logo: 'https://www.sdltrados.com/favicon.ico', category: 'Translation', link: 'https://www.sdltrados.com' },
        { name: 'Phrase', description: 'Localization platform for teams', logo: 'https://phrase.com/favicon.ico', category: 'Translation', link: 'https://phrase.com' },
        { name: 'Lokalise', description: 'Translation management system', logo: 'https://lokalise.com/favicon.ico', category: 'Translation', link: 'https://lokalise.com' },
        { name: 'Crowdin', description: 'Localization management platform', logo: 'https://crowdin.com/favicon.ico', category: 'Translation', link: 'https://crowdin.com' }
    ],
    'seo-tools': [
        { name: 'SEMrush', description: 'All-in-one marketing toolkit', logo: 'https://www.semrush.com/favicon.ico', category: 'SEO Tools', link: 'https://www.semrush.com' },
        { name: 'Ahrefs', description: 'SEO toolset for backlink analysis', logo: 'https://ahrefs.com/favicon.ico', category: 'SEO Tools', link: 'https://ahrefs.com' },
        { name: 'Moz', description: 'SEO software and tools', logo: 'https://moz.com/favicon.ico', category: 'SEO Tools', link: 'https://moz.com' },
        { name: 'Google Search Console', description: 'Monitor website performance in search', logo: 'https://search.google.com/favicon.ico', category: 'SEO Tools', link: 'https://search.google.com/search-console' },
        { name: 'Screaming Frog', description: 'SEO spider tool for website crawling', logo: 'https://www.screamingfrog.co.uk/favicon.ico', category: 'SEO Tools', link: 'https://www.screamingfrog.co.uk' },
        { name: 'Ubersuggest', description: 'Keyword research and SEO tool', logo: 'https://neilpatel.com/favicon.ico', category: 'SEO Tools', link: 'https://neilpatel.com/ubersuggest' },
        { name: 'Surfer SEO', description: 'Content optimization tool', logo: 'https://surferseo.com/favicon.ico', category: 'SEO Tools', link: 'https://surferseo.com' },
        { name: 'BrightEdge', description: 'Enterprise SEO platform', logo: 'https://www.brightedge.com/favicon.ico', category: 'SEO Tools', link: 'https://www.brightedge.com' },
        { name: 'Conductor', description: 'Organic marketing platform', logo: 'https://www.conductor.com/favicon.ico', category: 'SEO Tools', link: 'https://www.conductor.com' },
        { name: 'Searchmetrics', description: 'SEO and content optimization', logo: 'https://www.searchmetrics.com/favicon.ico', category: 'SEO Tools', link: 'https://www.searchmetrics.com' }
    ],
    'email-tools': [
        { name: 'Mailchimp', description: 'Email marketing platform', logo: 'https://mailchimp.com/favicon.ico', category: 'Email Tools', link: 'https://mailchimp.com' },
        { name: 'Constant Contact', description: 'Email marketing and automation', logo: 'https://www.constantcontact.com/favicon.ico', category: 'Email Tools', link: 'https://www.constantcontact.com' },
        { name: 'SendGrid', description: 'Email delivery service', logo: 'https://sendgrid.com/favicon.ico', category: 'Email Tools', link: 'https://sendgrid.com' },
        { name: 'Campaign Monitor', description: 'Email marketing software', logo: 'https://www.campaignmonitor.com/favicon.ico', category: 'Email Tools', link: 'https://www.campaignmonitor.com' },
        { name: 'ConvertKit', description: 'Email marketing for creators', logo: 'https://convertkit.com/favicon.ico', category: 'Email Tools', link: 'https://convertkit.com' },
        { name: 'AWeber', description: 'Email marketing and automation', logo: 'https://www.aweber.com/favicon.ico', category: 'Email Tools', link: 'https://www.aweber.com' },
        { name: 'GetResponse', description: 'Email marketing platform', logo: 'https://www.getresponse.com/favicon.ico', category: 'Email Tools', link: 'https://www.getresponse.com' },
        { name: 'ActiveCampaign', description: 'Customer experience automation', logo: 'https://www.activecampaign.com/favicon.ico', category: 'Email Tools', link: 'https://www.activecampaign.com' },
        { name: 'Klaviyo', description: 'Email and SMS marketing platform', logo: 'https://www.klaviyo.com/favicon.ico', category: 'Email Tools', link: 'https://www.klaviyo.com' },
        { name: 'Drip', description: 'E-commerce CRM and email marketing', logo: 'https://www.drip.com/favicon.ico', category: 'Email Tools', link: 'https://www.drip.com' }
    ],
    'presentation-tools': [
        { name: 'Gamma', description: 'AI-powered presentation maker', logo: 'https://gamma.app/favicon.ico', category: 'Presentation Tools', link: 'https://gamma.app' },
        { name: 'Beautiful.AI', description: 'Smart presentation software', logo: 'https://www.beautiful.ai/favicon.ico', category: 'Presentation Tools', link: 'https://www.beautiful.ai' },
        { name: 'Tome', description: 'AI storytelling format', logo: 'https://tome.app/favicon.ico', category: 'Presentation Tools', link: 'https://tome.app' },
        { name: 'Slidebean', description: 'AI pitch deck designer', logo: 'https://slidebean.com/favicon.ico', category: 'Presentation Tools', link: 'https://slidebean.com' },
        { name: 'Prezi', description: 'Conversational presentation software', logo: 'https://prezi.com/favicon.ico', category: 'Presentation Tools', link: 'https://prezi.com' },
        { name: 'Canva Presentations', description: 'Design presentations with AI', logo: 'https://www.canva.com/favicon.ico', category: 'Presentation Tools', link: 'https://www.canva.com/presentations' },
        { name: 'Slides', description: 'Online presentation editor', logo: 'https://slides.com/favicon.ico', category: 'Presentation Tools', link: 'https://slides.com' },
        { name: 'Genially', description: 'Interactive content creation', logo: 'https://genial.ly/favicon.ico', category: 'Presentation Tools', link: 'https://genial.ly' },
        { name: 'Mentimeter', description: 'Interactive presentation software', logo: 'https://www.mentimeter.com/favicon.ico', category: 'Presentation Tools', link: 'https://www.mentimeter.com' },
        { name: 'Haiku Deck', description: 'Simple presentation software', logo: 'https://www.haikudeck.com/favicon.ico', category: 'Presentation Tools', link: 'https://www.haikudeck.com' }
    ],
    'research-tools': [
        { name: 'Perplexity AI', description: 'AI-powered research assistant', logo: 'https://www.perplexity.ai/favicon.ico', category: 'Research Tools', link: 'https://www.perplexity.ai' },
        { name: 'Semantic Scholar', description: 'AI-powered research tool', logo: 'https://www.semanticscholar.org/favicon.ico', category: 'Research Tools', link: 'https://www.semanticscholar.org' },
        { name: 'Elicit', description: 'AI research assistant', logo: 'https://elicit.org/favicon.ico', category: 'Research Tools', link: 'https://elicit.org' },
        { name: 'ResearchGate', description: 'Social network for scientists', logo: 'https://www.researchgate.net/favicon.ico', category: 'Research Tools', link: 'https://www.researchgate.net' },
        { name: 'Mendeley', description: 'Reference manager and academic network', logo: 'https://www.mendeley.com/favicon.ico', category: 'Research Tools', link: 'https://www.mendeley.com' },
        { name: 'Zotero', description: 'Research assistant and citation manager', logo: 'https://www.zotero.org/favicon.ico', category: 'Research Tools', link: 'https://www.zotero.org' },
        { name: 'Consensus', description: 'AI-powered research engine', logo: 'https://consensus.app/favicon.ico', category: 'Research Tools', link: 'https://consensus.app' },
        { name: 'Scholarcy', description: 'AI-powered research summarization', logo: 'https://www.scholarcy.com/favicon.ico', category: 'Research Tools', link: 'https://www.scholarcy.com' },
        { name: 'Iris.ai', description: 'AI research assistant', logo: 'https://iris.ai/favicon.ico', category: 'Research Tools', link: 'https://iris.ai' },
        { name: 'Connected Papers', description: 'Visual tool to find relevant papers', logo: 'https://www.connectedpapers.com/favicon.ico', category: 'Research Tools', link: 'https://www.connectedpapers.com' }
    ],
    'productivity-tools': [
        { name: 'Notion', description: 'All-in-one workspace with AI', logo: 'https://www.notion.so/favicon.ico', category: 'Productivity', link: 'https://www.notion.so' },
        { name: 'Todoist', description: 'Task management with AI features', logo: 'https://todoist.com/favicon.ico', category: 'Productivity', link: 'https://todoist.com' },
        { name: 'Trello', description: 'Visual project management tool', logo: 'https://trello.com/favicon.ico', category: 'Productivity', link: 'https://trello.com' },
        { name: 'Asana', description: 'Team collaboration and project management', logo: 'https://asana.com/favicon.ico', category: 'Productivity', link: 'https://asana.com' },
        { name: 'Monday.com', description: 'Work operating system', logo: 'https://monday.com/favicon.ico', category: 'Productivity', link: 'https://monday.com' },
        { name: 'ClickUp', description: 'All-in-one productivity platform', logo: 'https://clickup.com/favicon.ico', category: 'Productivity', link: 'https://clickup.com' },
        { name: 'Airtable', description: 'Database and spreadsheet hybrid', logo: 'https://airtable.com/favicon.ico', category: 'Productivity', link: 'https://airtable.com' },
        { name: 'Slack', description: 'Business communication platform', logo: 'https://slack.com/favicon.ico', category: 'Productivity', link: 'https://slack.com' },
        { name: 'Microsoft Teams', description: 'Collaboration and communication', logo: 'https://www.microsoft.com/favicon.ico', category: 'Productivity', link: 'https://www.microsoft.com/en-us/microsoft-teams' },
        { name: 'Zoom', description: 'Video conferencing and communication', logo: 'https://zoom.us/favicon.ico', category: 'Productivity', link: 'https://zoom.us' }
    ],
    'finance-tools': [
        { name: 'Mint', description: 'Personal finance management', logo: 'https://mint.intuit.com/favicon.ico', category: 'Finance Tools', link: 'https://mint.intuit.com' },
        { name: 'YNAB', description: 'You Need A Budget - budgeting software', logo: 'https://www.youneedabudget.com/favicon.ico', category: 'Finance Tools', link: 'https://www.youneedabudget.com' },
        { name: 'Personal Capital', description: 'Wealth management and tracking', logo: 'https://www.personalcapital.com/favicon.ico', category: 'Finance Tools', link: 'https://www.personalcapital.com' },
        { name: 'Quicken', description: 'Personal finance software', logo: 'https://www.quicken.com/favicon.ico', category: 'Finance Tools', link: 'https://www.quicken.com' },
        { name: 'Tiller', description: 'Spreadsheet-based budgeting', logo: 'https://www.tillerhq.com/favicon.ico', category: 'Finance Tools', link: 'https://www.tillerhq.com' },
        { name: 'PocketGuard', description: 'Budgeting and expense tracking', logo: 'https://pocketguard.com/favicon.ico', category: 'Finance Tools', link: 'https://pocketguard.com' },
        { name: 'Goodbudget', description: 'Envelope budgeting app', logo: 'https://goodbudget.com/favicon.ico', category: 'Finance Tools', link: 'https://goodbudget.com' },
        { name: 'EveryDollar', description: 'Zero-based budgeting tool', logo: 'https://www.everydollar.com/favicon.ico', category: 'Finance Tools', link: 'https://www.everydollar.com' },
        { name: 'Honeydue', description: 'Couples money management', logo: 'https://www.honeydue.com/favicon.ico', category: 'Finance Tools', link: 'https://www.honeydue.com' },
        { name: 'Spendee', description: 'Personal finance and budgeting', logo: 'https://www.spendee.com/favicon.ico', category: 'Finance Tools', link: 'https://www.spendee.com' }
    ],
    'health-tools': [
        { name: 'MyFitnessPal', description: 'Calorie counting and nutrition tracking', logo: 'https://www.myfitnesspal.com/favicon.ico', category: 'Health Tools', link: 'https://www.myfitnesspal.com' },
        { name: 'Fitbit', description: 'Fitness tracking and health monitoring', logo: 'https://www.fitbit.com/favicon.ico', category: 'Health Tools', link: 'https://www.fitbit.com' },
        { name: 'Apple Health', description: 'Comprehensive health tracking', logo: 'https://www.apple.com/favicon.ico', category: 'Health Tools', link: 'https://www.apple.com/ios/health' },
        { name: 'Google Fit', description: 'Activity tracking and health insights', logo: 'https://www.google.com/favicon.ico', category: 'Health Tools', link: 'https://www.google.com/fit' },
        { name: 'Headspace', description: 'Meditation and mindfulness app', logo: 'https://www.headspace.com/favicon.ico', category: 'Health Tools', link: 'https://www.headspace.com' },
        { name: 'Calm', description: 'Sleep, meditation, and relaxation', logo: 'https://www.calm.com/favicon.ico', category: 'Health Tools', link: 'https://www.calm.com' },
        { name: 'Strava', description: 'Social fitness tracking', logo: 'https://www.strava.com/favicon.ico', category: 'Health Tools', link: 'https://www.strava.com' },
        { name: 'Lose It!', description: 'Calorie counting and weight loss', logo: 'https://www.loseit.com/favicon.ico', category: 'Health Tools', link: 'https://www.loseit.com' },
        { name: 'Sleep Cycle', description: 'Sleep tracking and smart alarm', logo: 'https://www.sleepcycle.com/favicon.ico', category: 'Health Tools', link: 'https://www.sleepcycle.com' },
        { name: 'Noom', description: 'Psychology-based weight loss', logo: 'https://www.noom.com/favicon.ico', category: 'Health Tools', link: 'https://www.noom.com' }
    ],
    'education-tools': [
        { name: 'Khan Academy', description: 'Free online learning platform', logo: 'https://www.khanacademy.org/favicon.ico', category: 'Education Tools', link: 'https://www.khanacademy.org' },
        { name: 'Coursera', description: 'Online courses from universities', logo: 'https://www.coursera.org/favicon.ico', category: 'Education Tools', link: 'https://www.coursera.org' },
        { name: 'edX', description: 'University-level online courses', logo: 'https://www.edx.org/favicon.ico', category: 'Education Tools', link: 'https://www.edx.org' },
        { name: 'Udemy', description: 'Online learning marketplace', logo: 'https://www.udemy.com/favicon.ico', category: 'Education Tools', link: 'https://www.udemy.com' },
        { name: 'Duolingo', description: 'Language learning platform', logo: 'https://www.duolingo.com/favicon.ico', category: 'Education Tools', link: 'https://www.duolingo.com' },
        { name: 'Skillshare', description: 'Creative and business skills', logo: 'https://www.skillshare.com/favicon.ico', category: 'Education Tools', link: 'https://www.skillshare.com' },
        { name: 'MasterClass', description: 'Learn from experts and celebrities', logo: 'https://www.masterclass.com/favicon.ico', category: 'Education Tools', link: 'https://www.masterclass.com' },
        { name: 'Pluralsight', description: 'Technology skills platform', logo: 'https://www.pluralsight.com/favicon.ico', category: 'Education Tools', link: 'https://www.pluralsight.com' },
        { name: 'LinkedIn Learning', description: 'Professional development courses', logo: 'https://www.linkedin.com/favicon.ico', category: 'Education Tools', link: 'https://www.linkedin.com/learning' },
        { name: 'Codecademy', description: 'Interactive coding lessons', logo: 'https://www.codecademy.com/favicon.ico', category: 'Education Tools', link: 'https://www.codecademy.com' }
    ],
    'gaming-tools': [
        { name: 'Unity', description: 'Game development platform', logo: 'https://unity.com/favicon.ico', category: 'Gaming Tools', link: 'https://unity.com' },
        { name: 'Unreal Engine', description: 'Game engine and development tools', logo: 'https://www.unrealengine.com/favicon.ico', category: 'Gaming Tools', link: 'https://www.unrealengine.com' },
        { name: 'GameMaker Studio', description: '2D game development platform', logo: 'https://www.yoyogames.com/favicon.ico', category: 'Gaming Tools', link: 'https://www.yoyogames.com/gamemaker' },
        { name: 'Construct 3', description: 'Browser-based game development', logo: 'https://www.construct.net/favicon.ico', category: 'Gaming Tools', link: 'https://www.construct.net' },
        { name: 'Godot', description: 'Open source game engine', logo: 'https://godotengine.org/favicon.ico', category: 'Gaming Tools', link: 'https://godotengine.org' },
        { name: 'RPG Maker', description: 'Create RPGs without programming', logo: 'https://www.rpgmakerweb.com/favicon.ico', category: 'Gaming Tools', link: 'https://www.rpgmakerweb.com' },
        { name: 'Buildbox', description: 'No-code game development', logo: 'https://www.buildbox.com/favicon.ico', category: 'Gaming Tools', link: 'https://www.buildbox.com' },
        { name: 'Stencyl', description: 'Game creation without code', logo: 'https://www.stencyl.com/favicon.ico', category: 'Gaming Tools', link: 'https://www.stencyl.com' },
        { name: 'Corona SDK', description: 'Cross-platform mobile game development', logo: 'https://coronalabs.com/favicon.ico', category: 'Gaming Tools', link: 'https://coronalabs.com' },
        { name: 'Defold', description: 'Game engine for mobile games', logo: 'https://defold.com/favicon.ico', category: 'Gaming Tools', link: 'https://defold.com' }
    ],
    'social-media-tools': [
        { name: 'Hootsuite', description: 'Social media management platform', logo: 'https://hootsuite.com/favicon.ico', category: 'Social Media', link: 'https://hootsuite.com' },
        { name: 'Buffer', description: 'Social media scheduling and analytics', logo: 'https://buffer.com/favicon.ico', category: 'Social Media', link: 'https://buffer.com' },
        { name: 'Sprout Social', description: 'Social media management and analytics', logo: 'https://sproutsocial.com/favicon.ico', category: 'Social Media', link: 'https://sproutsocial.com' },
        { name: 'Later', description: 'Visual social media scheduler', logo: 'https://later.com/favicon.ico', category: 'Social Media', link: 'https://later.com' },
        { name: 'SocialBee', description: 'Social media management tool', logo: 'https://socialbee.io/favicon.ico', category: 'Social Media', link: 'https://socialbee.io' },
        { name: 'CoSchedule', description: 'Marketing calendar and social media', logo: 'https://coschedule.com/favicon.ico', category: 'Social Media', link: 'https://coschedule.com' },
        { name: 'Sendible', description: 'Social media management for agencies', logo: 'https://www.sendible.com/favicon.ico', category: 'Social Media', link: 'https://www.sendible.com' },
        { name: 'Agorapulse', description: 'Social media management and CRM', logo: 'https://www.agorapulse.com/favicon.ico', category: 'Social Media', link: 'https://www.agorapulse.com' },
        { name: 'MeetEdgar', description: 'Social media automation', logo: 'https://meetedgar.com/favicon.ico', category: 'Social Media', link: 'https://meetedgar.com' },
        { name: 'Socialbakers', description: 'AI-powered social media marketing', logo: 'https://www.socialbakers.com/favicon.ico', category: 'Social Media', link: 'https://www.socialbakers.com' }
    ],
    'legal-tools': [
        { name: 'LegalZoom', description: 'Online legal services', logo: 'https://www.legalzoom.com/favicon.ico', category: 'Legal Tools', link: 'https://www.legalzoom.com' },
        { name: 'Rocket Lawyer', description: 'Legal documents and advice', logo: 'https://www.rocketlawyer.com/favicon.ico', category: 'Legal Tools', link: 'https://www.rocketlawyer.com' },
        { name: 'Nolo', description: 'Legal information and software', logo: 'https://www.nolo.com/favicon.ico', category: 'Legal Tools', link: 'https://www.nolo.com' },
        { name: 'LawDepot', description: 'Legal document templates', logo: 'https://www.lawdepot.com/favicon.ico', category: 'Legal Tools', link: 'https://www.lawdepot.com' },
        { name: 'DoNotPay', description: 'AI lawyer for consumer rights', logo: 'https://donotpay.com/favicon.ico', category: 'Legal Tools', link: 'https://donotpay.com' },
        { name: 'Clio', description: 'Legal practice management software', logo: 'https://www.clio.com/favicon.ico', category: 'Legal Tools', link: 'https://www.clio.com' },
        { name: 'MyCase', description: 'Legal case management software', logo: 'https://www.mycase.com/favicon.ico', category: 'Legal Tools', link: 'https://www.mycase.com' },
        { name: 'PracticePanther', description: 'Legal practice management', logo: 'https://www.practicepanther.com/favicon.ico', category: 'Legal Tools', link: 'https://www.practicepanther.com' },
        { name: 'Smokeball', description: 'Legal practice management software', logo: 'https://www.smokeball.com/favicon.ico', category: 'Legal Tools', link: 'https://www.smokeball.com' },
        { name: 'TimeSolv', description: 'Legal time tracking and billing', logo: 'https://www.timesolv.com/favicon.ico', category: 'Legal Tools', link: 'https://www.timesolv.com' }
    ],
    'hr-tools': [
        { name: 'BambooHR', description: 'Human resources software', logo: 'https://www.bamboohr.com/favicon.ico', category: 'HR Tools', link: 'https://www.bamboohr.com' },
        { name: 'Workday', description: 'Enterprise HR and finance software', logo: 'https://www.workday.com/favicon.ico', category: 'HR Tools', link: 'https://www.workday.com' },
        { name: 'ADP', description: 'Payroll and HR services', logo: 'https://www.adp.com/favicon.ico', category: 'HR Tools', link: 'https://www.adp.com' },
        { name: 'Gusto', description: 'Payroll, benefits, and HR', logo: 'https://gusto.com/favicon.ico', category: 'HR Tools', link: 'https://gusto.com' },
        { name: 'Zenefits', description: 'HR platform for small businesses', logo: 'https://www.zenefits.com/favicon.ico', category: 'HR Tools', link: 'https://www.zenefits.com' },
        { name: 'Namely', description: 'HR platform for mid-sized companies', logo: 'https://www.namely.com/favicon.ico', category: 'HR Tools', link: 'https://www.namely.com' },
        { name: 'Paycor', description: 'HR and payroll software', logo: 'https://www.paycor.com/favicon.ico', category: 'HR Tools', link: 'https://www.paycor.com' },
        { name: 'UltiPro', description: 'HR, payroll, and talent management', logo: 'https://www.ultimatesoftware.com/favicon.ico', category: 'HR Tools', link: 'https://www.ultimatesoftware.com' },
        { name: 'SuccessFactors', description: 'SAP HR management suite', logo: 'https://www.successfactors.com/favicon.ico', category: 'HR Tools', link: 'https://www.successfactors.com' },
        { name: 'Greenhouse', description: 'Recruiting and hiring software', logo: 'https://www.greenhouse.io/favicon.ico', category: 'HR Tools', link: 'https://www.greenhouse.io' }
    ],
    'real-estate-tools': [
        { name: 'Zillow', description: 'Real estate search and valuation', logo: 'https://www.zillow.com/favicon.ico', category: 'Real Estate', link: 'https://www.zillow.com' },
        { name: 'Realtor.com', description: 'Real estate listings and tools', logo: 'https://www.realtor.com/favicon.ico', category: 'Real Estate', link: 'https://www.realtor.com' },
        { name: 'Redfin', description: 'Real estate brokerage and search', logo: 'https://www.redfin.com/favicon.ico', category: 'Real Estate', link: 'https://www.redfin.com' },
        { name: 'BiggerPockets', description: 'Real estate investing community', logo: 'https://www.biggerpockets.com/favicon.ico', category: 'Real Estate', link: 'https://www.biggerpockets.com' },
        { name: 'LoopNet', description: 'Commercial real estate marketplace', logo: 'https://www.loopnet.com/favicon.ico', category: 'Real Estate', link: 'https://www.loopnet.com' },
        { name: 'CoStar', description: 'Commercial real estate information', logo: 'https://www.costar.com/favicon.ico', category: 'Real Estate', link: 'https://www.costar.com' },
        { name: 'MLS', description: 'Multiple listing service', logo: 'https://www.mls.com/favicon.ico', category: 'Real Estate', link: 'https://www.mls.com' },
        { name: 'Chime', description: 'Real estate CRM and lead management', logo: 'https://www.chime.me/favicon.ico', category: 'Real Estate', link: 'https://www.chime.me' },
        { name: 'Top Producer', description: 'Real estate CRM software', logo: 'https://www.topproducer.com/favicon.ico', category: 'Real Estate', link: 'https://www.topproducer.com' },
        { name: 'Wise Agent', description: 'Real estate CRM and marketing', logo: 'https://www.wiseagent.com/favicon.ico', category: 'Real Estate', link: 'https://www.wiseagent.com' }
    ],
    'sales-tools': [
        { name: 'Salesforce', description: 'Customer relationship management', logo: 'https://www.salesforce.com/favicon.ico', category: 'Sales Tools', link: 'https://www.salesforce.com' },
        { name: 'HubSpot', description: 'Inbound marketing and sales platform', logo: 'https://www.hubspot.com/favicon.ico', category: 'Sales Tools', link: 'https://www.hubspot.com' },
        { name: 'Pipedrive', description: 'Sales CRM and pipeline management', logo: 'https://www.pipedrive.com/favicon.ico', category: 'Sales Tools', link: 'https://www.pipedrive.com' },
        { name: 'Zoho CRM', description: 'Customer relationship management', logo: 'https://www.zoho.com/favicon.ico', category: 'Sales Tools', link: 'https://www.zoho.com/crm' },
        { name: 'Monday Sales CRM', description: 'Visual sales pipeline management', logo: 'https://monday.com/favicon.ico', category: 'Sales Tools', link: 'https://monday.com/crm' },
        { name: 'Freshsales', description: 'Sales CRM software', logo: 'https://www.freshworks.com/favicon.ico', category: 'Sales Tools', link: 'https://www.freshworks.com/crm/sales' },
        { name: 'Close', description: 'Inside sales CRM', logo: 'https://close.com/favicon.ico', category: 'Sales Tools', link: 'https://close.com' },
        { name: 'Outreach', description: 'Sales engagement platform', logo: 'https://www.outreach.io/favicon.ico', category: 'Sales Tools', link: 'https://www.outreach.io' },
        { name: 'SalesLoft', description: 'Sales engagement platform', logo: 'https://salesloft.com/favicon.ico', category: 'Sales Tools', link: 'https://salesloft.com' },
        { name: 'Gong', description: 'Revenue intelligence platform', logo: 'https://www.gong.io/favicon.ico', category: 'Sales Tools', link: 'https://www.gong.io' }
    ],
    'customer-service-tools': [
        { name: 'Zendesk', description: 'Customer service and support platform', logo: 'https://www.zendesk.com/favicon.ico', category: 'Customer Service', link: 'https://www.zendesk.com' },
        { name: 'Freshdesk', description: 'Customer support software', logo: 'https://freshdesk.com/favicon.ico', category: 'Customer Service', link: 'https://freshdesk.com' },
        { name: 'Intercom', description: 'Customer messaging platform', logo: 'https://www.intercom.com/favicon.ico', category: 'Customer Service', link: 'https://www.intercom.com' },
        { name: 'Help Scout', description: 'Customer service platform', logo: 'https://www.helpscout.com/favicon.ico', category: 'Customer Service', link: 'https://www.helpscout.com' },
        { name: 'LiveChat', description: 'Customer service live chat software', logo: 'https://www.livechat.com/favicon.ico', category: 'Customer Service', link: 'https://www.livechat.com' },
        { name: 'Drift', description: 'Conversational marketing platform', logo: 'https://www.drift.com/favicon.ico', category: 'Customer Service', link: 'https://www.drift.com' },
        { name: 'Crisp', description: 'Customer messaging platform', logo: 'https://crisp.chat/favicon.ico', category: 'Customer Service', link: 'https://crisp.chat' },
        { name: 'Kayako', description: 'Customer service software', logo: 'https://www.kayako.com/favicon.ico', category: 'Customer Service', link: 'https://www.kayako.com' },
        { name: 'ServiceNow', description: 'Enterprise service management', logo: 'https://www.servicenow.com/favicon.ico', category: 'Customer Service', link: 'https://www.servicenow.com' },
        { name: 'Jira Service Management', description: 'IT service management', logo: 'https://www.atlassian.com/favicon.ico', category: 'Customer Service', link: 'https://www.atlassian.com/software/jira/service-management' }
    ],
    'cybersecurity-tools': [
        { name: 'Norton', description: 'Antivirus and internet security', logo: 'https://us.norton.com/favicon.ico', category: 'Cybersecurity', link: 'https://us.norton.com' },
        { name: 'McAfee', description: 'Antivirus and cybersecurity solutions', logo: 'https://www.mcafee.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.mcafee.com' },
        { name: 'Kaspersky', description: 'Antivirus and internet security', logo: 'https://www.kaspersky.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.kaspersky.com' },
        { name: 'Bitdefender', description: 'Cybersecurity and antivirus solutions', logo: 'https://www.bitdefender.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.bitdefender.com' },
        { name: 'Avast', description: 'Antivirus and internet security', logo: 'https://www.avast.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.avast.com' },
        { name: 'Malwarebytes', description: 'Anti-malware and cybersecurity', logo: 'https://www.malwarebytes.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.malwarebytes.com' },
        { name: 'CrowdStrike', description: 'Endpoint protection platform', logo: 'https://www.crowdstrike.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.crowdstrike.com' },
        { name: 'SentinelOne', description: 'AI-powered cybersecurity platform', logo: 'https://www.sentinelone.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.sentinelone.com' },
        { name: 'Palo Alto Networks', description: 'Cybersecurity platform', logo: 'https://www.paloaltonetworks.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.paloaltonetworks.com' },
        { name: 'Fortinet', description: 'Cybersecurity solutions', logo: 'https://www.fortinet.com/favicon.ico', category: 'Cybersecurity', link: 'https://www.fortinet.com' }
    ],
    'logistics-tools': [
        { name: 'ShipStation', description: 'Shipping and order fulfillment', logo: 'https://www.shipstation.com/favicon.ico', category: 'Logistics', link: 'https://www.shipstation.com' },
        { name: 'Easyship', description: 'Global shipping platform', logo: 'https://www.easyship.com/favicon.ico', category: 'Logistics', link: 'https://www.easyship.com' },
        { name: 'ShipBob', description: 'E-commerce fulfillment service', logo: 'https://www.shipbob.com/favicon.ico', category: 'Logistics', link: 'https://www.shipbob.com' },
        { name: 'Flexport', description: 'Global freight forwarder', logo: 'https://www.flexport.com/favicon.ico', category: 'Logistics', link: 'https://www.flexport.com' },
        { name: 'FreightWaves', description: 'Freight market intelligence', logo: 'https://www.freightwaves.com/favicon.ico', category: 'Logistics', link: 'https://www.freightwaves.com' },
        { name: 'Project44', description: 'Supply chain visibility platform', logo: 'https://www.project44.com/favicon.ico', category: 'Logistics', link: 'https://www.project44.com' },
        { name: 'Convoy', description: 'Digital freight network', logo: 'https://convoy.com/favicon.ico', category: 'Logistics', link: 'https://convoy.com' },
        { name: 'Uber Freight', description: 'Freight marketplace', logo: 'https://www.uberfreight.com/favicon.ico', category: 'Logistics', link: 'https://www.uberfreight.com' },
        { name: 'C.H. Robinson', description: 'Third-party logistics provider', logo: 'https://www.chrobinson.com/favicon.ico', category: 'Logistics', link: 'https://www.chrobinson.com' },
        { name: 'XPO Logistics', description: 'Supply chain solutions', logo: 'https://www.xpo.com/favicon.ico', category: 'Logistics', link: 'https://www.xpo.com' }
    ],
    'agriculture-tools': [
        { name: 'Climate FieldView', description: 'Digital agriculture platform', logo: 'https://www.climate.com/favicon.ico', category: 'Agriculture', link: 'https://www.climate.com' },
        { name: 'John Deere Operations Center', description: 'Farm management software', logo: 'https://www.deere.com/favicon.ico', category: 'Agriculture', link: 'https://www.deere.com' },
        { name: 'Granular', description: 'Farm management software', logo: 'https://www.granular.ag/favicon.ico', category: 'Agriculture', link: 'https://www.granular.ag' },
        { name: 'FarmLogs', description: 'Farm record keeping and analytics', logo: 'https://farmlogs.com/favicon.ico', category: 'Agriculture', link: 'https://farmlogs.com' },
        { name: 'AgriWebb', description: 'Livestock and farm management', logo: 'https://www.agriwebb.com/favicon.ico', category: 'Agriculture', link: 'https://www.agriwebb.com' },
        { name: 'Trimble Ag', description: 'Precision agriculture solutions', logo: 'https://agriculture.trimble.com/favicon.ico', category: 'Agriculture', link: 'https://agriculture.trimble.com' },
        { name: 'Farmers Edge', description: 'Digital agriculture platform', logo: 'https://www.farmersedge.ca/favicon.ico', category: 'Agriculture', link: 'https://www.farmersedge.ca' },
        { name: 'Cropio', description: 'Satellite field monitoring', logo: 'https://www.cropio.com/favicon.ico', category: 'Agriculture', link: 'https://www.cropio.com' },
        { name: 'PrecisionHawk', description: 'Drone-based agriculture analytics', logo: 'https://www.precisionhawk.com/favicon.ico', category: 'Agriculture', link: 'https://www.precisionhawk.com' },
        { name: 'Taranis', description: 'AI-powered crop intelligence', logo: 'https://www.taranis.com/favicon.ico', category: 'Agriculture', link: 'https://www.taranis.com' }
    ],
    'photo-editing-tools': [
        { name: 'Photoshop AI', description: 'Adobe Photoshop with AI-powered features', logo: 'https://www.adobe.com/favicon.ico', category: 'Photo Editing', link: 'https://www.adobe.com/products/photoshop.html' },
        { name: 'Luminar AI', description: 'AI-powered photo editing software', logo: 'https://skylum.com/favicon.ico', category: 'Photo Editing', link: 'https://skylum.com/luminar-ai' },
        { name: 'Topaz Labs', description: 'AI image enhancement and upscaling', logo: 'https://www.topazlabs.com/favicon.ico', category: 'Photo Editing', link: 'https://www.topazlabs.com' },
        { name: 'Remove.bg', description: 'AI background removal tool', logo: 'https://www.remove.bg/favicon.ico', category: 'Photo Editing', link: 'https://www.remove.bg' },
        { name: 'Upscale.media', description: 'AI image upscaling and enhancement', logo: 'https://upscale.media/favicon.ico', category: 'Photo Editing', link: 'https://upscale.media' },
        { name: 'Cleanup.pictures', description: 'Remove objects from photos with AI', logo: 'https://cleanup.pictures/favicon.ico', category: 'Photo Editing', link: 'https://cleanup.pictures' },
        { name: 'Colorize.cc', description: 'AI-powered photo colorization', logo: 'https://colorize.cc/favicon.ico', category: 'Photo Editing', link: 'https://colorize.cc' },
        { name: 'Enhance.Pho.to', description: 'AI photo enhancement and filters', logo: 'https://enhance.pho.to/favicon.ico', category: 'Photo Editing', link: 'https://enhance.pho.to' },
        { name: 'Fotor', description: 'AI-powered photo editor and design tool', logo: 'https://www.fotor.com/favicon.ico', category: 'Photo Editing', link: 'https://www.fotor.com' },
        { name: 'Pixlr AI', description: 'Online photo editor with AI features', logo: 'https://pixlr.com/favicon.ico', category: 'Photo Editing', link: 'https://pixlr.com' }
    ],
    'writing-assistants': [
        { name: 'Grammarly', description: 'AI writing assistant for grammar and style', logo: 'https://www.grammarly.com/favicon.ico', category: 'Writing Assistant', link: 'https://www.grammarly.com' },
        { name: 'ProWritingAid', description: 'Grammar checker and writing coach', logo: 'https://prowritingaid.com/favicon.ico', category: 'Writing Assistant', link: 'https://prowritingaid.com' },
        { name: 'Hemingway Editor', description: 'Make your writing bold and clear', logo: 'https://hemingwayapp.com/favicon.ico', category: 'Writing Assistant', link: 'https://hemingwayapp.com' },
        { name: 'LanguageTool', description: 'Grammar and style checker', logo: 'https://languagetool.org/favicon.ico', category: 'Writing Assistant', link: 'https://languagetool.org' },
        { name: 'Ginger', description: 'Grammar and spell checker', logo: 'https://www.gingersoftware.com/favicon.ico', category: 'Writing Assistant', link: 'https://www.gingersoftware.com' },
        { name: 'WhiteSmoke', description: 'English writing enhancement software', logo: 'https://www.whitesmoke.com/favicon.ico', category: 'Writing Assistant', link: 'https://www.whitesmoke.com' },
        { name: 'Sapling', description: 'AI writing assistant for teams', logo: 'https://sapling.ai/favicon.ico', category: 'Writing Assistant', link: 'https://sapling.ai' },
        { name: 'Outwrite', description: 'AI writing assistant and editor', logo: 'https://www.outwrite.com/favicon.ico', category: 'Writing Assistant', link: 'https://www.outwrite.com' },
        { name: 'Writer', description: 'AI writing platform for teams', logo: 'https://writer.com/favicon.ico', category: 'Writing Assistant', link: 'https://writer.com' },
        { name: 'Wordtune', description: 'AI writing companion', logo: 'https://www.wordtune.com/favicon.ico', category: 'Writing Assistant', link: 'https://www.wordtune.com' }
    ],
    'meeting-tools': [
        { name: 'Otter.ai', description: 'AI meeting transcription and notes', logo: 'https://otter.ai/favicon.ico', category: 'Meeting Tools', link: 'https://otter.ai' },
        { name: 'Zoom AI Companion', description: 'AI-powered meeting assistant', logo: 'https://zoom.us/favicon.ico', category: 'Meeting Tools', link: 'https://zoom.us' },
        { name: 'Microsoft Teams AI', description: 'AI features in Microsoft Teams', logo: 'https://www.microsoft.com/favicon.ico', category: 'Meeting Tools', link: 'https://www.microsoft.com/en-us/microsoft-teams' },
        { name: 'Fireflies.ai', description: 'AI meeting recorder and transcriber', logo: 'https://fireflies.ai/favicon.ico', category: 'Meeting Tools', link: 'https://fireflies.ai' },
        { name: 'Grain', description: 'AI-powered meeting recorder', logo: 'https://grain.com/favicon.ico', category: 'Meeting Tools', link: 'https://grain.com' },
        { name: 'Chorus', description: 'Conversation intelligence platform', logo: 'https://www.chorus.ai/favicon.ico', category: 'Meeting Tools', link: 'https://www.chorus.ai' },
        { name: 'Rev', description: 'AI transcription and captioning', logo: 'https://www.rev.com/favicon.ico', category: 'Meeting Tools', link: 'https://www.rev.com' },
        { name: 'Trint', description: 'AI transcription software', logo: 'https://trint.com/favicon.ico', category: 'Meeting Tools', link: 'https://trint.com' },
        { name: 'Sonix', description: 'Automated transcription service', logo: 'https://sonix.ai/favicon.ico', category: 'Meeting Tools', link: 'https://sonix.ai' },
        { name: 'Happy Scribe', description: 'Transcription and subtitling service', logo: 'https://www.happyscribe.com/favicon.ico', category: 'Meeting Tools', link: 'https://www.happyscribe.com' }
    ],
    'recruitment-tools': [
        { name: 'HireVue', description: 'AI-powered video interviewing', logo: 'https://www.hirevue.com/favicon.ico', category: 'Recruitment', link: 'https://www.hirevue.com' },
        { name: 'Pymetrics', description: 'AI-based talent matching', logo: 'https://www.pymetrics.ai/favicon.ico', category: 'Recruitment', link: 'https://www.pymetrics.ai' },
        { name: 'Textio', description: 'Augmented writing for job posts', logo: 'https://textio.com/favicon.ico', category: 'Recruitment', link: 'https://textio.com' },
        { name: 'Ideal', description: 'AI recruiting automation', logo: 'https://ideal.com/favicon.ico', category: 'Recruitment', link: 'https://ideal.com' },
        { name: 'Eightfold AI', description: 'AI talent intelligence platform', logo: 'https://eightfold.ai/favicon.ico', category: 'Recruitment', link: 'https://eightfold.ai' },
        { name: 'Paradox', description: 'Conversational AI for recruiting', logo: 'https://www.paradox.ai/favicon.ico', category: 'Recruitment', link: 'https://www.paradox.ai' },
        { name: 'SeekOut', description: 'AI-powered talent search', logo: 'https://seekout.com/favicon.ico', category: 'Recruitment', link: 'https://seekout.com' },
        { name: 'Fetcher', description: 'AI recruiting outreach', logo: 'https://fetcher.ai/favicon.ico', category: 'Recruitment', link: 'https://fetcher.ai' },
        { name: 'Humanly', description: 'AI screening and scheduling', logo: 'https://humanly.io/favicon.ico', category: 'Recruitment', link: 'https://humanly.io' },
        { name: 'Mya', description: 'Conversational AI recruiter', logo: 'https://mya.com/favicon.ico', category: 'Recruitment', link: 'https://mya.com' }
    ],
    'analytics-tools': [
        { name: 'Google Analytics', description: 'Web analytics and reporting', logo: 'https://analytics.google.com/favicon.ico', category: 'Analytics', link: 'https://analytics.google.com' },
        { name: 'Mixpanel', description: 'Product analytics platform', logo: 'https://mixpanel.com/favicon.ico', category: 'Analytics', link: 'https://mixpanel.com' },
        { name: 'Amplitude', description: 'Digital analytics platform', logo: 'https://amplitude.com/favicon.ico', category: 'Analytics', link: 'https://amplitude.com' },
        { name: 'Hotjar', description: 'Website heatmaps and behavior analytics', logo: 'https://www.hotjar.com/favicon.ico', category: 'Analytics', link: 'https://www.hotjar.com' },
        { name: 'Segment', description: 'Customer data platform', logo: 'https://segment.com/favicon.ico', category: 'Analytics', link: 'https://segment.com' },
        { name: 'Adobe Analytics', description: 'Enterprise analytics solution', logo: 'https://www.adobe.com/favicon.ico', category: 'Analytics', link: 'https://www.adobe.com/analytics' },
        { name: 'Heap', description: 'Digital insights platform', logo: 'https://heap.io/favicon.ico', category: 'Analytics', link: 'https://heap.io' },
        { name: 'Kissmetrics', description: 'Customer engagement automation', logo: 'https://www.kissmetrics.io/favicon.ico', category: 'Analytics', link: 'https://www.kissmetrics.io' },
        { name: 'Crazy Egg', description: 'Website optimization and analytics', logo: 'https://www.crazyegg.com/favicon.ico', category: 'Analytics', link: 'https://www.crazyegg.com' },
        { name: 'FullStory', description: 'Digital experience analytics', logo: 'https://www.fullstory.com/favicon.ico', category: 'Analytics', link: 'https://www.fullstory.com' }
    ],
    'inventory-management': [
        { name: 'TradeGecko', description: 'Inventory and order management', logo: 'https://www.tradegecko.com/favicon.ico', category: 'Inventory', link: 'https://www.tradegecko.com' },
        { name: 'Cin7', description: 'Inventory management system', logo: 'https://cin7.com/favicon.ico', category: 'Inventory', link: 'https://cin7.com' },
        { name: 'Zoho Inventory', description: 'Online inventory management', logo: 'https://www.zoho.com/favicon.ico', category: 'Inventory', link: 'https://www.zoho.com/inventory' },
        { name: 'inFlow Inventory', description: 'Small business inventory software', logo: 'https://www.inflowinventory.com/favicon.ico', category: 'Inventory', link: 'https://www.inflowinventory.com' },
        { name: 'Fishbowl', description: 'Manufacturing and warehouse management', logo: 'https://www.fishbowlinventory.com/favicon.ico', category: 'Inventory', link: 'https://www.fishbowlinventory.com' },
        { name: 'NetSuite', description: 'ERP and inventory management', logo: 'https://www.netsuite.com/favicon.ico', category: 'Inventory', link: 'https://www.netsuite.com' },
        { name: 'Ordoro', description: 'Inventory and shipping management', logo: 'https://www.ordoro.com/favicon.ico', category: 'Inventory', link: 'https://www.ordoro.com' },
        { name: 'Katana', description: 'Manufacturing inventory software', logo: 'https://katanamrp.com/favicon.ico', category: 'Inventory', link: 'https://katanamrp.com' },
        { name: 'Unleashed', description: 'Cloud inventory management', logo: 'https://www.unleashedsoftware.com/favicon.ico', category: 'Inventory', link: 'https://www.unleashedsoftware.com' },
        { name: 'DEAR Inventory', description: 'Inventory management system', logo: 'https://dearsystems.com/favicon.ico', category: 'Inventory', link: 'https://dearsystems.com' }
    ],
    'content-moderation': [
        { name: 'Perspective API', description: 'AI content moderation by Google', logo: 'https://www.perspectiveapi.com/favicon.ico', category: 'Content Moderation', link: 'https://www.perspectiveapi.com' },
        { name: 'AWS Rekognition', description: 'Image and video analysis', logo: 'https://aws.amazon.com/favicon.ico', category: 'Content Moderation', link: 'https://aws.amazon.com/rekognition' },
        { name: 'Microsoft Content Moderator', description: 'AI content moderation service', logo: 'https://www.microsoft.com/favicon.ico', category: 'Content Moderation', link: 'https://azure.microsoft.com/en-us/services/cognitive-services/content-moderator' },
        { name: 'Hive Moderation', description: 'AI content moderation platform', logo: 'https://hivemoderation.com/favicon.ico', category: 'Content Moderation', link: 'https://hivemoderation.com' },
        { name: 'Clarifai', description: 'Computer vision AI platform', logo: 'https://www.clarifai.com/favicon.ico', category: 'Content Moderation', link: 'https://www.clarifai.com' },
        { name: 'Sightengine', description: 'Image and video moderation API', logo: 'https://sightengine.com/favicon.ico', category: 'Content Moderation', link: 'https://sightengine.com' },
        { name: 'WebPurify', description: 'Content moderation and filtering', logo: 'https://www.webpurify.com/favicon.ico', category: 'Content Moderation', link: 'https://www.webpurify.com' },
        { name: 'Two Hat Security', description: 'AI content moderation', logo: 'https://www.twohat.com/favicon.ico', category: 'Content Moderation', link: 'https://www.twohat.com' },
        { name: 'Besedo', description: 'Content moderation services', logo: 'https://www.besedo.com/favicon.ico', category: 'Content Moderation', link: 'https://www.besedo.com' },
        { name: 'Crisp Thinking', description: 'AI content moderation', logo: 'https://www.crispthinking.com/favicon.ico', category: 'Content Moderation', link: 'https://www.crispthinking.com' }
    ],
    'survey-tools': [
        { name: 'SurveyMonkey', description: 'Online survey platform', logo: 'https://www.surveymonkey.com/favicon.ico', category: 'Survey Tools', link: 'https://www.surveymonkey.com' },
        { name: 'Typeform', description: 'Interactive forms and surveys', logo: 'https://www.typeform.com/favicon.ico', category: 'Survey Tools', link: 'https://www.typeform.com' },
        { name: 'Google Forms', description: 'Free online form builder', logo: 'https://www.google.com/favicon.ico', category: 'Survey Tools', link: 'https://forms.google.com' },
        { name: 'Qualtrics', description: 'Experience management platform', logo: 'https://www.qualtrics.com/favicon.ico', category: 'Survey Tools', link: 'https://www.qualtrics.com' },
        { name: 'JotForm', description: 'Online form builder', logo: 'https://www.jotform.com/favicon.ico', category: 'Survey Tools', link: 'https://www.jotform.com' },
        { name: 'Formstack', description: 'Workplace productivity platform', logo: 'https://www.formstack.com/favicon.ico', category: 'Survey Tools', link: 'https://www.formstack.com' },
        { name: 'SurveyGizmo', description: 'Advanced survey software', logo: 'https://www.surveygizmo.com/favicon.ico', category: 'Survey Tools', link: 'https://www.surveygizmo.com' },
        { name: 'Wufoo', description: 'Online form builder', logo: 'https://www.wufoo.com/favicon.ico', category: 'Survey Tools', link: 'https://www.wufoo.com' },
        { name: 'Formsite', description: 'Online form and survey builder', logo: 'https://www.formsite.com/favicon.ico', category: 'Survey Tools', link: 'https://www.formsite.com' },
        { name: 'SoGoSurvey', description: 'Online survey software', logo: 'https://www.sogosurvey.com/favicon.ico', category: 'Survey Tools', link: 'https://www.sogosurvey.com' }
    ],
    'api-tools': [
        { name: 'OpenAI API', description: 'Access to GPT and other AI models', logo: 'https://openai.com/favicon.ico', category: 'API Tools', link: 'https://openai.com/api' },
        { name: 'Hugging Face API', description: 'Machine learning model APIs', logo: 'https://huggingface.co/favicon.ico', category: 'API Tools', link: 'https://huggingface.co/inference-api' },
        { name: 'Google Cloud AI APIs', description: 'AI and ML APIs by Google', logo: 'https://cloud.google.com/favicon.ico', category: 'API Tools', link: 'https://cloud.google.com/ai' },
        { name: 'AWS AI Services', description: 'AI APIs and services by Amazon', logo: 'https://aws.amazon.com/favicon.ico', category: 'API Tools', link: 'https://aws.amazon.com/machine-learning/ai-services' },
        { name: 'Azure Cognitive Services', description: 'AI APIs by Microsoft', logo: 'https://azure.microsoft.com/favicon.ico', category: 'API Tools', link: 'https://azure.microsoft.com/en-us/services/cognitive-services' },
        { name: 'Cohere API', description: 'Natural language processing API', logo: 'https://cohere.ai/favicon.ico', category: 'API Tools', link: 'https://cohere.ai' },
        { name: 'Anthropic API', description: 'Claude AI model API', logo: 'https://www.anthropic.com/favicon.ico', category: 'API Tools', link: 'https://www.anthropic.com' },
        { name: 'Stability AI API', description: 'Stable Diffusion and other AI APIs', logo: 'https://stability.ai/favicon.ico', category: 'API Tools', link: 'https://stability.ai' },
        { name: 'Replicate', description: 'Run AI models via API', logo: 'https://replicate.com/favicon.ico', category: 'API Tools', link: 'https://replicate.com' },
        { name: 'AI21 Labs API', description: 'Language model APIs', logo: 'https://www.ai21.com/favicon.ico', category: 'API Tools', link: 'https://www.ai21.com' }
    ],
    'resume-builders': [
        { name: 'Resume.io', description: 'AI-powered resume builder with professional templates', logo: 'https://resume.io/favicon.ico', category: 'Resume Builders', link: 'https://resume.io' },
        { name: 'Zety', description: 'Smart resume builder with AI suggestions', logo: 'https://zety.com/favicon.ico', category: 'Resume Builders', link: 'https://zety.com' },
        { name: 'Novoresume', description: 'Modern resume builder with AI optimization', logo: 'https://novoresume.com/favicon.ico', category: 'Resume Builders', link: 'https://novoresume.com' },
        { name: 'Canva Resume', description: 'AI-enhanced resume design platform', logo: 'https://www.canva.com/favicon.ico', category: 'Resume Builders', link: 'https://www.canva.com/resumes' },
        { name: 'ResumeGenius', description: 'AI resume builder with expert guidance', logo: 'https://resumegenius.com/favicon.ico', category: 'Resume Builders', link: 'https://resumegenius.com' },
        { name: 'LiveCareer', description: 'Professional resume builder with AI tips', logo: 'https://www.livecareer.com/favicon.ico', category: 'Resume Builders', link: 'https://www.livecareer.com' },
        { name: 'MyPerfectResume', description: 'AI-powered resume creation tool', logo: 'https://www.myperfectresume.com/favicon.ico', category: 'Resume Builders', link: 'https://www.myperfectresume.com' },
        { name: 'Kickresume', description: 'AI resume builder with ATS optimization', logo: 'https://www.kickresume.com/favicon.ico', category: 'Resume Builders', link: 'https://www.kickresume.com' },
        { name: 'Enhancv', description: 'Modern resume builder with AI insights', logo: 'https://enhancv.com/favicon.ico', category: 'Resume Builders', link: 'https://enhancv.com' },
        { name: 'VisualCV', description: 'Professional resume builder with AI features', logo: 'https://www.visualcv.com/favicon.ico', category: 'Resume Builders', link: 'https://www.visualcv.com' }
    ],
    'ai-summarizers': [
        { name: 'TLDR This', description: 'Summarize any article or webpage', logo: 'https://tldrthis.com/favicon.ico', category: 'AI Summarization', link: 'https://tldrthis.com/' },
        { name: 'Summari', description: 'AI article summarization', logo: 'https://www.summari.com/favicon.ico', category: 'AI Summarization', link: 'https://www.summari.com/' },
        { name: 'Scholarcy', description: 'Research paper summarization', logo: 'https://www.scholarcy.com/favicon.ico', category: 'AI Summarization', link: 'https://www.scholarcy.com/' },
        { name: 'Wordtune Read', description: 'AI document summarization', logo: 'https://www.wordtune.com/favicon.ico', category: 'AI Summarization', link: 'https://www.wordtune.com/read' },
        { name: 'Quillbot Summarizer', description: 'Free text summarization tool', logo: 'https://quillbot.com/favicon.ico', category: 'AI Summarization', link: 'https://quillbot.com/summarize' },
        { name: 'Resoomer', description: 'Online automatic text summarizer', logo: 'https://resoomer.com/favicon.ico', category: 'AI Summarization', link: 'https://resoomer.com/' },
        { name: 'Genei', description: 'AI research summarization', logo: 'https://www.genei.io/favicon.ico', category: 'AI Summarization', link: 'https://www.genei.io/' },
        { name: 'Summify', description: 'AI document summarization', logo: 'https://summify.io/favicon.ico', category: 'AI Summarization', link: 'https://summify.io/' },
        { name: 'Summarize.tech', description: 'YouTube video summarization', logo: 'https://www.summarize.tech/favicon.ico', category: 'AI Summarization', link: 'https://www.summarize.tech/' },
        { name: 'Summate', description: 'AI-powered text summarization', logo: 'https://summate.it/favicon.ico', category: 'AI Summarization', link: 'https://summate.it/' }
    ],
    'ai-video-editors': [
        { name: 'Runway', description: 'AI-powered video editing', logo: 'https://runwayml.com/favicon.ico', category: 'Video Editing', link: 'https://runwayml.com/' },
        { name: 'Descript', description: 'All-in-one video editing', logo: 'https://www.descript.com/favicon.ico', category: 'Video Editing', link: 'https://www.descript.com/' },
        { name: 'Pictory', description: 'Video creation from text', logo: 'https://pictory.ai/favicon.ico', category: 'Video Editing', link: 'https://pictory.ai/' },
        { name: 'Synthesia', description: 'AI video generation', logo: 'https://www.synthesia.io/favicon.ico', category: 'Video Editing', link: 'https://www.synthesia.io/' },
        { name: 'Fliki', description: 'Turn text into videos with AI', logo: 'https://fliki.ai/favicon.ico', category: 'Video Editing', link: 'https://fliki.ai/' },
        { name: 'Kapwing', description: 'Online video editor with AI', logo: 'https://www.kapwing.com/favicon.ico', category: 'Video Editing', link: 'https://www.kapwing.com/' },
        { name: 'InVideo', description: 'Online video creation platform', logo: 'https://invideo.io/favicon.ico', category: 'Video Editing', link: 'https://invideo.io/' },
        { name: 'Elai', description: 'AI video generation platform', logo: 'https://elai.io/favicon.ico', category: 'Video Editing', link: 'https://elai.io/' },
        { name: 'Opus Clip', description: 'AI video clip generator', logo: 'https://www.opus.pro/favicon.ico', category: 'Video Editing', link: 'https://www.opus.pro/' },
        { name: 'Topaz Video AI', description: 'Video enhancement with AI', logo: 'https://www.topazlabs.com/favicon.ico', category: 'Video Editing', link: 'https://www.topazlabs.com/topaz-video-ai' }
    ],
    'ai-language-learning': [
        { name: 'Duolingo', description: 'AI-powered language learning', logo: 'https://www.duolingo.com/favicon.ico', category: 'Language Learning', link: 'https://www.duolingo.com/' },
        { name: 'Babbel', description: 'Language learning with AI assistance', logo: 'https://www.babbel.com/favicon.ico', category: 'Language Learning', link: 'https://www.babbel.com/' },
        { name: 'Rosetta Stone', description: 'Immersive language learning', logo: 'https://www.rosettastone.com/favicon.ico', category: 'Language Learning', link: 'https://www.rosettastone.com/' },
        { name: 'Lingvist', description: 'AI-powered vocabulary learning', logo: 'https://lingvist.com/favicon.ico', category: 'Language Learning', link: 'https://lingvist.com/' },
        { name: 'Memrise', description: 'Language learning with videos', logo: 'https://www.memrise.com/favicon.ico', category: 'Language Learning', link: 'https://www.memrise.com/' },
        { name: 'Busuu', description: 'Social language learning', logo: 'https://www.busuu.com/favicon.ico', category: 'Language Learning', link: 'https://www.busuu.com/' },
        { name: 'HelloTalk', description: 'Language exchange with natives', logo: 'https://www.hellotalk.com/favicon.ico', category: 'Language Learning', link: 'https://www.hellotalk.com/' },
        { name: 'Tandem', description: 'Language exchange community', logo: 'https://www.tandem.net/favicon.ico', category: 'Language Learning', link: 'https://www.tandem.net/' },
        { name: 'Speechling', description: 'AI pronunciation feedback', logo: 'https://speechling.com/favicon.ico', category: 'Language Learning', link: 'https://speechling.com/' },
        { name: 'Pimsleur', description: 'Audio-based language learning', logo: 'https://www.pimsleur.com/favicon.ico', category: 'Language Learning', link: 'https://www.pimsleur.com/' }
    ],
    'ai-fitness': [
        { name: 'Future', description: 'Personal training with AI coaching', logo: 'https://www.future.co/favicon.ico', category: 'AI Fitness', link: 'https://www.future.co/' },
        { name: 'Fitbod', description: 'AI workout planning', logo: 'https://www.fitbod.me/favicon.ico', category: 'AI Fitness', link: 'https://www.fitbod.me/' },
        { name: 'Aaptiv', description: 'Audio-based fitness coaching', logo: 'https://aaptiv.com/favicon.ico', category: 'AI Fitness', link: 'https://aaptiv.com/' },
        { name: 'Freeletics', description: 'AI personal trainer', logo: 'https://www.freeletics.com/favicon.ico', category: 'AI Fitness', link: 'https://www.freeletics.com/' },
        { name: 'Tonal', description: 'Smart home gym with AI', logo: 'https://www.tonal.com/favicon.ico', category: 'AI Fitness', link: 'https://www.tonal.com/' },
        { name: 'Mirror', description: 'Interactive home fitness system', logo: 'https://www.mirror.co/favicon.ico', category: 'AI Fitness', link: 'https://www.mirror.co/' },
        { name: 'Tempo', description: 'AI-powered home gym', logo: 'https://tempo.fit/favicon.ico', category: 'AI Fitness', link: 'https://tempo.fit/' },
        { name: 'FitnessAI', description: 'AI workout planner', logo: 'https://www.fitnessai.com/favicon.ico', category: 'AI Fitness', link: 'https://www.fitnessai.com/' },
        { name: 'Whoop', description: 'AI fitness and recovery tracking', logo: 'https://www.whoop.com/favicon.ico', category: 'AI Fitness', link: 'https://www.whoop.com/' },
        { name: 'Oura Ring', description: 'AI sleep and activity tracking', logo: 'https://ouraring.com/favicon.ico', category: 'AI Fitness', link: 'https://ouraring.com/' }
    ],
    'ai-gaming': [
        { name: 'AI Dungeon', description: 'AI-generated text adventure game', logo: 'https://play.aidungeon.io/favicon.ico', category: 'AI Gaming', link: 'https://play.aidungeon.io/' },
        { name: 'NVIDIA GameGAN', description: 'AI game generation technology', logo: 'https://www.nvidia.com/favicon.ico', category: 'AI Gaming', link: 'https://www.nvidia.com/en-us/research/ai-playground/' },
        { name: 'Chess.com', description: 'AI chess opponents', logo: 'https://www.chess.com/favicon.ico', category: 'AI Gaming', link: 'https://www.chess.com/' },
        { name: 'Replika', description: 'AI companion and chat game', logo: 'https://replika.ai/favicon.ico', category: 'AI Gaming', link: 'https://replika.ai/' },
        { name: 'Latitude', description: 'AI-powered game creation', logo: 'https://latitude.io/favicon.ico', category: 'AI Gaming', link: 'https://latitude.io/' },
        { name: 'Scenario', description: 'AI-generated game assets', logo: 'https://www.scenario.com/favicon.ico', category: 'AI Gaming', link: 'https://www.scenario.com/' },
        { name: 'Inworld AI', description: 'AI characters for games', logo: 'https://inworld.ai/favicon.ico', category: 'AI Gaming', link: 'https://inworld.ai/' },
        { name: 'Charisma.ai', description: 'Interactive AI characters', logo: 'https://charisma.ai/favicon.ico', category: 'AI Gaming', link: 'https://charisma.ai/' },
        { name: 'Hidden Door', description: 'AI narrative game worlds', logo: 'https://www.hiddendoor.co/favicon.ico', category: 'AI Gaming', link: 'https://www.hiddendoor.co/' },
        { name: 'Convai', description: 'AI NPCs for games', logo: 'https://www.convai.com/favicon.ico', category: 'AI Gaming', link: 'https://www.convai.com/' }
    ],
    'ai-dating': [
        { name: 'Replika', description: 'AI companion and romantic partner', logo: 'https://replika.ai/favicon.ico', category: 'AI Dating', link: 'https://replika.ai/' },
        { name: 'Blush', description: 'AI dating coach', logo: 'https://blush.ai/favicon.ico', category: 'AI Dating', link: 'https://blush.ai/' },
        { name: 'Hinge', description: 'Dating app with AI matching', logo: 'https://hinge.co/favicon.ico', category: 'AI Dating', link: 'https://hinge.co/' },
        { name: 'eHarmony', description: 'AI matchmaking algorithm', logo: 'https://www.eharmony.com/favicon.ico', category: 'AI Dating', link: 'https://www.eharmony.com/' },
        { name: 'Match', description: 'Dating with AI recommendations', logo: 'https://match.com/favicon.ico', category: 'AI Dating', link: 'https://match.com/' },
        { name: 'OkCupid', description: 'AI-powered compatibility matching', logo: 'https://www.okcupid.com/favicon.ico', category: 'AI Dating', link: 'https://www.okcupid.com/' },
        { name: 'Bumble', description: 'Dating app with AI features', logo: 'https://bumble.com/favicon.ico', category: 'AI Dating', link: 'https://bumble.com/' },
        { name: 'Tinder', description: 'Dating app with AI matching', logo: 'https://tinder.com/favicon.ico', category: 'AI Dating', link: 'https://tinder.com/' },
        { name: 'Iris', description: 'AI matchmaking app', logo: 'https://www.iris.ai/favicon.ico', category: 'AI Dating', link: 'https://www.iris.ai/' },
        { name: 'Loveflutter', description: 'Personality-based dating with AI', logo: 'https://loveflutter.com/favicon.ico', category: 'AI Dating', link: 'https://loveflutter.com/' }
    ],
    'ai-cooking': [
        { name: 'Plant Jammer', description: 'AI-powered recipe creation', logo: 'https://www.plantjammer.com/favicon.ico', category: 'AI Cooking', link: 'https://www.plantjammer.com/' },
        { name: 'Whisk', description: 'AI meal planning and recipes', logo: 'https://whisk.com/favicon.ico', category: 'AI Cooking', link: 'https://whisk.com/' },
        { name: 'Chefling', description: 'AI kitchen assistant app', logo: 'https://www.chefling.net/favicon.ico', category: 'AI Cooking', link: 'https://www.chefling.net/' },
        { name: 'Cookpad', description: 'Recipe sharing with AI recommendations', logo: 'https://cookpad.com/favicon.ico', category: 'AI Cooking', link: 'https://cookpad.com/' },
        { name: 'Yummly', description: 'Personalized recipe recommendations', logo: 'https://www.yummly.com/favicon.ico', category: 'AI Cooking', link: 'https://www.yummly.com/' },
        { name: 'Innit', description: 'Smart cooking platform', logo: 'https://www.innit.com/favicon.ico', category: 'AI Cooking', link: 'https://www.innit.com/' },
        { name: 'SideChef', description: 'Step-by-step cooking app', logo: 'https://www.sidechef.com/favicon.ico', category: 'AI Cooking', link: 'https://www.sidechef.com/' },
        { name: 'Cooklist', description: 'Recipe app based on your groceries', logo: 'https://cooklist.com/favicon.ico', category: 'AI Cooking', link: 'https://cooklist.com/' },
        { name: 'Kitchenful', description: 'AI meal planning and grocery shopping', logo: 'https://www.kitchenful.com/favicon.ico', category: 'AI Cooking', link: 'https://www.kitchenful.com/' },
        { name: 'Foodpairing', description: 'AI flavor pairing suggestions', logo: 'https://www.foodpairing.com/favicon.ico', category: 'AI Cooking', link: 'https://www.foodpairing.com/' }
    ],
    'ats-resume-checkers': [
        { name: 'Jobscan', description: 'AI-powered ATS resume optimization tool', logo: 'https://www.jobscan.co/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.jobscan.co' },
        { name: 'Resume Worded', description: 'AI resume checker and LinkedIn optimizer', logo: 'https://resumeworded.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://resumeworded.com' },
        { name: 'Skillsyncer', description: 'ATS resume scanner and keyword optimizer', logo: 'https://skillsyncer.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://skillsyncer.com' },
        { name: 'TopResume', description: 'Professional resume review and ATS optimization', logo: 'https://www.topresume.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.topresume.com' },
        { name: 'VMock', description: 'AI resume review and career guidance platform', logo: 'https://www.vmock.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.vmock.com' },
        { name: 'RezScore', description: 'Free ATS resume checker and scorer', logo: 'https://www.rezscore.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.rezscore.com' },
        { name: 'Targeted Resume', description: 'ATS-friendly resume optimization tool', logo: 'https://www.targetedresume.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.targetedresume.com' },
        { name: 'Resume Checker', description: 'AI-powered resume analysis and improvement', logo: 'https://www.resumechecker.net/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.resumechecker.net' },
        { name: 'Optimize Resume', description: 'ATS resume optimization and keyword matching', logo: 'https://www.optimizeresume.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.optimizeresume.com' },
        { name: 'Resume Matcher', description: 'AI tool to match resume with job descriptions', logo: 'https://www.resumematcher.com/favicon.ico', category: 'ATS Resume Checkers', link: 'https://www.resumematcher.com' }
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
    
    // Show tools section
    toolsSection.style.display = 'block';
    
    // Set title
    const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    toolsTitle.textContent = categoryName;
    
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
    
    // Create tool cards
    sortedTools.forEach(tool => {
        const toolCard = createToolCard(tool);
        toolsGrid.appendChild(toolCard);
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
    const toolsSection = document.getElementById('tools-display');
    const toolsTitle = document.getElementById('tools-title');
    const toolsGrid = document.getElementById('tools-grid');
    
    // Hide main content completely
    hideAllSections();
    
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
        'SEO Tools': 'fa-search-plus',
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
        'Video Editing': 'fa-cut',
        'Network Management': 'fa-network-wired',
        'Tracking': 'fa-chart-line',
        'Recruitment': 'fa-user-plus',
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
        'ATS Optimization': 'fa-search-plus'
    };
    return iconMap[category] || 'fa-project-diagram';
}

// Create tool card element with fallback for broken images
function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    const fallbackIcon = getFallbackIcon(tool.category);
    
    card.innerHTML = `
        <div class="tool-header">
            <div class="tool-logo">
                <img src="${tool.logo}" alt="${tool.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <i class="fas ${fallbackIcon}" style="display: none;"></i>
            </div>
            <div class="tool-info">
                <h3>${tool.name}</h3>
                <p>${tool.category}</p>
            </div>
        </div>
        <p class="tool-description">${tool.description}</p>
        <div class="tool-actions">
            <div class="tool-rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </div>
            <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <i class="fas fa-external-link-alt"></i>
                Visit Tool
            </a>
        </div>
    `;
    
    return card;
}

// Create workflow tool card - same format as AI tools
function createWorkflowToolCard(tool) {
    return createToolCard(tool);
}

// Go back to main view with history support
function goBack() {
    // Clear browser history by replacing current state
    history.replaceState(null, '', window.location.pathname);
    updateState({ page: 'home', section: currentState.section || 'ai-tools', category: null }, false);
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