<!--
🐞 Bug fix
🚀 New feature
💄 Perf
📝 Docs
⚡️ Code style
🛠 refactor
-->

## v3.0.0

`2022.02.15`

- 🚀 New Feature
  - `mark-assignees`: Comment quick settings assignees
  - `find-issues`: Conditional query current warehouse issues
- 🐞 Bug Fix
  - Fixed `find-comments` return result direction not working
  - Fix `lock-issues` lock and comment order issue
- 🛠 Refactor
  - `contents` renamed to easy-to-understand `emoji`
  - `issue-emojis` renamed to `issue-emoji`
  - deleteComment updateComment no longer supports `out-comments`, keeping pure functionality
  - Remove title body default
  - `month-statistics` is removed

## v2.5.0

`2021.10.19`

- 🚀 feat: add thanks.

> 🐣 This will be the last version of 2.x, 3.x is under development.

## v2.4.3

`2021.09.13`

- 🚀 feat: default number support `issue-comment`. [#90](https://github.com/actions-cool/issues-helper/pull/90)

## v2.4.2

`2021.09.06`

- 🐞 fix: `doRemoveLabels` when has no label. [#88](https://github.com/actions-cool/issues-helper/pull/88)

## v2.4.1

`2021.09.05`

- 🐞 fix: remove labels define error. [#86](https://github.com/actions-cool/issues-helper/pull/86)

## v2.4.0

`2021.08.15`

- 🚀 feat: support custom repo. [#83](https://github.com/actions-cool/issues-helper/pull/83)
- 🚀 feat: support default issueNumber get from context. [#81](https://github.com/actions-cool/issues-helper/pull/81)
- 🐞 fix: action run async. [#79](https://github.com/actions-cool/issues-helper/pull/79)

## v2.3.1

`2021.08.09`

- ⚡️ refactor: extract exclude-labels array to outer scope. [#75](https://github.com/actions-cool/issues-helper/pull/75) [@meteorlxy](https://github.com/meteorlxy)

## v2.3.0

`2021.08.09`

- 🚀 feat: add exclude-labels for `check-inactive` `close-issues` `lock-issues`. [#74](https://github.com/actions-cool/issues-helper/pull/74)

## v2.2.1

`2021.03.21`

- fix: list comment page lost in `find-comments`. [#66](https://github.com/actions-cool/issues-helper/pull/66)

## v2.2.0

`2021.03.21`

- feat: Added `title-excludes` parameter to `check-issue`. [#65](https://github.com/actions-cool/issues-helper/pull/65)

## v2.1.2

`2021.02.19`

- feat: update/delete comment support find-comments out. [#63](https://github.com/actions-cool/issues-helper/pull/63)

## v2.1.1

`2021.02.03`

- fix: api request limit. [#57](https://github.com/actions-cool/issues-helper/pull/57)
- chore: add catch. [#59](https://github.com/actions-cool/issues-helper/pull/59)

## v2.1.0

`2021.02.02`

- feat: add create-label. [#54](https://github.com/actions-cool/issues-helper/pull/54)

## v2.0.0

`2021.01.26`

- refactor: add require-permission default. [#51](https://github.com/actions-cool/issues-helper/pull/51)

## v1.12

> It will be the last version of 1.x

`2021.01.26`

- feat: add require-permission. [#46](https://github.com/actions-cool/issues-helper/pull/46) [#48](https://github.com/actions-cool/issues-helper/pull/48)
- feat: add lock-reason. [#49](https://github.com/actions-cool/issues-helper/pull/49)

## v1.11

`2021.01.14`

- feat: add question mark duplicate. [#38](https://github.com/actions-cool/issues-helper/pull/38)
- perf: expand duplicate action. [#40](https://github.com/actions-cool/issues-helper/pull/40)

## v1.10

`2021.01.12`

- fix: duplicate labels set. [#36](https://github.com/actions-cool/issues-helper/pull/36)

## v1.9

`2021.01.11`

- feat: add random to. [#35](https://github.com/actions-cool/issues-helper/pull/35)

## v1.8

`2021.01.07`

- [#31](https://github.com/actions-cool/issues-helper/pull/31)
  - refactor: split content
  - feat: add `remove-labels` for duplicate
  - docs: optimize website

## v1.7

`2021.01.02`

- [#27](https://github.com/actions-cool/issues-helper/pull/27)
  - feat: add `month-statistics`
  - fix: query issues less because pages max 100
  - fix: js nested `require`

## v1.6

`2020.12.30`

- perf: optimize duplicate. [#24](https://github.com/actions-cool/issues-helper/pull/24)

## v1.5

`2020.12.30`

- feat: add `mark-duplicate`. [#23](https://github.com/actions-cool/issues-helper/pull/23)

## v1.4

`2020.12.29`

- fix: perfect `inactive-day` check. [#22](https://github.com/actions-cool/issues-helper/pull/22)

## v1.3

`2020.12.28`

- feat: add welcome. [#19](https://github.com/actions-cool/issues-helper/pull/19)

## v1.2

`2020.12.25`

- feat: add check-issue & remove labels. [#12](https://github.com/actions-cool/issues-helper/pull/12)

## v1.1

`2020.12.24`

- fix: yml not support array. [#11](https://github.com/actions-cool/issues-helper/pull/11)

## v1

`2020.12.23`

🎉 First release.
