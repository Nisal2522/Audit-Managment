
import { Menu, Search, Grid } from "lucide-react";
import logo from "../assets/logo.png";

 function NavBar() {
    return (
        <nav style={{ backgroundColor: '#064979 ', color:"white"}} className="flex items-center justify-between text-white p-4 ">
           
            <div className="flex items-center gap-3">

                <img src={logo} alt="Logo" className="w-10 h-10" />
                <span className="text-xl font-semibold text-blue-400">AuditFlow</span>
            </div>

           
            <div className="flex items-center gap-4">
                <button className="text-white hover:text-gray-400">
                    <Search size={20} />
                </button>
                <button className="text-white hover:text-gray-400">
                    <Grid size={20} />
                </button>
                <img
                    src="https://via.placeholder.com/32"
                    alt="Profile"
                    className="w-8 h-8 rounded-full cursor-pointer"
                />
            </div>
        </nav>
    );
}

export default NavBar;