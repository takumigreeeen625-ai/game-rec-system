// このコードはそのままブックマークとして登録されます
javascript: (function () {
    // 1. マイニンテンドーストアの購入履歴画面であることを確認 (簡易チェッカー)
    if (window.location.hostname !== "store-jp.nintendo.com") {
        if (!confirm("ここはマイニンテンドーストアではないようです。スクリプトを実行しますか？")) return;
    }

    alert("ゲーム購入情報の抽出を開始します...");

    // 2. 画面上のソフトタイトルを抽出するロジック (DOM構造はストアの変更により壊れる可能性があるため、一般化して抽出するか、特定のクラスを狙う)
    // ※今回はMVPとして、仮のセレクタ（またはダミーデータ抽出）を実装します。実際には適切なDOM解析が必要です。
    const games = [
        { title: "スプラトゥーン3", store: "Nintendo", ownedType: "BOOKMARKLET_IMPORTED" },
        { title: "ゼルダの伝説 ティアーズ オブ ザ キングダム", store: "Nintendo", ownedType: "BOOKMARKLET_IMPORTED" },
        { title: "大乱闘スマッシュブラザーズ SPECIAL", store: "Nintendo", ownedType: "BOOKMARKLET_IMPORTED" },
        { title: "マリオカート8 デラックス", store: "Nintendo", ownedType: "BOOKMARKLET_IMPORTED" }
    ];

    /* 実際の処理イメージ
    const gameElements = document.querySelectorAll('.game-title-class'); // 実際のクラス名
    const games = Array.from(gameElements).map(el => ({
        title: el.innerText.trim(),
        store: 'Nintendo',
        ownedType: 'BOOKMARKLET_IMPORTED'
    }));
    */

    if (games.length === 0) {
        alert("購入履歴が見つかりませんでした。");
        return;
    }

    // 3. データをBase64エンコード
    const jsonData = JSON.stringify({ games });
    const encodedData = btoa(encodeURIComponent(jsonData)); // UTF-8 セーフなBase64

    // 4. Game Rec Systemの取り込みページへリダイレクト
    const targetBaseUrl = 'http://localhost:5173/import/bookmarklet';
    window.location.href = `${targetBaseUrl}?data=${encodedData}`;
})();
