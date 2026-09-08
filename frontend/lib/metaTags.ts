/**
 * Utility to dynamically update Open Graph and Twitter meta tags
 * for social media sharing (WhatsApp, Facebook, Twitter, etc.)
 */

const DEFAULT_SITE_NAME   = 'SMK PKP 1 Jakarta Islamic School';
const DEFAULT_OG_IMAGE    = 'http://localhost:5001/public/uploads/1.png';
const DEFAULT_TITLE       = 'SMK PKP 1 Jakarta Islamic School';
const DEFAULT_DESCRIPTION = 'Sekolah Menengah Kejuruan Islam unggulan di Jakarta. Mencetak generasi muda berakhlak mulia, kompeten, dan berdaya saing global.';

interface MetaTagsConfig {
    title: string;
    description?: string;
    image?: string | null;
    url?: string;
    type?: string;
}

function setMetaTag(property: string, content: string, isName: boolean = false) {
    const attr = isName ? 'name' : 'property';
    let element = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement;

    if (element) {
        element.setAttribute('content', content);
    } else {
        element = document.createElement('meta');
        element.setAttribute(attr, property);
        element.setAttribute('content', content);
        document.head.appendChild(element);
    }
}

export function updateMetaTags(config: MetaTagsConfig) {
    const { title, description, image, url, type = 'article' } = config;
    const pageUrl         = url || window.location.href;
    const pageImage       = image || DEFAULT_OG_IMAGE;
    const pageDescription = description || DEFAULT_DESCRIPTION;
    const fullTitle       = `${title} | ${DEFAULT_SITE_NAME}`;

    document.title = fullTitle;

    setMetaTag('og:type',        type);
    setMetaTag('og:url',         pageUrl);
    setMetaTag('og:title',       fullTitle);
    setMetaTag('og:description', pageDescription);
    setMetaTag('og:image',       pageImage);
    setMetaTag('og:site_name',   DEFAULT_SITE_NAME);

    setMetaTag('twitter:card',        'summary_large_image');
    setMetaTag('twitter:url',         pageUrl);
    setMetaTag('twitter:title',       fullTitle);
    setMetaTag('twitter:description', pageDescription);
    setMetaTag('twitter:image',       pageImage);

    setMetaTag('description', pageDescription, true);
}

export function resetMetaTags() {
    document.title = DEFAULT_TITLE;

    setMetaTag('og:type',        'website');
    setMetaTag('og:url',         'http://localhost:3000/');
    setMetaTag('og:title',       DEFAULT_TITLE);
    setMetaTag('og:description', DEFAULT_DESCRIPTION);
    setMetaTag('og:image',       DEFAULT_OG_IMAGE);

    setMetaTag('twitter:card',        'summary_large_image');
    setMetaTag('twitter:url',         'http://localhost:3000/');
    setMetaTag('twitter:title',       DEFAULT_TITLE);
    setMetaTag('twitter:description', DEFAULT_DESCRIPTION);
    setMetaTag('twitter:image',       DEFAULT_OG_IMAGE);

    setMetaTag('description', DEFAULT_DESCRIPTION, true);
}

export function stripHtml(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}
