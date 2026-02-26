import axios from 'axios';
import * as cheerio from 'cheerio';

export const fetchAndExtractText = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            timeout: 10000
        });

        const $ = cheerio.load(data);

        // Remove script, style, and metadata tags that clutter the text
        $('script, style, noscript, iframe, img, svg, header, footer, nav').remove();

        // Target common recipe containers if they exist to reduce noise, otherwise grab body
        let content = '';
        if ($('.tasty-recipes').length > 0) {
            content = $('.tasty-recipes').text();
        } else if ($('.wprm-recipe-container').length > 0) {
            content = $('.wprm-recipe-container').text();
        } else if ($('[class*="recipe"]').length > 0) {
            content = $('[class*="recipe"]').text();
        } else {
            content = $('body').text();
        }

        // Clean up whitespace
        const cleanText = content.replace(/\s+/g, ' ').trim();
        return cleanText;

    } catch (error) {
        console.error('Scraping Error Message:', error.message);
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error("The recipe URL was not found (404 Error). Please check the link and try again.");
            } else if (error.response.status === 403 || error.response.status === 401) {
                throw new Error("This website blocked our request (Forbidden). Please copy and paste the text instead.");
            }
        }
        throw new Error('Failed to fetch and extract content from the provided URL. Ensure it is accessible.');
    }
};
