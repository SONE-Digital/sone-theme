import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full bg-white">
      <div
        className="w-full h-[554px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: "url('/img/capitalequipment-banner-d.jpg')" }}
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-black space-y-4 max-w-xl">
            <h1 className="text-h1 font-bold text-heading">
              End-to-end Solutions, Backed By Experts
            </h1>
            <p className="text-h10 font-medium text-text">
              We're your trusted partner for expert guidance, reliable support,
              and long-term success.
            </p>
          </div>
        </div>
      </div>

      {/* Optional decorative images */}
      <img
        src="/img/section-9-image-d.jpg"
        alt="Decorative"
        className="hidden lg:block absolute right-0 bottom-0 w-[40%] max-w-[630px] h-auto"
      />

      <img
        src="/img/section-2-image-d.jpg"
        alt="Decorative"
        className="hidden lg:block absolute left-0 top-[912px] w-[40%] max-w-[630px] h-auto"
      />
    </section>
  );
};

export default Hero;
