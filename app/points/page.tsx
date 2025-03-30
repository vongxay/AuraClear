"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  CircleDollarSign, 
  Gift, 
  TicketPercent, 
  History,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function PointsPage() {
  const [points, setPoints] = useState(250);
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock data for rewards
  const rewards = [
    { id: 1, name: "ส่วนลด ฿100", points: 200, type: "discount" },
    { id: 2, name: "ส่วนลด ฿300", points: 500, type: "discount" },
    { id: 3, name: "สินค้าแถมฟรี", points: 1000, type: "product" },
    { id: 4, name: "ส่วนลด 15%", points: 350, type: "percentage" },
  ];

  // Mock data for point history
  const history = [
    { id: 1, date: "15 เม.ย. 2023", description: "ซื้อสินค้า #A20134", points: 50, type: "earned" },
    { id: 2, date: "20 มี.ค. 2023", description: "แลกส่วนลด ฿100", points: 200, type: "redeemed" },
    { id: 3, date: "10 มี.ค. 2023", description: "ซื้อสินค้า #B45623", points: 150, type: "earned" },
    { id: 4, date: "5 ก.พ. 2023", description: "แลกสินค้าแถมฟรี", points: 1000, type: "redeemed" },
  ];

  return (
    <div className="container px-4 py-10 md:py-20">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">คะแนนสะสม</h1>
        <p className="text-muted-foreground">สะสมคะแนนและแลกรับของรางวัลพิเศษสำหรับลูกค้าคนพิเศษของเรา</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>คะแนนของคุณ</CardTitle>
            <CardDescription>คะแนนที่สะสมไว้ สามารถนำไปแลกของรางวัลได้</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{points}</div>
                <div className="text-muted-foreground">คะแนน</div>
              </div>
              <CircleDollarSign className="h-12 w-12 text-pink-500 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>ระดับสมาชิก</CardTitle>
            <CardDescription>สถานะสมาชิกปัจจุบันของคุณ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Classic</span>
                <span>Premium</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            <div className="text-sm text-muted-foreground">อีก 750 คะแนน เพื่อเลื่อนระดับเป็น Premium</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>รางวัลที่ได้รับ</CardTitle>
            <CardDescription>ของรางวัลที่คุณแลกไปแล้ว</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <div className="text-muted-foreground">รางวัล</div>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link href="#rewards" onClick={() => setSelectedTab("rewards")}>
                ดูรางวัลทั้งหมด <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
          <TabsTrigger value="rewards">รางวัล</TabsTrigger>
          <TabsTrigger value="history">ประวัติ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>วิธีสะสมคะแนน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <CircleDollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">ซื้อสินค้า</h3>
                      <p className="text-sm text-muted-foreground">รับ 1 คะแนนต่อทุกการใช้จ่าย ฿20</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <Gift className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">แนะนำเพื่อน</h3>
                      <p className="text-sm text-muted-foreground">รับ 50 คะแนนเมื่อเพื่อนซื้อสินค้าครั้งแรก</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <TicketPercent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">กิจกรรมพิเศษ</h3>
                      <p className="text-sm text-muted-foreground">รับคะแนนพิเศษจากกิจกรรมและแคมเปญต่างๆ</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>รางวัลยอดนิยม</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rewards.slice(0, 3).map((reward) => (
                    <div key={reward.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{reward.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {reward.points} คะแนน
                        </div>
                      </div>
                      <Button 
                        variant={points >= reward.points ? "default" : "outline"}
                        size="sm"
                        disabled={points < reward.points}
                      >
                        แลกรับ
                      </Button>
                    </div>
                  ))}
                  <Button variant="link" className="w-full" onClick={() => setSelectedTab("rewards")}>
                    ดูรางวัลทั้งหมด
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="rewards">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {rewards.map((reward) => (
              <Card key={reward.id}>
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    {reward.type === "discount" && <CircleDollarSign className="h-6 w-6 text-primary" />}
                    {reward.type === "product" && <Gift className="h-6 w-6 text-primary" />}
                    {reward.type === "percentage" && <TicketPercent className="h-6 w-6 text-primary" />}
                  </div>
                  <h3 className="font-medium text-lg mb-1">{reward.name}</h3>
                  <p className="text-muted-foreground mb-4">{reward.points} คะแนน</p>
                  <Button 
                    className="w-full"
                    variant={points >= reward.points ? "default" : "outline"}
                    disabled={points < reward.points}
                  >
                    {points >= reward.points ? "แลกรับตอนนี้" : `ต้องการอีก ${reward.points - points} คะแนน`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>ประวัติคะแนนของคุณ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {history.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
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
        </TabsContent>
      </Tabs>
    </div>
  );
} 