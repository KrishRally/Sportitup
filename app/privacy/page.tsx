import Link from "next/link"

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-black mb-6">Privacy Policy</h1>

          <div className="space-y-5 text-gray-700 leading-7">
            <p>
              At Sportitup, we value your privacy and are committed to protecting your personal information. This
              Privacy Policy explains how we collect, use, and safeguard your information when you use our website and
              mobile application to book sports turfs.
            </p>

            <h2 className="text-xl font-semibold text-black mt-6">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personal details:</strong> Name, email address, phone number, and account login details.
              </li>
              <li>
                <strong>Booking details:</strong> Turf location, sport type, date, and time of booking.
              </li>
              <li>
                <strong>Payment information:</strong> Payment method and transaction details (we do not store card/bank
                details; payments are processed securely by third-party providers).
              </li>
              <li>
                <strong>Usage data:</strong> Device type, browser, IP address, and how you interact with our site/app.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-black mt-6">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and confirm your turf bookings.</li>
              <li>Send booking confirmations, updates, or reminders.</li>
              <li>Improve our services, website, and user experience.</li>
              <li>Notify you about promotions, offers, and new features (you can opt-out anytime).</li>
              <li>Ensure security, prevent fraud, and comply with legal obligations.</li>
            </ul>

            <h2 className="text-xl font-semibold text-black mt-6">3. Sharing of Information</h2>
            <p>We do not sell or rent your personal information. We may share your data with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Turf owners/partners to confirm and manage your bookings.</li>
              <li>Payment processors to securely handle payments.</li>
              <li>Service providers (e.g., hosting, analytics, SMS/email providers) that help us run our platform.</li>
              <li>Legal authorities if required by law.</li>
            </ul>

            <h2 className="text-xl font-semibold text-black mt-6">4. Data Security</h2>
            <p>
              We take reasonable steps to protect your information through encryption, secure servers, and restricted
              access. However, no method of online transmission is 100% secure.
            </p>

            <h2 className="text-xl font-semibold text-black mt-6">5. Cookies &amp; Tracking</h2>
            <p>
              We use cookies and analytics tools to improve website performance, personalize your experience, and show
              relevant offers. You can control cookies through your browser settings.
            </p>

            <h2 className="text-xl font-semibold text-black mt-6">6. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access, update, or delete your personal data by contacting us.</li>
              <li>Opt-out of marketing communications anytime.</li>
              <li>Request clarification about how your data is being used.</li>
            </ul>

            <h2 className="text-xl font-semibold text-black mt-6">7. Third-Party Links</h2>
            <p>
              Our platform may contain links to third-party websites. We are not responsible for their privacy
              practices.
            </p>

            <h2 className="text-xl font-semibold text-black mt-6">8. Children’s Privacy</h2>
            <p>
              Our services are not intended for children under 13. We do not knowingly collect personal data from them.
            </p>

            <h2 className="text-xl font-semibold text-black mt-6">9. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted here with a new “Last
              Updated” date.
            </p>

            <h2 className="text-xl font-semibold text-black mt-6">10. Contact Us</h2>
            <p>📧 Email: sportituporg@gmail.com</p>
            <p>🌐 Website: www.sportitup.in</p>
          </div>
        </div>
      </section>
    </main>
  )
}
