# 词句审判庭

华南理工大学马原第 5 组课堂互动：全场投票 + 投影看板（静态页 + Supabase）。

## 页面

| 文件 | 用途 |
|------|------|
| `vote.html` | 同学扫码答题（自动跟随看板场次/题号） |
| `board.html` | 讲者看板（投投影） |
| `index.html` | 入口 |
| `common.js` | 题库与 Supabase 配置 |
| `schema.sql` | 建表（含 `votes` + `game_state`） |
| `qr-vote.png` | 投票页二维码 |

## 必做：Supabase

1. 新建项目后，SQL Editor **整段执行** `schema.sql`（若之前只建过 votes，请再跑一遍以创建 `game_state`）
2. `common.js` 已写入 Project URL / publishable key

## 公网地址

- 入口：https://maplemaiden.github.io/mayuan-court/
- 投票：https://maplemaiden.github.io/mayuan-court/vote.html
- 看板：https://maplemaiden.github.io/mayuan-court/board.html

二维码：`qr-vote.png` 直接贴 PPT。手机**不用**在链接里选手动场次，跟着看板走。

## 课前 3 分钟

1. 打开看板 → F11 全屏  
2. 填场次码 → **切换并广播** → 「重新开始」  
3. 同学扫码；你点题号/下一题，手机自动跳题  

课堂结束点「清空本场数据」。

## 高优先级能力

- 场次 / 当前题 / 揭晓状态写入 `game_state`，手机 2 秒同步  
- SDK 走 jsDelivr（比 esm.sh 更稳）  
