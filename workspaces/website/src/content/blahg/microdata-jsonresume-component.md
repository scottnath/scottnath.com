---
title: "How about a JSON Resume web component with configurable microdata?"
description: "Introduction to the jsonresume-component module, a web component to display your JSON Resume documented with microdata"
pubDate: "2024-05-17"
updatedDate: "2024-06-24"
heroImage: "/blahg-assets/jsonresume/jsonresume-component.png"
heroImageDesc: 'Article header image shows a piece of HTML, specifically <json-resume>'
---

Introducing `jsonresume-component`, a web component which displays your resume, with microdata, theming, slots, and remote fetching of your JSON Resume resume.json file. 

## tl;dr

`jsonresume-component` is a Web Component that generates your resume with microdata following the [Schema.org][schemaorg] vocabulary set. It's custom element is `<json-resume>` and it fetches a `resume.json` file following the [JSON Resume][jsonresume] schema to create your resume. HTML is created from using the [jsonresume-theme-microdata][jtm] theme, creating a resume documented with microdata following the [Schema.org][schemaorg] vocabulary set.

* [`jsonresume-component` on GitHub][jc]
* [combined `jsonresume-component` and `jsonresume-theme-microdata` storybook][jc-sb]
* [example of a resume within a website UI][my-resume]

### snippet:

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://esm.run/lit",
      "@lit/task": "https://esm.run/@lit/task"
    }
  }
</script>
<script type="module">
  import 'https://esm.run/jsonresume-component'
</script>
<json-resume gist_id="54682f0aa17453d46cdc74bdef3172a3"></json-resume>
```

## Prerequisites

* You have your resume in a JSON file following the JSON Resume schema structure

## Quick primer: How we got here

This web component is built using the HTML-generating functionality of the module [jsonresume-theme-microdata][jtm]. That module is a [JSON Resume][jsonresume] theme which is the subject of the article ["Make your resume SEO friendly using JSON Resume with microdata"][microdata-jsonresume]. The underlying concepts of microdata and HTML were broken down in ["How to Boost SEO by Enhancing HTML with Microdata"][microdata-html].

## How to implement `<json-resume>` in node

### install dependencies

```sh
npm i lit @lit/task jsonresume-component
```

### Usage

General usage

```javascript
import { JsonResume } from 'jsonresume-component';
```

```html
<JsonResume gist_id="9e7a7ceb9425336c6aa08d58afb63b8d"></JsonResume>
```

## How to implement the `<json-resume>` web component in HTML

### include `lit` dependencies

`<json-resume>` uses [`lit`](https://lit.dev) and [`@lit/task`](https://lit.dev/docs/data/task/) which must be imported into your HTML file. You can include dependencies with an [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap), pulling them from a CDN:

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://esm.run/lit",
      "@lit/task": "https://esm.run/@lit/task"
    }
  }
</script>
```

### Add jsonresume-component

```html
<script type="module">
  import 'https://esm.run/jsonresume-component'
</script>
```

### Using just a `gist` id

This option automates fetching your `resume.json` file from a GitHub gist. The gist must have a file called `resume.json` in it.

```html
<json-resume gist_id="9e7a7ceb9425336c6aa08d58afb63b8d"></json-resume>
```

**check out this stackblitz for examples with `slots`, alternative stylesheets, and a local `resume.json`**

<iframe width="100%" height="400" src="https://stackblitz.com/edit/json-resume?embed=1&file=index.html&view=preview&initialpath=index.html"></iframe>


## Conclusion

At the risk of recreating the [detailed configuration docs in the `jsonresume-component` readme][jc], let's stop there. The repo contains an [examples](https://github.com/scottnath/jsonresume-component/tree/main/examples/browser) directory for stackblitzin or wherever you open your examples.

**Important reminder**: this is not just your resume in a web component! It's also microdata! Check out the [results from the Google Rich Results Test](https://search.google.com/test/rich-results/result?id=ctWocdt--8-0Kq5JFMb9tA) for [the resume on my website][my-resume].


[jc]: https://github.com/scottnath/jsonresume-component
[jc-sb]: https://main--6632f42ef9bacea464588c02.chromatic.com
[microdata-html]: /blahg/microdata-with-html/
[microdata-jsonresume]: /blahg/microdata-with-jsonresume/
[my-resume]: /resume/
[jsonresume]: https://jsonresume.org
[jsonresume-schema]: https://github.com/jsonresume/resume-schema/blob/master/schema.json
[jsonresume-project]: https://jsonresume.org/projects/
[jtm]: https://github.com/scottnath/jsonresume-theme-microdata
[jtm-example]: https://github.com/scottnath/jsonresume-theme-microdata/TBD___
[jte]: https://github.com/rbardini/jsonresume-theme-even
[schemaorg]: https://schema.org
