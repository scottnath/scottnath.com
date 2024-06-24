---
title: "Sharing Interaction Tests Between Vitest and Storybook"
description: "How to use the same testing-library UI tests for Storybook Interaction testing and Vitest, Vite's native test runner."
pubDate: "2023-06-08"
updatedDate: "2024-06-23"
heroImage: "/blahg-assets/vitest-shared-tests-basic.avif"
---

How to use the same testing-library UI tests for Storybook Interaction testing and Vitest, Vite's native test runner.

## tl;dr

Tests can be shared between Vitest tests (`*.test.js`) and Storybook stories' `play` tests by using shared test files (`*.shared-spec.js`). 

Replace all assertions:

```js
describe('Meow component', () => {
  it('should meow', () => {
    const { thing1, thing2, thing3, thing4 } = render(<Meow />);
    expect(thing1).toBe('some assertion 1')
    expect(thing2).toBe('some assertion 2')
    expect(thing3).toBe('some assertion 3')
    expect(thing4).toBe('some assertion 4')
  })
})
```

With shared tests:

```js
describe('Meow component', () => {
  it('should meow', () => {
    sharedTests(render(<Meow />), Meow.props)
  })
})
```

<details>
<summary>Series: Sharing tests across UI components</summary>

* [PART 1: Reusable Storybook Interaction Tests](part1)
* [PART 2: Sharing Interaction Tests Between Components](part2)

</details>

<details>
<summary>Prerequisite knowledge</summary>

* [Storybook interactive tests](https://storybook.js.org/docs/react/writing-tests/interaction-testing)
* [Testing Library](https://testing-library.com)
* [Vitest](https://vitest.dev/)

</details>

## Why share tests between Storybook and Unit tests?

Time and money!

...and coverage reporting requirements...and trust issues...

* If your Continuous Integration system does not allow the installation of Playwright or running a browser, `test-storybook` cannot be used in CI to test your components
* If your coverage tool does not support Storybook's `play` or `smoke` tests, but you're already writing Interactive tests in Storybook
* If you (or your Dev team) prefer not to rely solely on Storybook as your only test suite
* If you want **a single source of truth for your component's tests**

## Shared tests and how to use them

Staying D.R.Y. so... see [part 1][part1] and [part 2][part2] of the shared tests series for details.

## Basic example of shared-spec tests being used in Vitest

Take a basic Vitest for a button:

```js
// button.test.js
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
describe('MeowButton', () => {
  const props = {
    label: 'meow'
    onClick: vi.fn(),
  };
  it('should have properly configured attributes', async () => {
    const { queryByRole } = render(<Button {...props} />)
    const button = await queryByRole('button')
    await expect(button).toBeTruthy();
    await expect(button).toHaveTextContent(props.label);
  });
  it('should respond to mouse interaction', async () => {
    const { queryByRole } = render(<Button {...props} />)
    const button = await queryByRole('button')
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await args.onClick.mockClear();
  });
});
```

If you have shared-test methods like this:

```js
// button.shared-spec.js
import { within, userEvent } from '@storybook/testing-library';
export const getElements = async (canvasElement) => {
  const button = await within(canvasElement).findByRole('button');
  return { button };
};
export const ensureElements = async (elements, args) => {
  const { button } = elements;
  // same assertions as in the Vitest
  await expect(button).toBeTruthy();
  await expect(button).toHaveTextContent(args.label);
};
export const mouseInteraction = async (elements, args) => {
  const { button } = elements;
  // same user event as in the Vitest
  await userEvent.click(button);
  // same assertions as in the Vitest
  await expect(args.onClick).toHaveBeenCalled();
  await expect(args.onClick).toHaveBeenCalledTimes(1);
  await args.onClick.mockClear();
}
```

Then integrating the shared-test methods in your Vitest would allow you to centralize all assertions for use in other testing systems. You'd only need to write the Vitest-specific containers with Vitest doing the component rendering.

```js
// button.test.js (updated)
import { render } from '@testing-library/react';
import { getElements, ensureElements } from './button.shared-spec';
import { vi } from 'vitest';
describe('MeowButton', () => {
  const props = {
    label: 'meow'
    onClick: vi.fn(),
  };
  it('should have properly configured attributes', async () => {
    const rendered = render(<Button {...props} />)
    const elements = await getElements(rendered.container);
    await ensureElements(elements, props);
  });
  it('should respond to mouse interaction', async () => {
    const rendered = render(<Button {...props} />)
    const elements = await getElements(rendered.container);
    await mouseInteraction(elements, props);
  });
});
```

As a refresher on shared tests in Storybook - here are the shared-test methods in a Storybook story.

```js
// button.stories.js
import { getElements, ensureElements } from './button.shared-spec';
export const MeowButton = {
  args: {
    label: 'meow',
  },
  play: async ({ args, canvasElement }) => {
    const elements = await getElements(canvasElement);
    await ensureElements(elements, args);
    await mouseInteraction(elements, args);
  },
};
```

**Important Points**

* `rendered.container` is equivalent to `canvasElement` in that they are both an `HTMLElement` that contains the rendered component
* `getElements`, `mouseInteraction`, and `ensureElements` are the same functions used in Storybook's `play` function

## Expand the concept with a shared test suite!

While the previous example may seem overbuilt, this concept is crazy-helpful when you have a lot of tests to write for a lot of different scenarios. A way to make this easier is to create a shared test suite method within your `test` file. 

```js
// button.test.js (updated)

/**
 * Uses the shared spec methods inside vitest test functions
 * @param Component - OG component or a composed-via-storybook version
 * @param args - props to pass to the component
 */
const buttonTestSuite = (Component, args) => {
  it('should have properly configured attributes', async () => {
    const rendered = render(<Component {...args} />)
    const elements = await getElements(rendered.container);
    await ensureElements(elements, args);
  });
  it('should respond to mouse interaction', async () => {
    const rendered = render(<Component {...args} />)
    const elements = await getElements(rendered.container);
    await mouseInteraction(elements, args);
  });
  it('should respond to keyboard interaction', async () => {
    const rendered = render(<Component {...args} />)
    const elements = await getElements(rendered.container);
    await keyboardInteraction(elements, args);
  });
}

describe('Button', () => {
  describe('Primary', () => {
    buttonTestSuite(Primary, Primary.args);
  });
  describe('Secondary', () => {
    buttonTestSuite(Secondary, Secondary.args);
  });
  describe('Large', () => {
    buttonTestSuite(Large, Large.args);
  });
  describe('Small', () => {
    buttonTestSuite(Small, Small.args);
  });
});
```

The above will test each permutation of Button in the same way, and you can add as many test examples as you want without having to repeat yourself or excessively increasing the size of the file. 

Verbose-output coverage would look like this:

```bash
✓ src/stories/Button.test.jsx (12)
  ✓ Button (12)
    ✓ Primary (3)
      ✓ should have properly configured attributes
      ✓ should respond to mouse interaction
      ✓ should respond to keyboard interaction
    ✓ Secondary (3)
      ✓ should have properly configured attributes
      ✓ should respond to mouse interaction
      ✓ should respond to keyboard interaction
    ✓ Large (3)
      ✓ should have properly configured attributes
      ✓ should respond to mouse interaction
      ✓ should respond to keyboard interaction
    ✓ Small (3)
      ✓ should have properly configured attributes
      ✓ should respond to mouse interaction
      ✓ should respond to keyboard interaction

Test Files  1 passed (1)
    Tests  12 passed (12)
  Start at  16:07:51
  Duration  1.38s (transform 188ms, setup 159ms, collect 293ms, tests 118ms, environment 345ms, prepare 85ms)
```

## Conclusion

Sharing tests between Storybook and your application's test suite could be seen as a niche-need ... however, looking at your testing in a more programatic way will:

* keep your test suites DRY
* allow a single source of truth for your test assertions
* **allow you to change UI frameworks, but keep the same UX** (to be explained in part 4, *Sharing Tests Between Javascript Frameworks*)

[part1]: /blahg/shared-storybook-tests/
[part2]: /blahg/sharing-tests-between-components/