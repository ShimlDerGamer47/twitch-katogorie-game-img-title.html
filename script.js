document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const fontFamily = "--font-family";
  const robotoBold = getComputedStyle(html).getPropertyValue(fontFamily).trim();
  const body = document.body;

  Object.assign(body.style, {
    fontFamily: robotoBold,
    background: "transparent",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    margin: 0
  });

  const titleTxt = document.getElementById("titleTxtId");
  if (!titleTxt) {
    console.warn("Element #titleTxtId nicht gefunden");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const gameName = params.get("gameName");
  const gameId = params.get("gameId");
  const width = params.get("width") || "1080";
  const height = params.get("height") || "1920";
  const fontSize = params.get("fontSize");
  const textDecor = params.get("textDecoration");

  if (fontSize) {
    titleTxt.style.fontSize = /^\d+$/.test(fontSize)
      ? fontSize + "px"
      : fontSize;
  }
  if (textDecor) {
    titleTxt.style.textDecoration = textDecor;
  }

  if (gameId) {
    const twitchTitleImg = `url("https://static-cdn.jtvnw.net/ttv-boxart/${gameId}-${width}x${height}.jpg")`;
    titleTxt.style.backgroundImage = twitchTitleImg;
  } else {
    console.warn(
      "Kein gameId-Parameter übergeben – Hintergrundbild nicht gesetzt"
    );
  }

  titleTxt.textContent = gameName;

  fitTextToContainer(titleTxt, {
    minFontSize: 16, // px
    maxFontSize: 120 // px
  });

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => fitTextToContainer(titleTxt));
    ro.observe(titleTxt.parentElement);
  }
});

/**
 * @param {HTMLElement} el
 * @param {{minFontSize?: number, maxFontSize?: number}} options
 */
function fitTextToContainer(el, { minFontSize = 12, maxFontSize = 200 } = {}) {
  const parentWidth = el.parentElement.clientWidth;

  const style = getComputedStyle(el);
  const currentPx = parseFloat(style.fontSize);

  const textWidth = el.scrollWidth;

  let newSize = currentPx * (parentWidth / textWidth);

  newSize = Math.max(minFontSize, Math.min(maxFontSize, newSize));

  el.style.fontSize = `${newSize}px`;
}
