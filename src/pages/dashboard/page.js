import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Label, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Activity, CreditCard, DollarSign, Users, ArrowUp, ArrowDown, ArrowUpRight, TrendingUp, ArrowDownFromLine, ArrowUpFromLine } from "lucide-react";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const data = [
    {
        name: "Yan",
        total: 2400,
    },
    {
        name: "Fev",
        total: 1398,
    },
    {
        name: "Mar",
        total: 9800,
    },
    {
        name: "Apr",
        total: 3908,
    },
    {
        name: "May",
        total: 4800,
    },
    {
        name: "Iyn",
        total: 3800,
    },
    {
        name: "Iyl",
        total: 4300,
    },
];
const employeeData = [
    {
        name: "Yan",
        active: 400,
        inactive: 240,
    },
    {
        name: "Fev",
        active: 300,
        inactive: 139,
    },
    {
        name: "Mar",
        active: 500,
        inactive: 980,
    },
    {
        name: "Apr",
        active: 390,
        inactive: 480,
    },
    {
        name: "May",
        active: 480,
        inactive: 380,
    },
    {
        name: "Iyn",
        active: 380,
        inactive: 430,
    },
];
const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 190, fill: "var(--color-other)" },
];
const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "hsl(var(--chart-1))",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
    firefox: {
        label: "Firefox",
        color: "hsl(var(--chart-3))",
    },
    edge: {
        label: "Edge",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
};
const chartDataArea = [
    { date: "2024-04-01", desktop: 222, mobile: 150 },
    { date: "2024-04-02", desktop: 97, mobile: 180 },
    { date: "2024-04-03", desktop: 167, mobile: 120 },
    { date: "2024-04-04", desktop: 242, mobile: 260 },
    { date: "2024-04-05", desktop: 373, mobile: 290 },
    { date: "2024-04-06", desktop: 301, mobile: 340 },
    { date: "2024-04-07", desktop: 245, mobile: 180 },
    { date: "2024-04-08", desktop: 409, mobile: 320 },
    { date: "2024-04-09", desktop: 59, mobile: 110 },
    { date: "2024-04-10", desktop: 261, mobile: 190 },
    { date: "2024-04-11", desktop: 327, mobile: 350 },
    { date: "2024-04-12", desktop: 292, mobile: 210 },
    { date: "2024-04-13", desktop: 342, mobile: 380 },
    { date: "2024-04-14", desktop: 137, mobile: 220 },
    { date: "2024-04-15", desktop: 120, mobile: 170 },
    { date: "2024-04-16", desktop: 138, mobile: 190 },
    { date: "2024-04-17", desktop: 446, mobile: 360 },
    { date: "2024-04-18", desktop: 364, mobile: 410 },
    { date: "2024-04-19", desktop: 243, mobile: 180 },
    { date: "2024-04-20", desktop: 89, mobile: 150 },
    { date: "2024-04-21", desktop: 137, mobile: 200 },
    { date: "2024-04-22", desktop: 224, mobile: 170 },
    { date: "2024-04-23", desktop: 138, mobile: 230 },
    { date: "2024-04-24", desktop: 387, mobile: 290 },
    { date: "2024-04-25", desktop: 215, mobile: 250 },
    { date: "2024-04-26", desktop: 75, mobile: 130 },
    { date: "2024-04-27", desktop: 383, mobile: 420 },
    { date: "2024-04-28", desktop: 122, mobile: 180 },
    { date: "2024-04-29", desktop: 315, mobile: 240 },
    { date: "2024-04-30", desktop: 454, mobile: 380 },
    { date: "2024-05-01", desktop: 165, mobile: 220 },
    { date: "2024-05-02", desktop: 293, mobile: 310 },
    { date: "2024-05-03", desktop: 247, mobile: 190 },
    { date: "2024-05-04", desktop: 385, mobile: 420 },
    { date: "2024-05-05", desktop: 481, mobile: 390 },
    { date: "2024-05-06", desktop: 498, mobile: 520 },
    { date: "2024-05-07", desktop: 388, mobile: 300 },
    { date: "2024-05-08", desktop: 149, mobile: 210 },
    { date: "2024-05-09", desktop: 227, mobile: 180 },
    { date: "2024-05-10", desktop: 293, mobile: 330 },
    { date: "2024-05-11", desktop: 335, mobile: 270 },
    { date: "2024-05-12", desktop: 197, mobile: 240 },
    { date: "2024-05-13", desktop: 197, mobile: 160 },
    { date: "2024-05-14", desktop: 448, mobile: 490 },
    { date: "2024-05-15", desktop: 473, mobile: 380 },
    { date: "2024-05-16", desktop: 338, mobile: 400 },
    { date: "2024-05-17", desktop: 499, mobile: 420 },
    { date: "2024-05-18", desktop: 315, mobile: 350 },
    { date: "2024-05-19", desktop: 235, mobile: 180 },
    { date: "2024-05-20", desktop: 177, mobile: 230 },
    { date: "2024-05-21", desktop: 82, mobile: 140 },
    { date: "2024-05-22", desktop: 81, mobile: 120 },
    { date: "2024-05-23", desktop: 252, mobile: 290 },
    { date: "2024-05-24", desktop: 294, mobile: 220 },
    { date: "2024-05-25", desktop: 201, mobile: 250 },
    { date: "2024-05-26", desktop: 213, mobile: 170 },
    { date: "2024-05-27", desktop: 420, mobile: 460 },
    { date: "2024-05-28", desktop: 233, mobile: 190 },
    { date: "2024-05-29", desktop: 78, mobile: 130 },
    { date: "2024-05-30", desktop: 340, mobile: 280 },
    { date: "2024-05-31", desktop: 178, mobile: 230 },
    { date: "2024-06-01", desktop: 178, mobile: 200 },
    { date: "2024-06-02", desktop: 470, mobile: 410 },
    { date: "2024-06-03", desktop: 103, mobile: 160 },
    { date: "2024-06-04", desktop: 439, mobile: 380 },
    { date: "2024-06-05", desktop: 88, mobile: 140 },
    { date: "2024-06-06", desktop: 294, mobile: 250 },
    { date: "2024-06-07", desktop: 323, mobile: 370 },
    { date: "2024-06-08", desktop: 385, mobile: 320 },
    { date: "2024-06-09", desktop: 438, mobile: 480 },
    { date: "2024-06-10", desktop: 155, mobile: 200 },
    { date: "2024-06-11", desktop: 92, mobile: 150 },
    { date: "2024-06-12", desktop: 492, mobile: 420 },
    { date: "2024-06-13", desktop: 81, mobile: 130 },
    { date: "2024-06-14", desktop: 426, mobile: 380 },
    { date: "2024-06-15", desktop: 307, mobile: 350 },
    { date: "2024-06-16", desktop: 371, mobile: 310 },
    { date: "2024-06-17", desktop: 475, mobile: 520 },
    { date: "2024-06-18", desktop: 107, mobile: 170 },
    { date: "2024-06-19", desktop: 341, mobile: 290 },
    { date: "2024-06-20", desktop: 408, mobile: 450 },
    { date: "2024-06-21", desktop: 169, mobile: 210 },
    { date: "2024-06-22", desktop: 317, mobile: 270 },
    { date: "2024-06-23", desktop: 480, mobile: 530 },
    { date: "2024-06-24", desktop: 132, mobile: 180 },
    { date: "2024-06-25", desktop: 141, mobile: 190 },
    { date: "2024-06-26", desktop: 434, mobile: 380 },
    { date: "2024-06-27", desktop: 448, mobile: 490 },
    { date: "2024-06-28", desktop: 149, mobile: 200 },
    { date: "2024-06-29", desktop: 103, mobile: 160 },
    { date: "2024-06-30", desktop: 446, mobile: 400 },
];
const chartConfigArea = {
    visitors: {
        label: "Visitors",
    },
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
};
const chartDataRadar = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
];
const chartConfigRadar = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
        icon: ArrowDownFromLine,
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
        icon: ArrowUpFromLine,
    },
};
export default function Dashboard() {
    const totalVisitors = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
    }, []);
    const [timeRange, setTimeRange] = useState("90d");
    const filteredData = chartDataArea.filter((item) => {
        const date = new Date(item.date);
        const referenceDate = new Date("2024-06-30");
        let daysToSubtract = 90;
        if (timeRange === "30d") {
            daysToSubtract = 30;
        }
        else if (timeRange === "7d") {
            daysToSubtract = 7;
        }
        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
    });
    return (_jsxs("div", { className: "flex-1 space-y-4 p-4 md:p-8 pt-6", children: [_jsx("div", { className: "flex items-center justify-between space-y-2", children: _jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Bosh sahifa" }) }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Jami daromad" }), _jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "45,231,890 so'm" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsxs("span", { className: "text-green-500 inline-flex items-center", children: [_jsx(ArrowUp, { className: "h-4 w-4 mr-1" }), "+20.1%"] }), " ", "o'tgan oyga nisbatan"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Faol xodimlar" }), _jsx(Users, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "+573" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsxs("span", { className: "text-green-500 inline-flex items-center", children: [_jsx(ArrowUpRight, { className: "h-4 w-4 mr-1" }), "+201"] }), " ", "so'ngi bir soatda"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Bajarilgan topshiriqlar" }), _jsx(Activity, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "12,234" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsxs("span", { className: "text-green-500 inline-flex items-center", children: [_jsx(ArrowUp, { className: "h-4 w-4 mr-1" }), "+19%"] }), " ", "o'tgan oyga nisbatan"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Ish haqi to'lovlari" }), _jsx(CreditCard, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: "23,500,000 so'm" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsxs("span", { className: "text-red-500 inline-flex items-center", children: [_jsx(ArrowDown, { className: "h-4 w-4 mr-1" }), "-4%"] }), " ", "o'tgan oyga nisbatan"] })] })] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-7", children: [_jsxs(Card, { className: "col-span-4", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Oylik ko'rsatkichlar" }) }), _jsx(CardContent, { className: "pl-2", children: _jsx(ResponsiveContainer, { width: "100%", height: 350, children: _jsxs(BarChart, { data: data, children: [_jsx(XAxis, { dataKey: "name", stroke: "#888888", fontSize: 12, tickLine: false, axisLine: false }), _jsx(YAxis, { stroke: "#888888", fontSize: 12, tickLine: false, axisLine: false, tickFormatter: (value) => `${value}M` }), _jsx(Bar, { dataKey: "total", fill: "currentColor", radius: [4, 4, 0, 0], className: "fill-primary" })] }) }) })] }), _jsxs(Card, { className: "col-span-3", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Xodimlar statistikasi" }), _jsx(CardDescription, { children: "Faol va nofaol xodimlar soni" })] }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 350, children: _jsxs(LineChart, { data: employeeData, children: [_jsx(XAxis, { dataKey: "name", stroke: "#888888", fontSize: 12, tickLine: false, axisLine: false }), _jsx(YAxis, { stroke: "#888888", fontSize: 12, tickLine: false, axisLine: false }), _jsx(Line, { type: "monotone", dataKey: "active", stroke: "#8884d8", strokeWidth: 2, name: "Faol" }), _jsx(Line, { type: "monotone", dataKey: "inactive", stroke: "#82ca9d", strokeWidth: 2, name: "Nofaol" })] }) }) })] })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-8", children: [_jsxs(Card, { className: "col-span-4", children: [_jsxs(CardHeader, { className: "items-center pb-0", children: [_jsx(CardTitle, { children: "Pie Chart - Donut with Text" }), _jsx(CardDescription, { children: "January - June 2024" })] }), _jsx(CardContent, { className: "flex-1 pb-0", children: _jsx(ChartContainer, { config: chartConfig, className: "mx-auto aspect-square max-h-[250px]", children: _jsxs(PieChart, { children: [_jsx(ChartTooltipContent, { cursor: false }), _jsx(Pie, { data: chartData, dataKey: "visitors", nameKey: "browser", innerRadius: 60, strokeWidth: 5, children: _jsx(Label, { content: ({ viewBox }) => {
                                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                            return (_jsxs("text", { x: viewBox.cx, y: viewBox.cy, textAnchor: "middle", dominantBaseline: "middle", children: [_jsx("tspan", { x: viewBox.cx, y: viewBox.cy, className: "fill-foreground text-3xl font-bold", children: totalVisitors.toLocaleString() }), _jsx("tspan", { x: viewBox.cx, y: (viewBox.cy || 0) + 24, className: "fill-muted-foreground", children: "Visitors" })] }));
                                                        }
                                                    } }) })] }) }) }), _jsxs(CardFooter, { className: "flex-col gap-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2 font-medium leading-none", children: ["Trending up by 5.2% this month ", _jsx(TrendingUp, { className: "h-4 w-4" })] }), _jsx("div", { className: "leading-none text-muted-foreground", children: "Showing total visitors for the last 6 months" })] })] }), _jsxs(Card, { className: "col-span-4", children: [_jsxs(CardHeader, { className: "items-center pb-4", children: [_jsx(CardTitle, { children: "Radar Chart - Icons" }), _jsx(CardDescription, { children: "Showing total visitors for the last 6 months" })] }), _jsx(CardContent, { children: _jsx(ChartContainer, { config: chartConfigRadar, className: "mx-auto aspect-square max-h-[250px]", children: _jsxs(RadarChart, { data: chartDataRadar, margin: { top: -40, bottom: -10 }, children: [_jsx(ChartTooltip, { cursor: false, content: _jsx(ChartTooltipContent, { indicator: "line" }) }), _jsx(PolarAngleAxis, { dataKey: "month" }), _jsx(PolarGrid, {}), _jsx(Radar, { dataKey: "desktop", fill: "var(--color-desktop)", fillOpacity: 0.6 }), _jsx(Radar, { dataKey: "mobile", fill: "var(--color-mobile)" }), _jsx(ChartLegend, { className: "mt-8", content: _jsx(ChartLegendContent, {}) })] }) }) }), _jsxs(CardFooter, { className: "flex-col gap-2 pt-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2 font-medium leading-none", children: ["Trending up by 5.2% this month ", _jsx(TrendingUp, { className: "h-4 w-4" })] }), _jsx("div", { className: "flex items-center gap-2 leading-none text-muted-foreground", children: "January - June 2024" })] })] })] }), _jsx("div", { children: _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row", children: [_jsxs("div", { className: "grid flex-1 gap-1 text-center sm:text-left", children: [_jsx(CardTitle, { children: "Area Chart - Interactive" }), _jsx(CardDescription, { children: "Showing total visitors for the last 3 months" })] }), _jsxs(Select, { value: timeRange, onValueChange: setTimeRange, children: [_jsx(SelectTrigger, { className: "w-[160px] rounded-lg sm:ml-auto", "aria-label": "Select a value", children: _jsx(SelectValue, { placeholder: "Last 3 months" }) }), _jsxs(SelectContent, { className: "rounded-xl", children: [_jsx(SelectItem, { value: "90d", className: "rounded-lg", children: "Last 3 months" }), _jsx(SelectItem, { value: "30d", className: "rounded-lg", children: "Last 30 days" }), _jsx(SelectItem, { value: "7d", className: "rounded-lg", children: "Last 7 days" })] })] })] }), _jsx(CardContent, { className: "px-2 pt-4 sm:px-6 sm:pt-6", children: _jsx(ChartContainer, { config: chartConfigArea, className: "aspect-auto h-[250px] w-full", children: _jsxs(AreaChart, { data: filteredData, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "fillDesktop", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "var(--color-desktop)", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: "var(--color-desktop)", stopOpacity: 0.1 })] }), _jsxs("linearGradient", { id: "fillMobile", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "var(--color-mobile)", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: "var(--color-mobile)", stopOpacity: 0.1 })] })] }), _jsx(CartesianGrid, { vertical: false }), _jsx(XAxis, { dataKey: "date", tickLine: false, axisLine: false, tickMargin: 8, minTickGap: 32, tickFormatter: (value) => {
                                                const date = new Date(value);
                                                return date.toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                });
                                            } }), _jsx(ChartTooltip, { cursor: false, content: _jsx(ChartTooltipContent, { labelFormatter: (value) => {
                                                    return new Date(value).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    });
                                                }, indicator: "dot" }) }), _jsx(Area, { dataKey: "mobile", type: "natural", fill: "url(#fillMobile)", stroke: "var(--color-mobile)", stackId: "a" }), _jsx(Area, { dataKey: "desktop", type: "natural", fill: "url(#fillDesktop)", stroke: "var(--color-desktop)", stackId: "a" }), _jsx(ChartLegend, { content: _jsx(ChartLegendContent, {}) })] }) }) })] }) })] }));
}
