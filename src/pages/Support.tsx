const Support = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Support</h1>
        
        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">How accurate are the tax calculations?</h3>
                <p>Our calculations are based on current tax rates and regulations but should be used as estimates only. Always consult a tax professional for final filing.</p>
              </div>
              <div>
                <h3 className="font-semibold">How is my data protected?</h3>
                <p>We use industry-standard encryption and security measures to protect your data. See our Privacy Policy for more details.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>For support inquiries, please email us at:</p>
            <p className="font-semibold mt-2">support@taxedaf.com</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Response Time</h2>
            <p>We typically respond to support requests within 24-48 hours during business days.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Support;