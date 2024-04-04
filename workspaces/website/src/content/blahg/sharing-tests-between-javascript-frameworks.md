---
title: "Sharing UI Tests Between Javascript Frameworks"
description: "How to share testing-library UI tests between Javascript frameworks with the same or similar components and use them in Storybook and unit testing."
pubDate: "2023-06-27"
heroImage: "/blahg-assets/js-framework-share-tests.avif"
---

How to share testing-library UI tests between Javascript frameworks with the same or similar components and use them in Storybook and unit testing.

## tl;dr

Tests can be shared between Javascript components which have a similar HTML structure and/or a similar UX. The same shared tests can be used in both Storybook's `play` tests (Interaction testing) and Vitest unit tests.

* [working example on github][github-example]
* [live Storybook with working play tests][live-storybook-example]

<details>
<summary>Prerequisite knowledge</summary>

* [Storybook interactive tests](https://storybook.js.org/docs/react/writing-tests/interaction-testing)
* [Testing Library][testing-library]

</details>


## Why share tests between Javascript Frameworks?

* You have one or more applications which share UX, but which are built with different JS Frameworks
* When converting an application from one JS Framework to another
* Your company maintains a design system with multiple component libraries built with different JS Frameworks, but the same UX


## Shared tests and how to use them

Staying D.R.Y. so... dig through [part 1 - "What are shared tests"][part1], [part 2 - "Sharing tests between components"][part2], and [part 3 - "Sharing tests between Vitest and Storybook"][part3] to get the low-down on shared tests.


## Why does this work? Are you a wizard?

As I've been writing this series, I realized it's an ode to the magic of [Testing Library][testing-library], which is built for testing UIs as a user would experience an app. This principle means `Testing Library` is not introduced to your UI until after it has already rendered...which means `Testing Library` is navigating a DOM just as a user would...and users do not know or care what framework you used to build your UI, just that it works as expected. 

`Testing Library` is the real MVP here.

## What are we testing this time?

This article shows a set of shared-tests for testing a Counter component rewritten across multiple Javascript frameworks. We'll be using the components found in the [Astro Web Framework][astro]'s example: [`Kitchen Sink (Multiple Frameworks)`](https://github.com/withastro/astro/tree/latest/examples/framework-multiple?on=github). These are written in Preact, React, Svelte, SolidJS, and Vue. This Astro microfrontend example is fantastic in that it demonstrates how the Astro Web Framework can have multiple Javascript frameworks running on the same page at the same time.

Fun fact! This is the codebase I used to demonstrate Storybook presenting multiple frameworks in the [DevOps for Multi-Framework Composition Storybooks series][multi-framework-devops].

### What is the Counter component?

The Counter component is a simple component which displays a number and has two buttons: one to increment the number and one to decrement the number. **Each framework version has the exact same UX and HTML structure**, with slight variations due to the syntax of the framework.

#### HTML for PreactCounter.tsx:
  
```html
<div class="counter">
  <button onClick={subtract}>-</button>
  <pre>{count}</pre>
  <button onClick={add}>+</button>
</div>
```

#### HTML for ReactCounter.tsx:

```html
<div className="counter">
  <button onClick={subtract}>-</button>
  <pre>{count}</pre>
  <button onClick={add}>+</button>
</div>
```

#### HTML for SvelteCounter.svelte:

```html
<div class="counter">
  <button on:click={subtract}>-</button>
  <pre>{count}</pre>
  <button on:click={add}>+</button>
</div>
```

#### HTML for VueCounter.vue:

```html
<div class="counter">
  <button @click="subtract()">-</button>
  <pre>{{ count }}</pre>
  <button @click="add()">+</button>
</div>
```

#### Rendered HTML for all Counter components is the same

_All_ components output the same HTML, which is the voodoo which makes this possible. Same HTML? Same tests.

```html
<div class="counter">
  <button>-</button>
  <pre>0</pre>
  <button>+</button>
</div>
```

## The shared tests

### 1. Getting the elements

The first step? Query the DOM for the elements we want to test.

We need:

* the `+` (`plus`) button
* the `-` (`minus`) button
* the `pre` element which contains the count
* the container, which is a `div` with a class of `counter`

Using `Testing Library`'s queries, we'll create an object by parsing the rendered HTML. In this method, `canvasElement` is the live DOM rendered by the framework.

```js
import { within } from '@storybook/testing-library';
/**
 * Extract elements from an HTMLElement
 */
export const getElements = async (canvasElement) => {
  // `within` adds the testing-library query methods
  const screen = within(canvasElement);

  return { 
    screen,
    canvasElement,
    // `querySelector` used here to find the generic `div` container
    container: await canvasElement.querySelector('.counter'),
    // `queryByRole` finds each button, using `name` to search the text
    minus: await screen.queryByRole('button', { name: /-/i }),
    // using `queryBy` instead of `getBy` to avoid errors in `getElements`
    plus: await screen.queryByRole('button', { name: /\+/i }),
    // `querySelector` again as `pre` has no role and contains variable content
    count: await canvasElement.querySelector('pre'),
  };
}
```

This returns an object with our elements:

```js
{
  screen: {object with testing-library query methods},
  canvasElement: <the-initial-html-element,unchanged>,
  container: <div class="counter">...</div>/{and query methods},
  minus: <button>-</button>/{and query methods},
  plus: <button>+</button>/{and query methods},
  count: <pre>0</pre>/{and query methods},
}
```

### 2. Testing the initial rendered elements

The Counter is a simple component that has no props, so this method just ensures the elements are present and the counter starts at `0`. `ensureElements` should be called before interaction tests to ensure the initial state of the component is what is tested.

The `elements` arg is the object returned from `getElements`.

```js
/**
 * Ensure elements are present and have the correct attributes/content
 */
export const ensureElements = async (elements) => {
  const { minus, plus, count } = elements;
  // `.toBeTruthy` ensures the element exists
  await expect(minus).toBeTruthy();
  await expect(plus).toBeTruthy();
  await expect(count).toBeTruthy();
  // ensures the count starts at zero
  await expect(count).toHaveTextContent('0');
}
```

### 3. Testing keyboard navigation

For keyboard-only users, we'll need to ensure the buttons are focusable and in the expected order. We test navigation separate from interactions to keep the testing methods focused on one type of user experience at a time. 

The component only has two focus-able elements - which are the buttons. 

```js
/**
 * Test keyboard interaction
 */
export const keyboardNavigation = async (elements) => {
  const { minus, plus, container } = elements;
  // tab within the container
  await userEvent.tab({ focusTrap: container });
  await expect(minus).toHaveFocus();
  // `pre` is the next element, but it's not focusable
  await userEvent.tab({ focusTrap: container });
  await expect(plus).toHaveFocus();
}
```

### 4. Testing keyboard interactions

For testing the interaction of the buttons, we'll be adding or subtracting to the number in `pre`. We cannot ensure the order the testing methods will be used, which means `elements.count` might not be `0`. This test method will start by getting whatever number is in `elements.count` and use that number to test the expected addition or subtraction result.

```js
/**
 * Test keyboard interactions
 */
export const keyboardInteraction = async (elements) => {
  const { minus, plus, count, container } = elements;
  // could be any number
  const initCount = parseInt(count.textContent);
  // navigation unimportant here, so we'll just focus on the button
  await plus.focus();
  // with the `plus` button in focus, hitting `enter` should increment
  await userEvent.keyboard('{enter}');
  await expect(parseInt(count.textContent)).toBe(initCount + 1);
  await userEvent.keyboard('{enter}');
  await expect(parseInt(count.textContent)).toBe(initCount + 2);
  await minus.focus();
  await userEvent.keyboard('{enter}');
  await expect(parseInt(count.textContent)).toBe(initCount + 1);
  await userEvent.keyboard('{enter}');
  await expect(parseInt(count.textContent)).toBe(initCount);
  await userEvent.keyboard('{enter}');
  await expect(parseInt(count.textContent)).toBe(initCount - 1);
  // reset user focus to nothing
  await minus.blur();
}
```

### 5. Testing mouse interactions

Same as keyboard interactions, but with mouse clicks instead of keyboard events.

```js
/**
 * Test mouse interaction
 */
export const mouseInteraction = async (elements) => {
  const { minus, plus, count } = elements;
  const initCount = parseInt(count.textContent);
  await userEvent.click(plus);
  await expect(parseInt(count.textContent)).toBe(initCount + 1);
  await userEvent.click(plus);
  await expect(parseInt(count.textContent)).toBe(initCount + 2);
  await userEvent.click(minus);
  await expect(parseInt(count.textContent)).toBe(initCount + 1);
  await userEvent.click(minus);
  await expect(parseInt(count.textContent)).toBe(initCount);
  await userEvent.click(minus);
  await expect(parseInt(count.textContent)).toBe(initCount - 1);
  // reset user focus
  await minus.blur();
}
```

## Using the shared tests in Storybook

Now that we have our shared tests, we can use them in Storybook. (see [part 1][part1]). Below is the React story file, see [the full set of framework-specific stories here][github-example-stories]. The test methods are broken out into `step` functions for legibility in the Storybook UI, but they are not required.

```js
// ReactCounter.stories.js
import { ReactCounter } from '../../src/components/ReactCounter';
import { getElements, ensureElements, mouseInteraction, keyboardNavigation, keyboardInteraction } from '../../src/components/tests/counter.shared-spec';

export default {
  title: 'React',
  component: ReactCounter,
};

export const React = {
  play: async ({ args, canvasElement, step }) => {
    const elements = await getElements(canvasElement);
    step('react tests', async () => {
      await step('ensure elements', async () => {
        await ensureElements(elements);
      });
      await step('mouse interaction', async () => {
        await mouseInteraction(elements);
      });
      await step('keyboard navigation', async () => {
        await keyboardNavigation(elements);
      });
      await step('keyboard interaction', async () => {
        await keyboardInteraction(elements);
      });
    });
  },
};
```

## Using the shared tests in Vitest unit tests

They also drop-in to our unit tests. (see [part 3][part3]). Below is the React unit test file, see [the full set of framework-specific unit tests here][github-example-tests]. The magic here is in the `render` function. Each framework has a different one, but once Vitest renders it, the resulting output of all frameworks is understood by the shared tests.

_note:_ The separate `it` functions are required for now for React, which was having some issues isolating the user interactions when they are all ran together. The `it` functions are not required for all frameworks, but since they give legibility anyway, we'll keep them.

```js
// Vue.spec.tsx
import { render } from '@testing-library/vue';
import { describe, it, assert, expect } from 'vitest';

import VueCounter from '@/components/VueCounter.vue';
import { getElements, ensureElements, mouseInteraction, keyboardNavigation, keyboardInteraction } from '@/components/tests/counter.shared-spec';

describe('Vue', () => {
  describe('Counter', () => {
    it('ensure elements', async () => {
      const rendered = render(VueCounter);
      const elements = await getElements(rendered.container);
      await ensureElements(elements);
    });
    it('mouse interaction', async () => {
      const rendered = render(VueCounter);
      const elements = await getElements(rendered.container);
      await mouseInteraction(elements);
    });
    it('keyboard navigation', async () => {
      const rendered = render(VueCounter);
      const elements = await getElements(rendered.container);
      await keyboardNavigation(elements);
    });
    it('keyboard interaction', async () => {
      const rendered = render(VueCounter);
      const elements = await getElements(rendered.container);
      await keyboardInteraction(elements);
    });
  });
})
```

## Wrapping up

Writing sharable user-experience-based tests for your UI is really about planning for the future. 

The NewHotness™ UI framework is being built right now and in two years that React component you put your soul into is going to be deleted in lieu of the shiny thing. That doesn't mean your UX needs to change ... or your Design ... or your tests. Just do the facelift next time.

_Efficiency in all things, and productivity will follow._

[part1]: /blahg/shared-storybook-tests/
[part2]: /blahg/sharing-tests-between-components/
[part3]: /blahg/sharing-tests-between-vitest-and-storybook/
[live-storybook-example]: https://storydocker.github.io/storydocker-examples/astro-framework-multiple/?path=/story/astro--astro
[testing-library]: https://testing-library.com/
[astro]: https://astro.build/
[multi-framework-devops]: /blahg/multi-framework-composition-storybook-local/
[github-example]: https://github.com/storydocker/storydocker-examples/tree/main/experimental/astro-framework-multiple
[github-example-stories]: https://github.com/storydocker/storydocker-examples/tree/main/experimental/astro-framework-multiple/.framework-storybooks/stories
[github-example-tests]: https://github.com/storydocker/storydocker-examples/tree/main/experimental/astro-framework-multiple/src/components/tests
[codesandbox-example]: https://codesandbox.io/p/sandbox/github/storydocker/storydocker-examples/tree/main/experimental/