# UNHCR - TSS Contributing Guide

Hi! Thanks for taking the time to contribute to unhcr-tss.

* You can contribute in many ways *
 - Join the unhcr-tss [discussion](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/discussions)


* Before submitting your contribution, please make sure to take a moment and read through the following guidelines *
- [Code of Conduct](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/blob/main/.github/CODE_OF_CONDUCT.md)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Github Flow](#github-flow)
- [Commit Lint](#commit-lint)

## Issue Reporting Guidelines

- Always use [ issue templates ](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/new/choose)
- If you don't find a corresponding issue template please use the template to ask a new template

## Pull Request Guidelines

- The `main` branch is just a snapshot of the latest stable release. All development should be done in dedicated branches.

- Work in the `frontend` folder and **DO NOT** checkin `dist` in the commits.

- It's OK to have multiple small commits as you work on the PR - GitHub will automatically squash it before merging.

- If adding a new feature:

  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.
  - Present your issue in the 'discussion' part of this repo

- If fixing bug:
  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

## Development Setup

You will need [Node.js](http://nodejs.org) **lts** and [npm](https://pnpm.io/). And also Gnu Make

After cloning the repo, run:

```bash
$ make install # install the dependencies of the project
```

### Committing Changes

Have a look at [Commit Lint](#commit-lint)

## Project Structure

- **`couchdb`**: contains the data and database bootstrap code for couchdb
- **`frontend`**: contains the source code. The codebase is written in typescript using class components for vue2 and vuetify as the library component. And ECharts as the chart library.

## Financial Contribution

We also welcome financial contributions via GitHub Sponsors and OpenCollective. Please contact us directly.

## Commit Lint

We follow a commit message convention, to have consistent git messages. The goal is to increase readability and ease of contribution
    - we use [commit-lint](https://github.com/conventional-changelog/commitlint)
    - we use [gitmoji](https://gitmoji.dev/)
    Bottom line we use: https://github.com/ccnnde/commitlint-config-git-commit-emoji to enforce or commit message

## Credits

Thank you to all the people who have already contributed to UNHCR!

<a href="https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/graphs/contributors">
    <a href="https://github.com/guilbep">
        <img width="24px" height="24px" src="https://avatars.githubusercontent.com/u/161889?v=4" />
    </a href="">
    <a href="https://github.com/blueur">
    <img width="24px" height="24px" src="https://avatars.githubusercontent.com/u/7548753?v=4" />
    </a>
</a>