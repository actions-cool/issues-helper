---
toc: menu
---

# ✨ Changelog

- Version rules
  - Use two-level semantic version, such as v1, v1.1, v2, v2.1
  - v1 represents the initial version
  - The fixes and additions to the v1 version will be released to the v1.1 version
  - When the released v1.x runs stable for a certain period of time or undergoes refactoring, release the advanced v2.x version
  - After the v2 version, the version will be released strictly according to the three-level semantics, such as v2.0.0, v2.1.0

- Version selection
  - It is recommended to use the latest releases version. It can be seen in [releases](https://github.com/actions-cool/issues-helper/releases)
  - You can also refer to the update log below to select the version
  - The latest v1.x release code will be merged into the 1.x branch
  - After the v2 version, the v2 tag is supported, and the latest 2.x code will be synchronized
  - It also supports the direct use of branch versions. Such as:

```yml
- name: Issues Helper
  uses: actions-cool/issues-helper@main

# or

- name: Issues Helper
  uses: actions-cool/issues-helper@1.x

# or

- name: Issues Helper
  uses: actions-cool/issues-helper@v2
```

- v2 [upgrade reference](/en-US/guide/faq)

<embed src="../CHANGELOG.md"></embed>
