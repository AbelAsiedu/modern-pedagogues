import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight,
  Users,
  BookOpen,
  Award,
  CheckCircle
} from "lucide-react"

export const CTASection: React.FC = () => {
  const benefits = [
    "Access to world-class curriculum",
    "Expert teachers and mentors",
    "Flexible learning schedules",
    "Progress tracking and analytics",
    "Mobile Money payment options",
    "24/7 platform access"
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-secondary-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left text-white">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Ready to Transform Your 
              <span className="text-secondary-300"> Educational Journey?</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-primary-100 mb-8 leading-relaxed">
              Join thousands of students who have already unlocked their potential 
              with The Modern Pedagogues. Start learning today with our comprehensive 
              multi-curriculum platform.
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-secondary-300 flex-shrink-0" />
                  <span className="text-primary-100">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold group"
                asChild
              >
                <Link href="/auth/register">
                  <Users className="mr-2 h-5 w-5" />
                  Enroll as Student
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold group"
                asChild
              >
                <Link href="/auth/teacher-application">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Become a Teacher
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-primary-500">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-secondary-300" />
                  <span className="text-primary-100 font-medium">Accredited Platform</span>
                </div>
                <div className="text-primary-100">•</div>
                <div className="text-primary-100 font-medium">5,000+ Happy Students</div>
                <div className="text-primary-100">•</div>
                <div className="text-primary-100 font-medium">98% Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-1 transition-transform duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Start Learning Today
                </h3>
                <p className="text-gray-600 mb-6">
                  Get instant access to our comprehensive course library and 
                  expert instructors.
                </p>
                
                {/* Mock Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-600">500+</div>
                    <div className="text-sm text-gray-600">Courses</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary-600">200+</div>
                    <div className="text-sm text-gray-600">Teachers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary-400 rounded-full animate-bounce opacity-80"></div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-full animate-pulse opacity-60"></div>
            
            {/* Small Cards */}
            <div className="absolute top-8 -right-8 bg-secondary-400 rounded-lg p-3 shadow-lg transform -rotate-12">
              <div className="text-white text-sm font-semibold">GES ✓</div>
            </div>
            <div className="absolute bottom-16 -left-8 bg-white rounded-lg p-3 shadow-lg transform rotate-12">
              <div className="text-primary-600 text-sm font-semibold">Cambridge ✓</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}