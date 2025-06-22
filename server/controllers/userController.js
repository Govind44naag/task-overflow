import User from '../model/userModel.js'
import {userSignupSchema,userSigninSchema,zodProfile} from '../model/zodModel.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const JWT_SECRET=process.env.JWT_SECRET || 'your_jwt_secret_here'
const TOKEN_EXPIRES='24h'

const createToken=(userId)=>jwt.sign({id:userId},JWT_SECRET,{expiresIn:TOKEN_EXPIRES})

export async function registerUser(req,res){  
    
    const response=userSignupSchema.safeParse(req.body)
    if (!response.success) {
  const zodError = response.error.format();

  // Extract the first error message (optional, you can also send all)
  const firstError = Object.values(zodError).find((field) => field?._errors?.length > 0)?._errors[0];

  return res.status(400).json({
    message: firstError || "Invalid input data",
    success: false,
  });
}
    const {name,email,password}=response.data
    //check  for email existance
    if(!validator.isEmail(email)){
        return res.status(400).json({
            message:"Invalid email",
            success:false,
        })
    }
    try{
        if(await User.findOne({email})){
            return res.status(409).json({
                message:"user already exist!",
                success:false,
            })
        }
        const hashedPassword=await bcrypt.hash(password,10)//sale valid:10
        const user=await User.insertOne({
            name,
            email,
            password:hashedPassword,
        })
        
        const token=createToken(user._id)
        res.status(200).json({
            success:true,
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            }
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({success:false,message:"Server Error"})
    }
}

//Login funciton
export async function loginUser(req,res){
    const response=userSigninSchema.safeParse(req.body)
    if(!response.success){
        return res.status(400).json({
            success:false,
            message:"User input is invalid",
        })
    }
    const {email,password}=response.data

    try{
        const user=await User.findOne({email})
        if(!user ){
            return res.status(401).json({
                success:false,
                message:"Invalid Credentials",
            })
        }
        const match=await bcrypt.compare(password,user.password)
        if(!match){
            return res.status(401).json({
                success:false,
                message : "Invalid Credentials",
            })
        }
        const token=createToken(user._id)
        res.json({
            success:true,
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            }
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            success:false,
            message:"Internal Server Error!",
        })
    }
}

//GET CURRENT USER
export async function getCurrentUser(req,res){
    try{
        const user=await User.findById(req.user.id).select("name email")//understand this
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found",
            })
        }
        res.json({
            success:true,
            user,
        })
    }
    catch(err){
        console.log(err)
        res.json({
            success:false,
            message:"Internal Server Error!",
        })
    }
}

//Update user profile

export async function updateProfile(req, res) {
  const response = zodProfile.safeParse(req.body);

  if (!response.success) {
    return res.status(400).json({
      success: false,
      message: "Something is missing",
    });
  }

  const { email, name } = response.data;

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Email is not valid",
    });
  }

  try {
    const exists = await User.findOne({ email, _id: { $ne: req.user.id } });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use by another account",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true, select: "name email" }
    );

    return res.json({
      success: true,
      user,
    });

  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

//Change password function
export async function updatePassword(req,res){
    const {currentPassword,newPassword}=req.body
    if(!currentPassword || !newPassword){
        return res.status(400).json({
            success:false,
            message:"Password is invalid or too short",
        })
    }
    
    try{
        const user=await User.findById(req.user.id).select("password")
        if(!user){
            return res.status(400).json({

                success:false,
                message:"User not found",
            })
        }
        const match=await bcrypt.compare(currentPassword,user.password)
        if(!match){
            return res.status(401).json({
                success:false,
                message:"Current Password Incorrect",
            })
        }
        user.password=await bcrypt.hash(newPassword,10)
        await user.save()
        res.json({
            success:true,
            message:"Password Change successfully",
        })
    }
    catch(err){
        console.log(err)
        res.json({
            success:true,
            message:"Internal Server error",
        })
    }
}