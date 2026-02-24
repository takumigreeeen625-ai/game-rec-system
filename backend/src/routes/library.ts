import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { prisma } from '../db';
import { fetchRawgGameMetadata } from '../services/rawg';

const router = Router();

// Get user's library
router.get('/games', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;

        const userGames = await prisma.userGame.findMany({
            where: { userId },
            include: {
                game: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const formattedGames = userGames.map(ug => ({
            ...ug.game,
            store: ug.store, // Temporary mapping to avoid breaking frontend immediately
            platforms: [ug.store], // New property for frontend Phase 5 array mapping
            ownedType: ug.ownedType,
            userGameId: ug.id,
            addedAt: ug.createdAt
        }));

        // Merge duplicate games into a single entry with multiple platforms
        const mergedGames = formattedGames.reduce((acc, current) => {
            const existing = acc.find((item: any) => item.id === current.id);
            if (existing) {
                if (!existing.platforms.includes(current.store)) {
                    existing.platforms.push(current.store);
                }
            } else {
                acc.push(current);
            }
            return acc;
        }, [] as any[]);

        res.json(mergedGames);
    } catch (error) {
        console.error('Fetch library error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a game manually
router.post('/add', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const { title, store, ownedType } = req.body;

        if (!title || !store || !ownedType) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        // Since we don't have a giant master DB yet, just create the game if it doesn't match an exact title/store combination
        // Search by title only for de-duplication
        let game = await prisma.game.findFirst({
            where: { title }
        });

        if (!game) {
            let metadata = null;
            try {
                metadata = await fetchRawgGameMetadata(title);
            } catch (err) {
                console.error("Failed to fetch RAWG metadata:", err);
            }

            game = await prisma.game.create({
                data: {
                    title: metadata?.name || title,
                    price: 0, // Placeholder
                    rating: metadata?.rating || 0,
                    imageUrl: metadata?.background_image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', // Default placeholder
                }
            });
        } else if (game.imageUrl === 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80' || !game.imageUrl) {
            // Auto-heal existing games that only have placeholders
            try {
                const metadata = await fetchRawgGameMetadata(title);
                if (metadata?.background_image) {
                    game = await prisma.game.update({
                        where: { id: game.id },
                        data: {
                            title: metadata.name || title,
                            imageUrl: metadata.background_image,
                            rating: metadata.rating || 0
                        }
                    });
                }
            } catch (err) {
                console.error("Failed to fetch RAWG metadata for auto-heal:", err);
            }
        }

        // Check if already owned ON THIS EXACT STORE
        const existing = await prisma.userGame.findUnique({
            where: {
                userId_gameId_store: {
                    userId,
                    gameId: game.id,
                    store
                }
            }
        });

        if (existing) {
            res.status(409).json({ error: 'Game already in library' });
            return;
        }

        const userGame = await prisma.userGame.create({
            data: {
                userId,
                gameId: game.id,
                store,
                ownedType
            },
            include: {
                game: true
            }
        });

        res.status(201).json({
            ...userGame.game,
            ownedType: userGame.ownedType,
            userGameId: userGame.id
        });
    } catch (error) {
        console.error('Add game error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Bulk add games to user's library
router.post('/add-bulk', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { games } = req.body; // Expecting { games: [{ title: string, store: string, ownedType: string }] }

        if (!userId) {
            res.status(401).json({ error: '認証が必要です' });
            return;
        }

        if (!Array.isArray(games) || games.length === 0) {
            res.status(400).json({ error: 'games配列は必須で、空であってはいけません。' });
            return;
        }

        const results = {
            added: 0,
            skipped: 0,
            errors: 0
        };

        // TODO: Handle transactions for performance if needed, but for MVP loop is fine
        for (const gameData of games) {
            try {
                const { title, store, ownedType } = gameData;

                if (!title) {
                    results.skipped++;
                    continue;
                }

                // 1. Check if the game exists in the master Game table
                let game = await prisma.game.findFirst({
                    where: {
                        title: { equals: title }
                    }
                });

                // 2. If not, create it
                if (!game) {
                    let metadata = null;
                    try {
                        metadata = await fetchRawgGameMetadata(title);
                    } catch (err) {
                        console.error("Failed to fetch RAWG metadata:", err);
                    }

                    game = await prisma.game.create({
                        data: {
                            title: metadata?.name || title, // Use official name if found
                            price: 0,
                            discountRate: 0,
                            isOnSale: false,
                            rating: metadata?.rating || 0,
                            imageUrl: metadata?.background_image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80'
                        }
                    });
                } else if (game.imageUrl === 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80' || !game.imageUrl) {
                    // Auto-heal existing games that only have placeholders
                    try {
                        const metadata = await fetchRawgGameMetadata(title);
                        if (metadata?.background_image) {
                            game = await prisma.game.update({
                                where: { id: game.id },
                                data: {
                                    title: metadata.name || title,
                                    imageUrl: metadata.background_image,
                                    rating: metadata.rating || 0
                                }
                            });
                        }
                    } catch (err) {
                        console.error("Failed to fetch RAWG metadata for auto-heal:", err);
                    }
                }

                // 3. Check if user already owns it ON THIS EXACT STORE
                const existingOwnership = await prisma.userGame.findUnique({
                    where: {
                        userId_gameId_store: {
                            userId,
                            gameId: game.id,
                            store: store || 'UNKNOWN'
                        }
                    }
                });

                if (existingOwnership) {
                    results.skipped++;
                    continue;
                }

                // 4. Register ownership for this platform
                await prisma.userGame.create({
                    data: {
                        userId,
                        gameId: game.id,
                        store: store || 'UNKNOWN',
                        ownedType: ownedType || 'BOOKMARKLET_IMPORTED'
                    }
                });
                results.added++;
            } catch (err) {
                console.error('Error adding individual game in bulk:', err);
                results.errors++;
            }
        }

        res.status(201).json({
            message: '一括登録が完了しました',
            results
        });
    } catch (error) {
        console.error('Add bulk error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});

export default router;
