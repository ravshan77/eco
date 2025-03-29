// STATUS INFO
export const WORKER_STATUS_INFO = {
  buyrugi_chiqarilmagan:{
    color:"bg-red-300",
    text:"Buyrug'i chiqarilmagan"
  },
  ish_faoliyatida: {
    color:"bg-green-100 text-green-700",
    text:"Ish faoliyatida",
  },
  tatilda: {
    color:"bg-blue-100 text-blue-700",
    text:"Ta'tilda",
  },
  mehnat_safari: {
    color:"bg-yellow-100 text-yellow-700",
    text:"Mahnat safarida",
  },
  ishdan_bushagan: {
    color:"bg-gray-300 text-gray-700",
    text:"Ishdan bo'shagan",
  },
}
export const TASK_CONFIRM_STATUS_INFO = {
  jarayonda:{
    color:"bg-yellow-100 p-1 font-medium text-yellow-700",
    text:"Jarayonda",
  },
  tasdiqlangan: {
    color:"bg-green-100 p-1 font-medium text-green-700",
    text:"Tasdiqlangan",
  },
  bajarilgan: {
    color:"bg-blue-100 p-1 font-medium text-blue-700",
    text:"Bajarilgan",
  },
}
export const TASK_PREORIIY_STATUS_INFO = {
  qilinishi_kerak:{
    text:"Qilinishi kerak",
    color:"bg-yellow-100 text-yellow-700",
  },
  muhim:{
    text:"Muhim",
    color:"bg-blue-100 text-blue-700",
  },
  zarur:{
    text:"Zarur",
    color:"bg-red-300",
  },
}

// OPTIONS
export const EDUCATION_STATUS = [ 
  { id:"maktab", name:"Maktab" }, 
  { id:"kollej", name:"Kollej" },
  { id:"texnikum", name:"Texnikum" },
  { id:"bakalavr", name:"Bakalavr" }, 
  { id:"magistr", name:"Magistr" }
]
export const WORKER_STATUS = [ 
  {id:"1", name:"Ishga qabul qilish"}, 
  {id:"2", name:"Ta'tilga chiqarish"}, 
  {id:"3", name:"Mehnat safariga yuborish"}, 
  {id:"4", name:"Ishdan bo'shatish"}, 
]
export const TASK_CONFIRM_STATUS = [
  { id: 0, name: "Jarayonda" },
  { id: 1, name: "Bajarilgan" },
  { id: 2, name: "Tasdiqlangan" },
]
export const TASK_PREORIIY_STATUS = [
  { id: 1, name: "Qilinishi kerak" },
  { id: 2, name: "Muhim" },
  { id: 3, name: "Zarur" },
]

// DEAFULT CONSTANTA
export const CURRENT_DAY = new Date().toISOString().split("T")[0]
export const MONTHS = [
  { value: "1", label: "Yanvar" },
  { value: "2", label: "Fevral" },
  { value: "3", label: "Mart" },
  { value: "4", label: "Aprel" },
  { value: "5", label: "May" },
  { value: "6", label: "Iyun" },
  { value: "7", label: "Iyul" },
  { value: "8", label: "Avgust" },
  { value: "9", label: "Sentabr" },
  { value: "10", label: "Oktabr" },
  { value: "11", label: "Noyabr" },
  { value: "12", label: "Dekabr" },
]
export const CURRENT_YEAR = new Date().getFullYear()
export const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i)
export const DEFAULT_WORKER_VALUES = {
  // id?: number;
  // status?: 0,
  // created_at?: null,
  // responsible_worker?: null,
  birthday: "",
  name: "",
  position_id: 0,
  phone_youre: "",
  section_id:  null,
  address: null,
  education: null,
  education_place: null,
  passport_number: null,
  passport_series: null,
  phone_additional: null,
  phone_work: null,
  photo: null,
  position_name: null,
  region_id:  null,
  region_name: null,
  section_name: null,
  state_id:  null,
  state_name: null,
}
export const DEFAULT_META_DATA = {
  current_page: 1, 
  from: 1, 
  last_page: 1,
  links:[], 
  path: "",
  per_page: 20, 
  to: 1, 
  total: 1
}