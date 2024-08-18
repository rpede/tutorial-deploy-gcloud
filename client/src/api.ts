/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AuthUserInfo {
  username?: string | null;
  isAdmin?: boolean;
  canPublish?: boolean;
}

export interface Author {
  id?: string | null;
  userName?: string | null;
}

export interface CommentForPost {
  /** @format int64 */
  id?: number;
  content?: string | null;
  /** @format date-time */
  createdAt?: string;
  author?: Author;
}

export interface CommentFormData {
  content?: string | null;
}

export interface Draft {
  /** @format int64 */
  id?: number;
  title?: string | null;
  author?: Writer;
}

export interface DraftDetail {
  /** @format int64 */
  id?: number;
  title?: string | null;
  content?: string | null;
  author?: Writer;
}

export interface DraftFormData {
  title?: string | null;
  content?: string | null;
  publish?: boolean | null;
}

export interface LoginRequest {
  email?: string | null;
  password?: string | null;
}

export interface LoginResponse {
  jwt?: string | null;
}

export interface Post {
  /** @format int64 */
  id?: number;
  title?: string | null;
  content?: string | null;
  author?: Author;
  /** @format date-time */
  publishedAt?: string;
  /** @format date-time */
  editedAt?: string | null;
}

export interface PostDetail {
  /** @format int64 */
  id?: number;
  title?: string | null;
  content?: string | null;
  author?: Author;
  comments?: CommentForPost[] | null;
  /** @format date-time */
  publishedAt?: string;
  /** @format date-time */
  editedAt?: string | null;
}

export interface RegisterRequest {
  email?: string | null;
  password?: string | null;
  name?: string | null;
}

export interface RegisterResponse {
  email?: string | null;
  name?: string | null;
}

export interface Writer {
  id?: string | null;
  userName?: string | null;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Api
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthLoginCreate
     * @request POST:/api/auth/login
     * @secure
     */
    authLoginCreate: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<LoginResponse, any>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthRegisterCreate
     * @request POST:/api/auth/register
     * @secure
     */
    authRegisterCreate: (data: RegisterRequest, params: RequestParams = {}) =>
      this.request<RegisterResponse, any>({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthConfirmList
     * @request GET:/api/auth/confirm
     * @secure
     */
    authConfirmList: (
      query?: {
        token?: string;
        email?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/auth/confirm`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthLogoutCreate
     * @request POST:/api/auth/logout
     * @secure
     */
    authLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthUserinfoList
     * @request GET:/api/auth/userinfo
     * @secure
     */
    authUserinfoList: (params: RequestParams = {}) =>
      this.request<AuthUserInfo, any>({
        path: `/api/auth/userinfo`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Blog
     * @name BlogList
     * @request GET:/api/blog
     * @secure
     */
    blogList: (
      query?: {
        /** @format int32 */
        page?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Post[], any>({
        path: `/api/blog`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Blog
     * @name BlogDetail
     * @request GET:/api/blog/{id}
     * @secure
     */
    blogDetail: (id: number, params: RequestParams = {}) =>
      this.request<PostDetail, any>({
        path: `/api/blog/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Blog
     * @name BlogCommentCreate
     * @request POST:/api/blog/{id}/comment
     * @secure
     */
    blogCommentCreate: (id: number, data: CommentFormData, params: RequestParams = {}) =>
      this.request<number, any>({
        path: `/api/blog/${id}/comment`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Draft
     * @name DraftList
     * @request GET:/api/draft
     * @secure
     */
    draftList: (params: RequestParams = {}) =>
      this.request<Draft[], any>({
        path: `/api/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Draft
     * @name DraftCreate
     * @request POST:/api/draft
     * @secure
     */
    draftCreate: (data: DraftFormData, params: RequestParams = {}) =>
      this.request<number, any>({
        path: `/api/draft`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Draft
     * @name DraftDetail
     * @request GET:/api/draft/{id}
     * @secure
     */
    draftDetail: (id: number, params: RequestParams = {}) =>
      this.request<DraftDetail, any>({
        path: `/api/draft/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Draft
     * @name DraftUpdate
     * @request PUT:/api/draft/{id}
     * @secure
     */
    draftUpdate: (id: number, data: DraftFormData, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/draft/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Draft
     * @name DraftDelete
     * @request DELETE:/api/draft/{id}
     * @secure
     */
    draftDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/draft/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
