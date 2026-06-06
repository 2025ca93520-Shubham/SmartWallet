import { dashboardService } from '../services/dashboardService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

export const getDashboardSummary = (req, res, next) => {
  try {
    const month = req.query.month ? parseInt(req.query.month, 10) : null;
    const year = req.query.year ? parseInt(req.query.year, 10) : null;

    if (month !== null && (month < 1 || month > 12)) {
      return errorResponse(res, 'Month must be between 1 and 12', 400);
    }
    if (year !== null && year < 2020) {
      return errorResponse(res, 'Year must be 2020 or later', 400);
    }

    const summary = dashboardService.getSummary(month, year);
    successResponse(res, summary);
  } catch (error) {
    next(error);
  }
};

export const getMonthlyTrends = (req, res, next) => {
  try {
    const trends = dashboardService.getMonthlyTrends();
    successResponse(res, trends);
  } catch (error) {
    next(error);
  }
};

export const getCategoryComparison = (req, res, next) => {
  try {
    const comparison = dashboardService.getCategoryComparison();
    successResponse(res, comparison);
  } catch (error) {
    next(error);
  }
};
