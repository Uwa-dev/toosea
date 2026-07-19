import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, SquarePen, Camera, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { getAllApartments } from "../../../services/apartmentApi";

import "./viewApartments.css";

function ViewApartments() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

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
                    <button className="view">
                      <Eye size={18} />
                    </button>

                    <button className="edit">
                      <SquarePen size={18} />
                    </button>

                    <button className="images">
                      <Camera size={18} />
                    </button>

                    <button className="delete">
                      <Trash2 size={18} />
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