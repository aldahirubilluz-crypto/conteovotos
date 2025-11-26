import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema/schema-register";
import { GetCantidatos } from "./cantidates";
import { GetPosition } from "./position";

export interface VoteTabsProps {
  positions: GetPosition[];
  candidates: GetCantidatos[];
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
}
