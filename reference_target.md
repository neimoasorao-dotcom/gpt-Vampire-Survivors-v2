# Reference target — verification blocked

- Investigation date: **2026-11-03 (Asia/Tokyo)**.
- Requested platform: current stable PC Steam release, Windows 10/11, keyboard/mouse/gamepad.
- Target version: **unknown**. No version number is asserted.
- Update/hotfix: **unknown**. No claim that a remembered patch is current.
- Base-game scope: Antonio / Whip / Mad Forest first; full base-game expansion is gated by measured vertical-slice comparison.
- DLC scope: current catalogue and compatibility **unknown**; DLC/collaboration characters, art, maps and tracks are deferred until base systems and current catalogue are verified.
- Primary sources attempted: [official site](https://poncle.games/vampire-survivors), [Steam announcements](https://store.steampowered.com/news/app/1794680), [Steam news API](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1794680&count=10&maxlength=3000).
- Secondary sources attempted: [Whip community wiki](https://vampire-survivors.fandom.com/wiki/Whip), [Mad Forest community wiki](https://vampire-survivors.wiki.gg/wiki/Mad_Forest).
- Observed result: all five requests failed before origin access with `Tunnel connection failed: 403 Forbidden`; see `research/access_log.json`. Pages were **not read**, and their URLs are acquisition targets, not supporting citations for numerical claims.
- Configuration: requested research domains were saved to the environment draft by the primary agent. A saved draft does not apply runtime policy or establish source access.

## Implementation target and release boundary

The local engineering baseline is an explicitly estimated, original-asset, 30-minute Antonio/forest simulation. It is not a verified reconstruction of a named PC version. Implementing the engineering baseline permits testing collision, saving, fixed timestep and packaging while access is blocked. It does not satisfy the reference-target gate.

Do not merge later patch-specific behaviour into this baseline silently. Once access works: identify latest stable PC announcement and all later hotfixes, record publication/access timestamps and patch ID, archive permitted source text, then update each evidence entry with its applicable version before retuning.

## Unconfirmed specifications

Current build ID/version; complete base/DLC roster; exact Mad Forest wave and boss tables; enemy statistics and hitboxes; movement/world-unit conversion; weapon timing/level tables; XP thresholds and gem merging; chest eligibility/probabilities/timing; current evolution exceptions; all official Japanese names; audio/visual timing; Arcana/Darkana interactions. No comparison score may be inferred from this missing material.
