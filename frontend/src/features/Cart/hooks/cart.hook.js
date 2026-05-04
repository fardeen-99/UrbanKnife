import { useDispatch } from "react-redux";
import { addToCartApi, getCartApi, removeFromCartApi } from "../services/cart.api";
import { 
    addToCartRequest, 
    addToCartFailure, 
    addToCartSuccess, 
    updateCartQuantity,
    removeFromCart,
    openCartDrawer
} from "../state/cart.slice";

const useCart = () => {
    const dispatch = useDispatch();

    const HandleAddToCart = async ({ productID, quantity, size, variationID }) => {
        dispatch(addToCartRequest());
        const res = await addToCartApi({ productID, quantity, size, variationID });
        if (res.error || !res.success) {
            dispatch(addToCartFailure(res.response?.data?.message || res.message || "Failed to add to cart"));
        } else {
            dispatch(addToCartSuccess(res.cart));
            dispatch(openCartDrawer());
        }
    };

    const HandleGetCart = async () => {
        dispatch(addToCartRequest());
        const res = await getCartApi();
        if (res.error || !res.success) {
            dispatch(addToCartFailure(res.response?.data?.message || res.message || "Failed to fetch cart"));
        } else {
            dispatch(addToCartSuccess(res.cart));
        }
    };

    const HandleIncreaseCart = async (item) => {
        const newQuantity = item.quantity + 1;
        // Optimistic Update
        dispatch(updateCartQuantity({ id: item._id, quantity: newQuantity }));

        // Background API Sync
        const res = await addToCartApi({ 
            productID: item.productID, 
            quantity: 1, // Controller increments by this amount
            size: item.size, 
            variationID: item.variationID 
        });

        if (res.error || !res.success) {
            // Rollback on failure
            dispatch(updateCartQuantity({ id: item._id, quantity: item.quantity }));
            // Optionally notify user
            console.error("Failed to sync cart:", res);
        } else {
            // Ensure consistency with server
            dispatch(addToCartSuccess(res.cart));
        }
    };

    const HandleDecreaseCart = async (item) => {
        if (item.quantity <= 1) return;

        const newQuantity = item.quantity - 1;
        // Optimistic Update
        dispatch(updateCartQuantity({ id: item._id, quantity: newQuantity }));

        // Background API Sync
        const res = await addToCartApi({ 
            productID: item.productID, 
            quantity: -1, // Controller decrements by this amount
            size: item.size, 
            variationID: item.variationID 
        });

        if (res.error || !res.success) {
            // Rollback on failure
            dispatch(updateCartQuantity({ id: item._id, quantity: item.quantity }));
            console.error("Failed to sync cart:", res);
        } else {
            // Ensure consistency with server
            dispatch(addToCartSuccess(res.cart));
        }
    };


    const HandleRemoveFromCart = async (id) => {
    dispatch(removeFromCart({ id })); // Optimistic UI update

    const res = await removeFromCartApi({ id });

    if (res.error || !res.success) {
        // Rollback on failure
        dispatch(addToCartSuccess(res.cart)); // Restore cart from server response
        console.error("Failed to sync cart:", res);
    }
};

    return {
        HandleAddToCart,
        HandleGetCart,
        HandleIncreaseCart,
        HandleDecreaseCart,
        HandleRemoveFromCart
    };
};

export default useCart;