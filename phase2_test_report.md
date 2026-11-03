# Phase 2 最終計測記録 — 完成判定とは区別

更新日：2026-11-03（Asia/Tokyo）。最終HTML `213,550 bytes`、SHA-256 `1c7c62aa12966b1da99b82bd3f9e478ad9566c5993d50d0cf13d4b5f6f2e6ce8`。

- Unit / integration：**118/118 PASS、失敗0、Skip0**。`reports/phase2-unit.tap`。
- 最終HTMLブラウザ検査：**24 PASS / 0 FAIL / 1 BLOCKED**。外部リクエスト0、Console/uncaught errors 0。`reports/phase2-browser.json`。
- 日英・1366×768 / 1920×1080 / 2560×1440のUI検査：**60/60 PASS**。`reports/ui-layout.json`。
- 旧Golden回帰：**7/7 PASS**。旧タグのソースを別ディレクトリへ読み出し、`legacy:true`で時刻30/300/600/900/1200/1500/1740秒のLevel・HP・XP・Kills・DPS・敵／投射物／拾得物・RNG・座標・装備が一致。ローカル旧版との一致であり、本家の正しさの証明ではない。`reports/phase2-golden-full.json`。

## 通常速度の実時間ラン

Seed271 / Gennaro / Mad Forest / AoE方針、**無敵OFF・速度1倍**。有益なMeta PowerUpを最大購入・武器プール解放済みの進行状態をQA用に準備し、ラン開始後のXP・武器付与・時刻変更・高速tick呼出しは使っていない。自動プレイヤーが移動・強化を選択した。新規アカウントでの初回30分生存や、人間による本家との操作感比較ではない。

**実時間1870.26秒（31分10秒）で、ゲーム内1802.18秒へ到達。Level 66、50,017 kills、HP 156、エラー0、外部通信0。** 全記録で無敵false／速度1、可視タブ。30:00後に通常敵が消えReaperが出現しており、強制YOU WINでは終了していない。自然接触死亡とステージ別Reaper再出現は別の自動テストでも確認した。

実時間ランはSHA-256 `374db82b584959a3a50b90e053326eada36350cf06491e8b14332f2eb65f8c31` の凍結HTMLで実行した。後続の変更は解放・保存の証跡／旧セーブimport補正、Libraryの30分以降Reaper間隔、ピクセル同値の描画キャッシュである。最終HTMLそのものは変更後に再度ブラウザ検査済みだが、変更後の全HTMLをもう一度30分動かしたとは主張しない。旧計測版と最終版を同じハッシュとして扱わない。

証拠：`reports/phase2-realtime-final.json`（61定期サンプル）、`reports/phase2-realtime-final-screenshots/`。初期Phase2版の別実時間ランも`reports/phase2-realtime.json`に保存し、混同しない。

## ビルド多様性 — 高速回帰

無敵OFF、購入済みMeta最大・全武器プールの独立試験。CPU時間をFPSへ読み替えていない。

| 方針 | Character | Stage | 時間(s) | Level | Kills | 30分 |
|---|---|---|---:|---:|---:|---|
| whip | antonio | forest | 1801.67 | 46 | 15524 | 到達 |
| wand | imelda | forest | 1801.42 | 40 | 23725 | 到達 |
| aoe | poe | forest | 1801.48 | 41 | 61757 | 到達 |
| bible | dommario | library | 1801.67 | 33 | 14135 | 到達 |
| mixed | gennaro | library | 1800.77 | 82 | 96970 | 到達 |

## 検証の限界

`file://` は管理Chromiumの `ERR_BLOCKED_BY_ADMINISTRATOR` で未検証。HTTPでは単一ファイルのバイト列を配信し、ネット依存を禁止して実行。Windows実機・物理Gamepad・最新PC版／本家画像動画との比較は未実施。Gamepad API・保存移行・入力・音声制限の既存回帰は維持した。

実投射物を使う高密度試験とCPU内訳は `reports/phase2-stress.json` / `.md` と `reports/phase2-render-profile.json` を参照。平均FPSだけで安定30FPSや100ms未満の合格を宣言しない。最終Releaseゲートは `gap_report.md` に従い未合格で、忠実度スコアは未採点。
