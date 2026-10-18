/**
 * 《词句审判庭》公共配置与工具
 */

export const SUPABASE_URL = 'https://cbnlchfvqtcuqmptqnlg.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable__vQn9wLyRdJGnH3IeakYrg_1qvfgm5m';

/** jsDelivr，国内/微信更稳 */
export const SUPABASE_SDK_URL =
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/+esm';

/** 固定场次（库表需要，界面不暴露） */
export const SESSION = 'default';

export const QUESTIONS = [
  {
    q: 1,
    text: '批判批判者，批判的批判，一切批判的批判就是批判的批判。',
    source: 'P142–143',
  },
  {
    q: 2,
    text: '不是意识决定生活，而是生活决定意识。',
    source: 'P152–153',
  },
  {
    q: 3,
    text: '只要改变意识，现实的枷锁就会松动。',
    source: 'P145',
  },
  {
    q: 4,
    text: '没有蒸汽机和珍妮走锭精纺机，就消灭不了奴隶制。',
    source: 'P155',
  },
  {
    q: 5,
    text: '把「人」这个概念想清楚，一切问题都会迎刃而解。',
    source: 'P155',
  },
  {
    q: 6,
    text: '樱桃树只因为商业才被移栽到我们这里。',
    source: 'P155–156',
  },
];

export const LABEL = {
  word: '词句',
  real: '现实',
};

/** 正确答案（用户要求作答后即时反馈） */
export const ANSWERS = {
  1: 'word',
  2: 'real',
  3: 'word',
  4: 'real',
  5: 'word',
  6: 'real',
};

/** 投票页公网地址（看板二维码） */
export const VOTE_URL = 'https://maplemaiden.github.io/mayuan-court/vote.html';

/** 暖调纸感（与页面 CSS 一致） */
export const COLORS = {
  bg: '#1C1914',
  card: '#26211A',
  word: '#B94732',
  real: '#CAA765',
  text: '#E8E1D3',
  muted: '#8C8171',
};

const CLIENT_KEY = 'court_client_id';

export function getClientId() {
  let id = localStorage.getItem(CLIENT_KEY);
  if (!id) {
    id =
      'c_' +
      Math.random().toString(36).slice(2, 10) +
      '_' +
      Date.now().toString(36);
    localStorage.setItem(CLIENT_KEY, id);
  }
  return id;
}

export function isConfigured() {
  return (
    SUPABASE_URL &&
    !SUPABASE_URL.includes('YOUR_PROJECT') &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.includes('YOUR_ANON')
  );
}

export async function loadSupabase() {
  const { createClient } = await import(SUPABASE_SDK_URL);
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export function tallyVotes(votes, q) {
  const filtered = q == null ? votes : votes.filter((v) => v.q === q);
  let word = 0;
  let real = 0;
  for (const v of filtered) {
    if (v.a === 'word') word++;
    else if (v.a === 'real') real++;
  }
  return { word, real, total: word + real };
}

export function participantCount(votes) {
  const clients = new Set();
  for (const v of votes) {
    if (v.client_id) clients.add(v.client_id);
  }
  return clients.size;
}

export function animateNumber(el, to, duration = 300) {
  const from = parseInt(el.dataset.value || '0', 10) || 0;
  if (from === to) {
    el.textContent = String(to);
    el.dataset.value = String(to);
    return;
  }
  const start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = Math.round(from + (to - from) * eased);
    el.textContent = String(val);
    if (t < 1) requestAnimationFrame(frame);
    else el.dataset.value = String(to);
  }
  requestAnimationFrame(frame);
}
