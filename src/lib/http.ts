export async function httpGet(API_URL: string | URL | Request) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(API_URL);
      clearTimeout(timeout);
      // console.log("uri",API_URL);
      if (!response.ok) {
        console.error(`Error ${response.status}: ${response.statusText}`);
        throw new Error('Failed to fetch matches');
      }
      return response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }