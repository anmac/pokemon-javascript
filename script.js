const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const POKEAPI_SPECIES_BASE_URL = "https://pokeapi.co/api/v2/pokemon-species/";

function getRandomOffset() {
  return Math.floor(Math.random() * 100) + 1;
}

function capitalizeName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

async function getPokemonList(offset, limit) {
  const response = await fetch(
    POKEAPI_BASE_URL + `?offset=${offset}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon list");
  }
  const data = await response.json();
  return data.results;
}

async function getPokemonDetails(name) {
  const response = await fetch(POKEAPI_BASE_URL + name);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon details");
  }
  const data = await response.json();
  return data;
}

async function getPokemonSpeciesDetails(name) {
  const response = await fetch(POKEAPI_SPECIES_BASE_URL + name);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokemon species details");
  }
  const data = await response.json();
  return data;
}

async function createPokemonCards(data) {
  const fragment = document.createDocumentFragment();
  const section = document.querySelector(".section");
  section.innerHTML = "";

  for (const pokemon of data) {
    const details = await getPokemonDetails(pokemon.name);

    const card = document.createElement("article");
    card.classList.add("card");
    card.addEventListener("click", () =>
      showPokemonSpeciesDetails(
        pokemon.name,
        details.sprites.other["official-artwork"].front_default
      )
    );

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

  section.appendChild(fragment);
}

async function showPokemonSpeciesDetails(pokemonName, imgSrc) {
  const pokemonSpeciesDetails = await getPokemonSpeciesDetails(pokemonName);
  const detailSection = document.querySelector(".detail");
  detailSection.innerHTML = "";

  const article = document.createElement("article");
  const h3 = document.createElement("h3");
  const ul = document.createElement("ul");

  h3.classList.add("detail__title");
  h3.textContent = capitalizeName(pokemonName);

  const details = [
    { label: "Color", value: pokemonSpeciesDetails.color.name },
    { label: "Habitat", value: pokemonSpeciesDetails.habitat.name },
    { label: "Species", value: pokemonSpeciesDetails["egg_groups"][0].name },
    { label: "Shape", value: pokemonSpeciesDetails.shape.name },
    {
      label: "Description",
      value: pokemonSpeciesDetails["flavor_text_entries"][0]["flavor_text"],
    },
  ];

  details.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("item");
    li.innerHTML = `<span class="item__bold">${item.label}: </span>${item.value}`;
    ul.appendChild(li);
  });

  article.appendChild(h3);
  article.appendChild(ul);
  detailSection.appendChild(article);

  const image = document.createElement("figure");
  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = capitalizeName(pokemonName);
  image.appendChild(img);
  detailSection.appendChild(image);
}

async function getPokemonDataAndCreateCards() {
  const spinner = document.querySelector(".material-symbols-outlined");
  spinner.classList.add("loading");

  try {
    const offset = getRandomOffset();
    const limit = 20;
    const pokemonList = await getPokemonList(offset, limit);
    await createPokemonCards(pokemonList);
  } catch (error) {
    console.error(error);
  } finally {
    spinner.classList.remove("loading");
  }
}

getPokemonDataAndCreateCards();

document
  .getElementById("reload")
  .addEventListener("click", getPokemonDataAndCreateCards);
