function getCsrfToken(): string {
    if (typeof document === 'undefined') return '';
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        const c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') || '' : '';
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
    const headers = new Headers(options.headers || {});

    // Add default headers for Laravel APIs
    if (!headers.has('X-Requested-With')) {
        headers.set('X-Requested-With', 'XMLHttpRequest');
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    // Inject CSRF token for non-GET/HEAD methods
    const method = (options.method || 'GET').toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            headers.set('X-XSRF-TOKEN', csrfToken);
        }
    }

    const response = await fetch(path, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorData: any;
        try {
            errorData = await response.json();
        } catch {
            errorData = { message: 'Erro na requisição' };
        }
        throw new Error(
            errorData.error || errorData.message || `Erro ${response.status}`,
        );
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return;
    }

    return response.json();
}

export const http = {
    get: <T = any>(path: string, options?: RequestInit): Promise<T> =>
        request(path, { ...options, method: 'GET' }),

    post: <T = any>(
        path: string,
        body?: any,
        options?: RequestInit,
    ): Promise<T> =>
        request(path, {
            ...options,
            method: 'POST',
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    put: <T = any>(
        path: string,
        body?: any,
        options?: RequestInit,
    ): Promise<T> =>
        request(path, {
            ...options,
            method: 'PUT',
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    patch: <T = any>(
        path: string,
        body?: any,
        options?: RequestInit,
    ): Promise<T> =>
        request(path, {
            ...options,
            method: 'PATCH',
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    delete: <T = any>(path: string, options?: RequestInit): Promise<T> =>
        request(path, { ...options, method: 'DELETE' }),
};
