/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Twitter } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 relative overflow-hidden selection:bg-neon-blue selection:text-black">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-blue/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-pink/5 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
        
        {/* Header / Sidebar Info */}
        <div className="lg:col-span-3 flex flex-col justify-between py-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-orbitron font-black tracking-tighter leading-none mb-2">
                NEON<br />
                <span className="neon-text-blue">RHYTHM</span><br />
                SNAKE
              </h1>
              <div className="h-1 w-12 bg-neon-pink rounded-full mb-4 shadow-[0_0_10px_rgba(255,0,255,0.8)]" />
              <p className="text-white/40 text-sm font-medium leading-relaxed max-w-[200px]">
                A multisensory arcade experience powered by synthwave frequencies and high-dexterity gameplay.
              </p>
            </div>

            <div className="space-y-4">
              <div className="glass p-4 rounded-2xl border-white/5 space-y-2">
                <span className="text-[10px] font-orbitron font-bold tracking-widest text-neon-blue uppercase">Control Scheme</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px] bg-white/5 p-2 rounded-lg text-white/60">⌨️ Arrows</div>
                  <div className="text-[10px] bg-white/5 p-2 rounded-lg text-white/60">👆 Swipes</div>
                </div>
              </div>
            </div>
          </motion.div>

          <footer className="mt-8 lg:mt-0 flex gap-4 text-white/20">
            <Github size={20} className="hover:text-neon-blue cursor-pointer transition-colors" />
            <Twitter size={20} className="hover:text-neon-pink cursor-pointer transition-colors" />
          </footer>
        </div>

        {/* Game Center */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-[500px]"
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Music Console */}
        <div className="lg:col-span-3 flex items-start justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full"
          >
            <div className="flex flex-col gap-6">
              <MusicPlayer />
              
              {/* Extra Widget */}
              <div className="glass p-6 rounded-3xl border-white/5 neon-border bg-gradient-to-br from-cyber-gray/20 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_10px_#39ff14]" />
                  <span className="text-[10px] font-orbitron tracking-widest text-white/60 uppercase">System Status</span>
                </div>
                <div className="space-y-3">
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-neon-blue h-full" 
                      animate={{ width: ["20%", "80%", "40%"] }} 
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-neon-pink h-full" 
                      animate={{ width: ["60%", "30%", "90%"] }} 
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />
                  </div>
                </div>
                <p className="mt-4 text-[10px] text-white/30 font-mono">CONNECTION: STABLE<br />FPS: 60.0<br />LATENCY: 12ms</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Decorative Text */}
      <div className="fixed bottom-0 left-0 w-full pointer-events-none overflow-hidden whitespace-nowrap opacity-5 z-0 select-none">
        <span className="text-[20vh] font-orbitron font-black text-white px-20">ARCADE ARCADE ARCADE ARCADE ARCADE</span>
      </div>
    </div>
  );
}
