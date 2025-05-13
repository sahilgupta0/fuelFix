import React from "react";
import Navbar from "./../components/Navbar";

const Help = () => {
  const howToGuides = [
    { title: "How to request a service", description: "Learn how to request a mechanic for roadside assistance." },
    { title: "How to track your requests", description: "Track your service requests in real-time using the app." },
    { title: "How to contact a mechanic", description: "Get in touch with your assigned mechanic directly." },
    { title: "How to cancel or complete a request", description: "Manage your service requests by canceling or completing them." },
  ];

  const faqs = [
    {
      question: "What is FuelFix?",
      answer: "FuelFix is a platform that connects users with verified mechanics for roadside assistance, including fuel delivery, flat tire changes, and more.",
    },
    {
      question: "How do I track my mechanic?",
      answer: "Once your request is accepted, you can track the mechanic's live location on the map in real-time.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit/debit cards and digital wallets. Payment is processed securely through our platform.",
    },
  ];

  return (
    <div className="min-h-screen  text-black">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12 text-black">
        <h2 className="text-4xl font-bold text-purple-600 mb-8">Help & Support</h2>

        {/* Introduction Section */}
        <section className="mb-12">
          <p className=" text-lg text-black">
            Welcome to the Help & Support section! Here, you'll find resources and answers to common questions to assist you in using FuelFix. If you need further help, feel free to contact us.
          </p>
        </section>

        {/* How-To Guides Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-purple-600 mb-4">How-To Guides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {howToGuides.map((guide, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h4 className="text-lg font-semibold text-purple-600 mb-2">{guide.title}</h4>
                <p className="text-gray-300">{guide.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative mb-12">
          <h3 className="text-2xl font-semibold text-purple-600 mb-4">Frequently Asked Questions</h3>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg floating-div">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-6">
                <h4 className="text-lg font-medium text-white">{faq.question}</h4>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support Section */}
        <section>
          <h3 className="text-2xl font-semibold text-purple-600 mb-4">Contact Support</h3>
          <p className="text-black mb-4">
            If you have any further questions or need assistance, please don't hesitate to contact our support team:
          </p>
          <ul className="space-y-3 text-black">
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:support@fuelfix.com" className="text-purple-600 hover:underline">
                support@fuelfix.com
              </a>
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              <a href="tel:+919876543210" className="text-purple-600 hover:underline">
                +91-9876543210
              </a>
            </li>
            <li>
              <strong>Live Chat:</strong> Available 24/7 in the app.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Help;