import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { prisma } from '../db';
import { fetchRawgTopGames } from '../services/rawg';
import { fetchSteamPrice } from '../services/steam';

const router = Router();

// Get recommendations (excluding owned games)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;

        // 1. Get user's HIGH-PRIORITY/RECENT owned games to avoid recommending what they have
        // Since RAWG uses different IDs, we'll exclude by exact title instead for now
        const userGames = await prisma.userGame.findMany({
            where: { userId },
            include: { game: true }
        });
        const ownedTitles = new Set(userGames.map(ug => ug.game.title.toLowerCase()));

        // 2. Fetch popular games from RAWG
        const rawgGames = await fetchRawgTopGames(40); // Fetch a bit more to ensure we have enough after filtering

        // 3. Filter out games the user already owns (by title)
        const filteredGames = rawgGames.filter(rg => !ownedTitles.has(rg.name.toLowerCase())).slice(0, 20);

        // 4. Fetch Steam prices in parallel (limit to top 20 to avoid rate limits)
        const formatted = await Promise.all(filteredGames.map(async (game) => {
            let price = 0;
            let discountRate = 0;
            let isOnSale = false;
            let platforms = [];
            let gameStore = 'UNKNOWN';

            // Try to get steam price
            const steamData = await fetchSteamPrice(game.name);
            if (steamData) {
                price = steamData.final;
                discountRate = steamData.discount_percent;
                isOnSale = discountRate > 0;
                platforms.push('STEAM'); // We know it's on Steam if we found a price
                gameStore = 'STEAM';
            }

            const reasons = [];
            if (isOnSale) reasons.push('今Steamでセール中！');
            if (game.metacritic && game.metacritic >= 85) reasons.push('世界的な高評価 (85+)');
            else if (game.rating && game.rating >= 4.0) reasons.push('プレイヤーから高評価');
            else if (!isOnSale) reasons.push('世界中で大人気');

            return {
                id: `rawg-${game.id}`, // Temporary ID for frontend
                title: game.name,
                imageUrl: game.background_image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
                price,
                store: gameStore,
                platforms,
                rating: game.rating,
                ownedType: 'NONE', // They don't own it
                reasons,
                isOnSale,
                discountRate
            };
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Fetch recommendations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
