import { apiClient } from "@/lib/api-client";
import { LOCATIONS } from "@/data";
import { useAppStore } from "@/store";

/**
 * The backend persists a logged-in user's saved-places plan via
 * /users/me/plan (locationId references the seeded Location table, whose
 * ids match the slugs used in frontend/src/data/index.ts). Before this,
 * "Rejaga qo'sh" only ever touched local Zustand storage, so a saved plan
 * never followed a user across devices. These helpers keep both sides in
 * sync without changing how the UI renders locations (still from LOCATIONS).
 */

interface PlanResponse {
  plan: { id: string }[];
}

// Called once after login/register/checkAuth succeeds: merges the
// server-side plan with whatever the guest had already saved locally,
// then pushes any local-only items up so nothing is lost either way.
export async function mergePlanOnLogin(): Promise<void> {
  const { plan: localPlan } = useAppStore.getState();

  let serverIds: string[] = [];
  try {
    const res = await apiClient.get<PlanResponse>("/users/me/plan");
    serverIds = res.plan.map((l) => l.id);
  } catch {
    return; // offline or backend hiccup — keep local plan as-is
  }

  const localIds = new Set(localPlan.map((l) => l.id));
  const merged = new Set([...localIds, ...serverIds]);

  const mergedLocations = LOCATIONS.filter((l) => merged.has(l.id));
  useAppStore.setState({ plan: mergedLocations });

  const missingOnServer = [...localIds].filter((id) => !serverIds.includes(id));
  await Promise.all(
    missingOnServer.map((locationId) =>
      apiClient.post("/users/me/plan", { locationId }).catch(() => {})
    )
  );
}

export function syncAddToPlan(locationId: string): void {
  if (!useAppStore.getState().isLoggedIn) return;
  apiClient.post("/users/me/plan", { locationId }).catch(() => {});
}

export function syncRemoveFromPlan(locationId: string): void {
  if (!useAppStore.getState().isLoggedIn) return;
  apiClient.delete(`/users/me/plan/${locationId}`).catch(() => {});
}
