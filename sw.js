if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return i[e]||(r=new Promise((async r=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=r}else importScripts(e),r()}))),r.then((()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]}))},r=(r,i)=>{Promise.all(r.map(e)).then((e=>i(1===e.length?e[0]:e)))},i={require:Promise.resolve(r)};self.define=(r,c,n)=>{i[r]||(i[r]=Promise.resolve().then((()=>{let i={};const s={uri:location.origin+r.slice(1)};return Promise.all(c.map((r=>{switch(r){case"exports":return i;case"module":return s;default:return e(r)}}))).then((e=>{const r=n(...e);return i.default||(i.default=r),i}))})))}}define("./sw.js",["./workbox-690cc146"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"apple-touch-icon.18cabd04.png",revision:"33ec2011e4c8a1b09ccf783a18cabd04"},{url:"favicon-16x16.2c5bde51.png",revision:"50c2eff4ed0048d76a5e0e6b2c5bde51"},{url:"favicon-32x32.97cc81b6.png",revision:"0cb828278792f633e2d0910397cc81b6"},{url:"index.0bd69753.css",revision:"788e5bc012fd7a449c316bc70bd69753"},{url:"index.3028e67b.js",revision:"e063bf79a4d6b7ee5924ed833028e67b"},{url:"index.html",revision:"3752db72f847abda1136f271643a0c7f"},{url:"manifest.webmanifest",revision:"559e89907dc9540b6fc8417048494b22"},{url:"safari-pinned-tab.98612e15.svg",revision:"c0d7fa1e3f21c3620735a29c98612e15"}],{})}));
