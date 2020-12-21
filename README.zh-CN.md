# 🤖 Issue Helper

一个完全帮你处理 issue 的 GitHub Action。

## 列表




## 使用

### 基础

#### `add-assignees`

将一个 issue 增加指定人

```yml
- name: Add assigness
  uses: actions-cool/issue-helper@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    issue-number: 1
    assignees: 'xrkffgg'
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| token | [token](#token) | string | ✖ | v1 |
| issue-number | 指定的 issue，可通过 url 查看 | number | ✔ | v1 |

## 参考

### token

需拥有 push 权限的人员 token。

- [个人 token 申请](https://github.com/settings/tokens)
  - 需勾选 `Full control of private repositories`
- 项目添加 secrets
  - 选择 settings，选择 secrets，选择 `New repository secret`
  - `Name` 与 actions 中保持一致
  - `Value` 填写刚才个人申请的 token

当 actions 不填写 token 时，会默认为 github-actions <kbd>bot</kbd>。

### Reactions types

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

