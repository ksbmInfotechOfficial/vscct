const axios = require('axios');
const config = require('../config');

const wpApi = axios.create({
  baseURL: config.wpApiUrl,
  timeout: 10000,
});

const getPosts = async (page = 1, perPage = 10, category = null) => {
  const params = { page, per_page: perPage, _embed: true };
  if (category) params.categories = category;
  
  const response = await wpApi.get('/posts', { params });
  return {
    posts: response.data.map(transformPost),
    total: parseInt(response.headers['x-wp-total']),
    totalPages: parseInt(response.headers['x-wp-totalpages']),
  };
};

const getPost = async (idOrSlug) => {
  const isId = !isNaN(idOrSlug);
  const endpoint = isId ? `/posts/${idOrSlug}` : `/posts?slug=${idOrSlug}`;
  const response = await wpApi.get(endpoint, { params: { _embed: true } });
  const post = isId ? response.data : response.data[0];
  return post ? transformPost(post) : null;
};

const getCategories = async () => {
  const response = await wpApi.get('/categories', { params: { per_page: 100 } });
  return response.data.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    count: cat.count,
  }));
};

const getEvents = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${config.wpApiUrl.replace('/wp/v2', '/tribe/events/v1')}/events`, {
      params: { page, per_page: perPage },
    });
    return {
      events: response.data.events?.map(transformEvent) || [],
      total: response.data.total || 0,
      totalPages: response.data.total_pages || 0,
    };
  } catch (error) {
    return { events: [], total: 0, totalPages: 0 };
  }
};

const transformPost = (post) => ({
  id: post.id,
  title: post.title?.rendered || '',
  excerpt: stripHtml(post.excerpt?.rendered || ''),
  content: post.content?.rendered || '',
  date: post.date,
  modified: post.modified,
  slug: post.slug,
  featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
  categories: post._embedded?.['wp:term']?.[0]?.map(t => ({ id: t.id, name: t.name })) || [],
  author: post._embedded?.author?.[0]?.name || 'VSSCT',
});

const transformEvent = (event) => ({
  id: event.id,
  title: event.title,
  description: stripHtml(event.description || ''),
  startDate: event.start_date,
  endDate: event.end_date,
  venue: event.venue?.venue || '',
  image: event.image?.url || null,
});

const stripHtml = (html) => {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
};

module.exports = {
  getPosts,
  getPost,
  getCategories,
  getEvents,
};
