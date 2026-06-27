import { useState, useEffect, useRef } from "react";
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
import { courseModules } from "@/data/courseModules";

import { FileCheck } from "lucide-react";
import jsPDF from "jspdf";
import logo from "@/assest/skillora-logo.png";

const CourseDetail = () => {
  const { id } = useParams();
  const modules = courseModules[Number(id)] || [];

  const [currentLesson, setCurrentLesson] = useState(
    modules[0]?.lessons[0] || null
  );
  const videoRef = useRef<HTMLDivElement>(null);
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

  const markCourseComplete = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("progress")
      .upsert({
        user_id: user.id,
        course_id: id!,
        progress: 100,
        completed: true,
      });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Course Completed 🎉");
    }
  };

  const downloadCertificate = () => {
    const pdf = new jsPDF("landscape");
    pdf.addImage(logo, "PNG", 120, 10, 40, 40);
    pdf.setDrawColor(212, 175, 55);
    pdf.setLineWidth(2);
    pdf.rect(10, 10, 277, 190);

    pdf.setTextColor(37, 99, 235);

    pdf.setFontSize(30);
    pdf.text(
      "CERTIFICATE OF COMPLETION",
      148,
      55,
      { align: "center" }
    );
    pdf.setTextColor(0, 0, 0);

    pdf.setFontSize(26);
    pdf.text(
      "This is to certify that",
      148,
      70,
      { align: "center" }
    );

    pdf.setFontSize(28);
    pdf.text(
      user?.user_metadata?.full_name || "Student",
      148,
      95,
      { align: "center" }
    );

    pdf.setFontSize(18);

    pdf.text(
      "For outstanding dedication and successful completion of",
      148,
      120,
      { align: "center" }
    );

    pdf.setFontSize(24);
    pdf.text(
      course?.title || "",
      148,
      145,
      { align: "center" }
    );
    pdf.setFontSize(12);

    pdf.text(
      "Awarded for successfully completing all course requirements",
      148,
      158,
      { align: "center" }
    );

    pdf.text(
      "and demonstrating practical proficiency in the subject matter.",
      148,
      166,
      { align: "center" }
    );

    pdf.setTextColor(0, 0, 0);
    const certificateId =
      "SKL-" + Math.floor(100000 + Math.random() * 900000);

    pdf.setFontSize(12);

    // Left Side
    pdf.text(
      `Certificate ID: ${certificateId}`,
      40,
      145
    );

    // Right Side
    pdf.text(
      `Date: ${new Date().toLocaleDateString()}`,
      220,
      145
    );
    pdf.line(110, 170, 180, 170);

    pdf.setFontSize(14);

    pdf.text(
      "Harsh Patel",
      148,
      178,
      { align: "center" }
    );

    pdf.setFontSize(11);

    pdf.text(
      "Founder & CEO, Skillora",
      148,
      185,
      { align: "center" }
    );
    pdf.setFontSize(10);

    pdf.text(
      "Powered by Skillora Learning Platform",
      220,
      185
    );
    pdf.save(`${course?.title}-certificate.pdf`);
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
                  <span className="text-3xl font-extrabold text-foreground">₹{course.price}</span>
                  <span className="text-lg text-muted-foreground line-through">₹{course.originalPrice}</span>
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
                  <Button
  className="w-full mb-3 py-5 rounded-lg font-semibold text-base"
  onClick={() => navigate(`/checkout/${course.id}`)}
>
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
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Course Syllabus
            </h2>

            <div className="space-y-4">
              {modules.map((module, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  {/* Module Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                        {i + 1}
                      </span>

                      <div>
                        <h3 className="font-semibold text-lg">
                          {module.title}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {module.lessons.length} lessons
                        </p>
                      </div>
                    </div>

                    <Play
                      className="w-5 h-5 text-primary cursor-pointer"
                      onClick={() => {
                        setCurrentLesson(module.lessons[0]);

                        setTimeout(() => {
                          videoRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }, 100);
                      }}
                    />
                  </div>

                  {/* Lessons */}
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          console.log(lesson);

                          setCurrentLesson(lesson);

                          setTimeout(() => {
                            videoRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }, 100);
                        }}
                        className={`w-full text-left rounded-lg border p-3 transition ${
                          currentLesson?.id === lesson.id
                            ? "bg-primary text-white"
                            : "bg-background hover:bg-muted"
                        }`}
                      >
                        <div className="font-medium">
                          {lesson.title}
                        </div>

                        <div className="text-sm opacity-70">
                          {lesson.duration}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {id === "16" && isEnrolled && (
            <section ref={videoRef} className="mb-12"> {/* FIXED: Added ref={videoRef} here */}
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Full Course Video
              </h2>

              <div className="w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={currentLesson.video}
                  title={currentLesson.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>

              <h2 className="text-2xl font-bold mt-4">
                {currentLesson.title}
              </h2>

              <p className="text-muted-foreground">
                Duration: {currentLesson.duration}
              </p>
              <div className="mt-6 flex gap-4">
                <Button onClick={markCourseComplete}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Course
                </Button>

                <Button
                  variant="outline"
                  onClick={downloadCertificate}
                  disabled={!isEnrolled}
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
              </div>
            </section>
          )}

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