const express = require("express");
const router = express.Router();
const personalRecomendationCtrl = require("../controllers/personalRecomendation.controller"); 
const auth = require('../middleware/auth.middleware');     

router.get("/",auth, personalRecomendationCtrl.recommendMovies);


const {
  getSimilarUserRecommendations,
} = require("../controllers/collaborativeRecomendation.controller");

router.get("/collaborative/:userId", auth, getSimilarUserRecommendations);

module.exports = router;
