---
description: Create a reusable React UI component with theming support and unit tests.
argument-hint: name | folder-path | specifications
---

## Context

Parse $ARGUMENTS to get the component name and specifications.

- [name]: The name of the component converted to PascalCase to be created. Take it from $ARGUMENTS.
- [folder-path]: The path where the component should be created (default: `apps/ui/src/components/`). Take it from $ARGUMENTS.
- [specifications]: A brief description of the component's functionality and requirements. Take it from $ARGUMENTS.

## Task

Make a simple React UI component using functional components and hooks (if it requires).

- Create a functional component in a file named `[name].tsx` in the `[folder-path]/[name]/` folder.
- Component should be reusable and take in count the theming (light/dark mode).
- Use the [name] and [specifications] to guide the implementation of the component.

## Variants

- Components that require different colors like buttons, icons, etc. should adapt to the current theme and use the different color variants.
- Components that display text should adjust font size and color based on the theme.
- The component should accept props to customize its appearance and behavior.
  - Things like size, color, variants, etc.
  - By default, use md size and primary color variant.
  - If no props are provided, the component should render with default styles.

## Testing

- Write unit tests for the component using a testing library like `vitest` and `React Testing Library`.
- Do not test the styles, only the functionality and rendering of the component based on props.
- The tests files should be in a `__tests__` folder inside the same directory (`[folder-path]/[name]/`) as the component.
  - Name the test file `[name].test.tsx`.
- Make the test easy to read, no overly complex tests.
  - Make the less amount of tests that cover the most important functionality.
  - Run tests until they pass successfully.