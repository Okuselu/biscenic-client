import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 tracking-wide">CUSTOMER CARE</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm hover:text-gray-300 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 tracking-wide">SERVICES</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm hover:text-gray-300 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm hover:text-gray-300 transition-colors">
                  Personal Shopping
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 tracking-wide">COMPANY</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-gray-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/exhibition" className="text-sm hover:text-gray-300 transition-colors">
                  Exhibition
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 tracking-wide">CONNECT</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.instagram.com/biscenic/?igsh=MWY3dmR2NjN0NW4zMA%3D%3D#"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-gray-300 transition-colors">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-gray-300 transition-colors">
                  Facebook
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">© 2024 BISCENIC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
