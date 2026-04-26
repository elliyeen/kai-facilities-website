import StationDetailContent from "./StationDetailContent";

export function generateStaticParams() {
  return [
    { id: "mockingbird" },
    { id: "downtown-plano" },
    { id: "addison" },
  ];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <StationDetailContent params={params} />;
}
