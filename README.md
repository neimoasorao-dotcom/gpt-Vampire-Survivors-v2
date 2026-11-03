# Vampire Survivors reconstruction — Phase 2

日本語／English対応のPCブラウザ向け再構築プロジェクトです。既存のAntonio・Whip・Mad Forestを残し、基本武器、進化、Library、キャラクター購入と保存を広げています。**Phase 2の検証中間版であり、本家との忠実度や最終リリースの合格を宣言するものではありません。**

## 遊び方

成果物は `dist/vampire_survivors.html`（ルートにも同名コピー）です。WASD／矢印／ゲームパッド左スティックで移動し、自動で攻撃します。Enter／Aで決定、Esc／Startでポーズ。メニューはマウスでも操作できます。初回のクリック／キー操作で音声を開始します。

最初に所持するキャラクターはアントニオです。ゴールドを貯めると、イメルダ10、パスカリーナ100、ジェンナーロ500などをキャラクター画面で購入できます。他のキャラクターには装備の到達レベルや累計撃破数などの解放条件があります。狂乱の森でレベル20に達したランの記録があれば、象眼の図書館を選択できます。

初期の共通武器プールはムチ・魔法の杖・ナイフ・オノ・王の聖書・聖水の6種です。他の基本武器は拾得、破壊数、生存時間、装備レベル等の条件で順次解放します。キャラクターの初期装備と、共通レベルアップ候補の解放は別です。条件の出典と注意点は [武器解放資料](research/phase2_unlocks.md) を参照してください。

現在のコードには、代表基本武器14種、進化・合成結果13種、パッシブ15種、キャラクター11人、ステージ2種、恒久PowerUp16種が含まれます。数値・動作・比較の検証状況は [feature_matrix.md](feature_matrix.md) に分けて記録しています。

設定で言語、Master／Music／SFX音量、ダメージ表示、画面揺れ、点滅等を変更できます。ゴールド、購入、解放、発見記録、設定は保存され、設定からセーブJSONの書き出し／読み込みもできます。保存形式はversion 2で、旧形式からの移行に対応します。ファイルの配置先やHTTPオリジンを変えると、ブラウザの保存領域も変わる場合があります。

この管理環境のChromiumは `file://` をポリシーで拒否します。当環境でのブラウザ確認はHTTPを使用し、直接ファイル起動の検証を合格扱いにしていません。

```sh
python3 -m http.server 8000 --directory dist
```

## 開発と検証

Node.js 24、Python 3、Chrome／Chromiumを使用します。既存の隔離済みチェックアウトで作業し、追加worktreeは不要です。ソースは分割して管理し、esbuildでHTML／CSS／JavaScript／データを単一HTMLへ統合します。実行時のCDN、ネットワーク取得、元ゲームから抽出した素材は使用しません。

```sh
npm ci
npm run build
npm test
node tools/phase2-regression.mjs --full
node tools/phase2-browser.mjs
node tools/phase2-benchmarks.mjs
node tools/ui-layout.mjs
```

`tools/phase2-realtime.mjs` は通常速度の実時間ラン用で、実行には30分以上かかります。高速シミュレーションとは別の証跡を保存します。`tools/phase2-stress.mjs` は実投射物を含む負荷試験です。ブラウザ実行ファイルの指定方法は各スクリプトを参照してください。`file://` のBLOCKED、失敗、未実施を区別して結果を読みます。

F3で開発ツールと武器実験室を開けます。実験室ではキャラクター、武器・レベル、Might／Area／Speed／Duration／Amount／Cooldown、敵種・HP・数・速度、ゲーム速度を指定できます。通常プレイでは開発用の無敵・速度変更は使いません。`window.__VS` は自動QA用APIです。

既存版はコミットとタグ `golden-vslice-v1` に固定しています。`legacy:true` はその旧武器プールと挙動を比較する回帰専用モードで、通常のPhase 2プレイとは分けています。

## 調査と品質の範囲

[reference_target.md](reference_target.md) の最新PC版は未特定です。一方、公開されている独立したコミュニティ資料から、進化関係、選択した武器の数値表、Wave時刻表等を取得しています。[Phase 2出典](research/phase2_sources.md)、[数値観察](research/phase2_weapon_facts.json)、`evidence.json` に根拠と確度を記録しています。公式の現行版確認、動画・画像との計測比較、Windows実機・物理Gamepadの検証は別の未完了項目です。

アート、音声、背景、UI図形は独自に作成しています。コミュニティ資料の事実情報は出典付きで独立した定義に表現し、文章・画像・実行コード・保護されたゲーム素材を取り込んでいません。

現在の状況は [phase2_report.md](phase2_report.md)、差分は [gap_report.md](gap_report.md)、比較評価は [quality_report.md](quality_report.md) を参照してください。ユーザーのPhase 2指示により拡張を進めていますが、それを本家比較の合格と読み替えません。
