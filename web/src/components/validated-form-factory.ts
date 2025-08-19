import type { FieldValues } from "react-hook-form";
import {
  ValidatedDatePicker,
  ValidatedFileUpload,
  ValidatedForm,
  ValidatedInput,
  ValidatedSelect
} from "@/components/validated-form.tsx";

export function createValidatedForm<TModel extends FieldValues>() {
  return {
    Form: ValidatedForm<TModel>,
    Input: ValidatedInput<TModel>,
    Select: ValidatedSelect<TModel>,
    DatePicker: ValidatedDatePicker<TModel>,
    FileUpload: ValidatedFileUpload<TModel>,
  }
}

