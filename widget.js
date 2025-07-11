(function () {
  const CHAT_URL = "https://dev.elipedia.id/";
  const WIDGET_ID = "elipedia-chat-widget";
  const IFRAME_ID = "elipedia-chat-iframe";
  const BUTTON_ID = "elipedia-chat-toggle";
  const TOKEN_KEY = "elipedia_jwt_token";
  const FORM_ACTION = "https://dev.elipedia.id/login/callback"; // URL untuk mengirim data login

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

  const FLOAT_CONTAINER_ID = "elipedia-floating-container";

  function isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  function isWidgetVisible() {
    return document.getElementById(FLOAT_CONTAINER_ID) !== null;
  }

  function hideWidget() {
    const float = document.getElementById(FLOAT_CONTAINER_ID);
    if (float) float.remove();
  }

  function showWidgetContainer() {
    let float = document.getElementById(FLOAT_CONTAINER_ID);
    if (!float) {
      float = document.createElement("div");
      float.id = FLOAT_CONTAINER_ID;
      float.style.position = "fixed";
      float.style.bottom = "80px";
      float.style.right = "20px";
      float.style.width = "350px";
      float.style.height = "500px";
      float.style.zIndex = "99999";
      float.style.display = "flex";
      float.style.alignItems = "center";
      float.style.justifyContent = "center";
      float.style.background = "none";
      float.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
      float.style.borderRadius = "10px";
      float.style.padding = "0";
      document.body.appendChild(float);
    }
    return float;
  }

  function showLoginInWidget() {
    const float = showWidgetContainer();
    float.innerHTML = `
      <div style="background:#fff;border-radius:10px;padding:24px 16px;max-width:100%;width:100%;height:100%;box-shadow:0 2px 8px rgba(0,0,0,0.08);font-family:Arial,sans-serif;display:flex;flex-direction:column;justify-content:center;align-items:center;">
        <h3 style="margin-top:0;margin-bottom:1.5rem;font-size:1.25rem;font-weight:600;text-align:center;color:#166534;">Login ke Elipedia Chat</h3>
        <form id="elipedia-login-form" autocomplete="off" style="display:flex;flex-direction:column;gap:1rem;width:100%;">
          <label style="font-size:.95rem;font-weight:500;color:#222;width:100%;">Email
            <input type="email" name="email" required style="font-size:14px;border-radius:6px;line-height:1.5;padding:5px 10px;border:2px solid #dee1e2;color:rgb(14,14,16);background:#dee1e2;display:block;height:32px;width:100%;margin-top:0.25rem;">
          </label>
          <label style="font-size:.95rem;font-weight:500;color:#222;width:100%;">Nama
            <input type="text" name="name" required style="font-size:14px;border-radius:6px;line-height:1.5;padding:5px 10px;border:2px solid #dee1e2;color:rgb(14,14,16);background:#dee1e2;display:block;height:32px;width:100%;margin-top:0.25rem;">
          </label>
          <label style="font-size:.95rem;font-weight:500;color:#222;width:100%;">Username
            <input type="text" name="username" required style="font-size:14px;border-radius:6px;line-height:1.5;padding:5px 10px;border:2px solid #dee1e2;color:rgb(14,14,16);background:#dee1e2;display:block;height:32px;width:100%;margin-top:0.25rem;">
          </label>
          <button type="submit" style="margin-top:.5rem;width:100%;background:linear-gradient(90deg,#166534,#22c55e);color:#fff;padding:.75rem 0;border:none;border-radius:.5rem;font-size:1.1rem;font-weight:600;box-shadow:0 2px 8px rgba(34,197,94,0.08);transition:background .2s,box-shadow .2s;cursor:pointer;">Login</button>
        </form>
      </div>
    `;
    const form = document.getElementById("elipedia-login-form");
    form.onsubmit = function (e) {
      e.preventDefault();
      const email = this.email.value;
      const name = this.name.value;
      const username = this.username.value;
      const data = {
        email,
        preferred_username: username,
        name,
        sub: window.btoa(email),
      };
      localStorage.setItem(
        "elipedia_x_data",
        window.btoa(JSON.stringify(data))
      );
      // Redirect ke login callback (seperti form lama)
      const tempForm = document.createElement("form");
      tempForm.action = FORM_ACTION;
      tempForm.target = "elipedia_login_popup";
      tempForm.method = "GET";
      tempForm.style.display = "none";
      tempForm.innerHTML = `
        <input type="text" name="verify_token" value="UcmkbFpIPjSyLdCxcXDJCesgzCAPauzSn5IgSFivkq" />
        <input type="text" name="fromRedirect" value="true" />
        <input type="text" name="x-data" value="${window.btoa(
          JSON.stringify(data)
        )}" />
        <input type="text" name="widget" value="true" />
      `;
      document.body.appendChild(tempForm);
      const popup = window.open(
        "",
        "elipedia_login_popup",
        "width=500,height=700"
      );
      tempForm.submit();
      const pollTimer = setInterval(function () {
        if (popup.closed) {
          clearInterval(pollTimer);
          localStorage.setItem(TOKEN_KEY, "dummy_token");
          // Setelah login, kosongkan container, iframe hanya muncul jika user klik toggle lagi
          hideWidget();
        }
      }, 500);
    };
  }

  function showIframeInWidget() {
    const float = showWidgetContainer();
    float.innerHTML = "";
    let iframe = document.getElementById(IFRAME_ID);
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = IFRAME_ID;
      iframe.src = CHAT_URL;
      iframe.style.cssText =
        IFRAME_STYLE + "position:static;display:block;width:100%;height:100%;";
      iframe.setAttribute("title", "Elipedia Chat");
    }
    float.appendChild(iframe);
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
      if (isWidgetVisible()) {
        hideWidget();
      } else {
        if (isLoggedIn()) {
          showIframeInWidget();
        } else {
          showLoginInWidget();
        }
      }
    });

    document.body.appendChild(button);
  }

  function initWidget() {
    // Tidak perlu cek container widget utama lagi
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
