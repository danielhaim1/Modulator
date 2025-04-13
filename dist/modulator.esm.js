/*!
 * @danielhaim/modulator - v2.2.0 - 2025-04-13
 * https://github.com/danielhaim1/modulator.git
 * Copyright (c) 2025 Daniel Haim, Licensed Apache-2.0
 */var e={d:(t,n)=>{for(var r in n)e.o(n,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:n[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)},t={};function n(e,t,n=!1,r=null,o=100,l=null){if("function"!=typeof e)throw new TypeError("Expected a function for the first parameter");if("number"!=typeof t||isNaN(t)||t<0)throw new TypeError("Expected a non-negative number for the second parameter (wait)");if("boolean"!=typeof n)throw new TypeError("Expected a boolean for the third parameter");if("number"!=typeof o||isNaN(o)||o<0)throw new TypeError("Expected a non-negative number for the fifth parameter (maxCacheSize)");if(null!==l&&("number"!=typeof l||isNaN(l)||l<0))throw new TypeError("Expected null or a non-negative number for the sixth parameter (maxWait)");if(null!==l&&l<t)throw new TypeError("maxWait must be greater than or equal to wait");let a=null,i=new Map,u=0,c=0,f=null,s=null,p=null,m=null;const w=(t,n,r,l,a)=>{c=t;try{const t=e.apply(r,n);Promise.resolve(t).then((e=>{if(o>0){const t=JSON.stringify(n);i.set(t,e),i.size>o&&i.delete(i.keys().next().value)}l(e)}),(e=>{a(e)}))}catch(e){a(e)}},h=()=>{const e=Date.now();f&&(!l||e-u>=l)&&w(e,f,s,p,m),a=null,f=null,s=null,p=null,m=null},y=function(...e){return new Promise(((y,d)=>{const b=Date.now(),E=!!a;u=b;const x=JSON.stringify(e);if(o>0&&i.has(x))return void y(i.get(x));if(f=e,s=r||this,p=y,m=d,n&&!E)w(b,e,s,y,d),a=setTimeout(h,t);else{clearTimeout(a);const e=b-c,n=null===l?t:Math.min(t,l-e);a=setTimeout(h,n>0?n:0)}}))};return y.cancel=function(){clearTimeout(a),c=0,a=null,f=null,s=null,m&&m(new Error("Debounced function call was cancelled.")),p=null,m=null},y}e.d(t,{w:()=>n});var r=t.w;export{r as modulate};