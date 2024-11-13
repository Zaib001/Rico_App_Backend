exports.searchUsers = async (query) => {
    return await User.find({ $text: { $search: query } });
  };
  