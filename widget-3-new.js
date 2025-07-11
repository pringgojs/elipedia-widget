(function () {
  const CHAT_URL = "https://dev.elipedia.id/";
  const WIDGET_ID = "elipedia-chat-widget";
  const IFRAME_ID = "elipedia-chat-iframe";
  const BUTTON_ID = "elipedia-chat-toggle";
  const FORM_ID = "elipedia-chat-login-form";

  const VERIFY_TOKEN = "UcmkbFpIPjSyLdCxcXDJCesgzCAPauzSn5IgSFivkq"; // sesuaikan

  let pollInterval;

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
    background: white;
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

  function isLoggedIn() {
    // kamu bisa ubah ini sesuai strategi login-mu (cookie, localStorage, dll)
    return localStorage.getItem("elipedia_logged_in") === "true";
  }

  function checkLoginStatus() {
    // bisa juga panggil fetch API ke endpoint
    return isLoggedIn();
  }

  function startPolling(iframeContainer) {
    pollInterval = setInterval(() => {
      if (checkLoginStatus()) {
        clearInterval(pollInterval);
        iframeContainer.innerHTML = ""; // bersihkan form
        showIframe(iframeContainer);
      }
    }, 1000);
  }

  function showIframe(container) {
    console.log("User is logged in, showing iframe.");
    const iframe = document.createElement("iframe");
    iframe.id = IFRAME_ID;
    iframe.src = CHAT_URL;
    iframe.style.cssText = IFRAME_STYLE;
    iframe.setAttribute("title", "Elipedia Chat");
    iframe.style.display = "block";
    container.appendChild(iframe);
    console.log("Iframe created and added to container.");
  }

  function showLoginForm(container) {
    const formContainer = document.createElement("div");
    formContainer.style.cssText = IFRAME_STYLE;
    formContainer.innerHTML = `
      <form id="${FORM_ID}" target="_blank" method="GET" action="https://dev.elipedia.id/login/callback" style="padding: 20px; font-family: sans-serif;">
        <label>Email:<br/><input type="email" name="email" required /></label><br/><br/>
        <label>Username:<br/><input type="text" name="preferred_username" required /></label><br/><br/>
        <label>Nama:<br/><input type="text" name="name" required /></label><br/><br/>
        <input type="hidden" name="verify_token" value="${VERIFY_TOKEN}" />
        <input type="hidden" name="fromRedirect" value="true" />
        <input type="hidden" name="widget" value="true" />
        <input type="hidden" id="x-data" name="x-data" />
        <button type="submit">Login</button>
      </form>
    `;

    const form = formContainer.querySelector("form");
    form.addEventListener("submit", (e) => {
      const email = form.querySelector('input[name="email"]').value;
      const username = form.querySelector(
        'input[name="preferred_username"]'
      ).value;
      const name = form.querySelector('input[name="name"]').value;

      const data = {
        email,
        preferred_username: username,
        name,
        sub: btoa(email),
      };
      form.querySelector("#x-data").value = btoa(JSON.stringify(data));

      // Mulai polling status login setelah kirim
      setTimeout(() => startPolling(container), 1000);
    });

    container.appendChild(formContainer);
  }

  function createButton(container) {
    const button = document.createElement("div");
    button.id = BUTTON_ID;
    button.innerHTML = "💬";
    button.style.cssText = BUTTON_STYLE;
    button.title = "Buka Chat Elipedia";

    button.addEventListener("click", () => {
      const existingIframe = container.querySelector(`#${IFRAME_ID}`);
      const existingForm = container.querySelector(`#${FORM_ID}`);

      if (existingIframe || existingForm) {
        container.innerHTML = ""; // toggle off
        return;
      }

      console.log("Button clicked, checking login status...");
      if (checkLoginStatus()) {
        console.log("User is logged in, showing iframe.");
        showIframe(container);
        console.log("Iframe shown.");
      } else {
        showLoginForm(container);
      }
    });

    document.body.appendChild(button);
  }

  function initWidget() {
    const container = document.createElement("div");
    container.id = WIDGET_ID;
    document.body.appendChild(container);

    createButton(container);
  }

  // Init saat DOM ready
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    initWidget();
  } else {
    document.addEventListener("DOMContentLoaded", initWidget);
  }
})();
