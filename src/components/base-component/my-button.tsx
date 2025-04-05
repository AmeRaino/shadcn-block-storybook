import { cn } from "@/lib/utils";
import { commonIcon } from "@/shared/common-icon";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { MyIconfy } from "./my-icon";

const MyButtonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-primary text-primary bg-background hover:bg-primary hover:text-primary-foreground",
        pill: "rounded-3xl bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary/60",
        "secondary-outline":
          "bg-secondary-foreground border border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground focus-visible:ring-secondary/60",
        "secondary-pill":
          "rounded-3xl bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary/80",
        gray: "bg-[#F7F7F8] text-[#5D5E6C] hover:bg-neutral-200 focus-visible:ring-muted/60",
        "gray-outline":
          "bg-[#F7F7F8] text-[#5D5E6C] border border-[#EEEEF0] hover:bg-[#5D5E6C] hover:text-white focus-visible:ring-muted/60",
        "gray-pill":
          "rounded-3xl bg-[#F7F7F8] text-[#5D5E6C] hover:bg-neutral-200 focus-visible:ring-muted/60",
        ghost:
          "hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent/80",
        "ghost-pill":
          "rounded-3xl hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent/80",
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-accent/80",
      },
      effect: {
        expandIcon: "group gap-0 relative",
        ringHover:
          "transition-all duration-300 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
        shine:
          "before:animate-shine relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-no-repeat background-position_0s_ease",
        shineHover:
          "relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] before:duration-1000",
        gooeyRight:
          "relative z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r from-white/40 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%]",
        gooeyLeft:
          "relative z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-white/40 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%]",
        underline:
          "relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
        hoverUnderline:
          "relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
        "secondary-underline":
          "relative !no-underline after:absolute after:bg-secondary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
        "secondary-hoverUnderline":
          "relative !no-underline after:absolute after:bg-secondary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
        gradientSlideShow:
          "bg-[size:400%] bg-[linear-gradient(-45deg,var(--gradient-lime),var(--gradient-ocean),var(--gradient-wine),var(--gradient-rust))] animate-gradient-flow",
      },
      size: {
        default: "px-5 py-2.5 [&>svg]:size-4.5",
        sm: "px-3 py-2",
        lg: "px-5 py-3 [&>svg]:size-5 text-base",
        icon: "p-3",
        "icon-sm": "p-2.5 [&>svg]:size-3",
        "icon-lg": "p-3.5 [&>svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type TIconProps = {
  icon: keyof typeof commonIcon | React.ReactNode;
  iconPlacement?: "left" | "right";
};

type TIconRefProps = {
  icon?: never;
  iconPlacement?: undefined;
};

export type ButtonIconProps = TIconProps | TIconRefProps;

function MyButton({
  className,
  variant,
  effect,
  size,
  icon: Icon,
  iconPlacement = "left",
  disabled = false,
  loading = false,
  type = "button",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  ButtonIconProps &
  VariantProps<typeof MyButtonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      type={type}
      className={cn(MyButtonVariants({ variant, effect, size, className }))}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <MyIconfy icon={commonIcon.loader} className="size-4.5 animate-spin" />
      )}
      {!loading &&
        Icon &&
        iconPlacement === "left" &&
        (effect === "expandIcon" ? (
          <div className="w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-100 group-hover:pr-2 group-hover:opacity-100">
            {typeof Icon === "string" ? <MyIconfy icon={Icon} /> : Icon}
          </div>
        ) : typeof Icon === "string" ? (
          <MyIconfy icon={Icon} />
        ) : (
          Icon
        ))}
      <Slottable>{props.children}</Slottable>
      {Icon &&
        iconPlacement === "right" &&
        (effect === "expandIcon" ? (
          <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
            {typeof Icon === "string" ? <MyIconfy icon={Icon} /> : Icon}
          </div>
        ) : typeof Icon === "string" ? (
          <MyIconfy icon={Icon} />
        ) : (
          Icon
        ))}
    </Comp>
  );
}

MyButton.displayName = "MyButton";

export { MyButton, MyButtonVariants };
