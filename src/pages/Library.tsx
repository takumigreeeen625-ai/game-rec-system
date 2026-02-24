import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import Layout from '../components/layout/Layout';
import GameCard from '../components/GameCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { fetchApi } from '../api/client';
import type { GameItem } from '../data/mockData';

export default function Library() {
    const [searchQuery, setSearchQuery] = useState('');
    const [games, setGames] = useState<GameItem[]>([]);
    const [allGames, setAllGames] = useState<GameItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const libData = await fetchApi('/library/games');
                setAllGames(libData);
                setGames(libData);
            } catch (err) {
                console.error('Failed to load library', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // 簡易検索
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (!query) {
            setGames(allGames);
            return;
        }
        const filtered = allGames.filter(g =>
            g.title.toLowerCase().includes(query.toLowerCase())
        );
        setGames(filtered);
    };

    return (
        <Layout title="統合ライブラリ">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Toolbar */}
                <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        <Input
                            placeholder="タイトル名で検索..."
                            leftIcon={<Search size={18} />}
                            value={searchQuery}
                            onChange={handleSearch}
                            style={{ marginBottom: 0 }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Button variant="secondary" leftIcon={<Filter size={16} />}>
                            絞り込み
                        </Button>
                        <Button variant="secondary" leftIcon={<ArrowUpDown size={16} />}>
                            並び替え
                        </Button>
                        <Link to="/import">
                            <Button variant="primary">
                                タイトルを追加
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Library Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {isLoading ? (
                        <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>読み込み中...</div>
                    ) : games.length > 0 ? (
                        games.map((game) => (
                            <div key={game.id} style={{ height: '320px' }}>
                                <Link to={`/ game / ${game.id} `} style={{ display: 'block', height: '100%' }}>
                                    <GameCard {...game} />
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            見つかりませんでした。
                        </div>
                    )}
                </div>

            </div>
        </Layout>
    );
}
