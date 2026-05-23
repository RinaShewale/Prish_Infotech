// ======================================================
// 📁 config/passport.js
// ======================================================

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

import User from "../models/user.model.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL,
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        // ======================================================
        // ✅ GET EMAIL
        // ======================================================

        const email =
          profile.emails?.[0]?.value;

        if (!email) {
          return done(
            new Error(
              "No email received from Google"
            ),
            null
          );
        }

        // ======================================================
        // ✅ FIND USER
        // ======================================================

        let user = await User.findOne({
          email,
        });

        // ======================================================
        // ✅ GOOGLE AVATAR
        // ======================================================

        const avatar =
          profile.photos?.[0]?.value
            ? profile.photos[0].value.replace(
                "s96-c",
                "s400-c"
              )
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                profile.displayName
              )}&background=random&color=fff`;

        // ======================================================
        // ✅ CREATE USER
        // ======================================================

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            avatar,
            role: "student",
          });
        }

        // ======================================================
        // ✅ UPDATE EXISTING USER
        // ======================================================

        else {
          user.googleId = profile.id;

          // always update latest avatar
          user.avatar = avatar;

          await user.save();
        }

        // ======================================================
        // ✅ RETURN USER
        // ======================================================

        return done(null, user);
      } catch (error) {
        console.error(
          "Google Auth Error:",
          error
        );

        return done(error, null);
      }
    }
  )
);

// ======================================================
// ✅ SERIALIZE USER
// ======================================================

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// ======================================================
// ✅ DESERIALIZE USER
// ======================================================

passport.deserializeUser(
  async (id, done) => {
    try {
      const user =
        await User.findById(id);

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
);

export default passport;