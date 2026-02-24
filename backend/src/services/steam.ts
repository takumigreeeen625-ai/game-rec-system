import translate from 'translate';

const STEAM_API_URL = 'https://store.steampowered.com/api';

export interface SteamGamePrice {
    initial: number;
    final: number;
    discount_percent: number;
}

export const fetchSteamPrice = async (gameTitle: string): Promise<SteamGamePrice | null> => {
    try {
        // Steam search might struggle with Japanese titles if they are registered in English
        // But the storesearch API actually handles Japanese fairly well.
        const url = new URL(`${STEAM_API_URL}/storesearch`);
        url.searchParams.append('term', gameTitle);
        url.searchParams.append('l', 'japanese');
        url.searchParams.append('cc', 'JP');

        const response = await fetch(url.toString(), {
            method: 'GET',
        });

        if (!response.ok) {
            console.warn(`Steam API request failed with status: ${response.status}`);
            return null;
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            // Find the closest match, usually the first app
            const match = data.items.find((item: any) => item.type === 'app');

            if (match && match.price) {
                // Steam returns price in cents/yen*100 (e.g., 340000 = 3400 JPY)
                const initial = Math.floor(match.price.initial / 100);
                const final = Math.floor(match.price.final / 100);
                const discount_percent = initial > 0 ? Math.round(((initial - final) / initial) * 100) : 0;

                return {
                    initial,
                    final,
                    discount_percent
                };
            }
        }
        return null;
    } catch (error) {
        console.error('Error fetching Steam price:', error);
        return null;
    }
};
