const matchService = require('../services/matchService');
const User = require('../models/User');

/**
 * Handle match search requests.
 */
exports.searchMatches = async (req, res) => {
  try {
    const userId = req.user._id;
    const searchFilters = req.body.filters;

    if (!searchFilters || typeof searchFilters !== 'object') {
      return res.status(400).json({ error: 'Invalid search filters provided' });
    }

    console.log('Received search request from user:', userId);
    console.log('Search Filters:', JSON.stringify(searchFilters, null, 2));

    const user = await User.findById(userId).populate('filters');
    if (!user) {
      console.error('User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Found User:', user._id);

    const matches = await matchService.findMatches(user, searchFilters);

    if (matches.length === 0) {
      console.warn('No matches found for user:', userId);
    }

    res.status(200).json({ 
      success: true, 
      matches, 
      message: matches.length > 0 ? 'Matches found' : 'No matches found' 
    });
  } catch (error) {
    console.error('Error searching matches:', error);

    // Specific error response based on the type of error
    if (error.message.includes('Failed to find matches')) {
      return res.status(500).json({ error: 'Internal match finding error' });
    }

    res.status(500).json({ error: 'Failed to search matches' });
  }
};
