import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Clock, BookOpen, Users, Play, CheckCircle, Award, ArrowLeft, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { courses } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CourseDetail = () => {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !id) { setCheckingEnrollment(false); return; }
      const { data } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", id)
        .maybeSingle();
      setIsEnrolled(!!data);
      setCheckingEnrollment(false);
    };
    checkEnrollment();
  }, [user, id]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please log in to enroll");
      navigate("/login");
      return;
    }
    setEnrolling(true);
    const { error } = await supabase
      .from("enrollments")
      .insert({ user_id: user.id, course_id: id! });
    setEnrolling(false);
    if (error) {
      if (error.code === "23505") {
        toast.info("You are already enrolled in this course");
        setIsEnrolled(true);
      } else {
        toast.error("Enrollment failed: " + error.message);
      }
    } else {
      setIsEnrolled(true);
      toast.success("Successfully enrolled! 🎉");
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course not found</h1>
          <Link to="/courses"><Button>Browse Courses</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const syllabus = [
    { title: "Getting Started", lessons: 8, duration: "1h 20m" },
    { title: "Core Fundamentals", lessons: 15, duration: "3h 45m" },
    { title: "Intermediate Concepts", lessons: 12, duration: "2h 50m" },
    { title: "Advanced Techniques", lessons: 18, duration: "4h 30m" },
    { title: "Real-World Projects", lessons: 10, duration: "5h 15m" },
    { title: "Final Assessment & Certificate", lessons: 5, duration: "1h 30m" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="hero-gradient py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link to="/courses" className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>
          <div className="grid md:grid-cols-5 gap-8 items-start">
            <div className="md:col-span-3">
              <Badge className="bg-primary-foreground/10 text-primary-foreground border-0 mb-3">{course.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 leading-tight">{course.title}</h1>
              <p className="text-primary-foreground/80 mb-6 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/80 mb-4">
                <span className="flex items-center gap-1 font-semibold text-amber-300">
                  {course.rating} <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                </span>
                <span>({course.reviewCount.toLocaleString()} reviews)</span>
                <span>{course.students.toLocaleString()} students</span>
              </div>
              <p className="text-primary-foreground/70 text-sm">Created by <span className="font-semibold text-primary-foreground">{course.instructor}</span></p>
            </div>

            {/* Sidebar Card */}
            <div className="md:col-span-2">
              <div className="bg-card rounded-xl p-6 shadow-xl border border-border/50">
                <div className="relative rounded-lg overflow-hidden mb-5 aspect-video group cursor-pointer">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center group-hover:bg-foreground/40 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-primary-foreground/90 flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 text-primary ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl font-extrabold text-foreground">${course.price}</span>
                  <span className="text-lg text-muted-foreground line-through">${course.originalPrice}</span>
                  <Badge variant="secondary">{Math.round((1 - course.price / course.originalPrice) * 100)}% off</Badge>
                </div>
                {checkingEnrollment ? (
                  <Button className="w-full mb-3 py-5 rounded-lg font-semibold text-base" disabled>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Checking...
                  </Button>
                ) : isEnrolled ? (
                  <Button className="w-full mb-3 py-5 rounded-lg font-semibold text-base bg-green-600 hover:bg-green-700" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" /> Enrolled
                  </Button>
                ) : (
                  <Button className="w-full mb-3 py-5 rounded-lg font-semibold text-base" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Enroll Now
                  </Button>
                )}
                <Button variant="outline" className="w-full py-5 rounded-lg">
                  <Heart className="w-4 h-4 mr-2" /> Add to Wishlist
                </Button>
                <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {course.duration} of content</div>
                  <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {course.lessons} lessons</div>
                  <div className="flex items-center gap-2"><Award className="w-4 h-4" /> Certificate of completion</div>
                  <div className="flex items-center gap-2"><Users className="w-4 h-4" /> {course.level} level</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">What you'll learn</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Build real-world projects from scratch",
                "Master core concepts and best practices",
                "Deploy applications to production",
                "Write clean, maintainable code",
                "Work with industry-standard tools",
                "Ace technical interviews with confidence",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Course Syllabus</h2>
            <div className="space-y-3">
              {syllabus.map((section, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-card-foreground text-sm">{section.title}</p>
                      <p className="text-xs text-muted-foreground">{section.lessons} lessons • {section.duration}</p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Topics</h2>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">{tag}</Badge>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;
