import { z } from "zod";
import { base } from "@/services/api";
import {  useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Beer, ChevronLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { CURRENT_DAY, TASK_PREORIIY_STATUS } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { tasksApi } from "@/services/tasks.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { SingleOption, TWorkers } from "@/types/types";
import { workersAPI } from "@/services/workers.service";
import { useNavigate, useParams } from "react-router-dom";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { taskCategoryApi } from "@/services/taskCategory.service";

const taskSchema = z.object({
  ball: z.string().min(0, "Eng kamida 0 ball berish kerak ").max(100, "Eng ko'pi bilan 100 ball berish mumkin"),
  worker_id: z.number(),
  period_to: z.string(),
  period_from: z.string(),
  preority: z.coerce.number(),
  assigment_category_id: z.coerce.number(),
  file: z.array(z.string()).optional(),
  assigment: z.string().min(3, "Topshiriq kamida 3 ta harfdan iborat bo'lishi kerak"),
});
  
  type FormData = z.infer<typeof taskSchema>;

export default function AddTask() {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<{assigment_category: SingleOption[], worker_data?: TWorkers }>({ assigment_category: [] })
  const form = useForm<FormData>({ resolver: zodResolver(taskSchema), defaultValues:{ ball: "0" }});
  const {watch, setValue, formState: { errors }, getValues} = form
  const images = watch("file")
  const navigate = useNavigate();
  const { worker_id, assigment_category_id } = useParams()


  const fetchData = async () => {
    setLoading(true);
    try {

      const workerRes = await workersAPI.getById(Number(worker_id));
      const taskCategoryRes = await taskCategoryApi.getAll()

      if (!workerRes.status && !taskCategoryRes.status) throw new Error("Ma'lumotlarni yuklashda xatolik");

        setOptions({ assigment_category: taskCategoryRes.resoult.map( t => ({ id: String(t?.id), name: t?.name })), worker_data: workerRes.resoult })
        setValue("assigment_category_id", Number(assigment_category_id) )
        setValue("worker_id", Number(worker_id))
    } catch (err) {
      toast({variant: "destructive", title: "Xatolik yuz berdi", description: "Ma'lumotlarni yuklashda xatolik yuz berdi" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData()
  },[worker_id, assigment_category_id])

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await tasksApi.create(data);
      if (response.status) {
        toast({title: "Topshiriq yaratilindi", description: "Xodimga topshiriq berildi"});
        handleGoBack()
      } else {
        throw new Error(response.error.message)
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigate(-1)


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await tasksApi.uploadImage(formData);
    if (response.status) {
      setValue("file", [...(images ??[]), response.resoult.file_path]); 
      toast({ title: "Rasm yuklandi!", description: "Rasm muvaffaqiyatli yuklandi." });
    } else {
      throw new Error(response.error.message)
    }
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = async (file_path:string) => {
    if (!file_path?.length) return;
    setLoading(true);
    try {
      const response = await tasksApi.deleteImage(file_path);
      if (response.status) {
        const find_file = images?.filter( img => img !== file_path )
        setValue("file", find_file); // Rasm URL'ni tozalash
        toast({ title: "Rasm o‘chirildi!", description: "Rasm muvaffaqiyatli o‘chirildi." });
      } else {
        throw new Error(response.error.message)
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="space-y-4 min-w-[360px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button onClick={handleGoBack} variant={"primary"} type="button" className="w-full sm:w-auto">
            <ChevronLeft className="mr-2 h-4 w-4" /> Ortga
          </Button>
          <h2 className="text-2xl font-bold"> {options.worker_data?.name}ga <span className="text-xl">yangi topshiriq berish</span> </h2>
          <span></span>
        </div>

        <Card className="p-4 sm:p-6 space-y-4">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2 w-[410px]">
                <Label htmlFor="assigment_category_id">Topshiriq turi *</Label>
                <select id="assigment_category_id" {...form.register('assigment_category_id')} required value={String(watch("assigment_category_id"))} className="w-full rounded-md border border-input bg-background px-3 py-[5px]" onChange={e => {
                  if (e.target.value) {
                    setValue("assigment_category_id", Number(e.target.value))
                  }
                }}>
                 {options.assigment_category.map( t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                {errors.assigment_category_id && (<p className="text-sm text-red-500"> {errors.assigment_category_id.message} </p> )}
              </div>

              <div className="space-y-2 w-60">
                <Label htmlFor="preority">Muhimligi *</Label>
                <select id="preority" {...form.register('preority')} required onChange={e => setValue("preority", Number(e.target.value))} value={Number(watch("preority"))} className="w-full rounded-md border border-input bg-background px-3 py-[5px]" >
                { TASK_PREORIIY_STATUS.map( t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                {errors.preority && (<p className="text-sm text-red-500"> {errors.preority.message} </p> )}
              </div>

              <div className="space-y-2 w-32">
                <Label htmlFor="period_from">Boshlash sanasi *</Label>
                <Input id="period_from" type="date" {...form.register('period_from')} min={CURRENT_DAY} max={watch("period_to") ? watch("period_to") : undefined } required className={errors.period_from ? 'border-red-500' : ''} />
                {errors.period_from && ( <p className="text-sm text-red-500"> {errors.period_from.message} </p>)}
              </div>

              <div className="space-y-2 w-32">
                <Label htmlFor="period_to">Tugatish sanasi *</Label>
                <Input id="period_to" type="date" {...form.register('period_to')} min={watch("period_from") ? watch("period_from") : CURRENT_DAY} required className={errors.period_to ? 'border-red-500' : ''} />
                {errors.period_to && ( <p className="text-sm text-red-500"> {errors.period_to.message} </p>)}
              </div>

              <div className="space-y-2 w-32">
                <Label>Ball (0-100)*</Label>
                <Input type="number" {...form.register('ball')} value={watch("ball")} min={0} max={100} required className={errors.ball ? 'border-red-500' : ''} onChange={e => {
                  const value = Number(e.target?.value);    
                  if (value < 0 || value > 100) return;
                  setValue("ball", e.target?.value)
                }} />
                {errors.ball && (<p className="text-sm text-red-500"> {errors.ball.message} </p> )}
              </div>

            </div>

            <div className="space-y-2">
              <Label htmlFor="assigment">Topshiriq *</Label>
              <Textarea rows={2} id="assigment" autoFocus {...form.register('assigment')} required placeholder="Topshiriq matni..." className={`min-h-[60px] ${errors.assigment ? 'border-red-500' : ''}`}/>
              {errors.assigment && (<p className="text-sm text-red-500"> {errors.assigment.message} </p> )}
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="file">Fayllar</Label>
              <div className='w-full flex flex-wrap gap-4'>
                {images?.length ? (images.map(image =>( 
                  <div className="relative h-[170px] w-[170px]" key={image}>
                    <PhotoProvider>
                      <PhotoView src={`${base + image}`}>
                        <img src={`${base + image}`} alt="Topshiriq rasmi" className="w-full h-full object-cover rounded-md border"/>
                      </PhotoView>
                    </PhotoProvider>
                    <Button variant="destructive" type="button" className="mt-2 w-12 absolute cursor-pointer bottom-1 right-1" onClick={() => handleImageDelete(image)} disabled={loading}><Beer width={"20px"} height={"20px"}/></Button>
                  </div>))) : null }    
                  <div className='h-[170px] w-[170px]'>
                    <Input id="file" type="file" hidden disabled={loading} className="h-full w-full" accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(e);
                        }
                      }}
                    />
                  </div>                
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="submit" className='ml-2' variant={"green"} disabled={loading}> Tasdiqlash </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
