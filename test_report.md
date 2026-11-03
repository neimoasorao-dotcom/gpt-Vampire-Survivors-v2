# 検証レポート — 2026-11-03

現時点の判定は **機能スライスの検証済み／最終リリース未合格**。自動テストの成功を、本家との忠実度の合格や未実装コンテンツの検証に読み替えない。

## 実際に検証した成果物

| 検証 | HTMLサイズ | SHA-256 | 結果 |
|---|---:|---|---|
| 最終単一HTMLの機能・回帰スモーク | 112,912 bytes | `e2f511cd1353d568601828c00e056ba0b9849cb66f1a500e24210d1a52c354a3` | **20 PASS / 0 FAIL / 1 BLOCKED** |
| Goldenスクリーンショット＋実フレーム計測を含む全ブラウザ検証 | 112,870 bytes | `53ad505852d66fa81888e6c7c77bcf1d0bae4e3b381649505356221b9c131302` | **22 PASS / 0 FAIL / 1 BLOCKED** |

最終版との差分は `enemyDeath` と `heal` の効果音イベント対応のみ。両者のシミュレーションエンジンのSHA-256は `4fc33cac7228328cd783f619bc0ab3693317dc784669d3dbe082cbfab4409557` で一致する。最終HTMLそのものの起動・操作・音声・保存を、変更後に再検証した。Golden映像と性能値には音声修正前のHTMLハッシュを明記し、変更後にGoldenを再実行したとは扱わない。

ブラウザ実行は headless Linux Chromium、1920×1080 CSS viewport、内部960×540。HTTPで最終ファイルのバイト列をそのまま配信し、外部通信を禁止した。スモーク／全検証の両方で **外部実行時リクエスト0、console error 0、uncaught exception 0**。実行中に成果物が変更されていないこともハッシュで検証した。

## 自動検証の結果

- Unit / Integration: **37 PASS、0 FAIL、0 SKIP**。実行証跡: [reports/unit.tap](reports/unit.tap)。
- 最終HTMLのUIレイアウト: **60/60 PASS、エラー0**。日本語／英語、1366×768・1920×1080・2560×1440の操作領域を検査。[reports/ui-layout.json](reports/ui-layout.json)。
- 最終HTMLの実ブラウザ機能検証: [reports/browser-smoke-results.json](reports/browser-smoke-results.json)。
- Goldenと実フレーム計測を含むブラウザ検証: [reports/browser-results.json](reports/browser-results.json)。

最終HTMLで確認した経路:

| 項目 | 検証した挙動 | 結果 |
|---|---|---|
| 起動・メニュー | 単一HTMLから起動、マウスでキャラ→ステージ→出撃 | PASS |
| 日本語／英語 | 即時切替、設定の再読み込み | PASS |
| 移動 | 実キーボード入力、斜め入力の正規化、1秒移動距離 | PASS |
| ポーズ | 時刻停止と再開、ポーズ→設定→戻るの復帰先 | PASS |
| 非表示イベント | 自動ポーズ、押下中の入力解除 | PASS（イベントを合成） |
| Gamepad API | 左スティック、デッドゾーン、D-pad、Startでポーズ | PASS（APIを模擬、実機未検証） |
| Audio | AudioContext起動、suspend後の再開、24ボイス以下 | PASS（出力の聴感評価は別） |
| XP・レベルアップ | XPで候補出現、装備の実更新、連続閾値処理 | PASS |
| 選択操作 | リロール回数、スキップ、除外した候補の状態変更 | PASS |
| 宝箱競合 | レベルアップ中に保留した宝箱を後で処理 | PASS |
| 進化 | 最大ムチ＋命の器＋対象宝箱で進化、元スロットを置換 | PASS |
| 進化回帰 | 進化後100回候補生成して消費済みムチが再出現しない | PASS |
| 死亡・結果・保存 | 結果画面、Goldとラン回数の反映、リロード後の保持 | PASS |
| オプション | 実スライダー／言語セレクトから変更し再読み込み | PASS |
| リサイズ | 3解像度でCanvasが画面内に収まり16:9を維持 | PASS |
| Lab入力上限 | UIから敵数10億を入力→2500に制限、処理が復帰 | PASS（最終スモーク7.7ms） |
| オフライン構成 | 外部リクエストなし、HTTPで単一HTMLを実行 | PASS |
| `file://` 直接起動 | Chromiumの管理ポリシーがナビゲーションを拒否 | **BLOCKED** |

`file://` のエラーは `net::ERR_BLOCKED_BY_ADMINISTRATOR`。環境の `/etc/chromium/policies/managed/urls.json` は `URLBlocklist: ["*"]` とHTTP/HTTPS等だけの許可リストを持つ。管理ポリシーを変更して回避していない。アプリの起動不具合と断定せず、直接ファイル起動の検証は未完了として残す。ブラウザ検証コマンドはBLOCKEDも残すため終了コード1を返す。

## Goldenスクリーンショットと実測値

Seed **413**、Antonio、Mad Forest、自動選択・自動移動、**無敵ONの検証用ラン**。自然生存ランの合格証拠ではない。時刻は実際のシミュレーションから進め、必要位置の切り貼りはしていない。

| 時刻 | Level | Kills | 敵総数 | 可視敵（当たり円） | 当たり円の画面占有率 |
|---|---:|---:|---:|---:|---:|
| 00:30 | 1 | 1 | 58 | 12 | 0.40% |
| 05:00 | 9 | 594 | 302 | 159 | 3.82% |
| 10:00 | 25 | 2,196 | 565 | 538 | 15.71% |
| 15:00 | 46 | 5,573 | 126 | 89 | 3.73% |
| 20:00 | 50 | 8,984 | 631 | 190 | 4.74% |
| 25:00 | 69 | 13,300 | 977 | 868 | 17.22% |
| 29:00 | 86 | 17,703 | 848 | 773 | 22.56% |

占有率は画面内に投影した敵の当たり円の和集合。実スプライトの不透明画素率や本家の測定値ではない。中央値の比較等に使う前に同じ定義の参照値が必要。

スクリーンショット: [00:30](reports/screenshots/golden_0030.png)、[05:00](reports/screenshots/golden_0500.png)、[10:00](reports/screenshots/golden_1000.png)、[15:00](reports/screenshots/golden_1500.png)、[20:00](reports/screenshots/golden_2000.png)、[25:00](reports/screenshots/golden_2500.png)、[29:00](reports/screenshots/golden_2900.png)。

29分地点の後、シミュレーションを通常速度で動かして120 RAFを採取（最初の2区間を除外）。855体時に **56.64 FPS**、フレーム中央値16.70ms、p95 16.80ms、最大66.70ms、update平均1.84ms、render平均4.45ms。これはこのクラウド機の短時間測定であり、Windows PCの保証値ではない。別の500/1000/1500体等の負荷計測は [reports/render-performance.md](reports/render-performance.md) に記録する。

## 視覚確認と未解決事項

実スクリーンショットを画像表示して確認した。日本語の可読性とパネル内の収まり、HUD配置、29分地点で進化前ムチが再取得されない修正を確認。20分地点には中央の空白と一方向に圧縮した追走集団があり、敵の総数だけを根拠に本家相当の包囲圧力とは判定しない。

公式版の対象バージョン・波・レベル曲線・宝箱演出・スプライト寸法の比較は、参照元へのアクセスと映像計測が未完了。本家との差分比較は **未合格**。物理Gamepad、Windows 10/11上のChrome、直接ファイル起動、手動の音声聴感も未検証。

長時間・複数Seedの自然ラン、無敵補助ラン、60分soakの区別は [benchmark_results.md](benchmark_results.md) に記録する。自然ランが早期死亡した場合を「30分生存PASS」としない。これらの制限と [gap_report.md](gap_report.md) の主要差分が解消されるまで、最終リリース合格とは呼ばない。

## 確定した長時間試験と単独負荷計測

`reports/benchmark.json` の最終エンジンハッシュは上記 `4fc33cac…` と一致。通常Bot 5 Seedは325.85〜755.90秒で死亡（30分到達0/5）。無敵ONの継続試験は5/5が1801秒へ到達、無敵ONのEndless耐久試験は3601秒・Level123・38,680 killsまで進んだ。通常生存・バランス一致・メモリリーク完全否定の証拠にはしない。

CPU競合を止めたブラウザ再計測では、実敵500/1000/1500体で60.00/60.00/58.05 FPS。1500体のCPU p95は11.4ms。全5負荷ケースでCPU/RAFの100ms超サンプルは0。Dは人工の弾表示配列であり、未実装の実武器Projectile処理の検証とは扱わない。並行試験中のNode耐久・XP負荷には100ms超が記録されており、過去の値も `performance_report.md` に保持する。

詳細: [benchmark_results.md](benchmark_results.md)、[performance_report.md](performance_report.md)、[単独ブラウザ計測](reports/render-performance.md)。本家比較とWindows実機での性能ゲートは未合格。

## 導入手順の再現

最終保存前に `npm ci --ignore-scripts` → `npm run build` → 全37テストを再実行し、全成功。再生成HTMLのSHA-256は上記最終スモーク検証済みHTMLと完全一致した。環境設定の `install_script` と `start_skill` も下書き保存済みであり、公開や新タスクでの復元を確認したという意味ではない。

## Phase 2 superseding report

The Phase1counts/hashes above are historical. Current Phase2 evidence is in phase2_test_report.md and reports/phase2-summary.json:118unit/integration passes, finalHTML24pass/0fail/1policyblocked, UI60passes,7timestamp legacy parity and real-time normal-speed30minute run. Current raw actual-projectile performance and strict remaining flags are preserved separately; no final fidelity release is claimed.
