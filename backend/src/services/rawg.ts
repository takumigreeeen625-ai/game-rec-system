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
        return null; // Silent fallback
    }

    try {
        // RAWG search is highly optimized for English. 
        // If the title contains Japanese characters, translate it first.
        let searchQuery = gameTitle;
        if (/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(gameTitle)) {
            try {
                // Translate from Japanese to English
                searchQuery = await translate(gameTitle, { from: 'ja', to: 'en' });
                console.log(`Translated "${gameTitle}" to "${searchQuery}" for RAWG API`);
            } catch (translationError) {
                console.warn('Translation failed, falling back to original title:', translationError);
            }
        }

        // Search for the game by title
        const url = new URL(`${RAWG_API_URL}/games`);
        url.searchParams.append('key', RAWG_API_KEY);
        url.searchParams.append('search', searchQuery);
        url.searchParams.append('page_size', '1'); // We only need the top match
        url.searchParams.append('search_exact', 'false');

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

        if (data.results && data.results.length > 0) {
            const match = data.results[0];
            return {
                id: match.id,
                name: match.name,
                background_image: match.background_image || null,
                released: match.released,
                rating: match.rating,
                metacritic: match.metacritic
            };
        }

        console.log(`No results found on RAWG for title: ${gameTitle}`);
        return null;

    } catch (error) {
        console.error('Error fetching game data from RAWG:', error);
        return null; // Return null on error so the application doesn't crash
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
