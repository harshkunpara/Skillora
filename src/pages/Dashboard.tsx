import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Clock, Award, TrendingUp, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { courses } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Enrollment {
  course_id: string;
  progress: number;
  enrolled_at: string;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("enrollments")
        .select("course_id, progress, enrolled_at")
        .eq("user_id", user.id)
        .order("enrolled_at", { ascending: false });
      setEnrollments(data ?? []);
      setLoading(false);
    };
    if (user) fetchEnrollments();
  }, [user]);

  const enrolledCourses = enrollments
    .map((e) => {
      const course = courses.find((c) => c.id === e.course_id);
      return course ? { course, progress: e.progress } : null;
    })
    .filter(Boolean) as { course: (typeof courses)[0]; progress: number }[];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
        <p className="text-muted-foreground mb-8">Track your learning progress and achievements.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: BookOpen, label: "Enrolled Courses", value: enrolledCourses.length.toString() },
            { icon: Clock, label: "Hours Learned", value: "0" },
            { icon: Award, label: "Certificates", value: "0" },
            { icon: TrendingUp, label: "Streak", value: "0 days" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border/50 rounded-xl p-5 card-hover">
              <s.icon className="w-8 h-8 text-primary mb-3" />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Enrolled Courses */}
        <h2 className="text-xl font-bold text-foreground mb-4">My Courses</h2>
        {enrolledCourses.length === 0 ? (
          <div className="bg-card border border-border/50 rounded-xl p-10 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
            <Link to="/courses">
              <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                Browse Courses
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrolledCourses.map(({ course, progress }) => (
              <Link key={course.id} to={`/courses/${course.id}`} className="block">
                <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col md:flex-row gap-5 card-hover">
                  <img src={course.image} alt={course.title} className="w-full md:w-48 h-28 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                    <div className="flex items-center gap-3">
                      <Progress value={progress} className="flex-1 h-2" />
                      <span className="text-sm font-semibold text-primary">{progress}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {progress >= 90 ? "Almost done! 🎉" : progress >= 50 ? "Great progress!" : "Keep going!"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
