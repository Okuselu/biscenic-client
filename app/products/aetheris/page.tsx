import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AetherisProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* New Title Section */}
      <section className="bg-white py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-light tracking-wider text-black">AETHERIS</h1>
      </section>

      {/* Image Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-[16/9] rounded-lg shadow-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=720&width=1280"
              alt="AETHERIS Product Showcase"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light mb-4 tracking-wide">Unveiling AETHERIS</h2>
              <p className="text-gray-700 leading-relaxed">
                AETHERIS is more than just a collection; it's a journey into the essence of our planet, translated into
                wearable art. Each piece is meticulously crafted to reflect the organic beauty and raw power of nature,
                while maintaining the sophisticated aesthetic Balenciaga is known for.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-light mb-3 tracking-wide">Design Philosophy</h3>
              <p className="text-gray-700 leading-relaxed">
                Inspired by geological formations, ancient forests, and the ethereal glow of the aurora borealis,
                AETHERIS blends natural textures with innovative silhouettes. Expect flowing fabrics, earthy tones, and
                unexpected structural elements that mimic the natural world.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-light mb-3 tracking-wide">Craftsmanship</h3>
              <p className="text-gray-700 leading-relaxed">
                Our artisans employ traditional techniques alongside cutting-edge technology to bring AETHERIS to life.
                Sustainable materials are at the forefront, ensuring each garment is not only beautiful but also
                responsibly made.
              </p>
            </div>
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm tracking-wide" asChild>
              <Link href="/shop?category=aetheris">SHOP AETHERIS COLLECTION</Link>
            </Button>
          </div>
          <div className="relative aspect-[3/4] shadow-lg rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=800&width=600"
              alt="AETHERIS Collection Detail"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Gallery Section (Optional) */}
      <section className="py-20 bg-white px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 tracking-wide">Explore the Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md">
              <Image src="/placeholder.svg?height=400&width=300" alt="AETHERIS Item 1" fill className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md">
              <Image src="/placeholder.svg?height=400&width=300" alt="AETHERIS Item 2" fill className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md">
              <Image src="/placeholder.svg?height=400&width=300" alt="AETHERIS Item 3" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
