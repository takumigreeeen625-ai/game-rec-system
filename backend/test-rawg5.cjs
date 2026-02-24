
require('dotenv').config();
(async () => {
    const RAWG_API_KEY = process.env.RAWG_API_KEY || '';
    const url = new URL('https://api.rawg.io/api/games');
    url.searchParams.append('key', RAWG_API_KEY);
    url.searchParams.append('search', '逆転裁判123');
    url.searchParams.append('page_size', '10');

    const response = await fetch(url.toString());
    const data = await response.json();
    console.log('Results for Japanese test:', data.results?.map(r => ({ name: r.name, added: r.added })));
})();

