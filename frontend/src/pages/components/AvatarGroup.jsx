import React from "react";
import avatar1 from "../../assets/Project-Creator/avatar1.jpeg";
import avatar2 from "../../assets/Project-Creator/avatar2.jpeg";
import avatar3 from "../../assets/Project-Creator/avatar3.jpeg";

const AvatarGroup = ({ names }) => {
    // Array of avatars with imported image paths
    const avatars = [
        { src: avatar1, alt: "Avatar 1" },
        { src: avatar2, alt: "Avatar 2" },
        { src: avatar3, alt: "Avatar 3" },
    ];

    return (
        <div className="flex items-center pt-3">
            <div className="relative flex space-x-[-10px]"> {/* Adjust the negative margin */}
                {avatars.map((avatar, index) => (
                    <div key={index} className="relative z-[${5 - index}]"> {/* Adjust z-index */}
                        <img
                            src={avatar.src}
                            alt={avatar.alt}
                            className="w-8 h-8 rounded-full border-4 border-[#02090D] bg-[#02090D]"
                        />
                    </div>
                ))}
            </div>
            <div className="ml-4">
                <p className="text-white font-semibold">
                    {names.slice(0, 3).join(", ")} +{names.length - 3} others
                </p>
            </div>
        </div>
    );
};

export default AvatarGroup;