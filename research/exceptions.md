# Exceptions registry

| Rule family | State | Required confirmation/test |
| --- | --- | --- |
| Stage chest evolution time/early boss exceptions | unknown | Chest spawn eligibility versus pickup time; stage overrides |
| Passive max level in recipes | unknown | Verify each recipe independently |
| Unions consuming multiple weapon slots | unknown | Input removal/output replacement and inventory capacity |
| Gift/morph output and passive handling | unknown | Trigger, ownership and slot effects |
| Character evolution overrides | unknown | Character-specific recipe/timing predicates |
| Pentagram XP/drop deletion | estimated behaviour | Lucky preservation, boss resistance and timing |
| Garlic per-enemy cooldown/resistance change | estimated behaviour | Hit timestamp and knockback interaction |
| Gem cap/consolidated red gem | unknown | XP conservation, consolidation target and pickup timing |
| Stage pickup beyond six slots | unknown | Distinguish level choice capacity from ground pickup |
| Terminal Reaper and revivals/endless | unknown | Exact timing, damage/scaling and end conditions |
| Crit/heal cooldown and evolution effects | unknown | Eligible targets and event throttling |

Each implemented exception needs a rule-data identifier and a regression test. No blank row implies default original behaviour is confirmed.


## Evidence discipline

Status vocabulary: `confirmed` = read authoritative evidence, `measured` = reproducible direct measurement, `cross_checked` = independent supporting sources, `estimated` = provisional engineering assumption, `unknown` = unavailable. An attempted URL is not evidence of its contents. Current reference source access is denied; source-specific values below are hypotheses, not extracted measurements. See `evidence.json`, `estimated_values.md`, and `reference_target.md`.
