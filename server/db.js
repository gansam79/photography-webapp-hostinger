import mongoose from "mongoose";

const DEFAULT_HOST = "cluster0.ds2nlug.mongodb.net";
const DEFAULT_APP_NAME = "Cluster0";

const buildMongoUri = () => {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const host = process.env.MONGODB_HOST || DEFAULT_HOST;
  if (!username || !password) return null;

  const encodedUser = encodeURIComponent(username);
  const encodedPass = encodeURIComponent(password);
  return `mongodb+srv://${encodedUser}:${encodedPass}@${host}/?retryWrites=true&w=majority&appName=${process.env.MONGODB_APP_NAME || DEFAULT_APP_NAME}`;
};
// Manual Override for emergency
// const buildMongoUri = () => "mongodb+srv://photograper:photograper@cluster0.sy94kcl.mongodb.net/?appName=Cluster0";

export const connectDB = async () => {
  try {
    const mongoUri = buildMongoUri();
    if (!mongoUri) {
      throw new Error(
        "MongoDB connection settings are missing. Provide MONGODB_URI or MONGODB_USERNAME/MONGODB_PASSWORD in your environment."
      );
    }

    // Optional debug logging controlled by env
    if (process.env.MONGO_DEBUG === "true") {
      mongoose.set("debug", true);
    }

    // Wire up connection event listeners to make connection state visible in logs
    mongoose.connection.on("connected", () => {
      console.log("✅ Mongoose connected to database", mongoose.connection.name || process.env.DATABASE_NAME || "(unknown)");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err && err.message ? err.message : err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Mongoose disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔁 Mongoose reconnected");
    });

    await mongoose.connect(mongoUri, {
      // Hardcoded to "photograper" to match the actual MongoDB database name
      dbName: "photograper",
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error && error.message ? error.message : error);
    // In development we don't want the whole dev server to exit if the DB is unreachable.
    // Set EXIT_ON_DB_FAIL=true in the environment to preserve the original behavior.
    if (process.env.EXIT_ON_DB_FAIL === "true") {
      process.exit(1);
    }
    return null;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
  } catch (error) {
    console.error("❌ MongoDB disconnection error:", error);
  }
};

export const getDbStatus = () => {
  // mongoose.connection.readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  return mongoose.connection.readyState;
};
