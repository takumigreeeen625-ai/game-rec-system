
import * as dotenv from 'dotenv'; dotenv.config();

(async () => {
    const RAWG_API_KEY = process.env.RAWG_API_KEY || '';
    const url = new URL('https://api.rawg.io/api/games');
    url.searchParams.append('key', RAWG_API_KEY);
    url.searchParams.append('search', '逆転裁判123');
    url.searchParams.append('page_size', '5');

    const response = await fetch(url.toString());
    const data = await response.json();
    console.log('Search matches for 逆転裁判123:');
    console.log(data.results.map((r: any) => r.name));
    
    // Also test english translated query just to compare
    const url2 = new URL('https://api.rawg.io/api/games');
    url2.searchParams.append('key', RAWG_API_KEY);
    url2.searchParams.append('search', 'Phoenix Wright: Ace Attorney Trilogy');
    url2.searchParams.append('page_size', '1');
    const response2 = await fetch(url2.toString());
    const data2 = await response2.json();
    console.log('Search match for translated title:');
    console.log(data2.results.map((r: any) => r.name));
})();

