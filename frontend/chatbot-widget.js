// chatbot-widget.js
document.addEventListener("DOMContentLoaded", () => {
  // If already injected, do nothing
  if (document.getElementById("chatbotBtn")) return;


  // Find your existing floating button container (the one with inline style bottom/right)
  const floatingContainers = document.querySelectorAll('div.position-fixed[style*="bottom: 2rem"][style*="right: 2rem"]');
  const floatingContainer = floatingContainers.length ? floatingContainers[0] : null;


  // Chatbot button HTML
  const chatbotBtnHTML = `
    <!-- CHATBOT: injected floating button -->
    <button class="chatbot-btn" id="chatbotBtn" title="Chatbot" aria-label="Open chatbot">💬</button>
  `;


  // If your floating container exists, insert chatbot button ABOVE the + button
  if (floatingContainer) {
    floatingContainer.insertAdjacentHTML("afterbegin", chatbotBtnHTML);
  } else {
    // fallback: place button bottom-right if container not found
    document.body.insertAdjacentHTML("beforeend", `
      <div class="position-fixed" style="bottom: 2rem; right: 2rem; z-index: 1000;">
        ${chatbotBtnHTML}
      </div>
    `);
  }


  // Chatbot window HTML (injected near end of body)
  const chatbotWindowHTML = `
    <!-- CHATBOT: injected window -->
    <div class="chatbot-window" id="chatbotWindow">
      <div class="chatbot-header">
        <div class="title">Lost & Found Chatbot</div>
        <button id="chatbotClose" aria-label="Close chatbot">✕</button>
      </div>


      <div class="chatbot-messages" id="chatbotMessages"></div>


      <div class="chatbot-input">
        <input id="chatbotInput" type="text" placeholder="Type here… (ex: I lost my wallet)" />
        <button id="chatbotSend" type="button">Send</button>
      </div>
    </div>
  `;


  document.body.insertAdjacentHTML("beforeend", chatbotWindowHTML);
});

