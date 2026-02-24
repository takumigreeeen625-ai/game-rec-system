import { Star } from 'lucide-react';
import Badge from './ui/Badge';
import Button from './ui/Button';
import './game-card.css';

export interface GameCardProps {
    id: string;
    title: string;
    imageUrl?: string;
    store?: 'NINTENDO' | 'PLAYSTATION' | 'STEAM' | 'GOOGLE_PLAY' | string;
    platforms?: string[];
    price: number;
    discountRate?: number;
    isOnSale?: boolean;
    rating?: number;
    ownedType?: 'PURCHASED' | 'FREE_CLAIMED' | 'SUBSCRIPTION' | 'NONE';
    reasons?: string[];
    onClick?: () => void;
}

export default function GameCard({
    title,
    imageUrl,
    store,
    platforms = [],
    price,
    discountRate,
    isOnSale,
    rating,
    ownedType = 'NONE',
    reasons = [],
    onClick
}: GameCardProps) {

    const renderStoreLogo = (storeName: string, key: number) => {
        switch (storeName) {
            case 'NINTENDO': return <span key={key} className="store-badge nintendo">Nintendo</span>;
            case 'PLAYSTATION': return <span key={key} className="store-badge ps">PS</span>;
            case 'STEAM': return <span key={key} className="store-badge steam">Steam</span>;
            case 'GOOGLE_PLAY': return <span key={key} className="store-badge google">Google Play</span>;
            default: return null;
        }
    };

    const displayPlatforms = platforms.length > 0 ? platforms : (store ? [store] : []);

    const getOwnershipBadge = () => {
        switch (ownedType) {
            case 'PURCHASED': return <Badge variant="success">購入済み</Badge>;
            case 'FREE_CLAIMED': return <Badge variant="info">取得済み</Badge>;
            case 'SUBSCRIPTION': return <Badge variant="warning">サブスク</Badge>;
            default: return null;
        }
    };

    const formattedPrice = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
    const fallbackImage = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80';
    const displayImage = imageUrl || fallbackImage;

    return (
        <div className="game-card glass-panel" onClick={onClick}>
            <div className="game-card-image-wrap">
                <img
                    src={displayImage}
                    alt={title}
                    className="game-card-image"
                    loading="lazy"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = fallbackImage;
                    }}
                />
                {discountRate && discountRate > 0 && (
                    <div className="discount-badge">-{discountRate}%</div>
                )}
                <div className="store-overlay" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {displayPlatforms.map((p, idx) => renderStoreLogo(p, idx))}
                </div>

                {ownedType !== 'NONE' && (
                    <div className="ownership-overlay">
                        {getOwnershipBadge()}
                    </div>
                )}
            </div>

            <div className="game-card-content">
                <h3 className="game-title" title={title}>{title}</h3>

                <div className="game-meta">
                    {rating ? (
                        <div className="game-rating">
                            <Star size={14} className="star-icon" fill="currentColor" />
                            <span>{rating.toFixed(1)}</span>
                        </div>
                    ) : <div />}

                    <div className="game-price-section">
                        {isOnSale && <span className="regular-price">¥{Math.floor(price / (1 - discountRate! / 100)).toLocaleString()}</span>}
                        <span className="current-price">{formattedPrice}</span>
                    </div>
                </div>

                {reasons && reasons.length > 0 && (
                    <div className="recommend-reasons">
                        {reasons.map((reason, idx) => (
                            <Badge key={idx} variant="accent" className="reason-tag">
                                {reason}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="game-card-actions">
                    <Button variant="secondary" size="sm" fullWidth className="card-btn">
                        詳細を見る
                    </Button>
                </div>
            </div>
        </div>
    );
}
