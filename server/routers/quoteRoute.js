import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { createQuote, deleteQuote, getQuote, getQuotes, likeQuote, updateQuote } from '../controller/quote.controller.js';

const quoteRouter = express.Router();

quoteRouter.get('/' , getQuotes);  // get all approved quotes
quoteRouter.get('/:id' , getQuote);  // get single quote

quoteRouter.post('/',authMiddleware , createQuote)
quoteRouter.put('/:id',authMiddleware , updateQuote)
quoteRouter.delete('/:id',authMiddleware , deleteQuote)
quoteRouter.put('/:id/like',authMiddleware , likeQuote)

export default quoteRouter;