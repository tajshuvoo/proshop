import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUser,
    getUserById,
    deleteUser,
    updateUser,
} from '../controllers/userController.js';
import { get } from 'http';
import { protect,admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser).get(protect,admin,getUser);
router.post('/logout',protect,logoutUser);
router.post('/login', authUser);
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);
router.route('/:id').get(protect,admin,getUserById).delete(protect,admin,deleteUser).put(protect,admin,updateUser);



export default router;
 