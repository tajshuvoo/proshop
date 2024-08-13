import { PRODUCTS_URL, UPLOAD_URL } from "../constant";
import { apiSlice } from "./apiSlices";

export const productApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({keyword ,pageNumber}) => ({
                url: PRODUCTS_URL,
                params: {
                    keyword,
                    pageNumber,
                },
            }),
            providesTags: ['Products'],
            keepUnusedDataFor: 5,
        }),
        getProductsDetails: builder.query({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`,
            }),
            keepUnusedDataFor: 5,
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: PRODUCTS_URL,
                method: 'POST',
            }),
            invalidatesTags: ['Products'],
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data._id}`,
                method: 'PUT',
                body: data,
            }),          
            invalidatesTags: ['Products'],  
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`,
                method: 'DELETE',
            }),
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.id}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),
        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`,
            }),
            providesTags: ['Products'],
            keepUnusedDataFor: 5,
        }),
    }),
});

export const { useGetProductsQuery , useGetProductsDetailsQuery , useCreateProductMutation , useUpdateProductMutation , useUploadProductImageMutation , useDeleteProductMutation , useCreateReviewMutation , useGetTopProductsQuery } = productApi;