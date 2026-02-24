import { fetchRawgGameMetadata } from './src/services/rawg'; import * as dotenv from 'dotenv'; dotenv.config();
(async () => { const res = await fetchRawgGameMetadata('逆転裁判123'); console.log(JSON.stringify(res, null, 2)); })();
