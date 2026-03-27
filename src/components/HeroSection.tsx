import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, BookOpen, Award } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-95" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/90 text-sm font-medium backdrop-blur-sm border border-primary-foreground/10 mb-6">
              New: AI-Powered Learning Paths
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground leading-tight mb-6 animate-fade-in-up-delay-1">
            Master New Skills.{" "}
            <span className="relative">
              Transform
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C30 2 70 2 100 6C130 10 170 4 198 8" stroke="hsla(0,0%,100%,0.4)" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>{" "}
            Your Future.
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay-2">
            Join over 1000+ learners. Access world-class courses from top instructors,
            earn certificates, and accelerate your career with Skillora.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-3">
            <Link to="/courses">
              <Button variant="hero-outline" size="lg" className="text-base px-8 py-6 rounded-full bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90">
                Explore Courses <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Button variant="hero-outline" size="lg" className="text-base px-8 py-6 rounded-full">
              <Play className="w-5 h-5 mr-1" /> Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto animate-fade-in-up-delay-3">
            {[
              { icon: Users, value: "1000+", label: "Learners" },
              { icon: BookOpen, value: "100+", label: "Courses" },
              { icon: Award, value: "500+", label: "Certificates" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-primary-foreground/60 mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-sm text-primary-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
