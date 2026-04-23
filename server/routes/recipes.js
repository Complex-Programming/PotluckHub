import express from 'express';
import { getAllRecipes, getRecipeById, createRecipe } from '../controllers/recipes.js';

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.post('/', createRecipe);

export default router;
