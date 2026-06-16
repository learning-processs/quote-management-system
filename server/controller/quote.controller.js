// import quoteModel from '../models/quoteModel.js';

// // @GET /api/quotes — public, only approved
// const getQuotes = async (req, res) => {
//   try {
//     const { category, search, page = 1, limit = 12 } = req.query;
//     const filter = { status: 'approved' };

//     if (category) filter.category = category;
//     if (search) filter.text = { $regex: search, $options: 'i' };

//     const skip = (page - 1) * limit;
//     const total = await quoteModel.countDocuments(filter);
//     const quotes = await quoteModel.find(filter)
//       .populate('submittedBy', 'name')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(Number(limit));

//     return res.status(200).json({
//       success: true,
//       data: { quotes, total, page: Number(page), pages: Math.ceil(total / limit) },
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// // @GET /api/quotes/:id
// const getQuote = async (req, res) => {
//   try {
//     const quote = await quoteModel.findById(req.params.id).populate('submittedBy', 'name');
//     if (!quote)
//       return res.status(404).json({ success: false, message: 'Quote not found.' });

//     return res.status(200).json({ success: true, data: { quote } });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// // @POST /api/quotes — logged in users
// const createQuote = async (req, res) => {
//   try {
//     const { text, author, category } = req.body;

//     if (!text)
//       return res.status(400).json({ success: false, message: 'Quote text is required.' });

//     const quote = await quoteModel.create({
//       text,
//       author,
//       category,
//       submittedBy: req.user._id,
//       status: req.user.role === 'admin' ? 'approved' : 'pending',
//     });

//     return res.status(201).json({
//       success: true,
//       message: 'Quote submitted successfully.',
//       data: { quote },
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// // @PUT /api/quotes/:id — owner or admin
// const updateQuote = async (req, res) => {
//   try {
//     const quote = await quoteModel.findById(req.params.id);
//     if (!quote)
//       return res.status(404).json({ success: false, message: 'Quote not found.' });

//     const isOwner = quote.submittedBy.toString() === req.user._id.toString();
//     const isAdmin = req.user.role === 'admin';

//     if (!isOwner && !isAdmin)
//       return res.status(403).json({ success: false, message: 'Not authorized.' });

//     const { text, author, category } = req.body;
//     if (text)     quote.text     = text;
//     if (author)   quote.author   = author;
//     if (category) quote.category = category;

//     if (!isAdmin) quote.status = 'pending';

//     await quote.save();
//     return res.status(200).json({ success: true, message: 'Quote updated.', data: { quote } });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// // @DELETE /api/quotes/:id — owner or admin
// const deleteQuote = async (req, res) => {
//   try {
//     const quote = await quoteModel.findById(req.params.id);
//     if (!quote)
//       return res.status(404).json({ success: false, message: 'Quote not found.' });

//     const isOwner = quote.submittedBy.toString() === req.user._id.toString();
//     const isAdmin = req.user.role === 'admin';

//     if (!isOwner && !isAdmin)
//       return res.status(403).json({ success: false, message: 'Not authorized.' });

//     await quote.deleteOne();
//     return res.status(200).json({ success: true, message: 'Quote deleted.' });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// // @PUT /api/quotes/:id/like — toggle like
// const likeQuote = async (req, res) => {
//   try {
//     const quote = await quoteModel.findById(req.params.id);
//     if (!quote)
//       return res.status(404).json({ success: false, message: 'Quote not found.' });

//     const userId = req.user._id.toString();
//     const already = quote.likes.map(id => id.toString()).includes(userId);

//     if (already) {
//       quote.likes = quote.likes.filter(id => id.toString() !== userId);
//     } else {
//       quote.likes.push(req.user._id);
//     }

//     await quote.save();
//     return res.status(200).json({
//       success: true,
//       message: already ? 'Unliked.' : 'Liked.',
//       data: { likes: quote.likes.length },
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// export { getQuotes, getQuote, createQuote, updateQuote, deleteQuote, likeQuote };


import quoteModel from '../models/quoteModel.js';

// @GET /api/quotes — public, only approved
const getQuotes = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const filter = { status: 'approved' };

    if (category) filter.category = category;
    if (search) filter.text = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const total = await quoteModel.countDocuments(filter);
    const quotes = await quoteModel.find(filter)
      .populate('submittedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: { quotes, total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/quotes/:id
const getQuote = async (req, res) => {
  try {
    const quote = await quoteModel.findById(req.params.id).populate('submittedBy', 'name');
    if (!quote)
      return res.status(404).json({ success: false, message: 'Quote not found.' });

    return res.status(200).json({ success: true, data: { quote } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/quotes — logged in users (No permission required!)
const createQuote = async (req, res) => {
  try {
    const { text, author, category } = req.body;

    if (!text)
      return res.status(400).json({ success: false, message: 'Quote text is required.' });

    const quote = await quoteModel.create({
      text,
      author: author || 'Unknown',
      category: category || 'Other',
      submittedBy: req.user._id,
      status: 'approved', // 🔥 Changed from conditional check to 'approved' for everyone
    });

    return res.status(201).json({
      success: true,
      message: 'Quote published instantly!', // Adjusted message to reflect live update
      data: { quote },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/quotes/:id — owner or admin
const updateQuote = async (req, res) => {
  try {
    const quote = await quoteModel.findById(req.params.id);
    if (!quote)
      return res.status(404).json({ success: false, message: 'Quote not found.' });

    const isOwner = quote.submittedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin)
      return res.status(403).json({ success: false, message: 'Not authorized.' });

    const { text, author, category } = req.body;
    if (text)     quote.text     = text;
    if (author)   quote.author   = author;
    if (category) quote.category = category;

    // 🔥 Removed the line: if (!isAdmin) quote.status = 'pending';
    // This ensures edited quotes don't accidentally hide from the dashboard again!
    quote.status = 'approved'; 

    await quote.save();
    return res.status(200).json({ success: true, message: 'Quote updated live!', data: { quote } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/quotes/:id — owner or admin
const deleteQuote = async (req, res) => {
  try {
    const quote = await quoteModel.findById(req.params.id);
    if (!quote)
      return res.status(404).json({ success: false, message: 'Quote not found.' });

    const isOwner = quote.submittedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin)
      return res.status(403).json({ success: false, message: 'Not authorized.' });

    await quote.deleteOne();
    return res.status(200).json({ success: true, message: 'Quote deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/quotes/:id/like — toggle like
const likeQuote = async (req, res) => {
  try {
    const quote = await quoteModel.findById(req.params.id);
    if (!quote)
      return res.status(404).json({ success: false, message: 'Quote not found.' });

    const userId = req.user._id.toString();
    const already = quote.likes.map(id => id.toString()).includes(userId);

    if (already) {
      quote.likes = quote.likes.filter(id => id.toString() !== userId);
    } else {
      quote.likes.push(req.user._id);
    }

    await quote.save();
    return res.status(200).json({
      success: true,
      message: already ? 'Unliked.' : 'Liked.',
      data: { likes: quote.likes.length },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export { getQuotes, getQuote, createQuote, updateQuote, deleteQuote, likeQuote };