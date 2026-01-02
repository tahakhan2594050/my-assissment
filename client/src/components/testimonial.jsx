import { assets } from "../assets/assets";

const Testimonial = () => {
  const dummyTestimonialData = [
    {
      image:
        "https://image2url.com/images/1765036236727-8dd05067-7899-41b0-a2ac-90b2fe097d1f.jpg",
      name: "Kamran Ahmed",
      title: "BathSpa, Student.",
      content:
        "ContentAI has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.",
      rating: 4,
    },
    {
      image:
        "https://image2url.com/images/1765036311643-2613c4bf-80a3-40ec-ad2c-589f3620997f.png",
      name: "Hamza Ahmed",
      title: "BathSpa, Student.",
      content:
        "ContentAI has made our content creation process effortless. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 5,
    },
    {
      image:
        "https://image2url.com/images/1765036406656-5d74637c-6473-425b-88ec-70dcc4255181.jpg",
      name: "Abdul Hadi",
      title: "BathSpa, Student.",
      content:
        "ContentAI has transformed our content creation process. The AI tools have helped us produce high-quality content faster than ever before.",
      rating: 4,
    },
  ];

  return (
    <section
      className="relative px-4 sm:px-20 xl:px-32 py-24"
      style={{
        background: `
          linear-gradient(
            to bottom,
            rgba(255,255,255,1) 0%,
            rgba(255,255,255,0.85) 30%,
            rgba(235,245,255,0.9) 60%,
            rgba(219,235,255,1) 100%
          )
        `,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-slate-800 text-4xl sm:text-5xl lg:text-[48px] font-bold tracking-tight leading-tight">
            Loved by my friends
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mt-3 text-lg">
            Don’t just take our word for it — hear from my friends who tested
            ContentAI.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {dummyTestimonialData.map((testimonial, index) => (
            <div
              key={index}
              className="group w-full max-w-sm rounded-2xl p-8 bg-white/75 backdrop-blur-xl 
                         border border-gray-200 shadow-lg transition-all duration-300 
                         hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-5">
                {Array(5)
                  .fill(0)
                  .map((_, starIndex) => (
                    <img
                      key={starIndex}
                      src={
                        starIndex < testimonial.rating
                          ? assets.star_icon
                          : assets.star_dull_icon
                      }
                      alt="star"
                      className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                        starIndex < testimonial.rating
                          ? "opacity-100"
                          : "opacity-40"
                      }`}
                    />
                  ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 text-base leading-relaxed mb-6 italic">
                “{testimonial.content}”
              </p>

              <hr className="border-gray-200 mb-6" />

              {/* Profile */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 object-cover rounded-full ring-2 ring-gray-200"
                />
                <div className="text-sm">
                  <h3 className="font-semibold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-xs text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
