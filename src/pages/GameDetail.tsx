import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, Link as LinkIcon, Star } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { mockLibrary, mockRecommendations } from '../data/mockData';

export default function GameDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find game in either mock array
    const game = [...mockLibrary, ...mockRecommendations].find(g => g.id === id);

    if (!game) {
        return (
            <Layout>
                <div style={{ padding: '3rem', textAlign: 'center' }}>
                    <h2>ゲームが見つかりません</h2>
                    <Button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>戻る</Button>
                </div>
            </Layout>
        );
    }

    const isOwned = game.ownedType && game.ownedType !== 'NONE';
    const formattedPrice = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(game.price);

    return (
        <Layout title="タイトル詳細">
            <Button variant="ghost" leftIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
                戻る
            </Button>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <div style={{ height: '300px', width: '100%', position: 'relative' }}>
                    <img
                        src={game.imageUrl}
                        alt={game.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, var(--bg-surface-elevated), transparent)'
                    }} />
                </div>

                <div style={{ padding: '2rem', position: 'relative', marginTop: '-4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <Badge variant="accent">{game.store}</Badge>
                                {game.genre?.map(g => <Badge key={g}>{g}</Badge>)}
                            </div>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>{game.title}</h1>
                            {game.rating && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--status-warning)' }}>
                                    <Star fill="currentColor" size={18} />
                                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{game.rating}</span>
                                </div>
                            )}
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                {game.isOnSale && <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>¥{Math.floor(game.price / (1 - game.discountRate! / 100)).toLocaleString()}</div>}
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formattedPrice}</div>
                            </div>

                            {isOwned ? (
                                <Button variant="success" fullWidth leftIcon={<Check size={18} />}>保有済み</Button>
                            ) : (
                                <Button variant="primary" fullWidth leftIcon={<ShoppingCart size={18} />}>ストアで確認</Button>
                            )}

                            {!isOwned && (
                                <Button variant="secondary" fullWidth>保有リストに追加</Button>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>価格比較 (ストア横断)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span className="store-badge nintendo" style={{ padding: '4px 8px', borderRadius: '4px' }}>Nintendo Store</span>
                                    <span style={{ fontWeight: 500 }}>{game.store === 'NINTENDO' ? formattedPrice : '¥7,900'}</span>
                                </div>
                                {game.store === 'NINTENDO' && <Badge variant="success">最安値</Badge>}
                                <Button variant="ghost" size="sm" leftIcon={<LinkIcon size={14} />}>ストアへ</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
