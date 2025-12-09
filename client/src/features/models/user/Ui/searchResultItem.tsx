import type { ISearchResult } from "../../../../types/api/public";

export const SearchResultItem: React.FC<{
  result: ISearchResult;
  onClick: () => void;
}> = ({ result, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <img
        src={result.profileImg}
        alt={result.userName}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1 text-left">
        <p className="font-semibold text-gray-900">{result.userName}</p>
        <p className="text-sm text-gray-500">{result.fullName}</p>
      </div>
    </button>
  );
};