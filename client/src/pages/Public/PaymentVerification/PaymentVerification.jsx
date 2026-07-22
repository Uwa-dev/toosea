import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyPayment } from "../../../services/paymentApi";

export default function PaymentVerification() {
  const [searchParams] = useSearchParams();

  const reference = searchParams.get("reference");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const verify = async () => {
      if (!reference) {
        setResult({
          success: false,
          message: "Invalid payment reference.",
        });

        setLoading(false);
        return;
      }

      try {
        const response = await verifyPayment(reference);

        setResult(response);
      } catch (error) {
        setResult({
          success: false,
          message:
            error.response?.data?.message ||
            "Unable to verify payment.",
        });
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [reference]);

  if (loading) {
    return (
      <section className="payment-verification">
        <div className="verification-card">
          <h2>Verifying Payment...</h2>
          <p>Please wait while we confirm your payment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="payment-verification">
      <div className="verification-card">
        {result.success ? (
          <>
            <div className="success-icon">✅</div>

            <h1>Payment Successful</h1>

            <p>{result.message}</p>

            <div className="booking-details">
              <p>
                <strong>Booking ID:</strong>{" "}
                {result.booking._id}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {result.booking.bookingStatus}
              </p>

              <p>
                <strong>Payment:</strong>{" "}
                {result.booking.paymentStatus}
              </p>

              <p>
                <strong>Total:</strong> ₦
                {result.booking.totalPrice.toLocaleString()}
              </p>
            </div>

            <Link className="btn" to="/">
              Back to Home
            </Link>
          </>
        ) : (
          <>
            <div className="failed-icon">❌</div>

            <h1>Payment Failed</h1>

            <p>{result.message}</p>

            <Link className="btn" to="/">
              Try Again
            </Link>
          </>
        )}
      </div>
    </section>
  );
}