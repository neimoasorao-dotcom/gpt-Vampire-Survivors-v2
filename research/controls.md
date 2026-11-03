# Controls, movement and replay

Requested controls: WASD/arrows, Enter confirm, Escape cancel/pause; gamepad left stick/D-pad plus confirm/cancel/pause; mouse menus. These are product requirements, not confirmed mappings from the current original patch.

Normalize diagonal keyboard movement; analog movement must honor deadzone without NaN from zero-length vectors. Direction/facing updates should preserve facing while stationary. Sample input before each fixed tick; held buttons must not repeat transitions unintentionally.

Reference movement acceleration, pixels/sec, joystick response and obstacle collision: **unknown**. Record input timestamp/tick, normalized direction and menu choices for deterministic replay; replay with identical seed, configuration and input order. Pause/visibility loss must not generate a large catch-up burst.


## Evidence discipline

Status vocabulary: `confirmed` = read authoritative evidence, `measured` = reproducible direct measurement, `cross_checked` = independent supporting sources, `estimated` = provisional engineering assumption, `unknown` = unavailable. An attempted URL is not evidence of its contents. Current reference source access is denied; source-specific values below are hypotheses, not extracted measurements. See `evidence.json`, `estimated_values.md`, and `reference_target.md`.
