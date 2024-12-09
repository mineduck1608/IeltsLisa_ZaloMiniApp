import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { informationAtom } from "@/state";
import InformationGrid from "@/components/information-grid";

export interface RelatedInformationsProps {
  currentInformationId: string | undefined;
}

export default function RelatedInformation(props: RelatedInformationsProps) {
  const products = useAtomValue(informationAtom);
  const otherProducts = useMemo(
    () => products.filter((product) => product.infoId !== props.currentInformationId),
    [products, props.currentInformationId]
  );

  return <InformationGrid replace informations={otherProducts} />;
}
