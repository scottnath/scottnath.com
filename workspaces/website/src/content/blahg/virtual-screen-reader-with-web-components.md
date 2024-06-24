---
title: "Storybook setup: Virtual Screen Reader in Web Components"
description: "How to set up Storybook to test shadowroot elements in web components using shadow-dom-testing-library and Guidepup's Virtual Screen Reader."
pubDate: "2024-03-07"
updatedDate: "2024-06-24"
heroImage: "/blahg-assets/storybook-setup-virtual-screen-reader-with-web-components.avif"
heroImageDesc: 'Article header image shows the Guidepup, webcomponents, and Storybook logos between greater-than and less-than characters with text below them that reads "Storybook Setup for Virtual Screen Reader + Web Components"'
---


Simulated user testing is difficult with web components due to the unique nature of the `shadowroot` - but it can be done in Storybook! This article details the basic setup with examples to get you writing tests for customElements that simulate user behavior.

## tl;dr

Two modules, `@guidepup/virtual-screen-reader` and `shadow-dom-testing-library` give your Storybook the power to test web components inside Storybook's Interaction Tests. This means you can test the user-interactions and screen reader output of your web components. But beware ... `testing-library/user-test` can't simulate `TAB` navigation inside shadowroots yet.

* [Example GitHub repo][example-github-repo]
* [Example storybook file][example-stories-file]
* [Running app on Stackblitz][example-stackblitz]
* [@guidepup/virtual-screen-reader docs][vsr-docs]
* [shadow-dom-testing-library docs][sdtl]

## Prerequisites

* Knowledge of [testing-library](https://testing-library.com/docs)
* Knowledge of [storybook interaction testing](https://storybook.js.org/docs/writing-tests/interaction-testing)

## What is this article about?

1. Problems testing web components 
1. How to test web components in Storybook Interaction Tests
1. How to test web components using virtual-screen-reader

---

## 1. Problems testing web components 

It's the **shadowroot**. It's always the **shadowroot**.

Lots of libraries haven't been updated to integrate shadow DOM. This is not to knock anybody - I think after years of waiting on browsers-makers to catch up, we were all genuinely surprised when extensive customElements support actually got integrated into major browsers 🤷.

The below problems are found within `testing-library`, but are also inherited by `@storybook/test`. This means the bugs affect APIs like `userEvent` and `screen` regardless of the source module.

### Problem A: `screen` doesn't look into the shadowroot

Whether from `testing-library/dom` or `@storybook/test`, the `screen` and all it's subsequent `queries` won't find the elements in your shadow DOM. Real world - that translates to `screen.queryAllByRole('button')` not seeing the `BUTTON` inside your fancy `<fancy-button>` web component. 

And it definitely comes up empty on recursive shadowroots (e.g. web components slotted into other web components)

#### Fix: `npm i shadow-dom-testing-library`

To get around the `screen` and `queries` problems and allow our Storybook interaction tests to find the shadow DOM's secrets, we'll use [KonnorRogers/shadow-dom-testing-library][sdtl]. 

Your new friend, `shadow-dom-testing-library`, includes various methods in its api which mimic the queries made by testing-library - but now with **shadowroot**! The win here is that `shadow-dom-testing-library` gives your tests the power to query elements within the shadow DOM. To do this, `screen.findByLabelText` is cloned and changed to become `screen.findByShadowLabelText`, which has the smarts to see into the `shadowroot`. 

More examples below, but see the [shadow-dom-testing-library github repo][sdtl] for detailed usage of that NPM module. I'm not covering it all here.

### Problem B: `userEvent` can't traverse the shadowroot

This doesn't mean `userEvent` doesn't work on elements in the shadowroot. If you can get the element and give it to `userEvent`, hot dog! it can do all the clicks and typin you need. But not `TAB`. Traversing via `TAB` is no. 

We'll be using `virtual-screen-reader`'s `.next()` method to navigate through the shadow DOM.

AFAIK, internally `TAB` uses global `window` inside Storybook...which can't naturally see into the shadowroot. I'm still investigating this, but I found a lot of unresolved issues doing searches for "`userEvent`" + "`shadowroot`" - lemme know if I've missed something!

#### Fix: `npm i @guidepup/virtual-screen-reader`

One cool aspect of `virtual-screen-reader` is that it navigates through your elements. We can use this to programmatically traverse the inner shadow DOM. 

Returning folks be aware - this article has some repeat-examples from ["_Simple setup: Virtual Screen Reader in Storybook_"][vsr-article-og] ... with different usage for web components natch.

---

## 2. How to test web components in Storybook Interaction Tests

See the [MyElement.stories.js file in the storybook-web-components-testing repo][example-stories-file] for the full version of these examples.

The following examples use [Storybook's Component Story Format](https://storybook.js.org/docs/api/csf).

### Step 2a. install shadow-dom-testing-library

`npm i shadow-dom-testing-library -D`

### Step 2b. use `within` from `shadow-dom-testing-library` (I alias it to `shadowWithin`)

```javascript
// CSF file: MyElement.stories.js
import { within as shadowWithin } from 'shadow-dom-testing-library';
import { expect } from '@storybook/test';

export default {
  title: 'MyElement',
  component: 'my-element',
  render: (args) => `<my-element count=${args.count}></my-element>`;
};
```

### Step 2c. use shadow-dom-testing-library screen queries, then test

```javascript
// ...CSF file contents...

export const SomeExample = {
  args: {
    count: 0
  },
  play: async ({ args, canvasElement, step }) => {
    // get a screen from the canvasElement generated by Storybook
    const screen = shadowWithin(canvasElement);
    // get the button from within the shadowroot with `queryBy`
    const myButton = await screen.queryByShadowRole('button')
    // test the button exists
    expect(myButton).toBeTruthy();
  }
}
```

---

## 3. How to test web components with virtual-screen-reader

You'll be capturing your element with `queryByShadowMEOW('the-meow')` (`MEOW` of course being whatever query you're using from the [testing-library core API queries](https://testing-library.com/docs/queries/about)). After you have your element, using virtual-screen-reader is the same as the usage broken down in [Simple setup: Virtual Screen Reader in Storybook][vsr-article-og].

### Step 3a. install virtual-screen-reader (VSR)

`npm i @guidepup/virtual-screen-reader -D`

### Step 3b. import it into your stories

```javascript
// CSF file: MyElement.stories.js, now with VSR!
import { within as shadowWithin } from 'shadow-dom-testing-library';
import { virtual } from '@guidepup/virtual-screen-reader';
import { expect } from '@storybook/test';

export default {
  title: 'MyElement',
  component: 'my-element',
  render: (args) => `<my-element count=${args.count}></my-element>`;
};
```

### Step 3c: once you have your main Shadow container, give it to VSR

If the HTML in your shadowroot is...

```html
<!-- note: `section` by default has an aria-role of `region` -->
<section aria-label="My Element"><button>my button</button></section>
```

...then your story's play method will be like:

```javascript
// ...CSF file contents...

export const SomeExample = {
  args: {
    count: 0
  },
  play: async ({ args, canvasElement, step }) => {
    // make a `screen` from the canvasElement by finding it's shadowroot
    const screen = shadowWithin(canvasElement);
    // get the outer-most SECTION element in the shadowroot with `aria-label="My Element"`
    const myShadowContainer = await screen.findByShadowLabelText(/My Element/i)
    // Start up the Virtual Screen Reader, giving it the SECTION container
    await virtual.start({ container: myShadowContainer });
    
    // Breakdown of elements-found, in order:
    // 1. `virtual` starts on the container, a `SECTION` has the role `region`, 
    await expect(await virtual.lastSpokenPhrase()).toEqual('region, My Element');
    
    // 2. Go to next speak-able text
    await virtual.next();
    
    // 3. we're now on `BUTTON`
    await expect(await virtual.lastSpokenPhrase()).toEqual('button, my button');
    
    // 4. Go to next speak-able text
    await virtual.next();
    
    // 5. We're done and VSR says so by closing the `region`:
    await expect(await virtual.lastSpokenPhrase()).toEqual('end of region, My Element');
  }
}
```

---

## Conclusion

I hope this gets you unstuck. Web components are definitely the new hotness, the DevX tooling just needs a little help still.

Bonus content for reading this far - check out [this hacky workaround that uses VSR to find all tabbable nodes inside a shadowroot][hacky-helper]!

---

[example-github-repo]: https://github.com/scottnath/storybook-web-components-testing
[example-stories-file]: https://github.com/scottnath/storybook-web-components-testing/blob/main/src/MyElement.stories.js
[example-stackblitz]: https://stackblitz.com/~/github.com/scottnath/storybook-web-components-testing
[vsr-docs]: https://www.guidepup.dev/docs/virtual
[vsr-github]: https://github.com/guidepup/virtual-screen-reader
[vsr-article-og]: https://dev.to/scottnath/simple-setup-virtual-screen-reader-in-storybook-2efo
[guidepup]: https://guidepup.dev/
[sdtl]: https://github.com/KonnorRogers/shadow-dom-testing-library
[hacky-helper]: https://github.com/scottnath/storybook-web-components-testing/blob/main/src/helper-vsr-tabnodes.js