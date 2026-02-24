
import * as dotenv from 'dotenv'; dotenv.config();
import { fetchRawgGameMetadata } from './src/services/rawg';

(async () => {
    const res1 = await fetchRawgGameMetadata('逆転裁判123');
    console.log('Result for 逆転裁判123:', res1?.name);

    const res2 = await fetchRawgGameMetadata('Minecraft');
    console.log('Result for Minecraft:', res2?.name);
})();

