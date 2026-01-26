const WatchedMovie = require("../models/recentlyViewed.model");

// Jaccard similarity
const jaccardSimilarity = (setA, setB) => {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
};

exports.getCollaborativeRecommendations = async (
  userId,
  threshold = 0.3,
  limit = 10
) => {
  //  Fetch all users' watched data
  const allUsersData = await WatchedMovie.find();

  //  Get target user's data
  const target = allUsersData.find(
    u => u.user.toString() === userId
  );

  if (!target || target.watchedMovies.length === 0) {
    return []; // fallback handled at controller
  }

  const targetMovies = new Set(
    target.watchedMovies.map(m => m.tmdbId)
  );

  const similarUsers = [];

  //  Find similar users
  for (const other of allUsersData) {
    if (other.user.toString() === userId) continue;

    const otherMovies = new Set(
      other.watchedMovies.map(m => m.tmdbId)
    );

    const similarity = jaccardSimilarity(
      targetMovies,
      otherMovies
    );

    if (similarity >= threshold) {
      similarUsers.push(other);
    }
  }

  //  Collect candidate recommendations
  const recommendationMap = new Map();

  for (const user of similarUsers) {
    for (const movie of user.watchedMovies) {
      if (!targetMovies.has(movie.tmdbId)) {
        const count = recommendationMap.get(movie.tmdbId) || {
          ...movie,
          score: 0,
        };
        count.score += 1;
        recommendationMap.set(movie.tmdbId, count);
      }
    }
  }

  //  Sort & limit
  return [...recommendationMap.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};
