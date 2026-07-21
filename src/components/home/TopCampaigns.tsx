"use client";

// Temporary mock data until backend is connected
const mockCampaigns = [
  {
    id: "1",
    title: "Solar Water Pump",
    raised: 1200,
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "2",
    title: "Indie Game Dev",
    raised: 850,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "3",
    title: "Community Garden",
    raised: 600,
    image:
      "https://images.unsplash.com/photo-1518840321-6-something?auto=format&fit=crop&w=400&q=80",
  },
];

export default function TopCampaigns() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Top Funded Campaigns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                <p className="text-blue-600 font-bold">
                  ${campaign.raised} Raised
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
