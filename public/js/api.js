const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = {
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async post(endpoint, data = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    news: {
        getAll: (lang = 'en', limit = null) => {
            const params = { lang };
            if (limit) params.limit = limit;
            return api.get('/news', params);
        },
        getById: (id, lang = 'en') => {
            return api.get(`/news/${id}`, { lang });
        }
    },

    plantations: {
        getAll: () => {
            return api.get('/plantations');
        }
    },

    mangroves: {
        getAll: (resolution = '250k') => {
            return api.get('/mangroves', { resolution });
        }
    },

    contact: {
        send: (data) => {
            return api.post('/contact', data);
        }
    },

    auth: {
        register: (data) => {
            return api.post('/register', data);
        },
        login: (data) => {
            return api.post('/login', data);
        }
    },

    savedLocations: {
        getAll: async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/saved-locations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            return await response.json();
        },
        save: async (data) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/saved-locations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        },
        delete: async (id) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/saved-locations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            return await response.json();
        }
    }
};
