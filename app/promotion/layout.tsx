import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'โปรโมชั่น | AuraClear',
  description: 'ส่วนลดพิเศษและโปรโมชั่นสำหรับผลิตภัณฑ์ AuraClear',
};

export default function PromotionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
} 