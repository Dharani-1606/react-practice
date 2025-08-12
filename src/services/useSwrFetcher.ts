import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import apiService from "./apiService";

// Function to handle GET request
const getFetcher = async (url: string) => {
    const response = await apiService.get(url);
    return response.data;
}

// Function to handle POST request
export const postFetcher = async (url: string, body: any) => {
    const response = await apiService.post(url, body);
    return response.data;
};

// connect axios fetcher to swr
export function useSwrFetcher(key: string | null) {
    return useSWR(key, getFetcher);
}

// This hook will be for POST
export function usePostFetcher(key: string | null) {
    return useSWRMutation(key,(url, { arg }) => postFetcher(url, arg));
}
