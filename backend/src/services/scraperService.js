import axios from 'axios';
import * as cheerio from 'cheerio';
import dns from 'dns/promises';

// ── SSRF blocklist ────────────────────────────────────────────────────────────
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const BLOCKED_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', 'mongo', 'backend']);
const PRIVATE_IP_RE = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|169\.254\.|::1$|fc00:|fd)/;

export const isSafeUrl = async (rawUrl) => {
    let parsed;
    try { parsed = new URL(rawUrl); } catch { return false; }

    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) return false;
    const hostname = parsed.hostname;
    if (BLOCKED_HOSTNAMES.has(hostname.toLowerCase())) return false;
    if (PRIVATE_IP_RE.test(hostname)) return false;

    // DNS-resolve and check the resolved IP to prevent DNS rebinding
    try {
        const addresses = await dns.lookup(hostname, { all: true });
        for (const { address } of addresses) {
            if (PRIVATE_IP_RE.test(address) || BLOCKED_HOSTNAMES.has(address)) return false;
        }
    } catch {
        return false; // DNS failure = refuse
    }

    return true;
};

export const fetchAndExtractText = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            timeout: 10000,
            maxRedirects: 5,
            // Ensure axios doesn't follow redirects to private IPs
            validateStatus: (status) => status >= 200 && status < 300,
        });

        const $ = cheerio.load(data);

        $('script, style, noscript, iframe, img, svg, header, footer, nav').remove();

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

        const cleanText = content.replace(/\s+/g, ' ').trim();
        return cleanText;

    } catch (error) {
        console.error('[SCRAPER]', error.message);
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('The recipe URL was not found (404). Please check the link and try again.');
            } else if (error.response.status === 403 || error.response.status === 401) {
                throw new Error('This website blocked our request. Please copy and paste the text instead.');
            }
        }
        throw new Error('Failed to fetch content from the provided URL. Ensure it is accessible.');
    }
};
