# ✨ Changelog

## Version rules

- Use two-level semantic version, such as v1, v1.1, v2, v2.1
- v1 represents the initial version
- The fixes and additions to the v1 version will be released to the v1.1 version
- When the released v1.x runs stable for a certain period of time, release the advanced v2 version

## Version selection

- It is recommended to use the latest releases version. It can be seen in [releases](https://github.com/actions-cool/issues-helper/releases)

- You can also refer to the update log below to select the version

- It also supports the direct use of branch versions. Such as:

```yml
- name: Issues Helper
  uses: actions-cool/issues-helper@main
```

## Change Log

### v1.1

`2020.12.24`

- fix: yml not support array. [#11](https://github.com/actions-cool/issues-helper/pull/11)

### v1

`2020.12.23`

🎉 First release.
