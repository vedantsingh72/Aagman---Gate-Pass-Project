import React from "react";
import { Link } from "react-router-dom";
import GlobalHeader from "../components/common/GlobalHeader";
import {
  Github,
  Linkedin,
  Mail,
  ArrowLeft,
  Code,
  Terminal,
  Monitor,
  Server,
  Cpu
} from "lucide-react";

import shashankImage from "../images/shashank.png";
import vedantImage from "../images/vedant.png";

const NoiseOverlay = () => (
  <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03] mix-blend-overlay">
    <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-pulse" />
  </div>
);

const HexGrid = () => (
  <div className="fixed inset-0 z-0 bg-[#030014]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0),rgba(5,5,10,1))]" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
  </div>
);

const TechPill = ({ icon: Icon, label, theme }) => (
  <div
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.border} bg-black/50 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider ${theme.text}`}
  >
    <Icon size={12} />
    {label}
  </div>
);

const MonolithCard = ({ profile, align }) => {
  const isFrontend = profile.type === "frontend";

  const theme = isFrontend
    ? {
        border: "border-cyan-500/30",
        text: "text-cyan-400",
        bg: "bg-cyan-950/10",
        gradient: "from-cyan-500 to-blue-600",
        glow: "shadow-[0_0_30px_rgba(6,182,212,0.15)]",
        icon: Monitor
      }
    : {
        border: "border-purple-500/30",
        text: "text-purple-400",
        bg: "bg-purple-950/10",
        gradient: "from-purple-500 to-indigo-600",
        glow: "shadow-[0_0_30px_rgba(168,85,247,0.15)]",
        icon: Server
      };

  return (
    <div
      className={`relative w-full max-w-6xl mx-auto flex flex-col ${
        align === "right" ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-stretch gap-0 lg:gap-8 group mb-24`}
    >
      <div className="lg:w-2/5 relative h-[500px] lg:h-[600px] overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-10 mix-blend-screen`}
        ></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2">
            <div
              className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-20 blur-2xl rounded-full`}
            ></div>

            <img
              src={profile.image}
              alt={profile.name}
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
          <span className="text-xs font-mono text-purple-400">
            {profile.handle}
          </span>

          <h2 className="text-4xl lg:text-5xl font-black text-white uppercase">
            {profile.name}
          </h2>
        </div>
      </div>

      <div className="lg:w-3/5 flex flex-col justify-center py-8 lg:py-12 relative">
        <div
          className={`relative z-10 p-8 lg:p-12 rounded-3xl border ${theme.border} ${theme.bg} backdrop-blur-xl ${theme.glow}`}
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3
                className={`text-sm font-bold uppercase ${theme.text} mb-2 flex items-center gap-2`}
              >
                <theme.icon size={16} />
                {profile.role}
              </h3>

              <h4 className="text-2xl text-white font-light">
                {profile.tagline}
              </h4>
            </div>

            <Code size={40} className={`opacity-20 ${theme.text}`} />
          </div>

          <p className="text-slate-400 leading-relaxed text-sm mb-6">
            {profile.bio}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {profile.tech.map((item, idx) => (
              <TechPill key={idx} icon={item.icon} label={item.label} theme={theme} />
            ))}
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-white/5">
            <span className="text-xs font-bold text-slate-500 uppercase">
              Connect
            </span>

            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
            >
              <Github size={18} />
            </a>

            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
            >
              <Linkedin size={18} />
            </a>

            <a
              href={`mailto:${profile.links.email}`}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Creator = () => {
  const profiles = [
    {
      id: 1,
      type: "backend",
      name: "Vedant Singh",
      handle: "@vedant_sys",
      role: "Backend Engineer",
      tagline: "Building the logic that powers the world.",
      image: vedantImage,
      bio:
        "Backend developer focused on building scalable systems, secure APIs, and reliable server architectures.",
      tech: [
        { icon: Server, label: "Node.js" },
        { icon: Terminal, label: "MongoDB" },
        { icon: Cpu, label: "REST API" }
      ],
      links: {
        github: "https://github.com/vedantsingh72",
        linkedin: "https://www.linkedin.com/in/vedant-singh-3a321a319",
        email: "24cs3063@rgipt.ac.in"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <HexGrid />
      <NoiseOverlay />

      <div className="relative z-10">
        <GlobalHeader />

        <div className="container mx-auto px-4 py-32">
          <div className="text-center mb-32">
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter">
              CREATORS
            </h1>
          </div>

          <div className="space-y-12">
            {profiles.map((profile, index) => (
              <MonolithCard
                key={profile.id}
                profile={profile}
                align={index % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>

          <div className="mt-32 text-center border-t border-white/5 pt-12">
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform"
            >
              <ArrowLeft size={20} />
              Exit to Mainframe
            </Link>

            <p className="mt-8 text-slate-600 font-mono text-xs">
              SECURE CONNECTION • ENCRYPTED • 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Creator;