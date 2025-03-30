"use client";

import { CircleDollarSign, Gift, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PointsSummaryProps {
  points: number;
  rewardsRedeemed: number;
  level: {
    current: string;
    next: string;
    progress: number;
    pointsToNextLevel: number;
  };
}

export default function PointsSummary({ 
  points = 250, 
  rewardsRedeemed = 3,
  level = {
    current: 'Classic',
    next: 'Premium',
    progress: 30,
    pointsToNextLevel: 750
  }
}: PointsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle>คะแนนของคุณ</CardTitle>
          <CardDescription>คะแนนที่สะสมไว้สำหรับแลกของรางวัล</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{points}</div>
              <div className="text-muted-foreground">คะแนน</div>
            </div>
            <CircleDollarSign className="h-10 w-10 text-pink-500 opacity-75" />
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle>ระดับสมาชิก</CardTitle>
          <CardDescription>สถานะสมาชิกปัจจุบันของคุณ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>{level.current}</span>
              <span>{level.next}</span>
            </div>
            <Progress value={level.progress} className="h-2" />
          </div>
          <div className="text-sm text-muted-foreground">
            อีก {level.pointsToNextLevel} คะแนน เพื่อเลื่อนระดับเป็น {level.next}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle>รางวัลที่ได้รับ</CardTitle>
          <CardDescription>ของรางวัลที่คุณแลกไปแล้ว</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{rewardsRedeemed}</div>
          <div className="text-muted-foreground">รางวัล</div>
          <Button variant="link" className="p-0 h-auto mt-2" asChild>
            <Link href="/points?tab=rewards">
              ดูรางวัลทั้งหมด <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 