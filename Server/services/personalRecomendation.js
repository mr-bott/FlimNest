
const UserMedia = require("../models/userMedia.model");
const axios = require("axios");

const TMDB_API = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

exports.getRecommendations = async (userId) => {
  // 1️⃣ Get user media
  const record = await UserMedia.findOne({ user: userId });

  if (!record || !record.media || record.media.length === 0) {
    return []; // fallback → popular movies
  }

  // 2️⃣ Filter only WATCHED movies
  const watchedMovies = record.media.filter(
    item => item.status === "watched"
  );
  if (watchedMovies.length === 0) {
    return [];
  }

  // 3️⃣ Build genre score
  const genreScore = {};
  const MOVIE_GENRES = new Set([
    28, 12, 16, 35, 80, 99, 18, 10751,
    14, 36, 27, 10402, 9648, 10749,
    878, 53, 10752, 37
  ]);

  watchedMovies.forEach(movie => {
    if (movie.rating >= 7) {
      movie.genres.forEach(genreId => {
        genreScore[genreId] = (genreScore[genreId] || 0) + 1;
      });
    }
  });
  
  // 4️⃣ Sort genres by weight
  const topGenres = Object.entries(genreScore)
    .sort((a, b) => b[1] - a[1])
    .map(([genreId]) => Number(genreId))
    .filter(id => MOVIE_GENRES.has(id))
    .slice(0, 3);

  if (topGenres.length === 0) return [];

  // 5️⃣ Fetch movies from TMDB
  const response = await axios.get(`${TMDB_API}/discover/movie`, {
    params: {
      api_key: API_KEY,
      with_genres: topGenres.join(","),
      sort_by: "popularity.desc"
    }
  });

  // 6️⃣ Remove already watched movies
  const watchedIds = watchedMovies.map(m => m.tmdbId);

  const recommendations = response.data.results.filter(
    movie => !watchedIds.includes(movie.id)
  );

  return recommendations;
};
