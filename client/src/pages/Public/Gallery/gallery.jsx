import { useEffect } from "react";
import "./gallery.css";

import hotel1 from "../../../images/hote1.jpg";
import hotel2 from "../../../images/hote2.jpg";
import hotel3 from "../../../images/hote3.jpg";
import hotel4 from "../../../images/hote4.jpg";
import hotel5 from "../../../images/hote5.jpg";
import hotel6 from "../../../images/hote6.jpg";
import hotel7 from "../../../images/hote7.jpg";
import hotel8 from "../../../images/hote8.jpg";
import hotel9 from "../../../images/hote9.jpg";
import hotel10 from "../../../images/hote11.jpg";
import hotel11 from "../../../images/hote12.jpg";
import hotel12 from "../../../images/hote13.jpg";
import hotel13 from "../../../images/hote14.jpg";
import hotel14 from "../../../images/hote15.jpg";
import hotel15 from "../../../images/hote16.jpg";
import hotel16 from "../../../images/hote17.jpg";
import hotel17 from "../../../images/hote18.jpg";


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
      <section className="hero">
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