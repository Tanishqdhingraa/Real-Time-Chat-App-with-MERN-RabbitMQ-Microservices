import { publishtoQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisclient } from "../index.js";
import { User } from "../model/User.js";

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;

  const ratelimitkey = `otp:ratelimit:${email}`;
  const ratelimit = await redisclient.get(ratelimitkey);

  // correct logic: block if exists
  if (ratelimit) {
    res.status(429).json({
      message: "TOO MANY REQUESTS. PLEASE WAIT FOR NEW OTP",
    });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpKey = `otp:${email}`;
  await redisclient.set(otpKey, otp, {
    EX: 300,
  });

  await redisclient.set(ratelimitkey, "true", {
    EX: 60,
  });

  const message = {
    to: email,
    subject: "Your OTP Code",
    body: `Your OTP is ${otp}. It is valid for 5 MINUTES`,
  };

  // queue name fixed
  await publishtoQueue("send-otp", message);

  res.status(200).json({
    message: `OTP sent to your mail`,
  });
});

export const Verifyuseer = TryCatch(async(req,res)=>{
  const {email, otp:enteredOtp}= req.body;

  if(!email|| !enteredOtp){
    res.status(400).json({
      message:"email and otp both are required",
    })
    return;
  }
  const otpKey = `otp:${email}`

  const storedotp = await redisclient.get(otpKey)

  if(!storedotp || storedotp != enteredOtp){
    res.status(400).json({
      message:`Otp is expired or invalid `
    })
    return;
  }

  await redisclient.del(otpKey);

  let user = await User.findOne({email})

  if(!user){
    const name = email.slice(0,8);
    user = await User.create({name,email});
  }

  const token
})
