"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Play,
  ArrowRight,
  Star,
  Users,
  BookOpen,
  Award
} from "lucide-react"

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-secondary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-primary-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Ghana's Leading Educational Platform
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Empowering 
              <span className="text-gradient-primary"> Tomorrow's </span>
              Leaders Today
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Experience world-class education with our multi-curriculum platform. 
              From GES to Cambridge, STEM to A-Level — we provide comprehensive 
              learning solutions tailored for every student.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" className="group" asChild>
                <Link href="/auth/register">
                  Enroll Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="group" asChild>
                <Link href="/auth/teacher-application">
                  Become a Tutor
                  <Users className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">5K+</div>
                <div className="text-sm text-gray-600">Active Students</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">200+</div>
                <div className="text-sm text-gray-600">Expert Teachers</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative animate-slide-up">
            {/* Main Image Placeholder */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 shadow-2xl relative overflow-hidden">
                {/* Placeholder for Hero Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-primary-500 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-gray-600 font-medium">Students Learning</p>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg animate-bounce">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-secondary-500" />
                    <span className="text-sm font-medium">98% Pass Rate</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg animate-pulse">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">2,847 Online Now</span>
                  </div>
                </div>
              </div>

              {/* Video Play Button */}
              <button className="absolute inset-0 flex items-center justify-center group">
                <div className="w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-primary-500 ml-1" />
                </div>
              </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-200 rounded-full opacity-40 animate-pulse"></div>
          </div>
        </div>

        {/* Curriculum Badges */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 mb-6 font-medium">
            Trusted Curriculum Partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {['GES', 'Cambridge', 'STEM', 'IGCSE', 'A-Level'].map((curriculum) => (
              <div 
                key={curriculum}
                className="px-6 py-3 bg-white rounded-lg shadow-sm border border-gray-100 font-semibold text-gray-700 hover:shadow-md transition-shadow"
              >
                {curriculum}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}