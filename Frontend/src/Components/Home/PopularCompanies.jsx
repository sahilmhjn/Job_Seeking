
import React from "react";
import { FaMicrosoft, FaApple, FaMoon, FaGoogle, FaSun, FaMars } from "react-icons/fa";
import { SiDeutschebank, } from "react-icons/si";

const PopularCompanies = () => {
  const companies = [
    {
      id: 1,
      title: "Microsoft",
      location: "Street 10 Nodia, UttarPradesh, India",
      openPositions: 10,
      icon: <FaMicrosoft />,
    },
    {
      id: 2,
      title: "Google India",
      location: "Street 10 Banglore, India",
      openPositions: 5,
      icon: <FaGoogle />,
    },
    {
      id: 3,
      title: "DBOI",
      location: "Street 5 Pune, India",
      openPositions: 20,
      icon: <SiDeutschebank />,
    },
  ];
  return (
    <div className="companies">
      <div className="container">
        <h3>TOP COMPANIES</h3>
        <div className="banner">
          {companies.map((element) => {
            return (
              <div className="card" key={element.id}>
                <div className="content">
                  <div className="icon">{element.icon}</div>
                  <div className="text">
                    <p>{element.title}</p>
                    <p>{element.location}</p>
                  </div>
                </div>
                <button>Open Positions {element.openPositions}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularCompanies;
