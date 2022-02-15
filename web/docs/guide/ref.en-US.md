---
toc: menu
---

## 📍 `token`

Need to have the person token with push permission.

- [Personal token application](https://github.com/settings/tokens)
  - Need to check `Full control of private repositories`
- Project add secrets
  - Select settings, select secrets, select `New repository secret`
  - `Name` is the same as in actions
  - `Value` fill in the token just applied by the individual

When the token is not filled in actions or input `${{ secrets.GITHUB_TOKEN }}`, it will default to `github-actions-bot`. [More](https://docs.github.com/en/free-pro-team@latest/actions/reference/authentication-in-a-workflow).

## 📍 GitHub Docs

- [Workflow syntax for GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#on)
- [Events that trigger workflows](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows)

## 📍 `outputs` use

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

More:

1. https://docs.github.com/en/free-pro-team@latest/actions/creating-actions/metadata-syntax-for-github-actions#outputs
2. https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idoutputs

## 📍 `includes` check rules

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

## 📍 `emoji` Type

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

For details, please [view](https://docs.github.com/en/free-pro-team@latest/rest/reference/reactions).

## 📍 `comment-id`

Click the `···` icon in the upper right corner of a comment, select `Copy link`, and the number at the end of the url is `comment_id`.
