// RAWG API Service Client
import translate from 'translate';

const RAWG_API_URL = 'https://api.rawg.io/api';
translate.engine = 'google'; // Free google translate engine

export interface RawgGame {
    id: number;
    name: string;
    background_image: string;
    released?: string;
    rating?: number;
    metacritic?: number;
}

export const fetchRawgGameMetadata = async (gameTitle: string): Promise<RawgGame | null> => {
    const RAWG_API_KEY = process.env.RAWG_API_KEY;

    if (!RAWG_API_KEY) {
        console.warn('⚠️ RAWG_API_KEY is not set in environment variables. Skipping metadata fetch.');
        return null;
    }

    const searchRawg = async (query: string) => {
        const url = new URL(`${RAWG_API_URL}/games`);
        url.searchParams.append('key', RAWG_API_KEY);
        url.searchParams.append('search', query);
        url.searchParams.append('page_size', '5'); // Fetch top 5 to find the most relevant/popular
        url.searchParams.append('search_exact', 'false');

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`RAWG API request failed with status: ${response.status}`);
        }
        return await response.json();
    };

    const getBestMatch = (results: any[]) => {
        if (!results || results.length === 0) return null;
        // Sort by 'added' count (popularity on RAWG) to avoid weird obscure games that happen to share a name
        const sorted = [...results].sort((a, b) => (b.added || 0) - (a.added || 0));
        return sorted[0];
    };

    try {
        // 1. Try native search first
        let data = await searchRawg(gameTitle);
        let bestMatch = getBestMatch(data.results);

        // 2. If it's a Japanese title and the native search yielded poor results (e.g. added < 50)
        // Try translating to English for a potentially better match
        const isJapanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(gameTitle);
        if (isJapanese && (!bestMatch || (bestMatch.added || 0) < 50)) {
            try {
                const translatedQuery = await translate(gameTitle, { from: 'ja', to: 'en' });
                console.log(`Translated "${gameTitle}" to "${translatedQuery}" for RAWG API fallback`);
                const translatedData = await searchRawg(translatedQuery);
                const translatedBestMatch = getBestMatch(translatedData.results);

                // If translated search yields a clearly more popular game, use it
                if (translatedBestMatch && (translatedBestMatch.added || 0) > (bestMatch?.added || 0)) {
                    bestMatch = translatedBestMatch;
                }
            } catch (translationError) {
                console.warn('Translation failed, sticking to native search results:', translationError);
            }
        }

        if (bestMatch) {
            return {
                id: bestMatch.id,
                name: bestMatch.name,
                background_image: bestMatch.background_image || null,
                released: bestMatch.released,
                rating: bestMatch.rating,
                metacritic: bestMatch.metacritic
            };
        }

        console.log(`No results found on RAWG for title: ${gameTitle}`);
        return null;

    } catch (error) {
        console.error('Error fetching game data from RAWG:', error);
        return null;
    }
};

/**
 * Fetch top rated/popular games from RAWG for recommendations
 */
export const fetchRawgTopGames = async (pageSize: number = 20): Promise<RawgGame[]> => {
    const RAWG_API_KEY = process.env.RAWG_API_KEY;

    if (!RAWG_API_KEY) {
        console.warn('⚠️ RAWG_API_KEY is not set in environment variables. Returning empty array.');
        return [];
    }

    try {
        const url = new URL(`${RAWG_API_URL}/games`);
        url.searchParams.append('key', RAWG_API_KEY);
        url.searchParams.append('ordering', '-added'); // Most popular/added games
        url.searchParams.append('page_size', pageSize.toString());

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`RAWG API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.results && Array.isArray(data.results)) {
            return data.results.map((game: any) => ({
                id: game.id,
                name: game.name,
                background_image: game.background_image || null,
                released: game.released,
                rating: game.rating,
                metacritic: game.metacritic
            }));
        }

        return [];

    } catch (error) {
        console.error('Error fetching top games from RAWG:', error);
        return [];
    }
};
