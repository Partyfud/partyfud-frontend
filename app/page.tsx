'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Occasions from '@/components/home/Occasions';
import Package from '@/components/home/Package';
import EventTypes from '@/components/home/EventTypes';
import WhyChoose from '@/components/home/WhyChoose';
import Caterers from '@/components/home/Caterers';
import Categories from '@/components/home/Categories';
import Partner from '@/components/home/Partner';
import Testimonials from '@/components/home/Testimonials';
import HowItWorks from '@/components/home/HowItWorks';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect caterers and admins to their respective dashboards
  useEffect(() => {
    if (!loading && user) {
      if (user.type === 'CATERER') {
        router.replace('/caterer/dashboard');
      } else if (user.type === 'ADMIN') {
        router.replace('/admin/dashboard');
      }
      // Users stay on the landing page
    }
  }, [user, loading, router]);

  // Show loading only for caterers/admins being redirected
  if (loading || (user && (user.type === 'CATERER' || user.type === 'ADMIN'))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#268700]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Occasions />
        <Package />
        <EventTypes />
        <WhyChoose />
        <Caterers />
        <Categories />
        <Partner />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
