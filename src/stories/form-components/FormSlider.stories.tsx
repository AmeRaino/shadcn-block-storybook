import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldValues } from "react-hook-form";
import { useState } from "react";

import { FormSlider } from "../../../registry/block/form/form-slider";
import { Form } from "@/components/ui/form";
import { commonIcon } from "../../../registry/shared/common-icon";
import { MyButton } from "../../../registry/block/base-component/my-button";

// Mock control object for story args
const mockControl = {} as Control<FieldValues>;

type FormSliderProps = React.ComponentProps<typeof FormSlider>;

// Individual story components with proper React function components
const DefaultStory = () => {
  const [submittedValue, setSubmittedValue] = useState<number | null>(null);

  const formSchema = z.object({
    slider: z.number().min(0).max(100),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slider: 50,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
          setSubmittedValue(data.slider);
        })}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormSlider
          name="slider"
          label="Volume"
          control={form.control}
          min={0}
          max={100}
          step={1}
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
            <p className="text-sm">{submittedValue}</p>
          </div>
        )}
      </form>
    </Form>
  );
};

const ValidationStory = () => {
  const [submittedValue, setSubmittedValue] = useState<number | null>(null);

  const formSchema = z.object({
    slider: z
      .number()
      .min(20, "Value must be at least 20")
      .max(80, "Value must be at most 80"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slider: 50,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
          setSubmittedValue(data.slider);
        })}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormSlider
          name="slider"
          label="Range (20-80)"
          control={form.control}
          min={0}
          max={100}
          step={1}
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
            <p className="text-sm">{submittedValue}</p>
          </div>
        )}
      </form>
    </Form>
  );
};

const WithStepsStory = () => {
  const [submittedValue, setSubmittedValue] = useState<number | null>(null);

  const formSchema = z.object({
    slider: z.number().min(0).max(200),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slider: 25,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
          setSubmittedValue(data.slider);
        })}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        <FormSlider
          name="slider"
          label="Budget (Step: $25)"
          control={form.control}
          min={0}
          max={200}
          step={25}
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
            <p className="text-sm">${submittedValue}</p>
          </div>
        )}
      </form>
    </Form>
  );
};

// Story objects using the proper React components
export const Default: StoryObj<Meta<typeof FormSlider>> = {
  args: {
    name: "slider",
    label: "Volume",
    min: 0,
    max: 100,
    step: 1,
    control: mockControl,
  } as FormSliderProps,
  render: () => <DefaultStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormSlider } from "@/components/form/form-slider";
import { Form } from "@/components/ui/form";

// Define form schema with validation
const formSchema = z.object({
  slider: z.number().min(0).max(100),
});

// Create form with React Hook Form
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    slider: 50,
  },
});

// Use FormSlider in your form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormSlider
      name="slider"
      label="Volume"
      control={form.control}
      min={0}
      max={100}
      step={1}
    />
    <button type="submit">Submit</button>
  </form>
</Form>
`,
      },
    },
  },
};

export const WithValidation: StoryObj<Meta<typeof FormSlider>> = {
  args: {
    name: "slider",
    label: "Range (20-80)",
    min: 0,
    max: 100,
    step: 1,
    control: mockControl,
  } as FormSliderProps,
  render: () => <ValidationStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormSlider } from "@/components/form/form-slider";
import { Form } from "@/components/ui/form";

// Define form schema with validation
const formSchema = z.object({
  slider: z
    .number()
    .min(20, "Value must be at least 20")
    .max(80, "Value must be at most 80"),
});

// Create form with React Hook Form
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    slider: 50,
  },
});

// Use FormSlider in your form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormSlider
      name="slider"
      label="Range (20-80)"
      control={form.control}
      min={0}
      max={100}
      step={1}
    />
    <button type="submit">Submit</button>
  </form>
</Form>
`,
      },
    },
  },
};

export const WithSteps: StoryObj<Meta<typeof FormSlider>> = {
  args: {
    name: "slider",
    label: "Budget (Step: $25)",
    min: 0,
    max: 200,
    step: 25,
    control: mockControl,
  } as FormSliderProps,
  render: () => <WithStepsStory />,
  parameters: {
    docs: {
      source: {
        code: `
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormSlider } from "@/components/form/form-slider";
import { Form } from "@/components/ui/form";

// Define form schema with validation
const formSchema = z.object({
  slider: z.number().min(0).max(200),
});

// Create form with React Hook Form
const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    slider: 25,
  },
});

// Use FormSlider in your form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormSlider
      name="slider"
      label="Budget (Step: $25)"
      control={form.control}
      min={0}
      max={200}
      step={25}
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
 * `FormSlider` is a form component that integrates a slider input with React Hook Form.
 *
 * ## Features
 * - Fully integrated with React Hook Form
 * - Displays validation errors
 * - Supports custom min, max, and step values
 * - Optional marks display
 * - Customizable value display
 *
 * ## Installation
 * ```bash
 * npx shadcn@latest add https://story-book-comp-tw-v4.vercel.app/registry/form-slider.json
 * ```
 *
 * ## Usage with React Hook Form
 * ```tsx
 * import { useForm } from 'react-hook-form';
 * import { z } from 'zod';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { FormSlider } from '@/components/form/form-slider';
 * import { Form } from '@/components/ui/form';
 *
 * // Define your form schema with Zod
 * const formSchema = z.object({
 *   budget: z.number().min(10, 'Budget must be at least $10').max(100),
 * });
 *
 * // Create your form with React Hook Form
 * const form = useForm({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *     budget: 50,
 *   },
 * });
 *
 * // Use the FormSlider component in your form
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormSlider
 *       name="budget"
 *       control={form.control}
 *       label="Budget"
 *       min={0}
 *       max={100}
 *       step={5}
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * </Form>
 * ```
 */
const meta: Meta<typeof FormSlider> = {
  title: "Form Components/FormSlider",
  component: FormSlider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
