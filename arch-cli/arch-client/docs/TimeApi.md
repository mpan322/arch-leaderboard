# \TimeApi

All URIs are relative to *http://localhost:5000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**time_get**](TimeApi.md#time_get) | **GET** /time/ | Get All
[**time_record_post**](TimeApi.md#time_record_post) | **POST** /time/record | Record



## time_get

> models::GetTimesResDto time_get()
Get All

### Parameters

This endpoint does not need any parameter.

### Return type

[**models::GetTimesResDto**](GetTimesResDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## time_record_post

> models::TimeDto time_record_post(record_time_req_dto)
Record

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**record_time_req_dto** | Option<[**RecordTimeReqDto**](RecordTimeReqDto.md)> |  |  |

### Return type

[**models::TimeDto**](TimeDto.md)

### Authorization

[CookieAuth](../README.md#CookieAuth), [BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

