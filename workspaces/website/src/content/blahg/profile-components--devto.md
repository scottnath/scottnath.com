---
title: "DEV Profile Web Components: embed your dev.to profile anywhere"
description: "Learn about native web components that showcase DEV profiles and posts."
pubDate: "2023-10-18"
heroImage: "/profile-components-blahg/profile-components-devto-header.avif"
---

Learn about native web components that showcase DEV profiles and posts.

dev.to profile native web components, which show a user and their posts, are included in the [profile-components library][profile-components-dev-article]. These native web components can be utilized on any HTML page, framework-based site, or wherever you can use HTML. You can access them via unpkg.com or include the NPM module in your project.

## tl;dr

### install via NPM:

    npm i profile-components

### use via unpkg.com:

```html
<!-- add to HEAD -->
<script 
  type="module" 
  src="https://unpkg.com/profile-components/dist/devto-user.js">
</script>

<!-- shows a dev.to profile with posts fetched from dev.to for user `scottnath` -->
<devto-user username="scottnath" fetch="true"></devto-user>
```

### Quick links

* Check out the [dev.to web components in Storybook][pc-storybook-dev] to see the full breadth of visual and content differences
* [profile-components on NPM](https://www.npmjs.com/package/profile-components)
* [profile-components on GitHub](https://github.com/scottnath/profile-components)
* [See demos on stackblitz](https://stackblitz.com/edit/profile-components)

---

Table of contents
* [What are the dev.to profile components?](#what)
* [How to use the dev.to profile components](#how)
* [Server Side Rendering (Astro example)](#ssr)
* [Where do the styles come from?](#styles)

## What are the dev.to profile components? <a name="what"></a>

* Cross-browser, pure native web components
* Zero dependencies
* Fetch profile and post data from the dev.to API
* No api key required
* Present dev.to content as a profile widget
* Styled using dev.to's CSS style variables from Forem
* Released in the [profile-components library][profile-components-dev-article] 

### Includes two components: user and post

There are two components for presenting content from the dev.to site. One is a simple UI to present a single post, showing only an image and the post title and linking to the post. The other, `devto-user`, is the full profile component, which incorporates the `devto-post` UI to present user-written posts.

#### dev.to post

The `devto-post` web component displays details about a dev.to post. **It is very basic**, but can be styled via themes and adjusts spacing via container-queries.

<table>
<tr>
<td><figure><img src="/profile-components-blahg/devto-post-400px.png" width="400" alt="dev.to post web component" /><figcaption>dev.to post web component (400px)</figcaption></figure></td><td><figure><img width="300" src="/profile-components-blahg/devto-post-300px.png" alt="dev.to post web component" /><figcaption>dev.to post web component (300px)</figcaption></figure></td>
</tr>
</table>

#### dev.to user

The `devto-user` web component displays details about a DEV user. Using `fetch` to populate the content will include a set of posts (if the user has posts). On fetch, you can choose to not include posts by changing `fetch="true"` to `fetch="no-posts"`.

<table>
<tr>
<td><figure><img src="/profile-components-blahg/devto-user-300px-light.png" width="300" alt="dev.to user web component" /><figcaption>dev.to user without posts</figcaption></figure></td><td><figure><img width="400" src="/profile-components-blahg/devto-user-400px-dark.png" alt="dev.to user" /><figcaption>dev.to user (400px)</figcaption></figure></td>
</tr>
</table>

## How to use the dev.to user profile component <a name="how"></a>

These components can be used on any HTML page - whether built via framework or just plain HTML. They are available via unpkg.com or you can add the NPM module to your project.

### Using the unpkg distribution for a User

#### Add the script tag to your HTML page's HEAD:

```html
<!-- add to HEAD -->
<script
  type="module" 
  src="https://unpkg.com/profile-components/dist/devto-user.js">
</script>
```



#### Add the component to your HTML page's BODY:

```html
<!-- shows a user's profile -->
<devto-user username="scottnath" fetch="true"></devto-user>
```

<iframe width="100%" height="500" src="https://stackblitz.com/edit/profile-components?embed=1&file=devto-user-fetch.html&view=preview&initialpath=devto-user-fetch.html"></iframe>


#### Show Fetched profile _without posts_

```html
<!-- shows a user's profile without posts -->
<devto-user username="scottnath" fetch="no-posts"></devto-user>
```

<iframe width="100%" height="500" src="https://stackblitz.com/edit/profile-components?embed=1&file=devto-user-fetch-no-posts.html&view=preview&initialpath=devto-user-fetch-no-posts.html"></iframe>


#### Write your own content instead of fetching from dev.to:

```html
<devto-user
  username="scottnath"
  fetch="true"
  name="Meowy McMeowerstein"
  summary="Spending time purring and sleepin"
  profile_image="https://scottnath.com/profile-components/cat-square.jpeg"
  joined_at="Jan 1, 1979"
  post_count="1000000"
  latest_post='{...ForemPost}'
  popular_post='{...ForemPost}'
  data-theme="dark"
></devto-user>
```

<iframe width="100%" height="500" src="https://stackblitz.com/edit/profile-components?embed=1&file=devto-user-attrs.html&view=preview&initialpath=devto-user-attrs.html"></iframe>


## Server Side Rendering (Astro example) <a name="ssr"></a>

Because these components were built with separate HTML, CSS, and JS files, you can use those pieces to generate HTML on the server. This example is what I did to make an [Astro component for scottnath.com](https://github.com/scottnath/scottnath.com/blob/main/workspaces/website/src/components/DevToUser.astro).

```js
// DevToUser.astro
---
import devto from 'profile-components/devto-utils';
const user = devto.user;

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

<devto-user>
  <template shadowrootmode="open" set:html={userHTML}>
  </template>
</devto-user>
```


## Where do the styles come from? <a name="styles"></a>

The best way to have the look n feel of an external site is to integrate their design language as much as possible. The DEV web components use the same source for styles as dev.to itself, the Forem open source community software. More specifically, from the [Forem open source repo on GitHub](https://github.com/forem/forem).

### Forem Open source community software

https://github.com/forem/forem

This is a large codebase, which includes a lot of Ruby files. The styles are in both CSS and Sass files and can be found in the [/app/assets/stylesheets subdirectory.](https://github.com/forem/forem/blob/main/app/assets/stylesheets).

Dev, by way of Forem, essentially has four themes: Forem base styles, Dev `branded` styles, and light and dark versions of each. For now, these dev.to web components only compensate for dev.to `branded` colors. I wrote some scripts to copy-pasta specific variables from a few stylesheets which can be found in these [docs for the dev.to web component helpers](https://github.com/scottnath/profile-components/tree/main/src/devto/helpers)


[profile-components-dev-article]: https://dev.to/scottnath/profile-components-display-social-profiles-in-native-web-components-49b2
[pc-storybook-dev]: https://scottnath.com/profile-components/?path=/story/devto-devto-user--user