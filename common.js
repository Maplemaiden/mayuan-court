/**
 * 《词句审判庭》公共配置与工具
 */

export const SUPABASE_URL = 'https://cbnlchfvqtcuqmptqnlg.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable__vQn9wLyRdJGnH3IeakYrg_1qvfgm5m';

/** 用 jsDelivr，比 esm.sh 在国内/微信里更稳 */
export const SUPABASE_SDK_URL =
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/+esm';

export const STATE_ID = 'live';

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

/** 本地缓存的场次（看板写入；投票页优先跟云端） */
export function getLocalSession() {
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

export function setLocalSession(session) {
  localStorage.setItem(SESSION_KEY, session);
}

/** @deprecated 兼容旧调用 */
export function getSession() {
  return getLocalSession();
}

export function setSession(session) {
  setLocalSession(session);
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

/** 读取控场状态 */
export async function fetchGameState(supabase) {
  const { data, error } = await supabase
    .from('game_state')
    .select('session,current_q,revealed,updated_at')
    .eq('id', STATE_ID)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** 写入控场状态（部分字段） */
export async function patchGameState(supabase, patch) {
  const payload = {
    id: STATE_ID,
    updated_at: new Date().toISOString(),
    ...patch,
  };
  const { data, error } = await supabase
    .from('game_state')
    .upsert(payload, { onConflict: 'id' })
    .select('session,current_q,revealed,updated_at')
    .single();
  if (error) throw error;
  return data;
}
