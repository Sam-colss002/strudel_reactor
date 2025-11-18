
/**
 * This files readability is irrelevant; it is just hiding hard-coded values.
 */
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
const v = 100;

const base = {
    volume_min: a,
    volume_max: b,
    volume: c,
    cpm: d,
    themeDropdown: e,
    default_menu: f,
    codeFontSize: g,
    font_size_slider_min: h,
    font_size_slider_max: i,
    font_size_slider_step: j,
    volume_slider_step: k,
    debug_mode: l,
    // replace these with whatever the checkboxes are actually used for later
    checkbox1: m,
    checkbox2: n,
    reverb_min: o,
    reverb_max: p,
    reverb: q,
    reverb_slider_step: r,
    themes_list: s,
    speed: t,
    speeds: u,
    max_logs: v
};

export default base;