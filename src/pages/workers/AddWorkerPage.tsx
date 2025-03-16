import { z } from "zod";
import {  useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchRequest } from "@/services/fetchRequest";
import { SingleOption, TWorkers } from "@/types/types";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { education_status, worker_status } from "@/constants";
import { deleteImage, uploadImage } from "@/services/worker_image.service";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ✅ Validatsiya uchun zod shemasi
const workerSchema = z.object({
  state_id: z.string().optional(),
  region_id: z.string().optional(),
  position_id: z  .string(),
  name: z.string().min(3, "Ism kamida 3 ta harf bo‘lishi kerak"),
  address: z.string().min(3, "Manzil kamida 3 ta harf bo‘lishi kerak").optional(),
  phone_youre: z.string().min(9, "Telefon raqam noto‘g‘ri").max(13, "Telefon raqam noto‘g‘ri"),
  birthday: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), "Tug‘ilgan sanani YYYY-MM-DD formatida kiriting"),

  section_id: z.string().optional(),
  passport_series: z.string().optional(),
  phone_additional: z.string().optional(),
  phone_work: z.string().optional(),
  education: z.string().optional(),
  education_place: z.string().optional(),
  photo: z.string().optional(),
  passport_number: z.string().optional(),
  responsible_worker: z.string().optional(),
  status: z.string().optional(),     
});

export default function AddWorkerPage() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    const confirmChange = window.confirm("Siz haqiqatdan ham ushbu sahifaga o'tmoqchimisiz?");
    if (confirmChange) {
      navigate(-1);
    }

    return
  
  };

  const onSubmit = (data: any) => { console.log("Yangi xodim ma’lumotlari:", data) };
  const [loading, setLoading] = useState(true)
  const [options, setOptions] = useState<{ states: SingleOption[], regions:SingleOption[], positions: SingleOption[], education_status: SingleOption[], worker_status: SingleOption[] }>({ states: [], regions: [], positions:[], worker_status, education_status })

  const form = useForm<TWorkers>({
    resolver: zodResolver(workerSchema),
    defaultValues: {  phone_youre: "", responsible_worker: "user.admin.name" },
    disabled: loading,
    shouldUnregister: false,
  });

  const { control, setValue, formState: { errors }, handleSubmit, getValues, watch,  } = form;

  // get states
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetchRequest<{ data: SingleOption[] }>(`/anketa/states`)
        if (isMounted && response) {
          setOptions(prev => ({ ...prev, states: response.data }));
        }
      } catch (error) {
        alert(`Error fetching states (admin bilan bog'laning @paloncha): ${error}`);
      } finally{
        setLoading(false)
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Component unmounted bo'lsa, state update qilinmaydi
    };
  }, []);

  const state_id = options.states.length > 0 && getValues("state_id")
  // get regions
  useEffect(() => {
    if (!state_id) {
       return 
    }

    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetchRequest<{ data: SingleOption[] }>(`/anketa/state-regions/${state_id}`)
        if (isMounted && response) {
          setOptions(prev => ({ ...prev, regions: response.data }));
        }
      } catch (error) {
        alert(`Error fetching regions (admin bilan bog'laning @paloncha): ${error}`);
      } finally{
        setLoading(false)
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Component unmounted bo'lsa, state update qilinmaydi
    };
  }, [state_id]);

  // get positions
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetchRequest<{ data: SingleOption[] }>("/anketa/positons/for/telegram-bot");
        if (isMounted && response) {
          const resp: SingleOption[] = response.data.map(postition => ({ id: postition.id, name: postition?.label as string }))
          setOptions(prev => ({ ...prev, positions: resp }));
        }
      } catch (error) {
        alert(`Error fetching positions: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Component unmounted bo'lsa, state update qilinmaydi
    };
  }, []);

  const imageUrl = watch("photo");

  // Rasm yuklash
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const response = await uploadImage(file);
      setValue("photo", response); // Yuklangan rasm URL'sini saqlash
      toast({ title: "Rasm yuklandi!", description: "Rasm muvaffaqiyatli yuklandi." });
    } catch (error) {
      toast({ variant: "destructive", title: "Xatolik", description: "Rasm yuklashda muammo yuz berdi." });
    } finally {
      setLoading(false);
    }
  };

  // Rasmni o‘chirish
  const handleImageDelete = async () => {
    if (!imageUrl) return;

    setLoading(true);
    try {
      await deleteImage(imageUrl);
      setValue("photo", ""); // Rasm URL'ni tozalash
      toast({ title: "Rasm o‘chirildi!", description: "Rasm muvaffaqiyatli o‘chirildi." });
    } catch (error) {
      toast({ variant: "destructive", title: "Xatolik", description: "Rasmni o‘chirishda muammo yuz berdi." });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-4 min-w-[360px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button onClick={handleGoBack} className="w-full sm:w-auto">
          <ChevronLeft className="mr-2 h-4 w-4" /> Ortga
        </Button>
        <h2 className="text-2xl font-bold">Xodim qo‘shish</h2>
        <span></span>
      </div>

      <Card className="p-4 sm:p-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <FormField control={control} name={"name"} render={({ field: formField }) => 
            <FormItem className="w-80">
              <FormLabel>F.I.O *</FormLabel>
              <FormControl>
                <Input autoFocus type={"text"} required value={formField.value} onChange={(e) => setValue(formField.name, e.target.value)} />
              </FormControl>
              <FormMessage>{errors[formField.name]?.message}</FormMessage>
            </FormItem>}
          />

          <FormField control={control} name={"birthday"} render={({ field: formField }) => 
            <FormItem className="w-28">
              <FormLabel>Tug'ilgan sana *</FormLabel>
              <FormControl>
                <Input type={"date"} required min={"1930-01-01"} max={new Date().toISOString().split("T")[0]} value={formField.value} onChange={(e) => setValue(formField.name, e.target.value)} />
              </FormControl>
              <FormMessage>{errors[formField.name]?.message}</FormMessage>
            </FormItem>}
          />

          <div className="flex w-80 justify-between">
            <FormField control={control} name={"passport_series"} render={({ field: formField }) => 
              <FormItem className="w-17">
                <FormLabel>Pasport seriasi</FormLabel>
                  <FormControl>
                    <Input value={formField.value ?? ""} className="w-16" onChange={(e) => setValue(formField.name, e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase())} maxLength={2} minLength={2}/>
                  </FormControl>
                  <FormMessage>{errors[formField.name]?.message}</FormMessage>
              </FormItem>}
            />

            <FormField control={control} name={"passport_number"} render={({ field: formField }) => 
              <FormItem>
                <FormLabel>Pasport raqami</FormLabel>
                <FormControl>
                  <Input type={"number"} className="w-18" maxLength={7} minLength={7} value={formField.value ?? ""} onChange={(e) => setValue(formField.name, e.target.value.replace(/\D/g, "").slice(0, 7))} />
                </FormControl>
                <FormMessage>{errors[formField.name]?.message}</FormMessage>
              </FormItem>}
            />
          </div>

          <FormField control={control} name={"state_id"} render={({ field: formField }) => 
            <FormItem className="w-80">
              <FormLabel>Viloyat *</FormLabel>
              <FormControl>
                <Select required onValueChange={value => {
                  setValue(formField.name, value)
                  setValue("region_id", "")
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent >
                    {options.states.map((ste) => ( <SelectItem key={ste.id} value={String(ste.id)}> {ste.name} </SelectItem> ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage>{errors[formField.name]?.message}</FormMessage>
            </FormItem>}
          />

          <FormField control={control} name={"region_id"} render={({ field: formField }) => 
            <FormItem className="w-80">
              <FormLabel>Shaxar/Tuman *</FormLabel>
              <FormControl>
                <Select required onValueChange={value => setValue(formField.name, value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.regions.map((rgn) => ( <SelectItem key={rgn.id} value={String(rgn.id)}> {rgn.name} </SelectItem> ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage>{errors[formField.name]?.message}</FormMessage>
            </FormItem>}
          />

          <FormField control={control} name={"address"} render={({ field: formField }) => 
            <FormItem className="w-80">
              <FormLabel>Manzili *</FormLabel>
              <FormControl>
                <Input type={"text"} required value={formField.value ?? ""} onChange={(e) => setValue(formField.name, e.target.value)} />
              </FormControl>
              <FormMessage>{errors[formField.name]?.message}</FormMessage>
            </FormItem>}
          />

          <FormField control={control} name={"status"} render={({ field: formField }) => 
            <FormItem className="w-80">
              <FormLabel>Xodim statusi *</FormLabel>
              <FormControl>
                <Select disabled onValueChange={value => setValue(formField.name, value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.worker_status.map((wrk_sts) => ( <SelectItem key={wrk_sts.id} value={String(wrk_sts.id)}> {wrk_sts.name} </SelectItem> ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage>{errors[formField.name]?.message}</FormMessage>
            </FormItem>}
          />

          <FormField control={control} name={"position_id"} render={({ field: formField }) => 
            <FormItem className="w-80">
              <FormLabel>Lavozimi *</FormLabel>
              <FormControl>
                <Select required onValueChange={value => setValue(formField.name, value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.positions.map((pstn) => ( <SelectItem key={pstn.id} value={String(pstn.id)}> {pstn.name} </SelectItem> ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage>{errors[formField.name]?.message}</FormMessage>
            </FormItem>}
          />

          <FormField control={control} name="phone_youre" render={({ field: { onChange, value, ...rest } }) => (
            <FormItem className="w-40">
              <FormLabel>Telefon 1 *</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+998</span>
                  <Input
                    type="tel"
                    className="pl-16"
                    required
                    {...rest}
                    value={formatPhoneNumber(value)}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "").slice(0, 10); // Faqat 9 ta raqam
                      onChange(rawValue);
                    }}
                    placeholder="## ### ####"
                  />
                </div>
              </FormControl>
              <FormMessage>{errors.phone_youre?.message}</FormMessage>
            </FormItem>)}
          />

          <FormField control={control} name="phone_additional" render={({ field: { onChange, value, ...rest } }) => (
            <FormItem className="w-40">
              <FormLabel>Telefon 2 </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+998</span>
                  <Input
                    type="tel"
                    className="pl-16"
                    {...rest}
                    value={formatPhoneNumber(value ?? "")}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "").slice(0, 10); // Faqat 9 ta raqam
                      onChange(rawValue);
                    }}
                    placeholder="## ### ####"
                  />
                </div>
              </FormControl>
              <FormMessage>{errors.phone_additional?.message}</FormMessage>
            </FormItem>)}
          />

          <FormField control={control} name="phone_work" render={({ field: { onChange, value, ...rest } }) => (
            <FormItem className="w-40">
              <FormLabel>Ish telefoni </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+998</span>
                  <Input
                    type="tel"
                    className="pl-16"
                    {...rest}
                    value={formatPhoneNumber(value ?? "")}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "").slice(0, 10); // Faqat 9 ta raqam
                      onChange(rawValue);
                    }}
                    placeholder="## ### ####"
                  />
                </div>
              </FormControl>
              <FormMessage>{errors.phone_work?.message}</FormMessage>
            </FormItem>)}
          />

          <FormField control={control} name={"education"} render={({ field: formField }) => 
            <FormItem className="w-80">
              <FormLabel>Ma'lumoti</FormLabel>
              <FormControl>
                <Select required onValueChange={value => setValue(formField.name, value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.education_status.map((edc_sts) => ( <SelectItem key={edc_sts.id} value={String(edc_sts.id)}> {edc_sts.name} </SelectItem> ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage>{errors[formField.name]?.message}</FormMessage>
            </FormItem>}
          />
          
          <FormField control={control} name={"education_place"} render={({ field: formField }) => 
            <FormItem className="w-80">
              <FormLabel>Tamomlagan ta'lim muassasasi nomi</FormLabel>
              <FormControl>
                <Input type={"text"} value={formField.value ?? ""} onChange={(e) => setValue(formField.name, e.target.value)} />
              </FormControl>
              <FormMessage>{errors[formField.name]?.message}</FormMessage>
            </FormItem>}
          />

          <FormField control={control} name={"responsible_worker"} render={({ field: formField }) => 
            <FormItem className="w-80">
              <FormLabel>Ma'sul xodim</FormLabel>
              <FormControl>
                <Input disabled type={"text"} value={formField.value ?? ""} defaultValue={"user.admin"}/>
              </FormControl>
            </FormItem>}
          />

          <FormField control={control} name="photo" render={({ field }) => (
            <FormItem className="w-80 h-80">
              <FormLabel htmlFor="photo" >Rasm yuklash</FormLabel>
              <FormControl>
                {imageUrl ? (
                  <div className="mt-4 relative">
                    <PhotoProvider>
                      <PhotoView src={`https://garant-hr.uz/api/public/storage/${imageUrl}`}>
                        <img src={`https://garant-hr.uz/api/public/storage/${imageUrl}`} alt="Xodim rasmi" className="w-full h-72 object-cover rounded-md"/>
                      </PhotoView>
                    </PhotoProvider>
                    <Button variant="destructive" className="mt-2 absolute bottom-1 right-1" onClick={handleImageDelete} disabled={loading}>
                      O'chirish
                    </Button>
                  </div>
                ) : (
                  <Input id="photo" type="file" className="h-72" accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file); // `react-hook-form` bilan ishlashi uchun
                        handleImageUpload(e);
                      }
                    }}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>)}
          />

          <Button type="submit" className="w-full">
            Saqlash
          </Button>
        </form>
      </Form>
      </Card>
    </div>
  );
}
