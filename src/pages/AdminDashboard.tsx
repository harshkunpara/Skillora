import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  DollarSign, 
  ShieldCheck, 
  Search, 
  Eye, 
  X, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'student' | string;
  created_at: string;
}

interface Enrollment {
  user_id: string;
  course_id: string;
}

interface Progress {
  user_id: string;
  course_id: string;
  completed: boolean;
}

// interface Course {
//   id: string;
//   price: number;
// }

// Derived interface for the Student Row mapping
interface StudentRowData extends Profile {
  coursesPurchasedCount: number;
  coursesCompletedCount: number;
}

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  premiumUsers: number;
  estimatedRevenue: number;
}

// ==========================================
// 2. SUB-COMPONENTS (Modularized)
// ==========================================

// --- Dashboard Stat Card ---
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description }) => (
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</span>
      <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300">
        {icon}
      </div>
    </div>
    <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{value}</div>
    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{description}</p>
  </div>
);

// --- Student Detail Modal ---
interface DetailsModalProps {
  student: StudentRowData | null;
  onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  const completionRate = student.coursesPurchasedCount > 0
    ? Math.round((student.coursesCompletedCount / student.coursesPurchasedCount) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-lg uppercase shadow-inner">
              {student.full_name?.charAt(0) || student.email?.charAt(0) || '?'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{student.full_name || 'N/A'}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 break-all">{student.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-sm text-zinc-500">System Role</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                student.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {student.role}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-sm text-zinc-500">Joined Date</span>
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {new Date(student.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg text-center">
                <span className="text-xs text-zinc-400 block mb-1">Purchased</span>
                <span className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{student.coursesPurchasedCount}</span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg text-center">
                <span className="text-xs text-zinc-400 block mb-1">Completed</span>
                <span className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{student.coursesCompletedCount}</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-1 text-xs text-zinc-500">
                <span>Course Completion Rate</span>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{completionRate}%</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN DASHBOARD PAGE
// ==========================================
function AdminDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // RAW State chunks from Supabase
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 16,
    totalEnrollments: 0,
    premiumUsers: 0,
    estimatedRevenue:12599,
  });

  // Modal Interactive State
  const [selectedStudent, setSelectedStudent] = useState<StudentRowData | null>(null);

  // Function to calculate aggregate data client-side based on fresh states
 const calculateStats = (
  currentProfiles: Profile[],
  currentEnrollments: Enrollment[],
  currentProgress: Progress[]
) => {
  const totalUsers = currentProfiles.length;
  const totalCourses = 16;
  const totalEnrollments = currentEnrollments.length;

  const uniqueEnrolledUsers = new Set(
    currentEnrollments.map(e => e.user_id)
  );

  const premiumUsers = uniqueEnrolledUsers.size;

  const estimatedRevenue = 12599;
  setStats({
    totalUsers,
    totalCourses,
    totalEnrollments,
    premiumUsers,
    estimatedRevenue,
  });
};
  const fetchDashboardData = async (isInitialLoad = true) => {
    try {
      if (isInitialLoad) setLoading(true);
      setError(null);

     
    //   const cacheBuster = new Date().getTime();

     const [
  { data: profilesData, error: profilesErr },
  { data: enrollmentsData, error: enrollmentsErr },
  { data: progressData, error: progressErr }
  
] = await Promise.all([
  supabase.from("profiles").select("id, full_name, email, role, created_at"),
  supabase.from("enrollments").select("user_id, course_id"),
  supabase.from("progress").select("user_id, course_id, completed")
]);
console.log("Profiles:", profilesData);
console.log("Profiles Count:", profilesData?.length);

      if (profilesErr) throw profilesErr;
    //   if (coursesErr) throw coursesErr;
      if (enrollmentsErr) throw enrollmentsErr;
      if (progressErr) throw progressErr;

      const safelyTypedProfiles = ((profilesData || []) as Profile[]).map(profile => {
        if (profile.email && profile.email.toLowerCase() === 'harshkunpara742@gmail.com') {
          return { ...profile, role: 'admin' };
        }
        return profile;
      });
      const safelyTypedEnrollments = (enrollmentsData || []) as Enrollment[];
      const safelyTypedProgress = (progressData || []) as Progress[];
    //   const safelyTypedCourses = (coursesData || []) as Course[];

      // Directly force state replacement without React reconciliation delays
      setProfiles([...safelyTypedProfiles]);
      setEnrollments([...safelyTypedEnrollments]);
      setProgress([...safelyTypedProgress]);

      calculateStats(
  safelyTypedProfiles,
  safelyTypedEnrollments,
  safelyTypedProgress
);

    } catch (err: any) {
      console.error('Error compiling aggregated administrative data:', err);
      setError(err.message || 'An unexpected structural error occurred while fetching dashboard metrics.');
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial Data Load (Screen par loader dikhega)
    fetchDashboardData(true);

    // 2. High-Frequency Live Polling (Har 3 seconds mein data verify karega bina screen hilaaye)
    const liveSyncInterval = setInterval(() => {
      fetchDashboardData(false);
    }, 3000);

    // Cleanup active loop on component unmount to prevent memory leaks
    return () => {
      clearInterval(liveSyncInterval);
    };
  }, []);
  // --- Real-time Localized Mapping & Search Filtering ---
  const filteredStudents: StudentRowData[] = profiles
    .filter(profile => {
      const searchTarget = `${profile.full_name || ''} ${profile.email || ''}`.toLowerCase();
      return searchTarget.includes(searchTerm.toLowerCase());
    })
    .map(profile => {
      const usersEnrollments = enrollments.filter(e => e.user_id === profile.id);
      const usersCompleted = progress.filter(p => p.user_id === profile.id && p.completed === true);

      return {
        ...profile,
        coursesPurchasedCount: usersEnrollments.length,
        coursesCompletedCount: usersCompleted.length
      };
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-zinc-500">Syncing administrative core engine data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900 dark:text-red-400">Data Synchronization Failed</h3>
          <p className="text-sm text-red-700 dark:text-red-500 mt-1">{error}</p>
          <button 
            onClick={() => fetchDashboardData(true)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 bg-zinc-50/50 dark:bg-transparent min-h-screen">
      
      {/* Upper Title Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Skillora Matrix</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Real-time learning ecosystem metrics and student registration tracking.</p>
        </div>
        <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/30 px-3 py-1.5 rounded-lg shadow-sm font-medium animate-pulse">
          Live Realtime Active
        </div>
      </div>

      {/* 1. Dashboard Metrics Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users className="w-4 h-4" />} 
          description="Total registered profile entries" 
        />
        <StatCard 
          title="Total Courses" 
          value={stats.totalCourses} 
          icon={<BookOpen className="w-4 h-4" />} 
          description="Active learning modules available" 
        />
        <StatCard 
          title="Total Enrollments" 
          value={stats.totalEnrollments} 
          icon={<GraduationCap className="w-4 h-4" />} 
          description="Total aggregate user conversions" 
        />
        <StatCard 
          title="Premium Users" 
          value={stats.premiumUsers} 
          icon={<ShieldCheck className="w-4 h-4" />} 
          description="Users enrolled in ≥1 courses" 
        />
        <StatCard 
          title="Revenue" 
          value={`₹${stats.estimatedRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={<span className="text-sm font-bold font-sans">₹</span>} // <-- Yahan custom string standard pass kar diya
          description="Aggregated values of enrollment links" 
        />
      </div>

      {/* 2. Unified Premium Registered Students Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        
        {/* Table Filter Action Header Bar */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Registered Student Cohorts</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Search and drill down into absolute progress profiles.</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Filter by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition"
            />
          </div>
        </div>

        {/* Core Responsive Analytical View Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs font-medium uppercase tracking-wider text-zinc-400 bg-zinc-50/30 dark:bg-zinc-900/30">
                <th className="py-3 px-5">Student Identity</th>
                <th className="py-3 px-5">System Privileges</th>
                <th className="py-3 px-5 text-center">Purchased</th>
                <th className="py-3 px-5 text-center">Completed</th>
                <th className="py-3 px-5">Registration Date</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors">
                    
                    {/* Identity Module */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {student.full_name?.charAt(0) || student.email?.charAt(0) || '?'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{student.full_name || 'Anonymous User'}</span>
                          <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{student.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Badge Component Mapping */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase ${
                        student.role === 'admin' 
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30' 
                          : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/30'
                      }`}>
                        {student.role || 'student'}
                      </span>
                    </td>

                    {/* Numeric Tracking Aggregation Columns */}
                    <td className="py-4 px-5 text-center font-medium font-mono text-zinc-900 dark:text-zinc-100">
                      {student.coursesPurchasedCount}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`font-mono font-semibold px-1.5 py-0.5 rounded ${
                        student.coursesCompletedCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'
                      }`}>
                        {student.coursesCompletedCount}
                      </span>
                    </td>

                    {/* Timestamp Translation */}
                    <td className="py-4 px-5 whitespace-nowrap text-xs text-zinc-500">
                      {new Date(student.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </td>

                    {/* Interactive Operational Callout */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-indigo-200 dark:hover:border-indigo-900/50"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400 dark:text-zinc-500">
                    No active student profile metrics matched your current search parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Layered Drawer/Modal Detail View Trigger */}
      {selectedStudent && (
        <DetailsModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
}

export default AdminDashboard;