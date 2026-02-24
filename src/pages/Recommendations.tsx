import { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import GameCard from '../components/GameCard';
import Button from '../components/ui/Button';
import { fetchApi } from '../api/client';
import type { GameItem } from '../data/mockData';

export default function Recommendations() {
    const [filterMode, setFilterMode] = useState('ALL');
    const [recommendations, setRecommendations] = useState<GameItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const recData = await fetchApi('/recommendations');
                setRecommendations(recData);
            } catch (err) {
                console.error('Failed to load recommendations', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <Layout title="おすすめ一覧">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Recommend Header & Filters */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), transparent)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Sparkles className="text-accent" size={22} />
                            保有情報から分析した最適レコメンド
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            保有済みのゲームを除外し、あなたの好みに合った未プレイタイトルを厳選しました。
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Button variant={filterMode === 'ALL' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilterMode('ALL')}>
                            すべて
                        </Button>
                        <Button variant={filterMode === 'SALE' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilterMode('SALE')}>
                            セール中
                        </Button>
                        <Button variant="secondary" size="sm" leftIcon={<Filter size={14} />}>
                            ジャンル絞り込み
                        </Button>
                        <Button variant="ghost" size="sm" leftIcon={<SlidersHorizontal size={14} />}>
                            表示設定
                        </Button>
                    </div>
                </div>

                {/* Recommend Grid */}
                {isLoading ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>読み込み中...</div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {recommendations.filter(g => filterMode === 'SALE' ? g.isOnSale : true).map((game) => (
                            <div key={game.id} style={{ height: '350px' }}>
                                <Link to={`/ game / ${game.id} `} style={{ display: 'block', height: '100%' }}>
                                    <GameCard {...game} />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
