---
title: "Deploying a multi-framework composition Storybook to GitHub Pages"
description: "How to deploy multiple Storybooks to one repo's GitHub Pages site and use them in a multi-framework composition Storybook"
pubDate: "2023-05-24"
updatedDate: "2024-06-24"
heroImage: "/blahg-assets/storybook-composition-with-github-pages.avif"
---

How to deploy multiple Storybooks to one repo's GitHub Pages site and display them inside a multi-framework composition Storybook

## tl;dr

Add refs with a `url` pointing to the child storybook subdirectory like so:

```javascript
refs: {
  preact: {
    title: 'preact',
    url: '<GitHub-Pages-Root>/preact',
  },
}
```

Put the child-Storybooks into subdirectories of your main storybook like so:

<ul class="directories">
  <li class="folder-open">storybook-static
    <ul>
      <li class="folder">preact</li>
    </ul>
  </li>
</ul>


## Prerequisite knowledge

- [Storybook Composition](https://storybook.js.org/docs/react/sharing/storybook-composition)
- [GitHub Pages](https://pages.github.com/)

## Source code in this article

Building upon the code from [Running a local multi-framework composition Storybook](/blahg/multi-framework-composition-storybook-local), but we'll add Storybook composition refs for the GitHub Pages paths.

This [pull request into StoryDocker examples](https://github.com/storydocker/storydocker-examples/pull/3) shows the changes needed to deploy a multi-framework composition Storybook to GitHub Pages.


## Steps to deploy your composed Storybook to a single GitHub Pages site


### Step 1: Add refs for the GitHub Pages paths to your main composed Storybook

Before generating the static sites, we need to set up the main Storybook config so it knows how to find the child Storybooks when deployed to gh-pages.

We have four child Storybooks: `preact`, `react`, `svelte`, and `vue`. We'll be generating their static sites into subdirectories of the main composed Storybook's `storybook-static` directory. 

#### Generic example 

If your main Storybook is here:

`https://YOUR-GITHUB-ORG.github.io/YOUR-REPO/(root of main Storybook)`

then the child Storybook will be here:

`https://YOUR-GITHUB-ORG.github.io/YOUR-REPO/Child-Storybook-Name/`

meaning the `ref` in `.storybook/main.js` will be:

```javascript
refs: {
  "Child-Storybook-Name": {
    title: 'Child-Storybook-Name',
    url: '/YOUR-REPO/Child-Storybook-Name/',
  },
}
```

#### StoryDocker-examples example

This article uses the `astro-framework-multiple` example from StoryDocker-examples, making the root storybook

`https://storydocker.github.io/storydocker-examples/astro-framework-multiple/`

and the child Preact Storybook:

`https://storydocker.github.io/storydocker-examples/astro-framework-multiple/preact/`

and the `ref` in `.storybook/main.js` will be:

```javascript
refs: {
  preact: {
    title: 'preact',
    url: '/storydocker-examples/astro-framework-multiple/preact/',
  },
}
```

#### Step 2: Generate the main composed Storybook

Using `storybook build` we'll first generate the main Storybook, which uses the default `storybook-static` directory. 

`npm run build-storybook`

Creates:

<ul class="directories">
  <li class="folder-open">storybook-static
    <ul>
      <li class="folder">sb-addons</li>
      <li class="folder">...storybook-generated-other-dirs...</li>
      <li class="file">iframe.html</li>
      <li class="file">...storybook-generated-other-files...</li>
    </ul>
  </li>
</ul>

### Step 3: Generate the child Storybooks

**NOTE**: You must generate the parent storybook _first_ so the child Storybooks can be generated into the parent's `storybook-static` directory.

We'll need to use flags to tell the Storybook CLI to generate from the configuration subdirectories for our child Storybooks.

This command:

`npm run build-storybook -- --config-dir .framework-storybooks/.storybook-preact -o storybook-static/preact`

Says to use the `build-storybook` npm script to generate a Storybook from the configuration found in `.framework-storybooks/.storybook-preact` and output it to the `storybook-static/preact` directory.

Generating the whole set at once looks like this:

```
npx concurrently "npm run build-storybook -- --config-dir .framework-storybooks/.storybook-preact -o storybook-static/preact" \
"npm run build-storybook -- --config-dir .framework-storybooks/.storybook-react -o storybook-static/react" \
"npm run build-storybook -- --config-dir .framework-storybooks/.storybook-svelte -o storybook-static/svelte" \
"npm run build-storybook -- --config-dir .framework-storybooks/.storybook-vue -o storybook-static/vue"
```

Generates:

<ul class="directories">
  <li class="folder-open">storybook-static
    <ul>
      <li>(previously generated main storybook files)</li>
      <li class="folder">preact</li>
      <li class="folder">react</li>
      <li class="folder">svelte</li>
      <li class="folder">vue</li>
    </ul>
  </li>
</ul>

#### Step 4: Deploy to GitHub Pages

This is a matter of preference, but I use GitHub actions to deploy to GitHub Pages. Do you on this one, just make sure you deploy the contents of the the `storybook-static` directory, not the directory itself.

### Step 5: Profit

You did good - ask for a raise!