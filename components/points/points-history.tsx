"use client";

import { History, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface PointsHistoryItem {
  id: number;
  date: string;
  description: string;
  points: number;
  type: 'earned' | 'redeemed';
  category?: string;
}

interface PointsHistoryProps {
  historyItems: PointsHistoryItem[];
}

export default function PointsHistory({
  historyItems = [
    { id: 1, date: "15 เม.ย. 2023", description: "ซื้อสินค้า #A20134", points: 50, type: "earned", category: "purchase" },
    { id: 2, date: "20 มี.ค. 2023", description: "แลกส่วนลด ฿100", points: 200, type: "redeemed", category: "reward" },
    { id: 3, date: "10 มี.ค. 2023", description: "ซื้อสินค้า #B45623", points: 150, type: "earned", category: "purchase" },
    { id: 4, date: "5 ก.พ. 2023", description: "แลกสินค้าแถมฟรี", points: 1000, type: "redeemed", category: "reward" },
    { id: 5, date: "1 ก.พ. 2023", description: "แนะนำเพื่อน", points: 50, type: "earned", category: "referral" },
    { id: 6, date: "15 ม.ค. 2023", description: "กิจกรรมพิเศษ", points: 100, type: "earned", category: "promotion" },
  ]
}: PointsHistoryProps) {
  // Calculate summary stats
  const totalEarned = historyItems
    .filter(item => item.type === 'earned')
    .reduce((sum, item) => sum + item.points, 0);
  
  const totalRedeemed = historyItems
    .filter(item => item.type === 'redeemed')
    .reduce((sum, item) => sum + item.points, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ประวัติคะแนนของคุณ</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              กรองข้อมูล
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>ทั้งหมด</DropdownMenuItem>
            <DropdownMenuItem>คะแนนที่ได้รับ</DropdownMenuItem>
            <DropdownMenuItem>คะแนนที่ใช้ไป</DropdownMenuItem>
            <DropdownMenuItem>3 เดือนล่าสุด</DropdownMenuItem>
            <DropdownMenuItem>6 เดือนล่าสุด</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">คะแนนที่ได้รับ</CardTitle>
            <CardDescription>คะแนนสะสมทั้งหมดที่คุณได้รับ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                +{totalEarned}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">คะแนนที่ใช้ไป</CardTitle>
            <CardDescription>คะแนนทั้งหมดที่คุณใช้แลกของรางวัล</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full mr-4">
                <TrendingDown className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                -{totalRedeemed}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
          <TabsTrigger value="earned">คะแนนที่ได้รับ</TabsTrigger>
          <TabsTrigger value="redeemed">คะแนนที่ใช้ไป</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <HistoryList items={historyItems} />
        </TabsContent>
        
        <TabsContent value="earned">
          <HistoryList items={historyItems.filter(item => item.type === 'earned')} />
        </TabsContent>
        
        <TabsContent value="redeemed">
          <HistoryList items={historyItems.filter(item => item.type === 'redeemed')} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HistoryList({ items }: { items: PointsHistoryItem[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">ไม่พบรายการประวัติคะแนน</p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start p-4">
              <div className="flex items-start">
                <div className={`p-2 mr-4 rounded-full ${
                  item.type === "earned" ? "bg-green-100 dark:bg-green-900" : "bg-orange-100 dark:bg-orange-900"
                }`}>
                  <History className={`h-5 w-5 ${
                    item.type === "earned" ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
                  }`} />
                </div>
                <div>
                  <div className="font-medium">{item.description}</div>
                  <div className="text-sm text-muted-foreground">{item.date}</div>
                  {item.category && (
                    <div className="text-xs mt-1">
                      <span className="bg-muted px-2 py-1 rounded-full">{getCategoryLabel(item.category)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className={`font-medium ${
                item.type === "earned" ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
              }`}>
                {item.type === "earned" ? "+" : "-"}{item.points} คะแนน
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getCategoryLabel(category: string): string {
  const categories: Record<string, string> = {
    purchase: "การซื้อสินค้า",
    reward: "แลกของรางวัล",
    referral: "แนะนำเพื่อน",
    promotion: "โปรโมชัน"
  };

  return categories[category] || category;
} 