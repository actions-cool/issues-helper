---
toc: menu
---

## 📍 `token` 说明

需拥有 push 权限的人员 token。

- [个人 token 申请](https://github.com/settings/tokens)
  - 需勾选 `Full control of private repositories`
- 项目添加 secrets
  - 选择 settings，选择 secrets，选择 `New repository secret`
  - `Name` 与 actions 中保持一致
  - `Value` 填写刚才个人申请的 token

当 actions 不填写 token 时，或输入 `${{ secrets.GITHUB_TOKEN }}`，会默认为 `github-actions-bot`。[更多查看](https://docs.github.com/en/free-pro-team@latest/actions/reference/authentication-in-a-workflow)。

## 📍 GitHub 相关文档

- [GitHub Actions 语法](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#on)
- [工作流触发机制](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows)

## 📍 `outputs` 使用

```yml
- name: Create issue
  uses: actions-cool/issues-helper@v1
  id: createissue
  with:
    actions: 'create-issue'
    token: ${{ secrets.GITHUB_TOKEN }}
- name: Check outputs
  run: echo "Outputs issue_number is ${{ steps.createissue.outputs.issue-number }}"
```

更多查看：

1. https://docs.github.com/en/free-pro-team@latest/actions/creating-actions/metadata-syntax-for-github-actions#outputs
2. https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idoutputs

## 📍 `includes` 校验规则

```js
"title-includes": 'x1,x2'

x1
x2

"x1y3y2"  true
"y2 x1"   true
"x2"      true
"x3"      false
```

```js
"title-includes": 'x1,x2/y1,y2'

x1 + y1
x2 + y1
x1 + y2
x2 + y2

"x1y3y2"  true
"y2 x1"   true
"1x2y"    false
"x1"      false
```

## 📍 `emoji` 类型

| content | emoji |
| -- | -- |
| `+1` | 👍 |
| `-1` | 👎 |
| `laugh` | 😄 |
| `confused` | 😕 |
| `heart` | ❤️ |
| `hooray` | 🎉 |
| `rocket` | 🚀 |
| `eyes` | 👀 |

如需详细了解，可 [查看](https://docs.github.com/en/free-pro-team@latest/rest/reference/reactions)。

## 📍 `comment-id`

点击某个评论右上角 `···` 图标，选择 `Copy link`，url 末尾数字即是 `comment_id`。
