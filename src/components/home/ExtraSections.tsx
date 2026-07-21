export default function ExtraSections() {
  return (
    <>
      {/* Section 1: How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Start a Campaign</h3>
              <p className="text-gray-600">
                Creators submit their ideas for admin approval.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Purchase Credits</h3>
              <p className="text-gray-600">
                Supporters buy credits to fund projects they love.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Get Funded</h3>
              <p className="text-gray-600">
                Creators withdraw their raised credits to real money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Explore by Category */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Explore by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Technology", "Art", "Community", "Health", "Games"].map(
              (cat) => (
                <span
                  key={cat}
                  className="px-6 py-3 bg-blue-50 text-blue-600 rounded-full font-medium hover:bg-blue-100 cursor-pointer transition"
                >
                  {cat}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Platform Impact */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold">1,200+</h3>
            <p className="text-blue-100 mt-2">Campaigns Funded</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">$2M+</h3>
            <p className="text-blue-100 mt-2">Total Raised</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">50k+</h3>
            <p className="text-blue-100 mt-2">Active Supporters</p>
          </div>
        </div>
      </section>
    </>
  );
}
