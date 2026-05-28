import { transactionService } from '../services/transactionService.js';
import { dataStore } from '../services/dataStore.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

export const getAllTransactions = (req, res, next) => {
  try {
    const transactions = transactionService.getAll();
    successResponse(res, transactions);
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = (req, res, next) => {
  try {
    const transaction = transactionService.getById(req.params.id);
    if (!transaction) {
      return errorResponse(res, 'Transaction not found', 404);
    }
    successResponse(res, transaction);
  } catch (error) {
    next(error);
  }
};

export const createTransaction = (req, res, next) => {
  try {
    const transaction = transactionService.create(req.body);
    dataStore.save();
    successResponse(res, transaction, 201);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = (req, res, next) => {
  try {
    const transaction = transactionService.update(req.params.id, req.body);
    dataStore.save();
    successResponse(res, transaction);
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = (req, res, next) => {
  try {
    const transaction = transactionService.delete(req.params.id);
    dataStore.save();
    successResponse(res, transaction);
  } catch (error) {
    next(error);
  }
};
