-- 《词句审判庭》Supabase 建表脚本
-- 在 Supabase → SQL Editor 中整段执行（可重复执行）

-- ========== 投票表 ==========
create table if not exists votes (
  id          uuid primary key default gen_random_uuid(),
  client_id   text not null,
  q           integer not null check (q between 1 and 6),
  a           text not null check (a in ('word','real')),
  session     text not null default 'default',
  created_at  timestamptz not null default now(),
  unique (session, client_id, q)
);

create index if not exists votes_session on votes (session);

alter table votes enable row level security;

drop policy if exists "anon read" on votes;
create policy "anon read" on votes
  for select using (true);

drop policy if exists "anon insert" on votes;
create policy "anon insert" on votes
  for insert with check (true);

drop policy if exists "anon update" on votes;
create policy "anon update" on votes
  for update using (true);

drop policy if exists "anon delete" on votes;
create policy "anon delete" on votes
  for delete using (true);

-- ========== 控场状态（看板写，手机读）==========
-- 全场共用一行 id='live'：当前场次、当前题号、是否已揭晓
create table if not exists game_state (
  id         text primary key default 'live',
  session    text not null default 'default',
  current_q  integer not null default 1 check (current_q between 1 and 6),
  revealed   boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into game_state (id, session, current_q, revealed)
values ('live', to_char(timezone('Asia/Shanghai', now()), 'YYYY-MM-DD'), 1, false)
on conflict (id) do nothing;

alter table game_state enable row level security;

drop policy if exists "anon read state" on game_state;
create policy "anon read state" on game_state
  for select using (true);

drop policy if exists "anon update state" on game_state;
create policy "anon update state" on game_state
  for update using (true);

drop policy if exists "anon insert state" on game_state;
create policy "anon insert state" on game_state
  for insert with check (true);
