import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldValues } from "react-hook-form";
import { useState } from "react";

import { FormDateRangePicker } from "../../../registry/block/form/form-date-range-picker";
import { Form } from "@/components/ui/form";
import { commonIcon } from "../../../registry/shared/common-icon";
import { MyButton } from "../../../registry/block/base-component/my-button";

// Mock control object for story args
const mockControl = {} as Control<FieldValues>;

type FormDateRangePickerProps = React.ComponentProps<
  typeof FormDateRangePicker
>;

// Individual story components with proper React function components
const DefaultStory = () => {
  const [submittedValues, setSubmittedValues] = useState<{
    fromDate: Date;
    toDate: Date;
  } | null>(null);

  const form = useForm({
    defaultValues: {
      fromDate: new Date(),
      toDate: new Date(),
    },
  });

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            console.log(data);
            setSubmittedValues(data as { fromDate: Date; toDate: Date });
          })}
          className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
        >
          <FormDateRangePicker
            names={["fromDate", "toDate"]}
            label="Date Range"
            control={form.control}
            placeholder="Select date range"
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
              <span className="font-medium">From Date:</span>{" "}
              {submittedValues.fromDate?.toISOString()} (Date object)
            </p>
            <p>
              <span className="font-medium">To Date:</span>{" "}
              {submittedValues.toDate?.toISOString()} (Date object)
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Note: The form returns actual JavaScript Date objects, not
              strings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const ValidationStory = () => {
  const form = useForm({
    defaultValues: {
      fromDate: new Date(),
      toDate: new Date(),
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
        <FormDateRangePicker
          names={["fromDate", "toDate"]}
          label="Date Range (End date must be after start date)"
          control={form.control}
          placeholder="Select date range"
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
    fromDate: number;
    toDate: number;
  } | null>(null);

  // Schema using z.coerce.number() to convert dates to timestamps
  const formSchema = z.object({
    fromDate: z.coerce.number(),
    toDate: z.coerce.number(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromDate: Date.now(),
      toDate: Date.now(),
    },
  });

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            console.log(data);
            setSubmittedValues(data as { fromDate: number; toDate: number });
          })}
          className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
        >
          <FormDateRangePicker
            names={["fromDate", "toDate"]}
            label="Date Range (as Timestamps)"
            control={form.control}
            placeholder="Select date range"
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
          <h3 className="font-semibold mb-2">Submitted Values (Timestamps):</h3>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">From Date:</span>{" "}
              {submittedValues.fromDate} (number)
            </p>
            <p>
              <span className="font-medium">To Date:</span>{" "}
              {submittedValues.toDate} (number)
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
export const Default: StoryObj<Meta<typeof FormDateRangePicker>> = {
  args: {
    names: ["fromDate", "toDate"],
    label: "Date Range",
    placeholder: "Select date range",
    control: mockControl,
  } as FormDateRangePickerProps,
  render: () => <DefaultStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { FormDateRangePicker } from "@/components/form/form-date-range-picker";
import { Form } from "@/components/ui/form";

// Create form with React Hook Form
const form = useForm({
  defaultValues: {
    fromDate: new Date(),
    toDate: new Date(),
  },
});

// Use FormDateRangePicker in your form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormDateRangePicker
      names={["fromDate", "toDate"]}
      label="Date Range"
      control={form.control}
      placeholder="Select date range"
    />
    <button type="submit">Submit</button>
  </form>
</Form>
`,
      },
    },
  },
};

export const WithValidation: StoryObj<Meta<typeof FormDateRangePicker>> = {
  args: {
    names: ["fromDate", "toDate"],
    label: "Date Range (End date must be after start date)",
    placeholder: "Select date range",
    control: mockControl,
  } as FormDateRangePickerProps,
  render: () => <ValidationStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormDateRangePicker } from "@/components/form/form-date-range-picker";
import { Form } from "@/components/ui/form";

// Define validation schema with Zod
const formSchema = z.object({
  fromDate: z.date(),
  toDate: z.date().refine(
    (date: Date) => {
      const fromDate = form.getValues("fromDate");
      return date > fromDate;
    },
    { message: "End date must be after start date" }
  ),
});

// Create form with React Hook Form
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    fromDate: new Date(),
    toDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  },
});

// Use FormDateRangePicker in your form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormDateRangePicker
      names={["fromDate", "toDate"]}
      label="Date Range (End date must be after start date)"
      control={form.control}
      placeholder="Select date range"
    />
    <button type="submit">Submit</button>
  </form>
</Form>
`,
      },
    },
  },
};

export const WithTimestampOutput: StoryObj<Meta<typeof FormDateRangePicker>> = {
  args: {
    names: ["fromDate", "toDate"],
    label: "Date Range (as Timestamps)",
    placeholder: "Select date range",
    control: mockControl,
  } as FormDateRangePickerProps,
  render: () => <TimestampStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormDateRangePicker } from "@/components/form/form-date-range-picker";
import { Form } from "@/components/ui/form";

// Schema using z.coerce.number() to convert dates to timestamps
const formSchema = z.object({
  fromDate: z.coerce.number(),
  toDate: z.coerce.number(),
});

// Create form with React Hook Form
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    fromDate: Date.now(),
    toDate: Date.now(),
  },
});

// Use FormDateRangePicker in your form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormDateRangePicker
      names={["fromDate", "toDate"]}
      label="Date Range (as Timestamps)"
      control={form.control}
      placeholder="Select date range"
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
 * `FormDateRangePicker` is a form component that integrates a date range picker with React Hook Form.
 *
 * ## Features
 * - Fully integrated with React Hook Form
 * - Displays validation errors
 * - Supports custom date formats
 * - Customizable placeholder
 *
 * ## Installation
 * ```bash
 * npx shadcn@latest add https://story-book-comp-tw-v4.vercel.app/registry/form-date-range-picker.json
 * ```
 *
 * ## Date Format Note
 * The component returns JavaScript Date objects by default, not strings. When you access the form values
 * after submission, you'll get Date objects that you can format as needed:
 *
 * ```tsx
 * // Result of form submission:
 * {
 *   fromDate: Date, // JavaScript Date object
 *   toDate: Date    // JavaScript Date object
 * }
 * ```
 *
 * ## Converting to Timestamps
 * If you need timestamps instead of Date objects, you can use `z.coerce.number()` in your Zod schema:
 *
 * ```tsx
 * const formSchema = z.object({
 *   fromDate: z.coerce.number(), // Will convert Date to Unix timestamp (milliseconds)
 *   toDate: z.coerce.number(),   // Will convert Date to Unix timestamp (milliseconds)
 * });
 * ```
 *
 * This will result in numeric timestamps in your submitted data:
 *
 * ```tsx
 * // Result with z.coerce.number():
 * {
 *   fromDate: 1634567890000, // Unix timestamp in milliseconds
 *   toDate: 1634654290000    // Unix timestamp in milliseconds
 * }
 * ```
 *
 * ## Usage with React Hook Form
 * ```tsx
 * import { useForm } from 'react-hook-form';
 * import { z } from 'zod';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { FormDateRangePicker } from '@/components/form/form-date-range-picker';
 * import { Form } from '@/components/ui/form';
 *
 * // Define your form schema with Zod
 * const formSchema = z.object({
 *   fromDate: z.date(),
 *   toDate: z.date(),
 * });
 *
 * // Create your form with React Hook Form
 * const form = useForm({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *     fromDate: new Date(),
 *     toDate: new Date(),
 *   },
 * });
 *
 * // Use the FormDateRangePicker component in your form
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormDateRangePicker
 *       names={["fromDate", "toDate"]}
 *       control={form.control}
 *       label="Date Range"
 *       placeholder="Select a date range"
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * </Form>
 * ```
 */
const meta: Meta<typeof FormDateRangePicker> = {
  title: "Form Components/FormDateRangePicker",
  component: FormDateRangePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
