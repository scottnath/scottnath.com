---
title: "GitHub Profile Components as Native Web Components"
description: "Discover native web components that showcase GitHub profiles and repositories within the profile-components library."
pubDate: "2023-10-11"
updatedDate: "2024-06-23"
heroImage: "/profile-components-blahg/profile-components-github-header-prod.avif"
---

Discover native web components that showcase GitHub profiles and repositories within the profile-components library.

GitHub profile native web components, which show a user and repositories, are included in the [profile-components library][profile-components-dev-article]. These are native web components, and can be used in any HTML page, framework-based site, or wherever you can use HTML.  You can access them via unpkg.com or include the NPM module in your project.

Table of contents
* [What are the GitHub profile components?](#what)
* [How to use the GitHub profile components](#how)
* [Server Side Rendering (Astro example)](#ssr)
* [Where do the styles come from?](#styles)

## tl;dr

### install via npm:

    npm i profile-components

### use via unpkg.com:

```html
<!-- add to HEAD -->
<script 
  type="module" 
  src="https://unpkg.com/profile-components-blahg/dist/github-user.js">
</script>

<!-- shows a GitHub profile with fetched content for user `scottnath` -->
<github-user username="scottnath" fetch="true"></github-user>
```

```html
<!-- and a way to present repositories -->
<script 
  type="module" 
  src="https://unpkg.com/profile-components-blahg/dist/github-repository.js">
</script>

<!-- shows a GitHub repository with fetched content for repo `scottnath/profile-components` -->
<github-repository 
  full_name="scottnath/profile-components"
  fetch="true"></github-repository>
```

### Quick links

* Check out the [GitHub web components in Storybook](https://scottnath.com/profile-components/?path=/docs/github-github-user--docs) to see the full breadth of visual and content differences
* [profile-components on NPM](https://www.npmjs.com/package/profile-components)
* [profile-components on GitHub](https://github.com/scottnath/profile-components)
* [See demos on stackblitz](https://stackblitz.com/edit/profile-components)

## What are the GitHub profile components? <a name="what"></a>

* 100% native web components
* Zero dependencies
* Fetch profile and repository data from the GitHub API
* No api key required
* Present GitHub content as a profile widget
* Styled using GitHub's CSS style variables from Primer
* Released in the [profile-components library][profile-components-dev-article] 

### Includes two components: user and repository

There are two components for GitHub (so far.) 

#### GitHub repository

The repository web component displays details about a GitHub repository.

<table>
<tr>
<td><figure><img src="/profile-components-blahg/github-dark-repo-freecode-400px.png" width="400" alt="GitHub popular repo web component" /><figcaption>GitHub popular repo web component</figcaption></figure></td><td><figure>
<img width="300" src="/profile-components-blahg/github-light-repo-pc-300px.png" alt="GitHub new repository web componen" /><figcaption>GitHub new repository web component</figcaption></figure></td>
</tr>
</table>

#### GitHub user

The user web component displays details about a GitHub user, it may include a list of repositories. If repositories are included, the UI for a repository comes from the repository web component.

<table>
<tr>
<td><figure><img src="/profile-components-blahg/github-dark-sorhus-300px.png" width="300" alt="GitHub user web component" /><figcaption>GitHub user web component</figcaption></figure></td><td><figure>
<img width="400" src="/profile-components-blahg/github-dark-scottnath-with-repos-400px.png" alt="GitHub user with repositories" /><figcaption>GitHub user with repositories</figcaption></figure></td>
</tr>
</table>

## How to use the GitHub profile components <a name="how"></a>

These components can be used on any HTML page - whether built via framework or just plain HTML. They are available via unpkg.com or you can add the NPM module to your project.

### Using the unpkg distribution for a User

1. Add the script tag to your HTML page's HEAD:

    ```html
    <!-- add to HEAD -->
    <script
      type="module" 
      src="https://unpkg.com/profile-components/dist/github-user.js">
    </script>
    ```

2. Add the component to your HTML page's BODY:

    ```html
    <!-- shows a user's profile -->
    <github-user username="scottnath" fetch="true"></github-user>
    ```

    ![GitHub user with fetched content](/profile-components-blahg/github-light-scottnath-400px.png)

3. Include a list of repositories with the profile

    ```html
    <github-user
      username="scottnath"
      fetch="true"
      repos='["scottnath/profile-components", "storydocker/storydocker"]'
    ></github-user>
    ```

    ![GitHub user with fetched content](/profile-components-blahg/github-light-scottnath-repos-400px.png)

4. Write your own content instead of fetching from GitHub:

    ```html
    <github-user
      username="scottnath"
      name="Meowy McMeowerstein"
      bio="Spending time purring and sleepin"
      followers="500000"
      following="2980"
      avatar_url="/MY_LOCAL_AVATAR_IMAGE.png"
      repos='[{
        "full_name":"scottnath/profile-components",
        "description":"Cool thing, does stuff",
        "language":"HTML"
      }]'
    ></github-user>
    ```

    ![GitHub user with user-derived content](/profile-components-blahg/github-light-fetch-overrides-400px.png)

### Using the unpkg distribution for a Repository

1. Add the _repository_ script tag to your HTML page's HEAD:

    ```html
    <!-- add to HEAD -->
    <script
      type="module" 
      src="https://unpkg.com/profile-components/dist/github-repository.js">
    </script>
    ```

2. Add the component to your HTML page's BODY:

    ```html
    <!-- shows a repository's information -->
    <github-repository 
      full_name="freeCodeCamp/freeCodeCamp" 
      fetch="true"></github-repository>
    ```

    ![GitHub repository with fetched content](/profile-components-blahg/github-light-repo-freecode-400px.png)

3. Add a theme to the repository component:

    ```html
    <!-- shows a repository's information -->
    <github-repository 
      full_name="freeCodeCamp/freeCodeCamp" 
      fetch="true"
      theme="dark"></github-repository>
    ```

    ![GitHub repository with a theme](/profile-components-blahg/github-dark-repo-freecode-400px.png)

4. Write your own content instead of fetching from GitHub:

    ```html
    <github-repository 
      full_name="just-another/c-plus-plus-repo"
      language="C++"
      stargazers_count="123"
      forks_count="456"
      subscribers_count="789"
      description="This is meow meow."></github-repository>
    ```

    ![GitHub repository with local content](/profile-components-blahg/github-dark-repo-local-data-400px.png)

## Server Side Rendering (Astro example) <a name="ssr"></a>

Because these components were built with separate HTML, CSS, and JS files, you can use those pieces to generate HTML on the server. This example is what I did to make an [Astro component for scottnath.com](https://github.com/scottnath/scottnath.com/blob/main/workspaces/website/src/components/GitHubUser.astro).

```js
// GitHubUser.astro
---
import github from 'profile-components/github-utils';
const user = github.user;

const repos = JSON.stringify(['scottnath/profile-components', 'storydocker/storydocker']);
const userContent = await user.generateContent({
  login: 'scottnath',
  // a local profile image helps performance
  avatar_url: '/scott-nath-profile-pic.jpeg',
  repos
},true);
let userHTML = '<style>' + user.styles + '</style>';
userHTML += user.html(userContent);
---

<github-user>
  <template shadowrootmode="open" set:html={userHTML}>
  </template>
</github-user>
```


## Where do the styles come from? <a name="styles"></a>

The best way to have the look n feel of an external site is to integrate their design language as much as possible. The GitHub components use the same source for styles as GitHub itself, the [Primer Design System](https://primer.style/design/).

### Primer Design System

https://primer.style/design/

"_Primer is a set of guidelines, principles, and patterns for designing and building UI at GitHub._"

Primer is the source for all of GitHub's root UI foundations (color text, and border-styles), iconography and basic UI patterns. The primer.style site is a massive resource for details about Primer and it's use by GitHub, so check that out if you have more Primer-specific questions.

#### Color themes

GitHub (via Primer) has two sets of themes, light and dark, and each set contains a few variations. Check out [Primer's Storybook docs for colors](https://primer.style/design/foundations/css-utilities/colors) to play around with the colors and see the different themes.

* light: 'Light'
* light_colorblind: 'Light Protanopia & Deuteranopia'
* light_tritanopia: 'Light Tritanopia'
* light_high_contrast: 'Light High Contrast'
* dark: 'Dark'
* dark_dimmed: 'Dark Dimmed'
* dark_colorblind: 'Dark Protanopia & Deuteranopia'
* dark_tritanopia: 'Dark Tritanopia'
* dark_high_contrast: 'Dark High Contrast'

#### Primatives and iconography
These components are styled with variables generated from Primer's npm packages.

* [primer/primatives](https://github.com/primer/primitives) for colors, borders, and typography
* [primer/octicons](https://github.com/primer/octicons) is the source for all icons used on GitHub. 
* [storybook docs for Octicons](https://primer.style/design/foundations/icons)

#### Auto-captured styles

CSS variables and svg icons are pulled from Primer's npm packages. The generated variables are used to style the components. To make the styles easy to update when Primer makes changes, there is a suite of functions which pull the CSS variables and icons from Primer's NPM packages. The functions are detailed in [this README about the Primer-utilities on profile-components](https://github.com/scottnath/profile-components/blob/main/src/github/utils/README.md#module_Primer-Utilities).


[profile-components-dev-article]: https://dev.to/scottnath/profile-components-display-social-profiles-in-native-web-components-49b2
[pc-storybook-github]: https://scottnath.com/profile-components/?path=/docs/github-github-user--docs