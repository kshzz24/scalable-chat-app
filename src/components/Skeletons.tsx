export const SendInviteComponentSkeleton = () => {
  return (
    <div className="send-invite-skeleton p-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Search Input Skeleton */}
      <div className="mb-6">
        <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Users List Skeleton */}
      <div className="space-y-4 mb-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex items-center p-4 border rounded-lg">
            {/* Avatar */}
            <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse mr-4"></div>

            {/* User Info */}
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Selection Indicator */}
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Actions Skeleton */}
      <div className="flex gap-4 justify-end">
        <div className="h-12 w-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-12 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};
