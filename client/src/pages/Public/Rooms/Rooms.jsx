import React, { useState } from "react";
import "./rooms.css";

const propertiesData = [
  {
    id: 1,
    title: "ToOSeA Apartment 1",
    location: "Lekki, Lagos",
    bed: 1,
    bath: 1,
    price: "NGN 100,000/night",
    img: "/toimages/jarmoluk-bathroom-2094716_1920.jpg",
    link: "/roomdetails?prop=j-luxe",
  },
  {
    id: 2,
    title: "ToOSeA Apartment 2",
    location: "Lekki, Lagos",
    bed: 1,
    bath: 1,
    price: "NGN 100,000/night",
    img: "/toimages/pexels-living-room-1835923_1920.jpg",
    link: "/roomdetails?prop=jojo-1br",
  },
  {
    id: 3,
    title: "ToOSeA Apartment 3",
    location: "Lekki, Lagos",
    bed: 2,
    bath: 2,
    price: "NGN 130,000/night",
    img: "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
    link: "/roomdetails?prop=jojo-2br",
  },
  {
    id: 4,
    title: "ToOSeA Apartment 4",
    location: "Lekki, Lagos",
    bed: 1,
    bath: 1,
    price: "NGN 255,000/night",
    img: "/toimages/keresi72-room-416049_1920.jpg",
    link: "/roomdetails?prop=ikate-4br",
  },
  {
    id: 5,
    title: "ToOSeA Apartment 5",
    location: "Lekki, Lagos",
    bed: 3,
    bath: 3,
    price: "NGN 170,000/night",
    img: "/toimages/vale_photography-building-5523630_1920.jpg",
    link: "/roomdetails?prop=fine-duplex",
  },
  {
    id: 6,
    title: "ToOSeA Apartment 6",
    location: "Lekki, Lagos",
    bed: 2,
    bath: 2,
    price: "NGN 140,000/night",
    img: "/toimages/jarmoluk-kitchen-2094737_1920.jpg",
    link: "/roomdetails?prop=sangotedo-2br",
  },
  {
    id: 7,
    title: "ToOSeA Apartment 7",
    location: "Lekki, Lagos",
    bed: 3,
    bath: 3,
    price: "NGN 160,000/night",
    img: "/toimages/backgrountwo.jpg",
    link: "/roomdetails?prop=sangotedo-3br",
  },
];

const Rooms = () => {
  const [filter, setFilter] = useState("all");

  const filteredProperties =
    filter === "all"
      ? propertiesData
      : propertiesData.filter((item) => String(item.bed) === filter);

  return (
    <div>

      {/* PAGE TITLE */}
      <section className="properties">
        <h2>Explore Our Premium Portfolio</h2>

        {/* FILTER BUTTONS */}
        <div className="filter-container">
          {["all", "1", "2", "3"].map((type) => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? "active" : ""}`}
              onClick={() => setFilter(type)}
            >
              {type === "all" ? "All" : `${type} Bedroom`}
            </button>
          ))}
        </div>

        {/* PROPERTY GRID */}
        <div className="property-grid">
          {filteredProperties.map((item) => (
            <div key={item.id} className="property-card">
              <img src={item.img} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.location}</p>
              <p>
                {item.bed} Bed | {item.bath} Bath
              </p>
              <span>{item.price}</span>
              <a href={item.link} className="btn">
                View Details
              </a>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Rooms;