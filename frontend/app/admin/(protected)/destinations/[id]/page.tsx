"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DestinationForm } from "@/components/admin/DestinationForm";
import { getResource } from "@/lib/adminApi";
import type { Destination } from "@/lib/types";

export default function EditDestinationPage() {
  const params = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getResource<Destination>("destinations", params.id)
      .then(setDestination)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."));
  }, [params.id]);

  return (
    <div>
      <AdminPageHeader
        title={destination ? `Edit ${destination.name}` : "Edit destination"}
        subtitle="Changes go live on the public site as soon as you save."
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {destination ? <DestinationForm destination={destination} /> : !error ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : null}
    </div>
  );
}
