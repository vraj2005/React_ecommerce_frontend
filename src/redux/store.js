import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});