# \AuthApi

All URIs are relative to *http://localhost:5000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**auth_api_key_get**](AuthApi.md#auth_api_key_get) | **GET** /auth/api-key | Api Key
[**auth_login_post**](AuthApi.md#auth_login_post) | **POST** /auth/login | Login
[**auth_signup_post**](AuthApi.md#auth_signup_post) | **POST** /auth/signup | Signup



## auth_api_key_get

> models::ApiKeyDto auth_api_key_get()
Api Key

### Parameters

This endpoint does not need any parameter.

### Return type

[**models::ApiKeyDto**](ApiKeyDto.md)

### Authorization

[CookieAuth](../README.md#CookieAuth), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## auth_login_post

> models::UserDto auth_login_post(login_dto)
Login

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**login_dto** | Option<[**LoginDto**](LoginDto.md)> |  |  |

### Return type

[**models::UserDto**](UserDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## auth_signup_post

> models::UserDto auth_signup_post(signup_dto)
Signup

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**signup_dto** | Option<[**SignupDto**](SignupDto.md)> |  |  |

### Return type

[**models::UserDto**](UserDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

