const SITE_BASE_URL = 'http://localhost:3000';

function cleanRoutePath(path: string): string {
    const hashRoute      = path.startsWith('#/') ? path.slice(1) : path;
    const withoutOrigin  = hashRoute.replace(/^https?:\/\/[^/]+/i, '');
    const withoutQuery   = withoutOrigin.split('?')[0].split('#')[0];
    const normalized     = `/${withoutQuery.replace(/^\/+/, '')}`;
    return normalized === '/' ? '/' : normalized.replace(/\/+$/, '');
}

export function getCanonicalShareUrl(path?: string): string {
    let routePath = path;

    if (!routePath && typeof window !== 'undefined') {
        routePath = window.location.hash.startsWith('#/')
            ? window.location.hash.slice(1)
            : window.location.pathname;
    }

    return `${SITE_BASE_URL}${cleanRoutePath(routePath || '/')}`;
}
