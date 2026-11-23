# 发布到 DSH 插件市场

市场是 `dshmarket`，目录是 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)。
「上架」= 给目录仓库提一个 PR，加**一个** YAML 文件；合并后站点与市场的「主题」Tab 自动收录，通常一天内生效。没有上传接口。

## 0. 前置

- GitHub 账号（当前填的是 `Lin-Liszt`，改的话：`node scripts/set-owner.mjs <用户名>`）
- 仓库必须是**公开**的
- 仓库要**创建满 1 天**才能过 CI 的年龄门槛

## 1. 建仓库并推送

用 [gh](https://cli.github.com/)：

```sh
gh repo create dsh-aemeath-theme --public --source . --remote origin --push
gh repo edit --add-topic dsh-plugin
```

没有 `gh` 就在网页建一个空仓库 `dsh-aemeath-theme`，然后：

```sh
git remote add origin https://github.com/Lin-Liszt/dsh-aemeath-theme.git
git push -u origin main
```

推完去仓库的 **About → Topics** 加上 `dsh-plugin`。

## 2. 发 Release，带上预构建包

```sh
node scripts/pack-release.mjs          # → dist/dsh-aemeath-theme.tgz（约 50 MB）+ sha256
gh release create v1.2.0 dist/dsh-aemeath-theme.tgz -t "v1.2.0" -n "首个公开版本"
```

⚠️ 资产名**不要带版本号**。目录条目指向 `releases/latest/download/dsh-aemeath-theme.tgz`，`latest` 在请求时解析、但文件名是照字面取的——带版本号的名字今天能用，下次发版就 404。

## 3. 提 PR

在 `awesome-dsh-plugin` 仓库里新建 `data/plugins/Lin-Liszt__dsh-aemeath-theme.yml`，内容就是本仓库的 [contrib/awesome-dsh-plugin.yml](contrib/awesome-dsh-plugin.yml)。

PR 标题：`Add dsh-aemeath-theme (Aemeath theme)`

PR 正文建议（英文，维护者读得最快）：

> Adds a theme entry (`category: theme`).
>
> `dsh-aemeath-theme` is a DeepSeek Harness theme plugin: a pixel window frame, a holographic portrait card under the composer, a 4K splash, four switchable video backdrops and a starlight pink/cyan skin. It also registers one settings section (theme preferences, a persona toggle, and an optional context-compaction panel that only renders when `billion-context-dsh` is installed).
>
> It is a maintained fork of EITAOT/dsh-yeermu-theme — credited in CREDITS.md — with a different skin, new dock cards (calendar/weather, portrait terminal, system monitor), video backdrops and host-side routes.
>
> License: CC BY-NC 4.0 (the artwork and backdrop clips are third-party fan material and are not relicensed).

## 4. CI 会查什么

1. 每个 PR 最多 3 条 —— 我们 1 条
2. `package.json` 里必须有 `dsh.bundle`（有）
3. 仓库创建满 1 天
4. `awesome-lint` + 站点构建（双语、分隔符、日期、截图）

## 5. 合并之后

- 网站与市场次日重建，卡片出现在「主题」Tab
- 以后改截图：往自己仓库推 `screenshots.json`（1–8 张，GitHub 托管，相对路径），不用再提 PR
- 不要手改目录仓库生成出来的 README —— 那两份是脚本产出的

## 注意

- 描述会被**逐句对代码核**。README 与条目里不要写「46 个工具」这类没数过的话。
- 收录 ≠ 背书。第三方代码警告同样适用于我们自己的插件。
