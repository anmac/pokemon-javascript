const random = Math.floor(Math.random() * 100) + 1;
const URL = "https://pokeapi.co/api/v2/pokemon/";
const URL_LIMITED = URL + "?offset=" + random + "&limit=20";

function getPokemon(generator) {
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

function formatName(name) {
  return name.slice(0, 1).toUpperCase() + name.slice(1);
}

getPokemon(async (data) => {
  const fragment = document.createDocumentFragment();

  for (const pokemon of data.results) {
    console.log(pokemon);
    const details = await getPokemonDetails(pokemon.name);
    console.log(details);

    const card = document.createElement("article");
    card.classList.add("card");

    const figure = document.createElement("figure");
    figure.classList.add("card__figure");

    const img = document.createElement("img");
    img.src = details.sprites.other["official-artwork"].front_default;
    img.alt = formatName(pokemon.name);
    img.classList.add("card__img");

    const figcaption = document.createElement("figcaption");
    figcaption.classList.add("card__caption");
    figcaption.textContent = formatName(pokemon.name);

    figure.appendChild(img);
    figure.appendChild(figcaption);
    card.appendChild(figure);

    fragment.appendChild(card);
  }

  const section = document.querySelector(".section");
  section.appendChild(fragment);
});
