-- 《词句审判庭》Supabase 建表脚本
-- 在 Supabase → SQL Editor 中整段执行

create table if not exists votes (
  id          uuid primary key default gen_random_uuid(),
  client_id   text not null,
  q           integer not null check (q between 1 and 6),
  a           text not null check (a in ('word','real')),
  session     text not null default 'default',
  created_at  timestamptz not null default now(),
  -- 防重复：同一个人同一题只能投一次（兼供 upsert）
  unique (session, client_id, q)
);

-- 看板查询加速
create index if not exists votes_session on votes (session);

-- RLS：课堂工具，允许匿名读写
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
