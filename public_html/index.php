<?php

// redirect to https version of the url
function isSSL()
{
  if (!empty($_SERVER['HTTPS'])) {
    return true;
  }
  if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && ($_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) {
    return true;
  }
  return false;
}
if (!isSSL()) {
  header("Location: https://".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"]);
  exit();
}

?><!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Pinball game" />
    <title>Croonwolterendros Flipperkast</title>
    <link href="styles/main.css?v=4" rel="stylesheet"/>
  </head>
  <body>
    <div class="page__container">
      <!-- loading -->
      <div class="page page__loading page--is-visible" id="loading-page">
        <div class="loading__title">Loading...</div>
      </div>
      <!-- introduction -->
      <div class="page page__introduction" id="introduction-page">
        <div class="introduction__logo-container">
          <img class="introduction__logo-image" src="images/logo.png" alt="croonwolters & dros | TBI"/>
        </div>
        <h1 class="introduction__title introduction__label">Pinball game</h1>
        <p class="introduction__text">
          Bedankt voor het samen scoren in 2023.<br/>Samen gaan we voor de highscore in 2024!
        </p>
        <ul class="introduction__explanation">
          <li><strong>Pijl links of 'A'</strong>: linker flipper</li>
          <li><strong>Pijl rechts of 'D'</strong>: rechter flipper</li>
          <li><strong>Pijl beneden of 'S'</strong>: launcher naar beneden</li>
          <li><strong>Spatiebalk</strong>: geef een duw, maar pas op: niet te vaak of de kast gaat op tilt!</li>
        </ul>
        <p class="introduction__highscore">
          <span class="introduction__label">Highscore</span>
          <span class="introduction__value" id="introduction-highscore">000000</span>
        </p>
        <button class="introduction__start-button-container" id="introduction-start-button">
          <img class="introduction__start-button-image" src="images/start_button.png" alt="Start game"/>
        </button>
      </div>
      <!-- game over -->
      <div class="page page__finished" id="finished-page">
        <div class="finished__logo-container">
          <img class="finished__logo-image" src="images/logo.png" alt="croonwolters & dros | TBI"/>
        </div>
        <h1 class="finished__title finished__label">Game over</h1>
        <p class="finished__score">
          <span class="finished__label">Your score</span>
          <span class="finished__value" id="finished-your-score">000000</span>
        </p>
        <button class="finished__start-button-container" id="finished-start-button">
          <img class="finished__start-button-image" src="images/start_button.png" alt="Start game"/>
        </button>
      </div>
      <!-- game -->
      <div class="page page__game" id="game-page">
        <div
          id="canvas-container"
          class="canvas-container"
        >
          <div class="sound-toggle__container" id="sound-toggle-container">
            <button class="sound-toggle__button" id="sound-toggle-button">
              <img
                id="sound-toggle-speaker-on"
                class="sound-toggle__image sound-toggle__image--is-visible"
                src="images/speaker_on.png"
                alt="Speaker on"
              />
              <img
                id="sound-toggle-speaker-off"
                class="sound-toggle__image"
                src="images/speaker_off.png"
                alt="Speaker off"
              />
            </button>
          </div>
        </div>
        <div class="message__container">
          <div class="message__text message__text--hidden" id="message-text"></div>
        </div>
        <div class="status-display__container" id="status-display-container">
          <div class="status-display__logo-container">
            <img class="status-display__logo-image" src="images/logo.png" alt="croonwolters & dros | TBI"/>
          </div>
          <div class="status-display__entry status-display__entry--is-your-score">
            <span class="status-display__label">Your score</span>
            <span class="status-display__value" id="status-your-score">000000</span>
          </div>
          <div class="status-display__entry status-display__entry--is-balls">
            <span class="status-display__label">Balls</span>
            <span class="status-display__value" id="status-balls">0 / 3</span>
          </div>
          <div class="status-display__entry status-display__entry--is-highscore">
            <span class="status-display__label">Highscore</span>
            <span class="status-display__value" id="status-highscore">000000</span>
          </div>
        </div>
        <div
          class="touch-area touch-area--left"
          id="touch-area-left"
        ></div>
        <div
          class="touch-area touch-area--right"
          id="touch-area-right"
        ></div>
      </div>
    </div>
    <script src="scripts/pathseg.js"></script>
    <script src="scripts/bundle.js" type="application/javascript"></script>
  </body>
</html>
