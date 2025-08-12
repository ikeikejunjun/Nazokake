// このファイルはUIフレームワーク導入とデザイン刷新の計画です。

1. UIフレームワーク導入
- Vuetify（Vue3対応・日本語情報も多い）を推奨
- npmでインストール
- main.tsでセットアップ

2. グローバルCSS刷新
- src/assets/base.css, main.cssをVuetifyベースに整理
- フォント: 'Noto Sans JP', 'Roboto', 'sans-serif'
- ベースカラー: #1976d2（ブルー系）+ホワイト+グレー

3. App.vue・主要ビューのレイアウト調整
- ヘッダー・フッター・コンテナ導入
- 余白・角丸・影・ボタン・フォームの統一

4. 既存コンポーネントのVuetify化
- v-btn, v-card, v-text-field等に置換

5. アイコン: Material Design Icons

---

この手順で進めます。まずはVuetify導入とmain.ts/App.vueのセットアップから着手します。
