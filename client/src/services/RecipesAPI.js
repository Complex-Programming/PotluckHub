const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllRecipes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/recipes`);
        if (!response.ok) throw new Error('Failed to fetch recipes');
        return await response.json();
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
};

export const createRecipe = async (recipeData) => {
    try {
        const response = await fetch(`${BASE_URL}/api/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        });

        if (!response.ok) {
            throw new Error('Failed to create recipe');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating recipe:', error);
        throw error;
    }
};
