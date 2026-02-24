
import * as dotenv from 'dotenv'; dotenv.config();

(async () => {
    const RAWG_API_KEY = process.env.RAWG_API_KEY || '';
    const url = new URL('https://api.rawg.io/api/games');
    url.searchParams.append('key', RAWG_API_KEY);
    url.searchParams.append('search', '逆転裁判123');
    url.searchParams.append('search_exact', 'true');
    url.searchParams.append('page_size', '5');

    const response = await fetch(url.toString());
    const data = await response.json();
    console.log('Exact search matches for 逆転裁判123:');
    console.log(data.results.map((r: any) => r.name));
})();

