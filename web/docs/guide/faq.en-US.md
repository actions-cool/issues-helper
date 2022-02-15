---
toc: menu
---

## Is there a charge for this feature?

GitHub Actions is provided free of charge by GitHub. Among them, the `Private` project has a monthly limit of 2000 times, [see details](https://github.com/settings/billing). The `Public` project is unlimited.

### Is there a rate limit?

Yes. The bottom layer of Action uses GitHub REST API. The general situation is 5000 times per hour. It is basically sufficient in principle, and it is also required to avoid invalid requests when defining Action. [Detailed view](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).

## Are there any ready-made templates for reference?

Yes.

1. You can use this [GitHub Actions workflow template](https://github.com/actions-cool/.github) repository template
2. Personal exercises and tests [Actions](https://github.com/actions-cool/test-issues-helper) repository
3. You can also refer to the warehouse of [online users](/en-US#-who-is-using)

## I want to pause Actions, is there an easy way?

Yes, you can directly modify `actions`. For example: `actions:'create-comment'` is changed to `actions:'#create-comment'`. It is also convenient for recovery.

## So many versions, how to choose?

You can view the detailed [changelog](/en-US/changelog). The latest releases version is recommended.

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

## What should I pay attention to when upgrading from v1.x to v2?

There is only one difference between v1.12 and v2.0.0. That is, `require-permission` in `mark-duplicate` has added the default value `write`.

## v3 changelog

🚀 The refactoring of the v3 version is completed. The main changes are:

1. JS to TS
2. Encapsulate the core functions of the issue into classes for helpers to use
3. Unified prompt information
4. Added automatic release script

Reference for functional changes:

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
  - `month-statistics` removed

## What should I do if there is no function I want here?

You can submit it in [What do you want?](https://github.com/actions-cool/issues-helper/discussions/18).
