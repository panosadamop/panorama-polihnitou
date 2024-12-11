import axios from 'axios';

const API_BASE_URL = 'https://panoramapolihnitou.gr/wp-json/wp/v2/';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Endpoints
/**
 * Fetch posts with optional query parameters
 * @param params Object containing query parameters (e.g., page, per_page)
 * @returns Promise resolving to the API response
 */
export const getPosts = (params: Record<string, any> = {}) =>
    api.get('posts', { params });
export const getPostById = (id: number) => api.get(`posts/${id}`);
export const getCategories = (params = {}) => api.get('categories', { params });
export const getPages = () => api.get('pages');
