# Reference acquisition and comparison protocol

No original-game image/video is currently present. This file is a protocol, not captured evidence. Original screenshots must be acquired lawfully after source access, with URL, video title/channel, upload date, timecode, patch, character, powerups, stage, mode, build and viewport metadata. Do not redistribute protected source assets; store permitted analytical crops only when appropriate.

## Capture register

| Capture | Reference acquired | Reconstruction required |
| --- | --- | --- |
| Opening / main / character / stage | no | rendered screenshots |
| 00:30 / 05:00 / 10:00 / 15:00 / 20:00 / 25:00 / 29:00 | no | golden seeded run snapshots |
| Level up / chest / evolution / pause / results | no | actual functional transitions |

## Spatial measurements

At 1920×1080 record player/enemy sprite bounding-box height, gem dimensions, tile period, timer anchor, HUD margins and icon pitch in both screen and normalized coordinates. Track world width separately from screenshot resolution. For each gameplay frame compute world-crop occupied area from object masks or bounding boxes; report overlap and occlusion bias. Color/brightness comparison uses background-only and effect-only regions separately.

## Temporal measurements

Use source frame index and stated video frame rate; if variable/unknown, use timestamp with uncertainty. At least ten clean attack intervals, ten motion segments and three chest events per build. Chest timeline: pickup → panel start → first reveal → subsequent reveals → exit acceptance. Do not infer timing from an edited video cut. Record frame quantization uncertainty (at least one source frame).

## Gameplay comparison

Independent runs must document character/powerups/mode, level-up choices and survival route. At 1/3/5/10/15/20/25/28/29/30 minutes record level, kills, DPS when observable, XP/minute, enemy pressure, bosses and chests. Unknown values stay null. Use distributions/ranges with sample counts; report medians/min/max/variance for reconstruction and reference separately. No score if no reference sample exists.

## Visual checklist (every comparison)

Camera zoom; player size; enemy size; UI age/style; text scale; world emptiness; projectile density; brightness; ground detail; hit strength; gem size; damage-number prominence. Mark each `pass`, `gap`, or `not measured`, with evidence file and severity. No raw-pixel score for independently drawn art.
