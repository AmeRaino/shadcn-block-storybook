import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { MyButton } from "../../../registry/block/base-component/my-button";
import { commonIcon } from "../../../registry/shared/common-icon";

/**
 * `MyButton` is a versatile button component that supports various styles, sizes, and effects.
 *
 * ## Features
 * - Multiple variants (default, outline, pill, secondary, ghost, link, etc.)
 * - Size options (default, sm, lg, icon, icon-sm, icon-lg)
 * - Special effects (expandIcon, ringHover, shine, underline, etc.)
 * - Icon support with left/right placement
 * - Loading state
 *
 * ## Installation
 * ```bash
 * npx shadcn@latest add my-button
 * ```
 *
 * ## Usage
 * ```tsx
 * import { MyButton } from '@/components/base-component/my-button';
 * import { commonIcon } from '@/shared/common-icon';
 *
 * // Basic usage
 * <MyButton>Click me</MyButton>
 *
 * // With icon
 * <MyButton icon={commonIcon.add}>
 *   With Icon
 * </MyButton>
 *
 * // With right-aligned icon
 * <MyButton
 *   icon={commonIcon.chevronRight}
 *   iconPlacement="right"
 * >
 *   Next
 * </MyButton>
 *
 * // Different variants
 * <MyButton variant="secondary">Secondary</MyButton>
 * <MyButton variant="outline">Outline</MyButton>
 * <MyButton variant="ghost">Ghost</MyButton>
 *
 * // With effects
 * <MyButton effect="shineHover">Shine on Hover</MyButton>
 * <MyButton effect="expandIcon" icon={commonIcon.add}>
 *   Expand Icon
 * </MyButton>
 *
 * // Loading state
 * <MyButton loading>Loading</MyButton>
 * ```
 */
const meta = {
  title: "Base Components/MyButton",
  component: MyButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "pill",
        "secondary",
        "secondary-outline",
        "secondary-pill",
        "gray",
        "gray-outline",
        "gray-pill",
        "ghost",
        "ghost-pill",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
    },
    effect: {
      control: "select",
      options: [
        "expandIcon",
        "ringHover",
        "shine",
        "shineHover",
        "gooeyRight",
        "gooeyLeft",
        "underline",
        "hoverUnderline",
        "secondary-underline",
        "secondary-hoverUnderline",
        "gradientSlideShow",
      ],
    },
    icon: {
      control: "select",
      options: [undefined, ...Object.keys(commonIcon)],
      mapping: { ...commonIcon },
    },
    iconPlacement: {
      control: "radio",
      options: ["left", "right"],
    },
    onClick: { action: "clicked" },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof MyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const WithIcon: Story = {
  args: {
    children: "With Icon",
    icon: commonIcon.add,
  },
};

export const RightIcon: Story = {
  args: {
    children: "Right Icon",
    icon: commonIcon.chevronRight,
    iconPlacement: "right",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Pill: Story = {
  args: {
    children: "Pill Button",
    variant: "pill",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

export const IconOnly: Story = {
  args: {
    icon: commonIcon.add,
    size: "icon",
    "aria-label": "Add",
  },
};

export const Loading: Story = {
  args: {
    children: "Loading",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const WithShineEffect: Story = {
  args: {
    children: "Shine Effect",
    effect: "shine",
  },
};

export const WithShineHoverEffect: Story = {
  args: {
    children: "Hover for Shine",
    effect: "shineHover",
  },
};

export const WithExpandIconEffect: Story = {
  args: {
    children: "Hover to Expand Icon",
    icon: commonIcon.add,
    effect: "expandIcon",
  },
};

export const ButtonGrid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <MyButton>Default</MyButton>
      <MyButton variant="secondary">Secondary</MyButton>
      <MyButton variant="outline">Outline</MyButton>
      <MyButton variant="pill">Pill</MyButton>
      <MyButton variant="ghost">Ghost</MyButton>
      <MyButton variant="link">Link</MyButton>
      <MyButton icon={commonIcon.add}>With Icon</MyButton>
      <MyButton icon={commonIcon.add} iconPlacement="right">
        Icon Right
      </MyButton>
      <MyButton effect="shineHover">Shine Effect</MyButton>
    </div>
  ),
};
