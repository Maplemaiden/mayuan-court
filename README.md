# 词句审判庭

华南理工大学马原第 5 组课堂互动：全场投票 + 投影看板（静态页 + Supabase）。

## 页面

| 文件 | 用途 |
|------|------|
| `vote.html` | 同学扫码答题 |
| `board.html` | 讲者看板（投投影） |
| `index.html` | 入口 |
| `common.js` | 题库与 Supabase 配置 |
| `schema.sql` | Supabase 建表（控制台执行） |

## 你必须先做：Supabase

1. 打开 [supabase.com](https://supabase.com) 新建项目  
2. SQL Editor 粘贴执行 `schema.sql`  
3. Project Settings → API，复制 **Project URL** 与 **anon public** key  
4. 写入 `common.js` 顶部两行后 `git push`  

未配置时页面能打开，但投票/看板无数据。

## GitHub Pages 地址（部署后）

仓库开启 Pages（分支 `main`，目录 `/`）后：

- 入口：`https://maplemaiden.github.io/mayuan-court/`
- 投票（二维码指向这个）：`https://maplemaiden.github.io/mayuan-court/vote.html`
- 看板（PPT 超链接）：`https://maplemaiden.github.io/mayuan-court/board.html`

二维码：把投票链接丢进任意二维码生成器，PNG 贴进 PPT。旁注「连不上就用浏览器打开上面网址」。

## 课前 3 分钟

1. 打开看板 → F11 全屏  
2. 填场次码 → 切换 → 「重新开始」  
3. 同学扫码进投票页  

课堂结束点「清空本场数据」。本工具不含个人信息。
