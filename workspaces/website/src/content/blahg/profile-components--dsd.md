---
title: "Profile Components: SSR with Declarative Shadow DOM"
description: "Enhancing Profile Components with Declarative Shadow DOM and showing examples for Server Side Rendering"
pubDate: "2024-02-21"
updatedDate: "2024-06-23"
heroImage: "/profile-components-blahg/profile-components-dsd-header.avif"
---


With the [official release of `shadowrootmode`-supporting Firefox v123](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/123#html), it's time to upgrade the profile components with Declarative Shadow DOM functionality!

## tl;dr

* [DSD docs for GitHub profile components][docs-github]
* [DSD docs for dev.to profile components][docs-devto]
* [See the Stackblitz client-side example][stackblitz-page]

---

## What is this?

Four new methods have been added to allow generating a `template` tag with `shadowrootmode` containing the generated HTML and styles of a profile component. This was fairly trivial to add due to the Javascript, HTML and CSS living in separate files. (see [👷 DX: Separate files for Javascript, HTML, and CSS][profile-components-article-dx]).

Each of the four components now have a `dsd` method which can be used to generate something like this:

```html
<template shadowrootmode="open">
  <styles>(...css styles for GitHub component)</styles>
  <section (...rest of generated HTML)</section>
</template>
```

This generated `template` can be used server-side when generating HTML output, or client-side after page load. Although...doing this client-side is weird frankly...like...they're web components, just use them as they were written...who knows though, maybe someone has a use for that feature 🤷.

## How to use the Declarative Shadow DOM methods

Below are some examples of usage of the GitHub component ([see GitHub DSD docs][docs-github]). Usage of the DEV components is pretty much the same - [check out the dev.to DSD docs][docs-devto] for DEV usage examples.

The main value of these is when create HTML _before_ it is rendered by the browser. Then when the browser renders it, the browser converts the DSD into actual Shadow DOM. These components are only presentational and do not have functionality added by the customElement - so DSD or regular web component usage results in the same thing!


### SSR (Server Side Rendering) HTML in Node.js

```javascript
// import from npm module
import { dsd } from 'profile-components/github-utils';

const repos = JSON.stringify([
  'scottnath/profile-components',
  'storydocker/storydocker'
]);

const generatedTemplate = await dsd({
  login: 'scottnath',
  avatar_url: profilePic.src,
  repos
},true);

/**
generatedTemplate contains:
<template shadowrootmode="open">
  <styles>(...css styles for GitHub component)</styles>
  <section (...rest of generated HTML)</section>
</template>
*/

// use this variable in a file pre-render to have a DSD-pre-populated element
const componentHTML = `<github-user>${generatedTemplate}</github-user>`;
```

### Server side render in an Astro component

```javascript
---
import {dsd} from 'profile-components/github-utils';

const repos = JSON.stringify(['scottnath/profile-components', 'storydocker/storydocker']);
const declaredDOM = await dsd({
  login: 'scottnath',
  repos
},true)
---

<github-user
  data-theme="light_high_contrast"
  set:html={declaredDOM}>
</github-user>
```

### Client side rendering via unpkg

```html
<!-- add empty elements to HTML -->
<github-repository></github-repository>
<hr />
<github-user></github-user>

<script type="module">
  // import from unpkg
  import {
    user,
    repo,
  } from 'https://unpkg.com/profile-components/dist/github-utils.js';

  // repo has it's own DSD method:
  const dsdRepo = repo.dsd;

  /**
    * Polyfill for Declarative Shadow DOM which, when triggered, converts
    *  the template element into actual shadow DOM.
    * This is only needed when injecting _after_ page is loaded
    * @see https://developer.chrome.com/docs/css-ui/declarative-shadow-dom#polyfill
    */
  const triggerAttachShadowRoots = () => {
    (function attachShadowRoots(root) {
      root
        .querySelectorAll('template[shadowrootmode]')
        .forEach((template) => {
          const mode = template.getAttribute('shadowrootmode');
          const shadowRoot = template.parentNode.attachShadow({ mode });
          shadowRoot.appendChild(template.content);
          template.remove();
          attachShadowRoots(shadowRoot);
        });
    })(document);
  };

  /**
    * Uses the "dsd" method to generate DSD, add the string of DSD content
    *  to the element, then trigger the polyfill to convert the template
    */
  const injectDSD = async () => {
    const dsdHTML = await dsd({ username: 'scottnath' }, true);
    document.querySelector('github-user').innerHTML = dsdHTML;
    // now that the HTML is async-created, the polyfill can convert it
    triggerAttachShadowRoots();
  };
  injectDSD();

  /**
    * Uses the "dsdRepo" method to generate DSD, add the string of DSD content
    *  to the element, then trigger the polyfill to convert the template
    */
  const injectRepoDSD = async () => {
    const dsdHTML = await dsdRepo(
      { full_name: 'scottnath/profile-components' },
      true
    );
    document.querySelector('github-repository').innerHTML = dsdHTML;
    // now that the HTML is async-created, the polyfill can convert it
    triggerAttachShadowRoots();
  };
  injectRepoDSD();
</script>
```

<iframe width="100%" height="500" src="https://stackblitz.com/edit/profile-components?embed=1&file=github-dsd.html&view=preview&initialpath=github-dsd.html"></iframe>


[profile-components-article-dx]: /blahg/profile-components/#👷
[stackblitz-page]:https://stackblitz.com/edit/profile-components?file=github-dsd.html&initialpath=github-dsd.html&view=preview
[docs-devto]:https://scottnath.com/profile-components/?path=/docs/devto-declarative-shadow-dom--docs
[docs-github]:https://scottnath.com/profile-components/?path=/docs/github-declarative-shadow-dom--docs