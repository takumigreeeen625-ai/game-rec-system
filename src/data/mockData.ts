export interface GameItem {
    id: string;
    title: string;
    imageUrl: string;
    store: 'NINTENDO' | 'PLAYSTATION' | 'STEAM' | 'GOOGLE_PLAY';
    price: number;
    discountRate?: number;
    isOnSale?: boolean;
    rating?: number;
    ownedType?: 'PURCHASED' | 'FREE_CLAIMED' | 'SUBSCRIPTION' | 'NONE';
    reasons?: string[];
    genre?: string[];
}

export const mockRecommendations: GameItem[] = [
    {
        id: 'g1',
        title: 'ゼルダの伝説 ティアーズ オブ ザ キングダム',
        imageUrl: 'https://images.unsplash.com/photo-1612404730960-5c71577fca11?w=800&q=80',
        store: 'NINTENDO',
        price: 7900,
        rating: 4.9,
        reasons: ['評価が高いから', 'あなたがよく買うジャンルだから'],
        genre: ['Action', 'Adventure']
    },
    {
        id: 'g2',
        title: 'Cyberpunk 2077: Ultimate Edition',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
        store: 'STEAM',
        price: 8778,
        discountRate: 50,
        isOnSale: true,
        rating: 4.5,
        reasons: ['今セール中だから', '似たゲームを買っているから'],
        genre: ['RPG', 'Action']
    },
    {
        id: 'g3',
        title: 'ELDEN RING',
        imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800&q=80',
        store: 'PLAYSTATION',
        price: 9240,
        rating: 4.8,
        reasons: ['評価が高いから'],
        genre: ['Action', 'RPG']
    }
];

export const mockLibrary: GameItem[] = [
    {
        id: 'l1',
        title: 'スーパーマリオオデッセイ',
        imageUrl: 'https://images.unsplash.com/photo-1588346337852-6f29fb0749e7?w=800&q=80',
        store: 'NINTENDO',
        price: 6578,
        ownedType: 'PURCHASED',
        rating: 4.7,
        genre: ['Action', 'Platformer']
    },
    {
        id: 'l2',
        title: 'Ghost of Tsushima Director\'s Cut',
        imageUrl: 'https://images.unsplash.com/photo-1606144042857-e6ae8d3d92fb?w=800&q=80',
        store: 'PLAYSTATION',
        price: 8690,
        ownedType: 'SUBSCRIPTION',
        rating: 4.8,
        genre: ['Action', 'Adventure']
    }
];
