// Supabase Dashboard > Project Settings > API থেকে Project URL এবং anon/public key দিন।
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_PUBLIC_KEY";
// Assumed table columns: id, user_id, title, content, created_at.
let client=null, activeUser=null, saved=[];
const el=id=>document.getElementById(id);
function toast(s){const t=el("toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function openAuth(){el("authModal").classList.add("open")}
function closeAuth(){el("authModal").classList.remove("open")}
el("loginOpen").onclick=openAuth;el("loginAdd").onclick=openAuth;el("closeModal").onclick=closeAuth;
el("hamb").onclick=()=>el("navlinks").classList.toggle("open");
document.querySelectorAll("#navlinks a").forEach(a=>a.onclick=()=>el("navlinks").classList.remove("open"));
async function copyText(s){try{await navigator.clipboard.writeText(s);toast("Prompt copied!")}catch{toast("Copy not available in this browser")}}
document.querySelectorAll(".sampleCopy").forEach(b=>b.onclick=()=>copyText(b.dataset.prompt));
el("dailyText").parentElement.querySelector(".copyDaily").onclick=()=>copyText(el("dailyText").textContent);
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{
 document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");
 document.querySelectorAll(".promptCard").forEach(c=>c.hidden=b.dataset.filter!=="All"&&c.dataset.category!==b.dataset.filter);
});
function authState(user){activeUser=user;el("loginOpen").textContent=user?"My Account":"Login";if(user){closeAuth();loadPrompts()}}
async function loadPrompts(){
 if(!client||!activeUser)return;
 const {data,error}=await client.from("prompts").select("id,title,content,created_at").order("created_at",{ascending:false});
 if(error){toast("Load error: "+error.message);return}
 saved=data||[];el("userPrompts").innerHTML=saved.map(p=>`<article class="promptCard"><small>YOUR PROMPT</small><h3>${safe(p.title)}</h3><p>${safe(p.content)}</p><button class="sampleCopy" data-id="${p.id}">Copy ↗</button></article>`).join("");
 el("userPrompts").querySelectorAll("button").forEach(b=>b.onclick=()=>{const p=saved.find(x=>String(x.id)===b.dataset.id);if(p)copyText(p.content)});
}
function safe(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
el("doSignup").onclick=async()=>{if(!client)return toast("আগে app.js-এ Supabase key বসান");const {error}=await client.auth.signUp({email:el("email").value.trim(),password:el("password").value});el("authMsg").textContent=error?error.message:"Signup request sent. Check your email if confirmation is enabled."};
el("doLogin").onclick=async()=>{if(!client)return toast("আগে app.js-এ Supabase key বসান");const {error}=await client.auth.signInWithPassword({email:el("email").value.trim(),password:el("password").value});el("authMsg").textContent=error?error.message:"Login successful."};
(async()=>{
 if(SUPABASE_URL.startsWith("YOUR_")||SUPABASE_ANON_KEY.startsWith("YOUR_")){el("authMsg").textContent="Supabase এখনো configure করা হয়নি। app.js-এ Project URL ও anon public key বসাতে হবে।";return}
 client=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
 const {data:{session}}=await client.auth.getSession();authState(session?.user||null);
 client.auth.onAuthStateChange((_event,s)=>authState(s?.user||null));
})();