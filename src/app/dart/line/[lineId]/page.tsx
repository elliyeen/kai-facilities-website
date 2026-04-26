import LineDashboardContent from "./LineDashboardContent";

export function generateStaticParams() {
  return [
    { lineId: "red" },
    { lineId: "blue" },
    { lineId: "silver" },
  ];
}

export default function Page({ params }: { params: Promise<{ lineId: string }> }) {
  return <LineDashboardContent params={params} />;
}
