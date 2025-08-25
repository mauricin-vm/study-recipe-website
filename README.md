# Livro de Receitas - Recipe Search Application

A responsive web application that allows users to search for recipes from around the world and automatically translates them to Portuguese. Built with vanilla HTML, CSS, and JavaScript, integrating with TheMealDB API and MyMemory Translation API.

## ✨ Features

- **🔍 Recipe Search**: Search for recipes by name in Portuguese or English
- **🌍 Auto Translation**: Automatic translation of recipes, ingredients, and instructions to Portuguese
- **📱 Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile devices
- **🎨 Modern Interface**: Clean design with smooth animations and transitions
- **⚡ Real-time Results**: Instant search results with recipe previews
- **📖 Detailed Views**: Complete recipe information including ingredients and step-by-step instructions
- **🏷️ Recipe Categories**: Browse recipes by category and cuisine origin
- **💡 Smart Suggestions**: Quick access to popular recipe categories

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **APIs**: 
  - [TheMealDB API](https://www.themealdb.com/api.php) for recipe data
  - [MyMemory Translation API](https://mymemory.translated.net/) for automatic translation
- **Fonts**: Alice serif font from Google Fonts
- **Icons**: Custom SVG icons for UI elements

## 🎯 How It Works

1. **Welcome Screen**: Users are greeted with a search interface and popular suggestions
2. **Search Functionality**: Users can search for recipes in Portuguese
3. **Translation Process**: Search terms are translated to English for API queries
4. **Recipe Results**: Results are displayed with translated names and categories
5. **Detailed View**: Full recipe details with translated ingredients and instructions
6. **Navigation**: Easy navigation back to search or home screen

## 📁 Project Structure

```
study-recipe-website/
├── assets/
│   ├── bg.jpg          # Background texture image
│   ├── heart.svg       # Heart icon for footer
│   └── main-image.jpg  # Main recipe placeholder image
├── index.html          # Main HTML structure and UI
├── style.css           # Complete styling with responsive design
├── script.js           # JavaScript functionality and API integration
└── README.md           # This documentation file
```

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   cd study-recipe-website
   ```

2. **Open the application**:
   - Simply open `index.html` in your web browser
   - No build process or local server required

3. **Start searching**:
   - Click "Buscar Receitas" to open the search menu
   - Type a recipe name in Portuguese or English
   - Browse and select from the results

## 🎨 Design Features

- **Color Palette**: Warm browns (#573A37, #291B1A) with cream background (#F0E8C2)
- **Typography**: Alice serif font for elegant, readable text
- **Responsive Layout**: Mobile-first design with breakpoints for tablet and desktop
- **Custom Scrollbars**: Styled scrollbars matching the design theme
- **Smooth Animations**: Transitions and hover effects for better user experience
- **Loading States**: Visual feedback during API calls and translations

## 🔧 Key Functions

### Search & Translation
- `handleSearch()`: Processes search queries and translates them
- `translateToEnglish()` / `translateToPortuguese()`: Translation utilities
- `displayResults()`: Renders search results with translated content

### Recipe Display
- `openRecipeDetails()`: Fetches and displays complete recipe information
- `showRecipeInMainPage()`: Renders detailed recipe view
- `restoreOriginalContent()`: Returns to welcome screen

### UI Management
- `openSearchMenu()` / `closeSearchMenu()`: Search overlay controls
- `showLoadingPage()` / `showErrorPage()`: Loading and error states

## 📱 Responsive Breakpoints

- **Mobile**: Up to 480px width
- **Tablet**: 481px to 768px width  
- **Small Desktop**: 769px to 1024px width
- **Large Desktop**: 1025px and above

## 🌐 API Integration

### TheMealDB API
- **Search**: `https://www.themealdb.com/api/json/v1/1/search.php?s={query}`
- **Details**: `https://www.themealdb.com/api/json/v1/1/lookup.php?i={id}`

### MyMemory Translation API
- **Translation**: `https://api.mymemory.translated.net/get?q={text}&langpair={from}|{to}`

## 👨‍💻 Author

**Maurício Valente Martins**

## 📄 License

This project is for educational purposes and personal portfolio demonstration.

---

*A modern web application showcasing frontend development skills with API integration, responsive design, and multilingual support.*