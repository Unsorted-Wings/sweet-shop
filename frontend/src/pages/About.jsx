import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, Award, Users, Clock } from 'lucide-react'

const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

function About() {
  const stats = [
    { icon: Heart, label: "Happy Customers", value: "10,000+" },
    { icon: Award, label: "Awards Won", value: "25" },
    { icon: Users, label: "Team Members", value: "50" },
    { icon: Clock, label: "Years of Excellence", value: "15" }
  ]

  const team = [
    {
      name: "Emma Sweet",
      role: "Head Pastry Chef",
      image: "👩‍🍳",
      bio: "With 20 years of experience, Emma creates our signature desserts with passion and precision."
    },
    {
      name: "Marcus Chocolate",
      role: "Chocolate Specialist",
      image: "👨‍🍳", 
      bio: "Master chocolatier who sources the finest cocoa from around the world."
    },
    {
      name: "Luna Baker",
      role: "Creative Director",
      image: "👩‍🎨",
      bio: "The artistic mind behind our innovative designs and seasonal collections."
    }
  ]

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <motion.button
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </motion.button>
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          variants={sectionVariants}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-6">
            Our Sweet Story
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Founded in 2009, Sweet Shop has been spreading joy one confection at a time. 
            Our journey began with a simple mission: to create extraordinary desserts that 
            bring people together and create lasting memories.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          variants={sectionVariants}
          className="bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 mb-16"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                We believe that life's sweetest moments deserve the finest treats. Every dessert 
                we craft is made with premium ingredients, traditional techniques, and a generous 
                helping of love.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                From our artisanal chocolates to our signature cakes, we're committed to 
                delivering excellence in every bite and creating experiences that delight 
                all your senses.
              </p>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">🎂</div>
              <div className="text-pink-400 font-semibold text-lg">
                Crafted with passion since 2009
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={sectionVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center"
            >
              <stat.icon className="w-8 h-8 text-pink-400 mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-gray-300 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Team Section */}
        <motion.div
          variants={sectionVariants}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Meet Our Sweet Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center"
              >
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <div className="text-pink-400 font-semibold mb-4">{member.role}</div>
                <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          variants={sectionVariants}
          className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-3xl p-8 md:p-12 border border-pink-500/20 mb-16"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-white mb-3">Quality</h3>
              <p className="text-gray-300">
                We source only the finest ingredients and maintain the highest standards 
                in every creation.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💚</div>
              <h3 className="text-xl font-bold text-white mb-3">Sustainability</h3>
              <p className="text-gray-300">
                We're committed to eco-friendly practices and supporting local farmers 
                and suppliers.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-white mb-3">Innovation</h3>
              <p className="text-gray-300">
                We constantly explore new flavors, techniques, and designs to surprise 
                and delight our customers.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={sectionVariants}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to taste the magic?
          </h2>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
            >
              🍭 Explore Our Collection
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default About
