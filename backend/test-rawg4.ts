
import * as dotenv from 'dotenv'; dotenv.config();

(async () => {
    const RAWG_API_KEY = process.env.RAWG_API_KEY || '';
    const url = new URL('https://api.rawg.io/api/games');
    url.searchParams.append('key', RAWG_API_KEY);
    url.searchParams.append('search', '逆転裁判123');
    // no search_exact
    url.searchParams.append('page_size', '10');

    const response = await fetch(url.toString());
    const data = await response.json();
    console.log(data.results.map((r: any) => ({ name: r.name, rating: r.rating, ratings_count: r.ratings_count })));
})();

