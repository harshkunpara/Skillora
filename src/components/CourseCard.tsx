import { Link } from "react-router-dom";
import { Star, Clock, BookOpen, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/data/courses";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Link to={`/courses/${course.id}`} className="group block">
      <div className="bg-card rounded-xl overflow-hidden card-hover border border-border/50">
        {/* Image */}
        <div className="relative overflow-hidden aspect-video">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {course.featured && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0 text-xs font-semibold">
              Featured
            </Badge>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="text-xs font-medium backdrop-blur-sm">
              {course.level}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1.5">
            {course.category}
          </p>
          <h3 className="font-semibold text-card-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm font-bold text-amber-500">{course.rating}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(course.rating) ? "fill-amber-400 text-amber-400" : "text-border"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({course.reviewCount.toLocaleString()})</span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.lessons} lessons</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{(course.students / 1000).toFixed(0)}k</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">${course.price}</span>
            <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
            <Badge variant="secondary" className="text-xs ml-auto">
              {Math.round((1 - course.price / course.originalPrice) * 100)}% off
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
