const API_BASE = "https://api.ngekost.my.id/api/v1";

function getTokens() {
  const raw = localStorage.getItem("ngekost_tokens");
  if (!raw) return null;
  return JSON.parse(raw);
}

function setTokens(tokens) {
  localStorage.setItem("ngekost_tokens", JSON.stringify(tokens));
}

function clearTokens() {
  localStorage.removeItem("ngekost_tokens");
}

async function refreshAccessToken() {
  const tokens = getTokens();
  if (!tokens?.refresh) {
    clearTokens();
    return null;
  }
  const res = await fetch(`${API_BASE}/users/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });
  if (!res.ok) {
    clearTokens();
    return null;
  }
  const data = await res.json();
  const newTokens = { access: data.access, refresh: data.refresh || tokens.refresh };
  setTokens(newTokens);
  return newTokens.access;
}

async function apiFetch(endpoint, options = {}) {
  const { auth = false, raw = false, ...fetchOptions } = options;
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;

  const headers = { ...fetchOptions.headers };
  if (auth) {
    const tokens = getTokens();
    if (tokens?.access) {
      headers["Authorization"] = `Bearer ${tokens.access}`;
    }
  }
  if (!(fetchOptions.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  let res = await fetch(url, { ...fetchOptions, headers });

  if (res.status === 401 && auth) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      headers["Authorization"] = `Bearer ${newAccess}`;
      res = await fetch(url, { ...fetchOptions, headers });
    }
  }

  if (raw) return res;
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.detail || errorData.pesan || `Request failed: ${res.status}`);
    error.status = res.status;
    error.data = errorData;
    throw error;
  }
  return res.json();
}

export const api = {
  // Auth
  login: (data) => apiFetch("/users/auth/login/", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => apiFetch("/users/auth/register/", { method: "POST", body: JSON.stringify(data) }),
  
  // Profile
  getProfile: () => apiFetch("/users/profile/", { auth: true }),
  updateProfile: (data) => apiFetch("/users/profile/", { method: "PATCH", auth: true, body: JSON.stringify(data) }),
  
  // Kost
  getKosts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/kosts/${query ? `?${query}` : ""}`);
  },
  getKostDetail: (id) => apiFetch(`/kosts/${id}/`),
  getKostPaymentMethods: (kostId) => apiFetch(`/kosts/${kostId}/payment-methods/`),
  
  // Rooms
  getRooms: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/rooms/${query ? `?${query}` : ""}`);
  },
  getRoomDetail: (id) => apiFetch(`/rooms/${id}/`),
  getRoomImages: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/room-images/${query ? `?${query}` : ""}`);
  },
  
  // Bookings
  getBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/bookings/${query ? `?${query}` : ""}`, { auth: true });
  },
  getBookingDetail: (id) => apiFetch(`/bookings/${id}/`, { auth: true }),
  createBooking: (data) => apiFetch("/bookings/", { method: "POST", auth: true, body: JSON.stringify(data) }),
  uploadPayment: (bookingId, formData) => apiFetch(`/bookings/${bookingId}/upload_payment/`, {
    method: "POST",
    auth: true,
    body: formData,
  }),
};

export { getTokens, setTokens, clearTokens };
export default api;
