"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1612817288484-6f916006741a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=90"
          alt="About AuraClear"
          fill
          className="object-cover scale-105 hover:scale-100 transition-transform duration-7000"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center text-white max-w-3xl px-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              เรื่องราวของเรา
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              สร้างสรรค์ผลิตภัณฑ์ความงามระดับพรีเมียมด้วยความใส่ใจ คุณภาพ และความยั่งยืนตั้งแต่ปี 2015
            </p>
          </div>
        </motion.div>
      </div>

      {/* Mission Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              พันธกิจของเรา
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              ที่ AuraClear เราเชื่อว่าผลิตภัณฑ์ความงามควรเสริมความงามตามธรรมชาติของคุณ ไม่ใช่การปกปิด
              พันธกิจของเราคือการสร้างเครื่องสำอางที่มีประสิทธิภาพและมีคุณภาพสูง ซึ่งเฉลิมฉลองความเป็นเอกลักษณ์
              ในขณะเดียวกันก็เป็นมิตรกับโลกของเรา
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            <motion.div variants={fadeIn} className="text-center group">
              <div className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-950/30 dark:to-pink-900/20 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:shadow-pink-200/50 dark:group-hover:shadow-pink-800/30 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-500 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">คุณภาพ</h3>
              <p className="text-muted-foreground">
                เราคัดสรรส่วนผสมที่ดีที่สุดและรักษามาตรฐานคุณภาพที่เข้มงวดสำหรับผลิตภัณฑ์ทั้งหมดของเรา
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center group">
              <div className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-950/30 dark:to-pink-900/20 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:shadow-pink-200/50 dark:group-hover:shadow-pink-800/30 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-500 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">ความยั่งยืน</h3>
              <p className="text-muted-foreground">
                ความมุ่งมั่นของเราต่อแนวทางปฏิบัติที่เป็นมิตรต่อสิ่งแวดล้อมครอบคลุมตั้งแต่การจัดหาส่วนผสมไปจนถึงบรรจุภัณฑ์
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center group">
              <div className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-950/30 dark:to-pink-900/20 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:shadow-pink-200/50 dark:group-hover:shadow-pink-800/30 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-500 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">ความหลากหลาย</h3>
              <p className="text-muted-foreground">
                เราสร้างผลิตภัณฑ์สำหรับทุกประเภทผิว โทนสี และความชื่นชอบเรื่องความงาม เพื่อเฉลิมฉลองความหลากหลาย
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                จุดเริ่มต้นของเรา
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                AuraClear ก่อตั้งขึ้นในปี 2015 โดย เอมม่า เฉิน นักเคมีเครื่องสำอางที่มีความหลงใหลในการสร้างสรรค์
                ผลิตภัณฑ์ความงามที่สะอาดและมีประสิทธิภาพ หลังจากทำงานในอุตสาหกรรมนี้มาหลายปี เอมม่าสังเกตเห็นช่องว่าง
                ในตลาดสำหรับเครื่องสำอางระดับพรีเมียมที่ไม่ลดคุณภาพของส่วนผสม
              </p>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                สิ่งที่เริ่มต้นเป็นการดำเนินงานเล็กๆ ในห้องครัวของเอมม่า ได้เติบโตเป็นแบรนด์ที่เป็นที่รักด้วยการมีอยู่ทั่วโลก
                แม้จะเติบโตขึ้น เรายังคงยึดมั่นในหลักการก่อตั้งของเรา: คุณภาพพิเศษ
                แนวทางปฏิบัติที่ยั่งยืน และผลิตภัณฑ์ที่เสริมความงามตามธรรมชาติ
              </p>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                ปัจจุบัน AuraClear นำเสนอผลิตภัณฑ์ดูแลผิว เครื่องสำอาง ผลิตภัณฑ์ดูแลเส้นผม และผลิตภัณฑ์ดูแลร่างกาย
                ทั้งหมดพัฒนาด้วยความใส่ใจและความละเอียดเช่นเดียวกับสูตรแรกของเรา
              </p>
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 transition-all duration-300 shadow-md hover:shadow-pink-300/30 dark:hover:shadow-pink-800/30" asChild>
                <Link href="/product">สำรวจผลิตภัณฑ์ของเรา</Link>
              </Button>
            </motion.div>
            <motion.div 
              variants={fadeIn}
              className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl group"
            >
              <Image
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=90"
                alt="AuraClear founder"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-3000"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">เอมม่า เฉิน</h3>
                <p className="text-white/90">ผู้ก่อตั้ง &amp; CEO</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
          >
            ค่านิยมของเรา
          </motion.h2>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            <motion.div 
              variants={fadeIn}
              className="bg-gradient-to-br from-background to-muted/40 dark:from-card dark:to-background p-10 rounded-2xl shadow-xl hover:shadow-pink-100/30 dark:hover:shadow-pink-950/30 transition-all duration-500 border border-muted"
            >
              <div className="flex items-center mb-6">
                <div className="bg-pink-100 dark:bg-pink-950/30 h-16 w-16 rounded-full flex items-center justify-center mr-4 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold">ปราศจากการทดลองกับสัตว์</h3>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                เราไม่เคยทดสอบกับสัตว์และทำงานเฉพาะกับซัพพลายเออร์ที่มีความมุ่งมั่นเช่นเดียวกัน
                ผลิตภัณฑ์ทั้งหมดของเราได้รับการรับรองว่าปราศจากการทดลองกับสัตว์โดย Leaping Bunny
                และผ่านการรับรองโดย PETA ในฐานะแบรนด์ที่ปราศจากความโหดร้าย
              </p>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="bg-gradient-to-br from-background to-muted/40 dark:from-card dark:to-background p-10 rounded-2xl shadow-xl hover:shadow-pink-100/30 dark:hover:shadow-pink-950/30 transition-all duration-500 border border-muted"
            >
              <div className="flex items-center mb-6">
                <div className="bg-pink-100 dark:bg-pink-950/30 h-16 w-16 rounded-full flex items-center justify-center mr-4 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold">ความยั่งยืนระดับโลก</h3>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                ห่วงโซ่อุปทานของเราถูกออกแบบมาเพื่อลดผลกระทบต่อสิ่งแวดล้อม โดยใช้บรรจุภัณฑ์ที่ย่อยสลายได้หรือรีไซเคิลได้
                เราบริจาค 1% ของรายได้ประจำปีให้กับองค์กรด้านสิ่งแวดล้อมทั่วโลก และมีเป้าหมายที่จะเป็นแบรนด์ที่ปล่อยคาร์บอนเป็นศูนย์ภายในปี 2030
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-24 bg-gradient-to-b from-muted/50 to-muted/10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">ร่วมเดินทางกับเรา</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              ค้นพบความแตกต่างของ AuraClear วันนี้และเข้าร่วมชุมชนที่มีความหลงใหลในความงามที่ยั่งยืนและมีจริยธรรม
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 transition-all duration-300 shadow-md hover:shadow-pink-300/30 dark:hover:shadow-pink-800/30" asChild>
                <Link href="/product">เลือกซื้อสินค้า</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-all duration-300" asChild>
                <Link href="/contact">ติดต่อเรา</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}