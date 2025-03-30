import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'คะแนนสะสม - AuraClear',
  description: 'สะสมคะแนนและแลกรับของรางวัลพิเศษสำหรับลูกค้าคนพิเศษของเรา',
};

export default function PointsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen pt-20">
      {children}
    </main>
  );
} 