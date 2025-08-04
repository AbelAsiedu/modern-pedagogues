import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Star, Quote } from "lucide-react"

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: "Kwame Asante",
      role: "Student - IGCSE Mathematics",
      avatar: "KA",
      rating: 5,
      content: "The Modern Pedagogues transformed my understanding of mathematics. The interactive lessons and expert teachers made complex concepts so much easier to grasp. I went from struggling to excelling!",
      curriculum: "IGCSE"
    },
    {
      id: 2,
      name: "Mrs. Akosua Boateng",
      role: "Parent",
      avatar: "AB",
      rating: 5,
      content: "As a parent, I'm impressed with the platform's progress tracking features. I can easily monitor my daughter's performance and communicate with her teachers. The payment system with Mobile Money is very convenient.",
      curriculum: "GES"
    },
    {
      id: 3,
      name: "Ama Osei",
      role: "Student - Cambridge A-Level Chemistry",
      avatar: "AO",
      rating: 5,
      content: "The chemistry lab simulations are incredible! I can practice experiments safely online before doing them in real labs. Professor Osei's teaching style is engaging and thorough.",
      curriculum: "Cambridge"
    },
    {
      id: 4,
      name: "Samuel Mensah",
      role: "Student - STEM Program",
      avatar: "SM",
      rating: 5,
      content: "Learning programming through The Modern Pedagogues has been amazing. The hands-on projects and coding challenges helped me build real-world skills. I've already started my own tech startup!",
      curriculum: "STEM"
    },
    {
      id: 5,
      name: "Mr. Joseph Adjei",
      role: "Parent",
      avatar: "JA",
      rating: 5,
      content: "The platform offers excellent value for money. My son has access to quality education from the comfort of our home. The 24/7 support and multiple curriculum options are outstanding.",
      curriculum: "Multiple"
    },
    {
      id: 6,
      name: "Efua Darko",
      role: "Student - GES English Language",
      avatar: "ED",
      rating: 5,
      content: "Ms. Mensah's English classes are so engaging! The reading comprehension exercises and writing workshops have significantly improved my language skills. I now feel confident in my abilities.",
      curriculum: "GES"
    }
  ]

  const achievements = [
    {
      percentage: "98%",
      label: "Student Pass Rate",
      description: "Students successfully complete their courses"
    },
    {
      percentage: "95%",
      label: "Satisfaction Score",
      description: "Students and parents rate us highly"
    },
    {
      percentage: "92%",
      label: "Recommendation Rate",
      description: "Students recommend us to friends"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Community Says
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Hear from students, parents, and educators 
            who have experienced the difference with The Modern Pedagogues.
          </p>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
                {achievement.percentage}
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-1">
                {achievement.label}
              </div>
              <p className="text-gray-600">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className={cn(
                "relative group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden",
                index % 2 === 0 ? "hover:-translate-y-2" : "hover:translate-y-2"
              )}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="w-12 h-12 text-primary-500" />
              </div>

              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                {/* Curriculum Badge */}
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                    {testimonial.curriculum}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-gray-600 max-w-md">
              Start your learning journey today and become part of our thriving educational community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
                Start Learning
              </button>
              <button className="px-8 py-3 border-2 border-primary-500 text-primary-500 rounded-lg font-medium hover:bg-primary-500 hover:text-white transition-colors">
                Speak to Advisor
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}