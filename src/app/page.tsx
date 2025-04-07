"use client";
import { MyButton } from "../../registry/block/base-component/my-button";
import { MyComboboxTriggerLabel } from "../../registry/block/base-component/my-combobox";
import { MyIconfy } from "../../registry/block/base-component/my-icon";
import {
  FormCheckbox,
  FormDateRangePicker,
  FormInput,
  FormSelect,
  FormSwitch,
  FormTextArea,
  FormVirtualComboboxAsync,
} from "../../registry/block/form";
import { FormCombobox } from "../../registry/block/form/form-combobox";
import { FormSlider } from "../../registry/block/form/form-slider";

import { Form } from "@/components/ui/form";
import { useCatalogueProduct } from "@/hooks/catalogue/useCatalogueProduct";
import { commonIcon } from "../../registry/shared/common-icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  input: z.string().min(1),
  checkbox: z.boolean().refine((data) => data, {
    message: "You must confirm to continue",
  }),
  switch: z.boolean().refine((data) => data, {
    message: "You must confirm to continue",
  }),
  select: z.string().min(1),
  combobox: z.number().min(1),
  multiCombobox: z.set(z.number()),
  virtualCombobox: z.number().min(1),
  virtualComboboxMulti: z.set(z.number()),
  textarea: z.string().min(1),
  fromDate: z.date(),
  toDate: z.date(),
  slider: z.coerce.number().min(1),
});

type TForm = z.infer<typeof formSchema>;
type TApi = { multiCombobox: string } & Omit<
  z.infer<typeof formSchema>,
  "multiCombobox" | "virtualComboboxMulti"
>;

export default function Home() {
  const catalogueProduct = useCatalogueProduct();
  const catalogueProductMulti = useCatalogueProduct();

  const form = useForm<TForm>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(payload: TForm) {
    const apiPayload: TApi = {
      ...payload,
      multiCombobox: Array.from(payload.multiCombobox).join(","),
    };

    console.log("zz ~ onSubmit ~ apiPayload:", apiPayload);
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Form Components Showcase</h1>
        <Form {...form}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid gap-4">
                  <FormInput
                    label="Input"
                    control={form.control}
                    name="input"
                    placeholder="Enter input"
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
                          <span>{option.code}</span> -{" "}
                          <span>{option.label}</span>
                        </MyComboboxTriggerLabel>
                      </div>
                    )}
                  />

                  <FormCombobox
                    truncate={2}
                    label="Multi Combobox"
                    name="multiCombobox"
                    mode="multiple"
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
                        <MyComboboxTriggerLabel>
                          <span>{option.code}</span> -{" "}
                          <span>{option.label}</span>
                        </MyComboboxTriggerLabel>
                      </div>
                    )}
                  />

                  <FormVirtualComboboxAsync
                    name="virtualCombobox"
                    control={form.control}
                    label="Virtual Combobox"
                    placeholder="Select virtual combobox"
                    select={{ label: "title", value: "id" }}
                    {...catalogueProduct}
                  />

                  <FormVirtualComboboxAsync
                    name="virtualComboboxMulti"
                    control={form.control}
                    label="Virtual Combobox Multi"
                    placeholder="Select virtual combobox multi"
                    select={{ label: "title", value: "id" }}
                    mode="multiple"
                    {...catalogueProductMulti}
                  />

                  <FormTextArea
                    label="Textarea"
                    control={form.control}
                    name="textarea"
                    placeholder="Enter description"
                  />

                  <FormSlider
                    label="Slider"
                    control={form.control}
                    name="slider"
                  />

                  <FormCheckbox
                    containerProps={{
                      className: "inline-flex items-center gap-2",
                    }}
                    control={form.control}
                    name="checkbox"
                    description={<span>confirm checkbox to continue</span>}
                  />

                  <FormSwitch
                    containerProps={{
                      className: "inline-flex items-center gap-2",
                    }}
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
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit sticky top-4">
              <FormState />
            </div>
          </div>
        </Form>
      </div>
    </main>
  );
}
const FormState = () => {
  const form = useFormContext();

  const payload = useWatch({
    control: form.control,
  });

  return (
    <pre className="bg-neutral-200 p-4 rounded-md max-h-[500px]">
      {JSON.stringify(payload, null, 2)}
    </pre>
  );
};
