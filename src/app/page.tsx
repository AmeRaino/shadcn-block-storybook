"use client";
import { MyButton } from "@/components/base-component/my-button";
import { MyIconfy } from "@/components/base-component/my-icon";
import {
  FormCheckbox,
  FormCombobox,
  FormInput,
  FormSelect,
  FormSwitch,
  FormTextArea,
} from "@/components/form";

import { Form } from "@/components/ui/form";
import { commonIcon } from "@/shared/common-icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
type TForm = {
  name: string;
  gender: string;
  job: string;
  isConfirm: boolean;
  trial: boolean;
  description: string;
};

const configGradeFormSchema = z.object({
  name: z.string().min(1),
  isConfirm: z.boolean().refine((data) => data, {
    message: "You must confirm to continue",
  }),
  trial: z.boolean().refine((data) => data, {
    message: "You must confirm to continue",
  }),
  gender: z.string().min(1),
  job: z.string().min(1),
  description: z.string().min(1),
});

export default function Home() {
  const form = useForm<TForm>({
    resolver: zodResolver(configGradeFormSchema),
  });

  function onSubmit(payload: TForm) {
    console.log("zz ~ onSubmit ~ payload:", payload);
  }

  return (
    <main className="p-24 flex items-center justify-center h-screen w-screen flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <FormInput
              label="Name"
              control={form.control}
              name="name"
              placeholder="Enter name"
            />

            <FormSelect
              label="Select gender"
              placeholder="Select gender"
              control={form.control}
              name="gender"
              select={{ label: "label", value: "value" }}
              options={[
                {
                  label: "Male",
                  value: "male",
                },
                {
                  label: "Female",
                  value: "female",
                },
              ]}
            />

            <FormCombobox
              label="Select job"
              placeholder="Select job"
              control={form.control}
              name="job"
              select={{ label: "label", value: "value" }}
              fieldFilter={["code", "label"]}
              options={[
                {
                  code: "DEV",
                  label: "Developer",
                  value: "developer",
                },
                {
                  code: "DES",
                  label: "Designer",
                  value: "designer",
                },
                {
                  code: "QA",
                  label: "QA",
                  value: "qa",
                },
              ]}
              renderLabel={(option) => (
                <div className="flex items-center gap-2">
                  <MyIconfy icon="lucide:sparkles" size="sm" />
                  <span>{option.code}</span> - <span>{option.label}</span>
                </div>
              )}
            />

            <FormTextArea
              label="Description"
              control={form.control}
              name="description"
              placeholder="Enter description"
            />

            <FormCheckbox
              containerProps={{ className: "inline-flex items-center gap-2" }}
              control={form.control}
              name="isConfirm"
              description={<span>confirm to continue</span>}
            />

            <FormSwitch
              containerProps={{ className: "inline-flex items-center gap-2" }}
              control={form.control}
              name="trial"
              description={<span>activate trial</span>}
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
