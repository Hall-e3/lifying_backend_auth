import crypto from "crypto";

const secretAccessToken = crypto.randomBytes(32).toString('hex');
const secretRefreshToken = crypto.randomBytes(32).toString('hex');
console.table({secretAccessToken,secretRefreshToken});

// const accessToken = jwt.sign(
    //   { user_id: newUser._id, email: newUser.email },
    //   process.env.SECRET_ACCESS_TOKEN,
    //   {
    //     expiresIn: "30m",
    //   }
    // );
    // newUser.token = accessToken;

  //   const accessToken = jwt.sign(
      //     { user_id: user._id, email:user.email },
      //     process.env.SECRET_ACCESS_TOKEN,
      //     {
      //       expiresIn: "30m",
      //     }
      //   );
      //   user.token = accessToken;

      // client.SET(user_id, token, "EX", 365 * 24 * 60 * 60, (error, reply) => {
      //   if (error) reject(createErrors.InternalServerError());
      //   resolve(token);
      // });

      // client.GET(user_id, (error, result) => {
      //   if (error) {
      //     console.log(error.message);
      //     reject(createErrors.InternalServerError());
      //     return;
      //   }
      //   if (refreshToken == result) return resolve(user_id);
      //   reject(createErrors.Unauthorized());
      // });