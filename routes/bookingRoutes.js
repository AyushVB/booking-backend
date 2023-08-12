import express from "express"
import bookingController from "../controllers/bookingController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

const bookingRoutes=express.Router();

// route level middleware

bookingRoutes.use('/reserve-seat',checkUserAuth)
bookingRoutes.use('/confirm-seat/:id/:token',checkUserAuth)


// Public routes

bookingRoutes.get('/reserve',bookingController.reserveSeats)

// protected routes

bookingRoutes.post('/reserve-seat',bookingController.reservingSeat)
bookingRoutes.put('/confirm-seat/:id/:token',bookingController.confirmationOfBooking)



// export
export default bookingRoutes