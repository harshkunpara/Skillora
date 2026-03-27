import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { courses, categories } from "@/data/courses";

const levels = ["All", "Beginner", "Intermediate", "Advanced"] as const;

const Courses = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === "All" || c.category === selectedCategory;
      const matchLevel = selectedLevel === "All" || c.level === selectedLevel;
      return matchSearch && matchCategory && matchLevel;
    });
  }, [search, selectedCategory, selectedLevel]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">Explore Courses</h1>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Discover thousands of courses taught by industry experts.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses, topics, instructors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-card text-foreground text-sm border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{filtered.length} courses found</p>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
            <SlidersHorizontal className="w-4 h-4 mr-1" /> Filters
          </Button>
        </div>

        <div className={`${showFilters ? "block" : "hidden"} md:block mb-8`}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">Category</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("All")}
                className="rounded-full text-xs"
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.name}
                  variant={selectedCategory === cat.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.name)}
                  className="rounded-full text-xs"
                >
                  {cat.icon} {cat.name}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Level</h3>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className="rounded-full text-xs"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl font-semibold text-foreground mb-2">No courses found</p>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
