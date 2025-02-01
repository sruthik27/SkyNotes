// Utility functions to handle webpage metadata
export async function getWebpageMetadata(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        const title = doc.querySelector('title')?.textContent || '';
        return { title };
    } catch (error) {
        console.error('Error fetching webpage metadata:', error);
        return { title: '' };
    }
}

export function getFaviconUrl(url) {
    try {
        const urlObj = new URL(url.startsWith('www.') ? `https://${url}` : url);
        const domain = `${urlObj.protocol}//${urlObj.hostname}`;

        // Try Google's favicon service as a reliable fallback
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
        return '';
    }
}