export const BaseUrl = 'https://garant-hr.uz/api'
export const image_url = 'https://garant-hr.uz'


type FetchMethod = "GET" | "POST" | "PUT" | "DELETE";
interface FetchOptions {
  data?: any;
  method?: FetchMethod;
  headers?: HeadersInit;
}

export const fetchRequest = async <T>( url: string, { method = "GET", data = null, headers = {} }: FetchOptions = {}): Promise<T | null> => {
    try {
      const options: RequestInit = {
        method,
        headers: { ...headers },
      };
  
      // **GET** so‘rovda `body` ishlatmaslik uchun tekshiruv qo‘shamiz
      if (method !== "GET" && data) {
        if (data instanceof FormData) {
          options.body = data; // Agar `FormData` bo‘lsa, to‘g‘ridan-to‘g‘ri yuboramiz
        } else {
          options.body = JSON.stringify(data);
          options.headers = { "Content-Type": "application/json", ...headers };
        }
      }
  
      const fetch_url = BaseUrl+url
      const response = await fetch(fetch_url, options);

      if (!response.ok) {
        throw new Error(`Xatolik: ${response.status} - ${response.statusText}`);
      }
      // **Javob formatini aniqlash**
      const contentType = response.headers.get("content-type");
      let responseData: any;

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json(); // JSON qaytarilgan bo‘lsa
      } else {
        responseData = await response.text(); // FormData yoki boshqa format bo‘lsa
      }

        return responseData as T

    } catch (error) {
      alert(`Error fetching ...: ${error instanceof Error ? error.message : error}`);
      return null;
    }
  };
  

