"use client"

import Image from "next/image"

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96">
        <Image 
          src="/images/about-hero-bonsai.png" 
          alt="Balenciaga Atelier" 
          fill 
          className="object-cover" 
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-light tracking-wider text-center">
            ABOUT BISCENIC
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Heritage Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-3xl font-light mb-6 tracking-wide">OUR HERITAGE</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Biscenic is the hush within the hammer, a stillness shaped by rhythm and reason. Technology does not interrupt here; it breathes life. Wood, once silent, begins to dream.
                Each creation is not built—it is born. It listens. It remembers. Through the quiet alchemy of design and code,
                Biscenic gives form a spirit, turning furniture into vessels of memory, soul, and sentient beauty.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Founded by visionary designer Lomon Christopher, Biscenic rose from a devotion to the deeper language of design, a relentless pursuit of artistry, precision, and emotional resonance. More than a design house, it is a living philosophy, an evolving reflection of how we shape our surroundings, and how they, in turn, shape us.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We do not see furniture as static objects. To us, every line is a sentence. Every silhouette is a story. Each piece is sculpted to stir something inward: a feeling, a memory, a truth once forgotten. With hands guided by intuition and minds attuned to innovation, we move beyond style and surface into substance.
              </p>
              <p className="text-gray-700 leading-relaxed">
                With every creation, Biscenic carries forward a legacy of bold imagination, furniture not simply designed to be seen or used, but to be felt, inhabited, and remembered.
              </p>
            </div>
            <div className="relative aspect-square w-full h-full">
              <Image 
                src="/images/biscenic-logo.png" 
                alt="Biscenic Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Values Section */}
          <div className="text-center">
            <h2 className="text-3xl font-light mb-8 tracking-wide">OUR VALUES</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-medium mb-4 tracking-wide">INNOVATION</h3>
                <p className="text-gray-700 leading-relaxed">
                  At Biscenic, we don't chase the future, we shape it. Our designs blend subtle technology with soulful intention, creating furniture that evolves with you.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-4 tracking-wide">CRAFTSMANSHIP</h3>
                <p className="text-gray-700 leading-relaxed">
                  At Biscenic, every piece is a manuscript—crafted in grain, refined in detail. We honor the artisan’s hand and modern tools, creating soulful designs built to outlive trends and time.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-4 tracking-wide">SUSTAINABILITY</h3>
                <p className="text-gray-700 leading-relaxed">
                  Biscenic builds with intention: ethically sourced, enduring designs that honor nature and create beauty without scars.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}



// import Image from "next/image"

// export default function About() {
//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="relative h-96">
//         <Image src="/images/about-hero-bonsai.png" alt="Balenciaga Atelier" fill className="object-cover" />
//         <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//           <h1 className="text-white text-4xl md:text-6xl font-light tracking-wider">ABOUT BISCENIC</h1>
//         </div>
//       </section>

//       {/* Content */}
//       <section className="py-20">
//         <div className="max-w-4xl mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
//             <div>
//               <h2 className="text-3xl font-light mb-6 tracking-wide">OUR HERITAGE</h2>
//               <p className="text-gray-700 mb-6 leading-relaxed">
//                 Biscenic is the hush within the hammer, a stillness shaped by rhythm and reason. Technology does not interrupt here; it breathes life. Wood, once silent, begins to dream.
//                 Each creation is not built—it is born. It listens. It remembers. Through the quiet alchemy of design and code,
//                 Biscenic gives form a spirit, turning furniture into vessels of memory, soul, and sentient beauty.
//               </p>
//               <p className="text-gray-700 mb-6 leading-relaxed">
//                 Founded by visionary designer Lomon Christopher, Biscenic rose from a devotion to the deeper language of design, a relentless pursuit of artistry, precision, and emotional resonance. More than a design house, it is a living philosophy, an evolving reflection of how we shape our surroundings, and how they, in turn, shape us.
//               </p>
//               <p className="text-gray-700 mb-6 leading-relaxed">
//                 We do not see furniture as static objects. To us, every line is a sentence. Every silhouette is a story. Each piece is sculpted to stir something inward: a feeling, a memory, a truth once forgotten. With hands guided by intuition and minds attuned to innovation, we move beyond style and surface into substance.
//               </p>
//               <p className="text-gray-700 leading-relaxed">
//                 With every creation, Biscenic carries forward a legacy of bold imagination, furniture not simply designed to be seen or used, but to be felt, inhabited, and remembered.
//               </p>
//             </div>
//             <div className="relative aspect-square">
//               <Image src="/images/biscenic-logo.png" alt="Biscenic Logo" fill className="object-cover" />
//             </div>
//           </div>

//           <div className="text-center">
//             <h2 className="text-3xl font-light mb-8 tracking-wide">OUR VALUES</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div>
//                 <h3 className="text-xl font-medium mb-4 tracking-wide">INNOVATION</h3>
//                 <p className="text-gray-700">
//                   At Biscenic, we don't chase the future,we shape it. Our designs blend subtle technology with soulful intention, creating furniture that evolves with you.
//                 </p>
//               </div>
//               <div>
//                 <h3 className="text-xl font-medium mb-4 tracking-wide">CRAFTSMANSHIP</h3>
//                 <p className="text-gray-700">At Biscenic, every piece is a manuscript—crafted in grain, refined in detail. We honor the artisan’s hand and modern tools, creating soulful designs built to outlive trends and time.</p>
//               </div>
//               <div>
//                 <h3 className="text-xl font-medium mb-4 tracking-wide">SUSTAINABILITY</h3>
//                 <p className="text-gray-700">Biscenic builds with intention ethically sourced, enduring designs that honor nature and create beauty without scars.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }
