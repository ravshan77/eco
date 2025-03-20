import { z } from "zod";
import { base } from "@/services/api";
import {  useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { statesAPI } from "@/services/states.service";
import { areObjectsEqual } from "@/utils/objectsEqual";
import { SingleOption, TWorkers } from "@/types/types";
import { regionsAPI } from "@/services/regions.service";
import { workersAPI } from "@/services/workers.service";
import { sectionsAPI } from "@/services/sections.service";
import { positionsAPI } from "@/services/positions.service";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { EDUCATION_STATUS, WORKER_STATUS, workerDefaultValues } from "@/constants";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Validatsiya uchun zod shemasi
const workerSchema = z.object({
  birthday: z.string(), //.refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), "Tug‘ilgan sanani YYYY.MM.DD formatida kiriting"),
  name: z.string().min(3, "F.I.O kamida 3 ta harf bo‘lishi kerak"),
  phone_youre: z.string().min(9, "Telefon raqam noto‘g‘ri").max(13, "Telefon raqam noto‘g‘ri"),
  position_id: z.number().min(1, "Lavozim tanlang"),
  section_id: z.number().min(1, "Bo'lim tanlash"),
  address: z.string().min(3, "Manzil kamida 3 ta harf bo‘lishi kerak").optional(),
  education: z.string().optional(),
  education_place: z.string().optional(),
  passport_number: z.string().optional(),
  passport_series: z.string().optional(),
  phone_additional: z.string().optional(),
  phone_work: z.string().optional(),
  photo: z.string().optional(),
  region_id: z.number().optional(),
  state_id: z.number().optional(),
});

export default function AddWorkerPage() {
  const [loading, setLoading] = useState(true)
  const [options, setOptions] = useState<{ states: SingleOption[], regions:SingleOption[], positions: SingleOption[], sections: SingleOption[], EDUCATION_STATUS: SingleOption[], WORKER_STATUS: SingleOption[] }>({ states: [], regions: [], positions:[], sections:[], WORKER_STATUS, EDUCATION_STATUS })

  const navigate = useNavigate();

  const form = useForm<TWorkers>({
    resolver: zodResolver(workerSchema),
    // defaultValues: workerDefaultValues,
    values: workerDefaultValues,
    disabled: loading,
    shouldUnregister: false,
  });

  const { control, setValue, formState: { errors }, handleSubmit, watch } = form;
  const image_path = watch("photo");
  const state_id = watch("state_id")
  const section_id = watch("section_id")

  // get states
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await statesAPI.getAll();
        if (isMounted && response.status) {
          const resp = response.resoult.map(pstn => ({ id: String(pstn.id), name: pstn?.name }))
          setOptions(prev => ({ ...prev, states: resp }));
        }else {
          throw new Error(response.error.message)
        }
      } catch (err) {
        toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Component unmounted bo'lsa, state update qilinmaydi
    };
  }, []);

  // get sections
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await sectionsAPI.getAll();
        if (isMounted && response.status) {
          const resp = response.resoult.map(pstn => ({ id: String(pstn.id), name: pstn?.name }))
          setOptions(prev => ({ ...prev, sections: resp }));
        }else {
          throw new Error(response.error.message)
        }
      } catch (err) {
        toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Component unmounted bo'lsa, state update qilinmaydi
    };
  }, []);

  // get regions
  useEffect(() => {
    if (!state_id) {
       return 
    }

    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await regionsAPI.getRegionsByStateId((state_id));
        if (isMounted && response.status) {
          setOptions(prev => ({ ...prev, regions: response.resoult }));
        }else {
          throw new Error(response.error.message)
        }
      } catch (err) {
        toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Component unmounted bo'lsa, state update qilinmaydi
    };
  }, [state_id]);

  // get positions
  useEffect(() => {
    if (!section_id) {
      return;
    }

    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await positionsAPI.getPositionBySectionId(section_id);
        if (isMounted && response.status) {
          const resp: SingleOption[] = response.resoult.map(postition => ({ id: String(postition.id), name: postition?.name }))
          setOptions(prev => ({ ...prev, positions: resp }));
        }else {
          throw new Error(response.error.message)
        }
      } catch (err) {
        toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Component unmounted bo'lsa, state update qilinmaydi
    };
  }, [section_id]);

  const onSubmit = async (data: TWorkers) => { 
    setLoading(true);
    try {
      const response = await workersAPI.create(data);
      if (response.status) {
        toast({ title: "Muvaffaqiyatli", description: "Yangi xodim qo'shildi"});
        console.log(response.resoult)
        // navigate(`/workers/edit-worker/${response.resoult.id}`)
      }else {
        throw new Error(response.error.message)
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
    } finally {
      setLoading(false);
    }
   
  };

  // Rasm yuklash
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await workersAPI.uploadImage(formData);
      console.log(response)
      if (response.status) {
        setValue("photo", response.resoult.file_path); 
        toast({ title: "Rasm yuklandi!", description: "Rasm muvaffaqiyatli yuklandi." });
      }else {
        throw new Error(response.error.message)
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  //! Rasmni o‘chirish
  const handleImageDelete = async (file_path:string) => {
    if (!image_path) return;

    // setLoading(true);
    // try {
      // const response = await workersAPI.deleteImage(image_path);
      setValue("photo", ""); // Rasm URL'ni tozalash
      // toast({ title: "Rasm o‘chirildi!", description: "Rasm muvaffaqiyatli o‘chirildi." });
    // } catch (error) {
      // toast({ variant: "destructive", title: "Xatolik", description: "Rasmni o‘chirishda muammo yuz berdi." });
    // }
    // finally {
    //   setLoading(false);
    // }
  };

  const handleGoBack = () => {
    const chack_equla_values = areObjectsEqual(watch(), workerDefaultValues);

    if (chack_equla_values) {
      navigate(-1);
      return
    }
  
    const confirmChange = window.confirm("Oxirgi kiritgan ma'lumotlaringiz saqlanmaydi?");
    if (confirmChange) {
      navigate(-1);
    }
    return
  };

  console.log(errors)
  // console.log(base + image_path)

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
                <Select required value={String(watch("state_id"))} onValueChange={value => {
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
                <Select required value={String(watch("region_id"))} onValueChange={value => setValue(formField.name, value)}>
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

          <FormField control={control} name={"section_id"} render={({ field: formField }) => 
            <FormItem className="w-80">
              <FormLabel>Bo'lim *</FormLabel>
              <FormControl>
                <Select required value={String(watch("section_id"))} onValueChange={value => {
                  setValue(formField.name, Number(value))
                  setValue("position_id", 0)
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={"Bo'lim tanlang"} />
                  </SelectTrigger>
                  <SelectContent >
                    {options.sections.map((sect) => ( <SelectItem key={sect.id} value={String(sect.id)}> {sect.name} </SelectItem> ))}
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
                <Select required disabled={!watch("section_id")} value={String(watch("position_id"))} onValueChange={value => setValue(formField.name, Number(value))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={"Avval bo'lim tanlang 👆"} />
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
                    {options.EDUCATION_STATUS.map((edc_sts) => ( <SelectItem key={edc_sts.id} value={String(edc_sts.id)}> {edc_sts.name} </SelectItem> ))}
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
                <Input disabled type={"text"} value={formField.value ?? "user.admin"} />
              </FormControl>
            </FormItem>}
          />

          <FormField control={control} name="photo" render={({ field }) => (
            <FormItem className="w-80 h-80">
              <FormLabel htmlFor="photo" >Rasm yuklash</FormLabel>
              <FormControl>
                {image_path ? (
                  <div className="mt-4 relative">
                    <PhotoProvider>
                      <PhotoView src={`${base + image_path}`}>
                        <img src={`${base + image_path}`} alt="Xodim rasmi" className="w-full h-72 object-cover rounded-md"/>
                      </PhotoView>
                    </PhotoProvider>
                    <Button variant="destructive" className="mt-2 absolute bottom-1 right-1" onClick={() => handleImageDelete(image_path)} disabled={loading}>
                      O'chirish
                    </Button>
                  </div>
                ) : (
                  <Input id="photo" type="file" className="h-72" accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(e);
                      }
                    }}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>)}
          />

          <Button type="submit" className="w-full"> Saqlash </Button>
        </form>
      </Form>
      </Card>
    </div>
  );
}
