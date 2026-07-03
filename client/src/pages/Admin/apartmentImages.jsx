import { Link } from "react-router-dom";
import "./imageApartments.css";

function ApartmentImages() {
  return (
    <div className="container">
      <h1>Apartment Images</h1>

      <form>

        <div className="form-group">
          <label>Upload Apartment Images</label>

          <input
            type="file"
            multiple
            accept="image/*"
          />
        </div>

        <div className="buttons">

          <Link to="/admin/apartments">
    <button type="button">
        Previous
    </button>
</Link>

          <button type="submit">
            Create Apartment
          </button>

        </div>

      </form>
    </div>
  );
}

export default ApartmentImages;