---
name: Bug report
about: Create a report to help us improve
title: "[Bug]: "
labels: bug
assignees: guilbep
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
  - type: input
    id: contact
    attributes:
      label: Contact Details
      description: How can we get in touch with you if we need more info?
      placeholder: ex. email@example.com
    validations:
      required: false
  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: Also tell us, what did you expect to happen?
      placeholder: A clear and concise description of what the bug is.
      value: "A bug happened!"
    validations:
      required: true
  - type: textarea
    id: how-to-reproduce
    attributes:
      label: How To Reproduce The Bug
      description: "Steps to reproduce the behavior:"
      placeholder: "step1: .. step2: .. et c
      value: "1. Go to '...'
                2. Click on '....'
                3. Scroll down to '....'
                4. See error"
    validations:
      required: true
  - type: textarea
    id: what-to-expect
    attributes:
      label: What to expect?
      description: Also tell us, what did you expect to happen?
      placeholder: Description of the expected behavior
      value: "A clear and concise description of what you expected to happen."
    validations:
      required: true
  - type: dropdown
    id: browsers
    attributes:
      label: What browsers are you seeing the problem on?
      multiple: true
      options:
        - Firefox
        - Chrome
        - Safari
        - Microsoft Edge
  - type: textarea
    id: logs
    attributes:
      label: Relevant log output
      description: Please copy and paste any relevant log output. This will be automatically formatted into code, so no need for backticks.
      render: shell
---

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Additional context**
Add any other context about the problem here. (e.g URL / or way of authenticate to the app / location / vpn ?)
