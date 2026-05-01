export function getApiError(error, fallbackMessage) {
  return error.friendlyMessage || error.response?.data?.message || fallbackMessage;
}

export function getListFromResponse(data, key) {
  const list = data[key] || data;
  return Array.isArray(list) ? list : [];
}

export function getItemFromResponse(data, key) {
  return data[key] || data;
}
