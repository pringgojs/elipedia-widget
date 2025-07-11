(function () {
  const CHAT_URL = "https://dev.elipedia.id/";
  // const CHAT_URL = "https://nandurpanguripan.ponorogo.go.id/";
  // const CHAT_URL = "http://127.0.0.1:8000/iframe-check";
  const WIDGET_ID = "elipedia-chat-widget";
  const IFRAME_ID = "elipedia-chat-iframe";
  const BUTTON_ID = "elipedia-chat-toggle";

  // Styles
  const IFRAME_STYLE = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 350px;
    height: 500px;
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 99999;
    display: none;
  `;

  const BUTTON_STYLE = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: rgb(21 111 39);
    color: white;
    font-size: 24px;
    text-align: center;
    line-height: 60px;
    cursor: pointer;
    z-index: 99999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    user-select: none;
  `;

  function createIframe() {
    const iframe = document.createElement("iframe");
    // const token = localStorage.getItem("jwt_token");

    iframe.id = IFRAME_ID;
    iframe.src = CHAT_URL;
    iframe.style.cssText = IFRAME_STYLE;
    iframe.setAttribute("title", "Elipedia Chat");
    // iframe.contentWindow.postMessage({ token }, CHAT_URL);
    document.body.appendChild(iframe);
  }

  function createButton() {
    const button = document.createElement("div");
    button.id = BUTTON_ID;
    button.innerHTML = "💬";
    button.style.cssText = BUTTON_STYLE;
    button.title = "Buka Chat Elipedia";

    button.addEventListener("click", () => {
      const iframe = document.getElementById(IFRAME_ID);
      if (iframe.style.display === "none") {
        iframe.style.display = "block";
      } else {
        iframe.style.display = "none";
      }
    });

    document.body.appendChild(button);
  }

  function initWidget() {
    const container = document.getElementById(WIDGET_ID);
    if (!container) {
      console.error(`[Elipedia Chat] Element with id #${WIDGET_ID} not found.`);
      return;
    }

    createIframe();
    createButton();
  }

  // Jalankan ketika DOM siap
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    initWidget();
  } else {
    document.addEventListener("DOMContentLoaded", initWidget);
  }
})();
