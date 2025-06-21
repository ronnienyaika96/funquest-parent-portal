
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Users, Award, Star, Check, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Online Class',
      description: 'Interactive digital learning experiences that engage children with fun educational content.',
      image: '/lovable-uploads/754ea002-0ee8-456b-8e9a-92ca22197fa3.png',
      learnMore: true
    },
    {
      title: 'Formal Tuition',
      description: 'Structured learning programs designed to build essential skills and knowledge.',
      image: '/lovable-uploads/c1eff5ec-d1cd-4cb1-90d9-abce05ba4961.png',
      learnMore: true
    },
    {
      title: 'Special Tuition',
      description: 'Customized learning approaches for children with unique educational needs.',
      image: '/lovable-uploads/66207c85-bff7-4f71-ac50-4155ec5f73c6.png',
      learnMore: true
    },
    {
      title: 'Preschool',
      description: 'Early childhood development programs that prepare kids for their educational journey.',
      image: '/lovable-uploads/340f1efe-ee72-41b0-acd4-362a3d295a6a.png',
      learnMore: true
    }
  ];

  const facilities = [
    {
      title: 'Class Room',
      description: 'Modern, interactive learning spaces equipped with the latest educational technology and comfortable seating.',
      image: '/lovable-uploads/cc79e227-c855-4884-bd7e-fcb233acfebc.png'
    },
    {
      title: 'Transport',
      description: 'Safe and reliable transportation services ensuring children arrive at learning centers securely.',
      image: '/lovable-uploads/cc79e227-c855-4884-bd7e-fcb233acfebc.png'
    },
    {
      title: 'Play Area',
      description: 'Dedicated recreational spaces where children can play, socialize, and develop motor skills.',
      image: '/lovable-uploads/cc79e227-c855-4884-bd7e-fcb233acfebc.png'
    },
    {
      title: 'Healthy Foods',
      description: 'Nutritious meal programs designed to support growing minds and bodies with balanced nutrition.',
      image: '/lovable-uploads/cc79e227-c855-4884-bd7e-fcb233acfebc.png'
    }
  ];

  const stats = [
    { number: '3564+', label: 'Students Enrolled', icon: '👨‍🎓' },
    { number: '156+', label: 'Total No.of Classes', icon: '📚' },
    { number: '76+', label: 'No.of Teachers', icon: '👩‍🏫' },
    { number: '8+', label: 'Years Experience', icon: '🏆' }
  ];

  const testimonials = [
    {
      name: 'Sarah Michelle',
      feedback: 'FunQuest has transformed my child\'s learning experience. The interactive games and educational content keep Emma engaged and excited about learning every day.',
      image: '/lovable-uploads/16f8b656-120b-4b95-873b-dd64807ff319.png'
    },
    {
      name: 'Mary Grace',
      feedback: 'The personalized learning approach and progress tracking help me understand exactly how my child is developing. Highly recommended for all parents!',
      image: '/lovable-uploads/16f8b656-120b-4b95-873b-dd64807ff319.png'
    },
    {
      name: 'Emma Grace',
      feedback: 'My kids love the variety of educational games and activities. It\'s amazing how much they\'ve learned while having so much fun.',
      image: '/lovable-uploads/16f8b656-120b-4b95-873b-dd64807ff319.png'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-blue-600">🌟 FunQuest</div>
              <span className="text-gray-600">Educational Platform</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600">🏠 Home</a>
              <a href="#programs" className="text-gray-700 hover:text-blue-600">LMS Pages</a>
              <a href="#facilities" className="text-gray-700 hover:text-blue-600">Facilities</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600">Articles</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600">Ask Us</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                className="rounded-2xl"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl"
              >
                Enquire Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-cyan-400 via-blue-400 to-teal-400 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 text-6xl opacity-20">☁️</div>
          <div className="absolute top-40 right-20 text-4xl opacity-30">⭐</div>
          <div className="absolute bottom-40 left-20 text-5xl opacity-25">🎯</div>
          <div className="absolute bottom-20 right-40 text-3xl opacity-20">🌈</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 mb-6">
                <span className="text-white font-semibold text-lg">20% Flat Off</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                On Registration
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Join thousands of families who trust FunQuest to make learning an exciting adventure for their children.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                Know More
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute -top-10 -left-10 text-8xl opacity-30">🚀</div>
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center">
                <div className="text-6xl mb-4">👧👦</div>
                <h3 className="text-2xl font-bold text-white mb-2">Ready for Fun Learning?</h3>
                <p className="text-white/80">Interactive games and educational content that makes learning exciting!</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L50 110C100 100 200 80 300 70C400 60 500 60 600 65C700 70 800 80 900 85C1000 90 1100 90 1150 90L1200 90V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-pink-500 font-semibold mb-4">About Us</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                We Educate Knowledge & Essential Skills!
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                At FunQuest, we believe learning should be an adventure. Our platform combines educational excellence with engaging gameplay to help children develop essential skills while having fun. Through interactive games, educational content, and personalized learning paths, we make education exciting and effective.
              </p>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl">
                Read More
              </Button>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <img 
                    src="/lovable-uploads/66207c85-bff7-4f71-ac50-4155ec5f73c6.png" 
                    alt="Children learning" 
                    className="rounded-3xl shadow-lg"
                  />
                </div>
                <div className="space-y-6 pt-12">
                  <img 
                    src="/lovable-uploads/e299daf7-75b2-41ea-b283-cb5015d29346.png" 
                    alt="Creative learning" 
                    className="rounded-3xl shadow-lg"
                  />
                </div>
              </div>
              <div className="absolute -top-10 -right-10 text-6xl opacity-20">🎨</div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Programs */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Educational Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive range of learning programs designed to nurture young minds and foster educational growth through innovative teaching methods.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <div className="w-12 h-1 bg-orange-400 mb-4"></div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  {feature.learnMore && (
                    <Button variant="outline" className="w-full rounded-2xl group-hover:bg-blue-50">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-20 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Facilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              State-of-the-art facilities designed to provide the best learning environment for children's growth and development.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, index) => (
              <Card key={index} className="bg-teal-600 text-white rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={facility.image} 
                    alt={facility.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">{facility.title}</h3>
                  <div className="w-12 h-1 bg-white/30 mb-4"></div>
                  <p className="text-white/90 mb-4 text-sm leading-relaxed">{facility.description}</p>
                  <Button variant="secondary" className="w-full bg-pink-500 hover:bg-pink-600 text-white border-0 rounded-2xl">
                    View More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-orange-400 to-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">International Education</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Learning Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-pink-500 font-semibold mb-4">Harmonious</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Creative Learning Opportunity For Kids
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our innovative approach to education combines creativity with structured learning, giving children the opportunity to explore, discover, and develop their unique talents through engaging activities and interactive experiences.
              </p>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl">
                Creative Works
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <img 
                src="/lovable-uploads/e299daf7-75b2-41ea-b283-cb5015d29346.png" 
                alt="Creative learning 1" 
                className="rounded-3xl shadow-lg"
              />
              <img 
                src="/lovable-uploads/e299daf7-75b2-41ea-b283-cb5015d29346.png" 
                alt="Creative learning 2" 
                className="rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Methodology */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="/lovable-uploads/e4402e7e-d31f-4b1d-b2a2-a25e30f40e8f.png" 
                alt="Teaching methodology" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-10 -right-10 text-6xl opacity-20">📚</div>
            </div>
            
            <div>
              <div className="text-pink-500 font-semibold mb-4">Active</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Visual Teaching Methodology!
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our visual teaching approach uses interactive multimedia, educational games, and hands-on activities to make learning more engaging and effective for children. This methodology helps improve retention and makes complex concepts easier to understand.
              </p>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl">
                Creative Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Parents Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from families who have experienced the FunQuest difference in their children's educational journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center p-8 rounded-3xl hover:shadow-xl transition-all duration-300">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-teal-600 mb-4">{testimonial.name}</h3>
                <p className="text-gray-600 mb-6 italic">"{testimonial.feedback}"</p>
                <div className="flex justify-center space-x-2">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white">f</span>
                  </div>
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white">t</span>
                  </div>
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white">in</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">🌟</div>
                <h3 className="text-xl font-bold">FunQuest</h3>
              </div>
              <p className="text-teal-100 mb-4">
                Educational platform designed to make learning fun and engaging for children.
              </p>
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-teal-600">f</span>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-teal-600">t</span>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-teal-600">in</span>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-teal-600">ig</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Pages</h4>
              <ul className="space-y-2 text-teal-100">
                <li><a href="#" className="hover:text-white">About FunQuest</a></li>
                <li><a href="#" className="hover:text-white">Our Team</a></li>
                <li><a href="#" className="hover:text-white">News Feed</a></li>
                <li><a href="#" className="hover:text-white">Infrastructure</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Help</h4>
              <ul className="space-y-2 text-teal-100">
                <li><a href="#" className="hover:text-white">Start a Return</a></li>
                <li><a href="#" className="hover:text-white">Shipping & Return Policy</a></li>
                <li><a href="#" className="hover:text-white">F.A.Q</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Galleries</h4>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6].map((item) => (
                  <div key={item} className="aspect-square bg-teal-500 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-teal-500 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-teal-100">
              Copyright © 2023 FunQuest by Lovable. All Rights Reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <div className="bg-white rounded px-3 py-1">
                <span className="text-teal-600 font-semibold">VISA</span>
              </div>
              <div className="bg-white rounded px-3 py-1">
                <span className="text-teal-600 font-semibold">MC</span>
              </div>
              <div className="bg-white rounded px-3 py-1">
                <span className="text-teal-600 font-semibold">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
