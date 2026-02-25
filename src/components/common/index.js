// src/components/common/index.js
export { default as Button } from "./Button";
export { default as FormField, TextAreaField, SelectField } from "./FormField";
export { Heading, Subheading, Body, Caption, Label } from "./Typography";
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonStatCard,
  SkeletonTable,
  SkeletonTableRow,
  SkeletonProjectCard,
  SkeletonProfile,
  SkeletonListItem,
  SkeletonApplicationCard,
  SkeletonDashboard,
  SkeletonLoader,
} from "./Skeleton";
export {
  CommandPalette,
  useCommandPaletteState, // Fixed: was 'useCommandPalette' but the hook is named 'useCommandPaletteState'
  CommandPaletteTrigger,
} from "./CommandPalette";
export { default as LoadingSpinner } from "./LoadingSpinner";
export { default as ProtectedRoute } from "./ProtectedRoute";
