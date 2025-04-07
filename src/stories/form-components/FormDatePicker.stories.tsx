import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldValues } from "react-hook-form";
import { useState } from "react";

import { FormDatePicker } from "../../../registry/block/form/form-datepicker";
import { Form } from "@/components/ui/form";
import { commonIcon } from "../../../registry/lib/common-icon";
import { MyButton } from "../../../registry/block/base-component/my-button";

// Mock control object for story args
const mockControl = {} as Control<FieldValues>;

type FormDatePickerProps = React.ComponentProps<typeof FormDatePicker>;

// Individual story components with proper React function components
const DefaultStory = () => {
  const [submittedValues, setSubmittedValues] = useState<{
    date: Date;
  } | null>(null);

  const form = useForm({
    defaultValues: {
      date: new Date(),
    },
  });

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            console.log(data);
            setSubmittedValues(data as { date: Date });
          })}
          className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
        >
          <FormDatePicker
            name="date"
            label="Date"
            control={form.control}
            placeholder="Select date"
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

      {submittedValues && (
        <div className="w-[350px] p-4 border rounded-md bg-white">
          <h3 className="font-semibold mb-2">Submitted Values:</h3>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Date:</span>{" "}
              {submittedValues.date?.toISOString()} (Date object)
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Note: The form returns an actual JavaScript Date object, not a
              string.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const ValidationStory = () => {
  const formSchema = z.object({
    date: z
      .date({
        required_error: "Date is required",
        invalid_type_error: "Date must be a valid date",
      })
      .refine(
        (date) => {
          // Example validation: Date must be today or in the future
          return date >= new Date(new Date().setHours(0, 0, 0, 0));
        },
        {
          message: "Date must be today or in the future",
        }
      ),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data) => console.log(data),
          (errors) => console.error(errors)
        )}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormDatePicker
          name="date"
          label="Date (Must be today or future)"
          control={form.control}
          placeholder="Select date"
          disabled={(date) => {
            // Disable dates before today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
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

const TimestampStory = () => {
  const [submittedValues, setSubmittedValues] = useState<{
    date: number;
  } | null>(null);

  // Schema using z.coerce.number() to convert dates to timestamps
  const formSchema = z.object({
    date: z.coerce.number(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: Date.now(),
    },
  });

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            console.log(data);
            setSubmittedValues(data as { date: number });
          })}
          className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
        >
          <FormDatePicker
            name="date"
            label="Date (as Timestamp)"
            control={form.control}
            placeholder="Select date"
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

      {submittedValues && (
        <div className="w-[350px] p-4 border rounded-md bg-white">
          <h3 className="font-semibold mb-2">Submitted Values (Timestamp):</h3>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Date:</span> {submittedValues.date}{" "}
              (number)
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Note: Using z.coerce.number() converts Date objects to Unix
              timestamps (milliseconds).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Story objects using the proper React components
export const Default: StoryObj<Meta<typeof FormDatePicker>> = {
  args: {
    name: "date",
    label: "Date",
    placeholder: "Select date",
    control: mockControl,
  } as FormDatePickerProps,
  render: () => <DefaultStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { FormDatePicker } from "@/components/form/form-datepicker";
import { Form } from "@/components/ui/form";

// Create form with React Hook Form
const form = useForm({
  defaultValues: {
    date: new Date(),
  },
});

// Use FormDatePicker in your form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormDatePicker
      name="date"
      label="Date"
      control={form.control}
      placeholder="Select date"
    />
    <button type="submit">Submit</button>
  </form>
</Form>
`,
      },
    },
  },
};

export const WithValidation: StoryObj<Meta<typeof FormDatePicker>> = {
  args: {
    name: "date",
    label: "Date (Must be today or future)",
    placeholder: "Select date",
    control: mockControl,
  } as FormDatePickerProps,
  render: () => <ValidationStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormDatePicker } from "@/components/form/form-datepicker";
import { Form } from "@/components/ui/form";

// Define validation schema with Zod
const formSchema = z.object({
  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "Date must be a valid date",
  }).refine(
    (date) => {
      // Example validation: Date must be today or in the future
      return date >= new Date(new Date().setHours(0, 0, 0, 0));
    },
    {
      message: "Date must be today or in the future",
    }
  ),
});

// Create form with React Hook Form
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    date: new Date(),
  },
});

// Use FormDatePicker in your form with disabled dates
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormDatePicker
      name="date"
      label="Date (Must be today or future)"
      control={form.control}
      placeholder="Select date"
      disabled={(date) => {
        // Disable dates before today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
      }}
    />
    <button type="submit">Submit</button>
  </form>
</Form>
`,
      },
    },
  },
};

export const WithTimestampOutput: StoryObj<Meta<typeof FormDatePicker>> = {
  args: {
    name: "date",
    label: "Date (as Timestamp)",
    placeholder: "Select date",
    control: mockControl,
  } as FormDatePickerProps,
  render: () => <TimestampStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormDatePicker } from "@/components/form/form-datepicker";
import { Form } from "@/components/ui/form";

// Schema using z.coerce.number() to convert dates to timestamps
const formSchema = z.object({
  date: z.coerce.number(),
});

// Create form with React Hook Form
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    date: Date.now(),
  },
});

// Use FormDatePicker in your form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormDatePicker
      name="date"
      label="Date (as Timestamp)"
      control={form.control}
      placeholder="Select date"
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
 * `FormDatePicker` is a form component that integrates a date picker with React Hook Form.
 *
 * ## Features
 * - Fully integrated with React Hook Form
 * - Displays validation errors
 * - Supports custom date formats
 * - Customizable placeholder
 *
 * ## Installation
 * ```bash
 * npx shadcn@latest add https://story-book-comp-tw-v4.vercel.app/registry/form-datepicker.json
 * ```
 *
 * ## Date Format Note
 * The component returns a JavaScript Date object by default, not a string. When you access the form values
 * after submission, you'll get a Date object that you can format as needed:
 *
 * ```tsx
 * // Result of form submission:
 * {
 *   date: Date, // JavaScript Date object
 * }
 * ```
 *
 * ## Converting to Timestamp
 * If you need a timestamp instead of a Date object, you can use `z.coerce.number()` in your Zod schema:
 *
 * ```tsx
 * const formSchema = z.object({
 *   date: z.coerce.number(), // Will convert Date to Unix timestamp (milliseconds)
 * });
 * ```
 *
 * This will result in a numeric timestamp in your submitted data:
 *
 * ```tsx
 * // Result with z.coerce.number():
 * {
 *   date: 1634567890000, // Unix timestamp in milliseconds
 * }
 * ```
 *
 * ## Usage with React Hook Form
 * ```tsx
 * import { useForm } from 'react-hook-form';
 * import { z } from 'zod';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { FormDatePicker } from '@/components/form/form-datepicker';
 * import { Form } from '@/components/ui/form';
 *
 * // Define your form schema with Zod
 * const formSchema = z.object({
 *   date: z.date(),
 * });
 *
 * // Create your form with React Hook Form
 * const form = useForm({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *     date: new Date(),
 *   },
 * });
 *
 * // Use the FormDatePicker component in your form
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormDatePicker
 *       name="date"
 *       control={form.control}
 *       label="Date"
 *       placeholder="Select a date"
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * </Form>
 * ```
 */
const meta: Meta<typeof FormDatePicker> = {
  title: "Form Components/FormDatePicker",
  component: FormDatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
