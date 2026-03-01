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

function isLostIntent(msg) {
    const t = normalize(msg);

    // Basic phrases
    const phrases = [
        "i lost",
        "lost my",
        "can't find",
        "cant find",
        "can’t find",
        "missing",
        "misplaced"
    ];

   
    const hasPhrase = phrases.some(p => t.includes(p));

   
    const words = t.split(" ").filter(Boolean);
    const hasLostKeyword = words.includes("lost") && words.length > 1;

    return hasPhrase || hasLostKeyword;
}

// Detect found item intent
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


async function fetchAllItemTitles() {
    try {
        const { data: items, error } = await supabaseClient
            .from('items')
            .select('title, description')
            .order('created_at', { ascending: false });

        if (error) throw error;

      
        return items.map(item => (item.title + " " + item.description).toLowerCase());
    } catch (error) {
        console.error("Error fetching items for chatbot:", error);
        return [];
    }
}

async function extractKeywords(msg) {
    const t = normalize(msg);
    const itemTexts = await fetchAllItemTitles();

    const stopWords = new Set([
        "a","an","the","and","or","my","i","is","at","on","in","of","for","to","with","it","can’t","cant","can't","lost","found"
    ]);

    const found = [];

    itemTexts.forEach(text => {
        const words = text.split(" "); 
        words.forEach(word => {
            word = word.trim();
            if (word && !stopWords.has(word) && t.includes(word) && !found.includes(word)) {
                found.push(word);
            }
        });
    });

    return found;
}

//--------------------FAQ---------------------
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


const FAQS_BY_CATEGORY = [
    [
        { question: "How do I post an item?", answer: "To post an item, click the <b>+</b> button at the bottom-right, fill the form, and submit." },
        { question: "How do I report a found item?", answer: "Click the <b>+</b> button, select 'Found Item', fill in details, and submit." }
    ],
    [
        { question: "How do I claim an item?", answer: "To claim an item, visit the mentioned building or contact the admin." }
    ],
    [
        { question: "How long are items kept?", answer: "Unclaimed items are typically held for around <b>60 days</b> before being discarded." },
        { question: "Who can use the platform?", answer: "Students, faculty, and staff can post, search, and claim items." },
        { question: "Lost a confidential item?", answer: "Students, faculty, and staff can find confidential and private items such as documents, credit cards, etc by visiting campus police dept. It is not recommended to post such items publicly." }
    ],
    [
        { question: "What can admins do?", answer: "Admins can monitor posts, remove outdated items, and manage system activity." },
        { question: "How can I contact admin?", answer: "Send an email to admin@uhcl.edu or call at 281-123-456" }
    ]
];


const FAQ_CATEGORIES = [
    "Posting & Reporting",
    "Claiming Items",
    "Policies",
    "Admin Info"
];


function showFaqCategories() {
    addMessage("bot", "Here are some FAQ categories. Click a category to see the answers:");

   
    const container = document.createElement("div");
    container.className = "faq-category-container";

    FAQ_CATEGORIES.forEach((category, index) => {
        const btn = document.createElement("button");
        btn.className = "faq-category-btn";
        btn.dataset.index = index;
        btn.innerText = category;
        container.appendChild(btn);
    });


    document.getElementById("chatbotMessages").appendChild(container);
}

function getFaqAnswer(msg) {
    const t = normalize(msg);
    for (const f of FAQS) {
        if (f.match.some(k => t.includes(normalize(k)))) return f.answer;
    }
    return null;
}


async function botRespond(userText) {
 
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

    
    if (isLostIntent(userText)) {
        const kws = await extractKeywords(userText);

        
        if (!kws.length) {
            addMessage(
                "bot",
                `I couldn’t find a match for your item 😞<br/>
You can create a new post so others can help you find it.`
            );
            return;
        }

        
        const q = encodeURIComponent(kws.join(","));
        const link = `${ITEMS_LIST_PAGE}?q=${q}`;

        addMessage(
    "bot",
    `I can help. Here are posts that match: <b>${kws.join(", ")}</b></br></br>
     <button class="chatbot-filter-btn view-btn" data-terms="${kws.join(",")}">View matching items</button>`
);
        return;
        
    }


    const faq = getFaqAnswer(userText);
    if (faq) {
        addMessage("bot", faq);
        return;
    }


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

    async function send() {
        const text = (input.value || "").trim();
        if (!text) return;

        addMessage("user", text);
        input.value = "";

        await botRespond(text);
    }

    sendBtn.addEventListener("click", send);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") send();
    });

    addMessage("bot", "Hi! I’m the Lost & Found assistant 🙂 Tell me what you lost, or ask a FAQ.");
    showFaqCategories();

 
document.addEventListener("click", (e) => {

  
    if (e.target.classList.contains("faq-category-btn")) {
        const idx = e.target.dataset.index;
        const faqs = FAQS_BY_CATEGORY[idx]; 

      

        // Show each FAQ in that category
        faqs.forEach(f => {
            const faqHtml = `<b>${f.question}</b><br/>${f.answer}`;
            addMessage("bot", faqHtml);
        });

        // Add a back button to return to category selection
        addMessage("bot", `<button class="faq-back-btn">← Back to categories</button>`);
    }

    // Back button clicked
    if (e.target.classList.contains("faq-back-btn")) {
        showFaqCategories();
    }
});
} 

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("chatbot-filter-btn")) {
        const terms = e.target.dataset.terms
            .split(",")
            .map(s => s.trim().toLowerCase())
            .filter(Boolean);

        const posts = document.querySelectorAll('#postsContainer > div');

        posts.forEach(post => {
            const title = (post.querySelector('.card-title')?.textContent || "").toLowerCase();
            const desc = (post.querySelector('.item-card p')?.textContent || "").toLowerCase();

            const match = terms.some(term => title.includes(term) || desc.includes(term));

            post.style.display = match ? 'block' : 'none';
        });


        const clearBtn = document.getElementById("clearSearchBtn");
        if (clearBtn) clearBtn.style.display = "inline-block";
    }
});

document.addEventListener("DOMContentLoaded", initChatbot);