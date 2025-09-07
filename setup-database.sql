-- Create tools table
CREATE TABLE tools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    logo VARCHAR(500),
    link VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO tools (name, description, category, logo, link) VALUES
('GitHub Copilot', 'AI pair programmer for code suggestions', 'code-generators', 'https://github.com/favicon.ico', 'https://github.com/features/copilot'),
('ChatGPT', 'Advanced AI chatbot for text generation', 'text-generators', 'https://openai.com/favicon.ico', 'https://chat.openai.com'),
('DALL-E 2', 'Create realistic images from text descriptions', 'image-generators', 'https://openai.com/favicon.ico', 'https://openai.com/dall-e-2/'),
('Runway ML', 'AI-powered video editing and generation', 'video-generators', 'https://runwayml.com/favicon.ico', 'https://runwayml.com'),
('ElevenLabs', 'AI voice synthesis and cloning platform', 'voice-generators', 'https://elevenlabs.io/favicon.ico', 'https://elevenlabs.io');