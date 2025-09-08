import Image from "next/image"

export default function CollectionTwoProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Section */}
      <section className="relative w-full h-[40vh] bg-gray-100 flex items-center justify-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8447.PNG-VNs1CrV0140TdBExYHlLiVq9Jlg5Nj.png"
          alt="Collection Two Modern Bed"
          fill
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center animate-pulse hover:animate-none transition-all duration-1000 ease-out transform scale-90 hover:scale-85">
          <div
            className="text-center text-white p-2 rounded-lg backdrop-blur-sm animate-bounce max-w-xs"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          >
            <h2 className="text-2xl font-light mb-2 tracking-wider">COLLECTION TWO</h2>
            <p className="text-sm opacity-90">Modern Luxury Redefined</p>
          </div>
        </div>
      </section>

      {/* Gallery Section (Optional) */}
      <section className="py-20 bg-white px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 tracking-wide">Explore More from Collection Two</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8448.PNG-3ZItcMPWTjSlgQydU0lKhqHMJjhjaM.png"
                alt="Collection Two Modern Bed with Headboard"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-50 text-white p-4">
                <h3 className="text-lg font-semibold tracking-wide">BISCENIC</h3>
                <p className="text-sm opacity-90">"Modern Luxury Redefined"</p>
              </div>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8586.PNG-bnmQJkceg7UAcbXyu8b3Nlr49pSjp6.png"
                alt="Collection Two Platform Bed"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-50 text-white p-4">
                <h3 className="text-lg font-semibold tracking-wide">BISCENIC</h3>
                <p className="text-sm opacity-90">"Crafted for Comfort"</p>
              </div>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8447.PNG-YHLMdrHfbNlffUVJdKYIoQcYaQpaP5.png"
                alt="Collection Two Spherical Bed"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-50 text-white p-4">
                <h3 className="text-lg font-semibold tracking-wide">BISCENIC</h3>
                <p className="text-sm opacity-90">"Innovation in Design"</p>
              </div>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_8449.PNG-71fivqk6tgKfKgQmH9obr5lm0xnq0V.png"
                alt="Collection Two Wooden Frame"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-50 text-white p-4">
                <h3 className="text-lg font-semibold tracking-wide">BISCENIC</h3>
                <p className="text-sm opacity-90">"Timeless Elegance"</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
