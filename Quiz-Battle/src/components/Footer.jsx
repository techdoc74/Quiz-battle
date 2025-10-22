import React from "react";

const Footer = () => (
  <footer className="bg-blue-700 text-white py-4 mt-8">
    <div className="container mx-auto text-center text-sm">
      &copy; {new Date().getFullYear()} Quiz Battle. All rights reserved.
    </div>
  </footer>
);

export default Footer;