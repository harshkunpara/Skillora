import { Link } from "react-router-dom";
import { ArrowRight, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CourseCard from "@/components/CourseCard";
import { courses, categories, testimonials } from "@/data/courses";

const Index = () => {
  const featuredCourses = courses.filter((c) => c.featured);
  const trendingCourses = courses.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Categories */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Explore Categories</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Choose from thousands of courses across the most in-demand topics.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/courses?category=${encodeURIComponent(cat.name)}`}
              className="glass-card rounded-xl p-5 text-center card-hover group cursor-pointer"
            >
              <span className="text-3xl mb-3 block">{cat.icon}</span>
              <h3 className="font-semibold text-card-foreground text-sm mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-xs text-muted-foreground">{cat.count.toLocaleString()} courses</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Courses */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Trending Courses</h2>
              <p className="text-muted-foreground">Learn from the best. These courses are loved by millions.</p>
            </div>
            <Link to="/courses">
              <Button variant="ghost" className="hidden md:flex items-center gap-1 text-primary">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Featured Courses</h2>
          <p className="text-muted-foreground">Hand-picked by our team for exceptional quality.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">What Learners Say</h2>
            <p className="text-muted-foreground">Join thousands of successful graduates.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card rounded-xl p-6 card-hover border border-border/50">
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-card-foreground mb-4 leading-relaxed text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-card-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Simple Pricing</h2>
          <p className="text-muted-foreground">Unlimited access to all courses. Cancel anytime.</p>
        </div>
        <div className="grid md:grid-cols-2 max-w-3xl mx-auto gap-6">
          {[
            { plan: "Monthly", price: "$29", period: "/month", features: ["Unlimited courses", "Certificates", "Offline downloads", "Community access"] },
            { plan: "Yearly", price: "$199", period: "/year", features: ["Everything in Monthly", "Priority support", "AI learning paths", "Exclusive workshops"], popular: true },
          ].map((p) => (
            <div
              key={p.plan}
              className={`rounded-xl p-8 border ${
                p.popular
                  ? "hero-gradient text-primary-foreground border-transparent shadow-xl scale-105"
                  : "bg-card text-card-foreground border-border/50 card-hover"
              }`}
            >
              {p.popular && <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Most Popular</span>}
              <h3 className="text-2xl font-bold mt-2 mb-1">{p.plan}</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">{p.price}</span>
                <span className="opacity-70">{p.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full rounded-full py-5 ${
                  p.popular
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    : ""
                }`}
                variant={p.popular ? "ghost" : "default"}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="hero-gradient rounded-2xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Join millions of learners and start your journey today. Your future self will thank you.
            </p>
            <Link to="/signup">
              <Button size="lg" className="rounded-full px-10 py-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold text-base">
                Get Started for Free <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
