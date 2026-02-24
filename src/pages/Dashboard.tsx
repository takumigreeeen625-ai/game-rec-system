import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Library as LibraryIcon } from 'lucide-react';
import Layout from '../components/layout/Layout';
import GameCard from '../components/GameCard';
import { fetchApi } from '../api/client';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import type { GameItem } from '../data/mockData';

export default function Dashboard() {
    const { user } = useAuth();
    const [recommendations, setRecommendations] = useState<GameItem[]>([]);
    const [library, setLibrary] = useState<GameItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [libData, recData] = await Promise.all([
                    fetchApi('/library/games'),
                    fetchApi('/recommendations')
                ]);
                setLibrary(libData);
                setRecommendations(recData);
            } catch (err) {
                console.error('Failed to load dashboard data', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);
    return (
        <Layout title="ダッシュボード">
            <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Welcome Section */}
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Welcome Back, {user?.displayName}!</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        現在 <strong style={{ color: 'var(--text-primary)' }}>{library.length}本</strong> のゲームを保有しています。
                        あなたのライブラリに基づいて、今日は <strong style={{ color: 'var(--accent-primary)' }}>{recommendations.length}本</strong> のおすすめタイトルがあります。
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <Link to="/import">
                            <Button variant="primary">購入情報を更新する</Button>
                        </Link>
                    </div>
                </div>

                {/* Top Recommendations */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sparkles size={20} className="text-accent" />
                            本日のおすすめ
                        </h3>
                        <Link to="/recommendations">
                            <Button variant="ghost" rightIcon={<ArrowRight size={16} />}>
                                すべて見る
                            </Button>
                        </Link>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {isLoading ? <div>Loading...</div> : recommendations.slice(0, 3).map((game) => (
                            <div key={game.id} style={{ height: '340px' }}>
                                <Link to={`/game/${game.id}`} style={{ display: 'block', height: '100%' }}>
                                    <GameCard {...game} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Library Additions */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LibraryIcon size={20} className="text-accent" />
                            最近のライブラリ
                        </h3>
                        <Link to="/library">
                            <Button variant="ghost" rightIcon={<ArrowRight size={16} />}>
                                ライブラリを開く
                            </Button>
                        </Link>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {isLoading ? <div>Loading...</div> : library.slice(0, 3).map((game) => (
                            <div key={game.id} style={{ height: '340px' }}>
                                <Link to={`/game/${game.id}`} style={{ display: 'block', height: '100%' }}>
                                    <GameCard {...game} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </Layout>
    );
}
