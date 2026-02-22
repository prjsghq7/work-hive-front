let backend ;

const hostname = window && window.location && window.location.hostname;

if (hostname==="localhost") {
    backend="http://localhost:8080";
} else {
    backend = window.location.origin;
}

export const API_BASE_URL = `${backend}`;
export const WS_BASE_URL = `${backend}/ws`;