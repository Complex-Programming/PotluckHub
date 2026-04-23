import { useEffect, useState } from 'react';
import { createRecipe, getAllRecipes } from '../services/RecipesAPI';
import '../styles/RecipeLibrary.css';

const initialFormState = {
  name: '',
  description: '',
  category: 'Appetizer',
  image_url: ''
};

export default function RecipeLibrary() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await getAllRecipes();
      setRecipes(data);
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const newRecipe = await createRecipe({
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim()
      });

      setRecipes((prev) => [newRecipe, ...prev]);
      setFormData(initialFormState);
    } catch {
      setError('Could not add recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="recipe-library-page">
      <h1>Recipe Library</h1>
      <p className="recipe-subtitle">Browse shared recipes and add a new one.</p>

      <section className="recipe-form-section">
        <h2>Add Recipe</h2>
        <form className="recipe-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Recipe name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Short description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Appetizer">Appetizer</option>
            <option value="Main">Main</option>
            <option value="Side">Side</option>
            <option value="Dessert">Dessert</option>
            <option value="Drink">Drink</option>
          </select>
          <input
            type="url"
            name="image_url"
            placeholder="Image URL (optional)"
            value={formData.image_url}
            onChange={handleChange}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Recipe'}
          </button>
        </form>
        {error && <p className="recipe-error">{error}</p>}
      </section>

      <section className="recipe-list-section">
        <h2>All Recipes</h2>
        {loading ? (
          <p>Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <p>No recipes yet. Add the first one above.</p>
        ) : (
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <article className="recipe-card" key={recipe.id}>
                {recipe.image_url ? (
                  <img src={recipe.image_url} alt={recipe.name} className="recipe-image" />
                ) : (
                  <div className="recipe-image-placeholder">No image</div>
                )}
                <div className="recipe-card-content">
                  <h3>{recipe.name}</h3>
                  <p className="recipe-category">{recipe.category || 'Uncategorized'}</p>
                  <p>{recipe.description || 'No description provided.'}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}