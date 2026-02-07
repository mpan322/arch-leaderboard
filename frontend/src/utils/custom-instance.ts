import axios, { type AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = axios.create({
    baseURL: 'http://localhost:5000',
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
