---
title: "Simple setup: Virtual Screen Reader in Storybook"
description: "How to set up Storybook with Guidepup's Virtual Screen Reader and test what the screen reader speaks"
pubDate: "2024-03-01"
updatedDate: "2024-06-23"
heroImage: "/blahg-assets/simple-setup-guidepup-virtual-screen-reader-with-storybook.avif"
heroImageDesc: 'Article header image shows the Guidepup and Storybook logos between greater-than and less-than characters with text below them that reads "Simple Setup for Virtual Screen Reader + Storybook"'
---

Recent changes to the [@guidepup Virtual Screen Reader library][vsr-github] make it ridiculously easy to integrate into Storybook for use in your integration tests. This article shows how to get the basic setup going and how to write your first screen reader test in Storybook.

## tl;dr

The Virtual Screen Reader is a great tool to mimic screen reader output and it's works in Storybook without addons or configuration changes.

* [Example GitHub repo][example-github-repo]
* [Example story file with VSR][example-story-file]
* [Running app on Stackblitz][example-stackblitz]
* [Virtual Screen Reader docs][vsr-docs]


## What is the Virtual Screen Reader?

The Virtual Screen Reader ([docs][vsr-docs], [GitHub][vsr-github]) is a library, available via NPM, which mimics the functionality of a screen reader. The VSR is from Guidepup ([guidepup.dev][guidepup]), which has tons of screen reader tooling. The Virtual Screen Reader is the easiest @guidepup tool to set up and it can read your components like a screen reader would, giving you back the text for use in testing.

FYI: _Guidepup has a suite of tools that mirror and/or directly-simulate screen reader experiences and capture the results.  The tools are impressive and worth checking out if you want to automate accessibility testing into your workflow. For example, you can use directly use the system NVDA or Mac VoiceOver via Playwright. (check out [Craig's dev.to article on implementing Guidepup with Playwright and Mac VoiceOver][craig-article] for details)_


## How does the screen reader interpret a chunk of HTML?

Screen readers vary in interpretation, but this gives a _rough_ understanding of how your HTML could get broken down by the VSR.

If the HTML a component puts out is this:

```html
<header>
  <div class="storybook-header">
    <div>
      <svg>...</svg>
      <h1>Acme</h1>
    </div>
    <div>
      <span class="welcome">Welcome, <b>Jane Doe</b>!</span>
      <button type="button" class="...">Log out</button>
    </div>
  </div>
</header>
```

This is what the Virtual Screen Reader will translate it into:

```html
<header> <!--BANNER-->
<h1>Acme</h1> <!--HEADING + text + HEADING-LEVEL-->
Welcome, <!--Text-->
Jane Doe <!--Text-->
! <!--Punctuation-->
<button>Log out</button> <!--BUTTON + text-->
</header> <!--END OF BANNER-->
```

## How to set up your Storybook instance to use the Virtual Screen Reader

Follow these steps to test with VSR in your Storybook environment:

1. Ensure your storybook environment is set up for Interaction tests (see [Storybook setup docs][sb-setup])
1. Install the VSR npm module 
    `npm i @guidepup/virtual-screen-reader -D`
1. _PROFIT_ - **No addon setup or other configuration needed!**


## How to write a Storybook integration test that uses the Virtual Screen Reader

This example is using the default Header component that installs with default Storybook. We'll be adding Interaction tests which will use VSR. You can see the [completed Header.stories.js on GitHub][example-story-file]. 


### Import the library into your stories file

To integrate the VSR into your tests, import it in your test file. In this example, we'll add the assertions into a `play` test, so we need `expect` from Storybook's `test` library too.

```javascript
import { virtual } from '@guidepup/virtual-screen-reader';
import { expect } from '@storybook/test';
```

### Write the story and integration test

See comments in-the-code below for details

```javascript
// Default LoggedIn story
export const LoggedIn = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
  // add the play method - it's where you put your tests!
  play: async ({ args, canvasElement, step }) => {
    // Start up the Virtual Screen Reader, giving it the canvasElement
    await virtual.start({ container: canvasElement });

    // This `while` statement navigates through the component using the 
    //  Virtual Screen Reader to speak the text whereever the cursor is located.
    //  It will continue until it reaches the end of the <header> element, 
    //  which has a `banner` aria role, thus "end of banner"
    while ((await virtual.lastSpokenPhrase()) !== "end of banner") {
      // `.next()` moves the Virtual cursor to the next location.
      await virtual.next();
    }

    // What we expect the screen reader to say
    const expected = [
      'banner',
      // it is an `<h1>`, so `level 1`
      'heading, Acme, level 1',
      'Welcome,',
      // Using `args` here allows you to change args without breaking the test
      args.user.name,
      '!',
      'button, Log out',
      'end of banner'
    ]

    // Here's the test! It asserts the screen reader said what we expected.
    //  When we called `lastSpokenPhrase` every time the `while` looped, 
    //  the spoken text was added to the `PhraseLog`, in order
    expect(await virtual.spokenPhraseLog()).toEqual(expected);
    
    // Stop your Virtual Screen Reader instance
    await virtual.stop();
  }
};

```

![Screenshot of test results in Storybook integration test using Virtual Screen Reader output][example-image]


## Conclusion

This example is simple on purpose so it can easily get the copypasta treatment. Once it works for you, dig into the [Virtual Screen Reader docs][vsr-docs] and see how much more you can test for with this tool. Cheers!




[vsr-docs]: https://www.guidepup.dev/docs/virtual
[vsr-github]: https://github.com/guidepup/virtual-screen-reader
[guidepup]: https://guidepup.dev/
[craig-article]: https://dev.to/craigmorten/a11y-unlocked-screen-reader-automation-tests-3mc8
[sb-setup]: https://storybook.js.org/docs/writing-tests/interaction-testing#set-up-the-interactions-addon
[example-image]: /blahg-assets/storybook-interaction-tests-showing-virtual-screen-reader.avif
[example-github-repo]: https://github.com/scottnath/virtual-screen-reader-storybook
[example-story-file]: https://github.com/scottnath/virtual-screen-reader-storybook/blob/main/stories/Header.stories.js
[example-stackblitz]: https://stackblitz.com/~/github.com/scottnath/virtual-screen-reader-storybook