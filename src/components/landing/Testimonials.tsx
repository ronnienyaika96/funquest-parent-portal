import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Grace Nakato',
      role: 'Mother of 2',
      location: 'Kampala',
      quote: 'My daughter asks to play FunQuest every day! She learned all her letters in just 3 weeks. I love that it\'s safe and educational.',
      avatar: '👩🏾',
      rating: 5,
    },
    {
      name: 'Sarah Achieng',
      role: 'Primary Teacher',
      location: 'Jinja',
      quote: 'We use FunQuest in our nursery class. The children are so engaged, and I can see real improvement in their letter recognition.',
      avatar: '👩🏽‍🏫',
      rating: 5,
    },
    {
      name: 'David Okello',
      role: 'Father',
      location: 'Gulu',
      quote: 'Finally, an app that my kids can use without me worrying about inappropriate content. The progress tracking is a bonus!',
      avatar: '👨🏾',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-pink-100 text-pink-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Happy Families
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Parents Are Saying
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of families who trust FunQuest for their children's early learning.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-3xl p-6 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-gray-200">
                <Quote className="w-10 h-10" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role} • {testimonial.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-gray-100"
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">10K+</div>
            <div className="text-gray-600">Happy Kids</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">50+</div>
            <div className="text-gray-600">Schools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-1">4.9</div>
            <div className="text-gray-600">App Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-1">100K+</div>
            <div className="text-gray-600">Games Played</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
