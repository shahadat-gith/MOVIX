const STORAGE_KEY = "movix_search_history";
const MAX_HISTORY = 10;

export const getLocalSearchHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveLocalSearch = (query, type) => {
  if (!query?.trim()) return;

  const history = getLocalSearchHistory();

  const updated = [
    { query: query.trim(), type },
    ...history.filter(
      (item) =>
        !(
          item.query.toLowerCase() === query.trim().toLowerCase() &&
          item.type === type
        )
    ),
  ].slice(0, MAX_HISTORY);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  return updated;
};

export const removeLocalSearch = (query, type) => {
  const updated = getLocalSearchHistory().filter(
    (item) =>
      !(
        item.query === query &&
        item.type === type
      )
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  return updated;
};

export const clearLocalSearch = () => {
  localStorage.removeItem(STORAGE_KEY);
  return [];
};