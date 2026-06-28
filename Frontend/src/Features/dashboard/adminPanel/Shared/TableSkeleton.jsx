export const TableSkeleton = ({ rows = 5, cols = 6 }) => (
  <>
    {[...Array(rows)].map((_, i) => (
      <tr key={i} className="border-b border-white/5 animate-pulse">
        {[...Array(cols)].map((_, j) => (
          <td key={j} className="p-6">
            <div className="h-4 bg-white/5 rounded-full w-3/4" />
          </td>
        ))}
      </tr>
    ))}
  </>
);