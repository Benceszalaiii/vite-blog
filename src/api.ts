import { Post, Category, User } from "./types";

const API_URL = "http://localhost:3001";

// UTILS

export const getApiUrl = () => API_URL;

// POSZTOK

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

export const fetchPost = async (id: number): Promise<Post | null> => {
  const response = await fetch(`${API_URL}/posts/${id}`);
  if (!response.ok) return null;
  return response.json();
};

export const fetchPosts = async (data?: {
  page?: number;
  limit?: number;
  searchQuery?: string;
  categoryId?: string;
}): Promise<{ posts: Post[]; totalCount: number }> => {
  let { page = 1, limit = 6, searchQuery = "", categoryId = "" } = data || {};

  let url = `${API_URL}/posts?_page=${page}&_limit=${limit}`;

  if (searchQuery) {
    url += `&cim_like=${encodeURIComponent(searchQuery)}`;
  }

  if (categoryId) {
    url += `&categoryId=${encodeURIComponent(categoryId)}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch posts");

  const totalCount = parseInt(response.headers.get("X-Total-Count") || "0", 10);
  const posts = await response.json();

  return { posts, totalCount };
};

export const fetchPostsByUser = async (
  nev: string,
): Promise<{ posts: Post[]; totalCount: number }> => {
  const response = await fetch(`${API_URL}/posts?szerzo=${nev}`);
  if (!response.ok) throw new Error("Nem sikerült betölteni a posztokat!");
  const totalCount = parseInt(response.headers.get("X-Total-Count") || "0", 10);
  const posts = await response.json();
  return { posts, totalCount };
};

// AUTENTIKÁCIÓ

export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Hibás felhasználónév vagy jelszó!");
  }

  return data as { token: string; user: User };
};
