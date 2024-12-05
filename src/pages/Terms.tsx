const Terms = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
            <p>By accessing our service, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p>We grant you a limited, non-exclusive, non-transferable license to use our service for personal tax calculation purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p>The tax calculations and estimates provided are for informational purposes only. We are not tax advisors, and you should consult with a qualified tax professional for specific advice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
            <p>In no event shall we be liable for any damages arising out of the use or inability to use our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of the United States.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;