!function(){let t;var e;(e=t||(t={}))[e.L=0]="L",e[e.M=1]="M",e[e.Q=2]="Q",e[e.H=3]="H";const n=[7,19,10,16,13,13,17,9,10,34,16,28,22,22,28,16,15,55,26,44,18,17,22,13,20,80,18,32,26,24,16,9,26,108,24,43,18,15,22,11,18,68,16,27,24,19,28,15,20,78,18,31,18,14,26,13,24,97,22,38,22,18,26,14,30,116,22,36,20,16,24,12,18,68,26,43,24,19,28,15,20,81,30,50,28,22,24,12,24,92,22,36,26,20,28,14,26,107,22,37,24,20,22,11,30,115,24,40,20,16,24,12,22,87,24,41,30,24,24,12,24,98,28,45,24,19,30,15,28,107,28,46,28,22,28,14,30,120,26,43,28,22,28,14,28,113,26,44,26,21,26,13,28,107,26,41,30,24,28,15,28,116,26,42,28,22,30,16,28,111,28,46,30,24,24,13,30,121,28,47,30,24,30,15,30,117,28,45,30,24,30,16,26,106,28,47,30,24,30,15,28,114,28,46,28,22,30,16,30,122,28,45,30,23,30,15,30,117,28,45,30,24,30,15,30,116,28,45,30,23,30,15,30,115,28,47,30,24,30,15,30,115,28,46,30,24,30,15,30,115,28,46,30,24,30,15,30,115,28,46,30,24,30,15,30,115,28,46,30,24,30,16,30,121,28,47,30,24,30,15,30,121,28,47,30,24,30,15,30,122,28,46,30,24,30,15,30,122,28,46,30,24,30,15,30,117,28,47,30,24,30,15,30,118,28,47,30,24,30,15];function r(t){return 4*(t-1)+21}function o(t){const e=r(t),n=t>=7?36:0,o=2+Math.floor(t/7);return e*e-192-2*(e-14)-27-(t<=1?0:25*(Math.pow(o,2)-3)-10*(o-2))-n}function c(t){return o(t)%8}function i(t){if(t<=1)return[];const e=18+4*(t-2),n=2+Math.floor(t/7),r=Math.floor((e-6)/(n-1));let o=r,c=r;if(n>3)for(o=r;o>0&&(c=(e-6-o)/(n-2),c%2!=0);o--);const i=[6,6+o];for(let t=1;t<n-1;t++)i.push(6+o+t*c);return i}function l(t,e){const r=8*(t-1)+2*e;let c=n[r],i=n[r+1],l=function(t){return Math.floor(o(t)/8)}(t),u=0,s=0;for(s=0;s<=56;s++){let t=(l-(c+i)*s)/(c+i+1);if(t%1==0){u=t;break}}const a=[{blocks:s,wordsPerBlock:i,ecPerBlock:c}];return u>0&&a.push({blocks:u,wordsPerBlock:i+1,ecPerBlock:c}),a}function u(t,e){let n=t>=1&&t<=9?0:t>=10&&t<=26?1:t>=27&&t<=40?2:-1;if(n<0)throw new Error("Invalid version: ".concat(t));switch(e){case a.Numeric:return 10+2*n;case a.Alphanumeric:return 9+2*n;case a.Byte:return Math.min(8+8*n,16);case a.Kanji:return 8+2*n;default:throw new Error("Invalid mode: ".concat(e))}}function s(t){return 8*t.reduce((t,e)=>t+e.wordsPerBlock*e.blocks,0)}let a;var f;function h(e){const n=function(t){return/^\d*$/.test(t)?a.Numeric:/^[0-9A-Z \$%\*\+\-\.\/:]*$/.test(t)?a.Alphanumeric:a.Byte}(e),{version:o,ecLevel:f,groups:h,requiredNumberOfBits:m,characterCountBits:g}=function(e,n){const r=t.L;let o,c,i,f;for(o=1;o<=40;o++){c=l(o,r),i=s(c),f=u(o,n);let t=0;const h=i-(4+f);switch(n){case a.Numeric:t=Math.floor(h/10*3);break;case a.Alphanumeric:t=Math.floor(h/11*2);break;default:t=Math.floor(h/8)}if(e<=t)break}if(o>40)throw new Error("Input too long!");return{version:o,ecLevel:r,groups:c,requiredNumberOfBits:i,characterCountBits:f}}(e.length,n);return{ecLevel:f,version:o,mode:n,characterCountBits:g,requiredNumberOfBits:m,remainderBits:c(o),dimensions:r(o),alignmentPattern:i(o),groups:h}}function m(t,e){const n=[];let r=0;for(;r*e<t.length;)n.push(t.substr(r++*e,e));return n}function g(t){let e="";for(let n=0;n<t;n++)e+="0";return e}function p(t,e){return g(e-t.length)+t}function d(t,e){return p(t.toString(2),e)}function b(t,e){const n=new Uint8Array(t.length+e.length);return n.set(t,0),n.set(e,t.length),n}function y(t,e){return Array(e-t).fill(t).map((t,e)=>t+e)}function w(t){return[...new Array(t)].map(e=>[...new Array(t)].fill(null))}function v(t){return t.slice().map(t=>t.slice())}let B;var A;function O(t,e,n=(()=>{}),r=B.Horizontal){for(let o=0;o<t.length;o++){for(let n=0;n<t.length;n++)r===B.Horizontal?e(t[o][n],n,o,t):e(t[n][o],o,n,t);n(o,t)}}function E(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function j(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?E(Object(n),!0).forEach((function(e){k(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):E(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function k(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}(f=a||(a={}))[f.Numeric=1]="Numeric",f[f.Alphanumeric=2]="Alphanumeric",f[f.Byte=4]="Byte",f[f.Kanji=8]="Kanji",f[f.EXI=7]="EXI",(A=B||(B={}))[A.Horizontal=0]="Horizontal",A[A.Vertical=1]="Vertical";const M=function(){const t=[1];for(;t.length<256;){let e=t[t.length-1]<<1;e>255&&(e^=285),t.push(e)}return Object.assign({},t)}(),P=j(j({},function(t){const e={};return Object.keys(t).forEach(n=>e[t[n]]=+n),e}(M)),{},{1:0});function x(t,e){return 0===t||0===e?0:M[(P[t]+P[e])%255]}function N(t,e){const n=new Uint8Array(t.length+e.length-1);return t.forEach((t,r)=>e.forEach((e,o)=>n[r+o]^=x(e,t))),n}function I(t,e){let n=t.slice();for(let r=0;r<t.length-(e.length-1);r++){let t=n[r];if(0!==t)for(let o=1;o<e.length;o++)0!=e[o]&&(n[r+o]^=x(e[o],t))}return n.slice(n.length-(e.length-1))}function U(t,e){return I(t=b(t,new Uint8Array(e)),function(t){let e=Uint8Array.from([1]);for(let o=0;o<t;o++)e=N(e,[1,(n=2,r=o,M[P[n]*r%255])]);var n,r;return e}(e))}class L{constructor(t){this.config=t}encodeSymbols(t){return"1"}createBlocks(t){let e=0;return this.config.groups.map(n=>{const r=new Array(n.blocks);for(let o=0;o<r.length;o++){r[o]=new Uint8Array(n.wordsPerBlock);for(let c=0;c<n.wordsPerBlock;c++)r[o][c]=t[e++]}return r}).flat()}interleave(t){const e=Math.max(...t.map(t=>t.length)),n=t.reduce((t,e)=>t+e.length,0),r=new Uint8Array(n);let o=0;for(let n=0;n<e;n++)for(let e=0;e<t.length;e++)n<t[e].length&&(r[o++]=t[e][n]);return r}encode(t){let e=m(this.fillUpBits(this.prefix(t)+this.encodeSymbols(t)),8),n=Uint8Array.from(e.map(t=>parseInt(t,2)));const r=this.createBlocks(n),o=r.map(t=>U(t,this.config.groups[0].ecPerBlock));n=this.interleave(r);let c=this.interleave(o);return Array.from(b(n,c)).map(t=>d(t,8)).flat().join("")+this.suffix()}fillUpBits(t){const e=this.config.requiredNumberOfBits-t.length;if(e>0){for(t+=g(Math.min(e,4)),t+=g(8-t.length%8);t.length<this.config.requiredNumberOfBits;)t+="1110110000010001";return t.substr(0,this.config.requiredNumberOfBits)}throw new Error("encodedData larger than allowed number of bits")}prefix(t){return d(this.config.mode,4)+d(t.length,this.config.characterCountBits)}suffix(){return p("",this.config.remainderBits)}}const S=t=>["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"].indexOf(t);class H extends L{encodeSymbols(t){return m(t,2).map(([t,e])=>void 0!==e?d(45*S(t)+S(e),11):d(S(t),6)).join("")}}class T extends L{encodeSymbols(t){return t.split("").map(t=>d(t.charCodeAt(0),8)).join("")}}class C extends L{encodeSymbols(t){return m(t,3).map(t=>d(+t,+t<10?4:+t<100?7:10)).join("")}}function D(t){let e=0,n=!1,r=0;const o=()=>{e+=r>=5?3+Math.max(0,r-5):0,r=0};return Object.values(B).forEach(e=>{O(t,t=>{t!==n&&(o(),n=t),r++},o,e)}),e}function q(t){let e=0;return O(t,(n,r,o)=>{if(r<t.length-1&&o<t.length-1){const n=y(0,4).reduce((e,n,c)=>e|+t[o+(n>>1)][r+(1&n)]<<c,0);e+=0===n||15===n?3:0}}),e}function z(t){const[e,n]=[!0,!1],r=[e,n,e,e,e,n,e,n,n,n,n],o=[{template:r,current:0},{template:r.slice().reverse(),current:0}];let c=0;return Object.values(B).forEach(e=>{O(t,t=>(t=>{o.forEach(e=>{e.current+=t===e.template[e.current]?1:-e.current,e.current>=e.template.length&&(c+=40,e.current=0)})})(t),()=>o.forEach(t=>t.current=0),e)}),c}function K(t){const e=t.length*t.length;let n=0;O(t,t=>n+=t?1:0);const r=+(n/e*100).toFixed(0),o=r-(5&r),c=o+5;return 10*Math.min(...[o,c].map(t=>Math.abs(t-50)/5))}function Q(t,e){return[(t,e)=>(t+e)%2==0,(t,e)=>e%2==0,(t,e)=>t%3==0,(t,e)=>(t+e)%3==0,(t,e)=>(Math.floor(e/2)+Math.floor(t/3))%2==0,(t,e)=>t*e%2+t*e%3==0,(t,e)=>(t*e%2+t*e%3)%2==0,(t,e)=>((t+e)%2+t*e%3)%2==0].map(n=>function(t,e){let n=v(t);for(let r=0;r<t.length;r++)for(let o=0;o<t[0].length;o++)null===t[r][o]&&(n[r][o]=e[r][o]);return n}(t,((t,e)=>{const n=v(t);return O(n,(t,r,o)=>{e(r,o)&&(n[o][r]=!t)}),n})(e,n))).reduce((t,e,n)=>{const r=function(t){return[D,q,z,K].map(e=>e(t)).reduce((t,e)=>t+e,0)}(e);return r<t.score?{score:r,mask:n,matrix:e}:t},{score:Number.POSITIVE_INFINITY,mask:0,matrix:[]})}function V(t,e){const[n,r]=[Math.min(...t),Math.max(...t)];t.map((t,e,n)=>n.map(e=>[t,e])).flat().filter(([t,e])=>!(t===n&&(e===n||e===r)||e===n&&(t===n||t===r))).map(([t,e])=>[t-2,e-2]).forEach(([t,n])=>((t,n)=>{for(let r=0;r<3;r++)for(let o=0+r;o<5-r;o++)e[n+r][t+o]=e[n+4-r][t+o]=e[n+o][t+r]=e[n+o][t+4-r]=r%2==0})(t,n))}function $(t){let e=w(t.dimensions);var n;return function(t){const e=t.length,n=(e,n)=>{for(let r=0;r<3;r++)for(let o=0+r;o<7-r;o++)t[n+r][e+o]=t[n+6-r][e+o]=t[n+o][e+r]=t[n+o][e+6-r]=r%2==0;t[n+3][e+3]=!0};n(0,0),n(0,e-7),n(e-7,0),(()=>{for(let n=0;n<8;n++)t[n][7]=t[e-n-1][7]=t[7][n]=t[7][e-n-1]=t[e-7-1][n]=t[n][e-7-1]=!1})()}(e),V(t.alignmentPattern,e),function(t,e){const n=e.length;if([...y(0,9),...y(n-8,n)].forEach(t=>e[t][8]=e[8][t]=!1),t>=7)for(let t=0;t<3;t++)for(let r=0;r<6;r++)e[n-11+t][r]=e[r][n-11+t]=!1}(t.version,e),function(t){for(let e=7;e<t.length-7;e++)t[6][e]=t[e][6]=e%2==0}(e),(n=e)[n.length-8][8]=!0,e}var F,X;function R(t,e){let n=$(t),r=function(t,e){let n=w(t.length);const r=t.length-1;let o=r,c=0,i=r,l=0,u=F.Up;for(;l<e.length;)null===t[i][o-c]&&(n[i][o-c]="1"===e[l++]),1===c&&(i+=u,(i<0||i>r)&&(i=(r+r*u)/2,u*=-1,o-=2)),c^=1,o>=6&&o<=7&&(o=5);return n}(n,e),{mask:o,matrix:c}=Q(n,r),i=function(t,e,n){let r=["01","00","11","10"][t.ecLevel];r+=d(e,3);const o=(r+g(10)).split("").map(t=>+t),c=Uint8Array.from([1,0,1,0,0,1,1,0,1,1,1]);r+=p(I(Uint8Array.from(o),c).join(""),10);const i=d(21522^parseInt(r,2),15),l=[...y(0,9),...y(n.length-7,n.length)],u=l.slice().reverse();let s=0;return l.forEach(t=>n[8][t]=6!==t?"1"===i[s++]:n[8][t]),s=0,u.forEach(t=>n[t][8]=6!==t&&t!==n.length-8?"1"===i[s++]:n[t][8]),n}(t,o,c);return i=function(t,e){if(t.version<7)return e;const n=Uint8Array.from([1,1,1,1,1,0,0,1,0,0,1,0,1]),r=d(t.version,6),o=(r+g(12)).split("").map(t=>+t),c=r+p(I(Uint8Array.from(o),n).join(""),12);let i=0;for(let t=0;t<6;t++)for(let n=0;n<3;n++)e[e.length-9-n][5-t]=e[5-t][e.length-9-n]="1"===c[i++];return e}(t,c),i}function Y(t){const e=h(t);return R(e,function(t){switch(t.mode){case a.Alphanumeric:return new H(t);case a.Numeric:return new C(t);default:return new T(t)}}(e).encode(t))}function Z(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}(X=F||(F={}))[X.Up=-1]="Up",X[X.Down=1]="Down";const G=function(){let t=Z("rect");return t.setAttribute("width","1"),t.setAttribute("height","1"),t.setAttribute("shape-rendering","crispEdges"),t}();function J(t,e,n){const r=G.cloneNode(!1);r.setAttribute("x",e.x.toString()),r.setAttribute("y",e.y.toString()),r.setAttribute("fill",n),t.appendChild(r)}function W(t){t.innerHTML=""}try{null.accept()}catch(t){}const _=document.getElementById("canvas"),tt=document.getElementById("input"),et=document.getElementById("paste");document.getElementById("clear").addEventListener("click",()=>{tt.value="",tt.focus()}),void 0!==navigator.clipboard?et.addEventListener("click",async()=>{tt.value=await navigator.clipboard.readText(),nt()}):et.style.display="none";const nt=()=>{const t=tt.value;if(t.length>0)try{!function(t,e){t.innerHTML="",t.setAttribute("viewBox","0 0 ".concat(e[0].length||10," ").concat(e.length));const n=Z("g");for(let t=0;t<e.length;t++)for(let r=0;r<e[t].length;r++)null!==e[t][r]&&J(n,{x:r,y:t},e[t][r]?"#000":"#fff");t.appendChild(n)}(_,Y(t))}catch(t){W(_),alert("The input was too long for QR!")}else W(_)};tt.addEventListener("input",function(t,e){let n;return function(){clearTimeout(n),n=setTimeout(()=>{n=void 0,t()},e)}}(nt,350)),tt.focus()}();
//# sourceMappingURL=qr-code-painter.9c1d2262.js.map