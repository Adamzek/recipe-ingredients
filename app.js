// Get references to the DOM elements
const ingredientInput = document.getElementById('ingredient-input');
const addIngredientBtn = document.getElementById('add-ingredient');
const ingredientList = document.getElementById('ingredient-list');
const getRecipesBtn = document.getElementById('get-recipes');
const favoritesList = document.getElementById('favorites-list');
const recipeContainer = document.getElementById('recipe-container');

// Store ingredients and favorites
const ingredients = [];
let favorites = [];

// Add ingredients to the list
addIngredientBtn.addEventListener('click', () => {
  const ingredient = ingredientInput.value.trim();
  if (ingredient) {
    ingredients.push(ingredient);
    updateIngredientList();
    ingredientInput.value = '';
  }
});

// Remove ingredient from the list
function removeIngredient(index) {
  ingredients.splice(index, 1);
  updateIngredientList();
}

// Update the displayed ingredient list
function updateIngredientList() {
  ingredientList.innerHTML = '';
  ingredients.forEach((ingredient, index) => {
    const li = document.createElement('li');
    li.textContent = ingredient;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.classList.add('remove-btn');
    removeBtn.addEventListener('click', () => removeIngredient(index));

    li.appendChild(removeBtn);
    ingredientList.appendChild(li);
  });
}

// Fetch recipes based on ingredients
getRecipesBtn.addEventListener('click', () => {
  if (ingredients.length > 0) {
    getRecipes(ingredients);
  } else {
    alert('Please add some ingredients first!');
  }
});

function getRecipes(ingredients) {
  const apiKey = '8300e8af134949e49752c9948b730b71'; // Replace with a secure server-side solution
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',')}&apiKey=${apiKey}`;

  recipeContainer.innerHTML = '<p>Loading recipes...</p>';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        displayRecipes(data);
      } else {
        recipeContainer.innerHTML = '<p>No recipes found for the entered ingredients.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching recipes:', error);
      recipeContainer.innerHTML = '<p>Error fetching recipes. Please try again.</p>';
    });
}

function displayRecipes(recipes) {
  recipeContainer.innerHTML = '';
  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
    recipeCard.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}">
      <p>Used Ingredients: ${recipe.usedIngredients.map(ing => ing.name).join(', ')}</p>
      <div class="rating" data-recipe-id="${recipe.id}">
        ${generateStars(0)} <!-- Initially unrated -->
      </div>
      <button onclick="addToFavorites('${recipe.title}')">
        <i class="fas fa-heart"></i> Add to Favorites
      </button>
    `;
    recipeContainer.appendChild(recipeCard);

    // Add event listeners for rating stars
    const ratingDiv = recipeCard.querySelector('.rating');
    ratingDiv.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', () => handleRating(star, recipe.id));
    });
  });
}

function generateStars(rating) {
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    starsHtml += `<i class="fa-star star ${i <= rating ? 'fas' : 'far'}" data-rating="${i}"></i>`;
  }
  return starsHtml;
}

const ratings = {}; // Object to store ratings by recipe ID

function handleRating(star, recipeId) {
  const rating = parseInt(star.getAttribute('data-rating'), 10);
  ratings[recipeId] = rating; // Save the rating
  const ratingDiv = star.parentElement;
  ratingDiv.innerHTML = generateStars(rating); // Update stars display
  ratingDiv.querySelectorAll('.star').forEach(starElement => {
    starElement.addEventListener('click', () => handleRating(starElement, recipeId));
  });
  alert(`You rated "${recipeId}" ${rating} stars!`);
}



function addToFavorites(recipeTitle) {
  if (!favorites.includes(recipeTitle)) {
    favorites.push(recipeTitle);
    const li = document.createElement('li');
    li.textContent = recipeTitle;
    favoritesList.appendChild(li);
    alert(`${recipeTitle} added to your favorites!`);
  } else {
    alert(`${recipeTitle} is already in your favorites.`);
  }
}
