
// CHATBOT LOGIC (FAQ + SEARCH LINKS)

const ITEMS_LIST_PAGE = "homepage.html";

function normalize(text) {
    return (text || "")
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function addMessage(type, html) {
    const container = document.getElementById("chatbotMessages");
    if (!container) return;

    const row = document.createElement("div");
    row.className = `msg ${type}`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = html;

    row.appendChild(bubble);
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
}
// Detect lost item
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

// Detect if user FOUND an item
function isFoundIntent(msg) {
    const t = normalize(msg);
    return (
        t.includes("i found") ||
        t.includes("found a") ||
        t.includes("found an") ||
        t.includes("i have found") ||
        t.includes("picked up") ||
        t.includes("found item")
    );
}
/**
 * Extracting multiple keywords from a message.
 * Example: "I lost my wallet and keys" => ["wallet", "keys"]
 */
function extractKeywords(msg) {
    const t = normalize(msg);

    // Can add more keywords
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
    for (const k of keywords) {
        if (t.includes(normalize(k))) found.push(k);
    }

    // Deduplicate
    return [...new Set(found)];
}


// FAQ section

const FAQS = [
    {
        match: ["how do i post", "how to post", "post item", "add item", "report lost", "report found"],
        answer: `To post an item, click the <b>+</b> button at the bottom-right, fill the form, and submit.`
    },
    {
        match: ["how do i claim", "how to claim", "claim item", "claim", "contact"],
        answer: `To claim an item, visit the mentioned building in the claim or contact the admin.`
    },
    {
        match: ["how long", "kept", "60 days", "unclaimed", "discard"],
        answer: `Unclaimed items are typically held for around <b>60 days</b> before being discarded.`
    },
    {
        match: ["who can use", "students", "faculty", "staff"],
        answer: `Students, faculty, and staff can use the platform to post, search, and claim lost/found items.`
    },
    {
        match: ["admin", "dashboard", "remove", "monitor"],
        answer: `Admins can monitor posts, remove outdated items, and manage system activity.`
    }
];

function getFaqAnswer(msg) {
    const t = normalize(msg);
    for (const f of FAQS) {
        if (f.match.some(k => t.includes(normalize(k)))) return f.answer;
    }
    return null;
}

// Main bot response
function botRespond(userText) {
    // 0) Found item intent
    if (isFoundIntent(userText)) {
        addMessage(
            "bot",
            `That's great that you found an item 🙌<br/><br/>
       You can help by:<br/>
       • Clicking the <b>+</b> button at the bottom right<br/>
       • Filling out the form and submitting the details<br/><br/>
       OR<br/><br/>
       You can directly walk to the <b>UHCL Lost & Found Booth</b> and hand the item to the admin.<br/><br/>
       Thank you for helping keep our campus organized 🙂`
        );
        return;
    }
    // 1) Lost item intent → search link
    if (isLostIntent(userText)) {
        const kws = extractKeywords(userText);

        // If we cannot detect any known keywords
        if (!kws.length) {
            addMessage(
                "bot",
                `Sorry!! I cannot find what you are searching for 😞
Please contact the admin for further assistance.`
            );
            return;
        }

        // Multi-keyword query: q=wallet,keys
        const q = encodeURIComponent(kws.join(","));
        const link = `${ITEMS_LIST_PAGE}?q=${q}`;

        addMessage(
            "bot",
            `I can help. Here are posts that match: <b>${kws.join(", ")}</b><br/>
       <a href="${link}">View matching items</a>`
        );
        return;
    }

    // 2) FAQ intent
    const faq = getFaqAnswer(userText);
    if (faq) {
        addMessage("bot", faq);
        return;
    }

    // 3) Friendly fallback
    addMessage(
        "bot",
        `I’m not sure I understood that yet 🙂<br/>
     Try:<br/>
     • "I lost my wallet"<br/>
     • "I lost my wallet and keys"<br/>
     • "How do I post an item?"<br/>
     • "How long are items kept?"`
    );
}

// -------------------------------
// Hook into UI elements (created by chatbot-widget.js)
// -------------------------------
function initChatbotLogic() {
    const btn = document.getElementById("chatbotBtn");
    const win = document.getElementById("chatbotWindow");
    const close = document.getElementById("chatbotClose");
    const sendBtn = document.getElementById("chatbotSend");
    const input = document.getElementById("chatbotInput");

    if (!btn || !win || !close || !sendBtn || !input) {
        // UI not present on this page
        return;
    }

    // Make sure initial message exists even if widget didn't add it
    const messages = document.getElementById("chatbotMessages");
    if (messages && messages.children.length === 0) {
        addMessage("bot", "Hi! I’m the Lost & Found assistant 🙂 Tell me what you lost, or ask a FAQ.");
    }

    // Open/close
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

        setTimeout(() => botRespond(text), 200);
    }

    sendBtn.addEventListener("click", send);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") send();
    });
}

document.addEventListener("DOMContentLoaded", initChatbotLogic);