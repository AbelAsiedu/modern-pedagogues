import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { 
  Clock,
  Users,
  Star,
  BookOpen,
  Play,
  ArrowRight
} from "lucide-react"

export const CoursesSection: React.FC = () => {
  const featuredCourses = [
    {
      id: 1,
      title: "Mathematics - IGCSE Foundation",
      description: "Master fundamental mathematical concepts with our comprehensive IGCSE Mathematics course designed for beginners.",
      curriculum: "IGCSE",
      level: "Foundation",
      price: 299,
      duration: 24,
      students: 1250,
      rating: 4.8,
      instructor: "Dr. Kwame Asante",
      thumbnail: "bg-gradient-to-br from-blue-400 to-blue-600",
      features: ["Interactive Videos", "Practice Tests", "Live Sessions"]
    },
    {
      id: 2,
      title: "English Language - GES Primary",
      description: "Build strong foundations in English language skills following the Ghana Education Service curriculum.",
      curriculum: "GES",
      level: "Primary",
      price: 199,
      duration: 18,
      students: 890,
      rating: 4.9,
      instructor: "Ms. Akosua Mensah",
      thumbnail: "bg-gradient-to-br from-green-400 to-green-600",
      features: ["Reading Comprehension", "Grammar", "Writing Skills"]
    },
    {
      id: 3,
      title: "Chemistry - Cambridge A-Level",
      description: "Advanced chemistry concepts for Cambridge A-Level students with practical laboratory sessions.",
      curriculum: "Cambridge",
      level: "A-Level",
      price: 449,
      duration: 36,
      students: 567,
      rating: 4.7,
      instructor: "Prof. Samuel Osei",
      thumbnail: "bg-gradient-to-br from-purple-400 to-purple-600",
      features: ["Lab Simulations", "Past Papers", "Exam Preparation"]
    },
    {
      id: 4,
      title: "Computer Science - STEM Program",
      description: "Learn programming, algorithms, and computational thinking with our hands-on STEM approach.",
      curriculum: "STEM",
      level: "Intermediate",
      price: 349,
      duration: 30,
      students: 743,
      rating: 4.9,
      instructor: "Dr. Ama Boateng",
      thumbnail: "bg-gradient-to-br from-orange-400 to-orange-600",
      features: ["Coding Projects", "Problem Solving", "Tech Innovation"]
    }
  ]

  const curriculumHighlights = [
    {
      name: "GES Curriculum",
      description: "Ghana Education Service aligned courses",
      courses: 120,
      color: "bg-blue-500"
    },
    {
      name: "Cambridge",
      description: "International Cambridge curriculum",
      courses: 85,
      color: "bg-green-500"
    },
    {
      name: "STEM Programs",
      description: "Science, Technology, Engineering & Math",
      courses: 67,
      color: "bg-purple-500"
    },
    {
      name: "IGCSE",
      description: "International General Certificate",
      courses: 45,
      color: "bg-orange-500"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Courses
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Explore our most popular courses across different curricula. 
            Start your learning journey with expert-led content and interactive experiences.
          </p>

          {/* Curriculum Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {curriculumHighlights.map((curriculum, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className={`w-16 h-16 ${curriculum.color} rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{curriculum.name}</h3>
                <p className="text-sm text-gray-600">{curriculum.courses} courses</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
              {/* Course Thumbnail */}
              <div className={`h-48 ${course.thumbnail} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 text-xs font-semibold rounded-full">
                      {course.curriculum}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 text-xs font-semibold rounded-full">
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}h</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="text-sm text-gray-600">
                  By <span className="font-medium text-gray-900">{course.instructor}</span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {course.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded-md">
                      {feature}
                    </span>
                  ))}
                  {course.features.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-md">
                      +{course.features.length - 2} more
                    </span>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatCurrency(course.price)}
                  </div>
                  <Button size="sm" className="group/btn">
                    Enroll
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/courses">
              View All Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}