// Get references to the DOM elements
const ingredientInput = document.getElementById('ingredient-input');
const addIngredientBtn = document.getElementById('add-ingredient');
const ingredientList = document.getElementById('ingredient-list');
const getRecipesBtn = document.getElementById('get-recipes');

// Store ingredients in an array
const ingredients = [];

// Event listener to add ingredients to the list
addIngredientBtn.addEventListener('click', () => {
  const ingredient = ingredientInput.value.trim();
  if (ingredient) {
    ingredients.push(ingredient); // Add the ingredient to the array
    const li = document.createElement('li');
    li.textContent = ingredient;
    ingredientList.appendChild(li);
    ingredientInput.value = ''; // Clear input field
  }
});

// Event listener to fetch recipes when the user clicks the "Get Recipes" button
getRecipesBtn.addEventListener('click', () => {
  if (ingredients.length > 0) {
    getRecipes(ingredients); // Fetch recipes using the entered ingredients
  } else {
    alert('Please add some ingredients first!');
  }
});

// Function to get recipes from Spoonacular API
function getRecipes(ingredients) {
  const apiKey = '8300e8af134949e49752c9948b730b71'; // Your actual API key here
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',')}&apiKey=${apiKey}`;

  fetch(url)
    .then(response => response.json()) // Convert the response to JSON format
    .then(data => {
      if (data.length > 0) {
        displayRecipes(data); // Display the recipes on the page
      } else {
        alert('No recipes found for the ingredients entered.');
      }
    })
    .catch(error => {
      console.error('Error fetching recipes:', error);
      alert('There was an error fetching the recipes.');
    });
}

// Function to display the fetched recipes
function displayRecipes(recipes) {
  const recipeContainer = document.getElementById('recipe-container') || document.createElement('div');
  recipeContainer.id = 'recipe-container';
  recipeContainer.innerHTML = '<h2>Recipe Suggestions:</h2>'; // Add a header

  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card'); // Add a class for styling
    recipeCard.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}" style="width:150px;">
      <p>Used Ingredients: ${recipe.usedIngredients.map(ingredient => ingredient.name).join(', ')}</p>
      <button onclick="saveToFavorites('${recipe.title}')">Save to Favorites</button>
    `;
    recipeContainer.appendChild(recipeCard);
  });

  // Append recipe container to the body (or replace if it already exists)
  const existingContainer = document.getElementById('recipe-container');
  if (existingContainer) {
    existingContainer.replaceWith(recipeContainer);
  } else {
    document.body.appendChild(recipeContainer);
  }
}

// Function to save recipes to favorites
let favorites = []; // Array to store favorite recipes
function saveToFavorites(recipeTitle) {
  if (!favorites.includes(recipeTitle)) {
    favorites.push(recipeTitle);
    alert(`${recipeTitle} has been added to your favorites!`);
  } else {
    alert(`${recipeTitle} is already in your favorites.`);
  }
}
