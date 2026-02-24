import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { prisma } from '../db';

const router = Router();

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                displayName: true,
                salePriority: true,
                ratingPriority: true,
                topicPriority: true,
                createdAt: true,
            }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('Fetch profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user preferences
router.patch('/preferences', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const { salePriority, ratingPriority, topicPriority, displayName } = req.body;

        const data: any = {};
        if (salePriority !== undefined) data.salePriority = salePriority;
        if (ratingPriority !== undefined) data.ratingPriority = ratingPriority;
        if (topicPriority !== undefined) data.topicPriority = topicPriority;
        if (displayName !== undefined) data.displayName = displayName;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                displayName: true,
                salePriority: true,
                ratingPriority: true,
                topicPriority: true,
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
