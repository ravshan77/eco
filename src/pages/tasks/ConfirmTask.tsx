import { z } from "zod";
import { base } from "@/services/api";
import {  useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { TASK_PREORIIY_STATUS } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { tasksApi } from "@/services/tasks.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { confirmTaskApi } from "@/services/confirmTask.service";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { TTask, TaskConfirmStatusEnum, TConfirmTask } from "@/types/types";

const confirmTaskSchema = z.object({
  id: z.number().optional(),
  assigment_id: z.number(),
  fine: z.coerce.number().min(0, "Jarima bali hech bo'lmaganda 0 ball kiritish kerak"),
  description: z.string().min(2,"Topshiriqni bajarganlik haqida izoh yozish majburiy"),
});

export default function ConfirmTask() {
  const { assigment_id } = useParams()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<TTask | null>(null)

  const form = useForm<TConfirmTask>({ resolver: zodResolver(confirmTaskSchema), disabled: loading, defaultValues: {fine: "0"} });
  const { setValue, formState: { errors }, handleSubmit, watch, reset } = form;

  const confirm_status = Number(data?.confirmation_status)  
  const disabled_status = TaskConfirmStatusEnum.Tasdiqlangan === confirm_status
  
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await tasksApi.getById(String(assigment_id))
        if (response.status) {
          setData(response.resoult)
          if (response.resoult?.assigment_confirmation?.id) {
            reset(response.resoult?.assigment_confirmation) 
          } else{
            setValue("assigment_id", Number(response.resoult?.id))
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
  const controlConfirmStatus = async (sent_data: TConfirmTask) => {
    if (confirm_status === TaskConfirmStatusEnum.Tasdiqlangan){
      return await confirmTaskApi.update(sent_data)
    }
    if (confirm_status === TaskConfirmStatusEnum.Jarayonda){
      return await confirmTaskApi.create(sent_data)
    }
    if (confirm_status === TaskConfirmStatusEnum.Bajarilgan){
      return await confirmTaskApi.create(sent_data)
    }

    return { status: false, error:{message: "Xatolik"}, resoult: {   assigment_id: 0, description: "", fine:0 }}
  }

  const onSubmit = async (sent_data: TConfirmTask) => { 
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Izoh</Label>
              <Textarea value={data?.assignment_result?.description} readOnly />
            </div>

            <div className="space-y-2 w-full">
              <Label>{ data?.assignment_result?.file?.length ? "Topshiriqni bajarganlik haqida fayllar" : <>Topshiriqni bajarganlik haqida fayllar: <span className="text-[red]"> bo'sh</span>  </>}</Label>
              { data?.assignment_result?.file?.length && <div className='w-full flex flex-wrap gap-4'>
                {data?.assignment_result?.file.map(image =>( 
                  <div className="relative h-[170px] w-[170px]" key={image}>
                    <PhotoProvider>
                      <PhotoView src={`${base + image}`}>
                        <img src={`${base + image}`} alt="Topshiriq rasmi" className="w-full h-full object-cover rounded-md border"/>
                      </PhotoView>
                    </PhotoProvider>
                  </div>))}             
              </div>}
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 space-y-4">
          <h2 className="text-2xl text-center font-bold">Topshiriq natijasini qabul qilish haqida</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label>Izoh *</Label>
              <Textarea name="description" value={watch("description")} readOnly={loading || disabled_status} autoFocus required placeholder="Topshiriq natijasini qabul qilish haqida ..." onChange={e => setValue("description", e.target.value)} className={errors.description ? 'border-red-500' : ''} />
              {errors.description && (<p className="text-sm text-red-500"> {errors.description.message} </p>)}
            </div>

            <div className="flex gap-4">
              <div className="space-y-2 w-24">
                <Label>Topshiriq balli</Label>
                <Input value={data?.ball} type="number" readOnly className="border-yellow-400"/>
              </div>

              <div className="space-y-2 flex flex-col justify-around">
                <>&nbsp;</>
                <span>-</span>
              </div>
   
              <div className="space-y-2 w-32">
                <Label>Jarima bali (0-{data?.ball}) *</Label>
                <Input name="fine" type="number" value={watch("fine")} min={0} max={Number(data?.ball) ?? 100} readOnly={loading || disabled_status} required placeholder="Jarima bali" onChange={e => {
                  const value = Number(e.target?.value);    
                  if (value < 0 || value > Number(data?.ball)) return;
                  setValue("fine", e.target?.value)
                }} className={'border-red-500'} />
                {errors.fine && (<p className="text-sm text-red-500"> {errors.fine.message} </p>)}
              </div>

              <div className="space-y-2 flex flex-col justify-around">
                <>&nbsp;</>
                <span>=</span>
              </div>

              <div className="space-y-2 w-[100px]">
                <Label>Beriladigan ball </Label>
                <Input value={Number(data?.ball) - Number(watch("fine"))} readOnly className="border-green-500" />
              </div>


            </div>
            {!disabled_status ? <div className="flex justify-center space-x-2">
               <Button type="submit" className='m-3' variant={"green"} disabled={loading}> Tasdiqlash </Button> 
            </div> : null}
          </form>
        </Card>
      </div>
    </>
  );
}
