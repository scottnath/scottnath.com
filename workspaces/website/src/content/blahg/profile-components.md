---
title: "Profile Components: display social profiles in native web components"
description: "Profile-components are a set of web components with zero dependencies that display publicly-available profile information from various social networks. Currently two: GitHub and dev.to."
pubDate: "2023-10-10"
heroImage: "/profile-components-blahg/profile-components-header-prod.jpeg"
---

Profile Components is a set of web components with zero dependencies that display publicly-available profile information from various social networks. Currently two: GitHub and dev.to.

Being native web components, these can be used in any HTML page, framework-based site, or wherever you can use HTML.  They are available via unpkg.com or you can add the NPM module to your project.

## 100% All Natural Features!


🔥 [100% native web components](#🔥)

🚫 [Zero dependencies](#🚫)

🔓 [No api keys needed](#🔓)

🎨 [New hotness CSS w/nesting & container queries](#🎨)

👷 [DX: Separate files for Javascript, HTML, and CSS](#👷)

✅ [Native unit testing with node:test](#✅)

♿ [Fully accessible](#♿)

🎁 [Bonus! A sneaky SSR workaround for server side rendering!](#🎁)


## tl;dr

use via unpkg.com:

```html
<!-- add to HEAD -->
<script 
  type="module" 
  src="https://unpkg.com/profile-components-blahg/dist/github-user.js"></script>

<!-- shows a GitHub profile with fetched content for user `scottnath` -->
<github-user username="scottnath" fetch="true"></github-user>
```

install via NPM: 
    
    npm i profile-components

links to learn more:

* [profile-components on GitHub](https://github.com/scottnath/profile-components)
* play with the components in [Storybook](https://scottnath.github.io/profile-components)
* [See demos on stackblitz](https://stackblitz.com/edit/profile-components)

## 🔥 Framework-free in 2023! <a name="🔥"></a>

There have been a lot of feature drops across the major browsers this year, allowing us to more easily build shareable and reusable web components without any frameworks and without pre-or-post style-processors like Sass or PostCSS. This includes full implementation most of the original web components spec (🫗 _r.i.p. HTML imports_.) This year also includes lots of long-sought-after CSS features like container queries and nesting. 

`profile-components` contain user interfaces without interactions or changing state making them simple to build cross-browser. As web components with unique styling, the isolation of styles inside the shadow dom is a benefit because each component uses a different set of root variables and styles. The style isolation allows these old school "widgets" to visually represent the social network they are displaying without affecting the rest of your page.

## 🚫 Zero dependencies <a name="🚫"></a>

Any dependencies on this project are only for development. Meaning there are dependencies listed in `devDependencies`, but those are for testing and building the distributed components. The only external code which goes into the final build are the style variables and icons pulled from the social network's open source code.

## 🔓 Fetches live data - no api keys needed! <a name="🔓"></a>

There are two options for sourcing content into these web components: fetch it live from the social's rest API or feed the component static data via the HTML attributes. You may also mix in your own data to overwrite what comes from the APIs - like if you wanted to have a local avatar image instead. 

_note_: future components may need an API key(s), but for now, these use public, AUTH-free endpoints.

### Fetching live data (`fetch="true"`)

<table>
<tr>
<td>

```html
<github-user
  username="scottnath"
  fetch="true"
></github-user>
```

</td>
<td>

![Example of GitHub profile component with fetched data](/profile-components-blahg/github-dark-scottnath-400px.png)

</td>
</tr>
<tr>
<td colspan="2">
<h2>...or... Skip fetching and use static data</h2>
</td>
</tr>
<tr>
<td>

```html
<github-user
username="scottnath"
name="Meowy McMeowerstein"
bio="Spending time 
     purring and sleepin"
followers="500000"
following="2980"
avatar_url="/cat-avatar.png"
></github-user>
```
</td>
<td>

![Example of GitHub profile component with local data](/profile-components-blahg/github-dark-meowy-400px.png)

</td>
</tr>
</table>

## 🎨 Styles <a name="🎨"></a>

Stylesheets are written in pure CSS and only use features which are supported in all major browsers. 

### Nesting

Stylesheets have their styles nested to reduce adding extra classes to the HTML and to make them easier to maintain.

```css
/* uses `:has` to target the dl with a .post inside */
& dl:has(.post) {
  border-bottom: 1px solid var(--color-shadow);
  padding-bottom: 1em;

  /* any `dt` inside a `dl` with a `.post` inside */
  & dt {
    color: var(--color-light);
    font-size: var(--font-size-light);
```

### Container Queries

Container queries allow the components to be responsive to their container, not the viewport - a more realistic usage scenario.
|   |   |
|---|---|
| <figure><img src="/profile-components-blahg/devto-200px-wide.png" width="200" alt="DEV web component in a 200 pixel wide container" /><figcaption>200px wide container</figcaption></figure>  | <figure><img width="400" src="/profile-components-blahg/devto-400px-wide.png" alt="DEV web component in a 400 pixel wide container" /><figcaption>400px wide container</figcaption></figure>  |

### Colors and CSS variables sourced from the social network

To make the components _feel_ like the sites they represent, they need to use the same colors, icons, and fonts. So to build these components, I sourced CSS variables from their open source repositories or modules. For GitHub, this means styles from the [primer design system](https://primer.style/) and for dev.to, which is built using the [Forem community software](https://www.forem.com/), I sourced styles from the [forem/forem repo on GitHub](https://github.com/forem/forem).

```css
/* from the GitHub design-system, primer */
/* Light Theme */:host([data-theme="light"]) {
  --color-avatar-border: rgba(31,35,40,0.15);
  --color-border-default: #d0d7de;
  --color-canvas-default: #ffffff;
  --color-canvas-subtle: #f6f8fa;
  --color-fg-default: #1F2328;
  --color-fg-muted: #656d76;
  --color-fg-subtle: #6e7781;
  --color-fg-onemphasis: #ffffff;
  --color-fg-accent: #0969da;
  --color-fg-danger: #d1242f;
}
/* Light Protanopia & Deuteranopia Theme */:host([data-theme="light_colorblind"]) {
  --color-avatar-border: rgba(27,31,36,0.15);
  ...
```


## 👷 DX: Separate files for Javascript, HTML, and CSS <a name="👷"></a>

"_Easy to maintain_" requires a good Developer Experience (DX). To make these components easier to iterate on and update, they're built like a web page. This means separate HTML, Javascript and CSS files. While the development happens in separate files, the content from the various files is compiled into a single file for distribution.

I was inspired by Leon Eck's post [Splitting Web Components into .ts, .html, and .scss files](https://leoneck.de/blog/wc-split-setup/), which detailed a similar approach, using [esbuild](https://esbuild.github.io/) to compile the files into a single file. Esbuild is pretty simple to set up and configure, and it easily takes every `import`ed file and converts it to an in-file variable. 

### HTML generation without frameworks or libraries

To maintain the **zero dependencies** goal, the HTML is living inside a Javascript file as a string returned from a method that accepts a single, JSDoc-documented parameter. This is not ideal, but allows using Javascript to generate the HTML without a framework or templating library like Lit or Handlebars. This is also what makes the SSR trick easy to pull off.

### Javascript methods outside of the customElements class

Testing is paramount to easy maintenance. The JS methods used by these components perform fairly simple tasks which can be unit tested without the need for a browser. These web components get data using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), which is fully implemented in both Node and browsers, making it easy to create mock responses and unit tests. They **can also be used outside of the web component**, so a separate file makes sense. 

### Separate stylesheets for styles and source variables.

There are separate sheets for maintainability. Generally, there is one auto-generated file with variables from the social network, one with stylesheet with global styles (since there are multiple components with unique styles combined), and one stylesheet per component. Generally the files are:

<dl>
  <dt>vars-[source].css</dt>
  <dd>e.g. `vars-devto.css`.</dd>
  <dd>Variables from the social network's open source code</dd>
  <dt>global.css</dt>
  <dd>Global style variables</dd>
  <dd>Shared across all components</dd>
  <dt>[component].css</dt>
  <dd>e.g. `user.css` or `repository.css`</dd>
  <dd>Styles specific to the component</dd>
</dl>

These are then imported by the web component and exported with the HTML inside a `<style>` tag.

## ♿ Fully accessible <a name="♿"></a>

These components are tested using screen readers and AXE via Storybook. The HTML structure focuses on semantic HTML and when read aloud via screen reader, screen-reader-only content is available to provide context to the user.

For example, in the GitHub component, the header looks like this:

![GitHub component header shows the GitHub logo and the username](/profile-components-blahg/github-component-header-scottnath.png)

And the HTML is this:

```html
<section aria-label="GitHub user profile" itemscope itemtype="http://schema.org/Person">
  <header>
    <span><span itemprop="memberOf">GitHub</span> user</span> 
    <span itemprop="alternativeName">scottnath</span>
  </header>
```

The styles convert the first span into the GitHub logo using CSS' `mask-image` property. This visually hides the text, but it's still available to screen readers, so the screen reader reads this to the user:

"_GitHub user profile GitHub user scottnath_"

_note_: The `itemscope` and other `item[thing]` attributes are from [schema.org](https://schema.org). These are used to structutre the data into microformats. This is more for SEO and content structure than for accessibility.


## ✅ Native Unit Testing with Node 20's node:test <a name="✅"></a>

Might as well go all in! **Node 20 shipped with a native test runner**, [node:test](https://nodejs.org/api/test.html). Fairly simple test runner, but it includes code coverage and has all the functionality needed to unit test these components.

The latest unit test runs are visible in the [unit tests GitHub action workflow for profile-components](https://github.com/scottnath/profile-components-blahg/actions/workflows/unit-tests.yml)


## 🎁 bonus! Server Side Rendering cheatcode! <a name="🎁"></a>

Because these components were built with separate HTML, CSS, and JS files, you can use those pieces to generate HTML on the server. This example is what I did to make an Astro component for scottnath.com.

```js
// DevToUser.astro
---
import devto from 'profile-components/devto-utils.js';
const user = devto.user;

const userContent = await user.generateContent({
  username: 'scottnath',
},true);
let userHTML = '<style>' + user.styles + '</style>';
userHTML += user.html(userContent);
---

<devto-user>
  <template shadowrootmode="open" set:html={userHTML}>
  </template>
</devto-user>
```
