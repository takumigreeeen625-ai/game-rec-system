import { useState, useEffect } from 'react';
import { Save, User, Sliders, Bell } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../api/client';

export default function Settings() {
    const { user, updateUser } = useAuth();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [salePriority, setSalePriority] = useState(user?.salePriority || 3);
    const [ratingPriority, setRatingPriority] = useState(user?.ratingPriority || 4);
    const [topicPriority, setTopicPriority] = useState(user?.topicPriority || 2);

    // Sync with user object if it changes
    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName);
            setSalePriority(user.salePriority || 3);
            setRatingPriority(user.ratingPriority || 4);
            setTopicPriority(user.topicPriority || 2);
        }
    }, [user]);

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const data = await fetchApi('/users/preferences', {
                method: 'PATCH',
                body: JSON.stringify({
                    displayName,
                    salePriority,
                    ratingPriority,
                    topicPriority
                })
            });

            updateUser(data);
            alert('設定を保存しました。');
        } catch (error) {
            alert('エラーにより保存に失敗しました。');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Layout title="設定 (Settings)">
            <div className="settings-container" style={{ maxWidth: '800px', margin: '0 auto' }}>

                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <User className="text-accent" />
                        <h2 style={{ fontSize: '1.5rem' }}>プロフィール情報</h2>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1', minWidth: '250px' }}>
                            <Input
                                label="表示名"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </div>
                        <div style={{ flex: '1', minWidth: '250px' }}>
                            <Input
                                label="メールアドレス"
                                value={user?.email || "user@example.com"}
                                disabled
                                helperText="メールアドレスの変更は現在サポートされていません。"
                            />
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Sliders className="text-accent" />
                        <h2 style={{ fontSize: '1.5rem' }}>レコメンド設定</h2>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        レコメンドエンジンが重視する要素のウェイト（1〜5）を設定します。
                    </p>

                    <div className="settings-sliders" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="slider-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label style={{ fontWeight: 500 }}>セール重視度</label>
                                <span style={{ color: 'var(--accent-primary)' }}>{salePriority}</span>
                            </div>
                            <input
                                type="range" min="1" max="5"
                                value={salePriority}
                                onChange={(e) => setSalePriority(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                            />
                        </div>

                        <div className="slider-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label style={{ fontWeight: 500 }}>評価重視度</label>
                                <span style={{ color: 'var(--accent-primary)' }}>{ratingPriority}</span>
                            </div>
                            <input
                                type="range" min="1" max="5"
                                value={ratingPriority}
                                onChange={(e) => setRatingPriority(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                            />
                        </div>

                        <div className="slider-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label style={{ fontWeight: 500 }}>新作・話題性重視度</label>
                                <span style={{ color: 'var(--accent-primary)' }}>{topicPriority}</span>
                            </div>
                            <input
                                type="range" min="1" max="5"
                                value={topicPriority}
                                onChange={(e) => setTopicPriority(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Bell className="text-accent" />
                        <h2 style={{ fontSize: '1.5rem' }}>通知設定</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                            <span>ウィッシュリストのセール通知を受け取る</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                            <span>おすすめタイトルの定期通知を受け取る</span>
                        </label>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <Button variant="outline" size="lg">キャンセル</Button>
                    <Button variant="primary" size="lg" leftIcon={<Save size={18} />} onClick={handleSave} disabled={isSaving}>
                        {isSaving ? '保存中...' : '設定を保存'}
                    </Button>
                </div>

            </div>
        </Layout>
    );
}
