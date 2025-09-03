import Link from "next/link"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/sportitupp-removebg-preview.png" alt="SportItUp" className="h-20" />
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-black">
            Home
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-6">Terms of Service</h1>

          <div className="space-y-5 text-gray-700 leading-7">
            <p>
              Welcome to Sportitup! By accessing or using our website, mobile app, or services, you agree to follow
              these Terms of Service. Please read them carefully before using our platform.
            </p>

            <h2 className="text-xl font-semibold text-black mt-6">1. Introduction</h2>
            <p>
              Sportitup is an online platform that allows users to search, book, and pay for sports facilities such as
              cricket turfs, football grounds, pickleball courts, and other recreational venues.
            </p>
            <p>These Terms form a legal agreement between you (the “User”) and Sportitup (“we”, “us”, “our”).</p>

            <h2 className="text-xl font-semibold text-black mt-6">2. Account Registration</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                To make bookings, you may need to create an account with accurate details (name, phone number, email,
                etc.).
              </li>
              <li>
                You are responsible for keeping your login details safe. Any activity under your account will be
                considered your responsibility.
              </li>
              <li>You must be at least 18 years old to create an account.</li>
            </ul>

            <h2 className="text-xl font-semibold text-black mt-6">3. Booking and Payments</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Users can book available slots for listed venues through the Sportitup platform.</li>
              <li>Payments are processed securely through third-party payment gateways.</li>
              <li>Prices shown on the platform are determined by the turf/venue owners.</li>
              <li>Sportitup may charge a convenience or service fee, which will be displayed at checkout.</li>
            </ul>

            <h2 className="text-xl font-semibold text-black mt-6">4. Cancellations and Refunds</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Each venue may have its own cancellation and refund policy, which will be displayed during booking.
              </li>
              <li>
                Refunds (if applicable) will be processed through the same payment method within [X] business days.
              </li>
              <li>
                Sportitup is not responsible for refunds if the cancellation terms set by the turf owner are not met.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-black mt-6">5. User Responsibilities</h2>
            <p>By using Sportitup, you agree that you will not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Misuse or damage the facilities you book.</li>
              <li>Resell or transfer bookings without permission.</li>
              <li>Use fake information or payment details.</li>
              <li>Engage in unlawful or abusive behavior on our platform or at the booked venue.</li>
            </ul>

            <h2 className="text-xl font-semibold text-black mt-6">6. Turf Owner Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Turf owners must ensure the availability, safety, and quality of their facilities as listed.</li>
              <li>Turf owners are solely responsible for maintaining their venues and handling disputes with users.</li>
              <li>Sportitup acts only as a booking platform and is not responsible for turf management.</li>
            </ul>

            <h2 className="text-xl font-semibold text-black mt-6">7. Liability Disclaimer</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sportitup is a booking facilitator. We do not own or operate the venues listed.</li>
              <li>
                We are not liable for any injury, loss, or damage that may occur during the use of the booked facility.
              </li>
              <li>Users participate in sports at their own risk.</li>
            </ul>

            <h2 className="text-xl font-semibold text-black mt-6">8. Service Availability</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                We aim to keep the platform running smoothly, but we do not guarantee uninterrupted or error-free
                service.
              </li>
              <li>Sportitup reserves the right to modify, suspend, or discontinue services at any time.</li>
            </ul>

            <h2 className="text-xl font-semibold text-black mt-6">9. Intellectual Property</h2>
            <p>
              All logos, trademarks, and content on Sportitup are the property of the company and cannot be used without
              permission.
            </p>

            <h2 className="text-xl font-semibold text-black mt-6">10. Termination of Account</h2>
            <p>Sportitup reserves the right to suspend or terminate accounts that violate these Terms.</p>

            <h2 className="text-xl font-semibold text-black mt-6">11. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of Sportitup after changes means you accept the
              updated Terms.
            </p>

            <h2 className="text-xl font-semibold text-black mt-6">12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of courts
              in Amritsar, Punjab.
            </p>

            <h2 className="text-xl font-semibold text-black mt-6">13. Contact Us</h2>
            <p>📧 Email: sportituporg@gmail.com</p>
            <p>🌐 Website: www.sportitup.in</p>
          </div>
        </div>
      </section>
    </main>
  )
}
