const User = require("../models/User");

exports.findMatches = async (user, searchFilters) => {
  try {
    // Find the current user with populated filters
    const populatedUser = await User.findById(user._id).populate("filters");
    console.log("Step 2: Populated User:", JSON.stringify(populatedUser, null, 2));

    if (!populatedUser || !populatedUser.filters) {
      throw new Error("User or user filters not found");
    }

    // Fetch all users excluding the current user and blocked users
    const allUsers = await User.find({
      _id: { $ne: user._id, $nin: user.blockedUsers || [] },
    }).populate("filters");

    console.log("Step 3: All Users Count:", allUsers.length);

    if (allUsers.length === 0) {
      console.log("No users available to match.");
      return [];
    }

    // Calculate match score for each user
    const matches = allUsers.map((matchedUser) => {
      const matchScore = calculateMatchScore(populatedUser, matchedUser, searchFilters);
      return { user: matchedUser, matchScore };
    });

    // Filter out users with a match score of 0 and sort matches by score in descending order
    const filteredMatches = matches.filter((match) => match.matchScore > 0);
    filteredMatches.sort((a, b) => b.matchScore - a.matchScore);

    console.log("Step 4: Filtered Matches Count:", filteredMatches.length);

    return filteredMatches;
  } catch (error) {
    console.error("Error finding matches:", error);
    throw new Error("Failed to find matches");
  }
};

const calculateMatchScore = (user1, user2, searchFilters) => {
  let score = 0;

  const compareField = (section, key, weight = 1) => {
    if (
      user1.filters[section] &&
      user2.filters[section] &&
      user1.filters[section][key] &&
      user2.filters[section][key]
    ) {
      if (Array.isArray(user1.filters[section][key]) && Array.isArray(user2.filters[section][key])) {
        const commonElements = user1.filters[section][key].filter((item) => user2.filters[section][key].includes(item));
        if (commonElements.length > 0) {
          score += commonElements.length * weight; // Increment score based on number of common elements
        }
      } else if (user1.filters[section][key] === user2.filters[section][key]) {
        score += weight; // Increment score for exact matches
      }
    }
  };

  // Iterate through the filters and calculate the score based on matches
  for (const section in searchFilters) {
    if (searchFilters.hasOwnProperty(section)) {
      for (const key in searchFilters[section]) {
        if (searchFilters[section].hasOwnProperty(key)) {
          console.log(`Comparing field: ${section}.${key}`);
          compareField(section, key);
        }
      }
    }
  }

  console.log(`Calculated match score for user ${user2._id}:`, score);
  return score;
};
