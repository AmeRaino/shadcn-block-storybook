import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldValues } from "react-hook-form";
import React from "react";

import { FormInput } from "../../../registry/block/form/form-input";
import { Form } from "@/components/ui/form";
import { commonIcon } from "../../../registry/lib/common-icon";
import { MyButton } from "../../../registry/block/base-component/my-button";
import { MyIconfy } from "../../../registry/block/base-component/my-icon";

// Mock control object for story args
const mockControl = {} as Control<FieldValues>;

type FormInputProps = React.ComponentProps<typeof FormInput>;

/**
 * `FormInput` is a form component that integrates a basic input field with React Hook Form.
 *
 * ## Features
 * - Fully integrated with React Hook Form
 * - Displays validation errors
 * - Supports all features of the base MyInput component
 *
 * ## Installation
 * ```bash
 * npx shadcn@latest add https://story-book-comp-tw-v4.vercel.app/registry/form-input.json
 * ```
 *
 * ## Usage with React Hook Form
 * ```tsx
 * import { useForm } from 'react-hook-form';
 * import { z } from 'zod';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { FormInput } from '@/components/form/form-input';
 * import { Form } from '@/components/ui/form';
 *
 * // Define your form schema with Zod
 * const formSchema = z.object({
 *   username: z.string().min(3, 'Username must be at least 3 characters'),
 * });
 *
 * // Create your form with React Hook Form
 * const form = useForm({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *     username: '',
 *   },
 * });
 *
 * // Use the FormInput component in your form
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormInput
 *       name="username"
 *       label="Username"
 *       control={form.control}
 *       placeholder="Enter your username"
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * </Form>
 * ```
 */

const meta = {
  title: "Form Components/FormInput",
  component: FormInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component for the form to provide the React Hook Form context
const FormWrapper = ({
  children,
  onSubmit,
}: {
  children: (control: Control<{ input: string }>) => React.ReactNode;
  onSubmit?: (data: Record<string, unknown>) => void;
}) => {
  const formSchema = z.object({
    input: z.string().min(3, "Input must be at least 3 characters"),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  const [submittedValues, setSubmittedValues] =
    React.useState<FormValues | null>(null);

  const handleSubmit = (data: FormValues) => {
    console.log(data);
    setSubmittedValues(data);
    if (onSubmit) onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-[400px] space-y-4 p-4 border rounded-md bg-white"
      >
        {children(form.control)}
        <MyButton
          type="submit"
          icon={commonIcon.checkCircle}
          iconPlacement="right"
        >
          Submit
        </MyButton>

        {submittedValues && (
          <div className="mt-4 p-2 bg-slate-100 rounded-md">
            <p className="font-medium text-sm">Submitted Values:</p>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(submittedValues, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </Form>
  );
};

// Individual story components with proper React function components
const DefaultStory = () => {
  return (
    <FormWrapper>
      {(control) => (
        <FormInput
          name="input"
          label="Username"
          control={control}
          placeholder="Enter your username"
          required
        />
      )}
    </FormWrapper>
  );
};

const DisabledStory = () => {
  return (
    <FormWrapper>
      {(control) => (
        <FormInput
          name="input"
          label="Disabled Input"
          control={control}
          placeholder="You can't edit this"
          disabled
          required
        />
      )}
    </FormWrapper>
  );
};

const WithPrefixStory = () => {
  return (
    <FormWrapper>
      {(control) => (
        <FormInput
          name="input"
          label="Search"
          control={control}
          placeholder="Search..."
          prefix={<MyIconfy icon={commonIcon.searchIcon} size="sm" />}
          required
        />
      )}
    </FormWrapper>
  );
};

// Add a new story for number input with suffix
const NumberWithSuffixStory = () => {
  const numberFormSchema = z.object({
    input: z.string().min(1, "Please enter a number"),
  });

  type NumberFormValues = z.infer<typeof numberFormSchema>;

  const form = useForm<NumberFormValues>({
    resolver: zodResolver(numberFormSchema),
    defaultValues: {
      input: "",
    },
  });

  const [submittedValues, setSubmittedValues] =
    React.useState<NumberFormValues | null>(null);

  const handleSubmit = (data: NumberFormValues) => {
    console.log(data);
    setSubmittedValues(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormInput
          className="pe-12"
          name="input"
          label="Amount"
          control={form.control}
          placeholder="0.00"
          type="number"
          suffix={<span>USD</span>}
          required
        />
        <MyButton
          type="submit"
          icon={commonIcon.checkCircle}
          iconPlacement="right"
        >
          Submit
        </MyButton>

        {submittedValues && (
          <div className="mt-4 p-2 bg-slate-100 rounded-md">
            <p className="font-medium text-sm">Submitted Values:</p>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(submittedValues, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </Form>
  );
};

// Add a new story for custom label
const CustomLabelStory = () => {
  return (
    <FormWrapper>
      {(control) => (
        <FormInput
          name="input"
          label={
            <div className="inline-flex items-center gap-1">
              <span>Custom Label</span>
              <MyIconfy icon="lucide:star" size="sm" />
            </div>
          }
          control={control}
          placeholder="Enter input with custom label"
          required
        />
      )}
    </FormWrapper>
  );
};

// Add a story for horizontal direction and gap control
const HorizontalDirectionStory = () => {
  return (
    <FormWrapper>
      {(control) => (
        <div className="max-w-[800px] space-y-8">
          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Default horizontal with gap-x-2 (default)
            </div>
            <FormInput
              name="input"
              label="Username"
              control={control}
              placeholder="Enter your username"
              direction="horizontal"
              required
            />
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Horizontal with custom gap-x-10
            </div>
            <FormInput
              name="input"
              label="Email"
              control={control}
              placeholder="Enter your email"
              direction="horizontal"
              containerProps={{ className: "gap-x-10" }}
              required
            />
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Grid layout with multiple columns (notice items-start is required)
            </div>
            <div className="grid grid-cols-2 gap-4 items-start">
              <FormInput
                name="input"
                label="Col 1"
                control={control}
                placeholder="Enter Col 1"
                direction="horizontal"
                containerProps={{ className: "gap-x-4" }}
                required
              />
              <FormInput
                name="input"
                label="Col 2"
                control={control}
                placeholder="Enter Col 2"
                direction="horizontal"
                containerProps={{ className: "gap-x-4" }}
                required
              />
            </div>
          </div>
        </div>
      )}
    </FormWrapper>
  );
};

// Story objects using the proper React components
export const Default: Story = {
  args: {
    name: "input",
    label: "Username",
    placeholder: "Enter your username",
    required: true,
    control: mockControl,
  } as FormInputProps,
  render: () => <DefaultStory />,
  parameters: {
    docs: {
      story: { inline: true },
      source: {
        code: `
<FormInput
  name="input"
  label="Username"
  control={form.control}
  placeholder="Enter your username"
  required
/>`,
        language: "tsx",
        type: "code",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    name: "input",
    label: "Disabled Input",
    placeholder: "You can't edit this",
    disabled: true,
    required: true,
    control: mockControl,
  } as FormInputProps,
  render: () => <DisabledStory />,
  parameters: {
    docs: {
      story: { inline: true },
      source: {
        code: `
<FormInput
  name="input"
  label="Disabled Input"
  control={form.control}
  placeholder="You can't edit this"
  disabled
  required
/>`,
        language: "tsx",
        type: "code",
      },
    },
  },
};

export const WithPrefix: Story = {
  args: {
    name: "input",
    label: "Search",
    placeholder: "Search...",
    required: true,
    control: mockControl,
  } as FormInputProps,
  render: () => <WithPrefixStory />,
  parameters: {
    docs: {
      story: { inline: true },
      source: {
        code: `
<FormInput
  name="input"
  label="Search"
  control={form.control}
  placeholder="Search..."
  prefix={<MyIconfy icon={commonIcon.searchIcon} size="sm" />}
  required
/>`,
        language: "tsx",
        type: "code",
      },
    },
  },
};

// Add the NumberWithSuffix story
export const NumberWithSuffix: Story = {
  args: {
    name: "input",
    label: "Amount",
    placeholder: "0.00",
    type: "number",
    required: true,
    control: mockControl,
  } as FormInputProps,
  render: () => <NumberWithSuffixStory />,
  parameters: {
    docs: {
      story: { inline: true },
      source: {
        code: `
<FormInput
  className="pe-12"
  name="input"
  label="Amount"
  control={form.control}
  placeholder="0.00"
  type="number"
  suffix={<span>USD</span>}
  required
/>`,
        language: "tsx",
        type: "code",
      },
    },
  },
};

// Add the CustomLabel story
export const CustomLabel: Story = {
  args: {
    name: "input",
    label: "Custom Label with Icon",
    placeholder: "Enter input with custom label",
    required: true,
    control: mockControl,
  } as FormInputProps,
  render: () => <CustomLabelStory />,
  parameters: {
    docs: {
      story: { inline: true },
      source: {
        code: `
<FormInput
  name="input"
  label={
    <div className="inline-flex items-center gap-1">
      <span>Custom Label</span>
      <MyIconfy icon="lucide:star" size="sm" />
    </div>
  }
  control={control}
  placeholder="Enter input with custom label"
  required
/>`,
        language: "tsx",
        type: "code",
      },
    },
  },
};

// Add a story for horizontal direction and gap control
export const HorizontalDirection: Story = {
  args: {
    name: "input",
    label: "Horizontal Layout",
    placeholder: "Horizontal input example",
    direction: "horizontal",
    required: true,
    control: mockControl,
  } as FormInputProps,
  render: () => <HorizontalDirectionStory />,
  parameters: {
    docs: {
      story: { inline: true },
      source: {
        code: `
{/* Default horizontal layout with gap-x-2 */}
<FormInput
  name="input"
  label="Username"
  control={form.control}
  placeholder="Enter your username"
  direction="horizontal"
  required
/>

{/* Customize gap with containerProps */}
<FormInput
  name="input"
  label="Email"
  control={form.control}
  placeholder="Enter your email"
  direction="horizontal"
  containerProps={{ className: "gap-x-10" }}
  required
/>

{/* Grid layout with multiple columns - items-start is required */}
<div className="grid grid-cols-2 gap-4 items-start">
  <FormInput
    name="input"
    label="Col 1"
    control={control}
    placeholder="Enter Col 1"
    direction="horizontal"
    containerProps={{ className: "gap-x-4" }}
    required
  />
  <FormInput
    name="input"
    label="Col 2"
    control={control}
    placeholder="Enter Col 2"
    direction="horizontal"
    containerProps={{ className: "gap-x-4" }}
    required
  />
</div>`,
        language: "tsx",
        type: "code",
      },
    },
  },
};
