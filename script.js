

// Base URL for fetching Pokémon types
const pokeTypeURL = 'https://pokeapi.co/api/v2/type/';

// Get query parameters from the URL
const pokeQueryParams = new URLSearchParams(window.location.search);
const typeParams = new URLSearchParams(window.location.search);
const typeSearch = typeParams.get('type'); // Get the type from the URL

// Get the Pokedex and form elements from the HTML
const pokedex = document.getElementById('pokedex');
const pokemonSearchForm = document.querySelector('#pokemon-search-form');
const pokemonTypeFilter = document.querySelector('.type-filter');

// Array to hold Pokémon data and a set for unique types
let pokemonArray = [];
let uniqueTypes = new Set();

// Function to fetch Pokémon data
const fetchPokemon = () => {
    const promises = []; // Array to hold fetch promises

    // Loop through the first 151 Pokémon
    for (let i = 1; i <= 151; i++) {
        const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(pokemonURL).then(response => response.json())); // Fetch data
    }

    // Wait for all fetch requests to complete
    Promise.all(promises)
        .then(allPokemon => {
            // Map the fetched data to a simpler format
            const firstGenPokemon = allPokemon.map(pokemon => ({
                frontImage: pokemon.sprites['front_default'],
                backImage: pokemon.sprites.back_default,
                pokemon_id: pokemon.id,
                name: pokemon.name,
                type: pokemon.types[0].type.name,
                abilities: pokemon.abilities.map(ability => ability.ability.name).join(', '),
                description: pokemon.species.url
            }));

            pokemonArray = firstGenPokemon; // Store the Pokémon data
            createPokemonCards(firstGenPokemon); // Create cards for Pokémon
        })
        .then(generateTypes); // Generate type options
}

// Call the fetchPokemon function to start fetching data
fetchPokemon();

// Event listener for searching Pokémon by name
pokemonSearchForm.addEventListener('input', (event) => {
    const filterPokemon = pokemonArray.filter(pokemon => 
        pokemon.name.includes(event.target.value.toLowerCase())
    );
    clearPokedex(); // Clear the current Pokedex display
    createPokemonCards(filterPokemon); // Create cards for the filtered Pokémon
});

// Function to clear the Pokedex display
function clearPokedex() {
    pokedex.innerHTML = ''; // Clear the inner HTML of the Pokedex
}

// Function to create Pokémon cards
function createPokemonCards(pokemons) {
    let currentPokemon = pokemons; // Start with the provided Pokémon

    // If a type is specified, filter the Pokémon by type
    if (typeSearch) {
        currentPokemon = pokemons.filter(pokemon => 
            pokemon.type.includes(typeSearch.toLowerCase())
        );
    }

    // Create a card for each Pokémon
    currentPokemon.forEach(pokemon => {
        createPokemonCard(pokemon);
    });
}

// Function to create a single Pokémon card
function createPokemonCard(pokemon) {
    // Create the card container
    const flipCard = document.createElement("div");
    flipCard.classList.add("flip-card");
    flipCard.id = `${pokemon.name}`;
    pokedex.append(flipCard); // Add the card to the Pokedex

    // Create the inner part of the card
    const flipCardInner = document.createElement("div");
    flipCardInner.classList.add("flip-card-inner");
    flipCardInner.id = `${pokemon.type}`;
    flipCard.append(flipCardInner);

    // Create the front side of the card
    const frontCard = document.createElement("div");
    frontCard.classList.add('front-pokemon-card');

    const frontImage = document.createElement('img');
    frontImage.src = `${pokemon.frontImage}`;
    frontImage.classList.add("front-pokemon-image");

    const frontPokeName = document.createElement('h2');
    frontPokeName.innerHTML = `<a href="/pokemon.html?pokemon_id=${pokemon.pokemon_id}">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</a>`;

    const frontPokeID = document.createElement('p');
    frontPokeID.textContent = `#${pokemon.pokemon_id}`;
    frontPokeID.classList.add("front-poke-id");

    const frontPokeType = document.createElement('p');
    frontPokeType.textContent = `${pokemon.type.toUpperCase()}`;
    frontPokeType.classList.add("front-pokemon-type");

    // Append elements to the front card
    frontCard.append(frontImage, frontPokeID, frontPokeName, frontPokeType);

    // Create the back side of the card
    const backCard = document.createElement("div");
    backCard.classList.add('back-pokemon-card');

    const backImage = document.createElement('img');
    backImage.src = `${pokemon.backImage}`;
    backImage.classList.add("back-pokemon-image");

    const backPokeID = document.createElement('p');
    backPokeID.textContent = `#${pokemon.pokemon_id}`;
    backPokeID.classList.add("back-poke-id");

    const backPokeName = document.createElement('h2');
    backPokeName.innerHTML = `<a href="/pokemon.html?pokemon_id=${pokemon.pokemon_id}">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</a>`;
    backPokeName.classList.add("back-pokemon-name");

    const backPokeAbilities = document.createElement("p");
    backPokeAbilities.innerHTML = `Abilities:<br>${pokemon.abilities}`;
    backPokeAbilities.classList.add("back-pokemon-abilities");

    // Append elements to the back card
    backCard.append(backImage, backPokeID, backPokeName, backPokeAbilities);
    
    // Append both sides to the card
    flipCardInner.append(frontCard, backCard);
    uniqueTypes.add(pokemon.type); // Add type to the set of unique types
}

// Function to generate type options in the filter
function generateTypes() {
    uniqueTypes.forEach(type => {
        const typeOption = document.createElement('option');
        typeOption.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeOption.value = type;

        pokemonTypeFilter.append(typeOption); // Add the type option to the filter
    });
}