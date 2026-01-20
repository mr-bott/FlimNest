require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const {RedisStore} = require("connect-redis");

const userRoutes = require("./routes/user.routes");
const watchedMovie = require("./routes/recentlyViewed.routes");
const recommendRoutes = require("./routes/recommended.routes");
const userMediaRoutes = require("./routes/userMedia.routes");
const profileRoutes = require("./routes/profile.routes");
const authenticateRoutes = require("./routes/authenticate.routes");
const rateLimiter = require("./middleware/reteLimiter.middleware");
const redisClient = require("./rateLimiter/redisClient");

require("./config/passport");

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    name: 'sid',
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: false,          // HTTPS only
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.use(
//   rateLimiter({
//     windowSeconds: 60,
//     maxRequests: 100,
//   })
// );

const connectDB = require("./config/db");
connectDB();


app.use("/auth", require("./routes/auth"));
app.use("/api/authenticate", authenticateRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recently", watchedMovie);
app.use("/api/recommend", recommendRoutes);
app.use("/api", userMediaRoutes);
app.use("/api/profile", profileRoutes);

app.listen(3000, () => console.log("Server running on 3000"));

// Login Button
// <button (click)="googleLogin()">Login with Google</button>

// Component
// googleLogin() {
//   window.location.href = 'http://localhost:3000/auth/google';
// }

// 7️⃣ OAuth Success Page

// oauth-success.component.ts

// ngOnInit() {
//   const token = new URLSearchParams(window.location.search).get('token');
//   if (token) {
//     localStorage.setItem('token', token);
//     window.location.href = '/';
//   }
// }
