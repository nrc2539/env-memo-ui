/// <reference types="vitest/globals" />
import "@testing-library/jest-dom/vitest";
import { server } from "./mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
