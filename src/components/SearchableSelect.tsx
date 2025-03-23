import axios from "axios";
import { baseUrl } from "@/services/api";
import { TWorkersOrders } from "@/types/types";
import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Control, ControllerRenderProps, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";

type Props = {
  errors: FieldErrors<TWorkersOrders>,
  watch: UseFormWatch<TWorkersOrders>
  control: Control<TWorkersOrders, any>
  setValue: UseFormSetValue<TWorkersOrders>
  formField: ControllerRenderProps<TWorkersOrders, "worker_id">
}

export default function SearchableSelect({ setValue, watch, formField}: Props) {
  const [data, setData] = useState<{ id: number; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const worker_id = String(watch("worker_id"))

  // Searchni debounce qilish (har safar emas, kechikish bilan ishlaydi)
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setPage(1);
      // setData([]);
      setHasMore(true);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [search]);

  // Data olish
  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/workers?page=${page}`, { search });
      const result = response.data.resoult;

      setData((prev) => (page === 1 ? result.data : [...prev, ...result.data]));
      setHasMore(result.meta.current_page < result.meta.last_page);
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll bo'lganda pagination ishlashi
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  // Select ochilganda inputga focus berish
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };


  return (
    <Select
      value={worker_id}
      onOpenChange={handleOpenChange}
      onValueChange={(value) => setValue(formField.name, Number(value)) }
    >
      <SelectTrigger className="w-full">
        {worker_id ? data.find((item) => item.id.toString() === worker_id)?.name : "Tanlang"}
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 py-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="Qidirish..."
            value={search}
            className="w-full text-black px-2 py-1 border border-gray-300 rounded-md"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ScrollArea ref={containerRef} onScroll={handleScroll} className="h-64">
          {data.map((item) => (
            <SelectItem key={item.id} value={String(item.id)}>
              {item.name}
            </SelectItem>
          ))}
          {loading && <div className="p-2 text-center">Yuklanmoqda...</div>}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
