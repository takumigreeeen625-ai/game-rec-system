import { useState } from 'react';
import { Upload, FileUp, Database, ArrowRight, ExternalLink, Code, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { fetchApi } from '../api/client';

export default function Import() {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            setIsUploading(false);
            alert('CSVが正常に取り込まれました。（重複候補が1件あります）');
        }, 1500);
    };

    // ----- Email Parser Logic -----
    const [emailText, setEmailText] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [parseResult, setParseResult] = useState<{ title: string, price: number | null, store: string }[]>([]);

    const handleParseEmail = () => {
        if (!emailText.trim()) return;
        setIsParsing(true);

        const results: { title: string, price: number | null, store: string }[] = [];
        const lines = emailText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        // 1. Steam format heuristic
        // Steam often has lines like: "Sekiro™: Shadows Die Twice - ¥ 8,360" or "Game Title ¥ 1,000"
        let isSteam = emailText.toLowerCase().includes('steam') || emailText.toLowerCase().includes('valve');

        // 2. Nintendo format heuristic
        // Nintendo often has "商品名: ゲームタイトル" and "価格: ¥ 1,000" on separate lines or consecutive lines
        let isNintendo = emailText.includes('My Nintendo Store') || emailText.includes('マイニンテンドーストア') || emailText.includes('任天堂');

        try {
            if (isSteam) {
                // Steam line-by-line parsing: "Title - ¥ Price" or "Title ¥ Price"
                lines.forEach(line => {
                    const steamRegex = /^(.*?)\s*(?:-|ー)?\s*[¥￥]\s*([0-9,]+)$/;
                    const match = line.match(steamRegex);
                    if (match && match[1] && !match[1].includes('小計') && !match[1].includes('合計') && !match[1].includes('割引')) {
                        const title = match[1].trim();
                        const price = parseInt(match[2].replace(/,/g, ''), 10);
                        // Filter out empty or obvious non-game lines
                        if (title.length > 1) {
                            results.push({ title, price, store: 'STEAM' });
                        }
                    }
                });
            } else if (isNintendo) {
                // Simplified Nintendo parsing: Look for chunks of text or consecutive lines where price follows title
                for (let i = 0; i < lines.length - 1; i++) {
                    const currentLine = lines[i];
                    const nextLine = lines[i + 1];

                    // Pattern A: Title is just a line, next line is "¥ 10,000"
                    const nintendoPriceRegex = /^[¥￥]\s*([0-9,]+)$/;
                    if (nintendoPriceRegex.test(nextLine)) {
                        // Attempt to avoid generic non-title lines
                        if (!currentLine.includes('合計') && !currentLine.includes('割引') && currentLine.length < 50) {
                            const priceMatch = nextLine.match(nintendoPriceRegex);
                            const price = parseInt(priceMatch![1].replace(/,/g, ''), 10);
                            results.push({ title: currentLine, price, store: 'NINTENDO' });
                            i++; // Skip the price line
                            continue;
                        }
                    }

                    // Pattern B: "商品名: タイトル"
                    if (currentLine.startsWith('商品名:')) {
                        const title = currentLine.replace('商品名:', '').trim();
                        let price = null;
                        const priceLineMatch = nextLine.match(/価格:\s*[¥￥]\s*([0-9,]+)/);
                        if (priceLineMatch) {
                            price = parseInt(priceLineMatch[1].replace(/,/g, ''), 10);
                            i++;
                        }
                        results.push({ title, price, store: 'NINTENDO' });
                    }
                }
            } else {
                // Generic fallback parser: Look for any line ending in a Yen price
                lines.forEach(line => {
                    const genericRegex = /^(.*?)(\s|-)*[¥￥]\s*([0-9,]+)$/;
                    const match = line.match(genericRegex);
                    if (match && match[1] && !match[1].includes('合計') && !match[1].includes('小計')) {
                        const title = match[1].trim();
                        if (title.length > 2) {
                            results.push({
                                title,
                                price: parseInt(match[3].replace(/,/g, ''), 10),
                                store: 'OTHER'
                            });
                        }
                    }
                });
            }

            setParseResult(results);
            if (results.length === 0) {
                alert('メールの本文からゲームと価格を見つけることができませんでした。全文をコピーしているか確認してください。');
            }
        } catch (e) {
            console.error('Email parse error', e);
            alert('解析中にエラーが発生しました。');
        } finally {
            setIsParsing(false);
        }
    };

    const handleImportParsed = async () => {
        if (parseResult.length === 0) return;
        setIsUploading(true);
        try {
            const payload = {
                games: parseResult.map(res => ({
                    title: res.title,
                    store: res.store,
                    purchasePrice: res.price,
                    ownedType: 'PURCHASED'
                }))
            };

            const response = await fetchApi('/library/add-bulk', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            alert(`解析結果を取り込みました（追加: ${response.results?.added || 0}件 / スキップ: ${response.results?.skipped || 0}件）`);
            setEmailText('');
            setParseResult([]);
        } catch (e: any) {
            alert(`取り込みに失敗しました: ${e.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const bookmarkletCode = `javascript: (function () { if (window.location.hostname !== "store-jp.nintendo.com") { if (!confirm("ここはマイニンテンドーストアではないようです。スクリプトを実行しますか？")) return } alert("MVP版: テスト用ゲーム購入情報を抽出します..."); const games = [{ title: "スプラトゥーン3", store: "Nintendo", ownedType: "BOOKMARKLET_IMPORTED" }, { title: "ゼルダの伝説 ティアーズ オブ ザ キングダム", store: "Nintendo", ownedType: "BOOKMARKLET_IMPORTED" }, { title: "大乱闘スマッシュブラザーズ SPECIAL", store: "Nintendo", ownedType: "BOOKMARKLET_IMPORTED" }, { title: "マリオカート8 デラックス", store: "Nintendo", ownedType: "BOOKMARKLET_IMPORTED" }]; const jsonData = JSON.stringify({ games }); const encodedData = btoa(encodeURIComponent(jsonData)); window.location.href = "http://localhost:5173/import/bookmarklet?data=" + encodedData })(); `;

    return (
        <Layout title="ゲーム情報の取り込み">
            <div className="import-container" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--bg-surface-hover), var(--bg-surface-elevated))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                        border: '1px solid var(--accent-primary)'
                    }}>
                        <FileUp size={40} className="text-accent" />
                    </div>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>ストアデータ (CSV) 取り込み</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                        各プラットフォームからエクスポートした購入履歴CSVをアップロードして、自動的に保有情報を統合します。現在の対応: Nintendo, PlayStation
                    </p>

                    <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '3rem 2rem', backgroundColor: 'var(--bg-surface-hover)', cursor: 'pointer', transition: 'border 0.2s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                        <Upload size={32} className="text-muted" style={{ margin: '0 auto 1rem' }} />
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>ファイルを選択するか、ここにドラッグ＆ドロップ</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>CSV形式のみサポート (最大5MB)</p>
                        <Button variant="primary" onClick={handleUpload} disabled={isUploading}>
                            {isUploading ? '取り込み中...' : 'ファイルを選択'}
                        </Button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div className="glass-panel" style={{ flex: '1', minWidth: '300px', padding: '2rem' }}>
                        <Database size={24} className="text-accent" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>過去のタイトルを手動登録</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            データ出力ができない旧世代機（PS2, GC等）の保有ゲームは、手動で仮想本棚へ追加できます。
                        </p>
                        <Link to="/manual-register">
                            <Button variant="secondary" fullWidth rightIcon={<ArrowRight size={16} />}>
                                手動登録を開く
                            </Button>
                        </Link>
                    </div>

                    {/* Email Parser Section */}
                    <div className="glass-panel hover-card" style={{ flex: '1', minWidth: '400px', padding: '2rem', borderColor: 'var(--accent-primary)', borderWidth: '2px', borderStyle: 'solid' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.75rem', color: 'var(--accent-primary)' }}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem' }}>購入メール一括解析 (New!✨)</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Steam / Nintendo 等に対応</p>
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            「ご購入ありがとうございました」などの受領メール本文をすべてコピーして、下の枠に貼り付けるだけで、タイトルと購入金額を自動で読み取って登録します！
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <textarea
                                value={emailText}
                                onChange={(e) => setEmailText(e.target.value)}
                                placeholder="メール本文をここにペースト..."
                                style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                    resize: 'vertical',
                                    fontFamily: 'monospace'
                                }}
                            />

                            {parseResult.length === 0 ? (
                                <Button
                                    variant="primary"
                                    disabled={!emailText.trim() || isParsing}
                                    onClick={handleParseEmail}
                                >
                                    {isParsing ? '解析中...' : 'メール本文を解析する'}
                                </Button>
                            ) : (
                                <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                                    <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>解析結果: {parseResult.length}件のゲームが見つかりました</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem 0', maxHeight: '150px', overflowY: 'auto' }}>
                                        {parseResult.map((res, i) => (
                                            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dotted var(--border-color)' }}>
                                                <span style={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>{res.title}</span>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--text-accent)' }}>¥{res.price?.toLocaleString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Button variant="secondary" onClick={() => setParseResult([])} size="sm" style={{ flex: 1 }}>キャンセル</Button>
                                        <Button variant="success" onClick={handleImportParsed} disabled={isUploading} size="sm" style={{ flex: 2 }}>
                                            {isUploading ? '登録中...' : 'この内容でライブラリに登録'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cross-Origin Bookmarklet */}
                    <div className="glass-panel hover-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', borderColor: 'var(--accent-primary)', borderWidth: '2px', borderStyle: 'solid' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.75rem', color: 'var(--accent-primary)' }}>
                                <ExternalLink size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem' }}>ストアから自動連携 (おすすめ🌟)</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>マイニンテンドーストア等</p>
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: '1' }}>
                            公式APIが提供されていないストアからでも、ブラウザの「ブックマークレット」機能を使って、現在画面に表示されている購入済みゲームを安全に一括取得します。パスワードは預かりません。
                        </p>

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                            <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                                <Code size={16} /> 使い方
                            </h4>
                            <ol style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li>下の青いボタンを<b>ブラウザのブックマークバーにドラッグ＆ドロップ</b>します。</li>
                                <li>マイニンテンドーストアの購入履歴ページを開きます。</li>
                                <li>登録したブックマークをクリックします。</li>
                            </ol>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <a
                                href={bookmarkletCode}
                                onClick={(e) => { e.preventDefault(); alert('このボタンはクリックするのではなく、ブラウザのブックマークバー（お気に入り）に向かってドラッグ＆ドロップして登録してください！'); }}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0.75rem 1.5rem',
                                    background: 'var(--accent-primary)',
                                    color: 'white',
                                    borderRadius: '0.5rem',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    cursor: 'grab',
                                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                                }}
                            >
                                📥 ストア連携ツール (ここをドラッグ)
                            </a>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ flex: '1', minWidth: '300px', padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>最近の取り込み履歴</h3>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span>Nintendo_PurchaseHistory.csv</span>
                                <span className="text-success" style={{ fontSize: '0.875rem' }}>成功 (45件)</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span>PlayStation_Transactions.csv</span>
                                <span className="text-warning" style={{ fontSize: '0.875rem' }}>一部失敗 (12件 / 1件名寄せ待)</span>
                            </li>
                        </ul>
                        <Link to="/match-correction" style={{ display: 'block', marginTop: '1rem' }}>
                            <Button variant="outline" size="sm" fullWidth>重複候補の確認 (1件)</Button>
                        </Link>
                    </div>
                </div>

            </div>
        </Layout>
    );
}
