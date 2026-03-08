import stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
import {Order} from "../models/index.js";

const stripe = new stripe(process.env.STRIPE_SECRET_KEY);


export default stripe;