# ✨ 更新日志

## 版本规则

- 采用两级语义化版本，如v1、v1.1、v2、v2.1
- v1 表示初始版本
- 对 v1 版本的修复和新增会发布到 v1.1 版本
- 当发布的 v1.x 运行一定时间稳定后，发布进阶 v2 版本
- API 中参数建议使用标注及以上版本

## 版本选择

- 建议采用最新 releases 版本。可在 [releases](https://github.com/actions-cool/issues-helper/releases) 看到

- 同时也可参照下面的更新日志来选择版本

- 也支持直接使用分支版本。如：

```yml
- name: Issues Helper
  uses: actions-cool/issues-helper@main
```

## 更新日志

### v1.2

`2020.12.25`

- feat: add check-issue & remove labels. [#12](https://github.com/actions-cool/issues-helper/pull/12)

### v1.1

`2020.12.24`

- fix: yml not support array. [#11](https://github.com/actions-cool/issues-helper/pull/11)

### v1

`2020.12.23`

🎉 First release.
