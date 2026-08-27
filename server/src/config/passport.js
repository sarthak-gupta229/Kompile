import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.models.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email returned from Google"), null);
        }

       
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          // Google guarantees email ownership, so mark as verified
          user.isEmailVerified = true;
          if (!user.authProvider || user.authProvider === "local") {
            user.authProvider = "google";
          }
          await user.save({ validateBeforeSave: false });
          return done(null, user);
        }

        
        const baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "_");
        const candidateUsername = `${baseUsername}_${profile.id.slice(-4)}`;

       
        const taken = await User.findOne({ username: candidateUsername });
        const finalUsername = taken
          ? `${baseUsername}_${profile.id.slice(-6)}`
          : candidateUsername;

        user = await User.create({
          email,
          username: finalUsername,
          fullname: profile.displayName || baseUsername,
          avatar: {
            url: profile.photos?.[0]?.value || `https://placehold.co/200x200`,
            localPath: "",
          },
          googleId: profile.id,
          authProvider: "google",
          isEmailVerified: true, 
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

export default passport;
