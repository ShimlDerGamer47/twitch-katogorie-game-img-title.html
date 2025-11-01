document.addEventListener("DOMContentLoaded", () => {
  try {
    const html = document.documentElement;
    const params = new URLSearchParams(window.location.search);

    let gameId = params.get("gameId");
    let game = params.get("game");
    let targetChannelTitle = params.get("targetChannelTitle");
    const targetUserProfileImageId = params.get("targetUserProfileImageId");

    const fontFamilyVar = "--font-family";
    const robotoBold = getComputedStyle(html)
      .getPropertyValue(fontFamilyVar)
      .trim();
    const body = document.body;
    if (robotoBold) body.style.fontFamily = robotoBold;
    body.style.background = "rgba(0, 0, 0, 0)";

    const widthStyle = 350;
    const heightStyle = 600;

    const borderVar = "--border";
    const rootBorder = getComputedStyle(html)
      .getPropertyValue(borderVar)
      .trim();

    let styleElement = document.querySelector("style");

    const get = (id) => document.getElementById(id);

    const mainDiv = get("mainContainerId");
    const subDiv = get("subContainerId");
    const gameImgDiv = get("gameImgContainerId");
    const imgGame = get("imgGameId");
    const subGameTitleDiv = get("subGameTitleContainerId");
    const categoryGameTitleDiv = get("categoryGameTitleContainerId");
    const categoryGameTitleHone = get("categoryGameTitleId");
    const streamTitleDiv = get("streamTitleContainerId");
    const streamTitleHTwo = get("streamTitleId");

    if (imgGame) {
      imgGame.style.visibility = "hidden";
      imgGame.style.opacity = "0";
    }

    if (categoryGameTitleHone) {
      categoryGameTitleHone.style.visibility = "hidden";
      categoryGameTitleHone.style.opacity = "0";
    }

    if (streamTitleHTwo) {
      streamTitleHTwo.style.visibility = "hidden";
      streamTitleHTwo.style.opacity = "0";
    }

    const timeNumber = 2000;

    const randomColorToken = () => {
      const randomColor = `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")}`;

      if (game && gameId && widthStyle && heightStyle) {
        styleElement.innerHTML = `
          :root {
            --random-color: ${randomColor};
          }

          .img-game[alt="${game}"] {
            background: rgba(0, 0, 0, 0);
            background-image: url("https://static-cdn.jtvnw.net/ttv-boxart/${gameId}-${widthStyle}x${heightStyle}.jpg");
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            background-origin: content-box;
            -webkit-background-clip: text;
            -webkit-text-fill-color: rgba(0, 0, 0, 0);
            background-clip: text;
            display: flex;
            align-items: center;
            align-content: center;
            justify-items: center;
            justify-content: center;
            border: var(--border);
            border-radius: 5px;
            padding: 0px 0px;
            margin: 1.5px 1.5px 1.5px 1.5px;
            text-align: center;
            font-size: 80px;
            color: rgba(0, 0, 0, 0);
            text-decoration: none;
            transition: opacity 420ms cubic-bezier(.2,.9,.2,1), 
            transform 420ms cubic-bezier(.2,.9,.2,1);
          }

          .underline-random-color {
            position: relative;
          }

          .underline-random-color::after {
            content: "";
            background: var(--random-color);
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 3px;
            transform: scaleX(1);
            transition: background ${timeNumber}ms ease-in-out;
          }
        `;
      }
    };
    randomColorToken();
    setInterval(randomColorToken, timeNumber);

    const underlineClass = "underline-random-color";

    const exampleAspectRatio = 300;

    function setTitleWithLabel(el, label, text, bgUrl) {
      if (!el) return;
      el.textContent = "";
      el.appendChild(document.createTextNode(label));
      el.appendChild(document.createElement("br"));
      el.appendChild(document.createTextNode(text || ""));
      if (bgUrl) {
        el.style.backgroundImage = `url(${bgUrl})`;
      } else {
        el.style.backgroundImage = "";
      }
    }

    function showElement(el) {
      if (!el) return;
      el.style.visibility = "visible";
      el.style.opacity = "1";
      el.style.transform = "translateY(0) scale(1)";
    }

    function hideElement(el) {
      if (!el) return;
      el.style.visibility = "hidden";
      el.style.opacity = "0";
      el.style.transform = "translateY(6px) scale(0.995)";
    }

    if (imgGame) {
      imgGame.addEventListener("load", () => {
        imgGame.style.visibility = "visible";
        imgGame.style.opacity = "1";
        imgGame.style.transition =
          "visibility 420ms cubic-bezier(.2,.9,.2,1), opacity 420ms cubic-bezier(.2,.9,.2,1)";
      });

      imgGame.addEventListener("error", () => {
        imgGame.style.removeProperty("visibility");
        imgGame.removeAttribute("src");
        console.warn(
          "Boxart konnte nicht geladen werden:",
          imgGame.alt || gameId
        );
      });
    }

    function fitTextToBox(el, options = {}) {
      if (!el) return;

      const minFont = options.minFont || 8;
      const computed = window.getComputedStyle(el);
      const cssMaxFont = parseFloat(computed.fontSize) || 100;

      el.style.whiteSpace = "pre-wrap";
      el.style.wordBreak = "break-word";

      let availableW = el.clientWidth;
      let availableH = el.clientHeight;
      if (!availableW || !availableH) {
        const rect = el.getBoundingClientRect();
        availableW = rect.width;
        availableH = rect.height;
      }

      if (!availableW || !availableH) return;

      const highLimit = Math.max(
        minFont,
        Math.floor(Math.min(cssMaxFont, availableH))
      );

      let low = minFont;
      let high = highLimit;
      let best = minFont;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        el.style.fontSize = mid + "px";

        const fitsWidth = el.scrollWidth <= availableW + 1;
        const fitsHeight = el.scrollHeight <= availableH + 1;

        if (fitsWidth && fitsHeight) {
          best = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      el.style.fontSize = best + "px";
      el.style.lineHeight = "1.05";
    }

    function fitAllTitles() {
      requestAnimationFrame(() => {
        if (categoryGameTitleHone) fitTextToBox(categoryGameTitleHone);

        if (streamTitleHTwo) fitTextToBox(streamTitleHTwo);
      });
    }

    function updateOverlay(newGame, newGameId, newTitle) {
      if (typeof newGame !== "undefined" && newGame !== null)
        game = newGame || "";

      if (typeof newGameId !== "undefined" && newGameId !== null)
        gameId = newGameId || "";

      if (typeof newTitle !== "undefined" && newTitle !== null)
        targetChannelTitle = newTitle || "";

      const gameImgUrl = gameId
        ? `https://static-cdn.jtvnw.net/ttv-boxart/${gameId}-${widthStyle}x${heightStyle}.jpg`
        : "";

      const targetUserProfileImageUrl = targetUserProfileImageId
        ? `https://static-cdn.jtvnw.net/jtv_user_pictures/${targetUserProfileImageId}-profile_image-${exampleAspectRatio}x${exampleAspectRatio}.png`
        : "";

      if (gameImgUrl) {
        imgGame.width = widthStyle;
        imgGame.height = heightStyle;
        imgGame.src = gameImgUrl;
        imgGame.alt = game;
      } else {
        if (imgGame) {
          imgGame.removeAttribute("src");
          hideElement(imgGame);
        }
      }

      setTitleWithLabel(
        categoryGameTitleHone,
        "Kategorie:",
        game || "",
        gameImgUrl
      );

      setTitleWithLabel(
        streamTitleHTwo,
        "Stream Titel:",
        targetChannelTitle || "",
        targetUserProfileImageUrl
      );

      if (gameImgDiv && imgGame && underlineClass) {
        gameImgDiv.classList.remove(underlineClass);
        imgGame.classList.add(underlineClass);
      }

      if (categoryGameTitleHone && underlineClass) {
        categoryGameTitleHone.classList.add(underlineClass);
      }

      if (streamTitleHTwo && underlineClass) {
        streamTitleHTwo.classList.add(underlineClass);
      }

      try {
        randomColorToken();
      } catch (e) {
        console.warn("randomColorToken konnte nicht aufgerufen werden:", e);
      }

      if (game) showElement(categoryGameTitleHone);
      if (targetChannelTitle) showElement(streamTitleHTwo);

      fitAllTitles();
    }

    let rawWs;
    let rawWsConnected = false;

    function startRawWs() {
      try {
        rawWs = new WebSocket("ws://127.0.0.1:8080/");

        rawWs.addEventListener("open", () => {
          console.log("RAW WebSocket erfolgreich verbunden (PRIMÄR)");
          rawWsConnected = true;
        });

        rawWs.addEventListener("message", (ev) => {
          let parsed;
          try {
            parsed = JSON.parse(ev.data);
          } catch (e) {
            parsed = null;
          }

          const type = parsed?.type ?? parsed?.event ?? parsed?.name ?? null;

          const payload =
            parsed?.data ?? parsed?.payload ?? parsed?.args ?? parsed ?? null;

          if (type && type.toString().includes("StreamUpdated")) {
            const evGame = payload?.game ?? payload?.category ?? "";
            const evGameId = payload?.gameId ?? payload?.game_id ?? "";
            const evTitle = payload?.title ?? payload?.streamTitle ?? "";
            updateOverlay(evGame, evGameId, evTitle);
          }
        });

        rawWs.addEventListener("close", () => {
          console.warn("RAW WebSocket Verbindung geschlossen");
          rawWsConnected = false;
        });

        rawWs.addEventListener("error", (err) => {
          console.error("RAW WebSocket Fehler:", err);
          rawWsConnected = false;
        });
      } catch (e) {
        console.error("RAW WebSocket konnte nicht gestartet werden:", e);
        rawWsConnected = false;
      }
    }

    let client;
    let clientConnected = false;

    function startClientLibrary() {
      try {
        client = new StreamerbotClient({
          host: "127.0.0.1",
          port: 8080,
        });

        if (typeof client.connect === "function") {
          try {
            client.connect();
            console.log("StreamerbotClient Library gestartet (FALLBACK)");
            clientConnected = true;
          } catch (e) {
            console.warn("StreamerbotClient.connect() fehlgeschlagen:", e);
          }
        }

        if (client && typeof client.on === "function") {
          client.on("Twitch.StreamUpdated", (data) => {
            try {
              const payload = data && data.data ? data.data : data;
              const evGame = payload.game ?? payload.category ?? "";
              const evGameId = payload.gameId ?? payload.game_id ?? "";
              const evTitle = payload.title ?? payload.streamTitle ?? "";
              updateOverlay(evGame, evGameId, evTitle);
            } catch (e) {
              console.error(
                "Fehler beim Verarbeiten von Streamer.bot Event:",
                e
              );
            }
          });
        }
      } catch (e) {
        console.warn(
          "StreamerbotClient Library konnte nicht instanziiert werden:",
          e
        );
        client = null;
        clientConnected = false;
      }
    }

    console.log("Starte primäre RAW WebSocket Verbindung...");
    startRawWs();

    setTimeout(() => {
      if (!rawWsConnected) {
        console.log(
          "RAW WebSocket nicht verbunden. Starte Streamer.bot Client Library als Fallback..."
        );
        startClientLibrary();
      } else {
        console.log(
          "RAW WebSocket erfolgreich verbunden. Kein Fallback nötig."
        );
      }
    }, 1000);

    updateOverlay(game, gameId, targetChannelTitle);

    function htmlElementsStyleToken() {
      const elementArray = [
        mainDiv,
        subDiv,
        gameImgDiv,
        imgGame,
        subGameTitleDiv,
        categoryGameTitleDiv,
        categoryGameTitleHone,
        streamTitleDiv,
        streamTitleHTwo,
      ];

      const eventArray = ["copy", "dragstart", "keydown", "select"];

      const dataStyle = {
        fontFamily: robotoBold,
        border: rootBorder,
        WebkitUserSelect: "none",
        userSelect: "none",
        cursor: "default",
        pointerEvents: "none",
      };

      elementArray.forEach((element) => {
        if (!element) return;

        eventArray.forEach((event) => {
          if (!event) return;

          element.addEventListener(event, (e) => e.preventDefault());
        });

        if (dataStyle) Object.assign(element.style, dataStyle);
      });
    }
    htmlElementsStyleToken();

    window.addEventListener("resize", () => {
      if (window._fitAllTimeout) clearTimeout(window._fitAllTimeout);
      window._fitAllTimeout = setTimeout(() => {
        fitAllTitles();
      }, 80);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          fitAllTitles();
        })
        .catch(() => {
          // ignore
        });
    }
  } catch (error) {
    console.error("Fehler:", error);
  }
});
