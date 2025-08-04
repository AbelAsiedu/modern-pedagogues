import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { 
  Monitor,
  Users,
  FileText,
  CreditCard,
  BarChart,
  MessageSquare,
  Shield,
  Clock,
  Award,
  Video,
  Download,
  Smartphone
} from "lucide-react"

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Monitor,
      title: "Interactive Learning",
      description: "Engage with multimedia content, interactive quizzes, and real-time feedback to enhance your learning experience.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Users,
      title: "Expert Teachers",
      description: "Learn from qualified educators with years of experience in their respective fields and curricula.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: FileText,
      title: "Comprehensive Assessments",
      description: "Take exams, submit assignments, and receive detailed feedback to track your academic progress.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: CreditCard,
      title: "Flexible Payments",
      description: "Pay easily with Mobile Money (MTN, Vodafone, AirtelTigo) or bank transfers for seamless enrollment.",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: BarChart,
      title: "Progress Tracking",
      description: "Monitor your academic journey with detailed analytics and performance reports for students and parents.",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: MessageSquare,
      title: "Live Communication",
      description: "Connect with teachers and classmates through our integrated messaging and live session features.",
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data and payments are protected with industry-standard security measures and encryption.",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Learn at your own pace with round-the-clock access to course materials and resources.",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Earn recognized certificates upon course completion to showcase your achievements.",
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: Video,
      title: "Video Lessons",
      description: "Access high-quality video content with subtitles and interactive elements for better understanding.",
      color: "bg-teal-100 text-teal-600"
    },
    {
      icon: Download,
      title: "Offline Resources",
      description: "Download materials for offline study and access content even without internet connectivity.",
      color: "bg-cyan-100 text-cyan-600"
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Study on any device with our responsive design optimized for desktop, tablet, and mobile.",
      color: "bg-violet-100 text-violet-600"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose The Modern Pedagogues?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the features that make our platform the preferred choice for 
            students, teachers, and parents across Ghana and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1"
              >
                <CardHeader className="pb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                    feature.color
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors cursor-pointer">
            Explore All Features
          </div>
        </div>
      </div>
    </section>
  )
}