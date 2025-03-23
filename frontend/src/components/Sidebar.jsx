import React, { useState } from "react";
import { Menu, Home, ClipboardList, UserCheck, Settings, BellRing, BadgeInfo } from "lucide-react";

const Button = ({ children, className, ...props }) => (
  <button className={`btn btn-ghost w-full text-left flex items-center h-12 px-4 ${className}`} {...props}>
    {children}
  </button>
);

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div style={{ backgroundColor: '#064979', color: "white" }} className={`h-screen ${isOpen ? "w-64" : "w-20"} p-4 transition-all flex flex-col`}>      
      <Button onClick={() => setIsOpen(!isOpen)} className="mb-6 bg-white text-black rounded-lg drop-shadow-lg">
        <Menu className="mr-2" /> {isOpen && "Menu"}
      </Button>
      
      <nav className="flex flex-col space-y-3">
        <NavItem icon={<Home />} label="Dashboard" isOpen={isOpen} />
        <NavItem icon={<ClipboardList />} label="Past Audits" isOpen={isOpen} />
        <NavItem icon={<UserCheck />} label="Your Availability" isOpen={isOpen} />
        <NavItem icon={<BellRing />} label="Notifications" isOpen={isOpen} />
        <NavItem icon={<BadgeInfo />} label="Help" isOpen={isOpen} />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, isOpen }) => (
  <Button className="bg-white text-black rounded-lg drop-shadow-lg">
    {icon}
    {isOpen && <span className="ml-2">{label}</span>}
  </Button>
);

export default Sidebar;