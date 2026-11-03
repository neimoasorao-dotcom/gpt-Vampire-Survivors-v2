# Gap report — Phase 2 intermediate build

Updated 2026-11-03 (Asia/Tokyo). The original slice is preserved and the user's Phase 2 request authorizes expansion. This report no longer treats all other weapons/characters/Library as absent. It still distinguishes working local code, source observations and original-game fidelity.

## Remaining release-blocking differences and evidence gaps

| ID | Severity | Current gap and evidence | Next verifiable action |
| --- | --- | --- | --- |
| REF-001 | P1 | Latest official stable PC version/hotfix is unknown. Steam/Poncle/wiki requests remain CONNECT403. Genuine public community sources were acquired, but they do not identify an official current patch. `research/accessphase2.json`, `research/phase2_sources.md`. | Apply research-domain configuration, read official chronology and pin the target/hotfix. Preserve source confidence boundaries. |
| REF-002 | P1 | No original gameplay capture set or comparable run metrics. Camera/sprite/UI scale, movement, pressure, XP, chest tempo and audio mix cannot be declared source-equivalent from screenshots of this implementation alone. | Acquire several lawful, documented reference runs/captures and use `reference/measurement_protocol.md`. |
| WAVE-001 | P1 | Forest/Library minute tables, minimums, intervals and selected chest flags are now sourced, but the runtime interpretation of spawn batches, mixed weights and density events is reconstructed. Enemy HP/damage/speed/hitbox/scale remain mostly estimates. | Verify enemy database and original spawn semantics; compare density/TTK/XP time series without reducing counts for FPS. |
| WEAPON-001 | P1 | Fourteen base behaviours and thirteen results exist, with selected community level/stat tables. World-unit conversions, hitboxes, some target/rehit rules, secondary effects and exact evolved exceptions remain unmeasured against the target game. | Compare controlled attacks/TTK/DPS and original footage per weapon; keep sourced values separate from local conversion estimates. |
| CURVE-001 | P1 | The XP threshold/merge curve and normal build progression are not compared with target-version runs. Bot survival with maxed beneficial meta upgrades does not prove new-player pacing or human Game Feel. | Compare several source runs with matching character, mode, PowerUps and route; use natural and assisted results separately. |
| CHEST-001 | P1 | Per-boss eligibility/probabilities and early Forest evolution exception are represented, and reveal/skip controls exist. Exact reward categories, multi-evolution exceptions, original reveal/skip/audio timing and all stage/character exceptions are not a completed match. | Obtain frame/timing evidence and exception tables; verify reward/consumption/slot/save behaviour per rule. |
| STAGE-001 | P1 | Library has real horizontal bounds, obstacles, camera and distinct waves. Both stages still use authored map geometry/item world coordinates and lack the complete original special-event/secret/relic behaviour. | Measure geometry, camera scale, obstacle collision and stage-item placement/slot exceptions. Keep Phase 3 secrets separate from currently working stage selection. |
| META-001 | P1 evidence gap | Character, weapon and stage rules plus save version 2 exist. Current official costs, scaling, full unlock timing and missing/old evidence cases need complete verification. Shared weapon gating is integrated and verified for new saves, pickup/breakable/character-time evidence and v1 import/reload migration. | Verify new-save six-weapon pool, each real unlock route, purchased starting equipment and migration on the final artifact. Preserve true prior discoveries instead of resetting progression. |
| PLATFORM-001 | P1 evidence gap | Windows stable Chrome and physical Gamepad remain untested. Managed Chromium rejects `file://` with `ERR_BLOCKED_BY_ADMINISTRATOR`; HTTP success does not waive direct-file testing. | Test the final HTML on a permitted browser and target Windows/controller. Do not modify managed policy to fabricate a pass. |
| PERF-001 | P1 evidence gap | Cloud Linux timing does not establish the target Windows 60FPS/30FPS gates. Final isolated Phase2 caseE retained1500enemies+257realprojectiles+400XP+600particles at50.90FPS, CPU p9515ms and0CPU/RAFstalls>100ms. E RAF p9533.4ms does not meet the unchanged strict33.33ms flag. Exact Windows/frame-pacing validation remains outstanding. | Profile update/render/collision/GC under actual projectile loads and retain entity counts. Separate concurrent cloud scheduling from measured CPU cost; validate target hardware. |

## Remaining visible/minor differences

| ID | Severity | Gap | Required follow-up |
| --- | --- | --- | --- |
| VISUAL-001 | P2 | Procedural sprites/backgrounds/UI preserve roles and readability, but animation/scale/luminance/coverage have no original-image comparison. | Compare semantic scale/density metrics, not protected asset extraction or a misleading raw-pixel score. |
| I18N-001 | P2 | Japanese/English labels work, but official current terminology, reference enemy names and Windows font metrics are not fully checked. | Review official Japanese captures and all requested resolutions with Windows fallbacks. |
| AUDIO-001 | P2 | Original weapon SFX/BGM are bounded and functional, but cadence, pitch hierarchy and chest excitement are not compared. | Perform listening and timing comparison; API voice count is not audibility proof. |
| PICKUP-001 | P2 | Pickup/drop roles work; detailed probabilities/durations and Little Clover magnitude/lifetime retain estimated fields. | Acquire/measure each effect and drop source, preserve existing regression tests. |
| EXCEPTION-001 | P2 | Ordinary evolutions and Vandalier union are real recipes; the full Gift/Morph/character-override catalogue is not supplied. | Add researched rules and dedicated tests when advancing beyond the representative Phase 2 set. |

## Corrected Phase 1/Phase 2 gaps

The code no longer limits normal gameplay to Antonio and Whip. It contains 14 representative base weapons, 13 evolution/union results, 15 passives, 11 characters, two distinct stages and 16 PowerUps. Consumed base weapons cannot re-enter the level pool; Vandalier consumes both birds and can continue leveling. Library is not merely a background swap. Version 2 saves record purchases and unlock evidence.

Other corrected local defects include fixed-tick rejection, endless-cycle boundary scheduling, bounded laboratory inputs, Clover's wrong coin reward, Greed on actual coin/bag pickups, options return navigation, temporary modifier expiry, Bible/Vespers timing, Garlic entry hits and weapon audio event routing. Consult the tests and current generated reports for the exact revision and result; these fixes do not prove original fidelity.

## Completion boundary and external prerequisite

No current completed local test should be labelled a full-scope P0=0/P1=0 guarantee. The final release gate remains open and comparative quality remains unscored. Arcana/Darkana, relics, advanced modes/secrets and the remainder of base/DLC content are future-phase scope, not silently claimed implemented.

Research-domain changes are saved in the environment configuration draft but are not applied to the running policy. Review/save those environment settings and publish when appropriate, then retry the exact official-source requests. No additional secret/token is required. Independent implementation, regression and current community-data comparison can continue without treating a draft save as working official-source access.

## Completed local validation update

VALIDATION-001 is closed for the scoped local checks:118unit/integration passes, finalHTML24pass/0fail/1policyblocked, UI60passes, seven actual legacy Golden marks and a completed real1x/no-invincibility run. Exact frozen-run versus final-artifact hashes and later metadata/render-cache differences remain disclosed in phase2_test_report.md. This closes neither original-game reference nor new-player pacing gaps. Renderer optimization preserved all32pixel-parity cases and a full dense frame exactly, with entity counts retained.
