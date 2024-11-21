import Tabs from "./tabs";
import Section from "./section";
import HorizontalDivider from "./horizontal-divider";
import Carousel from "./carousel";
import { ChevronDown } from "./vectors";

export function PageSkeleton() {
  return (
    <div className="min-h-full bg-section">
      <div className="bg-background pt-2">
        <div className="px-4">
          <div className="w-full h-12 rounded-lg bg-skeleton animate-pulse" />
        </div>
        <Carousel
          slides={[1, 2, 3].map(() => (
            <div className="w-full aspect-video rounded-lg bg-skeleton animate-pulse" />
          ))}
          disabled
        />
      </div>
      <div className="bg-background space-y-2 mt-2">
        <Tabs
          items={[1, 2, 3, 4]}
          value={undefined}
          onChange={() => {}}
          renderLabel={(key) => (
            <div
              key={key}
              className="h-6 w-10 rounded-lg bg-skeleton animate-pulse"
            />
          )}
        />

        <Section
          title={
            <div className="h-[18px] w-36 rounded-lg bg-skeleton animate-pulse" />
          }
        >
          <div className="pt-2.5 pb-4 flex space-x-6 overflow-x-auto px-4">
            {[1, 2, 3, 4].map((key) => (
              <div
                key={key}
                className="flex flex-col items-center space-y-2 flex-none basis-[70px] overflow-hidden cursor-pointer"
              >
                <div className="w-[70px] h-[70px] object-cover rounded-full border-[0.5px] border-black/15 bg-skeleton animate-pulse" />
                <div className="w-full h-9">
                  <div className="w-full h-[18px] rounded-lg bg-skeleton animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
      <HorizontalDivider />
      <Section
        title={
          <div className="h-[18px] w-20 rounded-lg bg-skeleton animate-pulse" />
        }
      >
        <div className="grid grid-cols-2 px-4 py-2 gap-4">
          {[1, 2, 3, 4].map((key) => (
            <ProductItemSkeleton key={key} />
          ))}
        </div>
      </Section>
    </div>
  );
}

export function ProductItemSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="w-full aspect-square bg-skeleton animate-pulse rounded-t-lg" />
      <div className="py-2 space-y-0.5">
        <div className="h-[14px] w-1/5 bg-skeleton animate-pulse rounded-lg" />
        <div className="h-9 bg-skeleton animate-pulse rounded-lg" />
        <div className="h-[18px] w-1/2 bg-skeleton animate-pulse rounded-lg" />
        <div className="h-[14px] w-1/3 bg-skeleton animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

export function SelectSkeleton(props: { width: number }) {
  return (
    <div
      className="h-8 rounded-full bg-skeleton animate-pulse px-3 flex items-center justify-end"
      style={{ width: props.width }}
    >
      <ChevronDown />
    </div>
  );
}
