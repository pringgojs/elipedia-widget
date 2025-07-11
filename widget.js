(function () {
  const CHAT_URL = "https://dev.elipedia.id/";
  const WIDGET_ID = "elipedia-chat-widget";
  const IFRAME_ID = "elipedia-chat-iframe";
  const BUTTON_ID = "elipedia-chat-toggle";
  const MODAL_ID = "elipedia-login-modal";
  const TOKEN_KEY = "elipedia_jwt_token";

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
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: none;
    color: white;
    font-size: 24px;
    text-align: center;
    line-height: 60px;
    cursor: pointer;
    z-index: 99999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    user-select: none;
  `;

  const MODAL_STYLE = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.4);
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  const MODAL_CONTENT_STYLE = `
    background: #fff;
    border-radius: 10px;
    padding: 32px 24px 24px 24px;
    min-width: 320px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.2);
    position: relative;
  `;
  const CLOSE_BTN_STYLE = `
    position: absolute;
    top: 8px;
    right: 12px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  `;

  function isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  function createIframe() {
    if (document.getElementById(IFRAME_ID)) return;
    const iframe = document.createElement("iframe");
    iframe.id = IFRAME_ID;
    iframe.src = CHAT_URL;
    iframe.style.cssText = IFRAME_STYLE;
    iframe.setAttribute("title", "Elipedia Chat");
    document.body.appendChild(iframe);
  }

  function showIframe() {
    let iframe = document.getElementById(IFRAME_ID);
    if (!iframe) {
      createIframe();
      iframe = document.getElementById(IFRAME_ID);
    }
    iframe.style.display = "block";
  }

  function hideIframe() {
    const iframe = document.getElementById(IFRAME_ID);
    if (iframe) iframe.style.display = "none";
  }

  function createButton() {
    if (document.getElementById(BUTTON_ID)) return;
    const button = document.createElement("div");
    button.id = BUTTON_ID;
    button.innerHTML =
      "<img src='icon.png' alt='Elipedia Chat' style='width: 100%; height: 100%; object-fit: cover;'>";
    button.style.cssText = BUTTON_STYLE;
    button.title = "Buka Chat Elipedia";

    button.addEventListener("click", () => {
      if (isLoggedIn()) {
        const iframe = document.getElementById(IFRAME_ID);
        if (iframe.style.display === "none") {
          showIframe();
        } else {
          hideIframe();
        }
      } else {
        showLoginModal();
      }
    });

    document.body.appendChild(button);
  }

  function showLoginModal() {
    if (document.getElementById(MODAL_ID)) return;
    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.style.cssText = MODAL_STYLE;
    modal.innerHTML = `
      <div style="${MODAL_CONTENT_STYLE}">
        <button id="elipedia-modal-close" style="${CLOSE_BTN_STYLE}" title="Tutup">&times;</button>
        <h3 style="margin-top:0">Login ke Elipedia Chat</h3>
        <form id="elipedia-login-form">
          <label>Email:<br><input type="email" name="email" required style="width:100%;margin-bottom:8px"></label><br>
          <label>Nama:<br><input type="text" name="name" required style="width:100%;margin-bottom:8px"></label><br>
          <label>Username:<br><input type="text" name="username" required style="width:100%;margin-bottom:16px"></label><br>
          <button type="submit" style="width:100%;background:rgb(21 111 39);color:#fff;padding:8px 0;border:none;border-radius:5px;font-size:16px;">Login</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("elipedia-modal-close").onclick = function () {
      modal.remove();
    };

    document.getElementById("elipedia-login-form").onsubmit = function (e) {
      e.preventDefault();
      const email = this.email.value;
      const name = this.name.value;
      const username = this.username.value;
      // Simpan data ke localStorage (atau bisa juga encode dan kirim ke backend)
      const data = {
        email,
        preferred_username: username,
        name,
        sub: window.btoa(email),
      };
      // Simpan x-data ke localStorage (untuk kebutuhan lain)
      localStorage.setItem(
        "elipedia_x_data",
        window.btoa(JSON.stringify(data))
      );
      // Redirect ke login callback (seperti form lama)
      const form = document.createElement("form");
      form.action = "https://dev.elipedia.id/login/callback";
      form.target = "elipedia_login_popup";
      form.method = "GET";
      form.style.display = "none";
      form.innerHTML = `
        <input type="text" name="verify_token" value="UcmkbFpIPjSyLdCxcXDJCesgzCAPauzSn5IgSFivkq" />
        <input type="text" name="fromRedirect" value="true" />
        <input type="text" name="x-data" value="${window.btoa(
          JSON.stringify(data)
        )}" />
        <input type="text" name="widget" value="true" />
      `;
      document.body.appendChild(form);
      // Buka popup login
      const popup = window.open(
        "",
        "elipedia_login_popup",
        "width=500,height=700"
      );
      form.submit();
      // Polling untuk cek apakah popup sudah tertutup
      const pollTimer = setInterval(function () {
        if (popup.closed) {
          clearInterval(pollTimer);
          // Anggap token sudah tersimpan di localStorage oleh backend setelah login
          // Untuk demo, kita simpan token dummy
          localStorage.setItem(TOKEN_KEY, "dummy_token");
          modal.remove();
          location.reload();
        }
      }, 500);
    };
  }

  function initWidget() {
    const container = document.getElementById(WIDGET_ID);
    if (!container) {
      console.error(`[Elipedia Chat] Element with id #${WIDGET_ID} not found.`);
      return;
    }
    createIframe();
    hideIframe();
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
