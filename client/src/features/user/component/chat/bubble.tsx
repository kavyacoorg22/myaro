export const Bubble = ({
  children,
  isSelf,
}: {
  children: React.ReactNode;
  isSelf?: boolean;
}) => (
  <div className={`flex ${isSelf ? "justify-end" : "justify-start"} mb-2`}>
    {children}
  </div>
);