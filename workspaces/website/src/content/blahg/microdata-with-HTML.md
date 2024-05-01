---
title: "How to Boost SEO by Enhancing HTML with Microdata"
description: "Boost SEO with microdata in HTML. Gain better visibility, higher click-through rates, and improved indexing. Includes code examples and schema output."
pubDate: "2024-05-01"
heroImage: "/blahg-assets/microdata-html--boost-seo-schema.org-validator.avif"
heroImageDesc: 'Article header image shows the output from the Schema.org validator for an Article with the same headline and summary as this article'
---

## tl;dr

I've been re-writing the HTML of my site and added **structured data**, in the form of microdata attributes, following the [Schema.org][schemaorg] vocabulary set. Structured data can be understood by search engines and other machines, giving your content structure and context. 

The following is what I've learned so far, with some code examples.


## Prerequisites

<p itemprop="dependencies">You understand HTML</p>

## What is all this technology?

There are a few different technologies involved, but in general this is about how to include **strucuted data** in your HTML markup. Structured data falls under the **semantic web** label which rolls up into the new hotness of Web 3.0. This article is not about Web 3.0, I'm only at the what-I-read-on-wikipedia level of knowledge about the next web. This article will focus on microdata, Schema.org vocabulary and how to add it to your HTML.

Here's some short bits about each of those, with links to learn more. 

### What is structured data?

There is a vast amount of information out there about **structured data** and this article is more of a _how_ than a _what_. Brevity is the soul of wit and all that, so I'll (try to) be brief and give you links to dive deeper. To shortcut "what is structured data", lemme just reference this article: [Google explains structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data), which is an _excellent_ primer on the subject. Low on time? Just watch the 1st video in the article for a great sum-up.

My sum-up: **structured data** is a way to include machine-readable key-value versions of the content on your page alongside (or integrated with) your HTML markup.

### What is the semantic web?

In short - a machine-readable internet. 

More details are out-of-scope for this article. [This Smashing Mag article](https://www.smashingmagazine.com/2020/10/developing-semantic-web/) has a nice primer with charts and stuff.

### What is Schema.org? What is their vocabulary?

The term "vocabulary" means the names and expected structure of each type of data. 

Founded by Google, Microsoft, Yahoo and Yandex, [Schema.org][schemaorg] vocabularies are developed by an open community process. e.g. the largest search providers got together and came up with a shared way to document content on the web.

The concept is that a shared vocabulary makes it easier for webmasters and developers to decide on a schema and get the maximum benefit for their efforts. The benefit being, web developers can document their content with data structures that work across all the major search players.

**huge caveat:** <em>this helps search engine **accuracy**, it does not help ranking</em>. (this disclaimer is repeated across all the Search Engines' docs about structued data)

* [Schema.org][schemaorg]
* [microdata usage guide][schemaorg-started]
* [example: the **Person** type][schemaorg-person]
* [example: the **Article** type][schemaorg-article]

#### Schema.org type inheritance

The Schema.org vocabulary is made up of "types" which build upon each other with ever-more increasing specificity in properties. The most root type is the [Thing type][schemaorg-thing]. **Thing** contains a set of generic properties like name, url, description. All other types generally derive from Thing. Person, Place, Action, etc. - they all fall under Thing which means they all automatically have the Thing properties (name, url, etc) and add their own on top. 

For instance, the [Article type][schemaorg-article] is a superset of the [Creative Work type][schemaorg-cw]. **Creative Work** adds a ton of properties on top of Thing, such as author, about, dateCreated and headline. **Article** then has more properties in addition to what is in Creative Work, such as articleBody, backstory, and wordCount.

## How I chose `microdata` to document my content

To document your data in your HTML, you have four choices: microdata, JSON-LD, RDFa, and microformats

rejected: microformats, due to limited structures and it being more focused on webmentions, not the whole-of-your-content

rejected: RDFa had outdated docs and uses a different vocabulary from schema.org 

So that left microdata and JSON-LD. 

* [jsonld.com: Why JSON-LD?](https://jsonld.com/why-json-ld/)
* [micridata primer](https://en.wikipedia.org/wiki/Microdata_(HTML)#Global_attributes)
* 8 minutes that explain the difference: [YouTube: Microdata vs JSON-LD: Which Structured Data Format Wins?](https://youtu.be/Yj8ujUfAJM8)

### JSON-LD

A fairly common argument for JSON-LD says that JSON-LD is easier to maintain due to not being directly tied to HTML structure. You just create your data-mapping and when your system is writing your pages, it also writes the JSON-LD. 

Downside? That duplicates all your content into `<script>` tags. It also requires you to write or manage a system to generate them (since it is separate from your HTML). If you have unknown data or hand-written HTML, it's harder to add and maintain.

Upside? Lots of plugins and tools our there to automate adding JSON-LD. (doesn't help me on [scottnath.com][sn] because I do a lot of one-off HTML and I mostly don't use a CMS)

### Microdata (spoiler alert: I chose this)

Microdata is added, mostly, by adding attributes to your HTML elements.

I added microdata across [scottnath.com][sn] where using microdata made sense because I was writing the HTML in bespoke little components. It was fairly simple to add to my pages because I already use semantic HTML, and microdata expects your HTML to reflect the structure of your content. 

It also doesn't add a whole lot of new stuff, for instance, the title on my articles went from this:

`<h1>{title}</h1>`

to this:

`<h1 itemprop="headline">{title}</h1>`

Pretty easy to add!

FYI - I initially started this work wanting to write HTML for JSON Resume which conformed more stringently to a resume's hierarchical content. HTML is a programming language after all. That work is coming in next article - a semantic JSON Resume!


## How to add microdata to HTML

Did you know that HTML already has global attributes _specifically_ for including microdata? 

These attributes can go on most HTML elements and they follow a specific structure in their usage. The three you'll most often use are:

* [itemscope](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemscope)
* [itemtype](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemtype)
* [itemprop](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop)

There is also [itemref](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemref) and [itemid](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemid), but those won't be used in this tutorial.

### `itemscope` and `itemtype`

These both are always together on a container element, although some examples show just using `itemscope`, but without `itemtype` the `itemscope` just denotes that everything contained within that element is related to the scope. For this learning, we only care about documenting our content for SEO, so we need `itemtype` to point to a type at schema.org to know what the `itemscope` is documenting.

*Scope* in this case, means a related chunk of content. When parsing microdata within an HTML element with the boolean `itemscope` attribute, it is expected that every `itemprop` inside that element falls under _scope_ of `itemscope`.

`itemtype` is always a URL. In this case, a URL to a schema.org type. So, if you had an article with a title and summary, it would match the [schema.org Article type][schemaorg-article] and your HTML container would be like so:

```html
<article itemscope itemtype="https://schema.org/Article">
  ...article contents
</article>
```

* `itemscope` is boolean, so it is _never_ `itemscope="meow"`
* `itemtype` denotes what _type_ of content is being described by pointing to the documentation about that type

### `itemprop`

`itemprop` adds properties to a scope. 
e.g. it adds data that is a subset of it's main `itemscope`
e.g. if `itemscope` is an _object_, `itemprop` is a _property_ on that _object_

Assuming this is the main article on a page, the title should be the top heading, an `<h1>`. The properties of an article are detailed on the [schema.org Article type page][schemaorg-article] From that type, we'll be using `headline`, a property inherited from [Creative Work][schemaorg-cw] and expected to be `Text` (plain text) and described as "Headline of the article." With `itemprop`, our HTML becomes:

```html
<article itemscope itemtype="https://schema.org/Article">
  <h1 itemprop="headline">An important article about things</h1>
</article>
```

Adding in a main article image, we can document that as well. We'll be using `image`, which is part of [Thing][schemaorg-thing]. Remember, the hierarchy goes Thing->Creative Work->Article in order to know the properties available.

```html
<article itemscope itemtype="https://schema.org/Article">
  <h1 itemprop="headline">An important article about things</h1>
  <img src="https://example.com/image.jpg" itemprop="image" />
</article>
```

#### What data do we know so far?

This would be the output when reading our microdata:

<pre>
Article
  @type     Article
  headline  An important article about things
  image     https://example.com/image.jpg
</pre>

### `itemprop` which is an `itemscope`

This is the **structure** part of structured data. 

Let's add an author! Under the Creative Work type, there is a property `author` ([schema.org/author][schemaorg-author]), but it must be either a Person type or Organization type. These can only be documented via an `itemscope`. The author will be a [schema.org/Person][schemaorg-person], which means we can have lots of author-specific properties documented.

```html
<article itemscope itemtype="https://schema.org/Article">
  <h1 itemprop="headline">An important article about things</h1>
  <img src="https://example.com/image.jpg" itemprop="image" />
  <p itemprop="author" itemscope itemtype="https://schema.org/Person">
    Written by 
    <a itemprop="url" href="https://example.com">
      <span itemprop="name">Scott Nath</span>,
      <span itemprop="jobTitle">Open Source Developer</span>
    </a>
  </p>
</article>
```

#### What do we know from the above HTML?

Author has been added as it's own section and has sub-properties:

<pre>
Article
  @type     Article
  headline  An important article about things
  image     https://example.com/image.jpg
  author
      @type     Person
      url       https://example.com/
      name      Scott Nath
      jobTitle	Open Source Developer
</pre>

## How to parse-out and validate your microdata

Sure you added microdata, but how do you check it?

There are two main validators, [Schema.org's validator][schemaorg-val] and [Google's Rich Results Test][rrr]. 

They both accept a URL or a snippet of HTML, parse the HTML, then return whatever data it could find. The difference is Google's only parses a subset of the Schema.org vocabulary - the rest of your microdata will be ignored by Google. Both returned the same results for our HTML snippet from above.

### Google Rich Results Test

**[search.google.com/test/rich-results][rrr]**

Google recommends that you start with the Rich Results Test to see what Google rich results can be generated for your page. You'll need to reference [Google's list of structured data types they support][google-supported-types], which is a _subset_ of the Schema.org types. If the type you use ain't on Google's list, it ain't gonna get read by Google (the other search engines will read it tho.)

![Screenshot image shows the Rich Results Test output for the Article HTML snippet][img-google-validator]

### Schema.org validator

**[validator.schema.org][schemaorg-val]**

For generic schema validation, use the Schema Markup Validator to test all types of schema.org markup, without Google-specific validation. 

![Screenshot image shows the Schema.org validatory output for the Article HTML snippet][img-schema-validator]


## Not The End

So that's a high-level overview of how and why to add microdata to your HTML. I added microdata across my site but so far, my findings are inconclusive on how it helps with SEO. It takes a while for crawlers to fully index, so hopefully after I've written the article on JSON Resume with microdata, I'll have some kinda noticeable outcome. Stay tuned!



[img-google-validator]: /blahg-assets/metadata-html--article-rich-results.avif
[img-schema-validator]: /blahg-assets/metadata-html--article-validator.schema.org-results.avif
[jsonresume]: https://jsonresume.org
[jsonresume-schema]: https://github.com/jsonresume/resume-schema/blob/master/schema.json
[jsonresume-project]: https://jsonresume.org/projects/
[jtm]: https://github.com/scottnath/jsonresume-theme-microdata
[schemaorg]: https://schema.org
[schemaorg-started]: https://schema.org/docs/gs.html
[schemaorg-person]: https://schema.org/Person
[schemaorg-article]: https://schema.org/Article
[schemaorg-author]: https://schema.org/author
[schemaorg-thing]: https://schema.org/Thing
[schemaorg-cw]: https://schema.org/CreativeWork
[schemaorg-val]: https://validator.schema.org
[myresumejson]: https://gist.github.com/scottnath/9e7a7ceb9425336c6aa08d58afb63b8d
[rrr]: https://search.google.com/test/rich-results
[sn]: https://scottnath.com
[google-supported-types]: https://developers.google.com/search/docs/appearance/structured-data/search-gallery?hl=en