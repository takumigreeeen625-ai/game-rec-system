import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Gamepad2, ArrowRightLeft, Check, X } from 'lucide-react';

export default function MatchCorrection() {
    return (
        <Layout title="名寄せ修正・重複確認">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        別々のストアで取得された以下のタイトルは、同一タイトルの可能性があります。
                        これらを1つのタイトルとして統合するか、別々のタイトルとして管理するか選択してください。
                    </p>
                </div>

                {/* Mock Match Card */}
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>

                        {/* Title 1 */}
                        <div style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Gamepad2 size={48} className="text-muted" />
                            </div>
                            <div>
                                <Badge variant="accent" style={{ marginBottom: '0.5rem' }}>Nintendo Store</Badge>
                                <h3 style={{ fontSize: '1.1rem' }}>ゼルダの伝説 ティアーズ オブ ザ キングダム</h3>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>保有区分: 購入済み</span>
                            </div>
                        </div>

                        {/* Icon */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
                            <ArrowRightLeft size={32} />
                            <Badge variant="warning">一致度: 95%</Badge>
                        </div>

                        {/* Title 2 */}
                        <div style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Gamepad2 size={48} className="text-muted" />
                            </div>
                            <div>
                                <Badge variant="accent" style={{ marginBottom: '0.5rem' }}>手動登録 (旧作)</Badge>
                                <h3 style={{ fontSize: '1.1rem' }}>ゼルダの伝説 Tears of the Kingdom</h3>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>保有区分: 手動登録</span>
                            </div>
                        </div>

                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                        <Button variant="danger" leftIcon={<X size={18} />}>
                            別タイトルとして分離
                        </Button>
                        <Button variant="success" leftIcon={<Check size={18} />}>
                            同一として統合する
                        </Button>
                    </div>
                </div>

            </div>
        </Layout>
    );
}
