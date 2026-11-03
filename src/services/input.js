const KEY_ACTIONS = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  Enter: 'confirm', Space: 'confirm', Escape: 'cancel', KeyP: 'pause'
};
const editable = target => target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable);
export class Input {
  constructor(options = {}) {
    if (typeof options === 'function') options = { onAction: options };
    this.keys = new Set();
    this.onAction = options.onAction || (() => {});
    this.gamepadEnabled = options.gamepadEnabled !== false;
    this.pad = { x: 0, y: 0 };
    this.buttons = new Set();
    this.target = options.target || globalThis.window;
    this.down = event => {
      if (editable(event.target)) return;
      const action = KEY_ACTIONS[event.code];
      if (!action) return;
      event.preventDefault?.();
      this.keys.add(event.code);
      if (!event.repeat) this.onAction(action);
    };
    this.up = event => { this.keys.delete(event.code); };
    this.blur = () => { this.keys.clear(); this.buttons.clear(); this.pad.x = this.pad.y = 0; };
    this.target?.addEventListener('keydown', this.down);
    this.target?.addEventListener('keyup', this.up);
    this.target?.addEventListener('blur', this.blur);
    this.visibility = () => { if (globalThis.document?.hidden) this.blur(); };
    globalThis.document?.addEventListener('visibilitychange', this.visibility);
  }
  poll() {
    if (!this.gamepadEnabled) { this.pad.x = this.pad.y = 0; this.buttons.clear(); return; }
    let pads;
    try { pads = globalThis.navigator?.getGamepads?.() || []; } catch { pads = []; }
    const pad = Array.from(pads).find(p => p && p.connected !== false);
    if (!pad) { this.pad.x = this.pad.y = 0; this.buttons.clear(); return; }
    const pressed = index => !!pad.buttons?.[index]?.pressed;
    const rawX = Number.isFinite(pad.axes?.[0]) ? pad.axes[0] : 0;
    const rawY = Number.isFinite(pad.axes?.[1]) ? pad.axes[1] : 0;
    const magnitude = Math.hypot(rawX, rawY), deadzone = .2;
    const scaled = magnitude > deadzone ? Math.min(1, (magnitude - deadzone) / (1 - deadzone)) / magnitude : 0;
    let x = rawX * scaled, y = rawY * scaled;
    if (pressed(14) || pressed(15)) x = Number(pressed(15)) - Number(pressed(14));
    if (pressed(12) || pressed(13)) y = Number(pressed(13)) - Number(pressed(12));
    const length = Math.hypot(x, y);
    if (length > 1) { x /= length; y /= length; }
    this.pad.x = x; this.pad.y = y;
    const current = new Set();
    if (pressed(0)) current.add('confirm');
    if (pressed(1)) current.add('cancel');
    if (pressed(9)) current.add('pause');
    if (y < -.5) current.add('up');
    if (y > .5) current.add('down');
    if (x < -.5) current.add('left');
    if (x > .5) current.add('right');
    for (const action of current) if (!this.buttons.has(action)) this.onAction(action);
    this.buttons = current;
  }
  direction() {
    let x = Number(this.keys.has('KeyD') || this.keys.has('ArrowRight')) - Number(this.keys.has('KeyA') || this.keys.has('ArrowLeft'));
    let y = Number(this.keys.has('KeyS') || this.keys.has('ArrowDown')) - Number(this.keys.has('KeyW') || this.keys.has('ArrowUp'));
    if (x || y) { const length = Math.hypot(x, y); return { x: x / length, y: y / length }; }
    return { x: this.pad.x, y: this.pad.y };
  }
  destroy() {
    this.target?.removeEventListener('keydown', this.down);
    this.target?.removeEventListener('keyup', this.up);
    this.target?.removeEventListener('blur', this.blur);
    globalThis.document?.removeEventListener('visibilitychange', this.visibility);
    this.blur();
  }
}
