import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldValues } from "react-hook-form";
import useSet from "@/hook/useSet";
import React from "react";

import { FormCombobox } from "../../../registry/block/form/form-combobox";
import {
  MyCombobox,
  MyComboboxTriggerLabel,
} from "../../../registry/block/base-component/my-combobox";
import { Form } from "@/components/ui/form";
import { commonIcon } from "../../../registry/lib/common-icon";
import { MyButton } from "../../../registry/block/base-component/my-button";
import { MyIconfy } from "../../../registry/block/base-component/my-icon";

// Sample data for the combobox component
type JobOption = {
  code: string;
  label: string;
  value: number;
};

const jobOptions: JobOption[] = [
  { code: "DEV", label: "Developer", value: 1 },
  { code: "DES", label: "Designer", value: 2 },
  { code: "QA", label: "QA Engineer", value: 3 },
  { code: "PM", label: "Product Manager", value: 4 },
  { code: "UX", label: "UX Researcher", value: 5 },
];

// Mock control object for story args
const mockControl = {} as Control<FieldValues>;

type FormComboboxProps = React.ComponentProps<typeof FormCombobox>;

// Individual story components with proper React function components
const DefaultStory = () => {
  const [submittedValue, setSubmittedValue] = React.useState<number | null>(
    null
  );

  const formSchema = z.object({
    combobox: z.number().min(1, "Please select a job title"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      combobox: null as unknown as number,
    },
  });

  const onSubmit = (data: { combobox: number }) => {
    console.log(data);
    setSubmittedValue(data.combobox);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormCombobox
          name="combobox"
          label="Job Title"
          control={form.control}
          placeholder="Select a job title"
          options={jobOptions}
          select={{ value: "value", label: "label" }}
          fieldFilter={["code", "label"]}
        />
        <MyButton
          type="submit"
          icon={commonIcon.checkCircle}
          iconPlacement="right"
        >
          Submit
        </MyButton>

        {submittedValue !== null && (
          <div className="mt-4 p-2 bg-gray-100 rounded-md space-y-2">
            <div>
              <p className="font-medium">Raw Value:</p>
              <p className="font-mono bg-slate-200 p-1 rounded">
                {submittedValue}
              </p>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};

const ValidationStory = () => {
  const formSchema = z.object({
    combobox: z.number().min(1, "Please select a job title"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      combobox: null as unknown as number,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormCombobox
          name="combobox"
          label="Job Title"
          control={form.control}
          placeholder="Please select a job title"
          options={jobOptions}
          select={{ value: "value", label: "label" }}
          fieldFilter={["code", "label"]}
        />
        <MyButton
          type="submit"
          icon={commonIcon.checkCircle}
          iconPlacement="right"
        >
          Submit
        </MyButton>
      </form>
    </Form>
  );
};

const CustomRenderStory = () => {
  const [submittedValue, setSubmittedValue] = React.useState<number | null>(
    null
  );

  const form = useForm({
    resolver: zodResolver(
      z.object({
        combobox: z.number().min(1, "Please select a job title"),
      })
    ),
    defaultValues: {
      combobox: null as unknown as number,
    },
  });

  const onSubmit = (data: { combobox: number }) => {
    console.log(data);
    setSubmittedValue(data.combobox);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormCombobox
          name="combobox"
          label="Job Title with Custom Rendering"
          control={form.control}
          placeholder="Select a job title"
          options={jobOptions}
          select={{ value: "value", label: "label" }}
          fieldFilter={["code", "label"]}
          renderLabel={(option) => (
            <div className="flex items-center gap-2">
              <MyIconfy icon="lucide:briefcase" size="sm" />
              <MyComboboxTriggerLabel>
                <span className="font-medium">{option.code}</span> -{" "}
                <span>{option.label}</span>
              </MyComboboxTriggerLabel>
            </div>
          )}
        />
        <MyButton
          type="submit"
          icon={commonIcon.checkCircle}
          iconPlacement="right"
        >
          Submit
        </MyButton>

        {submittedValue !== null && (
          <div className="mt-4 p-2 bg-gray-100 rounded-md space-y-2">
            <div>
              <p className="text-sm font-medium">Selected Job Title:</p>
              <p className="text-sm">
                {jobOptions.find((job) => job.value === submittedValue)
                  ?.label || "None"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Raw Value:</p>
              <p className="text-sm font-mono bg-slate-200 p-1 rounded">
                {submittedValue}
              </p>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};

const MultiSelectStory = () => {
  const [submittedValues, setSubmittedValues] = React.useState<{
    raw: number[] | null;
    formatted: string | null;
  }>({
    raw: null,
    formatted: null,
  });

  // Define schema with Set for multi-selection
  const formSchema = z.object({
    multiCombobox: z.set(z.number()),
  });

  // Define form type from schema
  type TForm = z.infer<typeof formSchema>;

  // Define API type - convert Set to string for API
  type TApi = { multiCombobox: string } & Omit<TForm, "multiCombobox">;

  const form = useForm<TForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      multiCombobox: new Set<number>(),
    },
  });

  const onSubmit = (data: TForm) => {
    // Convert Set to string for API
    const apiPayload: TApi = {
      multiCombobox: Array.from(data.multiCombobox).join(","),
    };

    console.log("API Payload:", apiPayload);
    setSubmittedValues({
      raw: Array.from(data.multiCombobox),
      formatted: apiPayload.multiCombobox,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormCombobox
          name="multiCombobox"
          label="Job Titles (Multiple Selection)"
          control={form.control}
          placeholder="Select job titles"
          options={jobOptions}
          select={{ value: "value", label: "label" }}
          fieldFilter={["code", "label"]}
          mode="multiple"
          truncate={2}
        />
        <MyButton
          type="submit"
          icon={commonIcon.checkCircle}
          iconPlacement="right"
        >
          Submit
        </MyButton>

        {submittedValues.raw !== null && (
          <div className="mt-4 p-2 bg-gray-100 rounded-md space-y-2">
            <div>
              <p className="text-sm font-medium">Selected Job Titles:</p>
              <p className="text-sm">
                {submittedValues.raw.length > 0
                  ? submittedValues.raw
                      .map(
                        (id) =>
                          jobOptions.find((job) => job.value === id)?.label
                      )
                      .join(", ")
                  : "None"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">API Payload Format:</p>
              <p className="text-sm font-mono bg-slate-200 p-1 rounded">
                multiCombobox: &ldquo;{submittedValues.formatted}&rdquo;
              </p>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};

const BaseComboboxStory = () => {
  // For a real component, you would initialize this with your selected value
  const [selectedValue, selectedValueActions] = useSet<number>();

  return (
    <div className="w-[350px] p-4 space-y-4 border rounded-md bg-white">
      <div className="space-y-2">
        <label className="text-sm font-medium">Base MyCombobox</label>
        <MyCombobox
          selectedState={[selectedValue, selectedValueActions]}
          options={jobOptions}
          select={{ value: "value", label: "label" }}
          placeholder="Select a job title"
          fieldFilter={["code", "label"]}
          mode="single"
        />
      </div>
      <div className="pt-2">
        <p className="text-sm text-muted-foreground">
          Selected Value:{" "}
          {selectedValue.size > 0 ? Array.from(selectedValue)[0] : "None"}
        </p>
      </div>
    </div>
  );
};

const BaseMultiComboboxStory = () => {
  // For multiple selection
  const [selectedValues, selectedValuesActions] = useSet<number>();

  return (
    <div className="w-[350px] p-4 space-y-4 border rounded-md bg-white">
      <div className="space-y-2">
        <label className="text-sm font-medium">Base Multiple MyCombobox</label>
        <MyCombobox
          selectedState={[selectedValues, selectedValuesActions]}
          options={jobOptions}
          select={{ value: "value", label: "label" }}
          placeholder="Select job titles"
          fieldFilter={["code", "label"]}
          mode="multiple"
          truncate={2}
        />
      </div>
      <div className="pt-2">
        <p className="text-sm text-muted-foreground">
          Selected Values:{" "}
          {selectedValues.size > 0
            ? Array.from(selectedValues).join(", ")
            : "None"}
        </p>
      </div>
    </div>
  );
};

// Story objects using the proper React components
export const Default: StoryObj<Meta<typeof FormCombobox>> = {
  args: {
    name: "combobox",
    label: "Job Title",
    placeholder: "Select a job title",
    options: jobOptions,
    select: { value: "value", label: "label" },
    fieldFilter: ["code", "label"],
    control: mockControl,
  } as FormComboboxProps,
  parameters: {
    docs: {
      source: {
        code: `
// Default FormCombobox with validation and submission display
const FormComboboxExample = () => {
  const [submittedValue, setSubmittedValue] = React.useState(null);
  
  const formSchema = z.object({
    combobox: z.number().min(1, "Please select a job title"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      combobox: null,
    },
  });

  const onSubmit = (data) => {
    setSubmittedValue(data.combobox);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormCombobox
          name="combobox"
          label="Job Title"
          control={form.control}
          placeholder="Select a job title"
          options={jobOptions}
          select={{ value: "value", label: "label" }}
          fieldFilter={["code", "label"]}
        />
        <Button type="submit">Submit</Button>
        
        {submittedValue !== null && (
          <div className="p-2 bg-gray-100 rounded-md space-y-2">
            <div>
              <p className="font-medium">Selected Job Title:</p>
              <p>
                {jobOptions.find(job => job.value === submittedValue)?.label || "None"}
              </p>
            </div>
            <div>
              <p className="font-medium">Raw Value:</p>
              <p className="font-mono bg-slate-200 p-1 rounded">
                {submittedValue}
              </p>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};`,
      },
    },
  },
  render: () => <DefaultStory />,
};

export const WithValidation: StoryObj<Meta<typeof FormCombobox>> = {
  args: {
    name: "combobox",
    label: "Job Title",
    placeholder: "Please select a job title",
    options: jobOptions,
    select: { value: "value", label: "label" },
    fieldFilter: ["code", "label"],
    control: mockControl,
  } as FormComboboxProps,
  parameters: {
    docs: {
      source: {
        code: `
// FormCombobox with validation
const FormComboboxValidation = () => {
  const formSchema = z.object({
    combobox: z.number().min(1, "Please select a job title"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      combobox: null,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormCombobox
          name="combobox"
          label="Job Title"
          control={form.control}
          placeholder="Please select a job title"
          options={jobOptions}
          select={{ value: "value", label: "label" }}
          fieldFilter={["code", "label"]}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};`,
      },
    },
  },
  render: () => <ValidationStory />,
};

export const WithCustomRendering: StoryObj<Meta<typeof FormCombobox>> = {
  args: {
    name: "combobox",
    label: "Job Title with Custom Rendering",
    placeholder: "Select a job title",
    options: jobOptions,
    select: { value: "value", label: "label" },
    fieldFilter: ["code", "label"],
    control: mockControl,
  } as FormComboboxProps,
  parameters: {
    docs: {
      source: {
        code: `
// FormCombobox with custom rendering
const FormComboboxWithCustomRendering = () => {
  const [submittedValue, setSubmittedValue] = React.useState(null);

  const form = useForm({
    resolver: zodResolver(z.object({
      combobox: z.number().min(1, "Please select a job title"),
    })),
    defaultValues: {
      combobox: null,
    },
  });

  const onSubmit = (data) => {
    setSubmittedValue(data.combobox);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormCombobox
          name="combobox"
          label="Job Title with Custom Rendering"
          control={form.control}
          placeholder="Select a job title"
          options={jobOptions}
          select={{ value: "value", label: "label" }}
          fieldFilter={["code", "label"]}
          renderLabel={(option) => (
            <div className="flex items-center gap-2">
              <MyIconfy icon="lucide:briefcase" size="sm" />
              <MyComboboxTriggerLabel>
                <span className="font-medium">{option.code}</span> -{" "}
                <span>{option.label}</span>
              </MyComboboxTriggerLabel>
            </div>
          )}
        />
        <Button type="submit">Submit</Button>
        
        {submittedValue !== null && (
          <div className="p-2 bg-gray-100 rounded-md space-y-2">
            <div>
              <p className="font-medium">Selected Job Title:</p>
              <p>
                {jobOptions.find(job => job.value === submittedValue)?.label || "None"}
              </p>
            </div>
            <div>
              <p className="font-medium">Raw Value:</p>
              <p className="font-mono bg-slate-200 p-1 rounded">
                {submittedValue}
              </p>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};`,
      },
    },
  },
  render: () => <CustomRenderStory />,
};

export const MultipleSelection: StoryObj<Meta<typeof FormCombobox>> = {
  args: {
    name: "multiCombobox",
    label: "Job Titles (Multiple Selection)",
    placeholder: "Select job titles",
    options: jobOptions,
    select: { value: "value", label: "label" },
    fieldFilter: ["code", "label"],
    mode: "multiple",
    truncate: 2,
    control: mockControl,
  } as FormComboboxProps,
  parameters: {
    docs: {
      source: {
        code: `
// FormCombobox with multiple selection
const MultipleSelectionCombobox = () => {
  // Define schema with Set for multi-selection
  const formSchema = z.object({
    multiCombobox: z.set(z.number()),
  });

  // Define form type from schema
  type TForm = z.infer<typeof formSchema>;
  
  // Define API type - convert Set to string for API
  type TApi = { multiCombobox: string } & Omit<TForm, "multiCombobox">;

  const form = useForm<TForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      multiCombobox: new Set<number>(),
    },
  });

  const onSubmit = (data: TForm) => {
    // Convert Set to string for API
    const apiPayload: TApi = {
      multiCombobox: Array.from(data.multiCombobox).join(","),
    };
    
    console.log("API Payload:", apiPayload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormCombobox
          name="multiCombobox"
          label="Job Titles (Multiple Selection)"
          control={form.control}
          placeholder="Select job titles"
          options={jobOptions}
          select={{ value: "value", label: "label" }}
          fieldFilter={["code", "label"]}
          mode="multiple"
          truncate={2}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};`,
      },
    },
  },
  render: () => <MultiSelectStory />,
};

export const BaseCombobox: StoryObj<Meta<typeof FormCombobox>> = {
  args: {} as FormComboboxProps,
  parameters: {
    docs: {
      source: {
        code: `
// Using the base MyCombobox component directly
const BaseComboboxExample = () => {
  // For a real component, you would initialize this with your selected value
  const [selectedValue, selectedValueActions] = useSet<number>();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Base MyCombobox</label>
      <MyCombobox
        selectedState={[selectedValue, selectedValueActions]}
        options={jobOptions}
        select={{ value: "value", label: "label" }}
        placeholder="Select a job title"
        fieldFilter={["code", "label"]}
        mode="single"
      />
      <div className="pt-2">
        <p className="text-sm text-muted-foreground">
          Selected Value:{" "}
          {selectedValue.size > 0 ? Array.from(selectedValue)[0] : "None"}
        </p>
      </div>
    </div>
  );
};`,
      },
    },
  },
  render: () => <BaseComboboxStory />,
};

export const BaseMultiCombobox: StoryObj<Meta<typeof FormCombobox>> = {
  args: {} as FormComboboxProps,
  parameters: {
    docs: {
      source: {
        code: `
// Using the base MyCombobox component directly with multiple selection
const BaseMultiComboboxExample = () => {
  // For multiple selection
  const [selectedValues, selectedValuesActions] = useSet<number>();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Base Multiple MyCombobox</label>
      <MyCombobox
        selectedState={[selectedValues, selectedValuesActions]}
        options={jobOptions}
        select={{ value: "value", label: "label" }}
        placeholder="Select job titles"
        fieldFilter={["code", "label"]}
        mode="multiple"
        truncate={2}
      />
      <div className="pt-2">
        <p className="text-sm text-muted-foreground">
          Selected Values:{" "}
          {selectedValues.size > 0
            ? Array.from(selectedValues).join(", ")
            : "None"}
        </p>
      </div>
    </div>
  );
};`,
      },
    },
  },
  render: () => <BaseMultiComboboxStory />,
};

// Default export for Storybook
/**
 * `FormCombobox` is a form component that integrates a searchable dropdown with React Hook Form.
 *
 * ## Features
 * - Fully integrated with React Hook Form
 * - Displays validation errors
 * - Supports single and multiple selection modes
 * - Searchable dropdown with customizable filtering
 * - Custom rendering of options and trigger
 *
 * ## Installation
 * ```bash
 * npx shadcn@latest add https://story-book-comp-tw-v4.vercel.app/registry/form-combobox.json
 * ```
 *
 * ## Usage with React Hook Form
 * ```tsx
 * import { useForm } from 'react-hook-form';
 * import { z } from 'zod';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { FormCombobox } from '@/components/form/form-combobox';
 * import { Form } from '@/components/ui/form';
 *
 * // Define your form schema with Zod
 * const formSchema = z.object({
 *   jobTitle: z.number().min(1, 'Please select a job title'),
 * });
 *
 * // Create your form with React Hook Form
 * const form = useForm({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *     jobTitle: null,
 *   },
 * });
 *
 * // Define your options
 * const jobOptions = [
 *   { code: 'DEV', label: 'Developer', value: 1 },
 *   { code: 'DES', label: 'Designer', value: 2 },
 *   { code: 'QA', label: 'QA', value: 3 },
 * ];
 *
 * // Use the FormCombobox component in your form
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormCombobox
 *       name="jobTitle"
 *       control={form.control}
 *       label="Job Title"
 *       placeholder="Select a job title"
 *       options={jobOptions}
 *       select={{ value: 'value', label: 'label' }}
 *       fieldFilter={['code', 'label']} // Fields to search in
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * </Form>
 * ```
 *
 * ## Handling Types for API Requests
 * When working with combobox components (especially with multiple selection), you need to properly type your form and API payloads:
 *
 * ```tsx
 * // Define your Zod schema
 * const formSchema = z.object({
 *   // For single selection combobox
 *   singleSelect: z.number().min(1),
 *   // For multiple selection combobox - uses a Set for form state
 *   multiSelect: z.set(z.number()),
 * });
 *
 * // Infer the form type from the schema
 * type TForm = z.infer<typeof formSchema>;
 *
 * // Define API payload type - convert Set to string for the API
 * type TApi = { multiSelect: string } & Omit<
 *   z.infer<typeof formSchema>,
 *   "multiSelect"
 * >;
 *
 * // In your component
 * const form = useForm<TForm>({
 *   resolver: zodResolver(formSchema),
 * });
 *
 * // Convert Set to string in the submit handler
 * function onSubmit(payload: TForm) {
 *   const apiPayload: TApi = {
 *     ...payload,
 *     multiSelect: Array.from(payload.multiSelect).join(","),
 *   };
 *
 *   // Send apiPayload to your API
 * }
 * ```
 *
 * ## Using MyCombobox directly (without form integration)
 * ```tsx
 * import { MyCombobox } from '@/components/base-component/my-combobox';
 * import useSet from '@/hooks/useSet';
 *
 * const jobOptions = [
 *   { code: 'DEV', label: 'Developer', value: 1 },
 *   { code: 'DES', label: 'Designer', value: 2 },
 *   { code: 'QA', label: 'QA', value: 3 },
 * ];
 *
 * // For single selection
 * const [selectedValue, selectedValueActions] = useSet<number>();
 *
 * // For multiple selection
 * const [selectedValues, selectedValuesActions] = useSet<number>();
 *
 * // Single select combobox
 * <MyCombobox
 *   selectedState={[selectedValue, selectedValueActions]}
 *   options={jobOptions}
 *   select={{ value: 'value', label: 'label' }}
 *   placeholder="Select a job title"
 *   mode="single"
 * />
 *
 * // Multiple select combobox
 * <MyCombobox
 *   selectedState={[selectedValues, selectedValuesActions]}
 *   options={jobOptions}
 *   select={{ value: 'value', label: 'label' }}
 *   placeholder="Select job titles"
 *   mode="multiple"
 * />
 * ```
 */
const meta: Meta<typeof FormCombobox> = {
  title: "Form Components/FormCombobox",
  component: FormCombobox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
