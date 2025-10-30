---
description: Execute a feature step based on provided context and task.
argument-hint: feature-folder-path | step-number
---

## Context

Parse $ARGUMENTS to get the component name and specifications.

- If none is provided, ask for them.
- [feature-folder-path]: The path where the feature folder is located. Take it from $ARGUMENTS.
- [step-number]: The step number to execute. Take it from $ARGUMENTS.

## Task

Execute the specified step in the feature development process.

- Execute the step defined by [step-number] in the feature located at [feature-folder-path].
- Follow the instructions and guidelines provided in the feature documentation.
- Ensure that all requirements and specifications for the step are met before moving on to the next step.
- Do not proceed to the next step until the current step is completed successfully and verified.
- Ask for clarification if any part of the step is unclear or if additional information is needed.
- Ask for run the next step only after confirming the current step is completed successfully.

## Verification

- After completing the step, verify that all tasks have been accomplished as per the feature documentation.
- Run TS checks, linters, and prettier to ensure code quality and correctness.
