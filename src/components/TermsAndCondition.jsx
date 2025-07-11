import { ImCross } from "react-icons/im";

const TermsModal = ({ isOpen, setIsOpen }) => {
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Button to open modal */}
      <button
        onClick={openModal}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        View Terms & Conditions
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-[9999] transition-all duration-300"
          style={{ backdropFilter: "blur(2px)" }}
        >
          {/* Modal Content */}
          <div className="rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl bg-white dark:bg-gray-800 flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
                BITS Pilani Store Terms and Conditions
              </h2>
              <button
                onClick={closeModal}
                aria-label="Close"
                className="transition-colors duration-200 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ImCross size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
              <p className="text-xs sm:text-sm mb-4 text-gray-600 dark:text-gray-400">
                Last Updated: 6th June 2025 12:03
              </p>

              {/* Disclaimer */}
              <div className="mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-red-600 mb-3">
                  Disclaimer
                </h3>
                <div className="border-l-4 border-red-400 p-4 rounded-r-lg bg-red-50 dark:bg-red-900/20">
                  <p className="text-xs sm:text-sm leading-relaxed text-red-800 dark:text-red-300">
                    This platform is independently created and operated by
                    students in their personal capacity and has no affiliation
                    with, endorsement from, or oversight by BITS Pilani or any
                    of its campuses. The use of BITS Pilani's name in the
                    platform title ("BITS Pawnshop" / "BITS Pilani Store") and
                    the login access via BITS-issued email IDs is entirely
                    student-initiated and does not imply any official connection
                    or approval. BITS Pilani bears no responsibility or
                    liability for the platform's content, user conduct,
                    transactions, or any issues arising from its use. Any
                    listing, communication, or exchange taking place on this
                    platform is at the sole discretion and risk of the users
                    involved. BITS Pilani neither monitors nor controls the
                    activities on this platform and does not guarantee the
                    legality, safety, or quality of any listed items. If any
                    misuse, illegal activity, or reputational harm is reported
                    in relation to this platform, BITS Pilani reserves the right
                    to immediately revoke access through institutional email IDs
                    or take any other necessary action without prior notice. In
                    such events, the student(s) responsible shall be solely
                    accountable, and BITS Pilani shall remain fully indemnified.
                    By accessing or using this platform, users acknowledge and
                    agree to these terms in full.
                  </p>
                </div>
              </div>

              {/* Terms Sections */}
              <div className="space-y-6">
                {/* Section 1 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    1. Introduction
                  </h3>
                  <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                    BITS Pilani Store is a peer-to-peer marketplace created
                    exclusively for members of BITS Pilani across the Goa,
                    Pilani, and Hyderabad campuses. These Terms govern your use
                    of the platform as a buyer or seller.
                  </p>
                </div>
                {/* Section 2 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    2. Platform Nature and Limitations
                  </h3>
                  <p className="mb-3 text-gray-700 dark:text-gray-300">
                    BITS Pilani Store acts solely as a classified listings
                    service connecting buyers and sellers.
                  </p>
                  <p className="mb-3 text-gray-700 dark:text-gray-300">
                    All communications and transactions happen outside the
                    platform.
                  </p>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    We do not:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Intervene in transactions</li>
                    <li>Process payments or offer escrow</li>
                    <li>Verify product authenticity</li>
                    <li>Guarantee transaction outcomes</li>
                  </ul>
                </div>
                {/* Section 3 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    3. User Eligibility and Accounts
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>
                      Only BITS Pilani members with official email IDs may use
                      the platform.
                    </li>
                    <li>One user = One account. No duplicates.</li>
                    <li>
                      You are accountable for all activity under your account.
                    </li>
                  </ul>
                </div>
                {/* Section 4 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    4. Listing Policies
                  </h3>
                  <h4 className="text-sm sm:text-md font-medium mb-2 text-green-700 dark:text-green-400">
                    4.1 Allowed Listings
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 mb-4 text-gray-700 dark:text-gray-300">
                    <li>Used textbooks and study materials</li>
                    <li>Working electronics</li>
                    <li>Furniture and daily-use hostel items</li>
                    <li>Any other legal, non-restricted items</li>
                  </ul>
                  <h4 className="text-sm sm:text-md font-medium mb-2 text-red-700 dark:text-red-400">
                    4.2 Prohibited Listings (Strict Ban)
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Drugs or drug-related items</li>
                    <li>Weapons</li>
                    <li>Stolen or unverified goods</li>
                    <li>Fake, pirated, or replica products</li>
                    <li>Expired consumables or medicine</li>
                    <li>Animals (live/dead)</li>
                    <li>Plagiarism/cheating tools</li>
                    <li>Adult or explicit content</li>
                    <li>Items violating campus policies or Indian law</li>
                  </ul>
                </div>
                {/* Section 5 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    5. Transaction Process
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 mb-3 text-gray-700 dark:text-gray-300">
                    <li>Contact sellers through the WhatsApp link provided.</li>
                    <li>All deals, chats, and payments happen off-platform.</li>
                  </ul>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    Suggested best practices:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Meet in safe, common areas on campus</li>
                    <li>Thoroughly inspect before paying</li>
                    <li>Use trusted payment channels like UPI</li>
                    <li>Keep screenshots or records</li>
                  </ul>
                </div>
                {/* Section 6 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    6. User Responsibilities (Suggestions)
                  </h3>
                  <h4 className="text-sm sm:text-md font-medium mb-2 text-blue-700 dark:text-blue-400">
                    6.1 Sellers
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 mb-4 text-gray-700 dark:text-gray-300">
                    <li>Must post honest, clear product details</li>
                    <li>Reveal all defects or issues</li>
                    <li>Immediately mark listings as sold after sale</li>
                    <li>Follow prohibited item rules</li>
                  </ul>
                  <h4 className="text-sm sm:text-md font-medium mb-2 text-blue-700 dark:text-blue-400">
                    6.2 Buyers
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Must check item quality before payment</li>
                    <li>
                      Understand all sales are final unless otherwise agreed
                    </li>
                    <li>Report any suspicious or illegal listings</li>
                  </ul>
                </div>
                {/* Section 7 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    7. Disclaimers and Liability Limitations
                  </h3>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    We hold no liability for:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mb-3 text-gray-700 dark:text-gray-300">
                    <li>User behavior</li>
                    <li>Product quality or legality</li>
                    <li>Outcome of any deal</li>
                    <li>Losses due to platform use</li>
                    <li>WhatsApp or external app interactions</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300">
                    You agree to indemnify BITS Pilani Store for any issues
                    arising from your usage.
                  </p>
                </div>
                {/* Section 8 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    8. Privacy and Data
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>We collect minimum data only to run the platform.</li>
                    <li>
                      Seller contact is shared only when you click to contact
                      them or when the contact information is viewed.
                    </li>
                    <li>
                      No tracking or storing of personal chats or payment info.
                    </li>
                  </ul>
                </div>
                {/* Section 9 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    9. Violations and Enforcement
                  </h3>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    We may:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Remove any listing without prior notice</li>
                    <li>Suspend or block accounts</li>
                    <li>Inform BITS authorities if serious rules are broken</li>
                    <li>Cooperate with law enforcement</li>
                  </ul>
                </div>
                {/* Section 10 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    10. Modifications
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Terms may be updated anytime.</li>
                    <li>Continued usage implies agreement to updated terms.</li>
                  </ul>
                </div>
                {/* Section 11 */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    11. General Provisions
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>These Terms are the entire agreement between us.</li>
                    <li>If one part is invalid, the rest still apply.</li>
                    <li>
                      This platform is student-run and unaffiliated with BITS
                      Pilani administration.
                    </li>
                  </ul>
                </div>
                {/* Final Note */}
                <div className="border-l-4 border-blue-400 p-4 rounded-r-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="font-medium text-blue-800 dark:text-blue-300">
                    By using BITS Pilani Store, you confirm you have read,
                    understood, and agreed to these Terms.
                  </p>
                </div>
                {/* Serving */}
                <div className="text-center">
                  <p className="font-medium text-gray-600 dark:text-gray-400">
                    Serving: BITS Goa, Pilani, Hyderabad, Dubai
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsModal;
