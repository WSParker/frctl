if(!self.define){let s,e={};const i=(i,n)=>(i=new URL(i+".js",n).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(n,l)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let o={};const t=s=>i(s,r),u={module:{uri:r},exports:o,require:t};e[r]=Promise.all(n.map((s=>u[s]||t(s)))).then((s=>(l(...s),o)))}}define(["./workbox-7369c0e1"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"assets/crosshairs.5fff5fe7.svg",revision:null},{url:"assets/download.6ab4a97d.svg",revision:null},{url:"assets/index.3b1d65e1.js",revision:null},{url:"assets/index.d7e47d8d.css",revision:null},{url:"assets/info.f998719d.svg",revision:null},{url:"assets/julia_inverted.7a7cbab5.svg",revision:null},{url:"assets/julia.1468759b.svg",revision:null},{url:"assets/left-arrow.7e338e21.svg",revision:null},{url:"assets/mainworker.a53f60b7.js",revision:null},{url:"assets/settings.e8864a01.svg",revision:null},{url:"assets/shuffle.c492265c.svg",revision:null},{url:"assets/workbox-window.prod.es5.d2780aeb.js",revision:null},{url:"index.html",revision:"7a9daf1d78c93eda09e90365b197ad0a"},{url:"manifest.webmanifest",revision:"a6c3f010a9efcdf3ed86dc53d54058de"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
