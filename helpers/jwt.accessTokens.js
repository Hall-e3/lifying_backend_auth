import JWT from "jsonwebtoken";
import createErrors from "http-errors";
export const signedAccessToken = (user_id) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.SECRET_ACCESS_TOKEN;
    const options = {
      expiresIn: "5m",
      audience: [user_id],
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

export const verifyAccessToken = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) return next(createErrors.Unauthorized());
    const auth_token = req.headers["authorization"].split(" ")[1];
    JWT.verify(
      auth_token,
      process.env.SECRET_ACCESS_TOKEN,
      (error, payload) => {
        if (error) {
          const message =
            error.name === "JsonWebTokenError" ? "Unauthorized" : error.message;
          next(createErrors.Unauthorized(message));
        }
        req.payload = payload;
        next();
      }
    );
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = (user_id) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.SECRET_REFRESH_TOKEN;
    const options = {
      expiresIn: "1y",
      audience: [user_id],
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) reject(createErrors.InternalServerError("This sucks"));
      resolve(token);
    });
  });
};

export const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.SECRET_REFRESH_TOKEN,
      (err, payload) => {
        if (err) reject(createErrors.Unauthorized());
        const user_id = payload.aud[0];
        resolve(user_id);
      }
    );
  });
};
