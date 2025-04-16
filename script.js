const API_URL = "https://api.thedogapi.com/v1/images/search";
const BREEDS_URL = "https://api.thedogapi.com/v1/breeds";
const SEARCH_URL = "https://api.thedogapi.com/v1/images/search?limit=1&breed_ids=";

const dogImage = document.getElementById("cachorosimagens");
const likeBtn = document.querySelector(".down .fa-heart");
const likeUp = document.querySelector(".down .fa-thumbs-up");
const likeDown = document.querySelector(".down .fa-thumbs-down");

const votingBtn = document.querySelector(".top-item:nth-child(1)");
const searchBtn = document.querySelector(".top-item:nth-child(2)");
const favsBtn = document.getElementById("favsBtn");

const breedSearchDiv = document.querySelector(".breed-search");
const breedInput = document.getElementById("breedInput");
const breedResults = document.getElementById("breedResults");

const favoritesSection = document.getElementById("favoritesSection");

let allBreeds = [];
let favorites = [];

function toggleSection(sectionToShow) {
  document.querySelectorAll(".center-image, .breed-search").forEach(section => {
    section.style.display = "none";
  });
  sectionToShow.style.display = "flex";
}

async function loadDog() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Erro ao buscar imagem: ${res.status}`);
    const data = await res.json();
    dogImage.src = data[0]?.url || "https://via.placeholder.com/350";
    toggleSection(dogImage.parentElement);
  } catch (err) {
    console.error(err.message);
    alert("Não foi possível carregar a imagem. Tente novamente.");
  }
}

// Carregar raças
async function loadBreeds() {
  try {
    const res = await fetch(BREEDS_URL);
    if (!res.ok) throw new Error(`Erro ao carregar raças: ${res.status}`);
    allBreeds = await res.json();
  } catch (err) {
    console.error(err.message);
    alert("Não foi possível carregar as raças. Tente novamente.");
  }
}

// Mostrar sugestões de raças
function showBreedSuggestions(term) {
  breedResults.innerHTML = "";

  const filtered = allBreeds.filter(breed =>
    breed.name.toLowerCase().includes(term.toLowerCase())
  );

  filtered.forEach(breed => {
    const div = document.createElement("div");
    div.textContent = breed.name;
    div.classList.add("breed-name");

    div.addEventListener("click", async () => {
      try {
        const res = await fetch(SEARCH_URL + breed.id);
        if (!res.ok) throw new Error(`Erro ao buscar imagem da raça: ${res.status}`);
        const data = await res.json();
        if (data.length > 0) {
          dogImage.src = data[0].url;
          breedResults.innerHTML = "";
          breedInput.value = "";
          toggleSection(dogImage.parentElement);
        }
      } catch (err) {
        console.error(err.message);
        alert("Não foi possível carregar a imagem da raça. Tente novamente.");
      }
    });

    breedResults.appendChild(div);
  });
}

// Mostrar favoritos
function showFavorites() {
  favoritesSection.innerHTML = "";

  if (favorites.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Sem fotos salvas";
    message.style.textAlign = "center";
    message.style.color = "#555";
    message.style.fontSize = "18px";
    favoritesSection.appendChild(message);

    message.addEventListener("click", () => {
      alert("Você ainda não salvou nenhuma foto.");
    });

    toggleSection(favoritesSection);
    return;
  }



  favorites.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Imagem favorita";
    favoritesSection.appendChild(img);
  });

  toggleSection(favoritesSection);
}


async function init() {
  await loadDog();
  await loadBreeds();

  dogImage.addEventListener("click", loadDog);
  likeUp.addEventListener("click", loadDog);
  likeDown.addEventListener("click", loadDog);

  likeBtn.addEventListener("click", () => {
    if (!favorites.includes(dogImage.src)) {
      favorites.push(dogImage.src);
    }
    loadDog();
  });

  searchBtn.addEventListener("click", () => {
    toggleSection(breedSearchDiv);
  });

  favsBtn.addEventListener("click", showFavorites);

  votingBtn.addEventListener("click", () => {
    loadDog();
  });

  breedInput.addEventListener("input", () => {
    showBreedSuggestions(breedInput.value);
  });
}

init();