const test_text_container = document.querySelector(".test_text_container");
const WPM_text = document.querySelector(".WPM_text");
const accuracy_text = document.querySelector(".accuracy_text");
const time_text = document.querySelector(".time_text");
const hero_btn = document.querySelector(".hero_btn");
const cancel_btn = document.querySelector(".cancel_btn");
const reset_btn = document.querySelector(".reset");
const result_WPM_text = document.querySelector(".result_WPM_text");
const result_accuracy_text = document.querySelector(".result_accuracy_text");

async function Randomtext() {
  const data = await fetch(
    "https://random-word-api.herokuapp.com/word?number=100"
  ).catch((error) => {
    throw new Error(`Randomtext fetch FAILED!!!: ${error}`);
  });

  const jsonData = await data.json();

  return jsonData;
}

let current = 0;
let accurate = 0;
let time = 60;
let count = 0;
let access = false;
let timer = undefined;

function getCharArrayFromRandomText(value) {
  const charArray = [];
  value?.forEach((String) => {
    Array.from(String).forEach((value) => {
      charArray.push(value);
    });
    charArray.push("_");
  });

  return charArray;
}

// This function return Elements wrapped with a container element...

function generateCharElements(charArray) {
  const container = document.createElement("div");

  charArray?.map((value, index) => {
    const span = document.createElement("span");
    if (index == 0) {
      span.setAttribute("class", "test_text_letter current");
    } else {
      span.setAttribute("class", "test_text_letter");
    }
    span.setAttribute("id", `text[${index}]`);
    const text = document.createTextNode(value);
    span.appendChild(text);
    container.appendChild(span);
  });
  return container;
}

async function clickHandler(event) {
  await Randomtext().then((value) => {
    const charArray = getCharArrayFromRandomText(value);
    const container = generateCharElements(charArray);
    test_text_container.innerHTML = "";
    test_text_container.innerHTML = container.innerHTML;
  });

  hero_btn.disabled = true;
  window.addEventListener("keydown", keyBoardHandler);
  access = true;

  timer = setInterval(() => {
    time--;
    time_text.innerHTML = `${time}`;
    const minute = (60 - time) / 60;
    const wpm = (current / 5 / minute).toFixed(0);
    WPM_text.innerHTML = `${wpm}`;
    if (!time) {
      clearInterval(timer);
      window.removeEventListener("keydown", keyBoardHandler);
      result_WPM_text.innerHTML = `${wpm}`;
      result_accuracy_text.innerHTML = `${accurate}%`;
      displayTestSection("hide");
      displayResultSection("unhide");
    }
  }, 1000);

  displayHeroSection("hide");
  displayTestSection("unhide");
}

function keyBoardHandler(event) {
  if (event.repeat) return;
  if (access) {
    requestAnimationFrame(() => {
      const key = event.key.trim() ? event.key : "_";
      const currentElement = document.getElementById(`text[${current}]`);
      const currentValue = currentElement.innerText;
      const nextElement = currentElement.nextElementSibling;
      if (key == currentValue) {
        currentElement.setAttribute("class", "test_text_letter correct");
        accurate++;
      } else {
        currentElement.setAttribute("class", "test_text_letter incorrect");
      }
      if (nextElement != null) {
        nextElement.setAttribute("class", "test_text_letter current");
      }
      current++;
      const num = ((accurate / current) * 100).toFixed(0);
      accuracy_text.innerHTML = `${num}%`;
    });
  }
}

function resetVariables() {
  accuracy = 0;
  current = 0;
  accurate = 0;
  time = 60;
  count = 0;
  access = false;
}

function resetValuesOnUi() {
  WPM_text.innerHTML = "0";
  accuracy_text.innerHTML = "0";
  time_text.innerHTML = "60";
  result_WPM_text.innerHTML = "0";
  result_accuracy_text.innerHTML = "0";
}

hero_btn.addEventListener("click", clickHandler);

cancel_btn.addEventListener("click", (event) => {
  clearTimeout(timer);
  window.removeEventListener("keydown", keyBoardHandler);
  hero_btn.disabled = false;
  resetValuesOnUi();
  displayHeroSection("unhide");
  displayTestSection("hide");
  displayResultSection("hide");
  resetVariables();
});

reset_btn.addEventListener("click", (event) => {
  hero_btn.disabled = false;
  resetValuesOnUi();
  displayHeroSection("unhide");
  displayTestSection("hide");
  displayResultSection("hide");
  resetVariables();
});

const heroSection = document.querySelector(".hero");
const testSection = document.querySelector(".test_section");
const resultSection = document.querySelector(".result_wrapper");

function displayElementFunction(element, action, display = "flex") {
  if (action == "hide") {
    element.style.display = "none";
  }
  if (action == "unhide") {
    element.style.display = display;
  }
}
function displayHeroSection(action) {
  displayElementFunction(heroSection, action, "flex");
}
function displayTestSection(action) {
  displayElementFunction(testSection, action, "flex");
}
function displayResultSection(action) {
  displayElementFunction(resultSection, action, "flex");
}
