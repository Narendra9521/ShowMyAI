// Supabase configuration
const SUPABASE_URL = 'https://cfarfcbrsrmexbkrogwz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYXJmY2Jyc3JtZXhia3JvZ3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNjQ1NzEsImV4cCI6MjA3NTY0MDU3MX0.FjE0tXiOjz__hlUxTuG4tgXz5fJrZZvNKUms99vcqwo';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database functions
const db = {
    // Save tool for user
    async saveTool(userId, toolData) {
        const { data, error } = await supabase
            .from('saved_tools')
            .insert({ user_id: userId, tool_data: toolData });
        return { data, error };
    },

    // Get user's saved tools
    async getSavedTools(userId) {
        const { data, error } = await supabase
            .from('saved_tools')
            .select('*')
            .eq('user_id', userId);
        return { data, error };
    },

    // Remove saved tool
    async removeSavedTool(userId, toolData) {
        const toolName = typeof toolData === 'string' ? toolData : toolData.name;
        const { data: existing } = await supabase
            .from('saved_tools')
            .select('id')
            .eq('user_id', userId);
        
        if (existing) {
            const toDelete = existing.filter(item => {
                const saved = typeof item.tool_data === 'string' ? item.tool_data : item.tool_data.name;
                return saved === toolName;
            });
            
            if (toDelete.length > 0) {
                const { data, error } = await supabase
                    .from('saved_tools')
                    .delete()
                    .in('id', toDelete.map(t => t.id));
                return { data, error };
            }
        }
        return { data: null, error: null };
    },

    // Sync all user tools
    async syncUserTools(userId, tools) {
        await supabase.from('saved_tools').delete().eq('user_id', userId);
        if (tools.length > 0) {
            const records = tools.map(tool => ({ user_id: userId, tool_data: tool }));
            await supabase.from('saved_tools').insert(records);
        }
    }
};
