---
title: "Sharing Interaction Tests Between Components"
description: "How to share testing-library UI tests between child and parent components"
pubDate: "2023-04-26"
heroImage: "/sharing-tests-with-a-handshake.png"
---

## tl;dr

Descriptions and code examples for sharing tests between components. Includes info on writing tests for Storybook's boilerplate components.

**Goal: reduce your testing footprint while increasing coverage**

* [codesandbox Storybook appliction with shared tests][codesandbox-setup]
* [PART 1: Reusable Storybook Interaction Tests][part1]

<details>
<summary>Prerequisite knowledge</summary>

* [Storybook interactive tests](https://storybook.js.org/docs/react/writing-tests/interaction-testing)
* [Testing Library](https://testing-library.com)

</details>


## Why share tests between components?

Time and money!

Shared tests keep your overall codebase DRY, as in `Don't Repeat Yourself`.

Sharing tests between different parts of your codebase can have several benefits. If you have two or more modules that depend on the same functionality, it can be useful to write tests that cover that functionality once and then share those tests between the modules. For UI components, that means sharing unit tests, user-interaction tests, and you can stack them together to make in-depth E2E test suites.

## Testing the Storybook Boilerplate Stories

When using Storybook's installer to add Storybook to your project, the installer includes three components with `stories` files to get you started. The three boilerplate stories are:

* Button
* Header, which imports Button
* Page, which imports Header

These are generally the same components and stories across all frameworks. Since they build on each other, they're a great use-case for shared tests.

### Testing the Button

The Button is the most complex with three props for styling, one for content, and one for user actions.

The Button tests were detailed in [Reusable Storybook Interaction Tests][part1]. The `Button.shared-spec.js` which contains the Button's tests exports the following:

| method | description |
| --- | --- |
| `getElements` | returns the elements to be tested |
| `ensureElements` | conditionally tests the elements  |
| `mouseInteraction` | conditionally tests the mouse interactions |
| `keyboardInteraction` | conditionally tests the keyboard interactions |

### Testing the Header

The Header internally configures the Button component and has it's own props. The following table shows the props the Header accepts:

| prop | description |
| --- | --- |
| `user` | a simple object with a `name` property |
| `onLogout` | function called when a user triggers the `Log Out` button |
| `onLogin` | function called when a user triggers the `Log In` button |
| `onCreateAccount` | function called when a user triggers the `Sign Up` button |

#### Elements to gather from the Header

Things that will conditionally change based on the props:

| element | description |
| --- | --- |
| `buttons` | an array of all buttons in Header |
| `title` | the `heading` (`h1`) element |
| `header` | the `header` element |

`header` and `title` will always be the same since they are not changed by `props`, but we are testing them anyway to ensure they are present.

`buttons` will change based on the `user` prop.

#### Tests that Header's tests will run

* Does the `header` element exist?
* Does the `title` element exist?
* Does the `title` element contain the text `Acme`?
* If the user is logged in:
    * Is there one Button?
* If the user is not logged in:
    * Are there two Buttons?

```js
/**
 * Ensure elements are present and have the correct attributes/content
 */
export const ensureElements = async (elements, args) => {
  await expect(elements.header).toBeTruthy();
  await expect(elements.title).toBeTruthy();
  await expect(elements.title).toHaveTextContent('Acme');
  if (args.user) {
    await expect(buttons).toHaveLength(1);
  } else {
    await expect(buttons).toHaveLength(2);
  }
  ...
}
```

#### Header lets Button test itself

Because the Button component has it's own tests, the Header component doesn't need to know how the Button works. It only needs to know that the Button works. 

The Header tests each Button by using the Button's `ensureElements` method.

```js
// Import the Button's shared tests
import { ensureElements as buttonEnsureElements } from "./Button.shared-spec";

...

export const ensureElements = async (elements, args) => {
  ... // Header's tests, see above

  if (args.user) {
    // Recreates button configuration from Header
    await buttonEnsureElements({ button: buttons[0] }, {
      label: 'Log out',
      size: 'small',
    });
  } else {
    await buttonEnsureElements({ button: buttons[0] }, {
      label: 'Log in',
      size: 'small',
    });
    await buttonEnsureElements({ button: buttons[1] }, {
      label: 'Sign up',
      size: 'small',
      primary: true,
    });
  }
```

#### User interactions are owned by Button

The only interactive elements in the Header are the Buttons, so the only thing the Header needs to test for is how a keyboard user gets to the Button(s). Everything else, including whether the `onLogout`, `onLogin`, and `onCreateAccount` functions are called, are owned by the Button.

The Header tests it can get to the Button(s) by triggering a `tab` UserEvent within itself.

```js
/**
 * Test keyboard interaction
 */
export const keyboardInteraction = async (elements, args) => {
  const { buttons, header } = elements;
  if (args.user) {
    // `focusTrap` keeps the user's keyboard within the `header` HTMLElement
    await userEvent.tab({ focusTrap: header });

    // we expect the `Log Out` button to have focus
    await expect(buttons[0]).toHaveFocus();

    // Uses Button's keyboard interaction tests
    await buttonKeyboardInteraction({ button: buttons[0] }, {
      label: 'Log out',
      size: 'small',
      onClick: args.onLogout,
    });
  } else {
    // again, starts within Header
    await userEvent.tab({ focusTrap: header });

    // we expect the `Log In` button to have focus
    await expect(buttons[0]).toHaveFocus();

    // User hits `tab` once more
    await userEvent.tab({ focusTrap: header });

    // we expect the `Sign Up` button to have focus
    await expect(buttons[1]).toHaveFocus();

    // Button tests for first button
    await buttonKeyboardInteraction({ button: buttons[0] }, {
      ...
    });

    // Button tests for second button
    await buttonKeyboardInteraction({ button: buttons[1] }, {
      ...
    });
  }
}
```

### Testing the Page

The Page component has no props, but in some frameworks the Page boilerplate component, relies on the JS Framework to control it's state. All of the page content is inside the code (tsk tsk), so we'll use the Header's tests to test the Page.

#### Elements to gather from the Page

In this instance, we'll use the Header's `getElements` method to get the elements we need.


```js
// Import the Button's shared tests
import { getElements as headerGetElements } from './Header.shared-spec';

/**
 * Extract elements from an HTMLElement
 */
export const getElements = async (canvasElement) => {
  const screen = within(canvasElement);

  // Header knows how to get it's own elements
  const headerElements = await headerGetElements(canvasElement);


  return {
    // spreads the headerElements into this object
    ...headerElements,
    screen,
  };
}
```

#### Tests that Page's tests will run

It'll just use Header's tests:

```js
import { 
    ensureElements as headerEnsureElements,
    mouseInteraction as headerMouseInteraction,
    keyboardInteraction as headerKeyboardInteraction
} from './Header.shared-spec';

/**
 * Ensure elements are present and have the correct attributes/content
 */
export const ensureElements = async (elements, args, step) => {
  await headerEnsureElements(elements, args, step, true);
}

/**
 * Test mouse interaction
 */
export const mouseInteraction = async (elements, args, step) => {
  await headerMouseInteraction(elements, args, step, true);
}

/**
 * Test keyboard interaction
 */
export const keyboardInteraction = async (elements, args, step) => {
  await headerKeyboardInteraction(elements, args, step, true);
}
```

## Wrapping up

Self-knowledge for components is the lynchpin with sharing tests. As deeply as possible, a component should know every possible change that can happen to it, and how to test for each possibility.

Using this across a design-system, this should vastly reduce the testing footprint. As long as you're writing `testing-library` tests, this concept should allow the `shared-spec` tests to be used within your unit tests in addition to being used by Storybook stories. 

Efficiency in all things - and productivity will follow!


[part1]: /blahg/shared-storybook-tests/
[codesandbox-setup]: https://codesandbox.io/p/sandbox/github/storydocker/storydocker/main/package/storybook-setup