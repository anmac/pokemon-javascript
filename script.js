const URL = "https://pokeapi.co/api/v2/pokemon/";

function getPokemon(generator) {
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      generator(data);
    })
    .catch((err) => console.error("Pokemon not found: " + err));
}

async function getPokemonDetails(pokemon) {
  const response = await fetch(pokemon.url);
  const data = await response.json();
  return data;
}

async function getPokemonImage(name) {
  const response = await fetch(URL + name);
  const data = await response.json();
  return data;
}

getPokemon((data) => {
  data.results.forEach(async (pokemon) => {
    const details = await getPokemonDetails(pokemon);
    const img = await getPokemonImage(pokemon.name);
    console.log(pokemon);
    console.log(img);

    const card = document.createRange().createContextualFragment(`
      <article class="card">
        <figure class="card__figure">
          <img
            src="${img.sprites.other["official-artwork"].front_default}"
            alt="${pokemon.name}"
            class="card__img"
          />
          <figcaption class="card__caption">${pokemon.name}</figcaption>
        </figure>
      </article>
      `);

    const section = document.querySelector("section");
    section.append(card);
  });
});
