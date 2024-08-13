import { USERS_URL } from "../constant";
import { apiSlice } from "./apiSlices";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),
        getUsers: builder.query({
            query: () => ({
                url: `${USERS_URL}`,
                method: 'GET',
            }),
            providesTags:['User'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
                method: 'DELETE',
            }),
        }),
        getUserDetails: builder.query({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
                method: 'GET',
            }),
            keepUnusedDataFor:5,
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data._id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags:['User'],
        }),
    }),
});

export const { useLoginMutation , useLogoutMutation , useRegisterMutation , useProfileMutation , useGetUsersQuery , useDeleteUserMutation , useGetUserDetailsQuery, useUpdateUserMutation } = usersApiSlice;