const containerOptions = document.querySelector(".options");
const containerRegion = document.querySelector(".form__region");
const inputRegion = document.querySelector(".form__region--input");
const inputSeachByName = document.querySelector(".form__name--input");
const containerContent = document.querySelector(".box-content");
const containerSpinner = document.querySelector(".box-spinner");
const containerDanger = document.querySelector(".danger");
const btnCloseDangerMessage = document.querySelector(".btn-close");
const labelMassageDanger = document.querySelector(".danger__message");
const containerAllInfo = document.querySelector(".container");
const containerWrapp = document.querySelector(".wrapp");
const btnDarkMode = document.querySelector(".dark-mode");
const labelMode = document.querySelector(".dark-mode>span");
const iconMode = document.querySelector(".dark-mode__icon");
let URL;
let currentCountries = [];
let bitMod = false;
const requestRegion = function (url) {
  return fetch(url);
};

const clearContent = function () {
  containerContent.innerHTML = "";
  containerSpinner.classList.remove("hidden");
};
const showMessageDanger = function (message) {
  labelMassageDanger.textContent = message;
  containerDanger.classList.remove("hidden");
};

const formatNumber = function (number) {
  return new Intl.NumberFormat("pt-PT").format(number);
};

const changeInfoMode = function (text, classNameToReplce, newClassName) {
  iconMode.classList.replace(classNameToReplce, newClassName);
  labelMode.textContent = text;
};

const activeDarkMod = function () {
  if (!bitMod) {
    changeInfoMode("Light Mode", "lnr-moon", "lnr-sun");
    document.documentElement.style.setProperty(
      "--color-grey-light-bg",
      "hsl(207, 26%, 17%)"
    );
    document.documentElement.style.setProperty(
      "--color-white-text",
      "hsl(209, 23%, 22%)"
    );
    document.documentElement.style.setProperty(
      "--color-blue-dark-text",
      "hsl(0, 0%, 100%)"
    );
    document.documentElement.style.setProperty(
      "--color-grey-dark",
      "hsl(0, 0%, 96%)"
    );
    bitMod = !bitMod;
  } else {
    changeInfoMode("Dark Mode", "lnr-sun", "lnr-moon");
    document.documentElement.style.setProperty(
      "--color-grey-light-bg",
      "hsl(0, 0%, 98%)"
    );
    document.documentElement.style.setProperty(
      "--color-white-text",
      "hsl(0, 0%, 100%)"
    );
    document.documentElement.style.setProperty(
      "--color-blue-dark-text",
      "hsl(200, 15%, 8%)"
    );
    document.documentElement.style.setProperty(
      "--color-grey-dark",
      "hsl(0, 0%, 52%)"
    );
    bitMod = !bitMod;
  }
};

const renderCountries = function (data) {
  containerDanger.classList.add("hidden");
  containerContent.innerHTML = "";
  data.forEach((country) => {
    const html = `
        <article class="col-1-of-4 card">
            <div class="card__flag">
              <img
                src="${country.flags.svg}"
                alt="flag of country"
                class="card__flag--img"
              />
            </div>
            <div class="card__content">
              <h2 class="card__content--name heading-2">${
                country.name.common
              }</h2>
              <span class="card__content--info">
                <span>Population:</span> 
                     ${formatNumber(+country.population)}
                </span>
              <span class="card__content--info">
                <span>Region:</span> ${country.region}
              </span>
              <span class="card__content--info">
                <span>Capital:</span> ${country.capital}
              </span>
            </div>
        </article>
    `;
    containerContent.insertAdjacentHTML("beforeend", html);
  });
};

const renderCountriesDitlaes = function (country) {
  containerAllInfo.innerHTML = "";
  const hasBordersOrNot = !country.borders
    ? "Not have a borders"
    : country.borders;
  const html = `
    <div class="container__wrapp">
          <button class="btn__back">
            <i class="lnr lnr-arrow-left"></i>Back
          </button>
          <div class="content">
            <div class="col-1-of-2 box-flag">
              <img src="${country.flags.svg}" 
              alt="flag of ${country.name.common}" 
              class="flag__big" />
            </div>
            <div class="col-1-of-2 description">
              <h2 class="description__name">${country.name.common}</h2>
              <div class="description__moreInfo">
                <div class="info-primary">
                  <span>
                    <b>Native Name: </b> 
                    ${Object.values(country.name.nativeName)[0].common}
                  </span>
                  <span>
                    <b>Population:</b>
                    ${formatNumber(+country.population)}
                  </span>
                  <span>
                    <b>Region:</b>
                    ${country.region}
                  </span>
                  <span>
                    <b>Sub Region:</b>
                    ${country.subregion}
                  </span>
                  <span>
                    <b>Capital:</b>
                    ${country.capital}
                  </span>
                </div>
                <div class="info-secondary">
                  <span>
                    <b>Top Level Domain:</b>
                    ${country.altSpellings[0]}
                  </span>
                  <span>
                    <b>Currencies:</b>
                    ${Object.values(country.currencies)[0].name}
                  </span>
                  <span>
                    <b>Languages:</b>
                     ${Object.values(country.languages).splice(",").join(",")} 
                  </span>
                </div>
              </div>
              <div class="description__borders">
                <span> 
                  <b>Border Countries:</b> 
                  ${hasBordersOrNot} 
                </span>
              </div>
            </div>
          </div>
      </div>
    `;
  containerAllInfo.insertAdjacentHTML("beforeend", html);
};

const requestDateOfAPI = function (request) {
  request
    .then((response) => {
      if (!response.ok) throw new Error(`Server not found! (404)`);
      return response.json();
    })
    .then((data) => {
      setTimeout(() => {
        currentCountries = data;
        renderCountries(data);
      }, 1000);
    })
    .catch((e) => {
      showMessageDanger(e);
    })
    .finally(() => {
      containerSpinner.classList.add("hidden");
    });
};

function init() {
  clearContent();
  URL = `https://restcountries.com/v3.1/all`;
  const request = requestRegion(URL);
  requestDateOfAPI(request);
}
init();

// EVENTS HANDELLER
containerOptions.addEventListener("click", function (e) {
  const cliked = e.target.closest(".options__btn");
  if (!cliked) return;
  clearContent();
  const elem = cliked.querySelector(".options__list");
  const region = elem.textContent;

  inputRegion.value = region;
  if (currentCountries.length === 0) {
    containerSpinner.classList.add("hidden");
    showMessageDanger(`The server was not find (404)`);
    return;
  }
  containerOptions.classList.add("hidden");
  const countryFound = currentCountries.filter((country) => {
    return country.region === region;
  });

  setTimeout(() => {
    renderCountries(countryFound);
  }, 1000);
});

containerRegion.addEventListener("click", function (e) {
  if (!e.target.classList.contains("form__region--icon")) return;
  containerOptions.classList.toggle("hidden");
});

inputRegion.addEventListener("focus", function () {
  containerOptions.classList.remove("hidden");
});

inputSeachByName.addEventListener("input", function (e) {
  clearContent();
  const nameOfCountry = inputSeachByName.value;
  if (nameOfCountry === "") {
    renderCountries(currentCountries);
    return;
  }

  if (currentCountries.length === 0) {
    containerSpinner.classList.add("hidden");
    showMessageDanger(`The server was not find (404)`);
    return;
  }
  const countryFound = currentCountries.filter((country) => {
    return country.name.common
      .toLowerCase()
      .includes(nameOfCountry.toLowerCase());
  });

  if (countryFound.length === 0) {
    containerSpinner.classList.add("hidden");
    showMessageDanger(`${inputSeachByName.value} was not found!`);
    return;
  }
  setTimeout(() => {
    renderCountries(countryFound);
  }, 1000);
});

btnCloseDangerMessage.addEventListener("click", () => {
  containerDanger.classList.add("hidden");
  renderCountries(currentCountries);
  inputSeachByName.value = "";
});

containerContent.addEventListener("click", (e) => {
  const elem = e.target.closest(".card");
  if (!elem) return;

  const nameOfCountry = elem.querySelector(".card__content--name").textContent;

  const countryFound = currentCountries.filter(
    (country) => country.name.common === nameOfCountry
  );
  containerWrapp.classList.add("hidden");
  containerAllInfo.style.display = "flex";
  renderCountriesDitlaes(countryFound[0]);
  /* clear input */
  inputSeachByName.value = "";
});

containerAllInfo.addEventListener("click", (e) => {
  const cliked = e.target.closest(".btn__back");
  if (!cliked) return;

  containerWrapp.classList.remove("hidden");
  containerAllInfo.style.display = "none";
});

btnDarkMode.addEventListener("click", function () {
  activeDarkMod();
});
