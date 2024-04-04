---
title: "StoryDocker: Storybook, but it's a microservice"
description: "StoryDocker is an open-source tool which allows local Storybook development without dependencies by leveraging docker containers"
pubDate: "2023-04-10"
heroImage: "./blahg-assets/storydocker-underwater.avif"
---

Problem: your UI application is complicated and requires a lot of dependencies, but you also need to use [Storybook](https://storybook.js.org/docs/html/get-started/why-storybook) to prototype, test, and collaborate with non-technical folks.

Solution: A full-featured Storybook development environment without all those pesky dependencies!

## tl;dr

StoryDocker is an open-source tool which allows local Storybook development without dependencies by leveraging docker containers

* [StoryDocker on GitHub](https://github.com/storydocker/storydocker)
* Multiple [StoryDocker examples](https://github.com/storydocker/storydocker-examples) including React, Vue, Svelte, Lit, and vanilla/no-framework

## Why Storybook as a microservice?

A NodeJS application's dependencies are time-consuming to maintain. Your app probably has a bunch of dependencies too - for app-building, connecting to your back-end, external component libraries, all the devOps doo-dads, it can get _big_. 

A typical setup to implement Storybook will add a whole stack of new dependencies that have nothing to do with your app! Sometimes Storybook's dependencies will fight with your app's dependencies...in which case, you may go without Storybook features, reducing it's usefulness.

A popular solution for implementing Storybook for a large app is giving it a separate workspace in a monorepo. But that Storybook instance is tied to that repo - so if you have other UI repos you maintain, they'll need their own Storybook workspace. [Nx has some excellent monorepo+Storybook solutions](https://nx.dev/recipes/storybook) but those require all your micro-frontends and UI apps to be in the one monorepo - not ideal if you have a lot of cooks in that kitchen.

Removing Storybook's implementation from your application's environment reduces overhead and dependency overload. Making it a microservice allows it to be used when it's needed and stay out of the way when it's not.

## How StoryDocker works

StoryDocker internally creates a very basic monorepo using out-of-the-box [npm workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces). The Storybook setup is contained in it's own workspace and includes dependencies for Storybook implementations that generate dev environments for React, Vue, Svelte, Lit, and/or non-js-frameworks applications. Currently it only works for apps which use Vite as their builder. 

StoryDocker generates [a docker image](https://github.com/storydocker/storydocker/pkgs/container/storydocker) available via GitHub's Container registry. This docker image can be combined with your app using a `Dockerfile` and a `docker-compose.yml` file.

Full instructions available in [StoryDocker's `getting started` section](https://github.com/storydocker/storydocker#getting-started)

## How to use StoryDocker with your UI

The best way is to checkout the StoryDocker getting started instructions or to dig through or directory any of the [StoryDocker examples](https://github.com/storydocker/storydocker-examples). The example apps include React, Vue, Svelte, Lit, and vanilla/no-framework implementations. Copy the directory and run `docker compose up` and you're good to go.

It should work great for any app that uses Vite and any of the listed frameworks. It's a fast way to get a Storybook instance quickly attached to your application.

## You should steal the concept tho

StoryDocker is a catch-all to add Storybook to a wide range of apps quickly. It was made using the default scaffolding tools from Storybook and Vite. It uses an extremely basic monorepo, with a simple npm-workspaces structure. It is easy to duplicate.

Your organization might want more/different features beyond what StoryDocker provides, you might need older/different versions of things, or you just don't want to be dependent on another external library - so I encourage you to copy the concept and add your own spin. Extracting a dependency-heavy setup from your current app environment, while still retaining all it's features, can save tons of time and money.