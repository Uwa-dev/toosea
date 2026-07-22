import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllApartments } from "../../../services/apartmentApi";
import "./dashboard.css";
import "./newsletter.css";


const  Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [apartments, setApartments] = useState([]);
  const [loadingApartments, setLoadingApartments] = useState(true);

  const slides = [
    "./toimages/background.jpg",
    "./toimages/backgrountwo.jpg",
    "./toimages/jarmoluk-bathroom-2094716_1920.jpg",
    "./toimages/jarmoluk-kitchen-2094723_1920 (1).jpg"
  ];

  /* --- HERO SLIDER --- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoadingApartments(true);

        const data = await getAllApartments();

        console.log("API Response:", data);

        const allApartments = data.apartments;

        const available = allApartments.filter(
          (apartment) => apartment.isActive
        );

        const unavailable = allApartments.filter(
          (apartment) => !apartment.isActive
        );

        // Show available first, then unavailable
        const featured = [...available, ...unavailable].slice(0, 6);

        setApartments(featured);

      } catch (error) {
        console.log(error);
      } finally {
        setLoadingApartments(false);
      }
    };

    fetchApartments();
  }, []);

  // about slider

  useEffect(() => {

    const reveals = document.querySelectorAll(
      ".reveal-left, .reveal-right"
    );

    const observer = new IntersectionObserver(

      (entries) => {

        entries.forEach((entry)=>{

          if(entry.isIntersecting){

            entry.target.classList.add("active");

          }else{

            entry.target.classList.remove("active");

          }

        });

      },

      {
        threshold:0.25
      }

    );

    reveals.forEach(item=>observer.observe(item));

    return ()=>observer.disconnect();

  },[]);

  // attraction

  useEffect(() => {

      const title=document.querySelector(".reveal-title");

      const cards=document.querySelectorAll(".attraction-card");

      const observer=new IntersectionObserver(

          (entries)=>{

              entries.forEach(entry=>{

                  if(entry.isIntersecting){

                      if(entry.target.classList.contains("reveal-title")){

                          entry.target.classList.add("active");

                      }else{

                          entry.target.classList.add("show");

                      }

                  }else{

                      if(entry.target.classList.contains("reveal-title")){

                          entry.target.classList.remove("active");

                      }else{

                          entry.target.classList.remove("show");

                      }

                  }

              });

          },

          {

              threshold:.2

          }

      );

      observer.observe(title);

      cards.forEach(card=>observer.observe(card));

      return ()=>observer.disconnect();

  },[]);

  // services

  useEffect(() => {

      const cards=document.querySelectorAll(".service-card");

      const observer=new IntersectionObserver(

          (entries)=>{

              entries.forEach(entry=>{

                  if(entry.isIntersecting){

                      entry.target.classList.add("show");

                  }else{

                      entry.target.classList.remove("show");

                  }

              });

          },

          {

              threshold:.25

          }

      );

      cards.forEach(card=>observer.observe(card));

      return ()=>observer.disconnect();

  },[]);

  // apartment

  useEffect(() => {

      const cards = document.querySelectorAll(".property-card");

      const observer = new IntersectionObserver(

          (entries) => {

              entries.forEach((entry) => {

                  if(entry.isIntersecting){

                      entry.target.classList.add("show");

                  }else{

                      entry.target.classList.remove("show");

                  }

              });

          },

          {

              threshold:.2

          }

      );

      cards.forEach(card => observer.observe(card));

      return () => observer.disconnect();

  },[]);

  // review

  useEffect(() => {

      const title = document.querySelector(".reviews-title");

      const cards = document.querySelectorAll(".review-card");

      const observer = new IntersectionObserver(

          (entries) => {

              entries.forEach((entry) => {

                  if (entry.isIntersecting) {

                      entry.target.classList.add("show");

                  } else {

                      entry.target.classList.remove("show");

                  }

              });

          },

          {

              threshold:0.2

          }

      );

      observer.observe(title);

      cards.forEach(card => observer.observe(card));

      return () => observer.disconnect();

  },[]);

  // newsletter

  useEffect(() => {

      const newsletter=document.querySelector(".reveal-newsletter");

      const observer=new IntersectionObserver(

          (entries)=>{

              entries.forEach(entry=>{

                  if(entry.isIntersecting){

                      entry.target.classList.add("show");

                  }else{

                      entry.target.classList.remove("show");

                  }

              });

          },

          {

              threshold:.3

          }

      );

      observer.observe(newsletter);

      return ()=>observer.disconnect();

  },[]);

  /* --- PROPERTY FILTER --- */
  const handleFilter = (filter) => {
    const cards = document.querySelectorAll(".property-card");
    cards.forEach((card) => {
      if (filter === "all" || card.dataset.bed === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  };

  /* --- PROPERTY DETAIL GALLERY --- */
  const changeSlide = (src) => {
    const main = document.getElementById("galleryMain");
    if (main) main.src = src;
  };

  return (
    <>
     

      {/* HERO */}
      <section className="hero">
        <div className="hero-slider">
          {slides.map((img, i) => (
            <img
              key={i}
              src={img}
              className={`slide ${i === currentSlide ? "active" : ""}`}
              alt="Luxury Shortlet"
            />
          ))}
        </div>

        <div className="hero-content">
          <h1>Luxury comfort in the heart of Lagos Island</h1>
          <p>
            ToOseA provides a stylish Airbnd experience with modern amenities,
            exceptional hospitality, and easy access to the city's top destinations
            which is perfect for business trips,weekend getaways, and unforgettable stays.
          </p>

          <div className="hero-buttons">
            <Link to="/rooms" className="btn">
              Explore Apartments
            </Link>
            
          </div>

          {/* <div className="trust-indicators">
            <div>✔ Secure Payment Handling</div>
            <div>✔ CAC Certified</div>
            <div>✔ SCUML Compliant</div>
            <div>✔ Exceptional Customer Service</div>
          </div> */}

        </div>
      </section>

      {/* ================= ABOUT ================= */}

      <section className="about">

        <div className="about-left reveal-left">
          <span className="about-tag">WELCOME TO TOOSEA</span>

          <h2>Luxury Living, Exceptional Hospitality</h2>

          <p>
            ToOSeA Shortlet is a premium provider of luxury apartments and short-stay
            accommodation, offering comfort, elegance, and a home-away-from-home
            experience for business and leisure travellers.
          </p>

          <Link to="/rooms" className="btn">
            Explore Luxury
          </Link>
        </div>

        <div className="about-right reveal-right">

          <div className="about-box">
            <h3>Premium Comfort</h3>
            <p>
              Beautifully furnished apartments designed with luxury and relaxation
              in mind.
            </p>
          </div>

          <div className="about-box">
            <h3>Prime Location</h3>
            <p>
              Situated close to major attractions, beaches, shopping malls and
              business districts.
            </p>
          </div>

          <div className="about-box">
            <h3>Trusted Service</h3>
            <p>
              Managed by Empirean Heights Ltd., fully compliant with CAC, FIRS and
              SCUML regulations.
            </p>
          </div>

        </div>

      </section>

      {/* ================= ATTRACTIONS ================= */}

      <section className="attractions">

        <h2 className="reveal-title">Nearby Attractions</h2>

        <div className="attraction-grid">

          <div className="attraction-card">
            <img src="./toimages/lufasi-park.jpg" alt="LUFASI Nature Park" />
            <h3>LUFASI Nature Park</h3>
            <p>
              Beautiful wildlife park with nature trails and family activities.
            </p>
          </div>

          <div className="attraction-card">
            <img
              src="./toimages/lekkicon.jpg"
              alt="Lekki Conservation Centre"
            />
            <h3>Lekki Conservation Centre</h3>
            <p>
              Experience Africa's famous canopy walkway and serene nature reserve.
            </p>
          </div>

          <div className="attraction-card">
            <img src="./toimages/novare-mall.jpg" alt="Novare Lekki Mall" />
            <h3>Novare Lekki Mall</h3>
            <p>
              Shopping, restaurants, cinema, and entertainment just minutes away.
            </p>
          </div>

          <div className="attraction-card">
            <img src="./toimages/atican-beach.jpg" alt="Atican Beach" />
            <h3>Atican Beach</h3>
            <p>
              One of Lagos' most peaceful beaches for relaxation and fun.
            </p>
          </div>

          <div className="attraction-card">
            <img
              src="./toimages/lekki-art-market.jpg"
              alt="Lekki Arts & Crafts Market"
            />
            <h3>Lekki Arts & Crafts Market</h3>
            <p>
              Discover authentic Nigerian art, souvenirs, and handcrafted items.
            </p>
          </div>

          <div className="attraction-card">
            <img src="./toimages/omu-resort.jpg" alt="Omu Resort" />
            <h3>Omu Resort</h3>
            <p>
              A complete family destination featuring a zoo, amusement park, and
              water activities.
            </p>
          </div>

          <div className="attraction-card">
            <img
              src="./toimages/lakowe-golf.jpg"
              alt="Lakowe Lakes Golf Estate"
            />
            <h3>Lakowe Lakes Golf Estate</h3>
            <p>
              Premium golf course with lakeside scenery and luxury ambience.
            </p>
          </div>

          <div className="attraction-card">
            <img src="./toimages/eleko-beach.jpg" alt="Eleko Beach" />
            <h3>Eleko Beach</h3>
            <p>
              Enjoy a quieter beach experience with ocean views and fresh seafood.
            </p>
          </div>

        </div>

      </section>

      <section className="services">

        <h2 className="services-title">Our Services</h2>

        <div className="service-grid">

          <div className="service-card">
            <div className="card">
              <i style={{ fontSize: "60px" }} className="fas fa-car"></i><br />
              <h3>Free Parking</h3>
              <p>
                Enjoy secure and spacious parking at no extra cost throughout your stay.
              </p>
            </div>
          </div>

          <div className="service-card">
            <div className="card">
              <i style={{ fontSize: "60px" }} className="fas fa-spa"></i><br />
              <h3>Luxury Spa</h3>
              <p>
                Rejuvenate your body and mind with our premium spa treatments designed
                for total relaxation.
              </p>
            </div>
          </div>

          <div className="service-card">
            <div className="card">
              <i style={{ fontSize: "60px" }} className="fas fa-tree"></i><br />
              <h3>Garden Lounge</h3>
              <p>
                Relax in our serene outdoor garden space perfect for quiet moments
                and social gatherings.
              </p>
            </div>
          </div>

          <div className="service-card">
            <div className="card">
              <i style={{ fontSize: "60px" }} className="fas fa-champagne-glasses"></i><br />
              <h3>Event Space</h3>
              <p>
                Host memorable events in our elegant and fully equipped event space.
              </p>
            </div>
          </div>

        </div>

      </section>
    

      {/* ================= FEATURED APARTMENTS ================= */}

      <section className="properties">

        <h2 className="properties-title">
          Featured Luxury Apartments
        </h2>

        <div className="property-grid">
          {loadingApartments ? (
            <p>Loading apartments...</p>
          ) : apartments.length === 0 ? (
            <p>No apartments available.</p>
          ) : (
            apartments.slice(0, 8).map((apartment) => (
              <div
                key={apartment._id}
                className="property-card"
              >
                <img
                  src={
                    apartment.images?.[0]?.imageUrl ||
                    "/toimages/room1.jpg"
                  }
                  alt={apartment.name}
                />

                <div
                  className={`availability-badge ${
                    apartment.isActive
                      ? "available"
                      : "booked"
                  }`}
                >
                  {apartment.isActive
                    ? "Available"
                    : "Booked"}
                </div>

                <div className="property-content">
                  <h3>{apartment.name}</h3>

                  <p>
                    <i className="fas fa-map-marker-alt"></i>{" "}
                    {apartment.location || "Lekki, Lagos"}
                  </p>

                  <span>
                    ₦
                    {(apartment.pricePerNight || 0).toLocaleString()}
                    /night
                  </span>

                  <Link
                    to={`/roomdetails/${apartment._id}`}
                    className="btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

      </section>

      {/* ================= CUSTOMER REVIEWS ================= */}

      <section className="reviews">

        <h2 className="reviews-title">
          What Our Guests Say
        </h2>

        <div className="reviews-grid">

          <div className="review-card">

            <div className="stars">
              ★★★★★
            </div>

            <p>
              "ToOSeA Apartment exceeded all our expectations. The apartment was
              spotless, beautifully furnished, and located in a peaceful
              environment. The staff were friendly and made our stay unforgettable.
              We can't wait to return!"
            </p>

            <div className="review-user">
              <h4>Sarah Johnson</h4>
              <span>Lagos, Nigeria</span>
            </div>

          </div>

          <div className="review-card">

            <div className="stars">
              ★★★★★
            </div>

            <p>
              "I stayed here during a business trip and absolutely loved it.
              Reliable Wi-Fi, constant electricity, excellent security,
              and quick customer support made my stay stress-free.
              Highly recommended for anyone visiting Lagos."
            </p>

            <div className="review-user">
              <h4>David Williams</h4>
              <span>Abuja, Nigeria</span>
            </div>

          </div>

          <div className="review-card">

            <div className="stars">
              ★★★★☆
            </div>

            <p>
              "The apartment was spacious, modern, and very clean.
              The kitchen had everything we needed and the beds were
              extremely comfortable. My family enjoyed every moment
              and we'll definitely book again."
            </p>

            <div className="review-user">
              <h4>Grace Okafor</h4>
              <span>Port Harcourt, Nigeria</span>
            </div>

          </div>

          <div className="review-card">

            <div className="stars">
              ★★★★★
            </div>

            <p>
              "This is one of the best shortlet apartments I've experienced.
              Beautiful ambience, luxurious interiors, excellent housekeeping,
              and great value for money. ToOSeA Apartment truly feels like
              a home away from home."
            </p>

            <div className="review-user">
              <h4>Michael Thompson</h4>
              <span>Accra, Ghana</span>
            </div>

          </div>

        </div>

      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="newsletter">

        <div className="newsletter-overlay">

          <div className="newsletter-content reveal-newsletter">

            <h2 className="newsletter-title">
              Stay Updated
            </h2>

            <p className="newsletter-text">
              Subscribe to our newsletter and be the first to receive exclusive
              discounts, luxury apartment offers, travel inspiration, and special
              holiday packages from ToOSeA Shortlet.
            </p>

            <form className="newsletter-form">

              <input
                className="newsletter-input"
                type="email"
                placeholder="Enter your email address"
                required
              />

            <button
              className="newsletter-btn"
              type="submit"
            >
              <span>Subscribe</span>
            </button>

            </form>

            <small className="newsletter-small">
              We respect your privacy. No spam, only exclusive offers.
            </small>

          </div>

        </div>

      </section>

    
    </>
  );
}

export default Dashboard