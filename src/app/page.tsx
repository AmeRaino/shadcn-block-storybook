"use client";
import { MyButton } from "@/components/base-component/my-button";
import { MyIconfy } from "@/components/base-component/my-icon";
import {
  FormCheckbox,
  FormCombobox,
  FormDateRangePicker,
  FormInput,
  FormMultiCombobox,
  FormSelect,
  FormSwitch,
  FormTextArea,
} from "@/components/form";
import { FormSlider } from "@/components/form/form-slider";

import { MyComboboxTriggerLabel } from "@/components/base-component/my-combobox";
import { MyMultiComboboxTriggerLabel } from "@/components/base-component/my-multi-combobox";
import { Form } from "@/components/ui/form";
import { commonIcon } from "@/shared/common-icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

const configGradeFormSchema = z.object({
  input: z.string().min(1),
  checkbox: z.boolean().refine((data) => data, {
    message: "You must confirm to continue",
  }),
  switch: z.boolean().refine((data) => data, {
    message: "You must confirm to continue",
  }),
  select: z.string().min(1),
  combobox: z.string().min(1),
  multiCombobox: z.set(z.string()),
  textarea: z.string().min(1),
  fromDate: z.date(),
  toDate: z.date(),
  slider: z.coerce.number().min(1),
});

type TForm = z.infer<typeof configGradeFormSchema>;
type TApi = { multiCombobox: string } & Omit<
  z.infer<typeof configGradeFormSchema>,
  "multiCombobox"
>;

export default function Home() {
  const form = useForm<TForm>({
    resolver: zodResolver(configGradeFormSchema),
  });

  function onSubmit(payload: TForm) {
    const apiPayload: TApi = {
      ...payload,
      multiCombobox: Array.from(payload.multiCombobox).join(","),
    };

    console.log("zz ~ onSubmit ~ apiPayload:", apiPayload);
  }

  return (
    <main className="p-24 flex items-center justify-center h-screen w-screen flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <FormInput
              label="Input"
              control={form.control}
              name="input"
              placeholder="Enter input"
            />

            <FormMultiCombobox
              truncate={2}
              label="Multi Combobox"
              name="multiCombobox"
              control={form.control}
              placeholder="Select multi combobox"
              select={{ label: "label", value: "value" }}
              fieldFilter={["code", "label"]}
              options={[
                {
                  code: "DEV",
                  label: "Developer - Developer - Developer - Developer",
                  value: 1,
                },
                {
                  code: "DES",
                  label: "Designer",
                  value: 2,
                },
                {
                  code: "QA",
                  label: "QA",
                  value: 3,
                },
              ]}
              renderLabel={(option) => (
                <div className="flex items-center gap-2">
                  <MyIconfy icon="lucide:sparkles" size="sm" />
                  <MyMultiComboboxTriggerLabel>
                    <span>{option.code}</span> - <span>{option.label}</span>
                  </MyMultiComboboxTriggerLabel>
                </div>
              )}
            />

            <FormDateRangePicker
              label="Date"
              control={form.control}
              names={["fromDate", "toDate"]}
              placeholder="Select date"
            />

            <FormSelect
              label="Select"
              placeholder="Select"
              control={form.control}
              name="select"
              select={{ label: "label", value: "value" }}
              options={[
                {
                  label: "Male",
                  value: 1,
                },
                {
                  label: "Female",
                  value: 2,
                },
              ]}
            />

            <FormCombobox
              label="Combobox"
              placeholder="Select"
              control={form.control}
              name="combobox"
              select={{ label: "label", value: "value" }}
              fieldFilter={["code", "label"]}
              options={[
                {
                  code: "DEV",
                  label: "Developer - Developer - Developer - Developer",
                  value: 1,
                },
                {
                  code: "DES",
                  label: "Designer",
                  value: 2,
                },
                {
                  code: "QA",
                  label: "QA",
                  value: 3,
                },
              ]}
              renderLabel={(option) => (
                <div className="flex items-center gap-2">
                  <MyIconfy icon="lucide:sparkles" size="sm" />
                  <MyComboboxTriggerLabel title={option.label}>
                    <span>{option.code}</span> - <span>{option.label}</span>
                  </MyComboboxTriggerLabel>
                </div>
              )}
            />

            <FormTextArea
              label="Textarea"
              control={form.control}
              name="textarea"
              placeholder="Enter description"
            />

            <FormSlider label="Slider" control={form.control} name="slider" />

            <FormCheckbox
              containerProps={{ className: "inline-flex items-center gap-2" }}
              control={form.control}
              name="checkbox"
              description={<span>confirm checkbox to continue</span>}
            />

            <FormSwitch
              containerProps={{ className: "inline-flex items-center gap-2" }}
              control={form.control}
              name="switch"
              description={<span>activate switch to continue</span>}
            />
          </div>

          <MyButton
            type="submit"
            icon={commonIcon.checkCircle}
            iconPlacement="right"
          >
            submit
          </MyButton>
        </form>

        <FormState />
      </Form>
    </main>
  );
}

const FormState = () => {
  const form = useFormContext();

  const payload = useWatch({
    control: form.control,
  });

  return (
    <pre className="bg-neutral-200 p-4 rounded-md">
      {JSON.stringify(payload, null, 2)}
    </pre>
  );
};
