import pool from '../config/database.js';

// GET all recipes
export const getAllRecipes = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM recipe ORDER BY id ASC');
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching all recipes:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
};

// GET a single recipe by ID
export const getRecipeById = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const results = await pool.query('SELECT * FROM recipe WHERE id = $1', [recipeId]);

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        res.status(500).json({ error: 'Failed to fetch recipe' });
    }
};

// POST a new recipe
export const createRecipe = async (req, res) => {
    try {
        const { name, description, category, image_url } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Recipe name is required' });
        }

        const insertQuery = `
			INSERT INTO recipe (name, description, category, image_url)
			VALUES ($1, $2, $3, $4)
			RETURNING *
		`;

        const results = await pool.query(insertQuery, [
            name.trim(),
            description || null,
            category || null,
            image_url || null
        ]);

        res.status(201).json(results.rows[0]);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
};
