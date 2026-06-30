'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, BookOpen, Brain, Award, ArrowRight, ChevronRight, Zap, Users, BarChart3 } from 'lucide-react'
import { DISASTER_TYPES } from '@/lib/constants'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DisasterPrep EDU
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#modules" className="hover:text-blue-600 transition-colors">Modules</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </Link>

          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="gradient-hero absolute inset-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-400 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Empowering Schools with Life-Saving Knowledge
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Learn. Prepare.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Survive.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The most comprehensive disaster preparedness education platform for schools and colleges.
            Interactive modules, virtual drills, and gamified learning that saves lives.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/admin"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-1"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { label: 'Students', value: '50K+' },
              { label: 'Modules', value: '8' },
              { label: 'Schools', value: '200+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need to stay{' '}
              <span className="gradient-text">prepared</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              A complete educational ecosystem designed for schools, teachers, and students.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: BookOpen, title: 'Interactive Modules', description: '8 comprehensive disaster education modules with rich content including causes, warning signs, and survival techniques.', color: 'blue' },
              { icon: Brain, title: 'Virtual Drills', description: 'Immersive scenario-based simulations where students practice life-saving decisions in realistic disaster situations.', color: 'purple' },
              { icon: Award, title: 'Gamified Learning', description: 'XP points, badges, achievements, leaderboards, and certificates that motivate continuous learning.', color: 'amber' },
              { icon: Users, title: 'Multi-Role Platform', description: 'Dedicated dashboards for students, teachers, and administrators with role-specific tools.', color: 'green' },
              { icon: BarChart3, title: 'Analytics Dashboard', description: 'Comprehensive analytics tracking preparedness scores, quiz performance, and drill participation.', color: 'indigo' },
              { icon: Shield, title: 'Emergency Alerts', description: 'Real-time emergency notifications from administrators to students with priority-based alert system.', color: 'red' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="glass-card rounded-2xl p-6 card-hover group"
              >
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Disaster Modules */}
      <section id="modules" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              8 Critical Disaster Modules
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Comprehensive coverage of disasters that affect Indian schools and communities.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {DISASTER_TYPES.map((disaster, i) => (
              <motion.div
                key={disaster.type}
                variants={fadeUp}
                className="relative group cursor-pointer rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-transparent transition-all duration-300 hover:shadow-xl overflow-hidden card-hover"
                style={{ '--color': disaster.color } as React.CSSProperties}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ background: disaster.color }}
                />
                <div className="text-4xl mb-3">{disaster.emoji}</div>
                <div className="font-semibold text-slate-900 dark:text-white">{disaster.label}</div>
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Learn more <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Ready to prepare your school?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of students and teachers already building life-saving preparedness skills.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-700 font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            Enter Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">DisasterPrep EDU</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2024 DisasterPrep EDU. Empowering schools with life-saving knowledge.
          </p>
        </div>
      </footer>
    </div>
  )
}
