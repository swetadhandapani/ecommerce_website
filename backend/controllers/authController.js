const { response } = require("express");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const User = require("../models/userModel.js");
const sendEmail = require("../utils/email.js");
const ErrorHandler = require("../utils/errorHandler.js")
const sendToken = require("../utils/jwt.js");
const crypto = require("crypto");


//RegisterUser -  http://localhost:8000/api/v1/register
exports.registerUser =  catchAsyncError(async (req,res,next) => {
    const {name,email,password} = req.body

    let avatar;
    if(req.file){
        avatar=`${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`
    }


    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    sendToken(user, 201, res);
});

//LoginUser - http://localhost:8000/api/v1/login
exports.loginUser = catchAsyncError(async (req,res,next) => {
    const {email, password} = req.body;
        if(!email || !password){
            return next(new ErrorHandler("Please enter email && password", 400));
        }

        //finding the user from database
        const user = await User.findOne({email}).select("+password");
        
        if(!user){
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        if(!await user.isValidPassword(password)){
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        sendToken(user, 201, res);
});

//Logout user - http://localhost:8000/api/v1/logout
exports.logoutUser = (req,res,next) => {
    res.cookie("token", null,{
        expires: new Date(Date.now()),
        httpOnly: true
    }).status(200).json({
        success: true,
        message: "User logged out successfully"
    })
};


// Forgot password - http://localhost:8000/api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req,res,next) => {
    const user = await User.findOne({ email : req.body.email});
    
    if(!user){
       return next(new ErrorHandler("No user found with that email", 404));
       // return next(new ErrorHandler(error.message, 500)); // ErrorHandler should be called correctly

    }

    const resetToken = user.getResetToken();
    await user.save({validateBeforeSave: false});

    //Create reset url    
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset url is as follows \n\n ${resetUrl}\n\n  If you have not requested this email, then ignore it.`;

    try{
        await sendEmail({
            email:user.email,
            subject:"JSRcart Password Recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });
        
    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message),500);
    }
});

//ResetPassword - http://localhost:8000/api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req,res,next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {$gt: Date.now()}
    });

    if(!user){
        return next(new ErrorHandler("Password reset token is invalid or expired!", 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Passwords do not match!", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({validateBeforeSave:false});

    sendToken(user, 200, res);
        
})

//Get user profile - http://localhost:8000/api/v1/myprofiles
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
});

//Change password - http://localhost:8000/api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    //check old password
    if(!await user.isValidPassword(req.body.oldPassword)){
        return next(new ErrorHandler("Current password is incorrect", 401));
    }
    //assigning new password
    user.password = req.body.password;
    await user.save();
    res.status(200).json({
        success: true
    });  
});

//Update profile - http://localhost:8000/api/v1/update
exports.updateProfile = catchAsyncError(async (req,res,next) => {
    let newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    let avatar;
    if(req.file){
        avatar=`${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`
        newUserData = {...newUserData, avatar}
    }


    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        user
    });
});

//Admin: Get all users - http://localhost:8000/api/v1/admin/users

exports.getAllUsers = catchAsyncError(async (req,res,next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
});

//Admin:Get specific user - http://localhost:8000/api/v1/admin/user/:id

exports.getUser = catchAsyncError(async (req,res,next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user not found with this id ${req.params.id}`));
    }
    res.status(200).json({
        success: true,
        user
    });
});

//Admin: Update user - http://localhost:8000/api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req,res,next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData,{
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        user
    });
});

//Admin: Delete user - http://localhost:8000/api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req,res,next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user not found with this id ${req.params.id}`));
    }
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
})