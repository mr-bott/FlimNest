const recommendationService = require('../services/personalRecomendation');

exports.recommendMovies = async (req, res) => {
  try {
    const userId = req.user.id; // coming from JWT middleware

    const recommendations =
      await recommendationService.getRecommendations(userId);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
};