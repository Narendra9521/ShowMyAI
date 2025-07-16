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
    'image-generators': [
        { name: 'DALL-E 2', description: 'Create realistic images from text descriptions', logo: 'https://openai.com/favicon.ico', category: 'Image Generation', link: 'https://openai.com/dall-e-2/' },
        { name: 'Midjourney', description: 'AI art generator creating stunning artwork', logo: 'https://www.midjourney.com/favicon.ico', category: 'Image Generation', link: 'https://www.midjourney.com' },
        { name: 'Stable Diffusion', description: 'Open-source text-to-image AI model', logo: 'https://stability.ai/favicon.ico', category: 'Image Generation', link: 'https://stability.ai' },
        { name: 'Adobe Firefly', description: 'Creative generative AI for images and text effects', logo: 'https://www.adobe.com/favicon.ico', category: 'Image Generation', link: 'https://firefly.adobe.com' },
        { name: 'Canva AI', description: 'AI-powered design and image generation', logo: 'https://www.canva.com/favicon.ico', category: 'Image Generation', link: 'https://www.canva.com' },
        { name: 'Leonardo AI', description: 'AI art generator for creative projects', logo: 'https://leonardo.ai/favicon.ico', category: 'Image Generation', link: 'https://leonardo.ai' },
        { name: 'Artbreeder', description: 'Collaborative AI art creation platform', logo: 'https://www.artbreeder.com/favicon.ico', category: 'Image Generation', link: 'https://www.artbreeder.com' },
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
        'Content Moderation': 'fa-shield',
        'Logistics': 'fa-truck',
        'Inventory': 'fa-boxes',
        'Agriculture': 'fa-seedling',
        'Survey Tools': 'fa-poll',
        'Meeting Tools': 'fa-video',
        'API Tools': 'fa-plug',
        'Resume Builders': 'fa-file-alt',
        'ATS Resume Checkers': 'fa-search-plus',
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
    return iconMap[category] || 'fa-robot';
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