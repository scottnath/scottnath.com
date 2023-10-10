# scottnath.com version 1,248,662

## The definite.last-time.FINAL.next2.2010.final.website edition

## todo

[ ] get astro-icons working
[ ] convert resume to web-component/lit
[ ] add linter
[ ] make work with testing-library
[ ] need favicon
  * dual favicons on remotely.com (https://remotive.com/remotive_website_layout/static/refactoring/js/favicon.js?v=2)
  * clown face and ??? (https://favicon.io/emoji-favicons/)
[ ] add github graph: https://github.com/enpitsuLin/wc-github-graph/blob/master/src/github-graph.ts

```js
const onVisibilityChange=()=>{const faviconTag=document.querySelector('[rel="shortcut icon"]');if(document.hidden){const initialFavicon=faviconTag.href;document.initialFavicon=initialFavicon;faviconTag.href="/remotive_website_job/static/src/img/dogeicon.png";}else{if(document.initialFavicon!==""){faviconTag.href=document.initialFavicon;}}};document.addEventListener("visibilitychange",onVisibilityChange,true);document.initialFavicon=document.querySelector('[rel="shortcut icon"]').href;
```