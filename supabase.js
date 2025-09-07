// Supabase configuration
const SUPABASE_URL = 'https://fgfajxlophbkqexgkzwu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZmFqeGxvcGhia3FleGdrend1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMjI2MDYsImV4cCI6MjA3Mjc5ODYwNn0.xPw6BFVK2PBbvGtRKf6wIF-lbbhUC8rTIAibY--n6Vs';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database functions
const db = {
    // Insert tool data
    async addTool(toolData) {
        const { data, error } = await supabase
            .from('tools')
            .insert([toolData]);
        return { data, error };
    },

    // Get all tools
    async getTools() {
        const { data, error } = await supabase
            .from('tools')
            .select('*');
        return { data, error };
    },

    // Get tools by category
    async getToolsByCategory(category) {
        const { data, error } = await supabase
            .from('tools')
            .select('*')
            .eq('category', category);
        return { data, error };
    },

    // Search tools
    async searchTools(query) {
        const { data, error } = await supabase
            .from('tools')
            .select('*')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
        return { data, error };
    }
};