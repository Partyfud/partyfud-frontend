'use client';
import { useEffect } from 'react';
import Plan from '../../../components/home/Plan';
import Hero from '../../../components/home/Hero';
import Occasions from '../../../components/home/Occasions';
import Package from '../../../components/home/Package';
import PackageTypes from '../../../components/home/PackageTypes';
import EventTypes from '../../../components/home/EventTypes';
import WhyChoose from '../../../components/home/WhyChoose';
import CallToAction from '../../../components/home/CallToAction';
import Caterers from '../../../components/home/Caterers';
import Categories from '../../../components/home/Categories';
import Partner from '../../../components/home/Partner';
import Testimonials from '../../../components/home/Testimonials';
import HowItWorks from '../../../components/home/HowItWorks';  

export default function Dashboard() {
    useEffect(() => {
        // Handle hash navigation on mount and when hash changes
        const handleHash = () => {
            if (window.location.hash === '#partner') {
                const partnerSection = document.getElementById('partner');
                if (partnerSection) {
                    setTimeout(() => {
                        partnerSection.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            }
        };

        handleHash();
        window.addEventListener('hashchange', handleHash);
        
        return () => {
            window.removeEventListener('hashchange', handleHash);
        };
    }, []);

    return (
        <>
        <Hero/>
        {/* <Plan/> */}
        <HowItWorks/>
        {/* <PackageTypes/> */}
        <Occasions/>
        <Package/>
        <EventTypes/>
        <WhyChoose/>
        {/* <CallToAction/> */}
        <Caterers/>
        <Categories/>
        <Partner/>
        <Testimonials/>
        </>
    );
}