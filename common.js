/**
 * 《词句审判庭》公共配置与工具
 * 使用前请填入 SUPABASE_URL 与 SUPABASE_ANON_KEY
 */

export const SUPABASE_URL = 'https://cbnlchfvqtcuqmptqnlg.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable__vQn9wLyRdJGnH3IeakYrg_1qvfgm5m';

/** 题库（无答案字段，防泄题） */
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

export const COLORS = {
  bg: '#12161C',
  card: '#1C232C',
  word: '#A02A34',
  real: '#96702E',
  text: '#E8ECF2',
  emph: '#FFFFFF',
};

const CLIENT_KEY = 'court_client_id';
const SESSION_KEY = 'court_session';

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

export function getSession() {
  const params = new URLSearchParams(location.search);
  const fromUrl = params.get('s');
  if (fromUrl) {
    localStorage.setItem(SESSION_KEY, fromUrl);
    return fromUrl;
  }
  return (
    localStorage.getItem(SESSION_KEY) ||
    new Date().toISOString().slice(0, 10)
  );
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, session);
}

export function isConfigured() {
  return (
    SUPABASE_URL &&
    !SUPABASE_URL.includes('YOUR_PROJECT') &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.includes('YOUR_ANON')
  );
}

/**
 * 从票列表统计某题 / 全场
 * votes: [{ q, a, client_id? }]
 */
export function tallyVotes(votes, q) {
  const filtered = q == null ? votes : votes.filter((v) => v.q === q);
  let word = 0;
  let real = 0;
  const clients = new Set();
  for (const v of filtered) {
    if (v.a === 'word') word++;
    else if (v.a === 'real') real++;
    if (v.client_id) clients.add(v.client_id);
  }
  return { word, real, total: word + real, clients };
}

export function participantCount(votes) {
  const clients = new Set();
  for (const v of votes) {
    if (v.client_id) clients.add(v.client_id);
  }
  return clients.size;
}

/** 数字滚动动画 */
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
