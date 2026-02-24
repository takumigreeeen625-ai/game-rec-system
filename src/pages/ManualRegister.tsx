import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Library as LibraryIcon } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { fetchApi } from '../api/client';

export default function ManualRegister() {
    const [title, setTitle] = useState('');
    const [store, setStore] = useState('NONE');
    const [ownedType, setOwnedType] = useState('MANUAL_REGISTERED');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetchApi('/library/add', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    store: store, // Map 'store' state to 'store' in API payload
                    ownedType: ownedType // Map 'ownedType' state to 'ownedType' in API payload
                })
            });
            alert(`${title} をライブラリに追加しました`);
            navigate('/library');
        } catch (error: any) {
            alert(`エラー: ${error.message || '追加に失敗しました'} `);
        }
    };

    return (
        <Layout title="手動タイトル登録 (仮想本棚)">
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <LibraryIcon size={28} className="text-accent" />
                        <div>
                            <h2 style={{ fontSize: '1.25rem' }}>旧世代タイトルの手動追加</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>データ連携ができない過去のゲームを仮想本棚に追加します。</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Input
                            label="タイトル名"
                            placeholder="例: ゼルダの伝説 時のオカリナ"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <div className="ui-input-group">
                            <label className="ui-label">プラットフォーム・購入元</label>
                            <select
                                className="ui-input"
                                value={store}
                                onChange={(e) => setStore(e.target.value)}
                                style={{ appearance: 'none' }}
                            >
                                <option value="NONE">実店舗パッケージ版 / 旧世代機</option>
                                <option value="NINTENDO">Nintendo (DL版)</option>
                                <option value="PLAYSTATION">PlayStation (DL版)</option>
                                <option value="OTHER">その他</option>
                            </select>
                        </div>

                        <div className="ui-input-group">
                            <label className="ui-label">保有区分</label>
                            <select
                                className="ui-input"
                                value={ownedType}
                                onChange={(e) => setOwnedType(e.target.value)}
                                style={{ appearance: 'none' }}
                            >
                                <option value="MANUAL_REGISTERED">手動登録 (保有中)</option>
                                <option value="PURCHASED">購入済み</option>
                                <option value="FREE_CLAIMED">無料取得・譲渡</option>
                            </select>
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="submit" variant="primary" leftIcon={<Save size={18} />}>
                                ライブラリに登録
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
