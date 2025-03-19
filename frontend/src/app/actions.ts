"use server";

import { AuthResult } from "@/types/authResult";
import { NotAuthenticatedError } from "@/types/NotAuthenticatedError";
import { PaginationRequest } from "@/types/PaginationRequest";
import { PaginatedResult } from "@/types/paginationResult";
import { PropertyCreateRequest } from "@/types/properttCreateRequest";
import {
  PropertyCategory,
  PropertyPost,
  PropertyType,
} from "@/types/propertyPost";
import { RegisterRequest } from "@/types/RegisterRequest";
import { AspError, Result } from "@/types/Result";
import { PropertySearchDTO as SearchRequestData } from "@/types/SearchRequest";
import { UserDTO } from "@/types/user";
import { getAuth } from "@/lib/auth";

const ServerAddr = process.env.SERVER_ADDR || "http://localhost:3000";

export async function loginAction(
  email: string,
  password: string
): Promise<Result<AuthResult>> {
  try {
    const response = await fetch(`${ServerAddr}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-cache",
    });

    if (response.status === 200) {
      const { accessToken, refreshToken, expiresAt, user } =
        await response.json();
      const expiresAtDate = new Date(expiresAt);
      // Set the cookies
      // await SetSession(accessToken, refreshToken, expiresAtDate);
      const result: AuthResult = {
        accessToken,
        refreshToken,
        expiresAt: expiresAtDate,
        user,
      };
      return { success: true, data: result };
    } else {
      const error = await response.text();
      return { success: false, errors: [error] };
    }
  } catch (error) {
    console.error("Error during login:", error);
    // Handle errors as needed
    return { success: false, errors: ["An error occurred during login"] };
  }
}

export async function logoutAction() {
  try {
    // await ClearSession();
  } catch (error) {
    console.error("Error during logout:", error);
    // Handle errors as needed
  }
}

export async function AddPropertyAction(
  createRequest: PropertyCreateRequest
): Promise<Result> {
  const endpoint = `${ServerAddr}/api/properties`;
  // const data = obj2FormData(createRequest);
  const data = JSON.stringify(createRequest);
  // console.log(data);
  try {
    const response = await makeAuthenticatedRequest(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
      cache: "no-cache",
    });
    return response;
  } catch (error) {
    console.error("Error during property creation:", error);
    throw error;
  }
}

export async function SignUpAction(request: RegisterRequest): Promise<Result> {
  try {
    const response = await fetch(`${ServerAddr}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      const errors: AspError[] = data;
      if (!Array.isArray(errors)) {
        const strErrors = Object.entries((errors as any).errors).map(
          ([key, value]) => `${key}: ${value}`
        );
        return {
          success: false,
          errors: strErrors,
        };
      }
      return { success: false, errors: errors.map((e) => e.description) };
    }

    return { success: true };
  } catch (error) {
    console.error("Error during registration:", error);
    return {
      success: false,
      errors: ["An error occurred during registration"],
    };
  }
}

export async function makeAuthenticatedRequest<T = undefined>(
  url: string,
  config?: RequestInit
): Promise<Result<T>> {
  try {
    const session = await getAuth();
    const accessToken = session?.accessToken;

    if (!accessToken) {
      throw new Error("Failed to obtain access token");
    }

    // Merge the token into the headers of the request
    const headers = {
      ...config?.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the authenticated request
    const response = await fetch(url, {
      ...config,
      headers, // Updated headers with Authorization token
      cache: "no-store",
    });
    if (response.status === 401) {
      throw new NotAuthenticatedError();
    }
    if (!response.ok) {
      console.error("shit happened");
      console.error(response.statusText);
      const err = (await response.text()) as string;
      return { success: false, errors: [err] };
    }

    if (response.status === 204) {
      return { success: true };
    } else {
      const result = (await response.json()) as T;
      return {
        success: true,
        data: result,
      };
    }
  } catch (error) {
    console.error("Error making authenticated request:", error);
    throw error;
  }
}

export const TryGetUser = async (token: string): Promise<Result<UserDTO>> => {
  console.log("Getting User");
  const url = `${ServerAddr}/api/auth/user`;
  try {
    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (result.ok)
      return { success: true, data: (await result.json()) as UserDTO };
    else {
      return {
        success: false,
      };
    }
  } catch {
    return {
      success: false,
      errors: ["Exception raised during fetch"],
    };
  }
};

export const FetchRecentProperties = async (
  pgRequest?: PaginationRequest
): Promise<PaginatedResult<PropertyPost>> => {
  let endpoint = `${ServerAddr}/api/properties/recent`;
  if (pgRequest) {
    endpoint += `?pageNumber=${pgRequest.pageNumber}&pageSize=${pgRequest.pageSize}`;
  }

  const session = await getAuth();
  const accessToken = session?.accessToken;

  const response = await fetch(endpoint, {
    method: "GET",
    cache: "no-store",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  if (response.ok) {
    console.log("Properties fetched successfully");
    const result = (await response.json()) as PaginatedResult<PropertyPost>;
    result.results = result.results.map((p) => PostProcessPropResults(p));
    return result;
  } else {
    console.error("Failed to fetch properties", response.statusText);
    throw new Error("Failed to fetch properties");
  }
};

export const FetchPropertySingle = async (
  id: number
): Promise<PropertyPost | undefined> => {
  const endpoint = `${ServerAddr}/api/properties/${id}`;
  const session = await getAuth();
  const accessToken = session?.accessToken;
  const response = await fetch(endpoint, {
    method: "GET",
    cache: "no-store",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  if (response.ok) {
    console.log("Property fetched successfully");
    const result = (await response.json()) as PropertyPost;
    console.log(result);
    return PostProcessPropResults(result);
  } else {
    console.error("Failed to fetch property", response.statusText);
    return undefined;
  }
};

export const FetchALlForUser = async (
  uid: string,
  pgRequest?: PaginationRequest
) => {
  let endpoint = `${ServerAddr}/api/properties/user/${uid}`;
  if (pgRequest) {
    endpoint += `?pageNumber=${pgRequest.pageNumber}&pageSize=${pgRequest.pageSize}`;
  }
  const response = await fetch(endpoint, { method: "GET", cache: "no-store" });
  if (response.ok) {
    console.log("Properties fetched successfully");
    const result = (await response.json()) as PaginatedResult<PropertyPost>;
    result.results = result.results.map((p) => PostProcessPropResults(p));
    return result;
  } else {
    console.error("Failed to fetch properties", response.statusText);
    throw new Error("Failed to fetch properties");
  }
};

export const FetchFavourites = async (
  pgRequest?: PaginationRequest
): Promise<PaginatedResult<PropertyPost>> => {
  let endpoint = `${ServerAddr}/api/properties/favourites`;
  if (pgRequest) {
    endpoint += `?pageNumber=${pgRequest.pageNumber}&pageSize=${pgRequest.pageSize}`;
  }
  const response = await makeAuthenticatedRequest<
    PaginatedResult<PropertyPost>
  >(endpoint, {
    method: "GET",
    cache: "no-store",
  });
  if (response.success) {
    console.log("Properties fetched successfully");
    const result = response.data!;
    result.results = result.results.map((p) => PostProcessPropResults(p));
    return result;
  } else {
    console.error("Failed to fetch properties");
    throw new Error("Failed to fetch properties");
  }
};

export const FetchSearchResults = async (
  searchReq: SearchRequestData,
  pgRequest?: PaginationRequest
): Promise<PaginatedResult<PropertyPost>> => {
  const endpoint = `${ServerAddr}/api/properties/search`;
  const session = await getAuth();
  const accessToken = session?.accessToken;
  let filteredSearchReq = Object.fromEntries(
    Object.entries(searchReq).filter(([_, v]) => v != null && v !== "")
  );
  if (pgRequest) {
    filteredSearchReq = { ...filteredSearchReq, ...pgRequest };
  }

  // Convert the filtered object to a query string using URLSearchParams
  const searchParams = new URLSearchParams(filteredSearchReq as any);
  const endpointWithParams = `${endpoint}?${searchParams.toString()}`;

  const response = await fetch(endpointWithParams, {
    method: "GET",
    cache: "no-store",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  if (response.ok) {
    console.log("Properties fetched successfully");
    const result = (await response.json()) as PaginatedResult<PropertyPost>;
    result.results = result.results.map((p) => PostProcessPropResults(p));
    return result;
  } else {
    console.error("Failed to fetch properties", response.statusText);
    console.error("Error", await response.text());
    throw new Error("Failed to fetch properties");
  }
};

function PostProcessPropResults(response: PropertyPost) {
  const result: PropertyPost = {
    ...response,
    createdAt: new Date(response.createdAt),
  };
  result.images = response.images?.map((img) => {
    return `${ServerAddr}${img}`;
  });

  if (result.category !== undefined)
    result.category = PropertyCategory[result.category];
  if (result.propertyType !== undefined)
    result.propertyType = PropertyType[result.propertyType];

  return result;
}

export const AddFavouriteAction = async (id: number) => {
  const endpoint = `${ServerAddr}/api/properties/favourites/${id}`;
  try {
    const response = await makeAuthenticatedRequest(endpoint, {
      method: "POST",
      cache: "no-store",
    });
    return response;
  } catch (error) {
    console.error("Error adding favourite:", error);
    throw error;
  }
};

export const RemoveFavouriteAction = async (id: number) => {
  const endpoint = `${ServerAddr}/api/properties/favourites/${id}`;
  try {
    const response = await makeAuthenticatedRequest(endpoint, {
      method: "DELETE",
      cache: "no-store",
    });
    return response;
  } catch (error) {
    console.error("Error removing favourite:", error);
    throw error;
  }
};

export const DeletePropertyAction = async (id: number): Promise<Result> => {
  const endpoint = `${ServerAddr}/api/properties/${id}`;
  try {
    const response = await makeAuthenticatedRequest(endpoint, {
      method: "DELETE",
      cache: "no-store",
    });
    return response;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

export const SendGoogleToken = async (
  token: string
): Promise<Result<AuthResult>> => {
  const endpoint = `${ServerAddr}/api/auth/google-signin`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: token }),
      cache: "no-cache",
    });
    if (response.status === 200) {
      const { accessToken, refreshToken, expiresAt, user } =
        await response.json();
      const expiresAtDate = new Date(expiresAt);
      const result: AuthResult = {
        accessToken,
        refreshToken,
        expiresAt: expiresAtDate,
        user,
      };
      return { success: true, data: result };
    } else {
      const error = await response.text();
      return { success: false, errors: [error] };
    }
  } catch (error) {
    console.error("Error during google login:", error);
    return {
      success: false,
      errors: ["An error occurred during google login"],
    };
  }
};
