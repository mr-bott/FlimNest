const {
  getCollaborativeRecommendations,
} = require("../services/collaborativeRecomendation");

exports.getSimilarUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    const recommendations =
      await getCollaborativeRecommendations(userId);

    if (recommendations.length === 0) {
      return res.json({
        message: "No similar users found. Show popular movies.",
        recommendations: [],
      });
    }

    res.json({
      basedOn: "similar users",
      recommendations,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
