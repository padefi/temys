import { Slot } from "@radix-ui/react-slot";
import * as Stepperize from "@stepperize/react";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";

const StepperContext = React.createContext<Stepper.ConfigProps | null>(null);

const useStepperProvider = (): Stepper.ConfigProps => {
  const context = React.useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider.");
  }
  return context;
};

const defineStepper = <const Steps extends Stepperize.Step[]>(
  ...steps: Steps
) => {
  const { Scoped, useStepper, ...rest } = Stepperize.defineStepper(...steps);

  // En Stepperize v6, rest.steps suele ser array de "step records" => { data, status, metadata... }
  type StepRecord = (typeof rest.steps)[number];
  const getId = (sr: StepRecord) => String((sr as any).data?.id ?? (sr as any).id);

  const StepperContainer = ({
    children,
    className,
    ...props
  }: Omit<React.ComponentProps<"div">, "children"> & {
    children:
      | React.ReactNode
      | ((props: { methods: ReturnType<typeof useStepper> }) => React.ReactNode);
  }) => {
    const methods = useStepper();

    return (
      <div data-component="stepper" className={cn("w-full", className)} {...props}>
        {typeof children === "function" ? children({ methods }) : children}
      </div>
    );
  };

  const getIndexById = (id: string) => rest.steps.findIndex((s) => getId(s) === String(id));

  const getNextStep = (id: string) => {
    const idx = getIndexById(id);
    if (idx < 0) return undefined;
    const next = rest.steps[idx + 1];
    return next ? (next as any).data ?? next : undefined;
  };

  const getPrevStep = (id: string) => {
    const idx = getIndexById(id);
    if (idx < 0) return undefined;
    const prev = rest.steps[idx - 1];
    return prev ? (prev as any).data ?? prev : undefined;
  };

  const StepComp = ({
    children,
    className,
    icon,
    of,
    ...buttonProps
  }: Omit<React.ComponentProps<"button">, "children"> & {
    of: Stepperize.Get.Id<Steps>;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
  }) => {
    const { variant, labelOrientation } = useStepperProvider();
    const stepper = useStepper();

    const currentId = String((stepper.state.current as any).data?.id ?? (stepper.state.current as any).id);
    const stepIndex = getIndexById(String(of));
    const currentIndex = getIndexById(currentId);

    if (stepIndex < 0 || currentIndex < 0) return null;

    const stepsArr = rest.steps;
    const lastId = stepsArr.length ? getId(stepsArr[stepsArr.length - 1]) : "";

    const isLast = lastId === String(of);
    const isActive = currentId === String(of);

    const dataState = getStepState(currentIndex, stepIndex);
    const childMap = useStepChildren(children);

    const title = childMap.get("title");
    const description = childMap.get("description");
    const panel = childMap.get("panel");

    if (variant === "circle") {
      return (
        <li
          data-component="stepper-step"
          className={cn("flex shrink-0 items-center gap-4 rounded-md transition-colors", className)}
        >
          <CircleStepIndicator currentStep={stepIndex + 1} totalSteps={stepsArr.length} />
          <div data-component="stepper-step-content" className="flex flex-col items-start gap-1">
            {title}
            {description}
          </div>
        </li>
      );
    }

    const nextStep = getNextStep(String(of));
    const prevStep = getPrevStep(String(of));

    return (
      <>
        <li
          data-component="stepper-step"
          className={cn(
            "group peer relative flex items-center gap-2",
            "data-[variant=vertical]:flex-row",
            "data-[label-orientation=vertical]:w-full",
            "data-[label-orientation=vertical]:flex-col",
            "data-[label-orientation=vertical]:justify-center",
            className
          )}
          data-variant={variant}
          data-label-orientation={labelOrientation}
          data-state={dataState}
          data-disabled={buttonProps.disabled}
        >
          <Button
            id={`step-${String(of)}`}
            data-component="stepper-step-indicator"
            type="button"
            role="tab"
            tabIndex={dataState !== "inactive" ? 0 : -1}
            className="rounded-full"
            variant={dataState !== "inactive" ? "default" : "secondary"}
            size="icon"
            aria-controls={`step-panel-${String(of)}`}
            aria-current={isActive ? "step" : undefined}
            aria-posinset={stepIndex + 1}
            aria-setsize={stepsArr.length}
            aria-selected={isActive}
            onKeyDown={(e) => onStepKeyDown(e, nextStep, prevStep)}
            {...buttonProps}
          >
            {icon ?? stepIndex + 1}
          </Button>

          {variant === "horizontal" && labelOrientation === "vertical" && (
            <StepperSeparator
              orientation="horizontal"
              labelOrientation={labelOrientation}
              isLast={isLast}
              state={dataState}
              disabled={buttonProps.disabled}
            />
          )}

          <div data-component="stepper-step-content" className="flex flex-col items-start">
            {title}
            {description}
          </div>
        </li>

        {variant === "horizontal" && labelOrientation === "horizontal" && (
          <StepperSeparator
            orientation="horizontal"
            isLast={isLast}
            state={dataState}
            disabled={buttonProps.disabled}
          />
        )}

        {variant === "vertical" && (
          <div className="flex gap-4">
            {!isLast && (
              <div className="flex justify-center ps-[calc(var(--spacing)_*_4.5_-_1px)]">
                <StepperSeparator
                  orientation="vertical"
                  isLast={isLast}
                  state={dataState}
                  disabled={buttonProps.disabled}
                />
              </div>
            )}
            <div className="my-3 flex-1 ps-4">{panel}</div>
          </div>
        )}
      </>
    );
  };

  return {
    ...rest,
    useStepper,
    Stepper: {
      Provider: ({
        variant = "horizontal",
        labelOrientation = "horizontal",
        tracking = false,
        children,
        className,
        initialStep,
        initialMetadata,
        ...divProps
      }: any) => {
        return (
          <StepperContext.Provider value={{ variant, labelOrientation, tracking }}>
            <Scoped initialStep={initialStep} initialMetadata={initialMetadata}>
              <StepperContainer className={className} {...divProps}>
                {children}
              </StepperContainer>
            </Scoped>
          </StepperContext.Provider>
        );
      },

      Navigation: ({ children, "aria-label": ariaLabel = "Stepper Navigation", ...props }: any) => {
        const { variant } = useStepperProvider();
        return (
          <nav data-component="stepper-navigation" aria-label={ariaLabel} role="tablist" {...props}>
            <ol
              data-component="stepper-navigation-list"
              className={classForNavigationList({ variant })}
            >
              {children}
            </ol>
          </nav>
        );
      },

      Step: StepComp,

      Title,
      Description,

      Panel: ({ children, asChild, ...props }: any) => {
        const Comp = asChild ? Slot : "div";
        const { tracking } = useStepperProvider();

        return (
          <Comp
            data-component="stepper-step-panel"
            ref={(node: HTMLDivElement | null) => scrollIntoStepperPanel(node, tracking)}
            {...props}
          >
            {children}
          </Comp>
        );
      },

      Controls: ({ children, className, asChild, ...props }: any) => {
        const Comp = asChild ? Slot : "div";
        return (
          <Comp
            data-component="stepper-controls"
            className={cn("flex justify-end gap-4", className)}
            {...props}
          >
            {children}
          </Comp>
        );
      },
    },
  } as const;
};

const Title = ({
  children,
  className,
  asChild,
  ...props
}: React.ComponentProps<"h4"> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : "h4";
  return (
    <Comp
      data-component="stepper-step-title"
      className={cn("text-base font-medium", className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

const Description = ({
  children,
  className,
  asChild,
  ...props
}: React.ComponentProps<"p"> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : "p";
  return (
    <Comp
      data-component="stepper-step-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

const StepperSeparator = ({
  orientation,
  isLast,
  labelOrientation,
  state,
  disabled,
}: {
  isLast: boolean;
  state: string;
  disabled?: boolean;
} & VariantProps<typeof classForSeparator>) => {
  if (isLast) return null;
  return (
    <div
      data-component="stepper-separator"
      data-orientation={orientation}
      data-state={state}
      data-disabled={disabled}
      role="separator"
      tabIndex={-1}
      className={classForSeparator({ orientation, labelOrientation })}
    />
  );
};

const CircleStepIndicator = ({
  currentStep,
  totalSteps,
  size = 80,
  strokeWidth = 6,
}: Stepper.CircleStepIndicatorProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const fillPercentage = (currentStep / totalSteps) * 100;
  const dashOffset = circumference - (circumference * fillPercentage) / 100;

  return (
    <div
      data-component="stepper-step-indicator"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      tabIndex={-1}
      className="relative inline-flex items-center justify-center"
    >
      <svg width={size} height={size}>
        <title>Step Indicator</title>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-foreground"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="text-primary transition-all duration-300 ease-in-out"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium" aria-live="polite">
          {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
};

const classForNavigationList = cva("flex gap-2", {
  variants: {
    variant: {
      horizontal: "flex-row items-center justify-between",
      vertical: "flex-col",
      circle: "flex-row items-center justify-between",
    },
  },
});

const classForSeparator = cva(
  [
    "bg-muted",
    "data-[state=completed]:bg-primary data-[disabled]:opacity-50",
    "transition-all duration-300 ease-in-out",
  ],
  {
    variants: {
      orientation: {
        horizontal: "h-0.5 flex-1",
        vertical: "h-full w-0.5",
      },
      labelOrientation: {
        vertical:
          "absolute left-[calc(50%+30px)] right-[calc(-50%+20px)] top-5 block shrink-0",
      },
    },
  }
);

function scrollIntoStepperPanel(node: HTMLDivElement | null, tracking?: boolean) {
  if (tracking) node?.scrollIntoView({ behavior: "smooth", block: "center" });
}

const useStepChildren = (children: React.ReactNode) => {
  return React.useMemo(() => extractChildren(children), [children]);
};

const extractChildren = (children: React.ReactNode) => {
  const childrenArray = React.Children.toArray(children);
  const map = new Map<string, React.ReactNode>();

  for (const child of childrenArray) {
    if (React.isValidElement(child)) {
      if (child.type === Title) map.set("title", child);
      else if (child.type === Description) map.set("description", child);
      else map.set("panel", child);
    }
  }

  return map;
};

const onStepKeyDown = (
  e: React.KeyboardEvent<HTMLButtonElement>,
  nextStep?: Stepperize.Step,
  prevStep?: Stepperize.Step
) => {
  const { key } = e;
  const directions = {
    next: ["ArrowRight", "ArrowDown"],
    prev: ["ArrowLeft", "ArrowUp"],
  };

  if (directions.next.includes(key) || directions.prev.includes(key)) {
    const direction = directions.next.includes(key) ? "next" : "prev";
    const step = direction === "next" ? nextStep : prevStep;
    if (!step) return;

    const stepElement = document.getElementById(`step-${step.id}`);
    if (!stepElement) return;

    const isActive = stepElement.parentElement?.getAttribute("data-state") !== "inactive";
    if (isActive || direction === "prev") stepElement.focus();
  }
};

const getStepState = (currentIndex: number, stepIndex: number) => {
  if (currentIndex === stepIndex) return "active";
  if (currentIndex > stepIndex) return "completed";
  return "inactive";
};

namespace Stepper {
  export type StepperVariant = "horizontal" | "vertical" | "circle";
  export type StepperLabelOrientation = "horizontal" | "vertical";

  export type ConfigProps = {
    variant?: StepperVariant;
    labelOrientation?: StepperLabelOrientation;
    tracking?: boolean;
  };

  export type CircleStepIndicatorProps = {
    currentStep: number;
    totalSteps: number;
    size?: number;
    strokeWidth?: number;
  };
}

export { defineStepper };