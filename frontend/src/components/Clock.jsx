import React, { useState, useEffect } from "react";

const Clock = () => {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();

            // Format time
            setTime(now.toLocaleTimeString());


            const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
            setDate(now.toLocaleDateString("en-US", options));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col ml-96 pl-28 w-full text-white ">
            <p className="text-4xl  self-end ">{time}</p>
            <p className="text-lg self-end">{date}</p>
        </div>
    );
};

export default Clock;