// Original oscillator-based soundtrack and feedback. No recorded game audio is used.
const clamp = (v, fallback) => typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : fallback;
const NOTE = midi => 440 * 2 ** ((midi - 69) / 12);
const PROGRESSION = [45, 45, 41, 43, 45, 48, 41, 40];
const MELODY = [0, 7, 12, 10, 7, 3, 5, 7, 0, 7, 15, 12, 10, 7, 3, 7];
export class AudioService {
  constructor() {
    this.context = null;
    this.settings = { master: .6, music: .35, sfx: .6 };
    this.voices = new Set();
    this.cooldowns = new Map();
    this.musicEnabled = true;
    this.nextBeat = 0;
    this.beat = 0;
    this.maxVoices = 24;
  }
  async unlock() {
    const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContext) return false;
    try {
      if (!this.context || this.context.state === 'closed') {
        this.context = new AudioContext();
        const ctx = this.context;
        this.master = ctx.createGain();
        this.music = ctx.createGain();
        this.sfx = ctx.createGain();
        // Conservative output headroom prevents clipping even with overlapping hit feedback.
        this.compressor = ctx.createDynamicsCompressor();
        this.compressor.threshold.value = -14;
        this.compressor.knee.value = 12;
        this.compressor.ratio.value = 6;
        this.compressor.attack.value = .003;
        this.compressor.release.value = .12;
        this.music.connect(this.master); this.sfx.connect(this.master);
        this.master.connect(this.compressor); this.compressor.connect(ctx.destination);
        this.nextBeat = ctx.currentTime + .04;
        this.update(this.settings);
      }
      if (this.context.state === 'suspended') await this.context.resume();
      return this.context.state === 'running';
    } catch { return false; }
  }
  update(settings = {}) {
    for (const key of ['master', 'music', 'sfx']) this.settings[key] = clamp(settings[key], this.settings[key]);
    if (!this.context || this.context.state === 'closed') return;
    const now = this.context.currentTime;
    this.master.gain.setTargetAtTime(this.settings.master * .7, now, .025);
    this.music.gain.setTargetAtTime(this.settings.music * .32, now, .025);
    this.sfx.gain.setTargetAtTime(this.settings.sfx * .5, now, .025);
  }
  tone(frequency, duration, { gain = .16, wave = 'square', end = frequency, delay = 0, music = false } = {}) {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running' || this.voices.size >= this.maxVoices) return false;
    const musicVoices = [...this.voices].filter(v => v.music).length;
    if ((music && musicVoices >= 8) || (!music && this.voices.size - musicVoices >= 16)) return false;
    const oscillator = ctx.createOscillator(), envelope = ctx.createGain();
    const when = ctx.currentTime + delay;
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(Math.max(20, frequency), when);
    if (end !== frequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, end), when + duration);
    envelope.gain.setValueAtTime(0, when);
    envelope.gain.linearRampToValueAtTime(gain, when + .005);
    envelope.gain.exponentialRampToValueAtTime(.0001, when + duration);
    oscillator.connect(envelope); envelope.connect(music ? this.music : this.sfx);
    const voice = { oscillator, envelope, music };
    this.voices.add(voice);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); this.voices.delete(voice); };
    oscillator.start(when); oscillator.stop(when + duration + .01);
    return true;
  }
  event(type, data = {}) {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running') return;
    const limits = { xp: .045, hit: .07, death: .1, enemyDeath: .1, attack: .08, coin: .06, crit: .06 };
    const now=ctx.currentTime,key=type==='weapon'?'weapon:'+data.id:type;
    if(now-(this.cooldowns.get(key)??-Infinity)<(type==='weapon'?.09:limits[type]||.02))return;
    this.cooldowns.set(key,now);
    const note = (f, d, options) => this.tone(f, d, options);
    switch (type) {
      case 'weapon': {
        const id={holy:'wand',thousand:'knife',spiral:'axe',heaven:'cross',vespers:'bible',hellfire:'fire',soul:'garlic',borra:'water',nofuture:'runetracer',thunder:'lightning',moon:'pentagram',vandalier:'peachone'}[data.id]||data.id;
        switch(id){
          case 'wand':note(740,.09,{gain:.075,wave:'triangle',end:1200});break;
          case 'knife':note(1900,.035,{gain:.045,wave:'triangle',end:500});break;
          case 'axe':note(180,.12,{gain:.085,wave:'sawtooth',end:65});break;
          case 'cross':note(440,.12,{gain:.065,wave:'triangle',end:660});note(220,.09,{gain:.04,wave:'sine',delay:.03});break;
          case 'bible':note(196,.2,{gain:.06,wave:'triangle'});note(294,.15,{gain:.04,wave:'sine',delay:.03});break;
          case 'fire':note(85,.2,{gain:.07,wave:'sawtooth',end:38});note(220,.05,{gain:.045,wave:'triangle'});break;
          case 'garlic':note(97,.12,{gain:.035,wave:'sine',end:73});break;
          case 'water':note(1200,.11,{gain:.045,wave:'sine',end:250});note(870,.14,{gain:.035,wave:'sine',end:300,delay:.04});break;
          case 'runetracer':note(650,.08,{gain:.045,wave:'square',end:1450});break;
          case 'lightning':note(62,.16,{gain:.12,wave:'sawtooth',end:28});note(1600,.035,{gain:.06,wave:'triangle',end:260});break;
          case 'pentagram':[40,47,52,59].forEach((m,i)=>note(NOTE(m),.5,{gain:.07,wave:'triangle',delay:i*.07}));break;
          case 'peachone':note(1047,.08,{gain:.045,wave:'sine',end:784});break;
          case 'ebony':note(622,.09,{gain:.045,wave:'sine',end:466});break;
          default:break;
        }
        break;
      }
      case 'menu': note(180, .045, { gain: .08, wave: 'triangle', end: 240 }); break;
      case 'confirm': note(392, .09, { gain: .12 }); note(587, .14, { gain: .09, delay: .06 }); break;
      case 'cancel': note(220, .09, { gain: .08, wave: 'triangle', end: 110 }); break;
      case 'xp': note(1100, .055, { gain: .045, wave: 'sine', end: 1600 }); break;
      case 'attack': note(125, .075, { gain: .12, wave: 'sawtooth', end: 42 }); break;
      case 'hit': note(150, .04, { gain: .07, wave: 'triangle', end: 60 }); break;
      case 'crit': note(1000, .07, { gain: .07, wave: 'triangle', end: 450 }); break;
      case 'enemyDeath':
      case 'death': note(95, .08, { gain: .045, wave: 'square', end: 35 }); break;
      case 'coin': note(1175, .08, { gain: .07, wave: 'sine' }); note(1568, .12, { gain: .06, delay: .06, wave: 'sine' }); break;
      case 'levelup':
        [60, 64, 67, 72, 76].forEach((m, i) => note(NOTE(m), .24, { gain: .09, delay: i * .075, wave: 'triangle' })); break;
      case 'chest':
        [57, 60, 64, 69, 72, 76, 81, 84].forEach((m, i) => note(NOTE(m), .3, { gain: .09, delay: i * .1, wave: 'triangle' })); break;
      case 'evolution':
        [45, 52, 57, 60, 64, 69, 72, 76, 81].forEach((m, i) => note(NOTE(m), .45, { gain: .09, delay: i * .11, wave: 'triangle' })); break;
      case 'playerHit': note(120, .22, { gain: .23, wave: 'sawtooth', end: 40 }); note(75, .16, { gain: .12, wave: 'triangle' }); break;
      case 'gameover': [57, 55, 52, 45].forEach((m, i) => note(NOTE(m), .48, { gain: .14, delay: i * .24, wave: 'triangle' })); break;
      case 'results': [57, 60, 64, 69].forEach((m, i) => note(NOTE(m), .35, { gain: .1, delay: i * .13, wave: 'triangle' })); break;
      case 'heal':
      case 'pickup': note(660, .13, { gain: .08, wave: 'triangle', end: 990 }); break;
      default: break;
    }
  }
  setMusic(enabled) { this.musicEnabled = !!enabled; }
  tick() {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running' || !this.musicEnabled || this.settings.music === 0) return;
    // Schedule by the audio clock, never simulation time: accelerated QA cannot flood audio nodes.
    if (this.nextBeat < ctx.currentTime - .2) this.nextBeat = ctx.currentTime + .02;
    while (this.nextBeat < ctx.currentTime + .14) {
      const step = this.beat % 16;
      const root = PROGRESSION[Math.floor(this.beat / 16) % PROGRESSION.length];
      const delay = Math.max(0, this.nextBeat - ctx.currentTime);
      this.tone(NOTE(root + 12 + MELODY[step]), .17, { music: true, wave: 'triangle', gain: .18, delay });
      if (step % 4 === 0) this.tone(NOTE(root - 12), .6, { music: true, wave: 'triangle', gain: .32, delay });
      if (step % 8 === 0) {
        this.tone(NOTE(root + 7), 1.1, { music: true, wave: 'sine', gain: .09, delay });
        this.tone(NOTE(root + 15), 1.1, { music: true, wave: 'sine', gain: .06, delay });
      }
      this.beat++;
      this.nextBeat += .2;
    }
  }
  stop() {
    for (const voice of this.voices) {
      try { voice.oscillator.stop(); } catch { /* Already ended voices clean themselves up. */ }
      voice.oscillator.disconnect(); voice.envelope.disconnect();
    }
    this.voices.clear();
    this.nextBeat = this.context ? this.context.currentTime + .04 : 0;
    this.beat = 0;
  }
}
