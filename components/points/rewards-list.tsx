"use client";

import { useState } from 'react';
import { CircleDollarSign, Gift, TicketPercent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Reward {
  id: number;
  name: string;
  points: number;
  type: 'discount' | 'product' | 'percentage';
  description?: string;
}

interface RewardsListProps {
  rewards: Reward[];
  userPoints: number;
  onRedeem?: (rewardId: number) => void;
}

export default function RewardsList({
  rewards = [
    { id: 1, name: "ส่วนลด ฿100", points: 200, type: "discount", description: "ส่วนลด ฿100 สำหรับการซื้อสินค้า" },
    { id: 2, name: "ส่วนลด ฿300", points: 500, type: "discount", description: "ส่วนลด ฿300 สำหรับการซื้อสินค้า" },
    { id: 3, name: "สินค้าแถมฟรี", points: 1000, type: "product", description: "แลกรับสินค้าแถมฟรีมูลค่าไม่เกิน ฿500" },
    { id: 4, name: "ส่วนลด 15%", points: 350, type: "percentage", description: "ส่วนลด 15% สำหรับการซื้อสินค้ารวมไม่เกิน ฿2,000" },
  ],
  userPoints = 250,
  onRedeem = () => {}
}: RewardsListProps) {
  const [filter, setFilter] = useState("all");
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const filteredRewards = filter === "all" 
    ? rewards 
    : rewards.filter(reward => 
        filter === "available" 
          ? reward.points <= userPoints 
          : reward.points > userPoints
      );

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount':
        return <CircleDollarSign className="h-6 w-6 text-primary" />;
      case 'product':
        return <Gift className="h-6 w-6 text-primary" />;
      case 'percentage':
        return <TicketPercent className="h-6 w-6 text-primary" />;
      default:
        return <CircleDollarSign className="h-6 w-6 text-primary" />;
    }
  };

  const handleRedeem = () => {
    if (selectedReward) {
      onRedeem(selectedReward.id);
      setOpenDialog(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">รางวัลที่สามารถแลกได้</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="กรองรายการ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="available">พร้อมแลกรับ</SelectItem>
            <SelectItem value="unavailable">ยังแลกไม่ได้</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredRewards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">ไม่พบรางวัลที่ตรงกับเงื่อนไขที่คุณเลือก</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRewards.map((reward) => (
            <Card key={reward.id} className="overflow-hidden border-b-2 border-b-primary/20 hover:border-b-primary transition-colors">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  {getRewardIcon(reward.type)}
                </div>
                <h3 className="font-medium text-lg mb-1">{reward.name}</h3>
                <p className="text-muted-foreground mb-4">{reward.points} คะแนน</p>
                
                <Dialog open={openDialog && selectedReward?.id === reward.id} onOpenChange={(open) => {
                  setOpenDialog(open);
                  if (!open) setSelectedReward(null);
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full"
                      variant={userPoints >= reward.points ? "default" : "outline"}
                      disabled={userPoints < reward.points}
                      onClick={() => setSelectedReward(reward)}
                    >
                      {userPoints >= reward.points ? "แลกรับตอนนี้" : `ต้องการอีก ${reward.points - userPoints} คะแนน`}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>ยืนยันการแลกรางวัล</DialogTitle>
                      <DialogDescription>
                        คุณกำลังจะแลก {reward.name} ด้วย {reward.points} คะแนน
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {getRewardIcon(reward.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{reward.name}</h4>
                          <p className="text-sm text-muted-foreground">{reward.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">อีเมล</Label>
                          <Input id="email" placeholder="กรอกอีเมลของคุณ" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                          <Input id="phone" placeholder="กรอกเบอร์โทรศัพท์ของคุณ" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
                      <Button onClick={handleRedeem}>ยืนยันการแลกรางวัล</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 