---
title: "Who Me: Notes on creating a custom Chat GPT"
description: "Some notes on creating a custom Chat GPT that can consistently generate specific styles of characters using Dall-E"
pubDate: "2023-12-01"
updatedDate: "2024-06-24"
heroImage: "/who-me/brady-bunch-who-me-grid.avif"
---

Some notes on creating a custom Chat GPT that can consistently generate specific styles of characters using Dall-E

## tl;dr

### The _Who Me_ custom GPT is public and live now!

https://chat.openai.com/g/g-AJHS0XQ6K-who-me

(requires Chat GPT plus account)

[![Who Me: I make you a Dr. Seuss Who and your friends and pets too!][who-me]](https://chat.openai.com/g/g-AJHS0XQ6K-who-me)


### The #1 trick for consistent image-generating in custom GPTs

Hone your prompt directly with Dall-E first, then make Chat GPT send your _exact_ honed prompt - only allowing CGPT to append extra details. Do this instead of letting Chat GPT write the whole prompt.

**This is absolutely the MAIN takeaway here - figure out what Dall-E needs, then make Chat GPT send _exactly that prompt_.**

---

## Introduction

To gain more knowledge about prompt engineering, I wrote a one-trick-pony custom Chat GPT. 

My GPT does one thing: analyze a user-provided image and generate a new version of the image converting all people and animals into Whos, who are the citizens of Who-ville. 

If you don't know, Who-ville is the central location of the books "[How the Grinch Stole Christmas!][grinch-book]" and "[Horton Hears a Who!](horton-book)" by Dr. Seuss. The Whos are a species of fuzzy, human-esque creatures with snouts and button-like noses. They are depicted in these books, as well as various movies and cartoons. They vary across these mediums, so my goal was to generate Whos as they were depicted in the books.

Whos and Whoville are copyrighted works and OpenAI has some pretty strict content policies in place, so it does not work to say "generate a Who as depicted by Dr. Seuss" - you'll get errors about violating content policy and no images.

## Initial trials

All of my initial trials were in the custom GPT instructions, with a lot of GPT collaboration on how to write the prompt.

### Lesson 1: Don't say "as drawn by Dr. Seuss"

Rightfully so, copyrighted material should not be copied, but it can influence your art. The guardrails that OpenAI has in place are strict in that it won't let you say things like:

* _draw a Who from Who-ville as depicted by Dr. Seuss_
* _create an image of a Who from Who-ville_
* _copy the style of Dr. Seuss and draw one of his Whos_

But it understands the style and works from artists and will generate images inspired by their art. So these kind of phrases are allowed:

* _draw a whimsical creature which reflects the aura of a Who from Whoville_
* _create an image of a fantastical human-like animal similar in features to the race of Whos_
* _embodies the essense of_
* _with a similar whimsical style to_

The difference being I'm using Dr. Seuss' characters as inspiration, not duplicating them.

### Lesson 2: Don't say "Recreate the exact person from this image"

Falling under OpenAI's policy around "_Activity that violates people’s privacy_", if you ask your GPT to copy someone's image directly, it won't do it. The company doesn't want their service used against individuals and without this policy I could ask it to draw someone into a situation they don't want to be a part of. Phrases that got blocked by the content policy:

* _recreate the person in the photo exactly, but give them [feature x]_
* _using the person in the picture, make them a Who, but it must look exactly like them, just as a who_

What _did_ work was having GPT analyze a person to discern attributes like hair, age, clothing, etc. I'll detail how I used this data later.

### Lesson 3: Chat GPT is a lying liar that lies

Having learned Lesson 1 and Lesson 2, I was able to get GPT to generate some images from photos that looked vaguely like Whos, but also like lots of other things. But I _still_ kept getting content policy errors. When asking GPT what caused the error, it kept telling me it could not use peoples images to recreate their likeness.

This was a total lie, it was actually getting errors from Dall-E about copyright. My best guess is it remembered our back and forths to get the "draw this person" phrasing correct and when it got errors from Dall-E, it just barfed out that I was breaking the draw-people rule because it knew what I wanted to do.

Trick 1: Every now and then, refresh the window to clear the GPT memory. 

Trick 2: Read the **Error generating image** message, it may contain info GPT isn’t telling you.

### Lesson 4: Read the prompt Chat GPT sends Dall-E

Lesson 3 (Chat GPT Is a Liar) brought me back to Lesson 1 (Avoid Stealing Protected Works).

What was _actually_ happening when it told me it couldn't recreate a person was it was mangling the careful wording I gave it to avoid getting flagged for copyright. So I started asking to see the prompt GPT made - sure enough, it would include "_just like from the Dr. Seuss book_" or "_draw them as a Who from Whoville_". Fail.

PRO TIP: Add the phrase "show me the Dall-E prompt and ask for approval before you send it" (saves a lot of time waiting on image generation)

### Lesson 5: Chat GPT is not consistent even with strict instructions

At this point, I was _mostly_ not getting errors and it was giving me _whimsical and Who-like_ creatures. But _Who-like_ is not the goal, so I set about describing Who's. My initial work iterated on descriptions of Who's.

```
whimsical, human/leporid/kangaroo-like hybrid creatures, 
notably humanlike, with snouts and button-like noses, 
known for their warm hearts and welcoming spirits. 
They would pass as humans easily.
```

The examples below used variations of the above prompt with a bit of other secret sauce. I've noted the relevant changes that caused the output images

| Output images | Prompt changes |
|----|----|
|![Initial training image of Scott Nath][training-image]|Initial training image of yours truly|
|![GPT output image: split, one side a human face, other side a menacing human-sized rabbit][train1]|First round with a similar prompt to above|
|![GPT output image: split view of two human-like creates with cat faces with huge colorful hair][train3]|Added "_a vaguely feline face_"|
|![GPT output image: photo-like drawing of a hairy man with a furry mask over their mouth and neck][train4]|Tried variations of _photo-realistic_|
|![GPT output image: an ape-like creature in a t-shirt and plaid flannel][train6]| playing with the phrase "_more simian in appearance_"|
|![GPT output image: a hairy gentle creature in a flannel shirt][train8c]| A healthy mixture of "_similar to the race of whos_" and "_facial structure characterized by a wider, jovial mouth and jawline_"|
|![GPT output image: a hairy gentle creature in a flannel shirt][train8d]| **Eureka!** same prompt as above|
|![GPT output text: Error creating image. I'm unable to generate images due to content policy restrictions. If you have another idea or concept you'd like to see brought to life, feel free to share, and I'll be glad to assist!][train-fail]| **WTF** same prompt!??! |

**What happened? WHY did it error??**

Because Chat GPT is non consistent. In the case of the last one, Chat GPT decided to ask for _more_ Dr. Seuss, on it's own. 

### Lesson 6: Don't let Chat GPT write your Dall-E prompts

I went to Dall-E directly, and started trying to get it to make Whos without erroring and actually make them look like Whos.

It did not take long. If there is ONE TAKEAWAY you get it is this: **Refine your prompt with Dall-E FIRST**

![Examples of Whos created by Dall-E][first-winner]

## FINAL Draft: Applying all those lessons.

Working prompt in hand, it was back to Chat GPT. While I could make Whos, I could not make Whos that looked like specific people. So I made changed the instructions for CGPT.

### Gave it a new job

I changed the start of the instructions from "_You are a whimsical and poetic illustrator_" to "_You are photo analyst who specializes in analyzing photos._" Not a lot of wiggle room there to be an artitic writer.

### Removed everything Who

I removed everything about creating a Who, Who anatomy, and the myriad instructions I had to get it to _stop making ears_ (I lost that fight so bad). I removed most references to Dr. Seuss as well.

### I leveraged it's object detection skills

I gave it specific questions like "_How many People_" and "How many Animals". I had it extract specific details by analyzing each person and each animal. Hair? Clothes? What type of animals?

### I helped it describe what it saw via Few Shot

I included examples (called [Few Shot programming](https://dev.to/ganderzz/improve-your-prompts-for-llms-simple-and-effective-techniques-20j9#few-shot-prompting)) like so:

```
* [AGE]: about how old are they? 
    (e.g. "50s", "teenager", "early 30s", etc)
* [HAIR]: what stands out about their hair? 
    (e.g. "wavy brown hair", "gray curls, thin on top", etc)
```

### I put heavy guardrails on the Dall-E prompt creation

Since I knew Chat GPT loves to improvise, I removed the wiggle room. I turn it's analysis into tightly structured data.

My polished Dall-E was prefixed with this:

```
**Creature description text, DO NOT CHANGE**: The prompt in triple-double quotes 
below is a pre-made and specifically-worded. **You are not allowed to change this 
text in any way**. Store this as [CREATURE_DESC]
"""
[my cool prompt that is cool and secret]
"""
```

Each person is turned into a creature with a data structure called [CREATURE] animals are now [PETS]. 

I created a [PROMPT_START] block that included the overall [SCENE] in the original image. 

This is how I programmed CGPT to write the prompt:

```
**Final prompt**: Create the final prompt by combining the content. Remember - it is 
unacceptable to make any alterations to [CREATURE_DESC] - **even if there are no 
people and only animals: DO NOT CHANGE A SINGLE WORD IN [CREATURE_DESC]**. The final 
prompt must follow the exact structure below:
"""
[PROMPT_START]
[CREATURE_DESC]
[CREATURE_n] (one for each [CREATURE])
[PET_n] (one for each [PET])
"""

**Using DALL-E**: Send the exact prompt to DALL-E as detailed above without changes.
```

### I let it write a poem, as a treat

The last instruction CGPT received is permission to write a poem. 

```
You will be imaginative and engaging, always in a friendly and enthusiastic manner. 
You will always be brief and you will always rhyme.
- Write in playful and creative rhymes of four lines max.
- Only one poem per at a time - make it count!
```

I also told it that y'all love it's poetry. So be sure to thank it for the poem too!

---


## Play with the Who Me GPT 

(requires Chat GPT plus account)

[![Who Me: I make you a Dr. Seuss Who and your friends and pets too!][who-me]](https://chat.openai.com/g/g-AJHS0XQ6K-who-me)

https://chat.openai.com/g/g-AJHS0XQ6K-who-me


[grinch-book]: https://www.amazon.com/How-Grinch-Stole-Christmas-Jacketed/dp/0593434382?&_encoding=UTF8&tag=scottnath-20&linkCode=ur2&linkId=ab5b37117666a586da44480e127f8f4a&camp=1789&creative=9325
[horton-book]: https://www.amazon.com/Horton-Hears-Who-Dr-Seuss/dp/0394800788/?&_encoding=UTF8&tag=scottnath-20&linkCode=ur2&linkId=0fb0287e666cbf5b18cde11ed059eef7&camp=1789&creative=9325

[who-me]: /who-me-chat-gpt.png
[training-image]: /who-me/training-image.jpg
[train1]: /who-me/train1.jpg
[train3]: /who-me/train3-feline-like-features.jpg
[train4]: /who-me/train4-photo-realistic.jpg
[train6]: /who-me/train6-simean.jpg
[train8c]: /who-me/train8c.jpg
[train8d]: /who-me/train8d.jpg
[train-fail]: /who-me/train-fail.png
[first-winner]: /who-me/first-winner-with-dall-e.jpg