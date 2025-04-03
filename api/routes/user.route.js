import express from 'express';
import { signup } from '../controllers/auth.controller.js';
import { deleteUser, getUserListings, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/signup", signup);
router.post('/update/:id',verifyToken ,updateUser);
router.delete('/delete/:id',verifyToken ,deleteUser);
router.get('/listings/:id',verifyToken ,getUserListings);

export default router;