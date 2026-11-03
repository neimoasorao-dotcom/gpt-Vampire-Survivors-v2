import json,re,pathlib,hashlib
root=pathlib.Path('.')
def load(p):return json.loads(pathlib.Path(p).read_text())
b=load('reports/phase2-browser.json');g=load('reports/phase2-golden-full.json');rt=load('reports/phase2-realtime-final.json');builds=load('reports/phase2-builds.json');ui=load('reports/ui-layout.json');unit=pathlib.Path('reports/phase2-unit.tap').read_text();artifact=pathlib.Path('dist/vampire_survivors.html').read_bytes()
counts={k:int(re.search(r'^# '+k+r' (\d+)',unit,re.M)[1])for k in ['tests','pass','fail','skipped']}
h=hashlib.sha256(artifact).hexdigest();assert h==b['sha256'];assert len(g['marks'])==7 and g['passed'];assert rt['fullNormalSpeedRun'];assert counts['fail']==0 and b['failed']==0
stress=load('reports/phase2-stress.json')
report={'date':'2026-11-03','artifact':'dist/vampire_survivors.html','bytes':len(artifact),'sha256':h,'unit':counts,'browser':{k:b[k]for k in ['passed','failed','blocked']},'uiPassed':sum(x['status']=='passed'for x in ui['checks']),'golden':{'passed':True,'timestamps':[x['time']for x in g['marks']]},'realtime':{'completed':rt['completed'],'normalSpeed':rt['fullNormalSpeedRun'],'wallSeconds':rt['wallSeconds'],'artifactSha256':rt['sha256'],'final':rt['final']},'buildsCompleted':sum(x['completed']for x in builds['runs']),'release':False,'reason':'Current-PC version, original gameplay/visual comparison and precise enemy/map figures remain unresolved; see gap_report.md.'}
pathlib.Path('reports/phase2-summary.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
f=rt['final'];rows='\n'.join(f"| {x['build']} | {x['character']} | {x['stage']} | {x['final']['time']:.2f} | {x['final']['level']} | {x['final']['kills']} | {'到達'if x['completed']else'未到達'} |"for x in builds['runs'])
text=f'''# Phase 2 最終計測記録 — 完成判定とは区別

更新日：2026-11-03（Asia/Tokyo）。最終HTML `{len(artifact):,} bytes`、SHA-256 `{h}`。

- Unit / integration：**{counts['pass']}/{counts['tests']} PASS、失敗{counts['fail']}、Skip{counts['skipped']}**。`reports/phase2-unit.tap`。
- 最終HTMLブラウザ検査：**{b['passed']} PASS / {b['failed']} FAIL / {b['blocked']} BLOCKED**。外部リクエスト{len(b['externalRequests'])}、Console/uncaught errors {len(b['errors'])}。`reports/phase2-browser.json`。
- 日英・1366×768 / 1920×1080 / 2560×1440のUI検査：**{report['uiPassed']}/60 PASS**。`reports/ui-layout.json`。
- 旧Golden回帰：**7/7 PASS**。旧タグのソースを別ディレクトリへ読み出し、`legacy:true`で時刻30/300/600/900/1200/1500/1740秒のLevel・HP・XP・Kills・DPS・敵／投射物／拾得物・RNG・座標・装備が一致。ローカル旧版との一致であり、本家の正しさの証明ではない。`reports/phase2-golden-full.json`。

## 通常速度の実時間ラン

Seed271 / Gennaro / Mad Forest / AoE方針、**無敵OFF・速度1倍**。有益なMeta PowerUpを最大購入・武器プール解放済みの進行状態をQA用に準備し、ラン開始後のXP・武器付与・時刻変更・高速tick呼出しは使っていない。自動プレイヤーが移動・強化を選択した。新規アカウントでの初回30分生存や、人間による本家との操作感比較ではない。

**実時間{rt['wallSeconds']:.2f}秒（31分10秒）で、ゲーム内{f['time']:.2f}秒へ到達。Level {f['level']}、{f['kills']:,} kills、HP {f['player_hp']}、エラー{len(rt['errors'])}、外部通信{len(rt['requests'])}。** 全記録で無敵false／速度1、可視タブ。30:00後に通常敵が消えReaperが出現しており、強制YOU WINでは終了していない。自然接触死亡とステージ別Reaper再出現は別の自動テストでも確認した。

実時間ランはSHA-256 `{rt['sha256']}` の凍結HTMLで実行した。後続の変更は解放・保存の証跡／旧セーブimport補正、Libraryの30分以降Reaper間隔、ピクセル同値の描画キャッシュである。最終HTMLそのものは変更後に再度ブラウザ検査済みだが、変更後の全HTMLをもう一度30分動かしたとは主張しない。旧計測版と最終版を同じハッシュとして扱わない。

証拠：`reports/phase2-realtime-final.json`（61定期サンプル）、`reports/phase2-realtime-final-screenshots/`。初期Phase2版の別実時間ランも`reports/phase2-realtime.json`に保存し、混同しない。

## ビルド多様性 — 高速回帰

無敵OFF、購入済みMeta最大・全武器プールの独立試験。CPU時間をFPSへ読み替えていない。

| 方針 | Character | Stage | 時間(s) | Level | Kills | 30分 |
|---|---|---|---:|---:|---:|---|
{rows}

## 検証の限界

`file://` は管理Chromiumの `ERR_BLOCKED_BY_ADMINISTRATOR` で未検証。HTTPでは単一ファイルのバイト列を配信し、ネット依存を禁止して実行。Windows実機・物理Gamepad・最新PC版／本家画像動画との比較は未実施。Gamepad API・保存移行・入力・音声制限の既存回帰は維持した。

実投射物を使う高密度試験とCPU内訳は `reports/phase2-stress.json` / `.md` と `reports/phase2-render-profile.json` を参照。平均FPSだけで安定30FPSや100ms未満の合格を宣言しない。最終Releaseゲートは `gap_report.md` に従い未合格で、忠実度スコアは未採点。
'''
pathlib.Path('phase2_test_report.md').write_text(text)
print(json.dumps({k:report[k]for k in ['bytes','sha256','unit','browser','uiPassed','buildsCompleted','release']},ensure_ascii=False))
