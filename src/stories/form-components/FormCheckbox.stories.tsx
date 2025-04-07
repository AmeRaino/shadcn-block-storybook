import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldValues } from "react-hook-form";
import React from "react";

import { FormCheckbox } from "@/components/form/form-checkbox";
import { Form } from "@/components/ui/form";
import { commonIcon } from "@/shared/common-icon";
import { MyButton } from "@/components/base-component/my-button";

// Mock control object for story args
const mockControl = {} as Control<FieldValues>;

type FormCheckboxProps = React.ComponentProps<typeof FormCheckbox>;

/**
 * `FormCheckbox` is a form component that integrates a checkbox with React Hook Form.
 *
 * ## Features
 * - Fully integrated with React Hook Form
 * - Displays validation errors
 * - Supports custom descriptions and labels
 * - Customizable container styling
 *
 * ## Usage with React Hook Form
 * ```tsx
 * import { useForm } from 'react-hook-form';
 * import { z } from 'zod';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { FormCheckbox } from '@/components/form/form-checkbox';
 * import { Form } from '@/components/ui/form';
 *
 * // Define your form schema with Zod
 * const formSchema = z.object({
 *   acceptTerms: z.boolean().refine(val => val === true, {
 *     message: 'You must accept the terms and conditions',
 *   }),
 * });
 *
 * // Create your form with React Hook Form
 * const form = useForm({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *     acceptTerms: false,
 *   },
 * });
 *
 * // Use the FormCheckbox component in your form
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormCheckbox 
containerProps={{
                      className: "inline-flex items-center gap-2",
                    }}
 *       name="acceptTerms"
 *       control={form.control}
 *       description="I accept the terms and conditions"
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * </Form>
 * ```
 */
const meta = {
  title: "Form Components/FormCheckbox",
  component: FormCheckbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FormCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component for the form to provide the React Hook Form context
const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const formSchema = z.object({
    checkbox: z.boolean().default(false),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkbox: false,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        {children}
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

// Individual story components with proper React function components
const DefaultStory = () => {
  const [submittedValue, setSubmittedValue] = React.useState<boolean | null>(
    null
  );

  const formSchema = z.object({
    checkbox: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkbox: false,
    },
  });

  const onSubmit = (data: { checkbox: boolean }) => {
    console.log(data);
    setSubmittedValue(data.checkbox);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormCheckbox
          name="checkbox"
          control={form.control}
          description="Accept terms and conditions"
        />
        <MyButton
          type="submit"
          icon={commonIcon.checkCircle}
          iconPlacement="right"
        >
          Submit
        </MyButton>

        {submittedValue !== null && (
          <div className="mt-4 p-2 bg-gray-100 rounded-md">
            <p className="text-sm font-medium">Submitted Value:</p>
            <p className="text-sm">
              {submittedValue ? "Accepted" : "Not Accepted"}
            </p>
          </div>
        )}
      </form>
    </Form>
  );
};

const ValidationStory = () => {
  const formSchema = z.object({
    checkbox: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkbox: false,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormCheckbox
          name="checkbox"
          control={form.control}
          description="I accept the terms and conditions"
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

const WithLabelStory = () => {
  const form = useForm({
    defaultValues: {
      checkbox: false,
    },
  });

  return (
    <FormWrapper>
      <FormCheckbox
        name="checkbox"
        label="Terms and Conditions"
        control={form.control}
        description="I accept the terms and conditions"
      />
    </FormWrapper>
  );
};

const DisabledStory = () => {
  const form = useForm({
    defaultValues: {
      checkbox: false,
    },
  });

  return (
    <FormWrapper>
      <FormCheckbox
        name="checkbox"
        control={form.control}
        description="This checkbox is disabled"
        disabled
      />
    </FormWrapper>
  );
};

const CustomContainerStory = () => {
  const form = useForm({
    defaultValues: {
      checkbox: false,
    },
  });

  return (
    <FormWrapper>
      <FormCheckbox
        containerProps={{
          className: "flex items-center gap-2 p-2 rounded bg-slate-100",
        }}
        name="checkbox"
        control={form.control}
        description="Custom container with styling"
      />
    </FormWrapper>
  );
};

// Story objects using the proper React components
export const Default: Story = {
  args: {
    name: "checkbox",
    description: "Accept terms and conditions",
    control: mockControl,
  } as FormCheckboxProps,
  parameters: {
    docs: {
      source: {
        code: `
// Default FormCheckbox with validation and submission display
const FormCheckboxExample = () => {
  const [submittedValue, setSubmittedValue] = React.useState(null);
  
  const formSchema = z.object({
    checkbox: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkbox: false,
    },
  });

  const onSubmit = (data) => {
    setSubmittedValue(data.checkbox);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormCheckbox
          name="checkbox"
          control={form.control}
          description="Accept terms and conditions"
        />
        <Button type="submit">Submit</Button>
        
        {submittedValue !== null && (
          <div className="p-2 bg-gray-100 rounded-md">
            <p>Submitted Value: {submittedValue ? "Accepted" : "Not Accepted"}</p>
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

export const WithValidation: Story = {
  args: {
    name: "checkbox",
    description: "I accept the terms and conditions",
    control: mockControl,
  } as FormCheckboxProps,
  parameters: {
    docs: {
      source: {
        code: `
// FormCheckbox with validation
const FormCheckboxValidation = () => {
  const formSchema = z.object({
    checkbox: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkbox: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormCheckbox
          name="checkbox"
          control={form.control}
          description="I accept the terms and conditions"
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

export const WithLabel: Story = {
  args: {
    name: "checkbox",
    label: "Terms and Conditions",
    description: "I accept the terms and conditions",
    control: mockControl,
  } as FormCheckboxProps,
  parameters: {
    docs: {
      source: {
        code: `
// FormCheckbox with a label
const FormCheckboxWithLabel = () => {
  const form = useForm();
  
  return (
    <Form {...form}>
      <FormCheckbox
        name="checkbox"
        label="Terms and Conditions"
        control={form.control}
        description="I accept the terms and conditions"
      />
    </Form>
  );
};`,
      },
    },
  },
  render: () => <WithLabelStory />,
};

export const Disabled: Story = {
  args: {
    name: "checkbox",
    description: "This checkbox is disabled",
    disabled: true,
    control: mockControl,
  } as FormCheckboxProps,
  parameters: {
    docs: {
      source: {
        code: `
// Disabled FormCheckbox
const DisabledFormCheckbox = () => {
  const form = useForm();
  
  return (
    <Form {...form}>
      <FormCheckbox
        name="checkbox"
        control={form.control}
        description="This checkbox is disabled"
        disabled
      />
    </Form>
  );
};`,
      },
    },
  },
  render: () => <DisabledStory />,
};

export const CustomContainer: Story = {
  args: {
    name: "checkbox",
    description: "Custom container with styling",
    containerProps: {
      className: "flex items-center gap-2 p-2 rounded bg-slate-100",
    },
    control: mockControl,
  } as FormCheckboxProps,
  parameters: {
    docs: {
      source: {
        code: `
// FormCheckbox with custom container styling
const CustomContainerFormCheckbox = () => {
  const form = useForm();
  
  return (
    <Form {...form}>
      <FormCheckbox
        containerProps={{
          className: "flex items-center gap-2 p-2 rounded bg-slate-100",
        }}
        name="checkbox"
        control={form.control}
        description="Custom container with styling"
      />
    </Form>
  );
};`,
      },
    },
  },
  render: () => <CustomContainerStory />,
};
