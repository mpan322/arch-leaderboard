import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

export type ErrorResp = {
    message: string;
}

export type ErrorType<_Error> = AxiosError<ErrorResp>;

export const AXIOS_INSTANCE = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

export const customInstance = async <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    return await AXIOS_INSTANCE({
        ...config,
        ...options,
    }).then(({ data }) => data);
};

export default customInstance;
