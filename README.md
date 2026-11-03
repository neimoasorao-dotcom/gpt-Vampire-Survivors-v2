# Vampire Survivors reconstruction

PCブラウザ向けの再構築プロジェクト。**現在は検証中のAntonio / Whip / Mad Forestスライスであり、完成版ではありません。** 最新PC版の確認・本家画像／映像との比較は、調査先へのネットワーク拒否により未完了です。対象版と確度は [reference_target.md](reference_target.md)、残る差分は [gap_report.md](gap_report.md) を参照してください。

## 遊び方

`dist/vampire_survivors.html` が外部依存のない配布用HTMLです。移動はWASD／矢印／ゲームパッド左スティック、攻撃は自動。Enter／Aで決定、Esc／Startでポーズ。マウスでメニュー操作できます。設定から日本語／English、音量、ダメージ表示、点滅・画面揺れを切り替えられます。初回クリック／キー操作で音声を開始します。

ChromeでHTMLを直接開く方式を想定していますが、このクラウド環境のChromiumでは管理ポリシーが `file://` を拒否します。そのため当環境での実機能確認はHTTPを使用します。ポリシー変更やファイル直接起動の合格を主張していません。

```sh
python3 -m http.server 8000 --directory dist
```

ファイルの配置先／ブラウザのオリジンにより保存領域が異なります。設定からセーブJSONを書き出し／読み込みできます。保存データはバージョン検査、二重保存、破損時の復旧に対応します。

## 開発

Node.js 24、Python3、Chrome/Chromiumを使用します。元ゲームの素材、CDN、実行時ネットワーク接続は使用しません。アートとBGM・効果音は独自生成です。作業はこの隔離済みチェックアウトで行い、追加worktreeは不要です。

```sh
npm ci
npm run build
npm test
npm run test:browser
npm run benchmark
node tools/ui-layout.mjs
node tools/render-benchmark.mjs
```

ブラウザテストの既定実行ファイルは `/usr/bin/chromium`、必要なら `CHROMIUM_PATH` で指定します。`npm run build` は分離されたソースをバンドルし、`dist/vampire_survivors.html` とルートの同名HTMLを生成します。成果物はネット接続をCSPで禁止しています。

F3で開発ツール、武器実験室、無敵、時刻設定、敵・拾得物の出現、各種可視化、速度変更を使用できます。無敵を使った長時間試験と通常の自動プレイ結果は別々に記録します。`window.__VS` は自動QA用の橋渡しです。

## 検証と仕様

- `evidence.json` / `research/`: 出典、推定、取得不能を区別した調査台帳
- `spec.md` / `architecture.md`: 対象機能と構造
- `tests/`: 戦闘、進化、固定更新、再現、保存、入力、音声
- `reports/`: 自動テスト、テレメトリ、負荷試験、スクリーンショット
- `feature_matrix.md` / `quality_report.md`: 機能と検証状況

現行版・Wave・経験値カーブ・描画密度の忠実度が確定するまでは、追加キャラクター／武器／ステージの拡張ゲートを通過扱いにしません。実装値のテスト成功は、本家仕様との一致を意味しません。
