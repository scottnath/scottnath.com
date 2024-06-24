---
title: "Running a local multi-framework composition Storybook"
description: "How to run a local multi-framework composition Storybook instance with one command"
pubDate: "2023-05-17"
updatedDate: "2024-06-23"
heroImage: "/blahg-assets/astro-multiframework-storybook.avif"
---

How to run a local multi-framework composition Storybook instance with one command

## tl;dr

**problem**: we can't compose multiple Storybooks in the same process without getting CORS errors

**typical solution**: run one storybook, open a new terminal tab, run the next, new tab, start the main composed storybook

**one-tab solution**: Use `concurrently` and `wait-on` to run multiple Storybooks in one terminal tab.

See this [example of a multi-framework composition Storybook](https://github.com/storydocker/storydocker-examples/tree/main/experimental/astro-framework-multiple) for working code.

## Prerequisite knowledge

- [Storybook Composition](https://storybook.js.org/docs/react/sharing/storybook-composition)

**note**: This article is specific to running Storybook _locally_.

## Problem 1: Storybook Composition CORS bugs

The most common errors when using Storybook Composition seem to be related to CORS (Cross-Origin Resource Sharing). You can see how often CORS is mentioned when [searching Storybook's GitHub repo's issues for CORS + Composition](https://github.com/search?q=repo%3Astorybookjs%2Fstorybook+cors+composition&type=issues).

Basically, if the parent Storybook (the Storybook instance which references the child Storybooks) is started before the child Storybooks have _completely launched and are viewable in browser_, then the parent Storybook will throw CORS errors. The CORS errors will block the parent Storybook from loading the child Storybooks. No clear fix has been found for this issue - and I've tried a bunch.

The common solution is to use multiple terminal windows and wait for the child Storybooks to be fully launched before starting the parent Storybook. 

Why do we have to do it that way?

See: ⬇️

## NodeJS is single-threaded ...

When running a script in a NodeJS process, it is the only script which can run in that process at that time. So, if you're in a terminal window you cannot run another script in that window until the first script has finished. 

## ... and Storybook composition requires waiting

When running Storybook locally in dev mode, it does not exit or otherwise programatically indicate that Storybook has started. A composed Storybook should not start until the child Storybooks are running. But using scripts like `concurrently` or `npm-run-all` has not consistently worked for me _when the parent/composed Storybook instance is in the list of scripts running concurrently_.

Of course, you can open a new tab/terminal window for each command, but that means all users of your repo need to know that trick too. Inefficient!

The following is a solution that works consistently with a single NPM script.

## Example code 

### Astro's Kitchen Sink

We'll be using Astro's [Kitchen Sink: Microfrontends with Astro](https://github.com/withastro/astro/tree/latest/examples/framework-multiple), which showcases Astro's built-in support for multiple frameworks (React, Preact, Svelte, and Vue (`v3.x`)). This a multi-framework application, meaning it can use components from multiple JS frameworks in the UI - very cool!

### StoryDocker-storybook

We'll be adding [StoryDocker](https://github.com/storydocker/storydocker)'s module [StoryDocker-storybook](https://www.npmjs.com/package/storydocker-storybook) which injects the typical dependencies needed to set up Storybook. 

### Working codebase on GitHub

The code referenced is available on GitHub via [the astro-framework-multiple example](https://github.com/storydocker/storydocker-examples/tree/main/experimental/astro-framework-multiple) in the StoryDocker-examples repo.


## Steps to compose Storybooks locally

### Step 1: Start up the child Storybook(s) in parallel

We'll be using `concurrently`, an NPM module which allows running multiple commands at the same time. ([Concurrently on npmjs](https://www.npmjs.com/package/concurrently))

The child Storybooks don't need to know each other exist, so they can be started at the same time.

Using `concurrently`, we'll run each child-Storybook in parallel. 

#### Step 1.a: Running one child Storybook

This command will run one child Storybook:

`npm run storybook -- --config-dir .framework-storybooks/.storybook-preact --port 6001 --no-open`

Let's break down that command:

`npm run storybook` is the command to run Storybook via the NPM script `storybook` in `package.json`. That script is calling the [Storybook CLI](https://storybook.js.org/docs/react/api/cli-options) with the command `storybook dev`.

`-- ` the extra double-dashes allow us to send flags-and-options directly to `storybook dev`

`--config-dir .framework-storybooks/.storybook-preact` is the command to run Storybook with the `preact`-specific configuration found in the local directory

`--port 6001` is the command to run Storybook on port `6001`

`--no-open` tells Storybook to not open a browser window when it starts.

So, all that means we're starting a Storybook instance using the configuration found in `.framework-storybooks/.storybook-preact` and we're running it on port `6001` and telling Storybook to skip it's default behavior of opening a browser window.

#### Step 1.b: The other child Storybooks

The example code has 3 other child Storybooks, so we'll need to run those too. They are:

React: `npm run storybook -- --config-dir .framework-storybooks/.storybook-react --port 6002 --no-open`

Svelte: `npm run storybook -- --config-dir .framework-storybooks/.storybook-svelte --port 6003 --no-open`

Vue: `npm run storybook -- --config-dir .framework-storybooks/.storybook-vue --port 6004 --no-open`

#### Step 1.c: Running all child Storybooks in parallel

Putting them together, we'll run all the child Storybooks in parallel using `concurrently`. This is the NPM script we'll use:

```JSON
"sbook-children": "npx concurrently \"npm run storybook -- --config-dir .framework-storybooks/.storybook-preact --port 6001 --no-open\"  \"npm run storybook -- --config-dir .framework-storybooks/.storybook-react --port 6002 --no-open\" \"npm run storybook -- --config-dir .framework-storybooks/.storybook-svelte --port 6003 --no-open\" \"npm run storybook -- --config-dir .framework-storybooks/.storybook-vue --port 6004 --no-open\"",
```

Running `npm run sbook-children` will start all the child Storybooks in parallel. We use `npx` instead of `npm` so we can avoid adding `concurrently` as a dependency.

### Step 2: Run the parent Storybook

We do not want to start the parent Storybook until all the child Storybooks are running and viewable in browser.

#### Step 2.a: The parent Storybook

The main composed Storybook is configured like a normal Storybook within the `.storybook` directory. The only addition is the [`refs.js` file](https://github.com/storydocker/storydocker-examples/blob/main/experimental/astro-framework-multiple/.storybook/refs.js) which is imported by `main.js` and contains the references to the child Storybooks. The contents of `refs.js` are:

```
export default {
  "astro_preact": {
    "title": "preact",
    "url": "http://localhost:6001",
  },
  "astro_react": {
    "title": "react",
    "url": "http://localhost:6002",
  },
  "astro_svelte": {
    "title": "svelte",
    "url": "http://localhost:6003",
  },
  "astro_vue": {
    "title": "vue",
    "url": "http://localhost:6004",
  },
}
```

#### Step 2.b: Waiting on one child Storybook

We'll use `wait-on`, an NPM module which stops Node from continuing a process until a condition is met. In this case, `wait-on` is going to check for each `localhost` port to be open before continuing. ([wait-on on npmjs](https://www.npmjs.com/package/wait-on))

This command: 

`npx wait-on http://localhost:6001`

will wait until `localhost:6001` is open and returns a `2xx` response before continuing. 

Port `6001` is the Storybook for Preact.

#### Step 2.c: Waiting on all child Storybooks

We'll be adding a double-ampersand in between each localhost check, which means `wait-on` will wait for each port _sequentially_. After all the `wait-on`s, we'll start Storybook with `npm run storybook`.

The following NPM script will wait for all the child Storybooks to be open before continuing to open the parent Storybook.

```JSON
"sbook-parent": "npx wait-on http://localhost:6001 && npx wait-on http://localhost:6002 && npx wait-on http://localhost:6003  && npx wait-on http://localhost:6004 && npm run storybook",
```

### Step 3: Single command to run all Storybooks

Using `concurrently` again, we'll run both the child and parent NPM scripts:

`npx concurrently "npm run sbook-children" "npm run sbook-parent"`

and the NPM script in package.json:

```JSON
"sbook": "npx concurrently \"npm run sbook-children\" \"npm run sbook-parent\""
```

### Step 4: Profit!

Happy coding folks!