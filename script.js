document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const fontFamily = "--font-family";
  const robotoBold = getComputedStyle(html).getPropertyValue(fontFamily).trim();
  const body = document.body;
  body.style.fontFamily = robotoBold;
  body.style.background = "transparent";

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
  const textDecoration = params.get("textDecoration");

  if (fontSize) {
    titleTxt.style.fontSize = /^\d+$/.test(fontSize)
      ? fontSize + "px"
      : fontSize;
  }

  if (textDecoration) {
    titleTxt.style.textDecoration = textDecoration;
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
});
