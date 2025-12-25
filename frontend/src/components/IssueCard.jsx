function IssueCard({ issue }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const mainImage = issue.images?.[0] || 'https://via.placeholder.com/400x250?text=Image+Not+Available';
  const mapImage = issue.mapImage || issue.images?.find(img => img.includes('map')) || null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
      {/* Images Section */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={mainImage}
          alt={issue.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Image+Error'; }}
        />
        {mapImage && (
          <img
            src={mapImage}
            alt="Map Location"
            className="absolute bottom-2 right-2 w-24 h-24 rounded-lg border-2 border-white shadow-md object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {issue.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {issue.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
            {issue.status === 'pending' ? 'प्रलंबित' : issue.status === 'in-progress' ? 'प्रगतीत' : 'सोडवले'}
          </span>

          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-lg">👍</span>
            <span className="font-semibold">{issue.votes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueCard;