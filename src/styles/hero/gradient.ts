import { HeroSection } from "../../types";

export const GradientHeroes: HeroSection[] = [
  {
    id: "gradient-1",
    name: "Gradient Hero 1",
    component: `
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1600&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Beautiful Gradient Background
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10">
              Create stunning interfaces with smooth color transitions that catch the eye and enhance your brand presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-purple-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Get Started
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
      </section>
    `,
  },
  {
    id: "gradient-2",
    name: "Gradient Hero 2",
    component: `
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-blue-500">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:3rem_3rem]"></div>
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-400 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-yellow-300 opacity-20 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 relative z-10">
          <div className="md:flex items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Elevate Your Digital Experience
              </h1>
              <p className="text-xl text-white/80 max-w-xl mb-8">
                Our platform combines powerful features with an intuitive interface to help you achieve your goals faster.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-white text-emerald-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="md:w-5/12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80" 
                  alt="Dashboard Preview" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: "gradient-3",
    name: "Gradient Hero 3",
    component: `
      <section className="relative overflow-hidden bg-gradient-to-bl from-rose-500 via-fuchsia-500 to-indigo-500">
        <div className="absolute inset-0 mix-blend-multiply bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
                Introducing Our New Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your Workflow
              </h1>
              <p className="text-xl text-white/80 max-w-xl mb-8">
                Streamline your process, boost productivity, and achieve better results with our innovative solution.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <button className="px-8 py-3 bg-white text-fuchsia-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Free Trial
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300">
                  Learn More
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User" />
                </div>
                <span className="text-white/80 text-sm">Join 10,000+ users</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-white/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" 
                  alt="App Interface" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
  },
];