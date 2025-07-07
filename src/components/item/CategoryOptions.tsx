import { ItemCategory, ItemCondition } from "@/shared/types";
import { SelectOption } from "@/tailwind/components/forms/Select";
export const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "", label: "Select a category" },
  { value: ItemCategory.CLOTHING, label: "Clothing & Accessories" },
  { value: ItemCategory.BOOKS, label: "Books & Media" },
  { value: ItemCategory.FURNITURE, label: "Furniture & Home" },
  { value: ItemCategory.ELECTRONICS, label: "Electronics & Tech" },
  { value: ItemCategory.TOYS, label: "Toys & Games" },
  { value: ItemCategory.SPORTS, label: "Sports & Outdoors" },
  { value: ItemCategory.HOUSEHOLD, label: "Household Items" },
  { value: ItemCategory.OTHER, label: "Other" },
];
export const CONDITION_OPTIONS: SelectOption[] = [
  { value: "", label: "Select condition" },
  {
    value: ItemCondition.EXCELLENT,
    label: "Excellent - Like new, barely used",
  },
  { value: ItemCondition.GOOD, label: "Good - Used but well maintained" },
  { value: ItemCondition.FAIR, label: "Fair - Shows signs of use" },
  {
    value: ItemCondition.NEEDS_REPAIR,
    label: "Needs Repair - Not fully functional",
  },
];
export function getCategoryLabel(category: ItemCategory): string {
  const option = CATEGORY_OPTIONS.find((opt) => opt.value === category);
  return option?.label || category;
}
export function getConditionLabel(condition: ItemCondition): string {
  const option = CONDITION_OPTIONS.find((opt) => opt.value === condition);
  return option?.label || condition;
}
