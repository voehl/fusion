export function setToken(token) {
    localStorage.setItem('token', JSON.stringify(token));
}

export function getToken() {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
        throw new Error('Invalid token');
    }
    return JSON.parse(tokenString);
}

export function validateToken(token) {
    if (!token.tokenType) {
        throw new Error('Invalid tokenType');
    }
    if (!token.accessToken) {
        throw new Error('Invalid accessToken');
    }
}

export function getRequestAuthorizationHeaders() {
    const token = getToken();
    validateToken(token);
    return {
        headers: {
            'Authorization': `${token.tokenType} ${token.accessToken}`
        }
    };
}