import * as React from "react"
import { cn } from "@/lib/utils"
import { 
  Users,
  BookOpen,
  Award,
  Globe,
  TrendingUp,
  Target
} from "lucide-react"

export const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      number: "5,000+",
      label: "Active Students",
      description: "Learning and growing every day"
    },
    {
      icon: BookOpen,
      number: "500+",
      label: "Courses Available",
      description: "Across multiple curricula"
    },
    {
      icon: Award,
      number: "98%",
      label: "Success Rate",
      description: "Students achieving their goals"
    },
    {
      icon: Globe,
      number: "15+",
      label: "Countries Reached",
      description: "Global educational impact"
    },
    {
      icon: TrendingUp,
      number: "95%",
      label: "Student Satisfaction",
      description: "Based on feedback surveys"
    },
    {
      icon: Target,
      number: "200+",
      label: "Expert Teachers",
      description: "Qualified and experienced"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our numbers speak for themselves. Join a community of learners 
            and educators who are shaping the future of education in Ghana and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-200 transition-colors">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-gray-700 mb-2">
                  {stat.label}
                </div>
                <p className="text-gray-600">
                  {stat.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}