import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary ur
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },

        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)


userSchema.pre("save", async function (next){
    if(!this.isModifed("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next();
    
})

userSchema.methods.isPasswordValid = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.genartateAccessToken = async function (){
    return await jwt.sign(
        {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        }
       
    )
}
userSchema.methods.genartateRefreshToken =async function (){
    return await jwt.sign(
        {
        _id: this._id
       
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
        }
       
    )
}

export const User = mongoose.model("User", userSchema);
