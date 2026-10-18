/**
 * 《词句审判庭》公共配置与工具
 * 用原生 fetch 调 Supabase REST，不依赖 CDN 上的 supabase-js
 */

export const SUPABASE_URL = 'https://cbnlchfvqtcuqmptqnlg.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable__vQn9wLyRdJGnH3IeakYrg_1qvfgm5m';

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

export const ANSWERS = {
  1: 'word',
  2: 'real',
  3: 'word',
  4: 'real',
  5: 'word',
  6: 'real',
};

export const VOTE_URL = 'https://maplemaiden.github.io/mayuan-court/vote.html';

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

function authHeaders(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function rest(path, { method = 'GET', body, prefer } = {}) {
  const headers = authHeaders();
  if (prefer) headers.Prefer = prefer;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText || '请求失败');
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/** 读取本场全部票 */
export async function fetchVotes() {
  const q =
    'votes?select=q,a,client_id&session=eq.' +
    encodeURIComponent(SESSION) +
    '&order=created_at.asc';
  return (await rest(q)) || [];
}

/** 提交/覆盖一票（同人同题不重复累加） */
export async function upsertVote({ client_id, q, a }) {
  return rest('votes?on_conflict=session,client_id,q', {
    method: 'POST',
    body: { client_id, q, a, session: SESSION },
    prefer: 'resolution=merge-duplicates,return=minimal',
  });
}

/** 删除本场全部票 */
export async function clearVotes() {
  return rest('votes?session=eq.' + encodeURIComponent(SESSION), {
    method: 'DELETE',
  });
}

/** 覆盖某一题的票数（手动补票） */
export async function replaceQuestionVotes(q, wordCount, realCount) {
  await rest(
    'votes?session=eq.' +
      encodeURIComponent(SESSION) +
      '&q=eq.' +
      q,
    { method: 'DELETE' }
  );
  const rows = [];
  for (let i = 0; i < wordCount; i++) {
    rows.push({
      client_id: `manual_w_${q}_${i}`,
      q,
      a: 'word',
      session: SESSION,
    });
  }
  for (let i = 0; i < realCount; i++) {
    rows.push({
      client_id: `manual_r_${q}_${i}`,
      q,
      a: 'real',
      session: SESSION,
    });
  }
  if (!rows.length) return;
  return rest('votes', {
    method: 'POST',
    body: rows,
    prefer: 'return=minimal',
  });
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
  if (!el) return;
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
