import {apiSlice} from './apiSlices'
import { ORDERS_URL, PAYPAL_URL } from '../constant'

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: {...order},
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
                method: 'GET',
            }),
            keepUnusedDataFor:5,
        }),
        payOrder: builder.mutation({
            query: ({orderId, details}) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: {...details},
            }),
        }),
        getPaypalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
            }),
            keepUnusedDataFor:5,
        }),
        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/myorders`,
            }),
            keepUnusedDataFor:5,
        }),
        getOrders: builder.query({
            query: () => ({
                url: ORDERS_URL,
            }),
            keepUnusedDataFor:5,
        }),
        deliveryOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/delivered`,
                method: 'PUT',
            }),
        }),
    }),
});

export const { useCreateOrderMutation , useGetOrderDetailsQuery , usePayOrderMutation , useGetPaypalClientIdQuery
    , useGetMyOrdersQuery , useGetOrdersQuery , useDeliveryOrderMutation
 } = orderApiSlice;