import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/cartContext/CartContext";

const Navbar: React.FC = () => {
  const { state } = useCart();
  const itemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          biscenic
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/about">
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/contact">
                Contact Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/products">
                Shop Now
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="nav-link position-relative">
                Cart
                {itemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {itemCount}
                  </span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/signup">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


// import React from "react";
// import { Link } from "react-router-dom";
// import { useCart } from "../../context/cartContext/CartContext";

// const Navbar: React.FC = () => {
//   const { state } = useCart();
//   const itemCount = state.items.reduce(
//     (total, item) => total + item.quantity,
//     0
//   );

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
//       <div className="container">
//         <Link className="navbar-brand fw-bold" to="/">
//           biscenic
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div
//           className="collapse navbar-collapse justify-content-end"
//           id="navbarNav"
//         >
//           <ul className="navbar-nav align-items-center">
//             <li className="nav-item">
//               <Link className="nav-link px-3" to="/products">
//                 Products
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link to="/cart" className="nav-link position-relative">
//                 Cart
//                 {itemCount > 0 && (
//                   <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
//                     {itemCount}
//                   </span>
//                 )}
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link px-3" to="/login">
//                 Login
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link px-3" to="/signup">
//                 Sign Up
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
