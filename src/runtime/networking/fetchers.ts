// Logic to handle chunk downloading and resource fetching
export const fetchAsset = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  return response;
};
