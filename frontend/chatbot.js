
/*const ITEMS_LIST_PAGE = "homepage.html";
function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function addMessage(type, html) {
  const container = document.getElementById("chatbotMessages");
  const row = document.createElement("div");
  row.className = `msg ${type}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = html;

  row.appendChild(bubble);
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function isLostIntent(msg) {
  const t = normalize(msg);
  return (
    t.includes("i lost") ||
    t.includes("lost my") ||
    t.includes("missing") ||
    t.includes("can't find") ||
    t.includes("cant find") ||
    t.includes("can’t find")
  );
}

function extractKeywords(msg) {
  const t = normalize(msg);

  // Recognized items (add more any time)
  const keywords = [
    "wallet", "purse", "bag", "backpack",
    "keys", "key",
    "id", "id card", "student id", "employee id",
    "phone", "iphone", "android",
    "laptop", "charger", "airpods", "earbuds",
    "water bottle", "bottle",
    "book", "notebook"
  ];

  const found = [];

  // capture all matches (not just first)
  for (const k of keywords) {
    if (t.includes(normalize(k))) found.push(k);
  }

  // De-duplicate
  return [...new Set(found)];
}

// FAQ list
const FAQS = [
  {
    match: ["how do i post", "how to post", "post item", "add item", "report lost", "report found"],
    answer: "To post an item: click on the Post Item button, fill the required details, and submit."
  },
  {
    match: ["how do i claim", "how to claim", "claim item", "claim", "contact poster", "contact"],
    answer: "To claim an item: open the item post and use the claim/contact option (backend connection comes next)."
  },
  {
    match: ["how long", "60 days", "kept", "discard", "throw away", "unclaimed"],
    answer: "Unclaimed items are typically held for 60 days before being discarded (based on the policy mentioned in the proposal)."
  },
  {
    match: ["who can use", "students", "faculty", "staff"],
    answer: "Students, faculty, and staff can use the platform to post, search, and claim lost/found items."
  },
  {
    match: ["admin", "dashboard", "remove posts", "monitor"],
    answer: "Admins can monitor posts, remove outdated posts, and manage system activity."
  }
];

function faqAnswer(msg) {
  const t = normalize(msg);
  for (const f of FAQS) {
    if (f.match.some(k => t.includes(normalize(k)))) return f.answer;
  }
  return null;
}

function botRespond(userText) {
  // 1) Lost item intent → link to filtered list (supports multiple keywords)
  if (isLostIntent(userText)) {
    const kws = extractKeywords(userText);

    // ✅ Scenario 1: user says "lost something" but we can't detect item
    if (!kws.length) {
      addMessage(
        "bot",
        `I’m sorry! I couldn’t find any matching items in the UHCL Lost & Found at the moment. 🙂
You may try checking again later or post a lost item report.<br/>`
      );
      return;
    }

    // ✅ Scenario 2: user mentions multiple items
    const q = encodeURIComponent(kws.join(","));  // "key,wallet"
    const link = `${ITEMS_LIST_PAGE}?q=${q}`;

    addMessage(
      "bot",
      `I can help. Here are posts that match: <b>${kws.join(", ")}</b><br/>
       <a href="${link}">View matching items</a>`
    );
    return;
  }

  // 2) FAQ intent
  const faq = faqAnswer(userText);
  if (faq) {
    addMessage("bot", faq);
    return;
  }

  // ✅ Scenario 1 (non-lost, non-faq): friendly fallback
  addMessage(
    "bot",
    `I’m not sure I understood that yet. 🙂<br/>
     You can try:<br/>
     • "I lost my wallet"<br/>
     • "I lost my wallet and keys"<br/>
     • "How do I post an item?"<br/>
     • "How long are items kept?"`
  );
}

function initChatbot() {
  const btn = document.getElementById("chatbotBtn");
  const win = document.getElementById("chatbotWindow");
  const close = document.getElementById("chatbotClose");
  const sendBtn = document.getElementById("chatbotSend");
  const input = document.getElementById("chatbotInput");

  btn.addEventListener("click", () => {
    win.classList.toggle("open");
    input.focus();
  });

  close.addEventListener("click", () => {
    win.classList.remove("open");
  });

  function send() {
    const text = (input.value || "").trim();
    if (!text) return;

    addMessage("user", text);
    input.value = "";

    setTimeout(() => botRespond(text), 250);
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });

  addMessage("bot", "Hi! I’m the Lost & Found assistant 🙂 Tell me what you lost, or ask a FAQ.");
}

document.addEventListener("DOMContentLoaded", initChatbot); */
