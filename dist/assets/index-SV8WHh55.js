(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const a="lesser-remedy-territory-removing.trycloudflare.com",h=`http://${a}/wm_states`,g=e=>`http://${a}/wm_time/${e}`;new WebSocket(`ws://${a}/ws`);const c=new Map;async function f(){try{const e=await fetch(h);if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json();v(t)}catch(e){console.error("Error fetching states:",e)}}async function y(e){try{const t=await fetch(g(e));if(!t.ok)throw new Error(`HTTP ${t.status}`);return(await t.json()).remaining_time||0}catch(t){return console.error(`Error fetching time for machine ${e}:`,t),0}}function v(e){e.forEach(t=>{if(!c.has(t.id))c.set(t.id,{id:t.id,status:t.status,time:0});else{const n=c.get(t.id);n.status=t.status}}),w()}function w(){const e=document.getElementById("machines-container");e.innerHTML="",Array.from(c.values()).sort((n,r)=>n.id-r.id).forEach(n=>{const r=document.createElement("div");r.className=`machine-card ${n.status}`,n.status==="busy"?(r.innerHTML=`
        <div class="machine-status">
          <div class="status-icon">
            <svg class="spinner" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="3"></circle>
            </svg>
          </div>
          <div class="status-text">
            <span class="status-label">${n.id}-Busy</span>
            <span class="time-remaining" id="time-${n.id}">--:--</span>
          </div>
        </div>
      `,y(n.id).then(s=>{n.time=s,m(n.id,s)})):r.innerHTML=`
        <div class="machine-status">
          <div class="status-icon">
            <svg viewBox="0 0 50 50">
              <path d="M 15 25 L 22 32 L 35 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div class="status-text">
            <span class="status-label">${n.id}-Available</span>
          </div>
        </div>
      `,e.appendChild(r)})}function m(e,t){const n=document.getElementById(`time-${e}`);if(!n)return;const r=Math.floor(t/3600),s=Math.floor(t%3600/60),o=t%60;r>0?n.textContent=`${r}:${s.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`:n.textContent=`${s}:${o.toString().padStart(2,"0")}`}function $(){f(),setInterval(()=>{c.forEach(e=>{e.status==="busy"&&e.time>0&&(e.time-=1,m(e.id,e.time))})},1e3)}document.addEventListener("DOMContentLoaded",()=>{$();const e=document.getElementById("refresh-btn");e&&e.addEventListener("click",()=>{console.log("click"),f()})});let d=1e3,i=null,u=null;function p(){u&&clearTimeout(u),i=new WebSocket(`ws://${a}/ws`),i.onopen=()=>{console.log("✅ Connected"),d=1e3},i.onmessage=e=>{f()},i.onclose=e=>{e.wasClean||(console.log(`❌ Disconnected. Retrying in ${d}ms...`),u=setTimeout(()=>{p()},d))},i.onerror=e=>{console.error("WebSocket Error:",e),i.close()}}p();console.log(`

asak

`);
