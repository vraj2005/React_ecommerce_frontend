import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api"; // Axios instance

// Redux thunk to fetch featured product
const fetchFeaturedProduct = () => async (dispatch) => {
  try {
    const response = await api.get("/products?featured=true&limit=1");
    const product = response.data.products[0];
    dispatch({ type: "SET_FEATURED_PRODUCT", payload: product });
  } catch (err) {
    dispatch({ type: "SET_FEATURED_ERROR", payload: err.response?.data?.message || "Failed to load featured product" });
  }
};

const BigDealOne = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const featuredProduct = useSelector((state) => state.featured?.product); // Temporary state in Redux
  const featuredError = useSelector((state) => state.featured?.error);

  // Fetch featured product on mount
  useEffect(() => {
    dispatch(fetchFeaturedProduct()).then(() => setLoading(false));
  }, [dispatch]);

  // Temporary reducer for this component (ideally move to a slice later)
  const initialState = { product: null, error: null };
  const featuredReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_FEATURED_PRODUCT":
        return { ...state, product: action.payload, error: null };
      case "SET_FEATURED_ERROR":
        return { ...state, error: action.payload };
      default:
        return state;
    }
  };

  // Add reducer to store dynamically (hack for this example; ideally in store.js)
  useEffect(() => {
    if (!store.getState().featured) {
      store.injectReducer("featured", featuredReducer);
    }
  }, []);

  return (
    <div className="big-deal rounded-16 overflow-hidden flex-between position-relative mb-24 py-80">
      <div className="container container-lg">
        <div className="big-deal-box position-relative z-1 rounded-16 py-40 overflow-hidden">
          <img
            src="assets/images/bg/big-deal-pattern.png"
            alt=""
            className="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 cover-img"
          />
          <div className="row gy-4 align-items-center">
            <div className="col-md-3 text-center d-md-block d-none">
              <img
                src={featuredProduct?.images?.[0] || "assets/images/thumbs/big-deal1.png"}
                alt={featuredProduct?.name || "Featured Product"}
              />
            </div>
            <div className="col-md-6 big-deal-box__content text-center">
              <h4 className="mb-20 text-uppercase">
                {loading ? "LOADING..." : featuredProduct?.category?.name?.toUpperCase() || "BIG DEAL"}
              </h4>
              {loading ? (
                <p className="text-heading fw-medium">Loading...</p>
              ) : featuredError ? (
                <p className="text-heading fw-medium">Error: {featuredError}</p>
              ) : (
                <p className="text-heading fw-medium">
                  {featuredProduct?.name || "No Featured Product Available"}
                </p>
              )}
            </div>
            <div className="col-md-3 text-center d-md-block d-none">
              <img
                src={
                  featuredProduct?.images?.[1] ||
                  featuredProduct?.images?.[0] ||
                  "assets/images/thumbs/big-deal2.png"
                }
                alt={featuredProduct?.name || "Featured Product"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inject reducer into store (temporary hack for this example)
import store from "../redux/store";
if (!store.getState().featured) {
  store.injectReducer = (key, reducer) => {
    store.replaceReducer((state = {}, action) => ({
      ...store.originalReducer(state, action),
      [key]: reducer(state[key], action),
    }));
  };
  store.originalReducer = store.reducer;
}

export default BigDealOne;