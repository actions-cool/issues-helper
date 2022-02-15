---
title: Issues 助手
order: 1
hero:
  title: Issues 助手
  image: https://gw.alipayobjects.com/mdn/rms_f97235/afts/img/A*8xDgSL-O6O4AAAAAAAAAAAAAARQnAQ
  desc: 🤖 一个轻松帮你自动管理 issues 的 GitHub Action
  actions:
    - text: 快速开始
      link: /guide/start
features:
  - icon: https://gw.alipayobjects.com/mdn/rms_f97235/afts/img/A*Km0BQJs7vWAAAAAAAAAAAAAAARQnAQ
    title: 完全免费
    desc: 使用 GitHub 自带提供的 Actions 服务
  - icon: https://gw.alipayobjects.com/mdn/rms_f97235/afts/img/A*ELKWSIMizH0AAAAAAAAAAAAAARQnAQ
    title: 简单易用
    desc: 教程详细，模版丰富
  - icon: https://gw.alipayobjects.com/mdn/rms_f97235/afts/img/A*j-SURo-DkyIAAAAAAAAAAAAAARQnAQ
    title: 轻松托管
    desc: 只要 GitHub 不宕机，它就不受影响
footer: Open-source MIT Licensed | Copyright © 2020-present<br />Powered by xrkffgg
---

## 🍭 快速上手

这里列举一个非常简单以及常用的例子。对应场景为：当一个 issue 新增 `help wanted` 标签时，系统会自动进行评论。

```yml
name: Issue Reply

on:
  issues:
    types: [labeled]

jobs:
  reply-helper:
    runs-on: ubuntu-latest
    steps:
      - name: help wanted
        if: github.event.label.name == 'help wanted'
        uses: actions-cool/issues-helper@v3
        with:
          actions: 'create-comment'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          body: |
            Hello @${{ github.event.issue.user.login }}. We totally like your proposal/feedback, welcome PR。

            你好 @${{ github.event.issue.user.login }}，我们完全同意你的提议/反馈，欢迎PR。
```

## 💖 谁在使用？

<embed src="../../README.md#RE-/<table>[^]+?[\r\n]<\/table>/"></embed>

## ⚡ 反馈

非常欢迎你来尝试使用，并提出意见，你可以通过以下方式：

- 通过 [Issue](https://github.com/actions-cool/issues-helper/issues) 报告 bug 或进行咨询
- 通过 [Discussions](https://github.com/actions-cool/issues-helper/discussions) 进行讨论
- 提交 [Pull Request](https://github.com/actions-cool/issues-helper/pulls) 改进 `issues-helper` 的代码

也欢迎加入 钉钉交流群

![](https://gw.alipayobjects.com/mdn/rms_f97235/afts/img/A*-iuDSpF7QAQAAAAAAAAAAAAAARQnAQ)
