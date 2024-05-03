---
title: "Make your resume SEO friendly using JSON Resume with microdata"
description: "How to generate your resume with schema.org vocabulary HTML markup using JSON Resume"
pubDate: "2024-05-02"
heroImage: "/blahg-assets/jsonresume/microdata-with-jsonresume.avif"
heroImageDesc: 'Article header image shows a portion of a resume with the name Scott Nath and a subheading of the title of this article. The other side of the image shows a screenshot of the schema validator output for the resume section'
---

How to generate a resume which incorporates structured data, allowing your resume to be understood by search engine crawlers and other machines.

## tl;dr

Using [JSON Resume][jsonresume] with the [jsonresume-theme-microdata][jtm] theme will create a resume documented with microdata following the [Schema.org][schemaorg] vocabulary set.


## Prerequisites

* You skimmed [How to Boost SEO by Enhancing HTML with Microdata][microdata-html] or you know how to add microdata to HTML
* You know what **objects** and **arrays** are in programming
* You have [a general understanding of JSON Schema](https://json-schema.org/understanding-json-schema)

## Quick Tech Primer

This was originally one article, but I couldn't easily write about adding structured data to JSON Resume without explaining structured data itself. So...it's now a series and this article is gonna focus on adding microdata to your resume using the open source JSON Resume schema. There's a 3rd one, but I'm still cooking it.

### What is structured data, microdata, Schema.org vocabulary?

See [How to Boost SEO by Enhancing HTML with Microdata][microdata-html] for details. The article includes code examples and schema output. 

#### Cliff notes:

* structured data? web 3-ish: [Google explains structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
* Schema.org? Founded by Google, Microsoft, Yahoo and Yandex: [Schema.org][schemaorg] 
* Schema.org Vocabulary? common content Types and property names: [the **Person** type][schemaorg-person], [the **Article** type][schemaorg-article]
* microdata? [micridata primer](https://en.wikipedia.org/wiki/Microdata_(HTML)#Global_attributes), [YouTube: Microdata vs JSON-LD: Which Structured Data Format Wins?](https://youtu.be/Yj8ujUfAJM8)
* microdata in HTML? see 1st article and the [Schema.org microdata usage guide][schemaorg-started]
* microdata validation? [Schema.org's validator][schemaorg-val], [Google's Rich Results Test][rrr]


### What is JSON Resume?

To explain adding structured data to HTML, it made sense to use a commonly-known set of data. JSON Resume fits that bill and gave me a great reason to update the HTML of my resume.

If you're unfamiliar with JSON Resume, it's core-premise is creating a standard data structure for a resume's content. The JSON in "JSON Resume" refers to the JSON schema which details the expected data structure of each piece of data. 

Basically it's a detailed content-model of commonly-used resume content which has been open-sourced and widely adopted.

* [JSON Resume website: jsonresume.org][jsonresume] - to dig deeper
* [the JSON Resume schema][jsonresume-schema] - to see our content model
* [JSON Resume themes](https://jsonresume.org/themes/) - 400+ themes available!
* [JSON Resume tools/projects][jsonresume-project] - resume editors, LinkedIn resume converters, validators, pdf exports, etc

#### JSON Resume example

Here is [my resume.json file in a GitHub gist][myresumejson] which is then combined with a JSON Resume theme and served up via the free and open-source JSON-resume-as-a-service here: [registry.jsonresume.org/scottnath?theme=even](https://registry.jsonresume.org/scottnath?theme=even)

<figure>

![Image has four examples of JSON Resume themes styling Scott Nath's resume][img-themes]

  <figcaption>resumes styled by themes, theme names left to right: `kendall`, `mantra`, `even`, `stackoverflow`</figcaption>
</figure>

### What is `jsonresume-theme-microdata`?

[jsonresume-theme-microdata][jtm] is a JSON Resume theme. It looks pretty much like the ⬆️ third one in the image above.

It is distributed as an npm package and is a fork of [jsonresume-theme-even][jte]. The `jsonresume-theme-microdata` version has the same styles as `jsonresume-theme-even` (for the most part). The main differences is the `microdata` fork has some HTML changes and the addition of `microdata` throughout the HTML.

Luckily, the `even` theme already had good semantic HTML structure, so not tons of HTML changes - mostly converting sections to use description lists. DL's are my jam - a totally underused set of elements.

See [this basic example usage][jtm-example] in the examples directory in the [`jsonresume-theme-microdata` github repo][jtm]


## Explainer: adding **structured data** to a JSON Resume theme

A breakdown of how I adjusted the HTML and microdata. 

This is just a subset of the changes - [the JSON Resume schema][jsonresume-schema] is pretty big.

### Step 1: Look at two similar, but different sections

`basics` is all the metadata about you, the person, so name, phone, label ("e.g. Web Developer"), image, etc.

`work` is your work history

`volunteer` is your volunteer history

The similarities between `volunteer` and `work` are that you spent time at an organization, and that you had a position there. Here is the relevant subset of the data, using the JSON Resume schema structure.

```json
{
  "basics": {
    "name": "Scott Nath",
  },
  "work": [
    {
      "name": "Company ABC",
      "description": "...company description...",
      "position": "Software developer",
      "summary": "...details about position...",
    },
    {
      "name": "Company Meow",
      "position": "Sitting",
    },
  ],
  "volunteer": [
    {
      "name": "Company 501c3",
      "position": "Software developer for free",
      "summary": "...details about position...",
    }
  ]
}
```

### Step 2: Write semantic HTML which matches the resume data hierarchy

Making an `article` with `h1` cause a resume on a page should be the main document.

```html
<article>
  <h1>Scott Nath</h1>
  <section>
    <h2>Work History</h2>
    <article>
      <h3>Company ABC</h3>
      <p>...company description...</p>
      <h4>Software developer</h4>
      <p>...details about role...</p>
    </article>
    <article>
      <h3>Company Meow</h3>
      <h4>Sitting</h4>
    </article>
  </section>
  <section>
    <h2>Volunteer History</h2>
    <article>
      <h3>Company 501c3</h3>
      <h4>Software developer for free</h4>
      <p>...details about role...</p>
    </article>
  </section>
</article>
```

### Step 3: Add microdata, using Schema.org types

A resume describes a person, so the primary `itemscope` of your resume will be [schema.org/Person][schemaorg-person]. For both `volunteer` and `work`, the person needs to connect to them in the structured data, so they are an alimni of the orgs: [schema.org/alumniOf][schemaorg-alumniOf]. `alumniOf` is a property of `Person`

The organization for both types would have `itemscope` [schema.org/Organization][schemaorg-org], but `Organization` has a lot of specific Types available on top of it - `Airline`, `LocalBusiness`, `NGO`, `EducationalOrganization` - but since that specificity is hard to automate, for now the `microdata` theme labels all these an `Organization` Type.

The position is something that happened _inside_ the organization. Here the semantic HTML aligns great with the schema.org Types! (yes, a `section` was added...but...still semantic!) To connect the position is itemprop `employee`. Then, to describe the employee, we're using a more specific Type of Person, `EmployeeRole`.


```html
<article itemscope itemtype="https://schema.org/Person">
  <h1 itemprop="name">Scott Nath</h1>
  <section>
    <h2>Work History</h2>
    <article itemprop="alumniOf" itemscope itemtype="https://schema.org/Organization">
      <h3 itemprop="name">Company ABC</h3>
      <p itemprop="description">...company description...</p>
      <section itemprop="employee" itemscope itemtype="https://schema.org/EmployeeRole">
        <h4 itemprop="roleName">Software developer</h4>
        <p itemprop="description">...details about role...</p>
      </section>
    </article>
    <article itemprop="alumniOf" itemscope itemtype="https://schema.org/Organization">
      <h3 itemprop="name">Company Meow</h3>
      <section itemprop="employee" itemscope itemtype="https://schema.org/EmployeeRole">
        <h4 itemprop="roleName">Sitting</h4>
      </section>
    </article>
  </section>
  <section>
    <h2>Volunteer History</h2>
    <article itemprop="alumniOf" itemscope itemtype="https://schema.org/Organization">
      <h3 itemprop="name">Company 501c3</h3>
      <section itemprop="employee" itemscope itemtype="https://schema.org/EmployeeRole">
        <h4 itemprop="roleName">Software developer for free</h4>
        <p itemprop="description">...details about role...</p>
    </article>
  </section>
</article>
```

### Step 4: Validate your microdata to output the data

Using [validator.schema.org][schemaorg-val], we can copypasta the HTML above and below is the validator output. 

<pre>
Person
  @type	Person
  name	Scott Nath
  alumniOf	
    @type	Organization
    name	Company ABC
    description	...company description...
    employee	
      @type	EmployeeRole
      roleName	Software developer
      description	...details about role...
  alumniOf	
    @type	Organization
    name	Company Meow
    employee	
      @type	EmployeeRole
      roleName	Sitting
  alumniOf	
    @type	Organization
    name	Company 501c3
    employee	
      @type	EmployeeRole
      roleName	Software developer for free
      description	...details about role...
</pre>

## Other fun data structues that were added

Here's a few of the other data types that came out as interesting ways to connect to Person

### basics.profiles is all your social network profiles

These I chose [ContactPoint](https://schema.org/ContactPoint) as the Type, making HTML like:

```html
<dl>
  <div itemprop="ContactPoint" itemscope="" itemtype="https://schema.org/ContactPoint">
    <dt itemprop="contactType">Mastodon</dt>
    <dd data-network="Mastodon">
      <a href="https://mastodon.social/@scottnath" itemprop="url">
        <span itemprop="identifier">scottnath@mastodon.social</span>
      </a>
    </dd>
  </div>
  <div itemprop="ContactPoint" itemscope="" itemtype="https://schema.org/ContactPoint">
    <dt itemprop="contactType">DEV</dt>
    <dd data-network="DEV"><a href="https://dev.to/scottnath" itemprop="url"><span itemprop="identifier">scottnath</span></a></dd>
  </div>
</dl>
```

which ends up with this structure:

<pre>
Person
  @type	Person
  name	Scott Nath
  contactPoint	
    @type	ContactPoint
    contactType	Mastodon
    url	https://mastodon.social/@scottnath
    identifier	scottnath@mastodon.social
  contactPoint	
    @type	ContactPoint
    contactType	DEV
    url	https://dev.to/scottnath
    identifier	scottnath
</pre>

### I added specificity with `skills` to allow `itemtype`

Here's a couple  `skills` from my resume.json:

```json
  "skills": [
    {
      "level": "Senior",
      "name": "Languages",
      "itemtype": "ComputerLanguage",
      "keywords": [
        "Javascript",
        "Typescript",
        "CSS",
        "HTML",
        "Bash/Shell",
        "Gherkin",
        "Python",
        "PHP"
      ]
    },
    {
      "level": "Senior",
      "name": "UI Components",
      "itemtype": "SoftwareSourceCode",
      "keywords": [
        "Web Components",
        "VueJS",
        "Lit",
        "Sass",
        "HandlebarsJS",
        "ReactJS",
        "AngularJS"
      ]
    },
  ]
```

which came out as very interesting structured data in that it's nice to have information about me labeled like this in the wild:

<pre>
Person
  @type	Person
  name	Scott Nath
  knowsAbout	
    @type	ComputerLanguage
    description	Languages
    name	Javascript
    name	Typescript
    name	CSS
    name	HTML
    name	Bash/Shell
    name	Gherkin
    name	Python
    name	PHP
  knowsAbout	
    @type	SoftwareSourceCode
    description	UI Components
    name	Web Components
    name	VueJS
    name	Lit
    name	Sass
    name	HandlebarsJS
    name	ReactJS
    name	AngularJS
</pre>

**kewl!!**

## This is long, let's stop

Thanks for reading. If you'd like to see the full data model extracted from my resume [here is the Google Rich Results Test](https://search.google.com/test/rich-results/result?id=ukiyrbatK8G5K_ESOPBSBg) which shows all the data extracted from my resume using the `jsonresume-theme-microdata` theme.

Cheers!

[microdata-html]: /blahg/microdata-with-html/
[jsonresume]: https://jsonresume.org
[jsonresume-schema]: https://github.com/jsonresume/resume-schema/blob/master/schema.json
[jsonresume-project]: https://jsonresume.org/projects/
[jtm]: https://github.com/scottnath/jsonresume-theme-microdata
[jtm-example]: https://github.com/scottnath/jsonresume-theme-microdata/TBD___
[jte]: https://github.com/rbardini/jsonresume-theme-even
[schemaorg]: https://schema.org
[schemaorg-started]: https://schema.org/docs/gs.html
[schemaorg-person]: https://schema.org/Person
[schemaorg-article]: https://schema.org/Article
[schemaorg-org]: https://schema.org/Organization
[schemaorg-author]: https://schema.org/author
[schemaorg-alumniOf]: https://schema.org/alumniOf
[schemaorg-val]: https://validator.schema.org
[myresumejson]: https://gist.github.com/scottnath/9e7a7ceb9425336c6aa08d58afb63b8d
[rrr]: https://search.google.com/test/rich-results
[img-themes]: /blahg-assets/jsonresume/jsonresume-theme-examples.avif