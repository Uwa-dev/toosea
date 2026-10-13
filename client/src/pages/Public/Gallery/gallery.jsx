import { useEffect } from "react";


import hotel1 from "../../../images/gal31.jpg";
import hotel2 from "../../../images/gal2.jpg";
import hotel3 from "../../../images/gal3.jpg";
import hotel4 from "../../../images/gal4.jpg";
import hotel5 from "../../../images/gal5.jpg";
import hotel6 from "../../../images/gal6.jpg";
import hotel7 from "../../../images/gal7.jpg";
import hotel8 from "../../../images/gal8.jpg";
import hotel9 from "../../../images/gal9.jpg";
import hotel10 from "../../../images/gal10.jpg";
import hotel11 from "../../../images/gal11.jpg";
import hotel12 from "../../../images/gal12.jpg";
import hotel13 from "../../../images/gal.jpg";
import hotel14 from "../../../images/gal14.jpg";
import hotel15 from "../../../images/gal15.jpg";
import hotel16 from "../../../images/hote17.jpg";
import hotel17 from "../../../images/hote18.jpg";

import "./gallery.css";


export default function Gallery() {
  useEffect(() => {
    // Scroll reveal animation
    const items = document.querySelectorAll(".gallery-item");

    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;

      items.forEach((item) => {
        const elementTop = item.getBoundingClientRect().top;
        const revealPoint = 150;

        if (elementTop < windowHeight - revealPoint) {
          item.classList.add("show");
        }
      });
    };

    window.addEventListener("scroll", revealOnScroll);
    window.addEventListener("load", revealOnScroll);

    return () => {
      window.removeEventListener("scroll", revealOnScroll);
      window.removeEventListener("load", revealOnScroll);
    };
  }, []);

  return (
    <>
  

      {/* HERO */}
      <section className="heroooo">
        {/* <h1>Luxury Experience Gallery</h1> */}
      </section>

      {/* GALLERY */}
      <section className="gallery">
        {[
  { img: hotel1, side: "from-left" },
  { img: hotel2, side: "from-right" },
  { img: hotel3, side: "from-left" },
  { img: hotel4, side: "from-right" },
  { img: hotel5, side: "from-left" },
  { img: hotel6, side: "from-right" },
  { img: hotel7, side: "from-left" },
  { img: hotel8, side: "from-right" },
  { img: hotel9, side: "from-left" },
  { img: hotel10, side: "from-right" },
  { img: hotel11, side: "from-left" },
  { img: hotel12, side: "from-right" },
  { img: hotel13, side: "from-left" },
  { img: hotel14, side: "from-right" },
  { img: hotel15, side: "from-left" },
  { img: hotel16, side: "from-right" },
  { img: hotel17, side: "from-left" }
        ].map((item, index) => (
          <div key={index} className={`gallery-item ${item.side}`}>
            <img src={item.img} alt="Gallery" />
          </div>
        ))}
      </section>

    
    </>
  );
}