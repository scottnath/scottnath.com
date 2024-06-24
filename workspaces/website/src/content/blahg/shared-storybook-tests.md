---
title: "Reusable Storybook Interaction Tests"
description: "Learn about a working concept for writing reusable tests which can be shared within and between components to reduce your testing footprint while increasing coverage"
pubDate: "2023-04-20"
updatedDate: "2024-06-23"
heroImage: "/blahg-assets/storybook-shared-tests.avif"
---

## tl;dr

Writing reusable tests means they can be shared within and between components. 

Goal: reduce your testing footprint while increasing coverage

* [codesandbox Storybook appliction with shared tests][codesandbox-setup]


## What are shared tests?

Shared tests are a concept for creating reusable [Testing Library](https://testing-library.com) tests for UI components. Writing reusable tests which conform to Testing Library's paradigm of querying the DOM for nodes allows shared tests to generally be _javascript framework agnostic_. 

The concept expects test suites to be within functions which receive as arguments the rendered UI and the props used to render the UI. Inside the method, it should conditionally run assertions according the props used to configure the UI. 

There should be one set of shared tests for each component which should cover every possible configuration of the component.

### Live code example!

See [this codesandbox Storybook appliction][codesandbox-setup] which has a set of shared tests written for the boilerplate Storybook example components.

## What is the purpose of sharing tests?

Shared tests keep your overall codebase DRY, as in `Don't Repeat Yourself`.

If the tests cover every configuration possibility for a UI component, then you can add as many test examples as you want, without writing new tests. One set of shared test functions can be used in Storybook Interaction tests and spec/unit tests and even E2E that are configured to use testing-library syntax for testing. 

Parent components using a child component's tests mean the parent component does not need to know whether it implemented the child correctly - the child's tests will confirm that. This relationship can create a very deep, full-coverage set of End-2-End tests.

## What makes up a set of shared tests?

At the most basic, we need to answer these questions:

1. "What was rendered when using my props to render the component?"
2. "Did the component render correctly?"
3. "Does it function as expected when I interact with it?" (if interactive)

### Question 1. "What was rendered?"

We need to query for every possible testable element from the rendered UI. The function to find these elements should return an object representing each element(s), even if they return `null`.

A simple example:

```javascript
export const getElements = async (canvasElement: HTMLElement) => {
  const screen = within(canvasElement);

  return { 
    screen,

    // Searches the canvasElement for a button
    button: await screen.queryByRole('button'),
  };
}
```

This returns an object with the rendered button and initial `HTMLElement`. Both are enhanced via [testing-library's "within" method](https://testing-library.com/docs/dom-testing-library/api-within/). **`within(node)`** takes an `Element` and returns an object with all the testing-library queries bound to it.

_Note the use of `queryBy` instead of `getBy` or `findBy`._ This is because of [the three testing-library query types](https://testing-library.com/docs/queries/about#types-of-queries), `queryBy` will not throw an error if the element is not there. To make this function shareable, ideally it should not throw an error if any element it's looking for is not there.

### Question 2. "Did it render correctly?"

We know _what_ was rendered, now we need to test it rendered as expected.

We need a method with assertions which are conditionally applied, based on what a UI component received as `props`.

This example uses a truncated version of the boilerplate Button component installed when initializing a new Storybook instance.

```javascript
// A Button component
export const Button = ({ primary = false, label = 'Button', onClick = () => ({}) }) => {
  const modeClass = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <button
      type="button"
      className={modeClass}
      @click=${onClick}
    >
      {label}
    </button>
  );
};
```

This example method ensures the component rendered as expected. It contains conditional assertions which understand the expected output and adjusts tests accordingly.


```javascript
// `args` are the props used to configure the Button component
export const ensureElements = async (canvasElement: HTMLElement, args: ButtonProps) => {
  // uses method from above
  const { button } = getElements(canvasElement);

  // does the button exist?
  await expect(button).toBeTruthy();

  // does the button have the right content?
  await expect(button).toHaveTextContent(args.label);

  // conditional tests
  if (args.primary) {
    await expect(button).toHaveClass('storybook-button--primary');
  } else {
    await expect(button).toHaveClass('storybook-button--secondary');
  }
};
```

### Question 3: "Does it function as expected?"

If your component is interactive, you need to test for _all types of interactions_. This means, at a minimum, checking the component functions for **both** keyboard-only users and mouse users.

We'll create two methods this time. The methods will use [testing-library's "user-event" library](https://testing-library.com/docs/user-event/intro)

```javascript
// create a mockFunction as a backup if no `onClick` is in `args`
const mockOnClick = jest.fn();

/**
 * test mouse interactions as though a user
 */
export const mouseInteraction = async (canvasElement, args) => {
  // uses method from above
  const { button } = getElements(canvasElement);

  // ensures a function exists to test a mouse click
  const onClick = args.onClick ? args.onClick : mockOnClick;
  
  // clicks the button
  await userEvent.click(button);
  
  // tests the `onClick` function was called
  await expect(onClick).toHaveBeenCalled();

  // ensures the event was only called once
  await expect(onClick).toHaveBeenCalledTimes(1);
  
  // clear out the mock which resets calls to zero
  await onClick.mockClear();
}

/**
 * test keyboard interactions as though a user
 */
export const keyboardInteraction = async (canvasElement, args) => {
  // uses method from above
  const { button } = getElements(canvasElement);

  // ensures a function exists to test a key stroke
  const onClick = args.onClick ? args.onClick : mockOnClick;

  // gives the user's focus to the button
  await button.focus();

  // with the button focused, hitting `enter` triggers `@click`
  await userEvent.keyboard('{enter}');
  
  // tests the `onClick` function was called
  await expect(onClick).toHaveBeenCalled();

  // good thing we cleared the mock from above, or this would be `2`
  await expect(onClick).toHaveBeenCalledTimes(1);
  
  // clear out the mock which resets calls to zero
  await onClick.mockClear();
}
```

## How they're using in Storybook Interaction tests

See [./src/Button.stories.js on codesandbox][codesandbox-setup]

```javascript
// Button.stories.js
export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
  play: async ({ args, canvasElement, step }) => {
    
    // "What was rendered?"
    const elements = await getElements(canvasElement);

    // "Did it render correctly?"
    await ensureElements(elements, args, step);

    // "Does it function as expected for mouse users?"
    await mouseInteraction(elements, args, step);

    // "Does it function as expected for keyboard-only users?"
    await keyboardInteraction(elements, args, step);
  },
};

export const Secondary = {
  args: {
    label: 'Button',
  },

  // Reuse the exact same tests
  play: Primary.play,
};

export const Large = {
  args: {
    size: 'large',
    label: 'Button',
  },

  // again and again
  play: Primary.play,
};
```

**Next up, Part 2 "Sharing tests between a child and parent component"**

[codesandbox-setup]: https://codesandbox.io/p/sandbox/github/storydocker/storydocker/main/package/storybook-setup