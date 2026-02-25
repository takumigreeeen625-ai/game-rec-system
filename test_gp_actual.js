const text = `Google Play
ありがとうございました
Google Play での 深圳市曜祚科技有限责任公司 からの購入が完了しました。

注文番号: GPA.3376-8916-7936-16117
注文日: 2026/02/13 22:46:28 JST
アイテム	価格
バックパック・バトル	￥1,500
合計: ￥1,500
（消費税 ￥136 込み）
お支払い方法:	
Google Play における残高: ￥213
Visa-8909: ￥1,287
Play ポイントを獲得しました	
	+45
プロモーション: ポイント 3 倍`;

function parseGooglePlay(text) {
    const results = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // The previous regex expected a space instead of a tab between item and price
    // e.g. /^(.*?)(?:\s*\([^)]+\))?\s+[¥￥]\s*([0-9,]+)$/

    const detailIndex = lines.findIndex(l => l.replace(/[\s\t\u3000]/g, '').includes('アイテム価格'));
    const subtotalIndex = lines.findIndex(l => l.startsWith('合計:'));

    if (detailIndex !== -1) {
        const endIndex = subtotalIndex !== -1 ? subtotalIndex : lines.length;
        for (let i = detailIndex + 1; i < endIndex; i++) {
            let line = lines[i].trim();
            // New Regex: look for any whitespace/tab separating the title from the yen symbol, or no space at all
            const gpRegex = /^(.*?)(?:\s*\([^)]+\))?[\s\t]*[¥￥]\s*([0-9,]+)$/;
            const match = line.match(gpRegex);

            if (match && match[1]) {
                const title = match[1].trim();
                const price = parseInt(match[2].replace(/,/g, ''), 10);
                if (title.length > 1) {
                    results.push({ title, price, store: 'GOOGLE_PLAY' });
                }
            }
        }
    }
    return results;
}

console.log(JSON.stringify(parseGooglePlay(text), null, 2));
