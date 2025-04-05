import { DESIGN_WIDTH } from "@/constants/Size";
import { useWindowDimensions } from "react-native";

/**
 * 自适应
 */
export function adaptiveSize(value: number, standardSize?: number) {
  standardSize = standardSize || DESIGN_WIDTH;

  const proportion = value / standardSize;

  const screenWidth = useWindowDimensions().width;

  return screenWidth * proportion;
}
