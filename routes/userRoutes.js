import express from "express"
import userController from "../controllers/userController.js";
import bookingController from "../controllers/bookingController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

const router=express.Router();

// route level middleware
router.use('/changepassword',checkUserAuth)
router.use('/loggeduser',checkUserAuth)
router.use('/reserve-seat',checkUserAuth)
router.use('/confirm-seat/:id/:token',checkUserAuth)


// Public routes
router.post('/register',userController.userRegistration)
router.post('/login',userController.userLogin)
router.post('/sent-reset-password-email',userController.sendUserPasswordResetEmail)
router.put('/reset-password/:id/:token',userController.userPasswordReset)

// protected routes
router.put('/changepassword',userController.changeUserPassword)
router.get('/loggeduser',userController.loggedUser)
router.post('/reserve-seat',bookingController.reservingSeat)
router.put('/confirm-seat/:id/:token',bookingController.confirmationOfBooking)



// export
export default router