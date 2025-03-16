import { apiRequest } from "./api";

// Rasm yuklash
export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
  
    return apiRequest<string>("POST", "/anketa-web-app/store/image", formData);
  };
  
  // Rasmni o‘chirish
  export const deleteImage = async (file:string) => {
    return apiRequest("POST", "/anketa-web-app/delete/image", {file});
  };
  