import type { Meta, StoryObj } from "@storybook/react";

import { MyIconfy } from "../../../registry/block/base-component/my-icon";
import { commonIcon } from "../../../registry/shared/common-icon";

/**
 * `MyIconfy` is a versatile icon component that wraps around the Iconify library.
 *
 * ## Features
 * - Size variants (sm, md, lg)
 * - Color variants (primary, secondary, white, danger)
 * - Supports all Iconify icons
 *
 * ## Installation
 * ```bash
 * npx shadcn@latest add my-icon
 * ```
 *
 * ## Usage
 * ```tsx
 * import { MyIconfy } from '@/components/base-component/my-icon';
 * import { commonIcon } from '@/shared/common-icon';
 *
 * // Basic usage
 * <MyIconfy icon={commonIcon.sparkles} />
 *
 * // With size and color variants
 * <MyIconfy
 *   icon={commonIcon.sparkles}
 *   size="lg"
 *   variant="primary"
 * />
 *
 * // You can also use any icon from Iconify directly:
 * <MyIconfy icon="lucide:sparkles" />
 * ```
 *
 * ## Icon Management
 *
 * ### Using Common Icons
 * For consistency and reusability, we maintain a collection of commonly used icons in `@/shared/common-icon.tsx`.
 * Always check this file first before adding a new icon to your component.
 *
 * If you find yourself using the same icon repeatedly across multiple components:
 * 1. Add it to the `common-icon.tsx` file
 * 2. Use it via the `commonIcon` object
 *
 * ### Finding New Icons
 * If you need an icon that's not in the common icons collection:
 * 1. Visit [Iconify Icon Sets](https://icon-sets.iconify.design/)
 * 2. Browse or search for the icon you need
 * 3. Copy the icon name (e.g., `lucide:home` or `mdi:account`)
 * 4. Use it directly in the `icon` prop: `<MyIconfy icon="lucide:home" />`
 *
 * ### VSCode Extension
 * For a better development experience, install the **Iconify IntelliSense** extension for VSCode:
 * - This extension provides inline previews of icons as you type
 * - Shows a visual picker for icons
 * - Makes it easier to find and use the right icons
 *
 * [Get Iconify IntelliSense on VS Marketplace](https://marketplace.visualstudio.com/items?itemName=antfu.iconify)
 */
const meta = {
  title: "Base Components/MyIconfy",
  component: MyIconfy,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "white", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    icon: {
      control: {
        type: "text",
      },
      description:
        'Enter an icon name (e.g., "lucide:home") or select from common icons',
      options: ["", ...Object.keys(commonIcon)],
      mapping: {
        "": "",
        ...commonIcon,
      },
      table: {
        type: { summary: "string | CommonIcon" },
      },
    },
  },
} satisfies Meta<typeof MyIconfy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: commonIcon.sparkles,
  },
};

export const Primary: Story = {
  args: {
    icon: commonIcon.sparkles,
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    icon: commonIcon.sparkles,
    variant: "secondary",
  },
};

export const Danger: Story = {
  args: {
    icon: commonIcon.circleAlert,
    variant: "danger",
  },
};

export const Small: Story = {
  args: {
    icon: commonIcon.sparkles,
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    icon: commonIcon.sparkles,
    size: "md",
  },
};

export const Large: Story = {
  args: {
    icon: commonIcon.sparkles,
    size: "lg",
  },
};

export const IconGallery: Story = {
  args: {
    icon: commonIcon.sparkles,
  },
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {Object.entries(commonIcon).map(([name, icon]) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 p-4 border rounded"
        >
          <MyIconfy icon={icon} size="lg" />
          <span className="text-xs text-gray-500">{name}</span>
        </div>
      ))}
    </div>
  ),
};
