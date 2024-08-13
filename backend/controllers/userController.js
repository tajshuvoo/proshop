import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken.js';


// @desc Auth user & get token
// @route GET /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))) {
        
        generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            admin: user.isAdmin
        })
    }else{
        res.status(404);
        throw new Error("invalid email or password"); 
    }

});

// @desc register a new user
// @route post /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({
        name,
        email,
        password,
    });
    if(user){
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            admin: user.isAdmin
        });
    }
});

// @desc log out use
// @route post /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({message: 'logged out'});
});

// @desc get user profile
// @route GET /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user){
        res.status(200)
        .json({
            _id: user._id,
            name: user.name,
            email: user.email,
            admin: user.isAdmin
        });
    }
});

// @desc update user profile
// @route put /api/users/profile
// @access private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            admin: updatedUser.isAdmin
        });
    }
});

// @desc get users
// @route GET /api/users
// @access private / admin
const getUser = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

// @desc get user by id
// @route GET /api/users/:id
// @access private / admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if(user){
        res.status(200).json(user);
    }
    else{
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc delete user
// @route delete /api/users/:id
// @access private / admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if(user){
        if(user.isAdmin){
            res.status(400);
            throw new Error('You cannot delete an admin user');
        }
        await User.deleteOne({_id: user._id });
        res.status(200).json({message: 'User removed'});
    }else{
        res.status(404);
        throw new Error('User not found');
    
    }
});

// @desc update user
// @route put /api/users/:id
// @access private / admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            admin: updatedUser.isAdmin
        });
    }else{
        res.status(404);
        throw new Error('User not found');
    }
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUser,
    getUserById,
    deleteUser,
    updateUser,
};
