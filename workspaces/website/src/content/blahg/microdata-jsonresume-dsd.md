---
title: "How to Add Declarative Shadow DOM to a LitElement Web Component"
description: "Converting a LitElement web component to allow Server Side Rendering using Declarative Shadow DOM"
pubDate: "2024-06-06"
heroImage: "/blahg-assets/jsonresume/jsonresume-component-ssr-dsd.avif"
heroImageDesc: 'Article header image shows the words "Server-Side Rendering a Declarative Shadow DOM with LitElement"'
---

This article breaks down the steps I took to split up a LitElement web component to allow Server Side Rendering by generating the HTML and CSS via Declarative Shadow DOM

## tl;dr

I split `<json-resume>` into two, adding `<json-resume-ui>` which can be server-side rendered when given a stylesheet and a `resume.json` object. `<json-resume>` extends `<json-resume-ui>`.


## Prerequisite: What is the `<json-resume>`?

This article is about splitting a LitElement up to allow rendering on a server, but the vehicle-for-understanding is the `<json-resume>` component.

The `jsonresume-component` package distributes a set of web components used to generate your resume from a JSON file following the [JSON Resume][jsonresume] schema and includes HTML-based microdata following the [Schema.org][schemaorg] vocabulary set. The HTML is created from using the [jsonresume-theme-microdata][jtm] theme, creating an HTML-based resume documented with microdata.

* [article: "How about a JSON Resume web component with configurable microdata?"][jc-art]
* [`jsonresume-component` on GitHub][jc]
* [combined `jsonresume-component` and `jsonresume-theme-microdata` storybook][jc-sb]
* [example of a resume within a website UI][my-resume]

## Why did I need a Declarative Shadow DOM feature?

There was a brief blankness on page load of my resume. The `<json-resume>` component first had to retrieve the `resume.json` data and generate the HTML. No bueno. 

This hesitation on the client-side slowed the page speed, created a momentary emptiness on page-load and was unnecessary since I could just feed the component the `resume.json` object instead of retrieving it externally. The problem came because retrieving the `resume.json` requires javascript running on the client. 

I needed the full HTML and CSS of the resume to be pre-rendered and included in the static HTML sent to the browser. 

## What options are there to Server-Side Render a web component?

Your Node.js environment probably doesn't know about `HTMLElement`, making pre-generating web components tricky in general. But, the Lit Labs folks have created a [LitElement SSR package](https://lit.dev/docs/ssr/client-usage/) which generates static HTML for the browser to parse and paint without any JavaScript. So that was option one for me.

In my case, when building [scottnath.com](https://scottnath.com), I use [Astro](https://astro.build/) to generate my static pages and upload them to a static web server. Astro has a [lit plugin for SSR][astro-lit] which allows generating `LitElement`-based components on the server. It incorporates the Lit Labs package, so that's what I used.

## What needed to change to allow the component to be rendered on the server?

First I identified the pain-points which delayed rendering on the client. Then I separated out that functionality from the core purpose: an HTML-based resume styled with CSS.

### pain-point 1: retrieving the `resume.json` file

The `<json-resume>` component doesn't actually let users _do_ anything - it is presentation-only. But to present a resume it needs the JSON content object with resume data. It gets this via a `fetch` call to the GitHub API or a URL of a JSON file. 

fix: accept the `resume.json` object as a `property`

### pain-point 2: importing a stylesheet to the LitElement component

Stylesheets on `<json-resume>` can be replaced or extended internally, so they were processed using `CSSStyleSheet`, which is also not generally available when rendering server-side. So now the client 1st downloads the HTML, then runs the `<json-resume>` custom element when it's told by `<json-resume>` to import and process a stylesheet using `CSSStyleSheet`. It's debatable whether waiting on `fetch` or waiting on processing the imported CSS file causes the pause.

fix: contents of a stylesheet `property` are rendered in a `<style>` tag

## What changed in the component

For all the changes, check out the [commit which split the LitElement component into two](https://github.com/scottnath/jsonresume-component/commit/74e66cfcf72ec58614a4a0bdabb79f72eb376cf5). This adds `ui.js` which is a fully server-renderable LitElement component.

### HTML rendering moved to SSR

To fix the first pain-point and generate HTML on the server, we need to separate out the HTML generation. As detaled in ["Make your resume SEO friendly using JSON Resume with microdata"][microdata-jsonresume], the HTML comes from a separate library, [jsonresume-theme-microdata][jtm], so we'll move importing that component and using it's pieces to generate HTML into `ui.js`

We also need to allow directly-injecting a `resume.json` object as a property. This was already an un-documented feature of `json-resume`, so copypasta

### Stylesheet rendered two different ways

`<json-resume>` accepts a stylesheet, which can completely overwrite all internal styles. Both versions allow this, but the client-rendered `<json-resume>` automatically includes a stylesheet, expanding it with adopted stylesheets via `CSSStyleSheet` functionality. The server-renderable `<json-resume-ui>` gets the stylesheet from a `property` and adds it the the HTML in a `<style>` tag.

**note**: The `meta.themeOptions` section of [jsonresume-theme-microdata][jtm] allows changing global colors. Both versions of the component support this functionality.

### Separate `render()` functions

`<json-resume-ui>` extends LitElement, while `<json-resume>` extends `<json-resume-ui>`. They both have different ways to render the component.

`<json-resume>` must first get the JSON file, which is an asynchronos operation and uses a separate package from lit, `@lit/task`.

`<json-resume-ui>` receives the resume object as a property, so it's render function calls a new `_resumeGenerater` function, which determines section order and titles and generates the containing HTML. 

`<json-resume>`'s `render` function is wrapped in an asynchronous task which calls `_resumeGenerater` when it gets the resume content. `<json-resume>` has become a client-side shell which retrieves JSON or styles to then give to `<json-resume-ui>`.

**note:** if using via SSR with a server-located `resume.json` file, you only need `<json-resume-ui>`.

## Server-side rendering a resume with declarative shadow DOM

### install dependencies

```sh
npm i lit jsonresume-component
```

_(does not need `@lit/task` like `JsonResume` does)_

### Usage

You can generate the HTML on the server using the `<json-resume-ui>` component.

```javascript
import { JsonResumeUI } from 'jsonresume-component/ui';
// your resume data
import resumejson from '../local/path/to/resume.json'
// you can use your own stylesheet instead of the bundled one
import styles from 'jsonresume-component/style.css?inline'
```

```html
<JsonResumeUI resumejson={resumejson} stylesheet={styles}></JsonResumeUI>
```

## This should help your Lighthouse scores

Converting this to an SSR-component, without breaking the currently-released version, was important to maintain trust with any folks who might be using this component in their systems. It was also a great mental exercise to remember what should be rendered by a server and when it's ok to give the client a little work to do.

The SSR change helped a lot with my static site's [resume page][my-resume]'s performance score. Hope it helps you too!


[jc]: https://github.com/scottnath/jsonresume-component
[jc-sb]: https://main--6632f42ef9bacea464588c02.chromatic.com
[jc-art]: /blahg/microdata-jsonresume-component/
[jc-commit]: https://github.com/scottnath/jsonresume-component/commit/74e66cfcf72ec58614a4a0bdabb79f72eb376cf5
[jsonresume]: https://jsonresume.org
[astro-lit]: https://docs.astro.build/en/guides/integrations-guide/lit/
[microdata-html]: /blahg/microdata-with-html/
[microdata-jsonresume]: /blahg/microdata-with-jsonresume/
[jtm]: https://github.com/scottnath/jsonresume-theme-microdata
[schemaorg]: https://schema.org
[my-resume]: /resume/