import CityDashboardContent from "./CityDashboardContent";

export function generateStaticParams() {
  return [
    { city: "dallas" },
    { city: "plano" },
    { city: "addison" },
  ];
}

export default function Page({ params }: { params: Promise<{ city: string }> }) {
  return <CityDashboardContent params={params} />;
}
