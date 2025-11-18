
const a = parseFloat(0);
const b = parseFloat(1);
const c = parseFloat(0.5);
const d = parseInt(120);
const e = "Dark";
const f = "helpBtn";
const g = parseInt(14);
const h = parseInt(6);
const i = parseInt(40);
const j = parseInt(1);
const k = parseFloat(0.01);
const l = false; // determines whether or not debug theme and various debug functions are included
const m = true;
const n = false;
const o = parseFloat(0.0);
const p = parseFloat(5.0); // idk what max should be
const q = parseFloat(0.0);
const r = parseFloat(0.1);
const s = ["Debug", "Light", "Dark"];
const t = parseFloat(1.0);
const u = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]

const base = {
    VOLUME_MIN: a,
    VOLUME_MAX: b,
    DEFAULT_VOLUME: c,
    DEFAULT_CPM: d,
    DEFAULT_THEME: e,
    DEFAULT_MENU: f,
    DEFAULT_FONT_SIZE: g,
    FONT_SIZE_SLIDER_MIN: h,
    FONT_SIZE_SLIDER_MAX: i,
    FONT_SIZE_SLIDER_STEP: j,
    VOLUME_SLIDER_STEP: k,
    DEBUG_MODE: l,
    // replace these with whatever the checkboxes are actually used for later
    CHECKBOX_1: m,
    CHECKBOX_2: n,
    REVERB_MIN: o,
    REVERB_MAX: p,
    DEFAULT_REVERB: q,
    REVERB_SLIDER_STEP: r,
    THEMES_LIST: s,
    DEFAULT_SPEED: t,
    SPEEDS: u
};

export default base;