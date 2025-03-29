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
import { TASK_PREORIIY_STATUS } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { tasksApi } from "@/services/tasks.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { completeTaskApi } from "@/services/completeTask.service";
import { TTask, TCompleteTask, TaskConfirmStatusEnum } from "@/types/types";

const complateTaskSchema = z.object({
  id: z.number().optional(),
  assigment_id: z.number(),
  file: z.array(z.string()).nullable().optional(),
  description: z.string().min(2,"Topshiriqni bajarganlik haqida yozish majburiy"),
});

export default function CompleteTask() {
  const { assigment_id } = useParams()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<TTask | null>(null)

  const form = useForm<TCompleteTask>({ resolver: zodResolver(complateTaskSchema), disabled: loading });
  const { setValue, formState: { errors }, handleSubmit, watch, reset } = form;

  const images = watch("file")
  const confirm_status = Number(data?.confirmation_status)  
  const disabled_status = TaskConfirmStatusEnum.Tasdiqlangan === confirm_status
  
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await tasksApi.getById(String(assigment_id))
        if (response.status) {
          setData(response.resoult)
          if (response.resoult?.assignment_result?.id) {
            reset(response.resoult?.assignment_result) 
          } else{
            setValue("assigment_id", Number(assigment_id))
            console.log("setValue(assigment_id, Number(assigment_id))");
          }
          toast({title: "Muvaffaqiyatli yuklandi", description: "Ma'lumotlar yuklandi"});
        }
      } catch (err) {
        toast({variant: "destructive", title: "Xatolik yuz berdi", description: "Ma'lumotlarni yuklashda xatolik yuz berdi" });
      } finally {
        setLoading(false);
      }
    };
    fetchData()
  },[assigment_id])

  // check sent update or create api
  const controlConfirmStatus = async (sent_data: TCompleteTask) => {
    if (confirm_status === TaskConfirmStatusEnum.Tasdiqlangan){
      return { status: false, error:{message: "Topshiriq oldin tasdiqlangan"}, resoult: {   assigment_id: 0, description: "" }}
    }
    if (confirm_status === TaskConfirmStatusEnum.Jarayonda){
      return await completeTaskApi.create(sent_data)
    }
    if (confirm_status === TaskConfirmStatusEnum.Bajarilgan){
      return await completeTaskApi.update(sent_data)
    }

    return { status: false, error:{message: "Xatolik"}, resoult: {   assigment_id: 0, description: "" }}
  }

  const onSubmit = async (sent_data: TCompleteTask) => { 
    setLoading(true);
    try {
      const response = await controlConfirmStatus(sent_data);
      if (response.status) {
        toast({ title: "Muvaffaqiyatli", description: "Topshiriq bajarildi"});
        handleGoBack()
      }else {
        throw new Error(response.error.message)
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

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
    }finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="space-y-4 min-w-[360px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button onClick={handleGoBack} variant={"primary"} type="button" className="w-full sm:w-auto">
            <ChevronLeft className="mr-2 h-4 w-4" /> Ortga
          </Button>
          <h2 className="text-2xl font-bold">Topshiriq</h2>
          <span></span>
        </div>

        <Card className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2 w-[410px]">
              <Label>Topshiriq turi</Label>
              <Input value={data?.assigment_category_name} readOnly />
            </div>

            <div className="space-y-2 w-60">
              <Label>Muhimligi</Label>
              <Input value={TASK_PREORIIY_STATUS.find(t => t.id === data?.preority)?.name} readOnly />
            </div>

            <div className="space-y-2 w-32">
              <Label>Boshlash sanasi</Label>
              <Input value={data?.period_from} readOnly />
            </div>

            <div className="space-y-2 w-32">
              <Label>Tugatish sanasi</Label>
              <Input value={data?.period_to} readOnly />
            </div>

            <div className="space-y-2 w-32">
              <Label>Ball</Label>
              <Input value={data?.ball} readOnly />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Topshiriq</Label>
            <Textarea rows={3} value={data?.assigment} readOnly className={`min-h-[60px]`}/>
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="file">{data?.file?.length ? "Topshiriq Fayllari" : <>Topshiriq Fayllari: <span className="text-[red]"> bo'sh</span> </>} </Label>
            { data?.file?.length && <div className='w-full flex flex-wrap gap-4'>
              {data?.file?.map(image => ( 
                <div className="relative h-[170px] w-[170px]" key={image}>
                  <PhotoProvider>
                    <PhotoView src={`${base + image}`}>
                      <img src={`${base + image}`} alt="Topshiriq rasmi" className="w-full h-full object-cover border rounded-md"/>
                    </PhotoView>
                  </PhotoProvider>
                </div>)) }              
            </div>}
          </div>
        </Card>

        <Card className="p-4 sm:p-6 space-y-4">
          <h2 className="text-2xl text-center font-bold">Topshiriqni bajarganlik haqida</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label>Izoh *</Label>
              <Textarea name="description" value={watch("description")} readOnly={loading || disabled_status} autoFocus required placeholder="Topshiriq bajarganlik haqida ..." onChange={e => setValue("description", e.target.value)} className={errors.description ? 'border-red-500' : ''} />
              {errors.description && (<p className="text-sm text-red-500"> {errors.description.message} </p>)}
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="file">Topshiriq bajarganlik haqida fayllar </Label>

              <div className='w-full flex flex-wrap gap-4'>
                {images?.length ? (images.map(image =>( 
                  <div className="relative h-[170px] w-[170px]" key={image}>
                    <PhotoProvider>
                      <PhotoView src={`${base + image}`}>
                        <img src={`${base + image}`} alt="Topshiriq rasmi" className="w-full h-full object-cover rounded-md border"/>
                      </PhotoView>
                    </PhotoProvider>
                    {!disabled_status && <Button variant="destructive" type="button" className="mt-2 w-12 absolute cursor-pointer bottom-1 right-1" onClick={() => handleImageDelete(image)} disabled={loading}>
                      <Beer width={"20px"} height={"20px"}/>
                    </Button>}
                  </div>))) : null }    
                  { !disabled_status ? <div className='h-[170px] w-[170px]'>
                    <Input id="file" type="file" hidden disabled={loading} className="h-full w-full" accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(e);
                        }
                      }}
                    />
                  </div> : null}                
              </div>
            </div>

            {!disabled_status ? <div className="flex justify-center space-x-2">
               <Button type="submit" className='ml-3' variant={"green"} disabled={loading}> Tasdiqlash </Button> 
            </div> : null}
          </form>
        </Card>
      </div>
    </>
  );
}
