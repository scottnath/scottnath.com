---
title: "Bugfix: Multiple Vite Storybooks from Same node_modules"
description: "Resolving errors that occur when attempting to run multiple instances of Vite-builder Storybooks in the same package."
pubDate: "2023-05-12"
updatedDate: "2024-06-23"
heroImage: "/blahg-assets/bug-screenshot-vite-storybook.avif"
---

## tl;dr

Encountering `Failed to fetch dynamically imported module` or `ENOTEMPTY: directory not empty` errors while running multiple Vite-builder Storybooks in a single package?

In `.storybook/main.[js/ts/tsx]`, add:

```js
  async viteFinal(config) {
    config.cacheDir = path.join(__dirname, '../node_modules/.vite-unique-name')
    return config;
  },
```

Don't forget to add `import path from 'path';` to the top of the file.


## What is this bug?

When running multiple Vite-builder Storybooks in the same repository or package, and each Storybook is built from the same set of `node_modules`, you may see errors like this:

`Failed to fetch dynamically imported module: http://localhost:6001/node_modules/.cache/.vite-storybook/deps/@storybook_preact_preview.js?v=a6ee60c2`

or

`Error: ENOTEMPTY: directory not empty, rename '/Users/.../node_modules/.cache/.vite-storybook/deps_temp...' -> '/Users/.../node_modules/.cache/.vite-storybook/deps'`

or

`ENOENT: no such file or directory, realpath '/Users/.../node_modules/.cache/vite-plugin-externals/@storybook/preview-api.js' [plugin vite:dep-pre-bundle]`

## Why is this bug?

That's a lot of different errors! And while they maybe be caused by a different problem, I have seen them all be caused by a multi-Storybook environment where all Storybooks use Vite builder.

So assuming your error is a bug caused by the Vite-bundler used by Storybook - it's because Vite's setup is not expecting there to be more than one Storybook instance in a repo.

Vite uses a cache directory to store the compiled code required to run Storybook. When multiple Storybooks are built from the same set of `node_modules`, the cache directory is shared between them. This causes the error above and will allow only one instance of Storybook to run at a time.

## How to fix this bug

The default cache directory is `<package-root>/node_modules/.cache/.vite-storybook`. You can change this by setting Vite's `cacheDir` option in your Storybook's `.storybook/main.[js/ts/tsx]` file:

```js
  import path from 'path';
  ... // rest of main Storybook config
  async viteFinal(config) {
    // Ensures that the cache directory is unique
    config.cacheDir = path.join(__dirname, '../node_modules/.vite-unique-name')
    return config;
  },
```

See [Storybook's Vite builder configuration docs](https://storybook.js.org/docs/react/builders/vite#configuration) for more in-depth understanding of how to configure Vite for Storybook.

## Impact of the Fix

This fix gives each Storybook instance a unique cache directory. 

before:

```
node_modules
├── .cache
│   └── sb-manager
│   └── storybook
│   └── vite-plugin-externals
│   └── .vite-storybook
│       ├── deps
```

after:

```
node_modules
├── .cache
│   └── sb-manager
│   └── storybook
│   └── vite-plugin-externals
├── .vite-unique-name
│   ├── deps
```

## Conclusion

I hope this helps you fix your Storybooks! The bugs listed above could definitely be caused by something else, but this idea is def worth a copy-paste-reload attempt 😉.