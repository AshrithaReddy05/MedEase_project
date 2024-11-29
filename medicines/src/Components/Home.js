import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          background: "linear-gradient(to right, #6a11cb, #2575fc)",
          color: "white",
          padding: "60px 0",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
          Welcome to MediChrono
        </h1>
        <p style={{ fontSize: "1.2rem", marginTop: "20px" }}>
          Your trusted companion for advanced medication management. Stay safe,
          stay informed.
        </p>
      </div>

      {/* Features Section */}
      <div className="container features-section" style={{ padding: "60px 20px" }}>
        <h2 className="text-center mb-5">Why Choose MediChrono?</h2>
        <div className="row">
          <div className="col-md-4">
            <div
              className="card feature-card p-4"
              style={{
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              }}
            >
              <h4 className="text-center">Scheduled Notifications</h4>
              <p className="text-center">
                Receive timely reminders for your medication, ensuring you never
                miss a dose.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card feature-card p-4"
              style={{
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              }}
            >
              <h4 className="text-center">Expiry Alerts</h4>
              <p className="text-center">
                Get notified when your medication is nearing its expiration
                date, keeping you safe.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card feature-card p-4"
              style={{
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              }}
            >
              <h4 className="text-center">Comprehensive Reports</h4>
              <p className="text-center">
                Track your medication usage and history with detailed medical
                summaries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div
        className="cta-section"
        style={{
          background: "#2575fc",
          color: "white",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <h3>Ready to Enhance Your Medication Management?</h3>
        <p>Sign up today and experience the convenience of MediChrono.</p>
        <a
          href="/register"
          className="btn cta-button"
          style={{
            background: "white",
            color: "#2575fc",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "25px",
            textTransform: "uppercase",
          }}
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default Home;
