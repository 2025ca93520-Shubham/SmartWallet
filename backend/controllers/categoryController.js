import { categoryService } from '../services/categoryService.js';
import { dataStore } from '../services/dataStore.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

export const getAllCategories = (req, res, next) => {
  try {
    const categories = categoryService.getAll();
    successResponse(res, categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = (req, res, next) => {
  try {
    const category = categoryService.getById(req.params.id);
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }
    successResponse(res, category);
  } catch (error) {
    next(error);
  }
};

export const createCategory = (req, res, next) => {
  try {
    const category = categoryService.create(req.body);
    dataStore.save();
    successResponse(res, category, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = (req, res, next) => {
  try {
    const category = categoryService.update(req.params.id, req.body);
    dataStore.save();
    successResponse(res, category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = (req, res, next) => {
  try {
    const category = categoryService.delete(req.params.id);
    dataStore.save();
    successResponse(res, category);
  } catch (error) {
    next(error);
  }
};
