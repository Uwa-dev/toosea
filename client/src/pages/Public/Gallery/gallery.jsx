import { useEffect } from "react";
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
      <section className="hero">
        <h1>Luxury Experience Gallery</h1>
      </section>

      {/* GALLERY */}
      <section className="gallery">
        {[
          { img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb", side: "from-left" },
          { img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a", side: "from-right" },
          { img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", side: "from-left" },
          { img: "https://images.unsplash.com/photo-1551776235-dde6d482980b", side: "from-right" },
          { img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa", side: "from-left" },
          { img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511", side: "from-right" },
          { img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b", side: "from-left" },
          { img: "https://images.unsplash.com/photo-1501117716987-c8e1ecb210d3", side: "from-right" },
          { img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d", side: "from-left" },
          { img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461", side: "from-right" }
        ].map((item, index) => (
          <div key={index} className={`gallery-item ${item.side}`}>
            <img src={item.img} alt="Gallery" />
          </div>
        ))}
      </section>

    
    </>
  );
}