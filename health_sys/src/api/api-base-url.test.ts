import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchNearbyShops } from "./shops";
import { sendAgentTextChat } from "./agent";

describe("API base URL", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("keeps local relative API URLs when no deployed backend URL is configured", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ shops: [] }), {
        headers: { "Content-Type": "application/json" },
        status: 200
      })
    );

    await fetchNearbyShops({ latitude: 22.3468, longitude: 113.5805 });

    expect(fetchMock).toHaveBeenCalledWith("/api/nearby-shops?lat=22.3468&lng=113.5805");
  });

  it("uses VITE_API_BASE_URL for deployed backend requests", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://huoshanbei-api.onrender.com/");
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ answer: "ok" }), {
        headers: { "Content-Type": "application/json" },
        status: 200
      })
    );

    await sendAgentTextChat({ message: "hello" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://huoshanbei-api.onrender.com/api/chat",
      expect.objectContaining({
        body: JSON.stringify({ message: "hello" }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      })
    );
  });
});
