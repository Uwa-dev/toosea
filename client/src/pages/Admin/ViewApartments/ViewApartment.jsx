import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Camera} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAllApartments } from "../../../services/apartmentApi";

import "./viewApartments.css";

function ViewApartments() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchApartments = async () => {
    try {
      setLoading(true);

      const data = await getAllApartments();

      setApartments(data.apartments);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch apartments."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleView = (apartment) => {
    navigate(`/admin/apartment/${apartment._id}`);
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  return (
    <div className="view-apartment-container">
      <div className="page-header">
        <div>
          <h1>View Apartments</h1>
          <p>Manage all available apartments.</p>
        </div>

        <Link to="/admin/apartments">
          <button className="add-btn">
            + Create Apartment
          </button>
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Capacity</th>
              <th>Amenities</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Loading apartments...
                </td>
              </tr>
            ) : apartments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No apartments found.
                </td>
              </tr>
            ) : (
              apartments.map((apartment, index) => (
                <tr key={apartment._id}>
                  <td>{index + 1}</td>

                  <td>{apartment.name}</td>

                  <td>
                    {apartment.description.length > 60
                      ? apartment.description.substring(0, 60) + "..."
                      : apartment.description}
                  </td>

                  <td>
                    ₦{apartment.pricePerNight.toLocaleString()}
                  </td>

                  <td>
                    {apartment.capacity} Guest
                    {apartment.capacity > 1 ? "s" : ""}
                  </td>

                  <td>
                    {apartment.amenities.join(", ")}
                  </td>

                  <td className="actions">
                    <button className="view" onClick={() => handleView(apartment)}>
                      <Eye size={18} />
                    </button>

                      <button
                        className="images"
                        onClick={() =>
                          navigate(
                            `/admin/apartment/${apartment._id}/images`
                          )
                        }
                        title="Manage images"
                      >
                        <Camera size={18} />
                      </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewApartments;