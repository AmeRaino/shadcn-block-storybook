import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldValues } from "react-hook-form";
import React from "react";

import { FormFloatLabelInput } from "../../../registry/block/form/form-float-label-input";
import { Form } from "@/components/ui/form";
import { commonIcon } from "../../../registry/lib/common-icon";
import { MyButton } from "../../../registry/block/base-component/my-button";
import { MyIconfy } from "../../../registry/block/base-component/my-icon";
import { MyFloatingLabelInput } from "../../../registry/block/base-component/my-input";

// Mock control object for story args
const mockControl = {} as Control<FieldValues>;

type FormFloatLabelInputProps = React.ComponentProps<
  typeof FormFloatLabelInput
>;

/**
 * `FormFloatLabelInput` is a form component that integrates a floating label input field with React Hook Form.
 *
 * ## Features
 * - Fully integrated with React Hook Form
 * - Displays validation errors
 * - Floating label that moves when input is focused or has content
 * - Supports custom styling for the label
 *
 * ## Installation
 * ```bash
 * npx shadcn@latest add https://story-book-comp-tw-v4.vercel.app/registry/form-float-label-input.json
 * ```
 *
 * ## Usage with React Hook Form
 * ```tsx
 * import { useForm } from 'react-hook-form';
 * import { z } from 'zod';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { FormFloatLabelInput } from '@/components/form/form-float-label-input';
 * import { Form } from '@/components/ui/form';
 *
 * // Define your form schema with Zod
 * const formSchema = z.object({
 *   email: z.string().email('Invalid email address'),
 * });
 *
 * // Create your form with React Hook Form
 * const form = useForm({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *     email: '',
 *   },
 * });
 *
 * // Use the FormFloatLabelInput component in your form
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormFloatLabelInput
 *       name="email"
 *       label="Email Address"
 *       control={form.control}
 *       float={true}
 *       required
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * </Form>
 * ```
 */

const meta = {
  title: "Form Components/FormFloatLabelInput",
  component: FormFloatLabelInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FormFloatLabelInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component for the form to provide the React Hook Form context
const FormWrapper = ({
  children,
  onSubmit,
  width = "350px",
}: {
  children: (control: Control<{ input: string }>) => React.ReactNode;
  onSubmit?: (data: Record<string, unknown>) => void;
  width?: string;
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
        className={`w-[${width}] space-y-4 p-4 border rounded-md bg-white`}
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
        <FormFloatLabelInput
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

const CustomLabelStory = () => {
  return (
    <FormWrapper>
      {(control) => (
        <FormFloatLabelInput
          name="input"
          label={
            <div className="inline-flex items-center gap-1">
              <span>Email Address</span>
              <MyIconfy icon="lucide:mail" size="sm" />
            </div>
          }
          control={control}
          placeholder="Enter your email"
          required
        />
      )}
    </FormWrapper>
  );
};

// Standalone usage example (not within a form)
const StandaloneUsageStory = () => {
  return (
    <div className="w-[350px] p-4 border rounded-md bg-white">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Standalone Usage Example</h3>
        <MyFloatingLabelInput
          label="Search Products"
          placeholder="Type to search..."
        />
        <p className="text-xs text-gray-500">
          This example shows the MyFloatingLabelInput component used outside of
          a form context.
        </p>
      </div>
    </div>
  );
};

// Dedicated story to showcase float={true} behavior
const FloatingLabelStory = () => {
  return (
    <FormWrapper>
      {(control) => (
        <FormFloatLabelInput
          name="input"
          label="Floating Label Example"
          control={control}
          placeholder="Label will always float above the input"
          float={true}
          required
        />
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
    float: true,
    required: true,
    control: mockControl,
  } as FormFloatLabelInputProps,
  render: () => <DefaultStory />,
  parameters: {
    docs: {
      story: { inline: true },
      source: {
        code: `
<FormFloatLabelInput
  name="input"
  label="Username"
  control={form.control}
  placeholder="Enter your username"
  float
  required
/>`,
        language: "tsx",
        type: "code",
      },
    },
  },
};

export const FloatingLabel: Story = {
  args: {
    name: "input",
    label: "Floating Label Example",
    placeholder: "Type something to see the float effect",
    float: true,
    required: true,
    control: mockControl,
  } as FormFloatLabelInputProps,
  render: () => <FloatingLabelStory />,
  parameters: {
    docs: {
      story: { inline: true },
      description: {
        story:
          "This example clearly demonstrates the floating label behavior. The label stays floating above the input field regardless of the input's content.",
      },
      source: {
        code: `
<FormFloatLabelInput
  name="input"
  label="Floating Label Example"
  control={form.control}
  placeholder="Type something to see the float effect"
  float={true}
  required
/>`,
        language: "tsx",
        type: "code",
      },
    },
  },
};

export const CustomLabel: Story = {
  args: {
    name: "input",
    label: "Custom Label with Icon",
    placeholder: "Enter your email",
    float: true,
    required: true,
    control: mockControl,
  } as FormFloatLabelInputProps,
  render: () => <CustomLabelStory />,
  parameters: {
    docs: {
      story: { inline: true },
      source: {
        code: `
<FormFloatLabelInput
  name="input"
  label={
    <div className="inline-flex items-center gap-1">
      <span>Email Address</span>
      <MyIconfy icon="lucide:mail" size="sm" />
    </div>
  }
  control={form.control}
  placeholder="Enter your email"
  float
  required
/>`,
        language: "tsx",
        type: "code",
      },
    },
  },
};

export const StandaloneUsage: Story = {
  args: {} as FormFloatLabelInputProps,
  render: () => <StandaloneUsageStory />,
  parameters: {
    docs: {
      story: { inline: true },
      source: {
        code: `
// Using the base MyFloatingLabelInput component outside a form
<MyFloatingLabelInput 
  label="Search Products" 
  placeholder="Type to search..."
  float
/>`,
        language: "tsx",
        type: "code",
      },
    },
  },
};
