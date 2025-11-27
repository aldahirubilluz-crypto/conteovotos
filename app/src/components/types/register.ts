import { UseFormReturn } from "react-hook-form";
import { FormValuesRegister } from "../schema/schema-register";
import { GetCantidatos } from "./cantidates";
import { GetPosition } from "./position";

export interface VoteTabsProps {
  positions: GetPosition[];
  candidates: GetCantidatos[];
  form: UseFormReturn<FormValuesRegister>;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
}
