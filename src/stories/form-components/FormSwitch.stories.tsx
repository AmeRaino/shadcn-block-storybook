import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldValues } from "react-hook-form";
import { useState } from "react";

import { FormSwitch } from "../../../registry/block/form/form-switch";
import { Form } from "@/components/ui/form";
import { commonIcon } from "../../../registry/shared/common-icon";
import { MyButton } from "../../../registry/block/base-component/my-button";

// Mock control object for story args
const mockControl = {} as Control<FieldValues>;

type FormSwitchProps = React.ComponentProps<typeof FormSwitch>;

// Wrapper component for the form to provide the React Hook Form context
const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const formSchema = z.object({
    switch: z.boolean().default(false),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      switch: false,
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
  const [submittedValue, setSubmittedValue] = useState<boolean | null>(null);

  const formSchema = z.object({
    switch: z.boolean(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      switch: false,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
          setSubmittedValue(data.switch);
        })}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormSwitch
          name="switch"
          label="Notifications"
          control={form.control}
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
            <p className="text-sm">{submittedValue ? "Enabled" : "Disabled"}</p>
          </div>
        )}
      </form>
    </Form>
  );
};

const WithDescriptionStory = () => {
  const [submittedValue, setSubmittedValue] = useState<boolean | null>(null);

  const formSchema = z.object({
    switch: z.boolean(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      switch: false,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
          setSubmittedValue(data.switch);
        })}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormSwitch
          name="switch"
          label="Marketing emails"
          description="Receive emails about new products."
          control={form.control}
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
            <p className="text-sm">{submittedValue ? "Enabled" : "Disabled"}</p>
          </div>
        )}
      </form>
    </Form>
  );
};

const DisabledStory = () => {
  const [submittedValue, setSubmittedValue] = useState<boolean | null>(null);

  const form = useForm({
    defaultValues: {
      switch: true,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
          setSubmittedValue(data.switch);
        })}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormSwitch
          name="switch"
          label="Disabled switch"
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
            <p className="text-sm">{submittedValue ? "Enabled" : "Disabled"}</p>
          </div>
        )}
      </form>
    </Form>
  );
};

const CustomContainerStory = () => {
  const form = useForm({
    defaultValues: {
      switch: false,
    },
  });

  return (
    <FormWrapper>
      <FormSwitch
        name="switch"
        control={form.control}
        description="Custom container with styling"
        containerProps={{
          className:
            "flex items-center justify-between p-2 rounded bg-slate-100",
        }}
      />
    </FormWrapper>
  );
};

// Story objects using the proper React components
export const Default: StoryObj<Meta<typeof FormSwitch>> = {
  args: {
    name: "switch",
    label: "Notifications",
    control: mockControl,
  } as FormSwitchProps,
  render: () => <DefaultStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormSwitch } from "@/components/form/form-switch";
import { Form } from "@/components/ui/form";

// Define form schema
const formSchema = z.object({
  switch: z.boolean(),
});

// Create form with React Hook Form
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    switch: false,
  },
});

// Use FormSwitch in your form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormSwitch 
      name="switch" 
      label="Notifications" 
      control={form.control} 
    />
    <button type="submit">Submit</button>
  </form>
</Form>
`,
      },
    },
  },
};

export const WithDescription: StoryObj<Meta<typeof FormSwitch>> = {
  args: {
    name: "switch",
    label: "Marketing emails",
    description: "Receive emails about new products, features, and more.",
    control: mockControl,
  } as FormSwitchProps,
  render: () => <WithDescriptionStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormSwitch } from "@/components/form/form-switch";
import { Form } from "@/components/ui/form";

// Define form schema
const formSchema = z.object({
  switch: z.boolean(),
});

// Create form with React Hook Form
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    switch: false,
  },
});

// Use FormSwitch in your form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormSwitch 
      name="switch" 
      label="Marketing emails" 
      description="Receive emails about new products, features, and more."
      control={form.control} 
    />
    <button type="submit">Submit</button>
  </form>
</Form>
`,
      },
    },
  },
};

export const Disabled: StoryObj<Meta<typeof FormSwitch>> = {
  args: {
    name: "switch",
    label: "Disabled switch",
    disabled: true,
    control: mockControl,
  } as FormSwitchProps,
  render: () => <DisabledStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { FormSwitch } from "@/components/form/form-switch";
import { Form } from "@/components/ui/form";

// Create form with React Hook Form
const form = useForm({
  defaultValues: {
    switch: true,
  },
});

// Use FormSwitch in your form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormSwitch 
      name="switch" 
      label="Disabled switch" 
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

export const CustomContainer: StoryObj<Meta<typeof FormSwitch>> = {
  args: {
    name: "switch",
    description: "Custom container with styling",
    containerProps: {
      className: "flex items-center justify-between p-2 rounded bg-slate-100",
    },
    control: mockControl,
  } as FormSwitchProps,
  render: () => <CustomContainerStory />,
};

/**
 * `FormSwitch` is a form component that integrates a toggle switch with React Hook Form.
 *
 * ## Features
 * - Fully integrated with React Hook Form
 * - Displays validation errors
 * - Supports custom descriptions and labels
 * - Customizable container styling
 *
 * ## Installation
 * ```bash
 * npx shadcn@latest add form-switch
 * ```
 *
 * ## Usage with React Hook Form
 * ```tsx
 * import { useForm } from 'react-hook-form';
 * import { z } from 'zod';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { FormSwitch } from '@/components/form/form-switch';
 * import { Form } from '@/components/ui/form';
 *
 * // Define your form schema with Zod
 * const formSchema = z.object({
 *   enableNotifications: z.boolean().default(false),
 * });
 *
 * // Create your form with React Hook Form
 * const form = useForm({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *     enableNotifications: false,
 *   },
 * });
 *
 * // Use the FormSwitch component in your form
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormSwitch
 *       name="enableNotifications"
 *       control={form.control}
 *       label="Notifications"
 *       description="Enable push notifications"
 *     />
 *     <button type="submit">Save Settings</button>
 *   </form>
 * </Form>
 * ```
 */
const meta: Meta<typeof FormSwitch> = {
  title: "Form Components/FormSwitch",
  component: FormSwitch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
