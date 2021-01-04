---
title: Issues Helper
order: 1
hero:
  title: Issues Helper
  image: https://avatars1.githubusercontent.com/u/73879334?s=200&v=4
  desc: 🤖 A GitHub Action that easily helps you automatically manage issues
  actions:
    - text: Quick start
      link: /en-US/guide/start
features:
  - icon: https://github.com/actions-cool/resources/blob/main/image/free.png?raw=true
    title: Completely free
    desc: Use the Actions service provided by GitHub
  - icon: https://github.com/actions-cool/resources/blob/main/image/snap.png?raw=true
    title: Easy to use
    desc: Detailed tutorials and rich templates
  - icon: https://github.com/actions-cool/resources/blob/main/image/network.png?raw=true
    title: Easy hosting
    desc: As long as GitHub is not down, it will not be affected
footer: Open-source MIT Licensed | Copyright © 2020-present<br />Powered by xrkffgg
---

## 🍭 Get started quickly

Here is a very simple and commonly used example. The corresponding scenario is: when an issue adds the `help wanted` tag, the system will automatically comment.

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
        uses: actions-cool/issues-helper@v1.2
        with:
          actions: 'create-comment'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          body: |
            Hello @${{ github.event.issue.user.login }}. We totally like your proposal/feedback, welcome PR。

            你好 @${{ github.event.issue.user.login }}，我们完全同意你的提议/反馈，欢迎PR。
```

## 💖 Who is using?

<embed src="../README.md#L996-L1054"></embed>

## ⚡ Feedback

You are very welcome to try it out and put forward your comments. You can use the following methods:

- Report bugs or consult with [Issue](https://github.com/actions-cool/issues-helper/issues)
- Discuss via [Discussions](https://github.com/actions-cool/issues-helper/discussions)
- Submit [Pull Request](https://github.com/actions-cool/issues-helper/pulls) to improve the code of `issues-helper`
