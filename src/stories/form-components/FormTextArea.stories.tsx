import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldValues } from "react-hook-form";
import { useState } from "react";

import { FormTextArea } from "../../../registry/block/form/form-textarea";
import { Form } from "@/components/ui/form";
import { commonIcon } from "../../../registry/shared/common-icon";
import { MyButton } from "../../../registry/block/base-component/my-button";

// Mock control object for story args
const mockControl = {} as Control<FieldValues>;

type FormTextAreaProps = React.ComponentProps<typeof FormTextArea>;

// Individual story components with proper React function components
const DefaultStory = () => {
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);

  const formSchema = z.object({
    textarea: z.string().min(1, "Description is required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textarea: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
          setSubmittedValue(data.textarea);
        })}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormTextArea
          name="textarea"
          label="Description"
          control={form.control}
          placeholder="Enter your description"
        />
        <MyButton
          type="submit"
          icon={commonIcon.checkCircle}
          iconPlacement="right"
        >
          Submit
        </MyButton>

        {submittedValue !== null && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium">Submitted value:</p>
            <p className="text-sm break-words">{submittedValue}</p>
          </div>
        )}
      </form>
    </Form>
  );
};

const DisabledStory = () => {
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      textarea: "This textarea is disabled",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
          setSubmittedValue(data.textarea);
        })}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormTextArea
          name="textarea"
          label="Disabled TextArea"
          control={form.control}
          disabled
        />
        <MyButton
          type="submit"
          icon={commonIcon.checkCircle}
          iconPlacement="right"
        >
          Submit
        </MyButton>

        {submittedValue !== null && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium">Submitted value:</p>
            <p className="text-sm break-words">{submittedValue}</p>
          </div>
        )}
      </form>
    </Form>
  );
};

// Story objects using the proper React components
export const Default: StoryObj<Meta<typeof FormTextArea>> = {
  args: {
    name: "textarea",
    label: "Description",
    placeholder: "Enter your description",
    control: mockControl,
  } as FormTextAreaProps,
  render: () => <DefaultStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormTextArea } from "@/components/form/form-textarea";
import { Form } from "@/components/ui/form";

// Define form schema with validation
const formSchema = z.object({
  textarea: z.string().min(1, "Description is required"),
});

// Create form with React Hook Form
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    textarea: "",
  },
});

// Use FormTextArea in your form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormTextArea
      name="textarea"
      label="Description"
      control={form.control}
      placeholder="Enter your description"
    />
    <button type="submit">Submit</button>
  </form>
</Form>
`,
      },
    },
  },
};

export const Disabled: StoryObj<Meta<typeof FormTextArea>> = {
  args: {
    name: "textarea",
    label: "Disabled TextArea",
    disabled: true,
    control: mockControl,
  } as FormTextAreaProps,
  render: () => <DisabledStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { FormTextArea } from "@/components/form/form-textarea";
import { Form } from "@/components/ui/form";

// Create form with React Hook Form
const form = useForm({
  defaultValues: {
    textarea: "This textarea is disabled",
  },
});

// Use FormTextArea in your form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormTextArea
      name="textarea"
      label="Disabled TextArea"
      control={form.control}
      disabled
    />
    <button type="submit">Submit</button>
  </form>
</Form>
`,
      },
    },
  },
};

/**
 * `FormTextArea` is a form component that integrates a multi-line text input with React Hook Form.
 *
 * ## Features
 * - Fully integrated with React Hook Form
 * - Displays validation errors
 * - Supports placeholder and description
 * - Optional character count display
 *
 * ## Installation
 * ```bash
 * npx shadcn@latest add form-textarea
 * ```
 *
 * ## Usage with React Hook Form
 * ```tsx
 * import { useForm } from 'react-hook-form';
 * import { z } from 'zod';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { FormTextArea } from '@/components/form/form-textarea';
 * import { Form } from '@/components/ui/form';
 *
 * // Define your form schema with Zod
 * const formSchema = z.object({
 *   feedback: z.string().min(10, 'Feedback must be at least 10 characters'),
 * });
 *
 * // Create your form with React Hook Form
 * const form = useForm({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *     feedback: '',
 *   },
 * });
 *
 * // Use the FormTextArea component in your form
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormTextArea
 *       name="feedback"
 *       control={form.control}
 *       label="Your Feedback"
 *       placeholder="Tell us what you think..."
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * </Form>
 * ```
 */
const meta: Meta<typeof FormTextArea> = {
  title: "Form Components/FormTextArea",
  component: FormTextArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
