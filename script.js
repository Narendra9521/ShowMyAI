// Initialize Lucide icons
lucide.createIcons({
    attrs: {
        stroke: 'currentColor',
        'stroke-width': '1.5'
    }
});

// Function to toggle tool page mode
function setToolPageMode(active) {
    if (active) {
        document.body.classList.add('tool-page-active');
    } else {
        document.body.classList.remove('tool-page-active');
    }
}

// Function to get tool descriptions
function getToolDescription(toolId) {
    const descriptions = {
        'code-gen': 'AI-powered code generation and programming assistance tools',
        'video': 'Create and edit videos with AI-powered generation tools',
        'graphic': 'Design graphics, logos, and visual content with AI assistance',
        'resume': 'Build professional resumes with AI-powered templates and suggestions',
        'presentation': 'Create stunning presentations and slide decks automatically',
        'automation': 'Automate workflows and repetitive tasks with smart tools',
        'code': 'Debug, optimize, and improve your code with AI assistance',
        'pdf-tools': 'Convert, edit, and manipulate PDF documents easily',
        'voice-gen': 'Generate realistic voices and speech from text',
        'seo': 'Optimize your website for search engines and improve rankings',
        'chatbot': 'Interact with advanced AI chatbots and conversational AI',
        'marketing': 'Boost your marketing efforts with AI-powered strategies',
        'logo': 'Design professional logos and brand identity elements',
        'jobs-applier': 'Streamline your job application process with smart tools',
        'ats-checker': 'Optimize your resume for Applicant Tracking Systems',
        'animation': 'Create animated videos and motion graphics',
        'speech-text': 'Convert speech to text with high accuracy',
        'ideas': 'Generate creative ideas and brainstorm solutions',
        'image-tools': 'Edit, enhance, and manipulate images with AI',
        'programming': 'Advanced programming tools and development assistance',
        'portfolio-builder': 'Build stunning portfolios to showcase your work',
        'jobs-finder': 'Find and discover job opportunities that match your skills',
        'sales': 'Enhance your sales process with AI-powered tools',
        'ml': 'Machine learning tools and platforms for data science',
        'prompt-gen': 'Generate and optimize prompts for AI interactions',
        'writing': 'Create compelling content with AI writing assistance',
        'translation': 'Translate text between languages accurately',
        'plagiarism': 'Check for plagiarism and ensure content originality',
        'research': 'Conduct research and gather information efficiently',
        'data-analytics': 'Analyze data and create insightful visualizations',
        'ad-creators': 'Create compelling advertisements and marketing materials',
        'images-to-video': 'Convert images into engaging video content',
        'video-editing': 'Edit and enhance videos with professional tools',
        'music-gen': 'Generate music and audio content with AI',
        '3d-gen': 'Create 3D models and graphics',
        'copywriting': 'Write persuasive copy and marketing content',
        'email-writer': 'Compose professional emails efficiently',
        'health-ai': 'AI-powered health and wellness tools',
        'finance-ai': 'Manage finances with intelligent AI assistance',
        'faceless-videos': 'Create videos without showing faces',
        'ai-avatars': 'Generate AI avatars and digital personas',
        'subtitles': 'Add subtitles and captions to videos automatically',
        'watermark-remover': 'Remove watermarks from images and videos',
        'hairstyle': 'Try different hairstyles with AI visualization',
        'task-management': 'Organize and manage tasks efficiently',
        'note-taking': 'Take and organize notes with smart features',
        'vpn': 'Secure your internet connection and privacy',
        'antivirus': 'Protect your devices from malware and threats',
        'cloud-storage': 'Store and sync files in the cloud',
        'game-dev': 'Develop games with powerful development tools',
        'meme-generators': 'Create funny memes and viral content',
        'web-hosting': 'Host websites and web applications',
        'noise-remover': 'Remove background noise from audio recordings'
    };
    return descriptions[toolId] || 'Discover powerful AI tools for enhanced productivity';
}

// Function to handle logo loading errors
function handleLogoError(img) {
    img.onerror = null;
    
    // Try default logo first
    if (!img.src.includes('assets/default-logo.png')) {
        img.src = 'assets/default-logo.png';
        return;
    }
    
    // If default logo also fails, create a fallback with colored background
    const name = img.alt || 'Logo';
    const initial = name.charAt(0).toUpperCase();
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'];
    const colorIndex = initial.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex].replace('#', '');
    
    img.src = `https://via.placeholder.com/32/${bgColor}/ffffff?text=${initial}`;
    img.classList.add('fallback-logo');
    img.style.borderRadius = '4px';
}

// Function to apply error handling to all website logos
function applyLogoErrorHandling() {
    document.querySelectorAll('.website-logo').forEach(img => {
        if (!img.hasAttribute('data-error-handled')) {
            img.setAttribute('data-error-handled', 'true');
            img.setAttribute('loading', 'lazy');
            img.onerror = function() {
                handleLogoError(this);
            };
            // Check if image is already broken
            if (img.complete && img.naturalWidth === 0) {
                handleLogoError(img);
            }
        }
    });
    
    // Re-initialize Lucide icons
    lucide.createIcons();
}

// Function to implement swipe gesture navigation for mobile devices
function implementSwipeNavigation() {
    // We'll implement this inside the DOMContentLoaded event handler
    // where we have access to the tabs variable and switchToTab function
}

// Function to update the sliding underline position for the active tab
function updateTabIndicator() {
    // No need for additional JavaScript since we're using CSS ::after pseudo-element
    // The underline is automatically positioned under the active tab
}

// Router function to handle URL paths
// Global variables for DOM elements
let mainContent;
let toolPage;
let toolsGrid;
let workflowsGrid;
let lastScrollPosition = 0;

// Store separate scroll positions for each tab
let tabScrollPositions = {
    tools: 0,
    workflows: 0
};

function router() {
    // Make sure DOM elements are initialized
    if (!mainContent) mainContent = document.querySelector('.main-content');
    if (!toolPage) toolPage = document.getElementById('toolPage');
    if (!toolsGrid) toolsGrid = document.getElementById('toolsGrid');
    if (!workflowsGrid) workflowsGrid = document.getElementById('workflowsGrid');
    
    // If elements aren't available yet, return
    if (!mainContent || !toolPage) return;
    
    const path = window.location.pathname;
    
    // Home path
    if (path === '/' || path === '/index.html') {
        if (!toolPage.classList.contains('hidden')) {
            toolPage.classList.add('hidden');
            mainContent.style.display = 'block';
            mainContent.classList.remove('hidden');
            
            // Set tool page mode to inactive to show the footer and allow background scrolling
            setToolPageMode(false);
            
            // Re-render the tools grid to ensure content is displayed
            renderTools('');
        }
        return;
    }
    
    // Tool paths (e.g., /tools/image-generators)
    if (path.startsWith('/tools/')) {
        const toolId = path.split('/tools/')[1];
        if (toolId) {
            showToolPage(toolId, false); // false means don't push state again
            return;
        }
    }
    
    // Workflow paths (e.g., /workflows/youtube-video)
    if (path.startsWith('/workflows/')) {
        const workflowId = path.split('/workflows/')[1];
        if (workflowId) {
            showWorkflowPage(workflowId, false); // false means don't push state again
            return;
        }
    }
    
    // If we get here, the path is unknown - show home
    if (!toolPage.classList.contains('hidden')) {
        toolPage.classList.add('hidden');
        mainContent.style.display = 'block';
        mainContent.classList.remove('hidden');
        
        // Set tool page mode to inactive to show the footer and allow background scrolling
        setToolPageMode(false);
        
        // Re-render the tools grid to ensure content is displayed
        renderTools('');
    }
}

// Debug function to show a temporary message
function showDebugMessage(message) {
    // Only show debug messages in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(message);
        
        // Create or get the debug element
        let debugEl = document.getElementById('swipe-debug');
        if (!debugEl) {
            debugEl = document.createElement('div');
            debugEl.id = 'swipe-debug';
            debugEl.style.position = 'fixed';
            debugEl.style.bottom = '10px';
            debugEl.style.left = '10px';
            debugEl.style.backgroundColor = 'rgba(0,0,0,0.7)';
            debugEl.style.color = 'white';
            debugEl.style.padding = '5px 10px';
            debugEl.style.borderRadius = '5px';
            debugEl.style.zIndex = '9999';
            debugEl.style.fontSize = '12px';
            document.body.appendChild(debugEl);
        }
        
        debugEl.textContent = message;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            debugEl.textContent = '';
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize tab scroll positions
    tabScrollPositions = {
        tools: 0,
        workflows: 0
    };
    
    // Apply error handling to all website logos
    applyLogoErrorHandling();
    
    // Implement swipe gesture navigation for mobile devices
    // Variables to track touch positions
    let touchStartX = 0;
    let touchStartY = 0;
    
    // Add touch event listeners directly to the document for better capture
    document.addEventListener('touchstart', function(e) {
        // Only process on mobile devices
        if (window.innerWidth > 768) return;
        
        // Store the initial touch position (both X and Y)
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        showDebugMessage('Touch start: ' + touchStartX);
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        // Only process on mobile devices
        if (window.innerWidth > 768) return;
        
        // Get the final touch position
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        // Calculate the swipe distance
        const swipeDistance = touchEndX - touchStartX;
        const verticalDistance = Math.abs(touchEndY - touchStartY);
        showDebugMessage(`Touch end: ${touchEndX}, Swipe: ${swipeDistance}px, Vertical: ${verticalDistance}px`);
        
        // Only process significant horizontal swipes and ignore if vertical movement is significant
        // This prevents fast vertical scrolls from triggering tab switches
        if (Math.abs(swipeDistance) < 50 || verticalDistance > 50 || Math.abs(swipeDistance) < verticalDistance) {
            showDebugMessage('Swipe ignored: too small or vertical movement too large');
            return;
        }
        
        // Get the current active tab
        const currentTab = document.querySelector('.tab.active');
        if (!currentTab) return;
        
        const currentTabId = currentTab.getAttribute('data-tab');
        
        // Determine which tab to switch to based on swipe direction
        if (swipeDistance > 0) {
            // Swipe from left to right (switch to AI Tools)
            if (currentTabId === 'workflows') {
                showDebugMessage('Swipe right: Switching to AI Tools tab');
                switchToTab('tools');
            }
        } else {
            // Swipe from right to left (switch to Workflows)
            if (currentTabId === 'tools') {
                showDebugMessage('Swipe left: Switching to Workflows tab');
                switchToTab('workflows');
            }
        }
    }, { passive: true });
    
    // Check URL path on page load and show the correct section
    router();
    
    // Initialize the active tab with the underline
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        // Make sure the active tab has the correct styling
        activeTab.classList.add('active');
    }
    
    // Add click event listeners to tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showDebugMessage('Tab clicked: ' + tabName);
            switchToTab(tabName);
        });
    });
    
    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', (event) => {
        // If we're going back to the home page
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            if (mainContent) {
                mainContent.style.display = 'block';
                mainContent.classList.remove('hidden');
            }
            if (toolPage) {
                toolPage.classList.add('hidden');
            }
            
            // Show footer when returning to home page
            setToolPageMode(false);
            
            // Get the last active tab from session storage
            const lastActiveTabId = sessionStorage.getItem('lastActiveTab') || 'tools';
            
            // Make sure the correct tab is active
            const tabToActivate = document.querySelector(`.tab[data-tab="${lastActiveTabId}"]`);
            if (tabToActivate && !tabToActivate.classList.contains('active')) {
                // Remove active class from all tabs
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                // Add active class to the last active tab
                tabToActivate.classList.add('active');
                
                // Update tab content visibility
                const isTools = lastActiveTabId === 'tools';
                if (toolsGrid && workflowsGrid) {
                    toolsGrid.classList.toggle('hidden', !isTools);
                    workflowsGrid.classList.toggle('hidden', isTools);
                }
            }
            
            // Re-render the appropriate content based on active tab
            if (lastActiveTabId === 'tools') {
                renderTools('');
            } else if (lastActiveTabId === 'workflows') {
                renderWorkflows('');
            }
            
            // Restore the saved scroll position for the active tab
            console.log(`Popstate: Restoring ${lastActiveTabId} scroll position: ${tabScrollPositions[lastActiveTabId] || 0}px`);
            setTimeout(() => {
                window.scrollTo({
                    top: tabScrollPositions[lastActiveTabId] || 0,
                    behavior: 'auto'
                });
            }, 200);
        } else {
            // For other pages, use the router
            router();
        }
    });
    
    // Mobile Menu Toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenuButton = document.querySelector('.close-menu-button');
    
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        mobileMenuButton.setAttribute('aria-expanded', 
            mobileMenu.classList.contains('active'));
    }

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
        closeMenuButton.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });

        // Add menu item click handlers
        const menuItems = mobileMenu.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const href = item.getAttribute('href');
                if (href === '#') {
                    e.preventDefault();

                }
                // Close menu after clicking
                toggleMobileMenu();
            });
        });
    }

    // Data
    const toolsData = [
       
        { id: 'code-gen', icon: 'code', name: 'Code Generators', websites: [
            { name: 'Lovable', logo: 'https://lovable.dev/favicon.ico', url: 'https://lovable.dev', status: 'Free' },
            { name: 'Cursor', logo: 'https://cursor.sh/favicon.ico', url: 'https://cursor.sh', status: 'Free' },
            { name: 'GitHub Copilot', logo: 'https://github.com/favicon.ico', url: 'https://github.com/features/copilot', status: 'Free' },
            { name: 'Tabnine', logo: 'https://www.tabnine.com/favicon.ico', url: 'https://www.tabnine.com', status: 'Free' },
            { name: 'Codeium', logo: 'https://codeium.com/favicon.ico', url: 'https://codeium.com', status: 'Free' },
            { name: 'Amazon CodeWhisperer', logo: 'https://aws.amazon.com/favicon.ico', url: 'https://aws.amazon.com/codewhisperer', status: 'Premium' },
            { name: 'Codex', logo: 'https://openai.com/favicon.ico', url: 'https://openai.com/research/codex', status: 'Free' }           
        ], workflows: ['website-builder']},
       
       
        
        { id: 'video', icon: 'video', name: 'Video Generators', websites: [
            { name: 'Pandorra AI', logo: 'https://pandorra.ai/favicon.ico', url: 'https://pandorra.ai', status: 'Free' },
            { name: 'Pika Labs', logo: 'https://pika.art/favicon.ico', url: 'https://pika.art', status: 'Free' },
            { name: 'InVideo', logo: 'https://ai.invideo.io/favicon.ico', url: 'https://ai.invideo.io', status: 'Free' },
            { name: 'Kapwing', logo: 'https://www.kapwing.com/favicon.ico', url: 'https://www.kapwing.com', status: 'Free' },
            { name: 'FlexClip', logo: 'https://www.flexclip.com/favicon.ico', url: 'https://www.flexclip.com', status: 'Free' },
            { name: 'HeyGen', logo: 'https://www.heygen.com/favicon.ico', url: 'https://www.heygen.com', status: 'Free' }
        ]},
         { id: 'graphic', icon: 'palette', name: 'Graphic Design', websites: [
            { name: 'Canva', logo: 'https://www.canva.com/favicon.ico', url: 'https://www.canva.com', status: 'Free' },
            { name: 'Adobe Express', logo: 'https://www.adobe.com/favicon.ico', url: 'https://www.adobe.com/express', status: 'Free' },
            { name: 'Adobe Creative Cloud', logo: 'https://www.adobe.com/favicon.ico', url: 'https://www.adobe.com/creativecloud', status: 'Premium' },
            { name: 'Visme', logo: 'https://www.visme.co/favicon.ico', url: 'https://www.visme.co', status: 'Free' },
            { name: 'Stencil', logo: 'https://getstencil.com/favicon.ico', url: 'https://getstencil.com', status: 'Free' }
        ]}, 
       
        { id: 'resume', icon: 'file-text', name: 'Resume Generators', websites: [
            
            { name: 'OverLeaf', logo: 'https://overleaf.com/favicon.ico', url: 'https://overleaf.com', status: 'Free' },
            { name: 'EnhanCV', logo: 'https://enhancv.com/favicon.ico', url: 'https://enhancv.com', status: 'Free' },
            { name: 'Zety', logo: 'https://zety.com/favicon.ico', url: 'https://zety.com', status: 'Free' },
            { name: 'ResumeGenius', logo: 'https://resumegenius.com/favicon.ico', url: 'https://resumegenius.com', status: 'Free' },
            { name: 'Kickresume', logo: 'https://www.kickresume.com/favicon.ico', url: 'https://www.kickresume.com', status: 'Premium' },
            { name: 'Novoresume', logo: 'https://novoresume.com/favicon.ico', url: 'https://novoresume.com', status: 'Freemium' },
            { name: 'VisualCV', logo: 'https://www.visualcv.com/favicon.ico', url: 'https://www.visualcv.com', status: 'Free' },
            { name: 'LiveCareer', logo: 'https://www.livecareer.com/favicon.ico', url: 'https://www.livecareer.com', status: 'Free' },
            { name: 'MyPerfectResume', logo: 'https://www.myperfectresume.com/favicon.ico', url: 'https://www.myperfectresume.com', status: 'Free' }
        ]},

         { id: 'presentation', icon: 'presentation', name: 'PPT Generators', websites: [
            { name: 'Tome', logo: 'https://tome.app/favicon.ico', url: 'https://tome.app', status: 'Free' },
            { name: 'Beautiful.ai', logo: 'https://www.beautiful.ai/favicon.ico', url: 'https://www.beautiful.ai', status: 'Free' },
            { name: 'SlidesAI', logo: 'https://slidesai.io/favicon.ico', url: 'https://slidesai.io', status: 'Freemium' },
            { name: 'Visme', logo: 'https://www.visme.co/favicon.ico', url: 'https://www.visme.co', status: 'Free' },
            { name: 'Canva', logo: 'https://www.canva.com/favicon.ico', url: 'https://www.canva.com', status: 'Free' },
            { name: 'Prezi', logo: 'https://prezi.com/favicon.ico', url: 'https://prezi.com', status: 'Free' },
            { name: 'Pitch', logo: 'https://pitch.com/favicon.ico', url: 'https://pitch.com', status: 'Free' },
        ]},

         
        { id: 'automation', icon: 'zap', name: 'Automation', websites: [
            { name: 'Make', logo: 'https://www.make.com/favicon.ico', url: 'https://www.make.com', status: 'Free' },
            { name: 'IFTTT', logo: 'https://ifttt.com/favicon.ico', url: 'https://ifttt.com', status: 'Free' },
            { name: 'Integromat', logo: 'https://www.integromat.com/favicon.ico', url: 'https://www.integromat.com', status: 'Freemium' },
            { name: 'n8n', logo: 'https://n8n.io/favicon.ico', url: 'https://n8n.io', status: 'Free' },
            { name: 'Pipedream', logo: 'https://pipedream.com/favicon.ico', url: 'https://pipedream.com', status: 'Free' },
            { name: 'Tray.io', logo: 'https://tray.io/favicon.ico', url: 'https://tray.io', status: 'Free' },
            { name: 'Workato', logo: 'https://www.workato.com/favicon.ico', url: 'https://www.workato.com', status: 'Free' },
            { name: 'Microsoft Power Automate', logo: 'https://flow.microsoft.com/favicon.ico', url: 'https://flow.microsoft.com', status: 'Free' },
            { name: 'Zapier', logo: 'https://zapier.com/favicon.ico', url: 'https://zapier.com', status: 'Free' }
        ]},
      
       
      
        { id: 'code', icon: 'code', name: 'Code Debugging', websites: [
            { name: 'Codeium', logo: 'https://codeium.com/favicon.ico', url: 'https://codeium.com', status: 'Free' },
            { name: 'Amazon CodeWhisperer', logo: 'https://aws.amazon.com/favicon.ico', url: 'https://aws.amazon.com/codewhisperer', status: 'Free' },
            { name: 'GitHub Copilot', logo: 'https://github.com/favicon.ico', url: 'https://github.com/features/copilot', status: 'Premium' },
            { name: 'Cursor', logo: 'https://cursor.sh/favicon.ico', url: 'https://cursor.sh', status: 'Freemium' },
            { name: 'Visual Studio Code', logo: 'https://code.visualstudio.com/favicon.ico', url: 'https://code.visualstudio.com', status: 'Free' },
            { name: 'ESLint', logo: 'https://eslint.org/favicon.ico', url: 'https://eslint.org', status: 'Free' },
            { name: 'Sourcegraph', logo: 'https://sourcegraph.com/favicon.ico', url: 'https://sourcegraph.com', status: 'Free' },
            { name: 'CodeSandbox', logo: 'https://codesandbox.io/favicon.ico', url: 'https://codesandbox.io', status: 'Free' }
        ]},
       
        {
            id: 'pdf-tools',
            icon: 'file-text', 
            name: 'PDF Tools',
            websites: [
                { name: 'PDFescape', logo: 'https://www.pdfescape.com/favicon.ico', url: 'https://www.pdfescape.com', status: 'Free' },
                { name: 'SmallPDF', logo: 'https://smallpdf.com/favicon.ico', url: 'https://smallpdf.com', status: 'Free' },
                { name: 'iLovePDF', logo: 'https://www.ilovepdf.com/favicon.ico', url: 'https://www.ilovepdf.com', status: 'Free' },
                { name: 'PDF24', logo: 'https://tools.pdf24.org/favicon.ico', url: 'https://tools.pdf24.org', status: 'Free' },
                { name: 'PDF2Go', logo: 'https://www.pdf2go.com/favicon.ico', url: 'https://www.pdf2go.com', status: 'Free' },
                { name: 'PDF Converter', logo: 'https://www.freepdfconvert.com/favicon.ico', url: 'https://www.freepdfconvert.com', status: 'Free' },
                { name: 'PDF to Image', logo: 'https://www.pdftoimage.net/favicon.ico', url: 'https://www.pdftoimage.net', status: 'Free' },
                { name: 'PDF to Word', logo: 'https://www.pdftoimage.net/favicon.ico', url: 'https://www.pdftoimage.net', status: 'Free' },
                { name: 'PDF to Excel', logo: 'https://www.pdftoimage.net/favicon.ico', url: 'https://www.pdftoimage.net', status: 'Free' },
                { name: 'PDF to PowerPoint', logo: 'https://www.pdftoimage.net/favicon.ico', url: 'https://www.pdftoimage.net', status: 'Free' }
                
            ]
        },

          { id: 'voice-gen', icon: 'mic', name: 'Voice Generation', websites: [
           
            { name: 'ElevenLabs', logo: 'https://elevenlabs.io/favicon.ico', url: 'https://elevenlabs.io', status: 'Premium' },
            { name: 'Play.ht', logo: 'https://play.ht/favicon.ico', url: 'https://play.ht', status: 'Freemium' },
            { name: 'Speechify', logo: 'https://speechify.com/favicon.ico', url: 'https://speechify.com', status: 'Free' },
            { name: 'NaturalReader', logo: 'https://www.naturalreaders.com/favicon.ico', url: 'https://www.naturalreaders.com', status: 'Free' },
            { name: 'Voice.ai', logo: 'https://voice.ai/favicon.ico', url: 'https://voice.ai', status: 'Free' },
            { name: 'Coqui', logo: 'https://coqui.ai/favicon.ico', url: 'https://coqui.ai', status: 'Free' }
        ]},

        { id: 'seo', icon: 'search', name: 'SEO Tools', websites: [
          
            { name: 'SEMrush', logo: 'https://www.semrush.com/favicon.ico', url: 'https://www.semrush.com', status: 'Free' },
            { name: 'Ahrefs', logo: 'https://ahrefs.com/favicon.ico', url: 'https://ahrefs.com', status: 'Premium' },
            { name: 'Moz', logo: 'https://moz.com/favicon.ico', url: 'https://moz.com', status: 'Freemium' },
            { name: 'Ubersuggest', logo: 'https://neilpatel.com/favicon.ico', url: 'https://neilpatel.com/ubersuggest', status: 'Free' },
            { name: 'Screaming Frog', logo: 'https://www.screamingfrog.co.uk/favicon.ico', url: 'https://www.screamingfrog.co.uk', status: 'Free' },
            { name: 'Majestic', logo: 'https://majestic.com/favicon.ico', url: 'https://majestic.com', status: 'Free' },
            { name: 'SpyFu', logo: 'https://www.spyfu.com/favicon.ico', url: 'https://www.spyfu.com', status: 'Free' },
            { name: 'Serpstat', logo: 'https://serpstat.com/favicon.ico', url: 'https://serpstat.com', status: 'Free' },
            { name: 'Rank Math', logo: 'https://rankmath.com/favicon.ico', url: 'https://rankmath.com', status: 'Free' },
            { name: 'Yoast SEO', logo: 'https://yoast.com/favicon.ico', url: 'https://yoast.com', status: 'Free' }
        ]},
       

        { id: 'chatbot', icon: 'message-square-text', name: 'AI Chatbots', websites: [
            { name: 'ChatGPT', logo: 'https://openai.com/favicon.ico', url: 'https://chat.openai.com', status: 'Free' },
            { name: 'Claude', logo: 'https://claude.ai/favicon.ico', url: 'https://claude.ai', status: 'Free' },
            { name: 'Character.AI', logo: 'https://character.ai/favicon.ico', url: 'https://character.ai', status: 'Premium' },
            { name: 'Perplexity', logo: 'https://www.perplexity.ai/favicon.ico', url: 'https://www.perplexity.ai', status: 'Free' },
            { name: 'HuggingChat', logo: 'https://huggingface.co/favicon.ico', url: 'https://huggingface.co/chat', status: 'Free' },
            { name: 'DeepSeek', logo: 'https://www.deepseek.com/favicon.ico', url: 'https://www.deepseek.com', status: 'Free' },
            { name: 'Anthropic', logo: 'https://www.anthropic.com/favicon.ico', url: 'https://www.anthropic.com', status: 'Free' }
        ]},

         { id: 'marketing', icon: 'bar-chart', name: 'Marketing', websites: [
            { name: 'Hootsuite', logo: 'https://hootsuite.com/favicon.ico', url: 'https://hootsuite.com', status: 'Free' },
            { name: 'Buffer', logo: 'https://buffer.com/favicon.ico', url: 'https://buffer.com', status: 'Free' },
            { name: 'Sprout Social', logo: 'https://sproutsocial.com/favicon.ico', url: 'https://sproutsocial.com', status: 'Free' },
            { name: 'Later', logo: 'https://later.com/favicon.ico', url: 'https://later.com', status: 'Premium' },
            { name: 'SocialPilot', logo: 'https://www.socialpilot.co/favicon.ico', url: 'https://www.socialpilot.co', status: 'Free' },
            { name: 'Sendible', logo: 'https://www.sendible.com/favicon.ico', url: 'https://www.sendible.com', status: 'Free' },
            { name: 'Agorapulse', logo: 'https://www.agorapulse.com/favicon.ico', url: 'https://www.agorapulse.com', status: 'Free' },
            { name: 'Tailwind', logo: 'https://www.tailwindapp.com/favicon.ico', url: 'https://www.tailwindapp.com', status: 'Free' }
        ]},
        { id: 'logo', icon: 'image', name: 'Logo Generators', websites: [
            { name: 'Looka', logo: 'https://looka.com/favicon.ico', url: 'https://looka.com', status: 'Free' },
            { name: 'Canva', logo: 'https://www.canva.com/favicon.ico', url: 'https://www.canva.com', status: 'Free' },
            { name: 'BrandCrowd', logo: 'https://www.brandcrowd.com/favicon.ico', url: 'https://www.brandcrowd.com', status: 'Free' },
            { name: 'LogoMaker', logo: 'https://www.logomaker.com/favicon.ico', url: 'https://www.logomaker.com', status: 'Free' },
            { name: 'FreeLogoDesign', logo: 'https://www.freelogodesign.org/favicon.ico', url: 'https://www.freelogodesign.org', status: 'Free' }
        ]},
         { id: 'jobs-applier', icon: 'send', name: 'Jobs Applier', websites: [
            { name: 'Ladders', logo: 'https://www.theladders.com/favicon.ico', url: 'https://www.theladders.com', status: 'Free' },
            { name: 'ResumeWorded', logo: 'https://resumeworded.com/favicon.ico', url: 'https://resumeworded.com', status: 'Free' },
            { name: 'VisualCV', logo: 'https://www.visualcv.com/favicon.ico', url: 'https://www.visualcv.com', status: 'Free' },
            { name: 'ResumeGenius', logo: 'https://resumegenius.com/favicon.ico', url: 'https://resumegenius.com', status: 'Free' },
            { name: 'Kickresume', logo: 'https://www.kickresume.com/favicon.ico', url: 'https://www.kickresume.com', status: 'Free' },
            { name: 'Novoresume', logo: 'https://novoresume.com/favicon.ico', url: 'https://novoresume.com', status: 'Free' },
            { name: 'EnhanCV', logo: 'https://enhancv.com/favicon.ico', url: 'https://enhancv.com', status: 'Free' }
        ]},
     
          { id: 'ats-checker', icon: 'check-circle', name: 'ATS Resume Checker', websites: [
            { name: 'Resume Worded', logo: 'https://resumeworded.com/favicon.ico', url: 'https://resumeworded.com', status: 'Free' },
            { name: 'Vmock', logo: 'https://www.vmock.com/favicon.ico', url: 'https://www.vmock.com', status: 'Free' }
        ]},
      
       
       
        
        { id: 'animation', icon: 'film', name: 'Animation Video', websites: [
            { name: 'Veed.io', logo: 'https://www.veed.io/favicon.ico', url: 'https://www.veed.io', status: 'Free' },
            { name: 'HeyGen', logo: 'https://www.heygen.com/favicon.ico', url: 'https://www.heygen.com', status: 'Free' },
            { name: 'Synthesys', logo: 'https://synthesys.io/favicon.ico', url: 'https://synthesys.io', status: 'Free' }
           
        ]},
        { id: 'speech-text', icon: 'mic', name: 'Speech to Text', websites: [
            { name: 'Otter.ai', logo: 'https://otter.ai/favicon.ico', url: 'https://otter.ai', status: 'Free' },
            { name: 'Sonix', logo: 'https://sonix.ai/favicon.ico', url: 'https://sonix.ai', status: 'Free' },
            { name: 'Rev', logo: 'https://www.rev.com/favicon.ico', url: 'https://www.rev.com', status: 'Premium' },
            { name: 'Speechnotes', logo: 'https://speechnotes.co/favicon.ico', url: 'https://speechnotes.co', status: 'Free' },
            { name: 'SpeechTexter', logo: 'https://www.speechtexter.com/favicon.ico', url: 'https://www.speechtexter.com', status: 'Free' }
        ]},
       
        { id: 'ideas', icon: 'lightbulb', name: 'Ideas', websites: [
            { name: 'Claude', logo: 'https://claude.ai/favicon.ico', url: 'https://claude.ai', status: 'Free' },
            { name: 'Character.AI', logo: 'https://character.ai/favicon.ico', url: 'https://character.ai', status: 'Premium' },
            { name: 'Perplexity', logo: 'https://www.perplexity.ai/favicon.ico', url: 'https://www.perplexity.ai', status: 'Free' },
            { name: 'HuggingChat', logo: 'https://huggingface.co/favicon.ico', url: 'https://huggingface.co/chat', status: 'Free' },
            { name: 'DeepSeek', logo: 'https://www.deepseek.com/favicon.ico', url: 'https://www.deepseek.com', status: 'Free' }
        ]},
        {
            id: 'image-tools',
            icon: 'image',
            name: 'Image Tools',
            websites: [
                { name: 'Canva', logo: 'https://www.canva.com/favicon.ico', url: 'https://www.canva.com', status: 'Free' },
                { name: 'Fotor', logo: 'https://www.fotor.com/favicon.ico', url: 'https://www.fotor.com', status: 'Free' },
                { name: 'Pixlr', logo: 'https://pixlr.com/favicon.ico', url: 'https://pixlr.com', status: 'Free' },
                { name: 'Remove.bg', logo: 'https://www.remove.bg/favicon.ico', url: 'https://www.remove.bg', status: 'Free' },
                { name: 'Befunky', logo: 'https://www.befunky.com/favicon.ico', url: 'https://www.befunky.com', status: 'Free' },
                { name: 'Lunapic', logo: 'https://www.lunapic.com/favicon.ico', url: 'https://www.lunapic.com', status: 'Free' },
                { name: 'Kapwing', logo: 'https://www.kapwing.com/favicon.ico', url: 'https://www.kapwing.com', status: 'Free' },
                { name: 'Snapseed', logo: 'https://www.snapseed.com/favicon.ico', url: 'https://www.snapseed.com', status: 'Free' }            ]
        },
      
        { id: 'programming', icon: 'code', name: 'Programming', websites: [
            { name: 'GitHub Copilot', logo: 'https://github.com/favicon.ico', url: 'https://github.com/features/copilot', status: 'Free' },
            { name: 'Tabnine', logo: 'https://www.tabnine.com/favicon.ico', url: 'https://www.tabnine.com', status: 'Free' },
            { name: 'Codeium', logo: 'https://codeium.com/favicon.ico', url: 'https://codeium.com', status: 'Free' },
            { name: 'Amazon CodeWhisperer', logo: 'https://aws.amazon.com/favicon.ico', url: 'https://aws.amazon.com/codewhisperer', status: 'Premium' },
            { name: 'Cursor', logo: 'https://cursor.sh/favicon.ico', url: 'https://cursor.sh', status: 'Freemium' },
            { name: 'Codex', logo: 'https://openai.com/favicon.ico', url: 'https://openai.com/research/codex', status: 'Free' },
            { name: 'Lovable', logo: 'https://lovable.ai/favicon.ico', url: 'https://lovable.ai', status: 'Free' }
        ]},
        { id: 'portfolio-builder', icon: 'briefcase', name: 'Portfolio Builder', websites: [
            { name: 'Wix', logo: 'https://www.wix.com/favicon.ico', url: 'https://www.wix.com', status: 'Freemium' },
            { name: 'Squarespace', logo: 'https://www.squarespace.com/favicon.ico', url: 'https://www.squarespace.com', status: 'Premium' },
            { name: 'Webflow', logo: 'https://webflow.com/favicon.ico', url: 'https://webflow.com', status: 'Freemium' },
            { name: 'WordPress', logo: 'https://wordpress.com/favicon.ico', url: 'https://wordpress.com', status: 'Free' },
            { name: 'Adobe Portfolio', logo: 'https://portfolio.adobe.com/favicon.ico', url: 'https://portfolio.adobe.com', status: 'Premium' },
            { name: 'Behance', logo: 'https://www.behance.net/favicon.ico', url: 'https://www.behance.net', status: 'Free' },
            { name: 'Dribbble', logo: 'https://dribbble.com/favicon.ico', url: 'https://dribbble.com', status: 'Freemium' },
            { name: 'Carbonmade', logo: 'https://carbonmade.com/favicon.ico', url: 'https://carbonmade.com', status: 'Freemium' },
            { name: 'Cargo', logo: 'https://cargo.site/favicon.ico', url: 'https://cargo.site', status: 'Premium' },
            { name: 'Format', logo: 'https://www.format.com/favicon.ico', url: 'https://www.format.com', status: 'Freemium' }
        ]},
         { id: 'jobs-finder', icon: 'briefcase', name: 'Jobs Finder', websites: [
           
            { name: 'Glassdoor', logo: 'https://www.glassdoor.com/favicon.ico', url: 'https://www.glassdoor.com', status: 'Free' },
            { name: 'Monster', logo: 'https://www.monster.com/favicon.ico', url: 'https://www.monster.com', status: 'Premium' },
            { name: 'ZipRecruiter', logo: 'https://www.ziprecruiter.com/favicon.ico', url: 'https://www.ziprecruiter.com', status: 'Freemium' },
            { name: 'FlexJobs', logo: 'https://www.flexjobs.com/favicon.ico', url: 'https://www.flexjobs.com', status: 'Free' },        
            { name: 'LinkedIn', logo: 'https://www.linkedin.com/favicon.ico', url: 'https://www.linkedin.com/jobs', status: 'Free' },
            { name: 'Indeed', logo: 'https://www.indeed.com/favicon.ico', url: 'https://www.indeed.com', status: 'Free' }      
        ]},
        { id: 'sales', icon: 'dollar-sign', name: 'Sales', websites: [
            { name: 'HubSpot', logo: 'https://www.hubspot.com/favicon.ico', url: 'https://www.hubspot.com', status: 'Free' },
            { name: 'Salesforce', logo: 'https://www.salesforce.com/favicon.ico', url: 'https://www.salesforce.com', status: 'Free' },
            { name: 'Pipedrive', logo: 'https://www.pipedrive.com/favicon.ico', url: 'https://www.pipedrive.com', status: 'Free' },
            { name: 'Zoho CRM', logo: 'https://www.zoho.com/favicon.ico', url: 'https://www.zoho.com/crm', status: 'Premium' },
            { name: 'Salesloft', logo: 'https://www.salesloft.com/favicon.ico', url: 'https://www.salesloft.com', status: 'Free' },
            { name: 'Outreach', logo: 'https://www.outreach.io/favicon.ico', url: 'https://www.outreach.io', status: 'Free' },
            { name: 'Gong', logo: 'https://www.gong.io/favicon.ico', url: 'https://www.gong.io', status: 'Free' }
        ]},
        { id: 'ml', icon: 'brain', name: 'Machine Learning', websites: [
            { name: 'Hugging Face', logo: 'https://huggingface.co/favicon.ico', url: 'https://huggingface.co', status: 'Free' },
            { name: 'Kaggle', logo: 'https://www.kaggle.com/favicon.ico', url: 'https://www.kaggle.com', status: 'Free' },
            { name: 'Google Colab', logo: 'https://colab.research.google.com/favicon.ico', url: 'https://colab.research.google.com', status: 'Free' },
            { name: 'Deepnote', logo: 'https://deepnote.com/favicon.ico', url: 'https://deepnote.com', status: 'Free' }
            
        ]},
          { id: 'prompt-gen', icon: 'message-square-text', name: 'Prompt Generation', websites: [
            { name: 'PromptPerfect', logo: 'https://promptperfect.jina.ai/favicon.ico', url: 'https://promptperfect.jina.ai', status: 'Free' },
            { name: 'PromptBox', logo: 'https://promptbox.ai/favicon.ico', url: 'https://promptbox.ai', status: 'Free' },
            { name: 'FlowGPT', logo: 'https://flowgpt.com/favicon.ico', url: 'https://flowgpt.com', status: 'Free' },
            { name: 'Learn Prompting', logo: 'https://learnprompting.org/favicon.ico', url: 'https://learnprompting.org', status: 'Free' }

        ]},
        { id: 'writing', icon: 'pen-tool', name: 'Content Creation', websites: [
            { name: 'Pandorra AI', logo: 'https://pandorra.ai/favicon.ico', url: 'https://pandorra.ai', status: 'Free' },
            { name: 'Compose AI', logo: 'https://www.compose.ai/favicon.ico', url: 'https://www.compose.ai', status: 'Free' },
            { name: 'Moonbeam', logo: 'https://www.gomoonbeam.com/favicon.ico', url: 'https://www.gomoonbeam.com', status: 'Free' },
            { name: 'Lex', logo: 'https://lex.page/favicon.ico', url: 'https://lex.page', status: 'Freemium' }
        ]},
        { id: 'translation', icon: 'languages', name: 'Translation Tools', websites: [
            { name: 'DeepL', logo: 'https://www.deepl.com/favicon.ico', url: 'https://www.deepl.com', status: 'Free' },
            { name: 'Google Translate', logo: 'https://translate.google.com/favicon.ico', url: 'https://translate.google.com', status: 'Free' },
            { name: 'Microsoft Translator', logo: 'https://www.microsoft.com/favicon.ico', url: 'https://www.microsoft.com/translator', status: 'Free' },
            { name: 'Linguee', logo: 'https://www.linguee.com/favicon.ico', url: 'https://www.linguee.com', status: 'Premium' },
            { name: 'Reverso', logo: 'https://www.reverso.net/favicon.ico', url: 'https://www.reverso.net', status: 'Freemium' }
        ]},
        { id: 'plagiarism', icon: 'file-check', name: 'Plagiarism Detection', websites: [
            { name: 'QuillBot', logo: 'https://quillbot.com/favicon.ico', url: 'https://quillbot.com', status: 'Free' },
            { name: 'Scribbr', logo: 'https://www.scribbr.com/favicon.ico', url: 'https://www.scribbr.com', status: 'Free' },
            { name: 'Turnitin', logo: 'https://www.turnitin.com/favicon.ico', url: 'https://www.turnitin.com', status: 'Premium' },
            { name: 'Copyscape', logo: 'https://www.copyscape.com/favicon.ico', url: 'https://www.copyscape.com', status: 'Freemium' }
        ]},
       
        { id: 'research', icon: 'search', name: 'Research Tools', websites: [
            { name: 'Connected Papers', logo: 'https://www.connectedpapers.com/favicon.ico', url: 'https://www.connectedpapers.com', status: 'Premium' },
            { name: 'Semantic Scholar', logo: 'https://www.semanticscholar.org/favicon.ico', url: 'https://www.semanticscholar.org', status: 'Freemium' }
        ]},
        { id: 'data-analytics', icon: 'bar-chart', name: 'Data Analytics', websites: [
            { name: 'Tableau Public', logo: 'https://public.tableau.com/favicon.ico', url: 'https://public.tableau.com', status: 'Free' },
            { name: 'Google Data Studio', logo: 'https://datastudio.google.com/favicon.ico', url: 'https://datastudio.google.com', status: 'Free' },
            { name: 'Power BI', logo: 'https://powerbi.microsoft.com/favicon.ico', url: 'https://powerbi.microsoft.com', status: 'Free' }        ]},
       
        { id: 'ad-creators', icon: 'megaphone', name: 'Ad Creators', websites: [ 
            { name: 'InVideo', logo: 'https://invideo.io/favicon.ico', url: 'https://invideo.io', status: 'Free & Paid' },
            { name: 'Canva', logo: 'https://www.canva.com/favicon.ico', url: 'https://www.canva.com', status: 'Free' },
            { name: 'Adobe Express', logo: 'https://www.adobe.com/favicon.ico', url: 'https://www.adobe.com/express', status: 'Free' }
        ]},
        { id: 'images-to-video', icon: 'film', name: 'Images to Video', websites: [
            { name: 'Clipchamp', logo: 'https://clipchamp.com/favicon.ico', url: 'https://clipchamp.com', status: 'Free' },
            { name: 'Magisto', logo: 'https://www.magisto.com/favicon.ico', url: 'https://www.magisto.com', status: 'Free' },
            { name: 'Biteable', logo: 'https://biteable.com/favicon.ico', url: 'https://biteable.com', status: 'Free' },
            { name: 'Adobe Express', logo: 'https://www.adobe.com/favicon.ico', url: 'https://www.adobe.com/express/create/video', status: 'Free' },
            { name: 'Veed.io', logo: 'https://www.veed.io/favicon.ico', url: 'https://www.veed.io/tools/image-to-video', status: 'Free' },
            { name: 'Renderforest', logo: 'https://www.renderforest.com/favicon.ico', url: 'https://www.renderforest.com', status: 'Free' }
        ]},
        { id: 'video-editing', icon: 'video', name: 'Video Editing', websites: [
            { name: 'HeyGen', logo: 'https://www.heygen.com/favicon.ico', url: 'https://www.heygen.com', status: 'Freemium' }
        ]},
        { id: 'music-gen', icon: 'music', name: 'Music Generation', websites: [
            { name: 'Boomy', logo: 'https://boomy.com/favicon.ico', url: 'https://boomy.com', status: 'Free' },
            { name: 'Mubert', logo: 'https://mubert.com/favicon.ico', url: 'https://mubert.com', status: 'Freemium' }
        ]},
        { id: '3d-gen', icon: 'box', name: '3D Generation', websites: [
            { name: 'Kaedim', logo: 'https://www.kaedim3d.com/favicon.ico', url: 'https://www.kaedim3d.com', status: 'Free' },
            { name: 'Masterpiece Studio', logo: 'https://masterpiecestudio.com/favicon.ico', url: 'https://masterpiecestudio.com', status: 'Free' }        ]},
        { id: 'copywriting', icon: 'pen-tool', name: 'Copywriting', websites: [
           
            { name: 'Simplified', logo: 'https://simplified.com/favicon.ico', url: 'https://simplified.com', status: 'Free' }
          
        ]},
      
      
        { id: 'email-writer', icon: 'mail', name: 'Email Writing', websites: [
            { name: 'Sanebox', logo: 'https://www.sanebox.com/favicon.ico', url: 'https://www.sanebox.com', status: 'Free' },
            { name: 'Boomerang', logo: 'https://www.boomeranggmail.com/favicon.ico', url: 'https://www.boomeranggmail.com', status: 'Premium' }
        ]},
        { id: 'health-ai', icon: 'heart', name: 'Health AI', websites: [
            { name: 'Ada', logo: 'https://ada.com/favicon.ico', url: 'https://ada.com', status: 'Free' },
            { name: 'Buoy', logo: 'https://www.buoyhealth.com/favicon.ico', url: 'https://www.buoyhealth.com', status: 'Free' },
            { name: 'Symptomate', logo: 'https://symptomate.com/favicon.ico', url: 'https://symptomate.com', status: 'Free' },
            { name: 'K Health', logo: 'https://khealth.com/favicon.ico', url: 'https://khealth.com', status: 'Premium' }
        ]},
        { id: 'finance-ai', icon: 'dollar-sign', name: 'Finance AI', websites: [
            { name: 'Mint', logo: 'https://mint.intuit.com/favicon.ico', url: 'https://mint.intuit.com', status: 'Free' },
            { name: 'Personal Capital', logo: 'https://www.personalcapital.com/favicon.ico', url: 'https://www.personalcapital.com', status: 'Freemium' }
        ]},
        { id: 'faceless-videos', icon: 'video', name: 'Faceless Videos Generation', websites: [

            { name: 'HeyGen', logo: 'https://www.heygen.com/favicon.ico', url: 'https://www.heygen.com', status: 'Free' },
            { name: 'Synthesys', logo: 'https://synthesys.io/favicon.ico', url: 'https://synthesys.io', status: 'Free' },
            { name: 'Veed.io', logo: 'https://www.veed.io/favicon.ico', url: 'https://www.veed.io', status: 'Free' },
            { name: 'InVideo', logo: 'https://invideo.io/favicon.ico', url: 'https://invideo.io', status: 'Free' }
        ]},
        { id: 'ai-avatars', icon: 'user', name: 'AI Avatars', websites: [
            { name: 'HeyGen', logo: 'https://www.heygen.com/favicon.ico', url: 'https://www.heygen.com', status: 'Free' },
            { name: 'Synthesys', logo: 'https://synthesys.io/favicon.ico', url: 'https://synthesys.io', status: 'Free' },
            { name: 'Veed.io', logo: 'https://www.veed.io/favicon.ico', url: 'https://www.veed.io', status: 'Free' },
            { name: 'InVideo', logo: 'https://invideo.io/favicon.ico', url: 'https://invideo.io', status: 'Free' }
        ]},
        { id: 'subtitles', icon: 'subtitles', name: 'Subtitles Generator', websites: [
            { name: 'Veed.io', logo: 'https://www.veed.io/favicon.ico', url: 'https://www.veed.io', status: 'Free' },
            { name: 'Kapwing', logo: 'https://www.kapwing.com/favicon.ico', url: 'https://www.kapwing.com', status: 'Free' },
            { name: 'Rev', logo: 'https://www.rev.com/favicon.ico', url: 'https://www.rev.com', status: 'Premium' },
            { name: 'Sonix', logo: 'https://sonix.ai/favicon.ico', url: 'https://sonix.ai', status: 'Free' },
            { name: 'Otter.ai', logo: 'https://otter.ai/favicon.ico', url: 'https://otter.ai', status: 'Free' },
            { name: 'Aegisub', logo: 'https://www.aegisub.org/favicon.ico', url: 'https://www.aegisub.org', status: 'Free' },
            { name: 'Subtitle Edit', logo: 'https://www.nikse.dk/favicon.ico', url: 'https://www.nikse.dk/SubtitleEdit', status: 'Free' }
        ]},
        { id: 'watermark-remover', icon: 'eraser', name: 'Watermark Remover', websites: [
            { name: 'Remove.bg', logo: 'https://www.remove.bg/favicon.ico', url: 'https://www.remove.bg', status: 'Free' },
            { name: 'Fotor', logo: 'https://www.fotor.com/favicon.ico', url: 'https://www.fotor.com', status: 'Free' },
            { name: 'Pixlr', logo: 'https://pixlr.com/favicon.ico', url: 'https://pixlr.com', status: 'Free' },
            { name: 'Inpaint', logo: 'https://theinpaint.com/favicon.ico', url: 'https://theinpaint.com', status: 'Premium' },
            { name: 'HitPaw', logo: 'https://www.hitpaw.com/favicon.ico', url: 'https://www.hitpaw.com', status: 'Freemium' },
            { name: 'Apowersoft', logo: 'https://www.apowersoft.com/favicon.ico', url: 'https://www.apowersoft.com', status: 'Free' }
           
        ]},
      
        { id: 'hairstyle', icon: 'scissors', name: 'Hairstyle Checker', websites: [
            { name: 'Perfect Corp', logo: 'https://www.perfectcorp.com/favicon.ico', url: 'https://www.perfectcorp.com', status: 'Premium' },
            { name: 'YouCam Makeup', logo: 'https://www.youcam.com/favicon.ico', url: 'https://www.youcam.com', status: 'Freemium' },
            { name: 'HairStyle AI', logo: 'https://hairstyleai.com/favicon.ico', url: 'https://hairstyleai.com', status: 'Free' }
        ]},
        { id: 'task-management', icon: 'check-square', name: 'Task Management', websites: [
            { name: 'Trello', logo: 'https://trello.com/favicon.ico', url: 'https://trello.com', status: 'Free' },
            { name: 'Asana', logo: 'https://asana.com/favicon.ico', url: 'https://asana.com', status: 'Free' },
            { name: 'Monday.com', logo: 'https://monday.com/favicon.ico', url: 'https://monday.com', status: 'Free' },
            { name: 'ClickUp', logo: 'https://clickup.com/favicon.ico', url: 'https://clickup.com', status: 'Premium' },
            { name: 'Wrike', logo: 'https://www.wrike.com/favicon.ico', url: 'https://www.wrike.com', status: 'Free' },
            { name: 'Basecamp', logo: 'https://basecamp.com/favicon.ico', url: 'https://basecamp.com', status: 'Free' },
            { name: 'Jira', logo: 'https://www.atlassian.com/favicon.ico', url: 'https://www.atlassian.com/software/jira', status: 'Free' },
            { name: 'Todoist', logo: 'https://todoist.com/favicon.ico', url: 'https://todoist.com', status: 'Free' },
            { name: 'MeisterTask', logo: 'https://www.meistertask.com/favicon.ico', url: 'https://www.meistertask.com', status: 'Free' }
        ]},
        { id: 'note-taking', icon: 'edit-3', name: 'Note Taking', websites: [
            { name: 'Evernote', logo: 'https://evernote.com/favicon.ico', url: 'https://evernote.com', status: 'Free' },
            { name: 'Simplenote', logo: 'https://simplenote.com/favicon.ico', url: 'https://simplenote.com', status: 'Freemium' },
            { name: 'Obsidian', logo: 'https://obsidian.md/favicon.ico', url: 'https://obsidian.md', status: 'Free' },
            { name: 'Roam Research', logo: 'https://roamresearch.com/favicon.ico', url: 'https://roamresearch.com', status: 'Free' },
            { name: 'Joplin', logo: 'https://joplinapp.org/favicon.ico', url: 'https://joplinapp.org', status: 'Free' },
            { name: 'Standard Notes', logo: 'https://standardnotes.org/favicon.ico', url: 'https://standardnotes.org', status: 'Free' },
        ]},
       
       
        { id: 'vpn', icon: 'shield', name: 'VPN', websites: [
            { name: 'ExpressVPN', logo: 'https://www.expressvpn.com/favicon.ico', url: 'https://www.expressvpn.com', status: 'Free' },
            { name: 'ProtonVPN', logo: 'https://protonvpn.com/favicon.ico', url: 'https://protonvpn.com', status: 'Premium' },
            { name: 'Private Internet Access', logo: 'https://www.privateinternetaccess.com/favicon.ico', url: 'https://www.privateinternetaccess.com', status: 'Free' },
            { name: 'Windscribe', logo: 'https://windscribe.com/favicon.ico', url: 'https://windscribe.com', status: 'Free' },
            { name: 'Mullvad', logo: 'https://mullvad.net/favicon.ico', url: 'https://mullvad.net', status: 'Free' }
        ]},
        { id: 'antivirus', icon: 'shield-off', name: 'Antivirus', websites: [
            { name: 'McAfee', logo: 'https://www.mcafee.com/favicon.ico', url: 'https://www.mcafee.com', status: 'Free' },
            { name: 'Bitdefender', logo: 'https://www.bitdefender.com/favicon.ico', url: 'https://www.bitdefender.com', status: 'Free' },
            { name: 'Kaspersky', logo: 'https://www.kaspersky.com/favicon.ico', url: 'https://www.kaspersky.com', status: 'Premium' },
            { name: 'Avast', logo: 'https://www.avast.com/favicon.ico', url: 'https://www.avast.com', status: 'Freemium' },
            { name: 'ESET', logo: 'https://www.eset.com/favicon.ico', url: 'https://www.eset.com', status: 'Free' },
            { name: 'Malwarebytes', logo: 'https://www.malwarebytes.com/favicon.ico', url: 'https://www.malwarebytes.com', status: 'Free' },
            { name: 'Trend Micro', logo: 'https://www.trendmicro.com/favicon.ico', url: 'https://www.trendmicro.com', status: 'Free' },
            { name: 'F-Secure', logo: 'https://www.f-secure.com/favicon.ico', url: 'https://www.f-secure.com', status: 'Free' }
        ]},
        { id: 'cloud-storage', icon: 'cloud', name: 'Cloud Storage', websites: [
            { name: 'AWS', logo: 'https://aws.amazon.com/favicon.ico', url: 'https://aws.amazon.com', status: 'Free' },
            { name: 'Google Cloud', logo: 'https://cloud.google.com/favicon.ico', url: 'https://cloud.google.com', status: 'Free' },
            { name: 'Azure', logo: 'https://azure.microsoft.com/favicon.ico', url: 'https://azure.microsoft.com', status: 'Free' },
            { name: 'Linode', logo: 'https://www.linode.com/favicon.ico', url: 'https://www.linode.com', status: 'Freemium' },
            { name: 'Vultr', logo: 'https://www.vultr.com/favicon.ico', url: 'https://www.vultr.com', status: 'Free' },
            { name: 'OVH', logo: 'https://www.ovh.com/favicon.ico', url: 'https://www.ovh.com', status: 'Free' },
            { name: 'Hetzner', logo: 'https://www.hetzner.com/favicon.ico', url: 'https://www.hetzner.com', status: 'Free' }
        ]},
      
        { id: 'game-dev', icon: 'gamepad', name: 'Game Development', websites: [
            { name: 'Unity', logo: 'https://unity.com/favicon.ico', url: 'https://unity.com', status: 'Free' },
            { name: 'Unreal Engine', logo: 'https://www.unrealengine.com/favicon.ico', url: 'https://www.unrealengine.com', status: 'Free' },
            { name: 'Godot', logo: 'https://godotengine.org/favicon.ico', url: 'https://godotengine.org', status: 'Free' },
            { name: 'Construct', logo: 'https://www.construct.net/favicon.ico', url: 'https://www.construct.net', status: 'Freemium' },
            { name: 'Phaser', logo: 'https://phaser.io/favicon.ico', url: 'https://phaser.io', status: 'Free' },
            { name: 'Three.js', logo: 'https://threejs.org/favicon.ico', url: 'https://threejs.org', status: 'Free' },
            { name: 'Cocos2d-x', logo: 'https://www.cocos.com/favicon.ico', url: 'https://www.cocos.com', status: 'Free' }
        ]},
        { 
            id: 'meme-generators', 
            icon: 'image', 
            name: 'Meme Generators',
            websites: [
                { name: 'Imgflip', logo: 'https://imgflip.com/favicon.ico', url: 'https://imgflip.com', status: 'Free' },
                { name: 'Kapwing', logo: 'https://www.kapwing.com/favicon.ico', url: 'https://www.kapwing.com', status: 'Free' },
                { name: 'Canva', logo: 'https://www.canva.com/favicon.ico', url: 'https://www.canva.com', status: 'Free' }
            ]
        },
        { id: 'web-hosting', icon: 'server', name: 'Web Hosting', websites: [
            { name: 'Vercel', logo: 'https://vercel.com/favicon.ico', url: 'https://vercel.com', status: 'Free' },
            { name: 'Netlify', logo: 'https://www.netlify.com/favicon.ico', url: 'https://www.netlify.com', status: 'Free' },
            { name: 'GitHub Pages', logo: 'https://pages.github.com/favicon.ico', url: 'https://pages.github.com', status: 'Free' },
            { name: 'Glitch', logo: 'https://glitch.com/favicon.ico', url: 'https://glitch.com', status: 'Free' },
            { name: 'Firebase Hosting', logo: 'https://firebase.google.com/favicon.ico', url: 'https://firebase.google.com', status: 'Free' },
            { name: 'Cloudflare Pages', logo: 'https://pages.cloudflare.com/favicon.ico', url: 'https://pages.cloudflare.com', status: 'Free' },
            { name: 'Railway', logo: 'https://railway.app/favicon.ico', url: 'https://railway.app', status: 'Free' }
        ]},
      
        { id: 'noise-remover', icon: 'volume-x', name: 'Noise Remover', websites: [
            { name: 'Adobe Audition', logo: 'https://www.adobe.com/favicon.ico', url: 'https://www.adobe.com/products/audition.html', status: 'Premium' },
            { name: 'Noise Reducer Pro', logo: 'https://noisereducerpro.com/favicon.ico', url: 'https://noisereducerpro.com', status: 'Free' },
            { name: 'WavePad', logo: 'https://www.nch.com.au/favicon.ico', url: 'https://www.nch.com.au/wavepad', status: 'Free' },
            { name: 'RX 10', logo: 'https://www.izotope.com/favicon.ico', url: 'https://www.izotope.com/en/products/rx.html', status: 'Premium' },
            { name: 'Noise Gate', logo: 'https://noisegate.io/favicon.ico', url: 'https://noisegate.io', status: 'Free' },
            { name: 'Sound Forge', logo: 'https://www.magix.com/favicon.ico', url: 'https://www.magix.com/us/music/sound-forge', status: 'Premium' }
        ]},
    ];

    const workflowsData = [
        { 
            id: 'youtube-video', 
            icon: 'video', 
            name: 'YouTube Video Creator',
            description: 'Tools for creating professional YouTube videos'
        },
        { 
            id: 'website-builder', 
            icon: 'globe', 
            name: 'Website Builder',
            description: 'Complete toolkit for building a professional website'
        },
        {
            id: 'job-interview',
            icon: 'user-check',
            name: ' job interview',
            description: 'Tools for job interview preparation'
        },
      
        { 
            id: 'data-analysis', 
            icon: 'bar-chart', 
            name: 'Data Analysis',
            description: 'Analyze and visualize data for better insights'
        },
        {
            id: 'startup-pitch', 
            icon: 'presentation', 
            name: 'Startup Pitch Deck',
            description: 'Create compelling pitch decks for startup funding'
        },
        { 
            id: 'social-media', 
            icon: 'share-2', 
            name: 'Social Media Manager',
            description: 'Manage and optimize your social media presence'
        },
        {
            id: 'ecommerce-setup', 
            icon: 'shopping-cart', 
            name: 'E-commerce Setup',
            description: 'Tools for setting up and managing online stores',
        },
        {
            id: 'seo-optimization',
            icon: 'search',
            name: 'SEO Optimization',
            description: 'Tools and strategies for improving search engine rankings'
        },
        {
            
            id: 'podcast-creation', 
            icon: 'mic', 
        name: 'Podcast Creation',
        description: 'Tools for recording, editing, and publishing podcasts',
        },
       
        {
            id: 'project-management',
            icon: 'clipboard-list',
            name: 'Project Management',
            description: 'Streamline your project workflow and team collaboration'
        },
        { 
            id: 'content-creation', 
            icon: 'pen-tool', 
            name: 'Content Creation',
            description: 'Create engaging content across multiple platforms'
        },
        {
            id: 'personal-budgeting', 
            icon: 'dollar-sign', 
            name: 'Personal Budgeting',
            description: 'Manage your personal finances effectively',
        },
        {
            id: 'email-marketing', 
            icon: 'mail', 
            name: 'Email Marketing',
            description: 'Tools for creating and managing effective email campaigns',
        },
        {
            id: 'mobile-app-dev', 
            icon: 'smartphone', 
            name: 'Mobile App Development',
            description: 'Resources for designing and building mobile applications',
        },
        {
            id: 'online-learning', 
            icon: 'book-open', 
            name: 'Online Learning',
            description: 'Tools for creating and delivering educational content',
        },
        {
            id: 'digital-marketing', 
            icon: 'trending-up', 
            name: 'Digital Marketing',
            description: 'Comprehensive toolkit for all digital marketing needs',
        },
        {
            id: 'remote-work', 
            icon: 'home', 
            name: 'Remote Work',
            description: 'Essential tools for productive remote work and collaboration',
        }
    ];

    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.querySelector('.theme-toggle-mobile');
    const tabs = document.querySelectorAll('.tab');
    const toolsGrid = document.getElementById('toolsGrid');
    const workflowsGrid = document.getElementById('workflowsGrid');
    const searchInput = document.getElementById('searchInput');
    const toolPage = document.getElementById('toolPage');
    const mainContent = document.querySelector('.main-content');
    const tabBar = document.querySelector('.tab-bar');

    // Add scroll event listener for tab bar with minimal processing
    // and to save scroll positions
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (tabBar) {
            if (window.scrollY > 0) {
                tabBar.classList.add('scrolled');
            } else {
                tabBar.classList.remove('scrolled');
            }
        }
        
        // Save the current scroll position for the active tab
        // Use a timeout to avoid excessive processing
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const activeTab = document.querySelector('.tab.active');
            if (activeTab) {
                const activeTabId = activeTab.getAttribute('data-tab');
                tabScrollPositions[activeTabId] = window.scrollY;
            }
        }, 100);
    });

    function switchToTab(tabName) {
        const tab = document.querySelector(`.tab[data-tab="${tabName}"]`);
        if (tab && !tab.classList.contains('active')) {
            // Get the current active tab
            const currentActiveTab = document.querySelector('.tab.active');
            if (currentActiveTab) {
                // Save the current scroll position for the active tab
                const currentTabId = currentActiveTab.getAttribute('data-tab');
                tabScrollPositions[currentTabId] = window.scrollY;
                showDebugMessage(`Saved ${currentTabId} scroll position: ${window.scrollY}px`);
                
                // Also update session storage with the current tab
                sessionStorage.setItem('lastActiveTab', tabName);
            }
            
            // Only proceed if the tab isn't already active
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update the sliding underline position
            updateTabIndicator();
            
            const isTools = tabName === 'tools';
            if (toolsGrid && workflowsGrid && searchInput) {
                toolsGrid.classList.toggle('hidden', !isTools);
                workflowsGrid.classList.toggle('hidden', isTools);
                searchInput.placeholder = `Search ${isTools ? 'AI tools' : 'workflows'}...`;
                
                // Reset search
                searchInput.value = '';
                
                if (isTools) {
                    renderTools('');
                } else {
                    renderWorkflows('');
                }
                
                // After rendering content, restore the saved scroll position for this tab
                setTimeout(() => {
                    window.scrollTo({
                        top: tabScrollPositions[tabName] || 0,
                        behavior: 'auto'
                    });
                    showDebugMessage(`Restored ${tabName} scroll position: ${tabScrollPositions[tabName] || 0}px`);
                }, 200);
            }
        }
    }

    // Update existing tab click handler to use the new switchToTab function
    if (tabs) {
        tabs.forEach(tab => {
            // Use a simple click handler
            tab.addEventListener('click', () => {
                switchToTab(tab.dataset.tab);
            });
        });
    }
    
    // Prevent accidental tab switching on mobile when scrolling
    // We'll use a simpler approach by adding a small delay to tab clicks
    const tabBarContainer = document.querySelector('.tab-bar-container');
    if (tabBarContainer) {
        // Make the tab bar less sensitive to accidental touches
        tabBarContainer.style.touchAction = 'pan-y';
    }

    // Theme Toggle
    function toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
        const toggleInputs = document.querySelectorAll('.toggle-switch input');
        toggleInputs.forEach(input => {
            input.checked = isDark;
        });
    }

    // Initialize theme toggle state
    function initializeTheme() {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        }
        const toggleInputs = document.querySelectorAll('.toggle-switch input');
        toggleInputs.forEach(input => {
            input.checked = savedDarkMode;
            input.addEventListener('change', toggleDarkMode);
        });
    }

    // Call initializeTheme when the page loads
    initializeTheme();

    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            if (!e.target.closest('.toggle-switch')) {
                toggleDarkMode();
            }
        });
    }
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', (e) => {
            if (!e.target.closest('.toggle-switch')) {
                toggleDarkMode();
            }
        });
    }

    // Search Functionality
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value;
            
            searchTimeout = setTimeout(() => {
                if (toolsGrid) {
                    const isTools = !toolsGrid.classList.contains('hidden');
                    if (isTools) {
                        renderTools(query);
                    } else {
                        renderWorkflows(query);
                    }
                }
            }, 300);
        });
    }

    // Render Functions
    function renderTools(searchQuery) {
        // Make sure toolsGrid is initialized
        if (!toolsGrid) toolsGrid = document.getElementById('toolsGrid');
        if (!toolsGrid) return;
        
        const filteredTools = toolsData.filter(tool => 
            tool.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        toolsGrid.innerHTML = filteredTools.map((tool, index) => {
            // Calculate color indices for each tool (cycling through available colors)
            const colorIndex1 = (index % 8) + 1;
            const colorIndex2 = ((index + 3) % 8) + 1; // Offset by 3 for complementary colors
            
            // Check if desktop nav is visible (large screen)
            const desktopNav = document.querySelector('.desktop-nav');
            const isDesktopNavVisible = desktopNav && window.getComputedStyle(desktopNav).display !== 'none';
            
            if (isDesktopNavVisible) {
                return `
                <div class="tool-card workflow-card" data-tool-id="${tool.id}">
                    <div class="workflow-label">AI</div>
                    <div class="workflow-icon" style="
                        --icon-color-1: var(--tool-icon-${colorIndex1}); 
                        --icon-color-2: var(--tool-icon-${colorIndex2});
                        --icon-color-1-rgb: var(--tool-icon-${colorIndex1}-rgb);
                        --icon-color-2-rgb: var(--tool-icon-${colorIndex2}-rgb);">
                        <i data-lucide="${tool.icon}"></i>
                    </div>
                    <h3 class="workflow-title">${tool.name}</h3>
                    <p class="workflow-description">${getToolDescription(tool.id)}</p>
                </div>
                `;
            } else {
                return `
                <div class="tool-card ai-tool-card" data-tool-id="${tool.id}">
                    <div class="icon-container" style="
                        --icon-color-1: var(--tool-icon-${colorIndex1}); 
                        --icon-color-2: var(--tool-icon-${colorIndex2});
                        --icon-color-1-rgb: var(--tool-icon-${colorIndex1}-rgb);
                        --icon-color-2-rgb: var(--tool-icon-${colorIndex2}-rgb);">
                        <i data-lucide="${tool.icon}"></i>
                    </div>
                    <span>${tool.name}</span>
                </div>
                `;
            }
        }).join('');
        
        lucide.createIcons();
        setTimeout(() => applyLogoErrorHandling(), 100);
        
        // Add click handlers
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', () => showToolPage(card.dataset.toolId));
        });
    }

    function renderWorkflows(searchQuery) {
        // Make sure workflowsGrid is initialized
        if (!workflowsGrid) workflowsGrid = document.getElementById('workflowsGrid');
        if (!workflowsGrid) return;
        
        // Get the workflow-tools-grid inside the workflowsGrid
        const workflowToolsGrid = workflowsGrid.querySelector('.workflow-tools-grid');
        if (!workflowToolsGrid) return;
        
        // Check if content is already rendered and we're just filtering
        const isInitialRender = workflowToolsGrid.children.length === 0;
        
        // Only make the workflowsGrid visible if we're on the workflows tab
        const activeTab = document.querySelector('.tab.active');
        const isWorkflowTab = activeTab && activeTab.dataset.tab === 'workflows';
        
        // Skip rendering if we're not on the workflows tab and this isn't a search operation
        if (!isWorkflowTab && searchQuery === '' && !isInitialRender) {
            return;
        }
        
        if (isWorkflowTab) {
            workflowsGrid.classList.remove('hidden');
        } else {
            workflowsGrid.classList.add('hidden');
        }
        
        workflowToolsGrid.innerHTML = '';

        const workflows = [
            { 
                id: 'youtube-video', 
                icon: 'video', 
                name: 'YouTube Video Creator',
                description: 'Tools for creating professional YouTube videos'
            },
            { 
                id: 'website-builder', 
                icon: 'globe', 
                name: 'Website Builder',
                description: 'Complete toolkit for building a professional website'
            },
            {
                id: 'job-interview',
                icon: 'user-check',
                name: 'Interview Preparation',
                description: 'Tools for job interview preparation'
            },
          
            { 
                id: 'data-analysis', 
                icon: 'bar-chart', 
                name: 'Data Analysis',
                description: 'Analyze and visualize data for better insights'
            },
            {
                id: 'startup-pitch', 
                icon: 'presentation', 
                name: 'Startup Pitch Deck',
                description: 'Create compelling pitch decks for startup funding'
            },
            { 
                id: 'social-media', 
                icon: 'share-2', 
                name: 'Social Media Manager',
                description: 'Manage and optimize your social media presence'
            },
            {
                id: 'ecommerce-setup', 
                icon: 'shopping-cart', 
                name: 'E-commerce Setup',
                description: 'Tools for setting up and managing online stores',
            },
            {
                id: 'seo-optimization',
                icon: 'search',
                name: 'SEO Optimization',
                description: 'Tools and strategies for improving search engine rankings'
            },
            {
                id: 'podcast-creation', 
                icon: 'mic', 
                name: 'Podcast Creation',
                description: 'Tools for recording, editing, and publishing podcasts',
            },
           
            {
                id: 'project-management',
                icon: 'clipboard-list',
                name: 'Project Management',
                description: 'Streamline your project workflow and team collaboration'
            },
            { 
                id: 'content-creation', 
                icon: 'pen-tool', 
                name: 'Content Creation',
                description: 'Create engaging content across multiple platforms'
            },
            {
                id: 'personal-budgeting', 
                icon: 'dollar-sign', 
                name: 'Personal Budgeting',
                description: 'Manage your personal finances effectively',
            },
            {
                id: 'email-marketing', 
                icon: 'mail', 
                name: 'Email Marketing',
                description: 'Tools for creating and managing effective email campaigns',
            },
            {
                id: 'mobile-app-dev', 
                icon: 'smartphone', 
                name: 'Mobile App Development',
                description: 'Resources for designing and building mobile applications',
            },
            {
                id: 'online-learning', 
                icon: 'book-open', 
                name: 'Online Learning',
                description: 'Tools for creating and delivering educational content',
            },
            {
                id: 'digital-marketing', 
                icon: 'trending-up', 
                name: 'Digital Marketing',
                description: 'Comprehensive toolkit for all digital marketing needs',
            }
        ];

        workflows.forEach((workflow, index) => {
            if (searchQuery && !workflow.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return;
            }
            
            // Calculate color indices for each workflow (cycling through available colors)
            const colorIndex1 = ((index % 6) + 2); // Start from 2 to avoid orange (1)
            const colorIndex2 = ((index + 2) % 6) + 2; // Offset by 2 for complementary colors
            
            const workflowCard = document.createElement('div');
            workflowCard.className = 'workflow-card';
            workflowCard.innerHTML = `
                <div class="workflow-label">Workflow</div>
                <div class="workflow-icon" style="
                    --icon-color-1: var(--tool-icon-${colorIndex1}); 
                    --icon-color-2: var(--tool-icon-${colorIndex2});
                    --icon-color-1-rgb: var(--tool-icon-${colorIndex1}-rgb);
                    --icon-color-2-rgb: var(--tool-icon-${colorIndex2}-rgb);">
                    <i data-lucide="${workflow.icon}"></i>
                </div>
                <h3 class="workflow-title">${workflow.name}</h3>
                <p class="workflow-description">${workflow.description}</p>
            `;
            workflowCard.addEventListener('click', () => showWorkflowPage(workflow.id));
            workflowToolsGrid.appendChild(workflowCard);
        });

        // Initialize Lucide icons for the new elements
        lucide.createIcons();
        setTimeout(() => applyLogoErrorHandling(), 100);
    }

    // Tool Page
    function showToolPage(toolId, pushState = true) {
        // Make sure DOM elements are initialized
        if (!mainContent) mainContent = document.querySelector('.main-content');
        if (!toolPage) toolPage = document.getElementById('toolPage');
        
        const tool = toolsData.find(t => t.id === toolId);
        if (!tool || !tool.websites || !mainContent || !toolPage) return;

        // Get the current active tab
        const currentTab = document.querySelector('.tab.active');
        if (currentTab) {
            const currentTabId = currentTab.getAttribute('data-tab');
            // Store current scroll position before navigating
            tabScrollPositions[currentTabId] = window.pageYOffset || document.documentElement.scrollTop;
            console.log(`Saved ${currentTabId} scroll position: ${tabScrollPositions[currentTabId]}px`);
            
            // Store which tab was active when navigating to the tool page
            // This will be used when returning to restore the correct tab's scroll position
            sessionStorage.setItem('lastActiveTab', currentTabId);
        }
        
        // Update URL using History API if pushState is true
        if (pushState) {
            const newPath = `/tools/${toolId}`;
            history.pushState({ type: 'tool', id: toolId }, tool.name, newPath);
        }
        
        // Set tool page mode to active to hide the footer and prevent background scrolling
        setToolPageMode(true);
        
        mainContent.style.display = 'none';
        mainContent.classList.add('hidden');
        toolPage.classList.remove('hidden');
        
        // Reset tool page sections to show websites list
        const websitesList = document.getElementById('websitesList');
        const toolAboutSection = document.getElementById('toolAboutSection');
        const toolPrivacySection = document.getElementById('toolPrivacySection');
        
        if (websitesList) websitesList.style.display = 'block';
        if (toolAboutSection) toolAboutSection.classList.add('hidden');
        if (toolPrivacySection) toolPrivacySection.classList.add('hidden');
        
        // Reset scroll position to top when opening a tool page
        window.scrollTo(0, 0);
        
        const toolTitle = document.getElementById('toolTitle');
        if (toolTitle) {
            toolTitle.textContent = tool.name;
        }
        
        if (websitesList) {
            websitesList.innerHTML = tool.websites.map(website => `
                <div class="website-card">
                    <div class="website-info">
                        <div class="website-logo-container">
                            <img src="${website.logo}" alt="${website.name}" class="website-logo" onerror="handleLogoError(this)" loading="lazy">
                        </div>
                        <div>
                            <h2 class="website-name">${website.name}</h2>
                            <span class="status-badge ${website.status.toLowerCase().includes('free') ? 'free' : 'premium'}">
                                ${website.status}
                            </span>
                        </div>
                    </div>
                    <a href="${website.url}" target="_blank" rel="noopener noreferrer" class="access-button">
                        <span>Access</span>
                        <i data-lucide="external-link"></i>
                    </a>
                </div>
            `).join('');
        }
        
        lucide.createIcons();
        setTimeout(() => applyLogoErrorHandling(), 100);
    }

    // Workflow Page
    function showWorkflowPage(workflowId, pushState = true) {
        // Make sure DOM elements are initialized
        if (!mainContent) mainContent = document.querySelector('.main-content');
        if (!toolPage) toolPage = document.getElementById('toolPage');
        
        const workflow = workflowsData.find(w => w.id === workflowId);
        if (!workflow || !mainContent || !toolPage) return;

        // Get the current active tab
        const currentTab = document.querySelector('.tab.active');
        if (currentTab) {
            const currentTabId = currentTab.getAttribute('data-tab');
            // Store current scroll position before navigating
            tabScrollPositions[currentTabId] = window.pageYOffset || document.documentElement.scrollTop;
            console.log(`Saved ${currentTabId} scroll position: ${tabScrollPositions[currentTabId]}px`);
            
            // Store which tab was active when navigating to the workflow page
            // This will be used when returning to restore the correct tab's scroll position
            sessionStorage.setItem('lastActiveTab', currentTabId);
        }
        
        // Update URL using History API if pushState is true
        if (pushState) {
            const newPath = `/workflows/${workflowId}`;
            history.pushState({ type: 'workflow', id: workflowId }, workflow.name, newPath);
        }
        
        // Set tool page mode to active to hide the footer and prevent background scrolling
        setToolPageMode(true);
        
        mainContent.style.display = 'none';
        mainContent.classList.add('hidden');
        toolPage.classList.remove('hidden');
        
        // Reset scroll position to top when opening a workflow page
        window.scrollTo(0, 0);
        
        const toolTitle = document.getElementById('toolTitle');
        if (toolTitle) {
            toolTitle.textContent = workflow.name;
        }
        
        const websitesList = document.getElementById('websitesList');
        if (websitesList) {
            if (workflowId === 'youtube-video') {
                // YouTube Video Creator Workflow (custom)
                websitesList.innerHTML = `
                <div class="category-section">
                        <h2 class="category-title">For Script Writing:</h2>
                    <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://chat.openai.com/favicon.ico" alt="ChatGPT" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">ChatGPT</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                    </div>
                </div>
                    <div class="category-section">
                        <h2 class="category-title">For Voice Generation:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://ttsmp3.com/favicon.ico" alt="TTSMaker" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">TTSMaker</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://ttsmp3.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Video Generation:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://pandorra.ai/favicon.ico" alt="Pandorra" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Pandorra</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://pandorra.ai" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Image Generation (Thumbnails):</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.craiyon.com/favicon.ico" alt="Craiyon" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Craiyon</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.craiyon.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Background Music:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://pixabay.com/favicon.ico" alt="Pixabay Music" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Pixabay Music</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://pixabay.com/music/" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Video Editing:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.capcut.com/favicon.ico" alt="CapCut Web" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">CapCut Web</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.capcut.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'website-builder') {
                // Website Builder Workflow
                websitesList.innerHTML = `
                  
                    <div class="category-section">
                        <h2 class="category-title">Code Generation</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://codeium.com/favicon.ico" alt="Codeium" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Codeium</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://codeium.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://aws.amazon.com/favicon.ico" alt="Amazon CodeWhisperer" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">CodeWhisperer</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://aws.amazon.com/codewhisperer" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="category-section">
                        <h2 class="category-title">Design Tools</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.figma.com/favicon.ico" alt="Figma" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Figma</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.figma.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="category-section">
                        <h2 class="category-title">Hosting Services</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.netlify.com/favicon.ico" alt="Netlify" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Netlify</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://pages.github.com/favicon.ico" alt="GitHub Pages" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">GitHub Pages</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://pages.github.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="category-section">
                        <h2 class="category-title">Domain Services</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.freenom.com/favicon.ico" alt="Freenom" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Freenom</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.freenom.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://my.dot.tk/favicon.ico" alt="Dot.TK" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Dot.TK</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="http://www.dot.tk" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'content-creation') {
                // Content Creation Workflow
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">Text Generation</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://chat.openai.com/favicon.ico" alt="ChatGPT" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">ChatGPT</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="category-section">
                        <h2 class="category-title">Image Generation</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://stability.ai/favicon.ico" alt="Stable Diffusion" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Stable Diffusion</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://stability.ai" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="category-section">
                        <h2 class="category-title">Video Creation</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.kapwing.com/favicon.ico" alt="Kapwing" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Kapwing</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.kapwing.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="category-section">
                        <h2 class="category-title">Audio Generation</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.murf.ai/favicon.ico" alt="Murf" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Murf</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://murf.ai" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="category-section">
                        <h2 class="category-title">Social Media Management</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://buffer.com/favicon.ico" alt="Buffer" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Buffer</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://buffer.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="category-section">
                        <h2 class="category-title">Content Planning</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.notion.so/favicon.ico" alt="Notion" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Notion</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.notion.so" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'social-media') {
                // Social Media Manager Workflow
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">For Post Content Writing (Captions, Hashtags, Ideas):</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://chat.openai.com/favicon.ico" alt="ChatGPT" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">ChatGPT</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Image and Poster Design (Instagram, LinkedIn, etc.):</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://designer.microsoft.com/favicon.ico" alt="Microsoft Designer" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Microsoft Designer</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://designer.microsoft.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Scheduling and Managing Posts:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://buffer.com/favicon.ico" alt="Buffer" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Buffer</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://buffer.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Hashtag Generation and Research:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://metahashtags.com/favicon.ico" alt="MetaHashtags" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">MetaHashtags</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://metahashtags.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Analytics and Insights (Basic Monitoring):</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://notjustanalytics.com/favicon.ico" alt="Not Just Analytics" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Not Just Analytics</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://notjustanalytics.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Video Creation (Reels, Shorts):</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://pandorra.ai/favicon.ico" alt="Pandorra" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Pandorra</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://pandorra.ai" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'seo-optimization') {
                // SEO Optimization Workflow
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">For Keyword Research:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://neilpatel.com/favicon.ico" alt="Ubersuggest" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Ubersuggest</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://neilpatel.com/ubersuggest" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For On-Page SEO Analysis:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.semrush.com/favicon.ico" alt="SEMrush" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">SEMrush</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.semrush.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Backlink Analysis:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://ahrefs.com/favicon.ico" alt="Ahrefs" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Ahrefs</h3>
                                        <span class="status-badge premium">Premium</span>
                                    </div>
                                </div>
                                <a href="https://ahrefs.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Rank Tracking:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://search.google.com/favicon.ico" alt="Google Search Console" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Google Search Console</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Content Optimization:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://surferseo.com/favicon.ico" alt="Surfer SEO" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Surfer SEO</h3>
                                        <span class="status-badge premium">Premium</span>
                                    </div>
                                </div>
                                <a href="https://surferseo.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Site Audit:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.screamingfrog.co.uk/favicon.ico" alt="Screaming Frog" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Screaming Frog</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.screamingfrog.co.uk" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'ecommerce-setup') {
                // E-commerce Setup Workflow
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">For Store Content:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://chat.openai.com/favicon.ico" alt="ChatGPT" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">ChatGPT</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Product Images & Banners:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://designer.microsoft.com/favicon.ico" alt="Microsoft Designer" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Microsoft Designer</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://designer.microsoft.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Website Builder:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.ecwid.com/favicon.ico" alt="Ecwid" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Ecwid</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.ecwid.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Storefront Customization (Design & Layout):</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://tilda.cc/favicon.ico" alt="Tilda" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Tilda</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://tilda.cc" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Payment Gateway Integration:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://razorpay.com/favicon.ico" alt="Razorpay" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Razorpay</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://razorpay.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Order Tracking & Management:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.zoho.com/inventory/favicon.ico" alt="Zoho Inventory" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Zoho Inventory</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.zoho.com/inventory/" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'personal-budgeting') {
                // Personal Budgeting Workflow
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">For Income & Expense Tracking:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.google.com/sheets/about/images/favicon.ico" alt="Google Sheets" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Google Sheets</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Budget Planning & Visualization:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.tillerhq.com/favicon.ico" alt="Tiller Budget Templates" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Tiller Budget Templates</h3>
                                        <span class="status-badge premium">Premium</span>
                                    </div>
                                </div>
                                <a href="https://www.tillerhq.com/templates/" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Graphs & Monthly Reports:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://chartify.com/favicon.ico" alt="Chartify" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Chartify</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://chartify.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Receipt Scanning:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.zoho.com/expense/favicon.ico" alt="Zoho Expense" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Zoho Expense</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.zoho.com/expense/" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Goal-Based Budget Templates:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.vertex42.com/favicon.ico" alt="Vertex42" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Vertex42</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.vertex42.com/ExcelTemplates/budgets.html" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'job-interview') {
                // Job Interview Workflow
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">For Resume Review and Enhancement:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.kickresume.com/favicon.ico" alt="Kickresume AI Resume Checker" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Kickresume AI Resume Checker</h3>
                                        <span class="status-badge premium">Premium</span>
                                    </div>
                                </div>
                                <a href="https://www.kickresume.com/en/ai-resume-checker/" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Video Interview Simulation:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://grow.google/static/images/favicon.ico" alt="Interview Warmup by Google" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Interview Warmup by Google</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://grow.google/certificates/interview-warmup/" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Personality & Soft Skills Assessment:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.123test.com/favicon.ico" alt="123test Personality Test" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">123test Personality Test</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.123test.com/personality-test/" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Speech & Confidence Practice (Voice Clarity):</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://ttsmp3.com/favicon.ico" alt="TTSMaker" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">TTSMaker</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://ttsmp3.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Dressing Tips and Checklist:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://chat.openai.com/favicon.ico" alt="ChatGPT" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">ChatGPT</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'data-analysis') {
                // Data Analysis Workflow
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">For Data Cleaning and Exploration:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.google.com/sheets/about/images/favicon.ico" alt="Google Sheets" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Google Sheets</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Data Visualization (Charts, Graphs):</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://chartify.com/favicon.ico" alt="Chartify" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Chartify</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://chartify.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Python-Based Analysis (Code + Visualization):</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://colab.research.google.com/favicon.ico" alt="Google Colab" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Google Colab</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://colab.research.google.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Dashboard Creation (No-Code Visual Dashboards):</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://datastudio.google.com/favicon.ico" alt="Google Data Studio" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Google Data Studio</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://datastudio.google.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'podcast-creation') {
                // Podcast Creation Workflow
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">For Content Ideation & Scriptwriting:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://chat.openai.com/favicon.ico" alt="ChatGPT" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">ChatGPT</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Voice Generation / Recording:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://podcastle.ai/favicon.ico" alt="Podcastle" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Podcastle</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://podcastle.ai" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Audio Editing & Cleanup:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://podcast.adobe.com/favicon.ico" alt="Adobe Podcast Enhance" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Adobe Podcast Enhance</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://podcast.adobe.com/enhance" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Music & Sound Effects:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://pixabay.com/favicon.ico" alt="Pixabay Audio" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Pixabay Audio</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://pixabay.com/music/" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Transcription & Captions:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://whisper.openai.com/favicon.ico" alt="Whisper by OpenAI" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Whisper by OpenAI</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://whisper.openai.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Publishing & Hosting:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://podcasters.spotify.com/favicon.ico" alt="Spotify for Podcasters" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Spotify for Podcasters</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://podcasters.spotify.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'project-management') {
                // Project Management Workflow
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">For Task & Project Tracking:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://trello.com/favicon.ico" alt="Trello" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Trello</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://trello.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Team Collaboration & Communication:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://slack.com/favicon.ico" alt="Slack" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Slack</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://slack.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Agile & Sprint Planning:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://jira.atlassian.com/favicon.ico" alt="Jira" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Jira</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://jira.atlassian.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Document & Knowledge Sharing:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://confluence.atlassian.com/favicon.ico" alt="Confluence" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Confluence</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://confluence.atlassian.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'startup-pitch') {
                // Startup Pitch Deck Workflow
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">For Pitch Deck Design:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.canva.com/favicon.ico" alt="Canva" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Canva</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.canva.com/presentations/templates/pitch-deck/" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.google.com/favicon.ico" alt="Google Slides" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Google Slides</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://slides.google.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Financial Projections:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.google.com/favicon.ico" alt="Google Sheets" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Google Sheets</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://finmodelslab.com/favicon.ico" alt="Financial Models Lab" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Financial Models Lab</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://finmodelslab.com/blogs/templates" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Market Research:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.statista.com/favicon.ico" alt="Statista" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Statista</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.statista.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://trends.google.com/favicon.ico" alt="Google Trends" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Google Trends</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://trends.google.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Pitch Deck Templates:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://slidebean.com/favicon.ico" alt="Slidebean" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Slidebean</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://slidebean.com/pitch-deck-templates" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.slideshare.net/favicon.ico" alt="SlideShare" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">SlideShare</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.slideshare.net" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Pitch Practice:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.zoom.us/favicon.ico" alt="Zoom" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Zoom</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://zoom.us" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.loom.com/favicon.ico" alt="Loom" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Loom</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.loom.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Startup Resources:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.ycombinator.com/favicon.ico" alt="Y Combinator Startup Library" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Y Combinator Library</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.ycombinator.com/library" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.producthunt.com/favicon.ico" alt="Product Hunt" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Product Hunt</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.producthunt.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'online-learning') {
                // Online Learning Workflow
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">For Course Creation:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.teachable.com/favicon.ico" alt="Teachable" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Teachable</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.teachable.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.thinkific.com/favicon.ico" alt="Thinkific" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Thinkific</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.thinkific.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Video Lectures:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.loom.com/favicon.ico" alt="Loom" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Loom</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.loom.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.youtube.com/favicon.ico" alt="YouTube" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">YouTube</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Interactive Content:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://kahoot.com/favicon.ico" alt="Kahoot" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Kahoot</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://kahoot.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://quizizz.com/favicon.ico" alt="Quizizz" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Quizizz</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://quizizz.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Course Materials:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.canva.com/favicon.ico" alt="Canva" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Canva</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.canva.com/education" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.google.com/favicon.ico" alt="Google Slides" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Google Slides</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://slides.google.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Student Engagement:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.mentimeter.com/favicon.ico" alt="Mentimeter" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Mentimeter</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.mentimeter.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://padlet.com/favicon.ico" alt="Padlet" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Padlet</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://padlet.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Virtual Classrooms:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.google.com/favicon.ico" alt="Google Classroom" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Google Classroom</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://classroom.google.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://zoom.us/favicon.ico" alt="Zoom" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Zoom</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://zoom.us" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'digital-marketing') {
                // Digital Marketing Workflow (Free Tools Only)
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">For SEO:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.semrush.com/favicon.ico" alt="SEMrush" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">SEMrush</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.semrush.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://neilpatel.com/favicon.ico" alt="Ubersuggest" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Ubersuggest</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://neilpatel.com/ubersuggest" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Social Media Management:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://buffer.com/favicon.ico" alt="Buffer" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Buffer</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://buffer.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.hootsuite.com/favicon.ico" alt="Hootsuite" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Hootsuite</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.hootsuite.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Content Creation:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.canva.com/favicon.ico" alt="Canva" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Canva</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.canva.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://chat.openai.com/favicon.ico" alt="ChatGPT" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">ChatGPT</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Email Marketing:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://mailchimp.com/favicon.ico" alt="Mailchimp" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Mailchimp</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://mailchimp.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.sendinblue.com/favicon.ico" alt="Sendinblue" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Sendinblue</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.sendinblue.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Analytics:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.google.com/favicon.ico" alt="Google Analytics" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Google Analytics</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.hotjar.com/favicon.ico" alt="Hotjar" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Hotjar</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.hotjar.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Keyword Research:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://keywordtool.io/favicon.ico" alt="Keyword Tool" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Keyword Tool</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://keywordtool.io" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://answerthepublic.com/favicon.ico" alt="Answer The Public" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Answer The Public</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://answerthepublic.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'mobile-app-dev') {
                // Mobile App Development Workflow
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">For App Design:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.figma.com/favicon.ico" alt="Figma" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Figma</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.figma.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.sketch.com/favicon.ico" alt="Sketch" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Sketch</h3>
                                        <span class="status-badge premium">Premium</span>
                                    </div>
                                </div>
                                <a href="https://www.sketch.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Cross-Platform Development:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://reactnative.dev/favicon.ico" alt="React Native" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">React Native</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://reactnative.dev" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://flutter.dev/favicon.ico" alt="Flutter" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Flutter</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://flutter.dev" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Native iOS Development:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://developer.apple.com/favicon.ico" alt="Swift" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Swift & Xcode</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://developer.apple.com/swift/" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Native Android Development:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://developer.android.com/favicon.ico" alt="Android Studio" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Android Studio</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://developer.android.com/studio" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For App Testing:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://firebase.google.com/favicon.ico" alt="Firebase Test Lab" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Firebase Test Lab</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://firebase.google.com/products/test-lab" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.browserstack.com/favicon.ico" alt="BrowserStack" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">BrowserStack</h3>
                                        <span class="status-badge premium">Premium</span>
                                    </div>
                                </div>
                                <a href="https://www.browserstack.com/app-live" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For App Analytics:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://firebase.google.com/favicon.ico" alt="Firebase Analytics" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Firebase Analytics</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://firebase.google.com/products/analytics" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else if (workflowId === 'email-marketing') {
                // Email Marketing Workflow
                websitesList.innerHTML = `
                    <div class="category-section">
                        <h2 class="category-title">For Email Content Creation:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://chat.openai.com/favicon.ico" alt="ChatGPT" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">ChatGPT</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Email Marketing Platforms:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://mailchimp.com/favicon.ico" alt="Mailchimp" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Mailchimp</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://mailchimp.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.sendinblue.com/favicon.ico" alt="Sendinblue" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Sendinblue</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.sendinblue.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Email Design:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.canva.com/favicon.ico" alt="Canva" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Canva</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://www.canva.com/email-headers/" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Email Analytics:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://www.google.com/favicon.ico" alt="Google Analytics" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Google Analytics</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="category-section">
                        <h2 class="category-title">For Email Automation:</h2>
                        <div class="workflow-tools-grid">
                            <div class="website-card">
                                <div class="website-info">
                                    <div class="website-logo-container">
                                        <img src="https://zapier.com/favicon.ico" alt="Zapier" class="website-logo">
                                    </div>
                                    <div>
                                        <h3 class="website-name">Zapier</h3>
                                        <span class="status-badge free">Free</span>
                                    </div>
                                </div>
                                <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" class="access-button">
                                    <span>Access</span>
                                    <i data-lucide="external-link"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // For other workflows, use the existing logic
                const workflowTools = toolsData.filter(tool => 
                    tool.workflows && tool.workflows.includes(workflowId)
                );

                if (workflowTools.length > 0) {
                    websitesList.innerHTML = workflowTools.map(tool => `
                        <div class="website-card">
                            <div class="website-info">
                                <div class="website-logo-container">
                                    <img src="${tool.logo}" alt="${tool.name}" class="website-logo" onerror="this.onerror=null; this.parentElement.innerHTML='<i data-lucide=\'globe\'></i>';">
                                </div>
                                <div>
                                    <h2 class="website-name">${tool.name}</h2>
                                    <span class="status-badge">${tool.status || 'Free'}</span>
                                </div>
                            </div>
                            <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="access-button">
                                <span>Access</span>
                                <i data-lucide="external-link"></i>
                            </a>
                        </div>
                    `).join('');
                } else {
                    websitesList.innerHTML = `
                <div class="text-center py-8">
                            <p class="text-lg text-gray-600 dark:text-gray-300">No tools available for this workflow yet.</p>
                </div>
            `;
                }
            }
        }
        
        lucide.createIcons();
    }

    // Function to handle back navigation
    function handleBackNavigation() {
        // Use the browser's history API to go back
        history.back();
        
        // Force a re-render after a short delay to ensure content is displayed
        setTimeout(() => {
            // Make sure we're on the home page
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                if (mainContent) {
                    mainContent.style.display = 'block';
                    mainContent.classList.remove('hidden');
                }
                if (toolPage) {
                    toolPage.classList.add('hidden');
                }
                // Show footer when returning to home page
                setToolPageMode(false);
                
                // Get the last active tab from session storage
                const lastActiveTabId = sessionStorage.getItem('lastActiveTab') || 'tools';
                
                // Make sure the correct tab is active
                const tabToActivate = document.querySelector(`.tab[data-tab="${lastActiveTabId}"]`);
                if (tabToActivate && !tabToActivate.classList.contains('active')) {
                    // Remove active class from all tabs
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    // Add active class to the last active tab
                    tabToActivate.classList.add('active');
                    
                    // Update tab content visibility
                    const isTools = lastActiveTabId === 'tools';
                    if (toolsGrid && workflowsGrid) {
                        toolsGrid.classList.toggle('hidden', !isTools);
                        workflowsGrid.classList.toggle('hidden', isTools);
                    }
                }
                
                // Re-render the appropriate content based on active tab
                if (lastActiveTabId === 'tools') {
                    renderTools('');
                } else if (lastActiveTabId === 'workflows') {
                    renderWorkflows('');
                }
                
                // Restore the saved scroll position for the active tab
                console.log(`Restoring ${lastActiveTabId} scroll position: ${tabScrollPositions[lastActiveTabId] || 0}px`);
                setTimeout(() => {
                    window.scrollTo({
                        top: tabScrollPositions[lastActiveTabId] || 0,
                        behavior: 'auto'
                    });
                }, 200);
            }
        }, 100);
    }
    
    // Back Button
    const backButton = document.querySelector('.back-button');
    if (backButton && toolPage && mainContent) {
        backButton.addEventListener('click', handleBackNavigation);
        
        // Back navigation gesture has been removed


    }

    // Add resize listener to re-render tools when screen size changes
    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.tab.active');
        if (activeTab && activeTab.dataset.tab === 'tools') {
            renderTools('');
        }
    });

    // Initial Render
    renderTools('');
    renderWorkflows('');
    
    // Set initial tool page mode based on current page
    if (window.location.pathname.includes('/tools/') || 
        (toolPage && !toolPage.classList.contains('hidden'))) {
        setToolPageMode(true);
    } else {
        setToolPageMode(false);
    }
    


    



    // Desktop Navigation Click Handlers
    const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
    desktopNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                const text = link.querySelector('span').textContent;
                if (text.includes('About Us')) {
                    window.location.href = 'about.html';
                } else if (text.includes('Privacy Policy')) {
                    window.location.href = 'privacy.html';
                }
            }
        });
    });




    
    // Clear form fields on page load for login and signup forms
    // const loginForm = document.getElementById('loginForm');
    // if (loginForm) {
    //     loginForm.reset();
    //     const loginInputs = loginForm.querySelectorAll('input');
    //     loginInputs.forEach(input => {
    //         input.value = '';
    //     });
    // }
    
    // // Clear signup form
    // const signupForm = document.getElementById('signupForm');
    // if (signupForm) {
    //     signupForm.reset();
    //     const signupInputs = signupForm.querySelectorAll('input');
    //     signupInputs.forEach(input => {
    //         input.value = '';
    //     });
    // }
});
// Function to handle logo loading errors with HTTPS fallback
function handleLogoError(img) {
    img.onerror = null;
    
    // Convert HTTP to HTTPS if needed
    if (img.src.includes('http://')) {
        img.src = img.src.replace('http://', 'https://');
        return;
    }
    
    // Try default logo first
    if (!img.src.includes('assets/default-logo.png')) {
        img.src = 'assets/default-logo.png';
        return;
    }
    
    // If default logo also fails, create a fallback with colored background
    const name = img.alt || 'Logo';
    const initial = name.charAt(0).toUpperCase();
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'];
    const colorIndex = initial.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex].replace('#', '');
    
    img.src = `https://via.placeholder.com/32/${bgColor}/ffffff?text=${initial}`;
    img.classList.add('fallback-logo');
    img.style.borderRadius = '4px';
}