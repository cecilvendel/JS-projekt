"use strict";

/**
 * Gemmer brugerens svar på et spørgsmål i localStorage.
 */
function gemSvar(postId, svar) {
  let quizSvar = JSON.parse(localStorage.getItem("quizSvar")) || {};
  quizSvar[postId] = svar;
  localStorage.setItem("quizSvar", JSON.stringify(quizSvar));
}

/**
 * Oversætter resultattitlen fra sidste gang.
 */
function oversaetResultat(result) {
  if (result === "Sharenting") return "Den åbne deler";
  if (result === "betænksom") return "Den intuitive deler";
  return result;
}

/**
 * Viser tidligere resultat hvis der findes et i localStorage.
 */
function visTidligereResultat() {
  const quizEl = document.getElementById("quiz-container");
  const previousResultContainer = document.getElementById(
    "previous-result-container"
  );
  const previousResult = document.getElementById("previous-result");
  const result = localStorage.getItem("savedResult");

  if (result) {
    if (quizEl) quizEl.style.display = "none";
    if (previousResultContainer && previousResult) {
      previousResult.innerHTML = `Dit gemte resultat: <span class="result-type">${oversaetResultat(
        result
      )}</span>`;
      previousResultContainer.style.display = "block";
    }
  } else {
    if (quizEl) quizEl.style.display = "block";
    if (previousResultContainer) previousResultContainer.style.display = "none";
  }
}

/**
 * Tilføjer eventlisteners til alle "prøv igen"-knapper.
 */
function setupRetryBtns() {
  const quizEl = document.getElementById("quiz-container");
  const previousResultContainer = document.getElementById(
    "previous-result-container"
  );

  document.querySelectorAll(".retry-btn").forEach(function (retryBtn) {
    retryBtn.addEventListener("click", function () {
      localStorage.removeItem("savedResult");
      if (previousResultContainer)
        previousResultContainer.style.display = "none";
      if (quizEl) quizEl.style.display = "block";
      if (typeof restartQuiz === "function") restartQuiz();
    });
  });
}

/**
 * Opsætter lightbox-funktionalitet for banner-billeder.
 */
function setupLightbox() {
  document.querySelectorAll(".banner-img").forEach((img) => {
    img.addEventListener("click", function () {
      const src = img.getAttribute("data-full") || img.src;
      const lightbox = document.getElementById("lightbox");
      const lightboxImg = document.getElementById("lightbox-img");
      lightboxImg.src = src;
      lightbox.classList.add("show");
    });
  });

  document
    .getElementById("lightbox-close")
    .addEventListener("click", function () {
      document.getElementById("lightbox").classList.remove("show");
    });

  document.getElementById("lightbox").addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("show");
  });
}

/**
 * Indsætter post-header template i relevante containere.
 */
function insertPostHeaderTemplates() {
  document.querySelectorAll(".insert-post-header").forEach((container) => {
    const template = document.getElementById("post-header-template");

    if (template) {
      const clone = template.content.cloneNode(true);
      container.appendChild(clone);
    }
  });
}

/**
 * Skjuler alle spørgsmål og slutskærme.
 */
function hideAllScreens() {
  questionPosts.forEach((post) => (post.style.display = "none"));
  endScreens.forEach((screen) => screen && (screen.style.display = "none"));
}

/**
 * Viser et specifikt spørgsmål (index).
 */
function showPost(index) {
  hideAllScreens();
  questionPosts[index].style.display = "block";
}

/**
 * Håndterer alle knaptryk i quizzen.
 */
function handleButtonClick(event) {
  const id = event.target.id;

  switch (id) {
    case "no-btn":
      hideAllScreens();
      const noshareEl = document.getElementById("Noshare");
      if (noshareEl) noshareEl.style.display = "block";
      break;
    case "some-btn":
    case "c1":
    case "c2":
    case "c3":
    case "c4":
    case "c5":
    case "c6":
      handleAnswer(id);
      break;
    default:
  }
}

/**
 * Registrerer hvis brugeren har valgt at dele.
 */
function handleAnswer(id) {
  let postId, svar;

  if (id === "c1" || id === "c2") {
    postId = "post2";
    svar = id === "c1" ? "del" : "del_ikke";
  } else if (id === "c3" || id === "c4") {
    postId = "post3";
    svar = id === "c3" ? "del" : "del_ikke";
  } else if (id === "c5" || id === "c6") {
    postId = "post4";
    svar = id === "c5" ? "del" : "del_ikke";
  }

  if (svar && postId) {
    gemSvar(postId, svar);
  }

  if (id === "c1" || id === "c3" || id === "c5") {
    shareCount++;
  }

  nextPost();
}

/**
 * Viser næste spørgsmål eller slutter quizzen.
 */
function nextPost() {
  if (currentPost < questionPosts.length - 1) {
    currentPost++;
    showPost(currentPost);
  } else {
    finishQuiz();
  }
}

/**
 * Viser slutskærm baseret på brugerens adfærd.
 */
function finishQuiz() {
  hideAllScreens();

  if (shareCount >= 2) {
    const sharentingEl = document.getElementById("Sharenting");
    if (sharentingEl) sharentingEl.style.display = "block";
  } else {
    const betEl = document.getElementById("betænksom");
    if (betEl) betEl.style.display = "block";
  }
}

/**
 * Nulstiller quizzen.
 */
function restartQuiz() {
  currentPost = 0;
  shareCount = 0;
  hideAllScreens();
  showPost(currentPost);
  localStorage.removeItem("quizSvar");
}

/**
 * Lytter efter alle knaptryk i quizzen.
 */
function setupQuizButtons() {
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", handleButtonClick);
  });
}

/**
 * Lytter efter tryk på "prøv igen"-knapper.
 */
function setupRestartBtns() {
  document.querySelectorAll(".restart-btn").forEach((button) => {
    button.addEventListener("click", restartQuiz);
  });
}

/**
 * Henter ID på den synlige slutskærm.
 */
function getVisibleEndScreen() {
  const screens = ["Sharenting", "betænksom", "Noshare"];
  return screens.find((id) => {
    const el = document.getElementById(id);
    return el && el.style.display === "block";
  });
}

/**
 * Gemmer resultat til localStorage.
 */
function saveResultToLocalStorage(shownScreen) {
  if (shownScreen) {
    localStorage.setItem("savedResult", shownScreen);
    alert("Dit resultat er gemt! Du kan se det næste gang du besøger siden.");
  } else {
    alert("Kunne ikke gemme resultat.");
  }
}

/**
 * Sætter eventlistener på alle gem-resultat knapper.
 */
function setupSaveResultBtns() {
  document.querySelectorAll(".save-result-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const shownScreen = getVisibleEndScreen();
      saveResultToLocalStorage(shownScreen);
    });
  });
}

/**
 * Sætter eventlistener på alle vis svar-knapper.
 */
function setupShowAnswersBtns() {
  document.querySelectorAll(".show-answers-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const quizSvar = JSON.parse(localStorage.getItem("quizSvar")) || {};
      const spmTekster = {
        post2: "Strandbillede",
        post3: "Barn græder",
        post4: "Nyfødt",
      };
      const spmBilleder = {
        post2: "img/pige ved strand.png",
        post3: "img/drenggræder.png",
        post4: "img/nyfødt.png",
      };
      let html = "<ul>";

      for (let postId in spmTekster) {
        const svar = quizSvar[postId];
        let svarTekst = "Ikke besvaret";

        if (svar === "del")
          svarTekst = "<span style='font-weight:bold'>Jeg ville dele</span>";
        if (svar === "del_ikke")
          svarTekst =
            "<span style='font-weight:bold'>Jeg ville ikke dele</span>";
        const billede = spmBilleder[postId]
          ? `<img src="${spmBilleder[postId]}" alt="" class="svar-thumb">`
          : "";

        html += `<li>${billede}${svarTekst}</li>`;
      }

      html += "</ul>";
      document.getElementById("answers-list").innerHTML = html;
      document.getElementById("answers-popup").style.display = "block";
    });
  });

  const closeAnsBtn = document.getElementById("close-answers-popup");

  if (closeAnsBtn) {
    closeAnsBtn.addEventListener("click", function () {
      document.getElementById("answers-popup").style.display = "none";
    });
  }
}

/**
 * --------- Samlede variabler ---------
 */
const questionPosts = document.querySelectorAll(
  "#quiz-container .postLayout:not(#Noshare):not(#Sharenting):not(#betænksom)"
);
let currentPost = 0;
const endScreens = [
  document.getElementById("Noshare"),
  document.getElementById("Sharenting"),
  document.getElementById("betænksom"),
];
let shareCount = 0;

/**
 * --------- Starter det der får quizen til at virke, men først når HTML’en er færdig. ---------
 */
window.addEventListener("DOMContentLoaded", function () {
  visTidligereResultat();
  setupRetryBtns();
  setupLightbox();
  insertPostHeaderTemplates();

  if (questionPosts.length > 0) showPost(currentPost);
  setupQuizButtons();
  setupRestartBtns();
  setupSaveResultBtns();
  setupShowAnswersBtns();
});
