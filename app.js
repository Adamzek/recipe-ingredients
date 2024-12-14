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

function generateStars(rating = 0) {
  // Generates stars with the selected rating highlighted
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    starsHtml += `<i class="fa-star star ${i <= rating ? 'fas' : 'far'}" data-rating="${i}"></i>`;
  }
  return starsHtml;
}

const ratings = {}; // Object to store ratings by recipe ID

function handleRating(starElement, recipeId) {
  const rating = parseInt(starElement.getAttribute('data-rating'), 10); // Get the selected rating
  ratings[recipeId] = rating; // Save the rating for the recipe
  const ratingDiv = starElement.parentElement;

  // Update stars display to reflect the selected rating
  ratingDiv.innerHTML = generateStars(rating);
  ratingDiv.querySelectorAll('.star').forEach((star) =>
    star.addEventListener('click', () => handleRating(star, recipeId))
  );

  // Notify the user of the selected rating
  alert(`You rated "${recipeId}" ${rating} star${rating > 1 ? 's' : ''}!`);
}

// Modify displayRecipes to include ratings
function displayRecipes(recipes) {
  recipeContainer.innerHTML = '';
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
    recipeCard.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}">
      <p>Used Ingredients: ${recipe.usedIngredients.map((ing) => ing.name).join(', ')}</p>
      <div class="rating" id="rating-${recipe.id}">
        ${generateStars(ratings[recipe.id] || 0)} <!-- Default to 0 stars if unrated -->
      </div>
      <div class="nutrition" id="nutrition-${recipe.id}">
        <button onclick="fetchNutrition(${recipe.id})">View Nutrition</button>
      </div>
      <button onclick="addToFavorites('${recipe.title}')">
        <i class="fas fa-heart"></i> Add to Favorites
      </button>
    `;
    recipeContainer.appendChild(recipeCard);

    // Add event listeners for rating stars
    const ratingDiv = recipeCard.querySelector(`#rating-${recipe.id}`);
    ratingDiv.querySelectorAll('.star').forEach((star) =>
      star.addEventListener('click', () => handleRating(star, recipe.id))
    );
  });
}


function fetchNutrition(recipeId) {
  const apiKey = '8300e8af134949e49752c9948b730b71'; // Replace with a secure server-side solution
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${apiKey}`;
  
  const nutritionDiv = document.getElementById(`nutrition-${recipeId}`);
  nutritionDiv.innerHTML = '<p>Loading nutrition...</p>';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.nutrition && data.nutrition.nutrients.length > 0) {
        displayNutrition(data.nutrition.nutrients, recipeId);
      } else {
        nutritionDiv.innerHTML = '<p>No nutritional information available.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching nutrition:', error);
      nutritionDiv.innerHTML = '<p>Error loading nutritional information.</p>';
    });
}

function displayNutrition(nutrients, recipeId) {
  const nutritionDiv = document.getElementById(`nutrition-${recipeId}`);
  const importantNutrients = nutrients.filter(nutrient =>
    ['Calories', 'Protein', 'Fat', 'Carbohydrates'].includes(nutrient.name)
  );

  nutritionDiv.innerHTML = `
    <ul>
      ${importantNutrients.map(nutrient => `
        <li>${nutrient.name}: ${nutrient.amount} ${nutrient.unit}</li>
      `).join('')}
    </ul>
  `;
}


function generateStars(rating) {
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    starsHtml += `<i class="fa-star star ${i <= rating ? 'fas' : 'far'}" data-rating="${i}"></i>`;
  }
  return starsHtml;
}

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

function getRecipes(ingredients) {
  const apiKey = '8300e8af134949e49752c9948b730b71'; // Replace with a secure server-side solution
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',')}&apiKey=${apiKey}`;

  // Display a cute loading GIF
  recipeContainer.innerHTML = `
    <div class="loading-container">
      <iframe src="https://giphy.com/embed/PPlTjK7QqGrcs" width="462" height="480" style="" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/pizza-i-love-is-life-PPlTjK7QqGrcs">via GIPHY</a></p>
      <p>Fetching delicious recipes...</p>
    </div>
  `;

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
