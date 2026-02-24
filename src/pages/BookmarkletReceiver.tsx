import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { fetchApi } from '../api/client';
import Button from '../components/ui/Button';

export default function BookmarkletReceiver() {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('ブックマークレットからのデータを解析中です...');

    useEffect(() => {
        const processData = async () => {
            try {
                // 1. Extract ?data= parameter
                const searchParams = new URLSearchParams(location.search);
                const encodedData = searchParams.get('data');

                if (!encodedData) {
                    throw new Error('データが見つかりません。ブックマークレットから正しく遷移したか確認してください。');
                }

                // 2. Decode Base64 (UTF-8 safe)
                const jsonString = decodeURIComponent(atob(encodedData));
                const payload = JSON.parse(jsonString);

                if (!payload.games || !Array.isArray(payload.games)) {
                    throw new Error('無効なデータ形式です。');
                }

                setMessage(`データを解析しました。${payload.games.length}件のゲームを登録中です...`);

                // 3. Send to Backend Bulk API
                const response = await fetchApi('/library/add-bulk', {
                    method: 'POST',
                    body: JSON.stringify({ games: payload.games })
                });
                setStatus('success');
                setMessage(`${response.results.added}件追加, ${response.results.skipped}件スキップ`);

            } catch (err: any) {
                console.error('Bookmarklet Import Error:', err);
                setStatus('error');
                setMessage(err.message || '取り込み処理中にエラーが発生しました。');
            }
        };

        processData();
    }, [location.search]);

    return (
        <Layout title="自動取り込み結果">
            <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>

                    {status === 'loading' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <Loader2 size={48} className="text-accent" style={{ animation: 'spin 2s linear infinite' }} />
                            <h2 style={{ fontSize: '1.25rem', marginTop: '1rem' }}>取り込み処理中</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1rem'
                            }}>
                                <CheckCircle2 size={32} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>カセットを本棚に収納しました！</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>{message}</p>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <Button variant="outline" onClick={() => navigate('/import')}>
                                    取り込み画面に戻る
                                </Button>
                                <Button variant="primary" onClick={() => navigate('/library')}>
                                    ライブラリを確認する
                                </Button>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1rem'
                            }}>
                                <AlertCircle size={32} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>取り込みエラー</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>{message}</p>

                            <Button variant="primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/import')}>
                                取り込み画面に戻る
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
}
