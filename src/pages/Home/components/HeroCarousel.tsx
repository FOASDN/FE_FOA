import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSlide {
    title: string;
    highlight: string;
    description: string;
    tag: string;
    image: string;
    bgGradient: string;
    highlightColor: string;
    link: string;
}

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const timeoutRef = useRef<number | null>(null);

    const heroSlides = [
        {
            title: "Đại tiệc",
            highlight: "Giảm giá 50%",
            description: "Trải nghiệm ẩm thực tuyệt vời ngay tại nhà. Giao hàng miễn phí cho đơn từ 100k.",
            tag: "Weekend Special",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=800&fit=crop",
            bgGradient: "from-black/90 via-black/40",
            highlightColor: "from-orange-400 to-yellow-400",
            link: "/vouchers"
        },
        {
            title: "Freeship",
            highlight: "0đ toàn quốc",
            description: "Miễn phí giao hàng cho mọi đơn hàng trong bán kính 5km. Nhanh chóng và tiện lợi.",
            tag: "Free Delivery",
            image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1600&h=800&fit=crop",
            bgGradient: "from-black/90 via-black/40",
            highlightColor: "from-blue-400 to-cyan-400",
            link: "/vouchers"
        },
        {
            title: "Pizza",
            highlight: "Mua 1 Tặng 1",
            description: "Khuyến mãi đặc biệt cho Pizza size L. Áp dụng từ 18h-20h hàng ngày.",
            tag: "BOGO Deal",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&h=800&fit=crop",
            bgGradient: "from-black/90 via-black/40",
            highlightColor: "from-green-400 to-emerald-400",
            link: "/menu?category=pizza"
        },
    ];

    useEffect(() => {
        if (currentSlide === heroSlides.length) {
            timeoutRef.current = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentSlide(0);
            }, 700);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentSlide, heroSlides.length]);

    useEffect(() => {
        if (!isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(true);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentSlide, isTransitioning]);

    const nextSlide = () => {
        if (currentSlide < heroSlides.length) {
            if (!isTransitioning) setIsTransitioning(true);
            setCurrentSlide((prev) => prev + 1);
        }
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
    };

    return (
        <section className="relative">
            <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/3] md:aspect-[21/8] shadow-2xl shadow-orange-900/10">
                {/* Slides Container */}
                <div
                    className={`flex h-full ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`} // Chỉ thêm class transition khi isTransitioning = true
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {heroSlides.map((slide, idx) => (
                        <SlideItem key={idx} slide={slide} />
                    ))}

                    {/* Duplicate first slide for seamless infinite loop */}
                    <SlideItem slide={heroSlides[0]} />
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute z-20 left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                >
                    <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute z-20 right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                >
                    <ChevronRight className="w-6 h-6 text-slate-900" />
                </button>

                {/* Navigation Dots */}
                <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {heroSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setIsTransitioning(true);
                                setCurrentSlide(idx);
                            }}
                            className={`h-2 rounded-full transition-all duration-300 ${(currentSlide === idx || (currentSlide === heroSlides.length && idx === 0))
                                ? 'w-8 bg-white'
                                : 'w-2 bg-white/50 hover:bg-white/70'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const SlideItem = ({ slide }: { slide: HeroSlide }) => (
    <div className="min-w-full h-full relative flex items-center group">
        <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} to-transparent`} />
        <div className="relative z-10 w-full max-w-2xl px-8 md:px-16 py-12 flex flex-col gap-6 items-start">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                <Flame className="w-3 h-3 fill-white" />
                {slide.tag}
            </div>
            <h1 className="text-white text-4xl md:text-6xl font-black leading-[1.1] tracking-tight drop-shadow-sm">
                {slide.title} <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.highlightColor}`}>
                    {slide.highlight}
                </span>
            </h1>
            <p className="text-gray-200 text-lg font-medium max-w-md leading-relaxed">
                {slide.description}
            </p>
            <div className="flex gap-4 mt-2">
                <Link to={slide.link}>
                    <Button className="bg-white text-slate-900 hover:bg-white/90 font-bold h-12 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                        Xem Ngay <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </Link>
            </div>
        </div>
    </div>
);

export default HeroCarousel;