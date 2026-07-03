import { Link } from "react-router-dom";
import { Eye, SquarePen, Camera, Trash2   } from "lucide-react";
import "./viewApartments.css";

function ViewApartments() {
  const apartments = [
    {
      id: 1,
      name: "Luxury Apartment",
      price: "₦80,000",
      capacity: "4 Guests",
      amenities: "WiFi, Pool, Kitchen",
    },
    {
      id: 2,
      name: "Executive Suite",
      price: "₦120,000",
      capacity: "6 Guests",
      amenities: "WiFi, Smart TV, Parking",
    },
    {
      id: 3,
      name: "Deluxe Apartment",
      price: "₦95,000",
      capacity: "5 Guests",
      amenities: "Kitchen, AC, Parking",
    },
  ];

  return (
    <div className="view-apartment-container">

      <div className="page-header">
        <div>
          <h1>View Apartments</h1>
          <p>Manage all available apartments.</p>
        </div>

             <Link to="/admin/apartments">
    <button type="add-btn">
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

            {apartments.map((apartment, index) => (
              <tr key={apartment.id}>
                <td>{index + 1}</td>

                <td>{apartment.name}</td>

                <td>
                  Luxury apartment with modern facilities.
                </td>

                <td>{apartment.price}</td>

                <td>{apartment.capacity}</td>

                <td>{apartment.amenities}</td>

                <td className="actions">

                  <button className="view">
                    <Eye />
                  </button>

                  <button className="edit">
                    <SquarePen />
                  </button>

                  <button className="images">
                    <Camera />
                  </button>

                  <button className="delete">
                    <Trash2 />
                  </button>

                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ViewApartments;