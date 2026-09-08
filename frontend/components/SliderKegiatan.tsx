
import React, { useState, useCallback, useEffect } from 'react';
import { type Testimonial } from '../types';
import { TESTIMONIALS } from '../constants';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const SliderKegiatan: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const prevSlide = useCallback(() => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? TESTIMONIALS.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);

    const nextSlide = useCallback(() => {
        const isLastSlide = currentIndex === TESTIMONIALS.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    return (
        <div className="w-full max-w-4xl mx-auto relative group">
            <div className="overflow-hidden relative h-80 rounded-2xl">
                <div 
                    className="flex transition-transform ease-out duration-500 h-full"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {TESTIMONIALS.map((testimonial) => (
                        <div key={testimonial.name} className="min-w-full h-full flex items-center justify-center p-8 bg-neutral-100 rounded-2xl">
                            <div className="text-center">
                                <img src={testimonial.image} alt={testimonial.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"/>
                                <blockquote className="text-lg italic text-neutral-700 max-w-2xl mx-auto">
                                    "{testimonial.text}"
                                </blockquote>
                                <p className="font-bold font-heading text-primary mt-6">{testimonial.name}</p>
                                <p className="text-sm text-neutral-500">{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Left Arrow */}
            <button onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-5 transform p-2 bg-white/50 hover:bg-white rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100 duration-300">
                <ChevronLeftIcon className="h-6 w-6 text-primary" />
            </button>
            {/* Right Arrow */}
            <button onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-5 transform p-2 bg-white/50 hover:bg-white rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100 duration-300">
                <ChevronRightIcon className="h-6 w-6 text-primary" />
            </button>

            <div className="flex justify-center mt-4 space-x-2">
                {TESTIMONIALS.map((_, index) => (
                    <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-primary' : 'bg-neutral-300'}`}></button>
                ))}
            </div>
        </div>
    );
};

export default SliderKegiatan;
