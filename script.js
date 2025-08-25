// DOM elements
const searchMenu = document.getElementById('search-menu');
const searchOverlay = document.getElementById('search-overlay');
const closeButton = document.getElementById('close-search');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');

// event listeners
closeButton.addEventListener('click', closeSearchMenu);
searchOverlay.addEventListener('click', closeSearchMenu);
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', function (e) {
	if (e.key === 'Enter') handleSearch();
});

// open search menu
function openSearchMenu() {
	const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
	searchMenu.classList.add('active');
	searchOverlay.classList.add('active');
	document.body.style.overflow = 'hidden';
	document.body.style.paddingRight = scrollbarWidth + 'px';
	searchInput.focus();
};

// close search menu
function closeSearchMenu() {
	searchMenu.classList.remove('active');
	searchOverlay.classList.remove('active');
	document.body.style.overflow = '';
	document.body.style.paddingRight = '';
	searchInput.value = '';
	searchResults.innerHTML = '';
};

// translate portuguese to english
async function translateToEnglish(text) {
	try {
		const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt|en`);
		const data = await response.json();
		return data.responseData.translatedText;
	} catch (error) {
		console.error('Erro na tradução:', error);
		return text;
	};
};

// search
async function handleSearch() {
	const query = searchInput.value.trim();
	if (!query) return;
	searchResults.innerHTML = '<div class="loading">Traduzindo e buscando receitas...</div>';
	try {
		const translatedQuery = await translateToEnglish(query);
		const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(translatedQuery)}`);
		const data = await response.json();
		displayResults(data.meals);
	} catch (error) {
		console.error('Erro ao buscar receitas:', error);
		searchResults.innerHTML = '<div class="no-results">Erro ao buscar receitas. Tente novamente.</div>';
	};
};

// translate english to portuguese
async function translateToPortuguese(text) {
	try {
		const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt`);
		const data = await response.json();
		return data.responseData.translatedText;
	} catch (error) {
		console.error('Erro na tradução:', error);
		return text;
	}
}

// display results
async function displayResults(meals) {
	if (!meals || meals.length === 0) {
		searchResults.innerHTML = '<div class="no-results">Nenhuma receita encontrada.</div>';
		return;
	}
	const translatedMeals = await Promise.all(
		meals.slice(0, 8).map(async meal => {
			const translatedName = await translateToPortuguese(meal.strMeal);
			const translatedCategory = await translateToPortuguese(meal.strCategory);
			const translatedArea = await translateToPortuguese(meal.strArea);
			return {
				...meal,
				translatedName,
				translatedCategory,
				translatedArea
			};
		})
	);

	const resultsHTML = translatedMeals.map(meal => `
		<div class="recipe-item" onclick="openRecipeDetails('${meal.idMeal}')">
			<img src="${meal.strMealThumb}" alt="${meal.translatedName}">
			<div class="recipe-info">
				<h4>${meal.translatedName}</h4>
				<p>${meal.translatedCategory} • ${meal.translatedArea}</p>
			</div>
		</div>
	`).join('');

	searchResults.innerHTML = resultsHTML;
};

// open recipe details
async function openRecipeDetails(mealId) {
	try {
		closeSearchMenu();
		showLoadingPage();

		const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
		const data = await response.json();
		const meal = data.meals[0];
		const translatedName = await translateToPortuguese(meal.strMeal);
		const translatedArea = await translateToPortuguese(meal.strArea);
		const translatedCategory = await translateToPortuguese(meal.strCategory);
		let translatedInstructions = '';
		if (meal.strInstructions && meal.strInstructions.length > 300) {
			const sentences = meal.strInstructions.split('. ');
			const translatedSentences = [];
			for (const sentence of sentences) {
				if (sentence.trim()) {
					const sentenceToTranslate = sentence.trim() + (sentence.trim().endsWith('.') ? '' : '.');
					if (sentenceToTranslate.length > 300) {
						const parts = sentenceToTranslate.split(', ');
						for (const part of parts) {
							if (part.trim()) {
								try {
									if (part.length < 300) {
										const translated = await translateToPortuguese(part.trim());
										translatedSentences.push(translated);
									} else {
										// se ainda for muito longo, manter original
										translatedSentences.push(part.trim());
									}
								} catch (error) {
									translatedSentences.push(part.trim());
								}
							}
						}
					} else {
						try {
							const translated = await translateToPortuguese(sentenceToTranslate);
							translatedSentences.push(translated);
						} catch (error) {
							translatedSentences.push(sentenceToTranslate);
						}
					}
				}
			}
			translatedInstructions = translatedSentences.join('. ');
		} else {
			try {
				translatedInstructions = await translateToPortuguese(meal.strInstructions);
			} catch (error) {
				translatedInstructions = meal.strInstructions;
			}
		}

		const ingredients = [];
		for (let i = 1; i <= 20; i++) {
			const ingredient = meal[`strIngredient${i}`];
			const measure = meal[`strMeasure${i}`];
			if (ingredient && ingredient.trim()) {
				try {
					const translatedIngredient = await translateToPortuguese(ingredient);
					const translatedMeasure = measure && measure.trim() ? await translateToPortuguese(measure) : '';
					ingredients.push(`${translatedMeasure} ${translatedIngredient}`.trim());
				} catch (error) {
					const originalMeasure = measure && measure.trim() ? measure : '';
					ingredients.push(`${originalMeasure} ${ingredient}`.trim());
				}
			}
		}
		showRecipeInMainPage({
			...meal,
			translatedName,
			translatedArea,
			translatedCategory,
			translatedInstructions,
			translatedIngredients: ingredients
		});
	} catch (error) {
		console.error('Erro ao buscar detalhes da receita:', error);
		showErrorPage('Erro ao carregar detalhes da receita');
	};
};

// show recipe in main page
function showRecipeInMainPage(meal) {
	const pageDiv = document.getElementById('page');
	const instructionSteps = meal.translatedInstructions.split(/\r\n|\r|\n/).filter(step => step.trim()).map(step => step.trim());
	pageDiv.innerHTML = `
		<button id="back-button" class="back-button">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M19 12H5"></path>
				<path d="M12 19l-7-7 7-7"></path>
			</svg>
			Voltar
		</button>

		<img src="${meal.strMealThumb}" alt="${meal.translatedName}">

		<main>
			<section id="about">
				<h1>${meal.translatedName}</h1>
				<p>
					Categoria: ${meal.translatedCategory}<br>
					Origem: ${meal.translatedArea}<br>
					${meal.strTags ? `Tags: ${meal.strTags}` : ''}
				</p>
			</section>

			<section id="ingredients">
				<h2>Ingredientes</h2>
				<ul>
					${meal.translatedIngredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
				</ul>
			</section>

			<section id="preparation">
				<h2>Modo de preparo</h2>
				<div class="instructions-text">
					${instructionSteps.length > 1
			? `<ol class="instructions-list">${instructionSteps.map(step => `<li>${step}</li>`).join('')}</ol>`
			: `<p>${meal.translatedInstructions}</p>`
		}
				</div>
			</section>
		</main>
	`;
	document.getElementById('back-button').addEventListener('click', restoreOriginalContent);
}

// show loading page
function showLoadingPage() {
	const pageDiv = document.getElementById('page');
	pageDiv.innerHTML = `
		<div class="loading-screen">
			<div class="loading-content">
				<div class="loading-spinner"></div>
				<h2>Carregando receita...</h2>
				<p>Traduzindo ingredientes e instruções para português</p>
			</div>
		</div>
	`;
}

// show error page
function showErrorPage(message) {
	const pageDiv = document.getElementById('page');
	pageDiv.innerHTML = `
		<div class="error-screen">
			<div class="error-content">
				<div class="error-icon">⚠️</div>
				<h2>Ops! Algo deu errado</h2>
				<p>${message}</p>
				<button class="back-button" onclick="restoreOriginalContent()">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M19 12H5"></path>
						<path d="M12 19l-7-7 7-7"></path>
					</svg>
					Voltar ao início
				</button>
			</div>
		</div>
	`;
}

// restore original content (tela inicial)
function restoreOriginalContent() {
	const pageDiv = document.getElementById('page');
	pageDiv.innerHTML = `
		<div class="welcome-screen">
			<div class="welcome-content">
				<div class="welcome-icon">
					<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
						<line x1="3" y1="6" x2="21" y2="6"></line>
						<path d="M16 10a4 4 0 0 1-8 0"></path>
					</svg>
				</div>
				<h1>Bem-vindo ao Livro de Receitas</h1>
				<p>Descubra receitas incríveis de todo o mundo traduzidas para o português. Use o botão de busca para encontrar a receita perfeita para você!</p>
				
				<button class="main-search-btn" onclick="openSearchMenu()">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8"></circle>
						<path d="21 21l-4.35-4.35"></path>
					</svg>
					Buscar Receitas
				</button>

				<div class="welcome-suggestions">
					<h3>Sugestões populares:</h3>
					<div class="suggestion-buttons">
						<button class="suggestion-btn" onclick="searchSuggestion('pizza')">Pizza</button>
						<button class="suggestion-btn" onclick="searchSuggestion('pasta')">Massas</button>
						<button class="suggestion-btn" onclick="searchSuggestion('cake')">Bolos</button>
						<button class="suggestion-btn" onclick="searchSuggestion('chicken')">Frango</button>
					</div>
				</div>
			</div>
		</div>
	`;
}

// search suggestion from welcome screen
function searchSuggestion(term) {
	openSearchMenu();
	searchInput.value = term;
	handleSearch();
}

// close search menu with ESC
document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') closeSearchMenu();
});