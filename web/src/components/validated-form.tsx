import {
  type DefaultValues,
  type FieldPath,
  type FieldValues,
  type Resolver,
  type SubmitHandler,
  useForm,
  useFormContext
} from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { format } from "date-fns";
import { CalendarIcon, Upload, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar.tsx";
import { useCallback, useRef, useState } from "react";

export type ValidatedFormProps<TModel extends FieldValues> = {
  defaultValues?: DefaultValues<TModel>;
  resolver: Resolver<TModel>
  className?: string;
  onSubmit: SubmitHandler<TModel>;
  children: React.ReactNode;
  /** If true, form will be reset to defaultValues after successful submission */
  resetOnSuccess?: boolean;
}

export function ValidatedForm<TModel extends FieldValues>(props: ValidatedFormProps<TModel>) {
  const {defaultValues, resolver, className, onSubmit, children, resetOnSuccess = false} = props;

  const methods = useForm({
    defaultValues: defaultValues,
    resolver: resolver,
    reValidateMode: "onChange",
  })

  const handleSubmit: SubmitHandler<TModel> = async (data) => {
    await onSubmit(data);
    // Reset form after successful submission if resetOnSuccess is true
    if (resetOnSuccess) {
      methods.reset(defaultValues);
    }
  }

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className={className}>
        {children}
      </form>
    </Form>
  )
}

export type ValidatedInputProps<
  TModel extends FieldValues = FieldValues,
  TName extends FieldPath<TModel> = FieldPath<TModel>
> = {
  name: TName,
  label?: string
  placeholder?: string
  className?: string
  description?: string
}

export function ValidatedInput<
  TModel extends FieldValues = FieldValues,
  TName extends FieldPath<TModel> = FieldPath<TModel>
>(props: ValidatedInputProps<TModel, TName>) {
  const {control} = useFormContext();

  return (
    <FormField
      control={control}
      name={props.name}
      render={({field}) => (
        <FormItem className={props.className}>
          {props.label &&
            <FormLabel>{props.label}</FormLabel>}
          <FormControl>
            <Input placeholder={props.placeholder} {...field} />
          </FormControl>
          {props.description &&
            <FormDescription>
              {props.description}
            </FormDescription>
          }
          <FormMessage/>
        </FormItem>
      )}
    />
  )
}

export type ValiatedSelectProps<
  TModel extends FieldValues = FieldValues,
  TName extends FieldPath<TModel> = FieldPath<TModel>
> = ValidatedInputProps<TModel, TName> & {
  children: React.ReactNode;
}

export function ValidatedSelect<
  TModel extends FieldValues = FieldValues,
  TName extends FieldPath<TModel> = FieldPath<TModel>
>(props: ValiatedSelectProps<TModel, TName>) {
  const {control} = useFormContext();

  return (
    <FormField
      control={control}
      name={props.name}
      render={({field}) => (
        <FormItem>
          {props.label &&
            <FormLabel>{props.label}</FormLabel>}
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger className={props.className}>
                <SelectValue placeholder={props.placeholder}/>
              </SelectTrigger>
            </FormControl>
            <SelectContent className="h-64">
              {props.children}
            </SelectContent>
          </Select>
          {props.description &&
            <FormDescription>
              {props.description}
            </FormDescription>
          }
          <FormMessage/>
        </FormItem>
      )}
    />
  )
}

export type ValiatedDatePickerProps<
  TModel extends FieldValues = FieldValues,
  TName extends FieldPath<TModel> = FieldPath<TModel>
> = ValidatedInputProps<TModel, TName>

export function ValidatedDatePicker<
  TModel extends FieldValues = FieldValues,
  TName extends FieldPath<TModel> = FieldPath<TModel>
>(props: ValiatedDatePickerProps<TModel, TName>) {
  const {control} = useFormContext();

  return (
    <FormField
      control={control}
      name={props.name}
      render={({field}) => (
        <FormItem>
          {props.label &&
            <FormLabel>{props.label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "dd/MM/yyyy")
                  ) : (
                    <span>{props.placeholder || "Pick a date"}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          {props.description &&
            <FormDescription>
              {props.description}
            </FormDescription>
          }
          <FormMessage/>
        </FormItem>
      )}
    />
  )
}


type BaseProps = {
  label?: string;
  description?: string;
  className?: string;
  accept?: string;          // e.g. "image/*,.pdf"
  multiple?: boolean;       // default: false
  maxFiles?: number;        // default: undefined (no cap)
  maxSizeMB?: number;       // default: undefined (no cap)
};

export type ValidatedFileUploadProps<
  TModel extends FieldValues = FieldValues,
  TName extends FieldPath<TModel> = FieldPath<TModel>
> = BaseProps & {
  name: TName;
  /** Optional async uploader. Return array of URLs (strings) or objects with url and display_name to be saved to form. */
  onUpload?: (files: File[]) => Promise<string[] | { url: string; display_name: string }[]>;
  /** If true, show a small list of selected files with remove actions. */
  showList?: boolean;       // default: true
  /** Placeholder text inside the dropzone. */
  placeholder?: string;     // default: "Drop files here or click to browse"
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export function ValidatedFileUpload<
  TModel extends FieldValues = FieldValues,
  TName extends FieldPath<TModel> = FieldPath<TModel>
>(props: ValidatedFileUploadProps<TModel, TName>) {
  const {
    name,
    label,
    description,
    className,
    accept,
    multiple = false,
    maxFiles,
    maxSizeMB,
    onUpload,
    showList = true,
    placeholder = "Drop files here or click to browse",
  } = props;

  const { control } = useFormContext<TModel>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePick = () => inputRef.current?.click();

  const validateFiles = useCallback((incoming: File[]): File[] => {
    setError(null);
    let files = incoming;

    if (maxFiles && files.length > maxFiles) {
      setError(`You can upload at most ${maxFiles} file(s).`);
      files = files.slice(0, maxFiles);
    }
    if (maxSizeMB) {
      const maxBytes = maxSizeMB * 1024 * 1024;
      const tooBig = files.find(f => f.size > maxBytes);
      if (tooBig) {
        setError(`"${tooBig.name}" exceeds ${maxSizeMB} MB.`);
        files = files.filter(f => f.size <= maxBytes);
      }
    }
    return files;
  }, [maxFiles, maxSizeMB]);

  const processSelection = async (
    files: File[],
    onChange: (val: any) => void,
    existingValue: any
  ) => {
    const ok = validateFiles(files);
    if (ok.length === 0) return;

    if (onUpload) {
      try {
        setUploading(true);
        const result = await onUpload(ok);
        
        // Handle both string arrays and object arrays
        let urls: string[];
        if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'object' && 'url' in result[0]) {
          // Object array with url and display_name
          urls = (result as { url: string; display_name: string }[]).map(item => item.url);
        } else {
          // String array
          urls = result as string[];
        }
        
        // Save URLs to form (single/multiple consistent with prop)
        onChange(multiple ? urls : urls[0] ?? null);
      } catch (e: any) {
        setError(e?.message ?? "Upload failed.");
      } finally {
        setUploading(false);
      }
    } else {
      // Save File(s) directly to form value
      if (multiple) {
        const current: File[] = Array.isArray(existingValue) ? existingValue : [];
        onChange([...current, ...ok]);
      } else {
        onChange(ok[0] ?? null);
      }
    }
  };

  const onInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: any) => void,
    value: any
  ) => {
    const files = Array.from(e.target.files ?? []);
    await processSelection(files, onChange, value);
    // reset to allow reselect same file
    e.target.value = "";
  };

  const onDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    onChange: (val: any) => void,
    value: any
  ) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files ?? []);
    await processSelection(dropped, onChange, value);
  };

  const removeAt = (idx: number, value: any, onChange: (val: any) => void) => {
    if (multiple) {
      const arr = Array.isArray(value) ? [...value] : [];
      arr.splice(idx, 1);
      onChange(arr);
    } else {
      onChange(null);
    }
  };

  const describeItem = (item: unknown): { name: string; size?: number } => {
    if (typeof item === "string") {
      // URL string - try to extract filename from URL
      try {
        const url = new URL(item);
        const pathname = url.pathname;
        const filename = pathname.split('/').pop() || item;
        return { name: filename };
      } catch {
        return { name: item };
      }
    }
    if (item instanceof File) {
      return { name: item.name, size: item.size };
    }
    if (typeof item === "object" && item !== null && "display_name" in item) {
      // Object with display_name
      return { name: (item as { display_name: string }).display_name };
    }
    return { name: String(item ?? "") };
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value;
        const list: Array<File | string | { url: string; display_name: string }> =
          value == null
            ? []
            : Array.isArray(value)
              ? value
              : [value];

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}

            <FormControl>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => onDrop(e, field.onChange, value)}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-6",
                  dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/30"
                )}
                role="button"
                aria-label="File dropzone"
                tabIndex={0}
                onClick={handlePick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handlePick();
                }}
              >
                <Upload className="h-5 w-5 opacity-70" />
                <div className="text-sm text-muted-foreground text-center">
                  {placeholder}
                </div>
                <div className="flex items-center gap-2">
                  {accept && <span className="text-xs text-muted-foreground">({accept})</span>}
                  {maxSizeMB && (
                    <span className="text-xs text-muted-foreground">Max {maxSizeMB} MB</span>
                  )}
                </div>

                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept={accept}
                  multiple={multiple}
                  onChange={(e) => onInputChange(e, field.onChange, value)}
                />
              </div>
            </FormControl>

            {description && <FormDescription>{description}</FormDescription>}

            {(error || uploading) && (
              <div className="mt-2 text-sm">
                {error && <span className="text-destructive">{error}</span>}
                {uploading && !error && <span className="text-muted-foreground">Uploading…</span>}
              </div>
            )}

            {showList && list.length > 0 && (
              <div className="mt-3 space-y-2">
                {list.map((item, idx) => {
                  const d = describeItem(item);
                  return (
                    <div
                      key={`${d.name}-${idx}`}
                      className="flex items-center justify-between rounded-xl border px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{d.name}</div>
                        {typeof d.size === "number" && (
                          <div className="text-xs text-muted-foreground">{formatBytes(d.size)}</div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAt(idx, value, field.onChange)}
                        aria-label={`Remove ${d.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
