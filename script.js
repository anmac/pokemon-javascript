const URL = "https://pokeapi.co/api/v2/pokemon/";
const URL_SPECIES = "https://pokeapi.co/api/v2/pokemon-species/";

function getPokemon(generator) {
  const randomQuery = Math.floor(Math.random() * 100) + 1;
  const URL_LIMITED = URL + "?offset=" + randomQuery + "&limit=20";
  fetch(URL_LIMITED)
    .then((response) => response.json())
    .then((data) => {
      generator(data);
    })
    .catch((err) => console.error("Pokemon not found: " + err));
}

async function getPokemonDetails(name) {
  const response = await fetch(URL + name);
  const data = await response.json();
  return data;
}

async function getPokemonSpeciesDetails(name) {
  const response = await fetch(URL_SPECIES + name);
  const data = await response.json();
  return data;
}

function capitalizeName(name) {
  return name.slice(0, 1).toUpperCase() + name.slice(1);
}

async function createPokemonCards(data) {
  const fragment = document.createDocumentFragment();

  for (const pokemon of data.results) {
    // console.log(pokemon);
    const details = await getPokemonDetails(pokemon.name);
    // console.log(details);

    const card = document.createElement("article");
    card.classList.add("card");
    card.addEventListener("click", getPokemonSpecieDetailAndCreateCard);

    const figure = document.createElement("figure");
    figure.classList.add("card__figure");

    const img = document.createElement("img");
    img.src = details.sprites.other["official-artwork"].front_default;
    img.alt = capitalizeName(pokemon.name);
    img.classList.add("card__img");

    const figcaption = document.createElement("figcaption");
    figcaption.classList.add("card__caption");
    figcaption.textContent = capitalizeName(pokemon.name);

    figure.appendChild(img);
    figure.appendChild(figcaption);
    card.appendChild(figure);

    fragment.appendChild(card);
  }

  const section = document.querySelector(".section");
  section.innerHTML = "";
  section.appendChild(fragment);
  const spinner = document.querySelector(".material-symbols-outlined");
  spinner.classList.remove("loading");
}

async function createSpeciesDetails(data) {}

function getPokemonDataAndCreateCards() {
  const spinner = document.querySelector(".material-symbols-outlined");
  spinner.classList.add("loading");

  getPokemon(async (data) => {
    await createPokemonCards(data);
  });
}

function getPokemonSpecieDetailAndCreateCard(event) {
  const card = event.currentTarget;
  const pokemonName = card
    .querySelector(".card__caption")
    .textContent.toLowerCase();
  createSpeciesDetails(pokemonName);
}

getPokemonDataAndCreateCards();

document
  .getElementById("reload")
  .addEventListener("click", getPokemonDataAndCreateCards);

const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener("click", getPokemonSpecieDetailAndCreateCard);
});
