import { z } from "zod";
import { SingleOption, TWorkers } from "@/types/types";
import { useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { fetchRequest } from "@/services/fetchRequest";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ✅ Validatsiya uchun zod shemasi
const workerSchema = z.object({
  name: z.string().min(3, "Ism kamida 3 ta harf bo‘lishi kerak"),
  position_name: z.string().min(3, "Lavozim nomi kamida 3 ta harf bo‘lishi kerak"),
  birthday: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), "Tug‘ilgan sanani YYYY-MM-DD formatida kiriting"),
  phone_number: z.string().min(9, "Telefon raqam noto‘g‘ri").max(13, "Telefon raqam noto‘g‘ri"),
  phone_additional: z.string().optional(),
  phone_work: z.string().optional(),
  address: z.string().optional(),
  education: z.string().optional(),
  education_place: z.string().optional(),
  passport_number: z.string().optional().refine((val) => !val || /^[A-Z]{2}\d{7}$/.test(val), "Pasport raqami 2 harf va 7 ta raqamdan iborat bo‘lishi kerak (AA1234567)"),
  responsible_worker: z.string().min(3, "Mas'ul shaxs nomi kamida 3 ta harf bo‘lishi kerak"),
  status: z.string().min(3, "Holat nomi kamida 3 ta harf bo‘lishi kerak"),
  date: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), "Sanani YYYY-MM-DD formatida kiriting"),
  state_id: z.string(),
  region_id: z.string(),
  passport_series: z.string().min(2).max(2)
});

// const inputs = [
//   { name: "name", label: "F.I.O", type: "text" },
//   { name: "position_name", label: "Lavozim", type: "text" },
//   { name: "birthday", label: "Tug‘ilgan sana", type: "date" },
//   { name: "phone_number", label: "Telefon raqam", type: "tel" },
//   { name: "phone_additional", label: "Qo‘shimcha telefon", type: "tel", optional: true },
//   { name: "phone_work", label: "Ish telefoni", type: "tel", optional: true },
//   { name: "address", label: "Manzil", type: "text", optional: true },
//   { name: "education", label: "Ta'lim", type: "text", optional: true },
//   { name: "education_place", label: "O‘qish joyi", type: "text", optional: true },
//   { name: "passport_number", label: "Pasport raqami", type: "text", optional: true },
//   { name: "responsible_worker", label: "Mas'ul shaxs", type: "text" },
//   { name: "status", label: "Holati", type: "text" },
//   { name: "date", label: "Qo‘shilgan sana", type: "date" },
// ]

export default function AddWorkerPage() {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  const onSubmit = (data: any) => { console.log("Yangi xodim ma’lumotlari:", data) };
  const [loading, setLoading] = useState(true)
  const [options, setOptions] = useState<{ states: SingleOption[], regions:SingleOption[], positions: SingleOption[] }>({ states: [], regions: [], positions:[] })

  const form = useForm<TWorkers>({
    resolver: zodResolver(workerSchema),
    defaultValues: { name: "", position_name: "", birthday: "", phone_number: "", responsible_worker: "", status: "", date: "" },
    disabled: loading
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

  console.log(getValues())
  console.log(watch("passport_number"))
  // 

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
                <FormItem>
                  <FormLabel>F.I.O</FormLabel>
                  <FormControl>
                    <Input autoFocus type={"text"} value={formField.value} onChange={(e) => setValue(formField.name, e.target.value)} />
                  </FormControl>
                  <FormMessage>{errors[formField.name]?.message}</FormMessage>
                </FormItem>}
              />

              <FormField control={control} name={"state_id"} render={({ field: formField }) => 
                <FormItem>
                  <FormLabel>Viloyat</FormLabel>
                  <FormControl>
                    <Select onValueChange={value => {
                      setValue(formField.name, value)
                      setValue("region_id", "")
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent >
                        {options.states.map((state) => ( <SelectItem key={state.id} value={String(state.id)}> {state.name} </SelectItem> ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors[formField.name]?.message}</FormMessage>
                </FormItem>}
              />

              <FormField control={control} name={"region_id"} render={({ field: formField }) => 
                <FormItem>
                  <FormLabel>Shaxar/Tuman</FormLabel>
                  <FormControl>
                    <Select onValueChange={value => setValue(formField.name, value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.regions.map((region) => ( <SelectItem key={region.id} value={String(region.id)}> {region.name} </SelectItem> ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors[formField.name]?.message}</FormMessage>
                </FormItem>}
              />

              <FormField control={control} name={"position_id"} render={({ field: formField }) => 
                <FormItem>
                  <FormLabel>Lavozimi</FormLabel>
                  <FormControl>
                    <Select onValueChange={value => setValue(formField.name, value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.positions.map((position) => ( <SelectItem key={position.id} value={String(position.id)}> {position.name} </SelectItem> ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors[formField.name]?.message}</FormMessage>
                </FormItem>}
              />

              <FormField control={control} name={"birthday"} render={({ field: formField }) => 
                <FormItem>
                  <FormLabel>Tug'ilgan sana</FormLabel>
                  <FormControl>
                    <Input type={"date"} value={formField.value} onChange={(e) => setValue(formField.name, e.target.value)} />
                  </FormControl>
                  <FormMessage>{errors[formField.name]?.message}</FormMessage>
                </FormItem>}
              />

              <FormField control={control} name={"passport_series"} render={({ field: formField }) => 
                <FormItem>
                  <FormLabel>Pasport raqami</FormLabel>
                  <FormControl>
                    <Input value={formField.value ?? ""} onChange={(e) => setValue(formField.name, e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase())} maxLength={2} minLength={2}/>
                  </FormControl>
                  <FormMessage>{errors[formField.name]?.message}</FormMessage>
                </FormItem>}
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
