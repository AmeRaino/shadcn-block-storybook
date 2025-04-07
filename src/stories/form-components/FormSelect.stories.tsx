import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldValues } from "react-hook-form";
import React from "react";

import { FormSelect } from "@/components/form/form-select";
import { Form } from "@/components/ui/form";
import { commonIcon } from "@/shared/common-icon";
import { MyButton } from "@/components/base-component/my-button";
import { MyIconfy } from "@/components/base-component/my-icon";

// Sample data for the select component
type Option = {
  value: string | number;
  label: string;
};

const sampleOptions: Option[] = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
  { value: "4", label: "Option 4" },
];

const genderOptions: Option[] = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
  { value: "3", label: "Non-binary" },
];

// Mock control object for story args
const mockControl = {} as Control<FieldValues>;

type FormSelectProps = React.ComponentProps<typeof FormSelect>;

// Define a type for our form values
type FormValues = {
  select: string;
};

// Individual story components with proper React function components
const DefaultStory = () => {
  const [submittedValue, setSubmittedValue] = React.useState<string | null>(
    null
  );

  const formSchema = z.object({
    select: z.string().min(1, "Please select an option"),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      select: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted with data:", data);
    setSubmittedValue(data.select);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormSelect
          name="select"
          label="Choose an option"
          control={form.control}
          placeholder="Select an option"
          options={sampleOptions}
          select={{ value: "value", label: "label" }}
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
              <p className="font-medium">Selected Option:</p>
              <p>
                {sampleOptions.find(
                  (opt) => opt.value.toString() === submittedValue
                )?.label || "None"}
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
};

const WithCustomRenderingStory = () => {
  const [submittedValue, setSubmittedValue] = React.useState<string | null>(
    null
  );

  const formSchema = z.object({
    select: z.string().min(1, "Please select a gender"),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      select: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted with data:", data);
    setSubmittedValue(data.select);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormSelect
          name="select"
          label="Gender"
          control={form.control}
          placeholder="Select gender"
          options={genderOptions}
          select={{ value: "value", label: "label" }}
          renderLabel={(option) => (
            <div className="flex items-center gap-2">
              <MyIconfy icon="lucide:user" size="sm" />
              <span>{option.label}</span>
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
              <p className="font-medium">Selected Gender:</p>
              <p>
                {genderOptions.find(
                  (opt) => opt.value.toString() === submittedValue
                )?.label || "None"}
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
};

const DisabledStory = () => {
  const formSchema = z.object({
    select: z.string().min(1, "Please select an option"),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      select: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(console.log)}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormSelect
          name="select"
          label="Disabled"
          control={form.control}
          placeholder="This select is disabled"
          options={sampleOptions}
          select={{ value: "value", label: "label" }}
          disabled
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

// Story objects using the proper React components
export const Default: StoryObj<Meta<typeof FormSelect>> = {
  args: {
    name: "select",
    label: "Choose an option",
    placeholder: "Select an option",
    options: sampleOptions,
    select: { value: "value", label: "label" },
    control: mockControl,
  } as FormSelectProps,
  parameters: {
    docs: {
      source: {
        code: `
// Default FormSelect with validation and submission display
const FormSelectExample = () => {
  const [submittedValue, setSubmittedValue] = React.useState(null);
  
  const formSchema = z.object({
    select: z.string().min(1, "Please select an option"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      select: "",
    },
  });

  const onSubmit = (data) => {
    setSubmittedValue(data.select);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormSelect
          name="select"
          label="Choose an option"
          control={form.control}
          placeholder="Select an option"
          options={sampleOptions}
          select={{ value: "value", label: "label" }}
        />
        <Button type="submit">Submit</Button>
        
        {submittedValue !== null && (
          <div className="p-2 bg-gray-100 rounded-md space-y-2">
            <div>
              <p className="font-medium">Selected Option:</p>
              <p>
                {sampleOptions.find(opt => opt.value.toString() === submittedValue)?.label || "None"}
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

export const WithCustomRendering: StoryObj<Meta<typeof FormSelect>> = {
  args: {
    name: "select",
    label: "Gender",
    placeholder: "Select gender",
    options: genderOptions,
    select: {
      value: "value",
      label: "label",
    },
    control: mockControl,
  } as FormSelectProps,
  parameters: {
    docs: {
      source: {
        code: `
// FormSelect with custom rendering
const FormSelectWithCustomRendering = () => {
  const [submittedValue, setSubmittedValue] = React.useState(null);

  const form = useForm({
    resolver: zodResolver(z.object({
      select: z.string().min(1, "Please select a gender"),
    })),
    defaultValues: {
      select: "",
    },
  });

  const onSubmit = (data) => {
    setSubmittedValue(data.select);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormSelect
          name="select"
          label="Gender"
          control={form.control}
          placeholder="Select gender"
          options={genderOptions}
          select={{ value: "value", label: "label" }}
          renderLabel={(option) => (
            <div className="flex items-center gap-2">
              <MyIconfy icon="lucide:user" size="sm" />
              <span>{option.label}</span>
            </div>
          )}
        />
        <Button type="submit">Submit</Button>
        
        {submittedValue !== null && (
          <div className="p-2 bg-gray-100 rounded-md space-y-2">
            <div>
              <p className="font-medium">Selected Gender:</p>
              <p>
                {genderOptions.find(opt => opt.value.toString() === submittedValue)?.label || "None"}
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
  render: () => <WithCustomRenderingStory />,
};

export const Disabled: StoryObj<Meta<typeof FormSelect>> = {
  args: {
    name: "select",
    label: "Disabled",
    placeholder: "This select is disabled",
    options: sampleOptions,
    select: { value: "value", label: "label" },
    disabled: true,
    control: mockControl,
  } as FormSelectProps,
  parameters: {
    docs: {
      source: {
        code: `
// Disabled FormSelect
const DisabledFormSelect = () => {
  const form = useForm({
    defaultValues: {
      select: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormSelect
          name="select"
          label="Disabled"
          control={form.control}
          placeholder="This select is disabled"
          options={sampleOptions}
          select={{ value: "value", label: "label" }}
          disabled
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};`,
      },
    },
  },
  render: () => <DisabledStory />,
};

/**
 * `FormSelect` is a form component that integrates a dropdown select with React Hook Form.
 *
 * ## Features
 * - Fully integrated with React Hook Form
 * - Displays validation errors
 * - Customizable option mapping
 * - Custom rendering of options
 *
 * ## Usage with React Hook Form
 * ```tsx
 * import { useForm } from 'react-hook-form';
 * import { z } from 'zod';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { FormSelect } from '@/components/form/form-select';
 * import { Form } from '@/components/ui/form';
 *
 * // Define your form schema with Zod
 * const formSchema = z.object({
 *   gender: z.string().min(1, 'Please select a gender'),
 * });
 *
 * // Create your form with React Hook Form
 * const form = useForm({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *     gender: '',
 *   },
 * });
 *
 * // Define your options
 * const genderOptions = [
 *   { value: '1', label: 'Male' },
 *   { value: '2', label: 'Female' },
 *   { value: '3', label: 'Non-binary' },
 * ];
 *
 * // Use the FormSelect component in your form
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormSelect
 *       name="gender"
 *       control={form.control}
 *       label="Gender"
 *       placeholder="Select a gender"
 *       options={genderOptions}
 *       select={{ value: 'value', label: 'label' }}
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * </Form>
 * ```
 */
const meta: Meta<typeof FormSelect> = {
  title: "Form Components/FormSelect",
  component: FormSelect,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
