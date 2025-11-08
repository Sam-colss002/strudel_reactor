
let a = parseFloat(0);
let b = parseFloat(1);
let c = parseFloat(0.5);
let d = parseInt(120);
let e = "Dark";
let f = "controlBtn";
let g = parseInt(14);
let h = parseInt(6);
let i = parseInt(40);
let j = parseInt(1);
let k = parseFloat(0.01);
let l = false; // determines whether or not debug theme and various debug functions are included
let m = true;
let n = false;
let o = parseFloat(0.0);
let p = parseFloat(5.0); // idk what max should be
let q = parseFloat(0.0);
let r = parseFloat(0.1);
let s = ["Debug", "Light", "Dark"];

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
    THEMES_LIST: s
};

export default base;