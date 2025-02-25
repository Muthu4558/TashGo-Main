import { apiSlice } from "../apiSlice";


const AUTH_URL = "/user";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        login: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),

        register: builder.mutation({
            query: (data) => ({
              url: `${AUTH_URL}/register`,
              method: "POST",
              body: data,
              credentials: "include", // Correct key (all lowercase)
              headers: {
                "Content-Type": "application/json",
              },
            }),
          }),

        logout: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/logout`,
                method: "POST",
                Credentials: "include",
            })
        }),

    }),
});


export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApiSlice;