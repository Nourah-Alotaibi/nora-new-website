import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Brain, Code, Gamepad2, Palette, Stethoscope, Mail, Github, Linkedin, ExternalLink, ChevronDown, GraduationCap, Building, Award, MapPin, Sparkles, Star, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import './App.css'

// Import cute visual assets
import profilePhoto from '../image.png'
import aumBuilding from './assets/aum_university_building.png'
import ucBerkeleyBuilding from './assets/uc_berkeley_building.png'
import navyCodedBuilding from './assets/navy_coded_building.png'
import hospitalAiBuilding from './assets/hospital_ai_building.png'
import graduationCapMasters from './assets/graduation_cap_masters.png'
import trophyAwards from './assets/trophy_awards.png'
import evaAiPin from './assets/eva_ai_pin.png'
import kuwaitLandmarks from './assets/kuwait_landmarks.png'

function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const projects = [
    {
      title: "Hayat AI Medical Assistant",
      description: "AI-powered medical assistant for epilepsy treatment using XGBoost and NLP, developed in collaboration with AlSabah Hospital and VIVUS Clinic.",
      icon: <Stethoscope className="w-12 h-12 text-purple-300" />,
      tech: ["XGBoost", "NLP", "Python", "Full-Stack"],
      color: "magical-card",
      image: hospitalAiBuilding,
      award: "Best Graduation Project at AUM"
    },
    {
      title: "EVA AI (AI Pin)",
      description: "Wearable intelligent assistant for elder care and autism support, integrating YOLOv8, Faster R-CNN, and OAK-1 MAX camera.",
      icon: <Brain className="w-12 h-12 text-purple-300" />,
      tech: ["YOLOv8", "Faster R-CNN", "OAK-1 MAX", "UI/UX"],
      color: "magical-card",
      image: evaAiPin,
      award: "UC Berkeley Recognition, Hult GCC Winner"
    },
    {
      title: "Real Estate Platform",
      description: "Frontend development for scalable online real estate management platform using React, Python, Django, and PHP.",
      icon: <Building className="w-12 h-12 text-purple-300" />,
      tech: ["React", "Django", "PHP", "UI/UX"],
      color: "magical-card",
      image: kuwaitLandmarks
    },
    {
      title: "Firefighter Robot",
      description: "Award-winning firefighter robot using YOLO, OpenCV, Arduino, and Raspberry Pi - First Place at Global Robotex Competition.",
      icon: <Gamepad2 className="w-12 h-12 text-purple-300" />,
      tech: ["YOLO", "OpenCV", "Arduino", "Raspberry Pi"],
      color: "magical-card",
      image: trophyAwards,
      award: "First Place - Global Robotex, Estonia"
    },
    {
      title: "Web Development Education",
      description: "Teaching and mentoring students in web development, AI, and Python programming across multiple institutions.",
      icon: <Code className="w-12 h-12 text-purple-300" />,
      tech: ["HTML/CSS", "JavaScript", "Python", "AI Education"],
      color: "magical-card",
      image: navyCodedBuilding
    }
  ]

  const education = [
    {
      institution: "American University of the Middle East (AUM)",
      degree: "Bachelor in Computer Engineering",
      period: "2020 - 2025",
      gpa: "3.6/4.0",
      focus: "AI & Machine Learning, Cybersecurity",
      image: aumBuilding,
      status: "Graduated"
    },
    {
      institution: "University of California, Berkeley",
      degree: "AI & Entrepreneurship Program",
      period: "2024",
      focus: "Machine Learning & Data Science, AI Product Development",
      image: ucBerkeleyBuilding,
      status: "Graduate"
    },
    {
      institution: "Current Studies",
      degree: "Masters in AI and Data Science",
      period: "Present",
      focus: "Advanced AI, Healthcare ML, Neurological Disabilities",
      image: graduationCapMasters,
      status: "Current Student"
    }
  ]

  const achievements = [
    "First Place - Gulf Cooperation Council Innovation Challenge (EVA AI)",
    "First Place - Global Robotex Firefighter Competition, Estonia",
    "Top 12 Global Projects - Babson College (EVA AI)",
    "Multiple Cybersecurity Competition Wins",
    "Consistent Honor List Recipient at AUM",
    "Best Graduation Project Award - AUM 2025"
  ]

  const skills = [
    { name: "Artificial Intelligence", level: 95 },
    { name: "Machine Learning", level: 92 },
    { name: "Python", level: 90 },
    { name: "React/Frontend", level: 88 },
    { name: "Healthcare AI", level: 85 },
    { name: "Cybersecurity", level: 82 },
    { name: "UI/UX Design", level: 85 },
    { name: "Teaching/Mentoring", level: 90 }
  ]

  // Sparkle component
  const Sparkle = ({ delay = 0, size = 4 }) => (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle, #ffffff 0%, #f3e8ff 100%)',
        borderRadius: '50%',
        boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
      }}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        scale: [1, 1.5, 1],
        opacity: [0.8, 1, 0.8],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    />
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="magical-hero min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Mobile retro grid floor */}
        <div className="mobile-grid-wrap"><div className="mobile-grid"></div></div>
        {/* Floating sparkles */}
        {[...Array(20)].map((_, i) => (
          <Sparkle 
            key={i} 
            delay={i * 0.2} 
            size={Math.random() * 6 + 2}
          />
        ))}
        
        {/* Fairy elements */}
        <div className="fairy" style={{ top: '10%', left: '10%' }} />
        <div className="fairy" style={{ top: '20%', right: '15%', animationDelay: '2s' }} />
        <div className="fairy" style={{ bottom: '20%', left: '20%', animationDelay: '4s' }} />
        
        {/* Floating cute elements with bigger sizes - hidden on mobile */}
        <motion.img
          src={kuwaitLandmarks}
          alt="Kuwait Landmarks"
          className="hero-float-desktop absolute top-20 left-20 magical-image-large magical-float opacity-40"
          animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.img
          src={graduationCapMasters}
          alt="Graduation Cap"
          className="hero-float-desktop absolute top-40 right-32 magical-image-large magical-float opacity-40"
          animate={{ y: [0, -25, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        />
        <motion.img
          src={trophyAwards}
          alt="Awards"
          className="hero-float-desktop absolute bottom-32 left-40 magical-image-large magical-float opacity-40"
          animate={{ y: [0, -35, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
        <motion.img
          src={evaAiPin}
          alt="EVA AI"
          className="hero-float-desktop absolute bottom-40 right-20 magical-image-large magical-float opacity-40"
          animate={{ y: [0, -20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 3 }}
        />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="magical-float"
          >
            {/* Mobile-only orb with glow */}
            <div className="mobile-orb-wrap">
              <div className="mobile-halo"></div>
              <div className="mobile-orb">
                <img src={profilePhoto} alt="Nourah Alotaibi" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mb-8">
              <motion.img
                src={kuwaitLandmarks}
                alt="Kuwait"
                className="hero-float-desktop magical-image magical-glow"
                whileHover={{ scale: 1.2, rotate: 10 }}
              />
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold magical-text">
                Welcome to Noraland
              </h1>
              <motion.img
                src={graduationCapMasters}
                alt="AI Graduate"
                className="hero-float-desktop magical-image magical-glow"
                whileHover={{ scale: 1.2, rotate: -10 }}
              />
            </div>
            <motion.div
              className="flex items-center justify-center gap-4 mb-8"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-white" />
              <h2 className="text-4xl md:text-5xl font-light text-white">
                Computer Engineer | AI Developer | Educator
              </h2>
              <Star className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-2xl md:text-3xl mb-16 text-white max-w-5xl mx-auto leading-relaxed">
              Masters Student in AI & Data Science from Kuwait, creating magical healthcare AI solutions 
              and empowering the next generation through education. UC Berkeley graduate and award-winning entrepreneur.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                className="magical-button text-xl px-12 py-6"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPin className="w-6 h-6 mr-3" />
                Explore My Magical Journey
              </motion.button>
              <motion.button
                className="magical-button text-xl px-12 py-6"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-6 h-6 mr-3" />
                Enter Noraland
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-12 h-12 text-white magical-glow" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Sparkles background */}
        {[...Array(15)].map((_, i) => (
          <Sparkle 
            key={`edu-${i}`} 
            delay={i * 0.3} 
            size={Math.random() * 4 + 2}
          />
        ))}
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-6 mb-8">
              <motion.img 
                src={graduationCapMasters} 
                alt="Education" 
                className="magical-image magical-glow"
                whileHover={{ scale: 1.3, rotate: 15 }}
              />
              <h2 className="text-6xl md:text-7xl font-bold text-purple-800 magical-glow">Educational Journey</h2>
              <motion.img 
                src={aumBuilding} 
                alt="University" 
                className="magical-image magical-glow"
                whileHover={{ scale: 1.3, rotate: -15 }}
              />
            </div>
            <div className="w-32 h-2 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-12 rounded-full magical-glow"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {education.map((edu, index) => (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: index * 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="magical-card h-full border-4">
                  <CardHeader className="text-center">
                    <motion.img 
                      src={edu.image} 
                      alt={edu.institution} 
                      className="magical-image-large mx-auto mb-6"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    />
                    <Badge variant="secondary" className="mb-4 text-lg px-4 py-2 bg-purple-200 text-purple-800">{edu.status}</Badge>
                    <CardTitle className="text-2xl font-bold text-purple-800 mb-2">
                      {edu.institution}
                    </CardTitle>
                    <CardDescription className="text-purple-600 font-semibold text-lg">
                      {edu.degree}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-purple-700 mb-3 text-lg font-medium">{edu.period}</p>
                    {edu.gpa && <p className="text-purple-600 mb-3 text-base">GPA: {edu.gpa}</p>}
                    <p className="text-purple-600 text-base">{edu.focus}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="magical-projects py-32">
        {/* Sparkles background */}
        {[...Array(25)].map((_, i) => (
          <Sparkle 
            key={`proj-${i}`} 
            delay={i * 0.2} 
            size={Math.random() * 5 + 3}
          />
        ))}
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-6 mb-8">
              <motion.img 
                src={evaAiPin} 
                alt="Projects" 
                className="magical-image magical-glow"
                whileHover={{ scale: 1.3, rotate: 20 }}
              />
              <h2 className="text-6xl md:text-7xl font-bold text-purple-900 magical-glow">Magical Projects</h2>
              <motion.img 
                src={hospitalAiBuilding} 
                alt="Healthcare AI" 
                className="magical-image magical-glow"
                whileHover={{ scale: 1.3, rotate: -20 }}
              />
            </div>
            <div className="w-32 h-2 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-12 rounded-full magical-glow"></div>
            <p className="text-2xl text-purple-800 max-w-4xl mx-auto leading-relaxed">
              Innovative AI solutions in healthcare, education, and assistive technology that make a real-world impact.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className={`${project.color} h-full border-4`}>
                  <CardHeader>
                    <div className="flex items-center justify-center mb-6">
                      <motion.img 
                        src={project.image} 
                        alt={project.title} 
                        className="magical-image-large"
                        whileHover={{ scale: 1.2, rotate: 8 }}
                      />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      {project.icon}
                      <CardTitle className="text-2xl font-bold text-purple-800">
                        {project.title}
                      </CardTitle>
                    </div>
                    {project.award && (
                      <Badge variant="outline" className="mb-4 text-base bg-yellow-200 border-yellow-400 text-yellow-800 px-3 py-1">
                        <Award className="w-4 h-4 mr-2" />
                        {project.award}
                      </Badge>
                    )}
                    <CardDescription className="text-purple-700 text-lg leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-sm bg-purple-100 text-purple-700 border-purple-300">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <motion.button
                      className="magical-button w-full text-lg py-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Explore Magic
                    </motion.button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Achievements Section */}
      <section className="magical-skills py-32">
        {/* Sparkles background */}
        {[...Array(20)].map((_, i) => (
          <Sparkle 
            key={`skill-${i}`} 
            delay={i * 0.25} 
            size={Math.random() * 6 + 2}
          />
        ))}
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-6 mb-8">
              <motion.img 
                src={trophyAwards} 
                alt="Achievements" 
                className="magical-image magical-glow"
                whileHover={{ scale: 1.3, rotate: 25 }}
              />
              <h2 className="text-6xl md:text-7xl font-bold text-white magical-glow">Magical Skills & Achievements</h2>
              <motion.img 
                src={trophyAwards} 
                alt="Milestones" 
                className="magical-image magical-glow"
                whileHover={{ scale: 1.3, rotate: -25 }}
              />
            </div>
            <div className="w-32 h-2 bg-gradient-to-r from-white to-purple-300 mx-auto mb-12 rounded-full magical-glow"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-semibold mb-8 text-white flex items-center gap-4">
                <Brain className="w-8 h-8 text-purple-300" />
                Technical Expertise
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="magical-skill-bubble p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-white text-lg">{skill.name}</h4>
                      <span className="text-purple-300 text-lg font-bold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-purple-900/30 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="magical-progress h-3 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-semibold mb-8 text-white flex items-center gap-4">
                <Award className="w-8 h-8 text-yellow-300" />
                Major Achievements
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="magical-skill-bubble p-6 rounded-2xl flex items-center gap-4"
                  >
                    <motion.img 
                      src={trophyAwards} 
                      alt="Trophy" 
                      className="w-12 h-12"
                      whileHover={{ scale: 1.2, rotate: 15 }}
                    />
                    <p className="text-white font-medium text-lg">{achievement}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Professional Experience Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Sparkles background */}
        {[...Array(18)].map((_, i) => (
          <Sparkle 
            key={`exp-${i}`} 
            delay={i * 0.4} 
            size={Math.random() * 5 + 2}
          />
        ))}
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-6 mb-8">
              <motion.img 
                src={navyCodedBuilding} 
                alt="Experience" 
                className="magical-image magical-glow"
                whileHover={{ scale: 1.3, rotate: 12 }}
              />
              <h2 className="text-6xl md:text-7xl font-bold text-purple-800 magical-glow">Magical Experience</h2>
              <motion.img 
                src={graduationCapMasters} 
                alt="Teaching" 
                className="magical-image magical-glow"
                whileHover={{ scale: 1.3, rotate: -12 }}
              />
            </div>
            <div className="w-32 h-2 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-12 rounded-full magical-glow"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Card className="magical-card h-full border-4">
                <CardHeader className="text-center">
                  <motion.img 
                    src={navyCodedBuilding} 
                    alt="CODED Academy" 
                    className="magical-image-large mx-auto mb-6"
                    whileHover={{ scale: 1.2, rotate: 8 }}
                  />
                  <Badge variant="secondary" className="mb-4 text-lg px-4 py-2 bg-green-200 text-green-800">Current</Badge>
                  <CardTitle className="text-2xl font-bold text-purple-800">
                    CODED Academy Mentor
                  </CardTitle>
                  <CardDescription className="text-green-600 font-semibold text-lg">
                    June 2025 - Present
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-purple-600 text-base">
                    Mentoring students in web development, AI, and programming fundamentals
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="magical-card h-full border-4">
                <CardHeader className="text-center">
                  <motion.img 
                    src={graduationCapMasters} 
                    alt="Academy X" 
                    className="magical-image-large mx-auto mb-6"
                    whileHover={{ scale: 1.2, rotate: -8 }}
                  />
                  <Badge variant="secondary" className="mb-4 text-lg px-4 py-2 bg-purple-200 text-purple-800">Current</Badge>
                  <CardTitle className="text-2xl font-bold text-purple-800">
                    Academy X Teaching Assistant
                  </CardTitle>
                  <CardDescription className="text-purple-600 font-semibold text-lg">
                    July 2025 - Present
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-purple-600 text-base">
                    Supporting AI and data science education programs
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="magical-card h-full border-4">
                <CardHeader className="text-center">
                  <motion.img 
                    src={kuwaitLandmarks} 
                    alt="Kuwait University" 
                    className="magical-image-large mx-auto mb-6"
                    whileHover={{ scale: 1.2, rotate: 12 }}
                  />
                  <Badge variant="secondary" className="mb-4 text-lg px-4 py-2 bg-orange-200 text-orange-800">Current</Badge>
                  <CardTitle className="text-2xl font-bold text-purple-800">
                    Kuwait University AI with Python TA
                  </CardTitle>
                  <CardDescription className="text-orange-600 font-semibold text-lg">
                    June 2025 - Present
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-purple-600 text-base">
                    Teaching assistant for AI and Python programming courses
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="magical-hero py-32">
        {/* Sparkles background */}
        {[...Array(30)].map((_, i) => (
          <Sparkle 
            key={`contact-${i}`} 
            delay={i * 0.15} 
            size={Math.random() * 7 + 3}
          />
        ))}
        
        {/* More fairy elements */}
        <div className="fairy" style={{ top: '15%', left: '5%' }} />
        <div className="fairy" style={{ top: '25%', right: '10%', animationDelay: '1s' }} />
        <div className="fairy" style={{ bottom: '25%', left: '15%', animationDelay: '3s' }} />
        <div className="fairy" style={{ bottom: '15%', right: '5%', animationDelay: '5s' }} />
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-6 mb-8">
              <motion.img 
                src={kuwaitLandmarks} 
                alt="Contact" 
                className="magical-image magical-glow"
                whileHover={{ scale: 1.3, rotate: 18 }}
              />
              <h2 className="text-6xl md:text-7xl font-bold text-white magical-glow">Enter Noraland</h2>
              <motion.img 
                src={evaAiPin} 
                alt="Connect" 
                className="magical-image magical-glow"
                whileHover={{ scale: 1.3, rotate: -18 }}
              />
            </div>
            <div className="w-32 h-2 bg-gradient-to-r from-white to-purple-300 mx-auto mb-12 rounded-full magical-glow"></div>
            <p className="text-2xl text-white max-w-4xl mx-auto leading-relaxed">
              Let's collaborate on magical AI projects or discuss opportunities in healthcare technology and education.
            </p>
          </motion.div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="text-center md:text-left"
              >
                <h3 className="text-3xl font-semibold mb-8 text-white">
                  Ready to create magic together?
                </h3>
                <p className="text-white mb-12 text-xl leading-relaxed">
                  I'm always excited to discuss new projects, especially those involving AI in healthcare, 
                  educational technology, or assistive devices. Whether you're looking for collaboration, 
                  mentorship, or just want to chat about the latest in AI, I'd love to hear from you!
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Mail className="w-8 h-8 text-purple-300" />
                    <span className="text-white text-xl">noooriii760@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <Linkedin className="w-8 h-8 text-purple-300" />
                    <span className="text-white text-xl">nourah-fahad-alotaibi</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <MapPin className="w-8 h-8 text-purple-300" />
                    <span className="text-white text-xl">Kuwait City, Kuwait</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <div className="relative">
                  <motion.img 
                    src={evaAiPin} 
                    alt="EVA AI Pin" 
                    className="w-80 h-80 magical-float magical-glow"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  />
                  <div className="absolute -top-8 -right-8">
                    <motion.img 
                      src={trophyAwards} 
                      alt="Awards" 
                      className="w-24 h-24 magical-float magical-glow"
                      whileHover={{ scale: 1.2, rotate: 15 }}
                    />
                  </div>
                  <div className="absolute -bottom-8 -left-8">
                    <motion.img 
                      src={graduationCapMasters} 
                      alt="Education" 
                      className="w-24 h-24 magical-float magical-glow"
                      whileHover={{ scale: 1.2, rotate: -15 }}
                    />
                  </div>
                  <div className="absolute top-1/2 -left-12">
                    <motion.img 
                      src={kuwaitLandmarks} 
                      alt="Kuwait" 
                      className="w-20 h-20 magical-float magical-glow"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="magical-hero py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-6 mb-8">
            <motion.img 
              src={kuwaitLandmarks} 
              alt="Kuwait" 
              className="w-12 h-12 magical-glow"
              whileHover={{ scale: 1.3, rotate: 20 }}
            />
            <p className="text-white text-xl">
              © 2025 Nourah Alotaibi. Crafted with ✨ magic ✨ in Kuwait.
            </p>
            <motion.img 
              src={graduationCapMasters} 
              alt="AI" 
              className="w-12 h-12 magical-glow"
              whileHover={{ scale: 1.3, rotate: -20 }}
            />
          </div>
          <p className="text-purple-200 text-lg">
            Building the future of AI in healthcare and education, one magical project at a time.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

