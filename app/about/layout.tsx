import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา | AuraClear',
  description: 'เรียนรู้เรื่องราวของเรา พันธกิจ และความมุ่งมั่นในการผลิตเครื่องสำอางคุณภาพสูง',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
} 