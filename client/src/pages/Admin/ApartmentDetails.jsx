import { Link } from "react-router-dom";

import "./apartmentz.css";

function ApartmentDetails() {
  return (
    <div className="container">
       <div className="form-header">
        <h1>Create Apartment</h1>
        <p>Fill in the apartment information before proceeding to upload images.</p>
    </div>

      <form>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Apartment Name"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="5"
            placeholder="Apartment Description"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Price (₦)</label>
          <input
            type="number"
            placeholder="50000"
          />
        </div>

        <div className="form-group">
          <label>Capacity</label>
          <input
            type="number"
            placeholder="4 Guests"
          />
        </div>

        <div className="form-group">
          <label>Amenities</label>

          <div className="checkboxes">

            <label>
              <input type="checkbox" />
              WiFi
            </label>

            <label>
              <input type="checkbox" />
              Swimming Pool
            </label>

            <label>
              <input type="checkbox" />
              Air Conditioning
            </label>

            <label>
              <input type="checkbox" />
              Kitchen
            </label>

            <label>
              <input type="checkbox" />
              Parking
            </label>

            <label>
              <input type="checkbox" />
              Smart TV
            </label>

          </div>
        </div>

        <Link to="/admin/apartments/images">
    <button type="button">
        Next
    </button>
</Link>

      </form>
    </div>
  );
}

export default ApartmentDetails;